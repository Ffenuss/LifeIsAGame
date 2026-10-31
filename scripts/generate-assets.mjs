import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const assets = path.join(root, 'assets');
const store = path.join(root, 'store');
await mkdir(assets, { recursive: true });
await mkdir(store, { recursive: true });

const navy = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#243a60"/>
      <stop offset="1" stop-color="#101b33"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffd166"/>
      <stop offset="1" stop-color="#ff9f43"/>
    </linearGradient>
  </defs>`;

const star = (cx, cy, r) => {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.46;
    points.push(`${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`);
  }
  return points.join(' ');
};

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${navy}
  <rect width="512" height="512" rx="116" fill="url(#bg)"/>
  <polygon points="${star(256, 150, 62)}" fill="url(#gold)"/>
  <text x="256" y="372" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="154" fill="#fff8ea">L</text>
  <text x="256" y="446" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="33" letter-spacing="8" fill="#ffc94a">IS A GAME</text>
</svg>`;

const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${navy}
  <polygon points="${star(256, 150, 62)}" fill="url(#gold)"/>
  <text x="256" y="372" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="154" fill="#fff8ea">L</text>
</svg>`;

const backgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${navy}
  <rect width="512" height="512" fill="url(#bg)"/>
</svg>`;

const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732">
  ${navy}
  <rect width="2732" height="2732" fill="url(#bg)"/>
  <g transform="translate(1100 900) scale(1.04)">
    <rect x="0" y="0" width="532" height="532" rx="120" fill="#1a2a4a"/>
    <polygon points="${star(266, 156, 64)}" fill="url(#gold)"/>
    <text x="266" y="388" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="160" fill="#fff8ea">L</text>
  </g>
  <text x="1366" y="1580" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="112" letter-spacing="18" fill="#fff8ea">LIFE IS A GAME</text>
  <text x="1366" y="1680" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="500" font-size="44" letter-spacing="12" fill="#ffc94a">BUY A HOME · FIND LOVE · RETIRE HAPPY</text>
</svg>`;

const featureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  ${navy}
  <rect width="1024" height="500" fill="url(#bg)"/>
  <circle cx="850" cy="110" r="230" fill="#ffc94a" opacity="0.08"/>
  <circle cx="120" cy="430" r="200" fill="#35c4b5" opacity="0.07"/>
  <g transform="translate(96 130) scale(0.48)">
    <rect x="0" y="0" width="512" height="512" rx="116" fill="#1a2a4a"/>
    <polygon points="${star(256, 150, 62)}" fill="url(#gold)"/>
    <text x="256" y="372" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="154" fill="#fff8ea">L</text>
  </g>
  <text x="380" y="250" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="92" fill="#fff8ea">LIFE</text>
  <text x="380" y="330" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="92" fill="#ffc94a">IS A GAME</text>
  <text x="384" y="392" font-family="DejaVu Sans, Arial, sans-serif" font-weight="500" font-size="22" letter-spacing="3" fill="#b9c8df">A 3D BOARD GAME ABOUT BEING ALIVE</text>
</svg>`;

async function render(svg, file, width, height) {
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(file);
}

await render(iconSvg, path.join(assets, 'icon.png'), 1024, 1024);
await render(iconSvg, path.join(store, 'icon-512.png'), 512, 512);
await render(foregroundSvg, path.join(assets, 'icon-foreground.png'), 1024, 1024);
await render(backgroundSvg, path.join(assets, 'icon-background.png'), 1024, 1024);
await render(splashSvg, path.join(assets, 'splash.png'), 2732, 2732);
await render(splashSvg, path.join(assets, 'splash-dark.png'), 2732, 2732);
await render(featureSvg, path.join(store, 'feature-graphic.png'), 1024, 500);

// A simple, safe web icon in case the public one is missing.
const publicIcon = await readFile(path.join(root, 'public', 'icon.svg'));
await sharp(publicIcon).resize(512, 512).png().toFile(path.join(store, 'web-icon.png'));

console.log('Generated icon, adaptive icon, splash and store artwork.');
