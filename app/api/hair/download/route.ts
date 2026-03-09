/**
 * Proxies a Replicate output image so the browser can trigger a native download
 * without hitting CORS restrictions on the external CDN URL.
 *
 * GET /api/hair/download?url=<encoded_replicate_url>
 */
export const maxDuration = 15;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url") ?? "";
  const customFilename = searchParams.get("filename")?.replace(/[^a-zA-Z0-9.\-_]/g, "") ?? "";

  if (!imageUrl.startsWith("https://")) {
    return new Response("Invalid url", { status: 400 });
  }

  // Allow Replicate and fal.ai CDN domains
  const allowed = ["replicate.delivery", "pbxt.replicate.delivery", "replicate.com", "cdn.fashn.ai", "fal.media", "v3.fal.media"];
  const hostname = new URL(imageUrl).hostname;
  if (!allowed.some((d) => hostname.endsWith(d))) {
    return new Response("Forbidden", { status: 403 });
  }

  const upstream = await fetch(imageUrl).catch(() => null);
  if (!upstream || !upstream.ok) {
    return new Response("Failed to fetch image", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpg";
  const filename = customFilename || `kstyleshot-hair.${ext}`;

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
