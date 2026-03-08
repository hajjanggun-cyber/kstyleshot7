import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BG_DIR = join(__dirname, "..", "public", "backgrounds");

const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 400;
const WEBP_QUALITY = 75;

const files = (await readdir(BG_DIR)).filter(
  (f) => extname(f).toLowerCase() === ".png"
);

console.log(`Found ${files.length} PNG files\n`);

for (const file of files) {
  const input = join(BG_DIR, file);
  const outName = basename(file, ".png") + "-thumb.webp";
  const output = join(BG_DIR, outName);

  const info = await sharp(input)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "center" })
    .webp({ quality: WEBP_QUALITY })
    .toFile(output);

  console.log(`✓ ${file} → ${outName} (${Math.round(info.size / 1024)}KB)`);
}

console.log("\nDone!");
