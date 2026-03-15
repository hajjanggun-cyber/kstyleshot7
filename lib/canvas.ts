/**
 * Normalizes a photo blob URL for AI hair synthesis:
 * - Scales down so the longest side does not exceed MAX_DIMENSION
 * - Crops to 4:5 portrait ratio, anchored at the top (preserves face/upper-body area)
 * - If the scaled image is shorter than 4:5, fills the bottom with black (never the top)
 * - No artificial top padding — adding black above the face was pushing the head down
 */
const MAX_DIMENSION = 768;

export async function normalizePhotoForAI(blobUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;

      // Scale so longest side = MAX_DIMENSION
      const scale = Math.min(1, MAX_DIMENSION / Math.max(origW, origH));
      const scaledW = Math.round(origW * scale);
      const scaledH = Math.round(origH * scale);

      // Target canvas: 4:5 portrait
      const targetW = scaledW;
      const targetH = Math.round(targetW * 1.25);

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas context unavailable")); return; }

      // Black background (covers bottom fill when image is too short)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, targetW, targetH);

      if (scaledH >= targetH) {
        // Image taller than 4:5: top-crop — keep the face/upper-body region
        const srcH = Math.round(targetH / scale);
        ctx.drawImage(img, 0, 0, origW, Math.min(srcH, origH), 0, 0, targetW, targetH);
      } else {
        // Image shorter than 4:5: draw at top, black fills bottom
        ctx.drawImage(img, 0, 0, targetW, scaledH);
      }

      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = blobUrl;
  });
}

/**
 * Extends portrait canvas downward by 80% and creates a white mask for the new area.
 * Used to give flux-fill-pro room to generate the lower body.
 * Returns { imageDataUrl, maskDataUrl } — both same size, JPEG.
 */
export async function createBodyExtendInputs(blobUrl: string): Promise<{
  imageDataUrl: string;
  maskDataUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const extH = Math.round(H * 0.8); // 80% added below
      const totalH = H + extH;

      // Image canvas: original on top, black fill below
      const imgCanvas = document.createElement("canvas");
      imgCanvas.width = W;
      imgCanvas.height = totalH;
      const imgCtx = imgCanvas.getContext("2d");
      if (!imgCtx) { reject(new Error("Canvas context unavailable")); return; }
      imgCtx.fillStyle = "#000";
      imgCtx.fillRect(0, 0, W, totalH);
      imgCtx.drawImage(img, 0, 0, W, H);

      // Mask canvas: black = preserve original, white = generate new
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = W;
      maskCanvas.height = totalH;
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) { reject(new Error("Canvas context unavailable")); return; }
      maskCtx.fillStyle = "#000";
      maskCtx.fillRect(0, 0, W, H);
      maskCtx.fillStyle = "#fff";
      maskCtx.fillRect(0, H, W, extH);

      resolve({
        imageDataUrl: imgCanvas.toDataURL("image/jpeg", 0.92),
        maskDataUrl: maskCanvas.toDataURL("image/png"), // PNG: lossless — JPEG compression blurs mask edges
      });
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

