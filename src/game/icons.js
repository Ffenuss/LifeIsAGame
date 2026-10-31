// All artwork is drawn procedurally — no external images, no licence worries,
// and every icon stays crisp at any size on any phone.

const TAU = Math.PI * 2;

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function starPath(ctx, points, outer, inner) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 ? inner : outer;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function heartPath(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.bezierCurveTo(-52, -2, -38, -40, -14, -40);
  ctx.bezierCurveTo(-4, -40, 0, -32, 0, -24);
  ctx.bezierCurveTo(0, -32, 4, -40, 14, -40);
  ctx.bezierCurveTo(38, -40, 52, -2, 0, 34);
  ctx.closePath();
}

export function drawIcon(ctx, name, cx, cy, size, color, accent = '#FFFFFF') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 100, size / 100);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (name) {
    case 'sun': {
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, TAU);
      ctx.fill();
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 30, Math.sin(a) * 30);
        ctx.lineTo(Math.cos(a) * 43, Math.sin(a) * 43);
        ctx.stroke();
      }
      break;
    }
    case 'cup': {
      ctx.beginPath();
      ctx.moveTo(-24, -28);
      ctx.lineTo(-17, 32);
      ctx.lineTo(17, 32);
      ctx.lineTo(24, -28);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-26, -8);
      ctx.lineTo(26, -8);
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(12, -30);
      ctx.lineTo(22, -48);
      ctx.stroke();
      break;
    }
    case 'balloon': {
      ctx.beginPath();
      ctx.ellipse(0, -12, 23, 28, 0, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, 15);
      ctx.lineTo(0, 24);
      ctx.lineTo(6, 15);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.bezierCurveTo(14, 34, -12, 42, 2, 50);
      ctx.stroke();
      break;
    }
    case 'book': {
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-44, 28);
      ctx.lineTo(-44, -26);
      ctx.quadraticCurveTo(-24, -34, 0, -20);
      ctx.quadraticCurveTo(24, -34, 44, -26);
      ctx.lineTo(44, 28);
      ctx.quadraticCurveTo(24, 20, 0, 32);
      ctx.quadraticCurveTo(-24, 20, -44, 28);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(0, 32);
      ctx.moveTo(-32, -14);
      ctx.quadraticCurveTo(-18, -16, -8, -8);
      ctx.moveTo(-32, 0);
      ctx.quadraticCurveTo(-18, -2, -8, 6);
      ctx.moveTo(32, -14);
      ctx.quadraticCurveTo(18, -16, 8, -8);
      ctx.stroke();
      break;
    }
    case 'star': {
      starPath(ctx, 5, 44, 19);
      ctx.fill();
      break;
    }
    case 'ball': {
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-18, 0, 34, -0.85, 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(18, 0, 34, Math.PI - 0.85, Math.PI + 0.85);
      ctx.stroke();
      break;
    }
    case 'gift': {
      roundRect(ctx, -32, -12, 64, 44, 6);
      ctx.fill();
      roundRect(ctx, -38, -26, 76, 18, 5);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(-7, -26, 14, 58);
      ctx.fillRect(-38, -20, 76, 8);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(-16, -34, 13, 9, -0.5, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(16, -34, 13, 9, 0.5, 0, TAU);
      ctx.fill();
      break;
    }
    case 'blocks': {
      roundRect(ctx, -36, 2, 32, 32, 5);
      ctx.fill();
      roundRect(ctx, 4, 2, 32, 32, 5);
      ctx.fill();
      roundRect(ctx, -16, -32, 32, 32, 5);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.font = 'bold 22px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('A', -20, 18);
      ctx.fillText('B', 20, 18);
      ctx.fillText('C', 0, -16);
      break;
    }
    case 'cap': {
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(44, -6);
      ctx.lineTo(0, 12);
      ctx.lineTo(-44, -6);
      ctx.closePath();
      ctx.fill();
      roundRect(ctx, -20, 4, 40, 14, 5);
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(34, -1);
      ctx.lineTo(38, 28);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(38, 30, 5, 0, TAU);
      ctx.fill();
      break;
    }
    case 'briefcase': {
      roundRect(ctx, -42, -18, 84, 52, 9);
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 7;
      roundRect(ctx, -15, -34, 30, 20, 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-42, 2);
      ctx.lineTo(42, 2);
      ctx.stroke();
      ctx.fillStyle = accent;
      roundRect(ctx, -8, -6, 16, 14, 3);
      ctx.fill();
      break;
    }
    case 'laptop': {
      roundRect(ctx, -34, -34, 68, 44, 5);
      ctx.fill();
      ctx.fillStyle = accent;
      roundRect(ctx, -26, -26, 52, 28, 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-44, 18);
      ctx.lineTo(44, 18);
      ctx.lineTo(32, 32);
      ctx.lineTo(-32, 32);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'coffee': {
      ctx.beginPath();
      ctx.moveTo(-26, -22);
      ctx.lineTo(-20, 34);
      ctx.lineTo(20, 34);
      ctx.lineTo(26, -22);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(30, 2, 13, -1.2, 1.2);
      ctx.stroke();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-8, -34);
      ctx.bezierCurveTo(-16, -42, 0, -46, -8, -54);
      ctx.moveTo(10, -32);
      ctx.bezierCurveTo(2, -40, 18, -44, 10, -52);
      ctx.stroke();
      break;
    }
    case 'medal': {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-22, -46);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-30, -16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(22, -46);
      ctx.lineTo(6, -10);
      ctx.lineTo(30, -16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 10, 28, 0, TAU);
      ctx.fill();
      ctx.fillStyle = accent;
      starPath(ctx, 5, 16, 7);
      ctx.fill();
      break;
    }
    case 'rocket': {
      ctx.beginPath();
      ctx.moveTo(0, -48);
      ctx.bezierCurveTo(22, -30, 24, -2, 16, 22);
      ctx.lineTo(-16, 22);
      ctx.bezierCurveTo(-24, -2, -22, -30, 0, -48);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-16, 10);
      ctx.lineTo(-36, 32);
      ctx.lineTo(-16, 28);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(16, 10);
      ctx.lineTo(36, 32);
      ctx.lineTo(16, 28);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(0, -14, 9, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#FF9F43';
      ctx.beginPath();
      ctx.moveTo(-9, 24);
      ctx.lineTo(0, 48);
      ctx.lineTo(9, 24);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'moon': {
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(16, -10, 30, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
      ctx.save();
      ctx.translate(30, 22);
      starPath(ctx, 5, 11, 4.5);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'compass': {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -32);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 32);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(0, -32);
      ctx.lineTo(10, 0);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'heart': {
      heartPath(ctx);
      ctx.fill();
      break;
    }
    case 'rings': {
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(-16, 4, 24, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(16, 4, 24, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(-16, -28, 6, 0, TAU);
      ctx.fill();
      break;
    }
    case 'home': {
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(44, -6);
      ctx.lineTo(34, -6);
      ctx.lineTo(34, 40);
      ctx.lineTo(-34, 40);
      ctx.lineTo(-34, -6);
      ctx.lineTo(-44, -6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      roundRect(ctx, -10, 12, 20, 28, 3);
      ctx.fill();
      roundRect(ctx, -27, 4, 12, 12, 2);
      ctx.fill();
      roundRect(ctx, 15, 4, 12, 12, 2);
      ctx.fill();
      break;
    }
    case 'crib': {
      ctx.lineWidth = 7;
      roundRect(ctx, -36, -18, 72, 40, 6);
      ctx.stroke();
      for (let i = -24; i <= 24; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, -18);
        ctx.lineTo(i, 22);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-36, -18);
      ctx.lineTo(-36, -36);
      ctx.lineTo(36, -36);
      ctx.lineTo(36, -18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-30, 22);
      ctx.lineTo(-38, 40);
      ctx.moveTo(30, 22);
      ctx.lineTo(38, 40);
      ctx.stroke();
      break;
    }
    case 'plane': {
      ctx.beginPath();
      ctx.moveTo(46, -36);
      ctx.lineTo(-36, -6);
      ctx.lineTo(-4, 6);
      ctx.lineTo(8, 38);
      ctx.lineTo(20, 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-36, -6);
      ctx.lineTo(20, 12);
      ctx.stroke();
      break;
    }
    case 'flower': {
      ctx.fillStyle = color;
      for (let i = 0; i < 6; i++) {
        const a = (i * TAU) / 6;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * 20, -12 + Math.sin(a) * 20, 13, 9, a, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      ctx.arc(0, -12, 10, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.quadraticCurveTo(-6, 28, 0, 46);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(-14, 26, 13, 7, -0.6, 0, TAU);
      ctx.fill();
      break;
    }
    case 'shop': {
      roundRect(ctx, -38, -10, 76, 50, 5);
      ctx.fill();
      ctx.fillStyle = accent;
      roundRect(ctx, -22, 6, 20, 34, 3);
      ctx.fill();
      roundRect(ctx, 8, 6, 20, 20, 3);
      ctx.fill();
      ctx.fillStyle = color;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(-30 + i * 20, -10, 10, Math.PI, 0);
        ctx.fill();
      }
      ctx.fillRect(-40, -14, 80, 8);
      break;
    }
    case 'nest': {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 8, 34, 0.15, Math.PI - 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 8, 26, 0.1, Math.PI - 0.1);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(-10, 0, 11, 14, 0.2, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(12, 2, 10, 13, -0.2, 0, TAU);
      ctx.fill();
      break;
    }
    case 'globe': {
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 36, 0, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-36, 0);
      ctx.lineTo(36, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, 34, 14, 0, 0, TAU);
      ctx.stroke();
      break;
    }
    case 'umbrella': {
      ctx.beginPath();
      ctx.arc(0, -6, 42, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, 34);
      ctx.arc(-10, 34, 10, 0, Math.PI);
      ctx.stroke();
      break;
    }
    case 'mountain': {
      ctx.beginPath();
      ctx.moveTo(-46, 36);
      ctx.lineTo(-8, -38);
      ctx.lineTo(30, 36);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(-20, -16);
      ctx.lineTo(-8, -38);
      ctx.lineTo(4, -16);
      ctx.lineTo(-4, -10);
      ctx.lineTo(-11, -18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(6, 36);
      ctx.lineTo(32, -12);
      ctx.lineTo(48, 36);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'palette': {
      ctx.beginPath();
      ctx.ellipse(0, 0, 42, 36, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(20, 16, 11, 9, 0.4, 0, TAU);
      ctx.fill();
      const dots = [
        [-20, -14, '#FF7A6B'],
        [-2, -24, '#5B8DEF'],
        [18, -18, '#FFC44D'],
        [-24, 8, '#59C08A'],
      ];
      for (const [x, y, c] of dots) {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, TAU);
        ctx.fill();
      }
      break;
    }
    case 'chart': {
      ctx.fillStyle = color;
      roundRect(ctx, -36, 12, 16, 28, 3);
      ctx.fill();
      roundRect(ctx, -12, 0, 16, 40, 3);
      ctx.fill();
      roundRect(ctx, 12, -18, 16, 58, 3);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-34, 2);
      ctx.lineTo(-2, -18);
      ctx.lineTo(20, -28);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, -28);
      ctx.lineTo(8, -30);
      ctx.moveTo(20, -28);
      ctx.lineTo(22, -16);
      ctx.stroke();
      break;
    }
    case 'car': {
      ctx.beginPath();
      ctx.moveTo(-44, 14);
      ctx.lineTo(-34, -4);
      ctx.lineTo(-12, -8);
      ctx.lineTo(-2, -26);
      ctx.lineTo(22, -26);
      ctx.lineTo(32, -8);
      ctx.lineTo(42, -2);
      ctx.lineTo(42, 14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      roundRect(ctx, -2, -22, 22, 12, 2);
      ctx.fill();
      ctx.fillStyle = '#26304A';
      ctx.beginPath();
      ctx.arc(-24, 18, 11, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(26, 18, 11, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#DDE6F5';
      ctx.beginPath();
      ctx.arc(-24, 18, 4, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(26, 18, 4, 0, TAU);
      ctx.fill();
      break;
    }
    case 'coin': {
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, 27, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.font = 'bold 42px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 2);
      break;
    }
    case 'question': {
      ctx.font = 'bold 96px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 0, 6);
      break;
    }
    case 'flag': {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(-20, 44);
      ctx.lineTo(-20, -40);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, -38);
      ctx.lineTo(40, -22);
      ctx.lineTo(-18, -4);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'trophy': {
      ctx.beginPath();
      ctx.moveTo(-26, -38);
      ctx.lineTo(26, -38);
      ctx.lineTo(22, 2);
      ctx.quadraticCurveTo(0, 20, -22, 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(-30, -22, 12, -1.2, 1.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(30, -22, 12, Math.PI - 1.2, Math.PI + 1.2);
      ctx.stroke();
      ctx.fillRect(-6, 14, 12, 18);
      roundRect(ctx, -22, 32, 44, 10, 3);
      ctx.fill();
      break;
    }
    default: {
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, TAU);
      ctx.fill();
    }
  }

  ctx.restore();
}

export function iconDataURL(name, color, size = 96, background = 'transparent') {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (background !== 'transparent') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
  }
  drawIcon(ctx, name, size / 2, size / 2, size * 0.9, color);
  return canvas.toDataURL('image/png');
}

export function roundedRectPath(ctx, x, y, w, h, r) {
  roundRect(ctx, x, y, w, h, r);
}
