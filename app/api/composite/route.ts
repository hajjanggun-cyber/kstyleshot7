import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

import {
  uploadToReplicateFiles,
  startFluxKontextJob,
  ReplicateApiError,
} from "@/lib/replicate";

export const maxDuration = 20;

const FLUX_PROMPT =
  "Professional location photograph. Do not change the person's face, hair, or outfit in any way. " +
  "Only adjust the lighting and atmosphere: " +
  "match the ambient light color and direction to the background scene, " +
  "add a soft natural ground shadow beneath the person's feet, " +
  "blend the person's skin and clothing tone to match the environment's color temperature. " +
  "The result should look like a real photo taken on location with a professional camera. " +
  "Keep all facial features, expressions, and clothing exactly identical to the input.";

function sanitizeBackgroundPath(bgPath: string): string | null {
  if (!/^\/backgrounds\/[\w\-]+\.(png|webp)$/.test(bgPath)) return null;
  return bgPath;
}

/**
 * Sample the average RGB of the background in the person placement area,
 * then apply a subtle color tint overlay to the person to match the scene's
 * ambient color temperature (~14% opacity).
 */
async function applyColorTemperature(
  personBuffer: Buffer,
  bgBuffer: Buffer,
  regionTop: number,
  BG_W: number,
  BG_H: number,
): Promise<Buffer> {
  const regionH = Math.max(1, BG_H - regionTop);
  const stats = await sharp(bgBuffer)
    .extract({ left: 0, top: regionTop, width: BG_W, height: regionH })
    .stats();

  const r = Math.round(stats.channels[0].mean);
  const g = Math.round(stats.channels[1].mean);
  const b = Math.round(stats.channels[2].mean);

  const meta = await sharp(personBuffer).metadata();
  const W = meta.width ?? 512;
  const H = meta.height ?? 768;

  // Solid color overlay at ~14% opacity — matches ambient color cast
  const overlay = await sharp({
    create: { width: W, height: H, channels: 4, background: { r, g, b, alpha: 36 } },
  })
    .png()
    .toBuffer();

  return sharp(personBuffer)
    .composite([{ input: overlay, blend: "over" }])
    .png()
    .toBuffer();
}

/** Creates a blurred ellipse shadow buffer for ground contact shadow */
async function makeGroundShadow(width: number, height: number): Promise<Buffer> {
  const shadowW = Math.round(width * 0.7);
  const shadowH = Math.round(shadowW * 0.18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${shadowW}" height="${shadowH}">
    <ellipse cx="${shadowW / 2}" cy="${shadowH / 2}" rx="${shadowW / 2}" ry="${shadowH / 2}" fill="rgba(0,0,0,0.38)"/>
  </svg>`;
  return sharp(Buffer.from(svg))
    .blur(shadowH * 0.6)
    .png()
    .toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      personUrl?: unknown;
      backgroundPath?: unknown;
    };

    const { personUrl, backgroundPath } = body;

    if (typeof personUrl !== "string" || !personUrl) {
      return NextResponse.json({ error: "Missing personUrl" }, { status: 400 });
    }
    if (typeof backgroundPath !== "string" || !backgroundPath) {
      return NextResponse.json({ error: "Missing backgroundPath" }, { status: 400 });
    }

    const safeBgPath = sanitizeBackgroundPath(backgroundPath);
    if (!safeBgPath) {
      return NextResponse.json({ error: "Invalid backgroundPath" }, { status: 400 });
    }

    // Load background from local filesystem
    const bgFilePath = join(process.cwd(), "public", safeBgPath);
    const bgRaw = await readFile(bgFilePath);
    const bgMeta = await sharp(bgRaw).metadata();
    const BG_W = bgMeta.width ?? 1024;
    const BG_H = bgMeta.height ?? 1024;

    // Subtle background blur — depth-of-field / bokeh effect (sigma 3)
    const bgBuffer = await sharp(bgRaw).blur(3).toBuffer();

    // Fetch transparent person PNG
    const personRes = await fetch(personUrl, { cache: "no-store" });
    if (!personRes.ok) {
      return NextResponse.json({ error: "Failed to fetch person image" }, { status: 502 });
    }
    const personBuffer = Buffer.from(await personRes.arrayBuffer());
    const personMeta = await sharp(personBuffer).metadata();
    const P_W = personMeta.width ?? 512;
    const P_H = personMeta.height ?? 768;

    // Scale person to 80% of background height, keep aspect ratio
    const targetH = Math.round(BG_H * 0.80);
    const targetW = Math.round((P_W / P_H) * targetH);

    const resizedPerson = await sharp(personBuffer)
      .resize(targetW, targetH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    // Center horizontally, bottom-align
    const left = Math.max(0, Math.round((BG_W - targetW) / 2));
    const top = Math.max(0, BG_H - targetH);

    // Apply background color temperature to person layer
    const tintedPerson = await applyColorTemperature(resizedPerson, bgBuffer, top, BG_W, BG_H);

    // Ground contact shadow — placed just above the bottom edge
    const shadowBuf = await makeGroundShadow(targetW, targetH);
    const shadowW = Math.round(targetW * 0.7);
    const shadowH = Math.round(shadowW * 0.18);
    const shadowLeft = left + Math.round((targetW - shadowW) / 2);
    const shadowTop = Math.min(BG_H - shadowH, top + targetH - Math.round(shadowH * 0.6));

    const composited = await sharp(bgBuffer)
      .composite([
        { input: shadowBuf, left: shadowLeft, top: shadowTop },
        { input: tintedPerson, left, top },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload composite to Replicate Files → get public URL
    const compositeFileUrl = await uploadToReplicateFiles(composited, "image/jpeg");

    // Start flux-kontext-dev to blend lighting naturally
    const predictionId = await startFluxKontextJob(compositeFileUrl, FLUX_PROMPT);

    return NextResponse.json({ predictionId });
  } catch (err) {
    if (err instanceof ReplicateApiError) {
      console.error("[composite] Replicate error:", err.status, err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[composite]", err);
    return NextResponse.json({ error: "Composite failed" }, { status: 500 });
  }
}
