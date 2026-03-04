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

