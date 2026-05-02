import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'images', 'hub', 'olive-young-must-buys-guide');

async function convert() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png')) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const webpPath = path.join(dir, `${baseName}.webp`);
      
      if (!fs.existsSync(webpPath)) {
        console.log(`Converting ${file} to .webp...`);
        await sharp(path.join(dir, file))
          .webp({ quality: 80 })
          .toFile(webpPath);
      }
    }
  }
  console.log('Conversion complete.');
}

convert().catch(console.error);
