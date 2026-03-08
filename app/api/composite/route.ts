import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export const maxDuration = 10;

function sanitizeBackgroundPath(bgPath: string): string | null {
  // Only allow /backgrounds/*.png or .webp — no traversal
  if (!/^\/backgrounds\/[\w\-]+\.(png|webp)$/.test(bgPath)) return null;
  return bgPath;
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
    const bgBuffer = await readFile(bgFilePath);
    const bgMeta = await sharp(bgBuffer).metadata();
    const BG_W = bgMeta.width ?? 1024;
    const BG_H = bgMeta.height ?? 1024;

    // Fetch transparent person PNG from Replicate CDN
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

    const composited = await sharp(bgBuffer)
      .composite([{ input: resizedPerson, left, top }])
      .jpeg({ quality: 90 })
      .toBuffer();

    return new NextResponse(composited.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[composite]", err);
    return NextResponse.json({ error: "Composite failed" }, { status: 500 });
  }
}
