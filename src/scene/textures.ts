import * as THREE from 'three';
import { GROUP_COLORS, GROUP_NAMES, TILES } from '../game/data';
import type { PropertyGroup, Tile } from '../game/types';

const CREAM = '#f5ecd9';
const CREAM_DEEP = '#e8dcc3';
const INK = '#183b3e';
const GOLD = '#e8c170';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawIcon(
  ctx: CanvasRenderingContext2D,
  icon: string,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const s = size / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.09);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (icon) {
    case 'heart':
      ctx.beginPath();
      ctx.moveTo(0, s * 0.75);
      ctx.bezierCurveTo(-s * 1.1, 0, -s * 0.55, -s * 0.8, 0, -s * 0.28);
      ctx.bezierCurveTo(s * 0.55, -s * 0.8, s * 1.1, 0, 0, s * 0.75);
      ctx.fill();
      break;
    case 'star': {
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? s : s * 0.45;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'house':
    case 'home':
      ctx.beginPath();
      ctx.moveTo(-s * 0.85, 0);
      ctx.lineTo(0, -s * 0.8);
      ctx.lineTo(s * 0.85, 0);
      ctx.stroke();
      ctx.strokeRect(-s * 0.6, 0, s * 1.2, s * 0.7);
      ctx.fillRect(-s * 0.18, s * 0.25, s * 0.36, s * 0.45);
      break;
    case 'briefcase':
      ctx.strokeRect(-s * 0.9, -s * 0.45, s * 1.8, s * 1.15);
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, -s * 0.45);
      ctx.lineTo(-s * 0.35, -s * 0.8);
      ctx.lineTo(s * 0.35, -s * 0.8);
      ctx.lineTo(s * 0.35, -s * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.9, s * 0.1);
      ctx.lineTo(s * 0.9, s * 0.1);
      ctx.stroke();
      break;
    case 'chart':
    case 'up':
      ctx.beginPath();
      ctx.moveTo(-s, s * 0.7);
      ctx.lineTo(-s * 0.25, -s * 0.1);
      ctx.lineTo(s * 0.15, s * 0.35);
      ctx.lineTo(s, -s * 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.35, -s * 0.68);
      ctx.lineTo(s, -s * 0.7);
      ctx.lineTo(s * 0.88, -s * 0.05);
      ctx.stroke();
      break;
    case 'down':
      ctx.beginPath();
      ctx.moveTo(-s, -s * 0.3);
      ctx.lineTo(-s * 0.2, s * 0.2);
      ctx.lineTo(s * 0.2, -s * 0.15);
      ctx.lineTo(s, s * 0.7);
      ctx.stroke();
      break;
    case 'tax':
    case 'percent':
      ctx.beginPath();
      ctx.moveTo(-s * 0.7, s * 0.7);
      ctx.lineTo(s * 0.7, -s * 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-s * 0.55, -s * 0.45, s * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.55, s * 0.45, s * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'people':
      ctx.beginPath();
      ctx.arc(0, -s * 0.35, s * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, s * 0.7, s * 0.85, Math.PI, 0);
      ctx.fill();
      break;
    case 'flag':
      ctx.beginPath();
      ctx.moveTo(-s * 0.55, s);
      ctx.lineTo(-s * 0.55, -s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.45, -s * 0.9);
      ctx.lineTo(s * 0.75, -s * 0.55);
      ctx.lineTo(-s * 0.45, -s * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    case 'gift':
      ctx.strokeRect(-s * 0.8, -s * 0.3, s * 1.6, s * 1.1);
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, s * 0.05);
      ctx.lineTo(s * 0.8, s * 0.05);
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(0, s * 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-s * 0.3, -s * 0.55, s * 0.35, 0, Math.PI * 2);
      ctx.arc(s * 0.3, -s * 0.55, s * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'rings':
      ctx.beginPath();
      ctx.arc(-s * 0.35, s * 0.1, s * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.35, s * 0.1, s * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'compass':
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, s * 0.35);
      ctx.lineTo(0, -s * 0.4);
      ctx.lineTo(s * 0.3, -s * 0.15);
      ctx.closePath();
      ctx.fill();
      break;
    case 'coins':
      ctx.beginPath();
      ctx.arc(-s * 0.3, s * 0.2, s * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.3, -s * 0.2, s * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'medal':
      ctx.beginPath();
      ctx.arc(0, s * 0.2, s * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.45, -s * 0.45);
      ctx.lineTo(-s * 0.75, -s);
      ctx.lineTo(-s * 0.1, -s * 0.72);
      ctx.moveTo(s * 0.45, -s * 0.45);
      ctx.lineTo(s * 0.75, -s);
      ctx.lineTo(s * 0.1, -s * 0.72);
      ctx.stroke();
      break;
    default:
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.75, 0, Math.PI * 2);
      ctx.stroke();
  }
  ctx.restore();
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
  weight = 700,
): number {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px Outfit, system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  } while (size > 12);
  return size;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function finishTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function createTileTexture(tile: Tile): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);
  roundRect(ctx, 3, 3, size - 6, size - 6, 30);
  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, CREAM);
  bg.addColorStop(1, CREAM_DEEP);
  ctx.fillStyle = bg;
  ctx.fill();

  let accent = GOLD;
  let icon = 'star';
  let headerLabel = '';
  let name = tile.name;
  let sub = '';

  if (tile.type === 'property') {
    accent = GROUP_COLORS[tile.group as PropertyGroup];
    headerLabel = GROUP_NAMES[tile.group as PropertyGroup].toUpperCase();
    icon = 'house';
    sub = `$${tile.price?.toLocaleString()}`;
  } else if (tile.type === 'start') {
    accent = '#e5b95c';
    icon = 'flag';
    headerLabel = 'START';
    sub = 'COLLECT SALARY';
  } else if (tile.type === 'life') {
    accent = '#9278d8';
    icon = 'heart';
    headerLabel = 'LIFE EVENT';
    sub = 'DRAW A CARD';
  } else if (tile.type === 'market') {
    accent = '#3fa9a4';
    icon = 'chart';
    headerLabel = 'MARKET';
    sub = 'ALL PROPERTIES SHIFT';
  } else if (tile.type === 'tax') {
    accent = '#d36767';
    icon = 'percent';
    headerLabel = 'TAX';
    sub = 'PAY THE CITY';
  } else if (tile.type === 'career') {
    accent = '#5a92d0';
    icon = 'briefcase';
    headerLabel = 'CAREER';
    sub = 'DRAW A CAREER CARD';
  } else if (tile.type === 'family') {
    accent = '#d681a1';
    icon = 'people';
    headerLabel = 'FAMILY';
    sub = 'DRAW A FAMILY CARD';
  } else if (tile.type === 'legacy') {
    accent = '#d8a441';
    icon = 'star';
    headerLabel = 'LEGACY';
    sub = 'DRAW A LEGACY CARD';
  }

  // Coloured header
  ctx.save();
  roundRect(ctx, 3, 3, size - 6, size - 6, 30);
  ctx.clip();
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, size, 72);
  const sheen = ctx.createLinearGradient(0, 0, size, 72);
  sheen.addColorStop(0, 'rgba(255,255,255,0.24)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, 72);
  ctx.restore();

  // Header label
  ctx.fillStyle = tile.type === 'property' ? 'rgba(15,50,52,0.9)' : '#fffaf0';
  ctx.font = '700 22px Outfit, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(headerLabel, 18, 37);

  // Icon in header
  drawIcon(ctx, icon, 220, 36, 34, tile.type === 'property' ? 'rgba(15,50,52,0.85)' : '#fffaf0');

  // Name
  ctx.textAlign = 'center';
  ctx.fillStyle = INK;
  const nameSize = fitFont(ctx, name, 214, 34, 700);
  ctx.font = `700 ${nameSize}px Outfit, system-ui, sans-serif`;
  const lines = wrapLines(ctx, name, 214, nameSize > 26 ? 2 : 3);
  const lineHeight = nameSize * 1.05;
  const nameTop = tile.type === 'property' ? 112 : 100;
  lines.forEach((line, index) => {
    ctx.fillText(line, size / 2, nameTop + index * lineHeight);
  });

  // Sub-label / price
  ctx.font = '600 19px Outfit, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(24,59,62,0.62)';
  ctx.fillText(sub, size / 2, 210);

  // Small badge for properties
  if (tile.type === 'property' && tile.group) {
    ctx.fillStyle = 'rgba(24,59,62,0.09)';
    roundRect(ctx, 82, 222, 92, 24, 12);
    ctx.fill();
    ctx.fillStyle = 'rgba(24,59,62,0.66)';
    ctx.font = '700 15px Outfit, system-ui, sans-serif';
    ctx.fillText(`GROUP ${tile.group}`, 128, 235);
  } else if (tile.type === 'start') {
    drawIcon(ctx, 'flag', 128, 218, 30, 'rgba(24,59,62,0.5)');
  }

  return finishTexture(canvas);
}

