const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

// Read public/images/contact-bg.png (which is JPEG data)
const data = fs.readFileSync('c:\\Users\\admin\\Documents\\potfoliyo wiebsite\\public\\images\\contact-bg.png');
const bg = jpeg.decode(data, { useTArray: true });

const width = bg.width;
const height = bg.height;

// Find center coordinates
const centerX = Math.floor(width / 2);
const centerY = Math.floor(height / 2);

// Crop around center emblem
const cropRadiusX = Math.floor(width * 0.32);
const cropRadiusY = Math.floor(height * 0.46);

const cropW = cropRadiusX * 2;
const cropH = cropRadiusY * 2;

const emblemPng = new PNG({ width: cropW, height: cropH });

for (let cy = 0; cy < cropH; cy++) {
  for (let cx = 0; cx < cropW; cx++) {
    const srcX = (centerX - cropRadiusX) + cx;
    const srcY = (centerY - cropRadiusY) + cy;

    const outIdx = (cropW * cy + cx) << 2;

    if (srcX < 0 || srcX >= width || srcY < 0 || srcY >= height) {
      emblemPng.data[outIdx] = 0;
      emblemPng.data[outIdx + 1] = 0;
      emblemPng.data[outIdx + 2] = 0;
      emblemPng.data[outIdx + 3] = 0;
      continue;
    }

    const srcIdx = (width * srcY + srcX) << 2;
    const r = bg.data[srcIdx];
    const g = bg.data[srcIdx + 1];
    const b = bg.data[srcIdx + 2];

    // Compute normalized distance from center for smooth radial vignette
    const dx = (cx - cropRadiusX) / cropRadiusX;
    const dy = (cy - cropRadiusY) / cropRadiusY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Compute luminosity / glow intensity
    const lum = (r * 0.299 + g * 0.587 + b * 0.114);

    let alpha = 255;
    if (dist > 0.75) {
      const fade = Math.max(0, 1 - (dist - 0.75) / 0.25);
      alpha = Math.floor(255 * Math.pow(fade, 1.5));
    }

    // Blend dark rock/cave background into transparency
    if (lum < 40) {
      alpha = Math.floor(alpha * Math.max(0, (lum - 10) / 30));
    }

    emblemPng.data[outIdx] = r;
    emblemPng.data[outIdx + 1] = g;
    emblemPng.data[outIdx + 2] = b;
    emblemPng.data[outIdx + 3] = alpha;
  }
}

const outBuffer = PNG.sync.write(emblemPng);
fs.writeFileSync('c:\\Users\\admin\\Documents\\potfoliyo wiebsite\\public\\images\\content-icon.png', outBuffer);
fs.writeFileSync('c:\\Users\\admin\\Documents\\potfoliyo wiebsite\\public\\images\\cantent-core.png', outBuffer);
console.log('Successfully generated crystal-clear glowing cyber core emblem!');
