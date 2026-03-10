/**
 * Normalizes a photo blob URL for AI hair synthesis:
 * - Adds 20% top padding by expanding the canvas upward (black fill)
 * - Original image drawn at full size below the padding
 * - Full body is preserved so outfit AI can detect body pose afterward
 * - Downscales only if longest side exceeds MAX_DIMENSION
 */
const MAX_DIMENSION = 1024;

export async function normalizePhotoForAI(blobUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;

      // Downscale if either dimension exceeds MAX_DIMENSION
      const ratio = Math.min(1, MAX_DIMENSION / Math.max(origW, origH));
      const drawW = Math.round(origW * ratio);
      const drawH = Math.round(origH * ratio);

      // Canvas is taller by 20% to give room above the head for new hair
      const topPad = Math.round(drawH * 0.20);
      const W = drawW;
      const H = drawH + topPad;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas context unavailable")); return; }

      // Black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Draw original image at full scaled size, starting after top padding
      ctx.drawImage(img, 0, topPad, drawW, drawH);

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = reject;
    img.src = blobUrl;
  });
}

export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${url}`));
    image.src = url;
  });
}

export async function compositeBackground(
  personPngUrl: string,
  backgroundUrl: string,
  watermark = "demo"
): Promise<string> {
  const [background, person] = await Promise.all([
    loadImage(backgroundUrl),
    loadImage(personPngUrl)
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create canvas context.");
  }

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  const personWidth = 720;
  const personHeight = Math.round((person.height / person.width) * personWidth);
  const x = Math.round((canvas.width - personWidth) / 2);
  const y = Math.max(0, canvas.height - personHeight - 32);

  ctx.drawImage(person, x, y, personWidth, personHeight);

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(watermark, canvas.width - 24, canvas.height - 24);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to export composite image."));
        return;
      }

      resolve(URL.createObjectURL(blob));
    }, "image/jpeg", 0.92);
  });
}

export async function compositeMultipleBackgrounds(
  personPngUrl: string,
  backgroundUrls: string[],
  watermark?: string
): Promise<string[]> {
  return Promise.all(
    backgroundUrls.map((backgroundUrl) =>
      compositeBackground(personPngUrl, backgroundUrl, watermark)
    )
  );
}

