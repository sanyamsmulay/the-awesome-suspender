const sharp = require('sharp');
const path = require('path');

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  const inputSvg = path.join(__dirname, '../src/icons/icon.svg');
  
  for (const size of sizes) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../src/icons/icon${size}.png`));
  }
}

generateIcons().catch(console.error);