export function createDiceTexture(value: number): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#fbf3e2';
  ctx.fillRect(0, 0, size, size);

  const border = ctx.createLinearGradient(0, 0, size, size);
  border.addColorStop(0, 'rgba(255,255,255,0.9)');
  border.addColorStop(1, 'rgba(207,184,143,0.5)');
  ctx.strokeStyle = border;
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, size - 8, size - 8);

  const pipColor = '#23434a';
  const positions: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]],
    5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
    6: [[0.29, 0.24], [0.71, 0.24], [0.29, 0.5], [0.71, 0.5], [0.29, 0.76], [0.71, 0.76]],
  };

  ctx.fillStyle = pipColor;
  for (const [x, y] of positions[value] ?? positions[1]) {
    ctx.beginPath();
    ctx.arc(x * size, y * size, value === 1 ? 15 : 11, 0, Math.PI * 2);
    ctx.fill();
  }

  return finishTexture(canvas);
}

export function createGroundTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    20,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, '#17454c');
  gradient.addColorStop(0.45, '#0e2c33');
  gradient.addColorStop(1, '#041217');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Subtle grain so the table does not look flat.
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 2200; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = Math.random() > 0.5 ? '#9fd6c9' : '#000000';
    ctx.fillRect(x, y, 1.4, 1.4);
  }
  ctx.globalAlpha = 1;
  return finishTexture(canvas);
}

