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

  if (!imageUrl.startsWith("https://")) {
    return new Response("Invalid url", { status: 400 });
  }

  // Only allow Replicate delivery domains
  const allowed = ["replicate.delivery", "pbxt.replicate.delivery", "replicate.com"];
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

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="kstyleshot-hair.${ext}"`,
      "Cache-Control": "no-store",
    },
  });
}
