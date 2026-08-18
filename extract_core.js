const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const jpegData = fs.readFileSync('C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\9b1abbb8-a7b1-4d4b-ba51-d70781eeba0d\\.user_uploaded\\media_1786850948020.jpg');
const rawImage = jpeg.decode(jpegData, { useTArray: true });

const width = rawImage.width;
const height = rawImage.height;
const png = new PNG({ width, height });

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    const r = rawImage.data[idx];
    const g = rawImage.data[idx + 1];
    const b = rawImage.data[idx + 2];

    // Detect saturation and color difference from neutral grey checkerboard
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const avg = (r + g + b) / 3;

    // Check if pixel is part of grey/black checkerboard
    // Checkerboard squares are neutral grey (low delta, r~g~b)
    const isNeutral = delta < 18;
    const isCheckerboardColor = isNeutral && ((avg >= 40 && avg <= 70) || (avg >= 85 && avg <= 125));

    let alpha = 255;
    let outR = r;
    let outG = g;
    let outB = b;

    if (isCheckerboardColor) {
      alpha = 0;
    } else if (isNeutral && avg < 80) {
      // Dark neutral edge
      alpha = Math.max(0, Math.min(255, (avg - 30) * 3));
    } else if (delta < 25) {
      // Low saturation transition
      const satWeight = delta / 25;
      alpha = Math.floor(255 * satWeight);
    } else {
      // High color saturation (cyan, magenta, white glow)
      alpha = 255;
      // If there's a bright glow (white center)
      if (min > 140) {
        alpha = 255;
      }
    }

    png.data[idx] = outR;
    png.data[idx + 1] = outG;
    png.data[idx + 2] = outB;
    png.data[idx + 3] = alpha;
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync('c:\\Users\\admin\\Documents\\potfoliyo wiebsite\\public\\images\\content-icon.png', buffer);
fs.writeFileSync('c:\\Users\\admin\\Documents\\potfoliyo wiebsite\\public\\images\\cantent-core.png', buffer);
console.log('Successfully created transparent content-icon.png!');