export function createCenterDecal(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(cx, cy, 80, cx, cy, 480);
  glow.addColorStop(0, 'rgba(232,193,112,0.20)');
  glow.addColorStop(0.55, 'rgba(232,193,112,0.08)');
  glow.addColorStop(1, 'rgba(232,193,112,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 480, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(232,193,112,0.55)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 400, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 330, 0, Math.PI * 2);
  ctx.stroke();

  // Life-stage ticks
  for (let i = 0; i < 4; i += 1) {
    const angle = (Math.PI / 2) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * 400;
    const y = cy + Math.sin(angle) * 400;
    ctx.fillStyle = 'rgba(232,193,112,0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Arc text
  ctx.fillStyle = 'rgba(246,237,217,0.82)';
  ctx.font = '600 24px Outfit, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const arcText = 'ROLL  •  BUILD  •  LIVE  •  RETIRE';
  const letters = arcText.split('');
  let angle = -Math.PI * 0.62;
  for (const letter of letters) {
    const step = 0.052;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * 362, cy + Math.sin(angle) * 362);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(letter, 0, 0);
    ctx.restore();
    angle += step;
  }

  // Compass rose under the monument
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = 'rgba(232,193,112,0.16)';
  for (let i = 0; i < 4; i += 1) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -132);
    ctx.lineTo(26, 0);
    ctx.lineTo(0, 30);
    ctx.lineTo(-26, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(232,193,112,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Branding below the monument so the tower never hides it
  ctx.strokeStyle = 'rgba(232,193,112,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 92, cy + 300);
  ctx.lineTo(cx + 92, cy + 300);
  ctx.stroke();

  ctx.fillStyle = GOLD;
  ctx.font = '700 46px Outfit, system-ui, sans-serif';
  ctx.fillText('MILESTONE', cx, cy + 340);
  ctx.fillStyle = 'rgba(246,237,217,0.6)';
  ctx.font = '500 18px Outfit, system-ui, sans-serif';
  ctx.fillText('A LIFE & FORTUNE STORY', cx, cy + 376);

  return finishTexture(canvas);
}

export function createShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(0,0,0,0.45)');
  gradient.addColorStop(0.6, 'rgba(0,0,0,0.18)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return finishTexture(canvas);
}

export function tileName(index: number): string {
  return TILES[index]?.name ?? 'Unknown';
}
