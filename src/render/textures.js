import * as THREE from 'three'

const FONT = 'Outfit, system-ui, sans-serif'
const SERIF = 'Fraunces, Georgia, serif'

function canvasTexture(width, height, draw, options = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  draw(ctx, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = options.anisotropy || 4
  texture.needsUpdate = true
  return texture
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const value = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function labelTexture({ title, subtitle, accent = '#A8E063', icon = '', owned = false }) {
  return canvasTexture(640, 208, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)

    // soft plate
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 22
    ctx.shadowOffsetY = 8
    ctx.fillStyle = 'rgba(7,25,26,0.74)'
    roundRect(ctx, 14, 24, w - 28, h - 48, 34)
    ctx.fill()
    ctx.restore()

    ctx.strokeStyle = hexToRgba(accent, 0.5)
    ctx.lineWidth = 3
    roundRect(ctx, 14, 24, w - 28, h - 48, 34)
    ctx.stroke()

    if (icon) {
      ctx.fillStyle = hexToRgba(accent, 0.2)
      ctx.beginPath()
      ctx.arc(86, h / 2, 44, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = hexToRgba(accent, 0.8)
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.font = `600 48px ${SERIF}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = accent
      ctx.fillText(icon, 86, h / 2 + 2)
    }

    const left = icon ? 150 : 48
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.font = `700 55px ${FONT}`
    ctx.fillStyle = '#FFF8E7'
    ctx.fillText(title.toUpperCase(), left, 82)

    ctx.font = `500 35px ${FONT}`
    ctx.fillStyle = owned ? accent : hexToRgba(accent, 0.95)
    ctx.fillText(subtitle.toUpperCase(), left, 142)

    if (owned) {
      ctx.beginPath()
      ctx.arc(w - 58, h / 2, 15, 0, Math.PI * 2)
      ctx.fillStyle = accent
      ctx.fill()
    }
  })
}

export function pipTexture(value, color = '#F7EEDC', pip = '#21312D') {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = color
    roundRect(ctx, 6, 6, w - 12, h - 12, 44)
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'
    ctx.lineWidth = 5
    roundRect(ctx, 10, 10, w - 20, h - 20, 40)
    ctx.stroke()

    const positions = {
      1: [[0.5, 0.5]],
      2: [[0.28, 0.28], [0.72, 0.72]],
      3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
      4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
      5: [[0.26, 0.26], [0.74, 0.26], [0.5, 0.5], [0.26, 0.74], [0.74, 0.74]],
      6: [[0.27, 0.24], [0.73, 0.24], [0.27, 0.5], [0.73, 0.5], [0.27, 0.76], [0.73, 0.76]]
    }
    ctx.fillStyle = pip
    for (const [x, y] of positions[value] || positions[1]) {
      ctx.beginPath()
      ctx.arc(x * w, y * h, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.26)'
      ctx.beginPath()
      ctx.arc(x * w - 5, y * h - 6, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = pip
    }
  })
}

export function glowTexture(color = '#C8FF8A') {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    gradient.addColorStop(0, hexToRgba(color, 0.95))
    gradient.addColorStop(0.25, hexToRgba(color, 0.5))
    gradient.addColorStop(0.6, hexToRgba(color, 0.12))
    gradient.addColorStop(1, hexToRgba(color, 0))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)
  })
}

export function cloudTexture() {
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    const blobs = [
      [140, 150, 90],
      [220, 120, 110],
      [320, 145, 85],
      [380, 165, 65],
      [80, 175, 55]
    ]
    for (const [x, y, r] of blobs) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(255,245,225,0.85)')
      g.addColorStop(0.5, 'rgba(255,240,220,0.4)')
      g.addColorStop(1, 'rgba(255,240,220,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

export function grassTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#477a4d'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 2400; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const shade = Math.random()
      ctx.fillStyle = shade > 0.6 ? 'rgba(190,230,150,0.13)' : 'rgba(12,60,38,0.12)'
      ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3)
    }
  })
}

export function boardTexture() {
  return canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#194842'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const a = Math.random() * 0.05
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`
      ctx.fillRect(x, y, 1 + Math.random() * 3, 1 + Math.random() * 3)
    }
  })
}

export function logoTexture() {
  return canvasTexture(1200, 360, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.font = `700 230px ${SERIF}`
    ctx.fillStyle = '#F5EEDC'
    ctx.fillText('Life', 40, h / 2 - 8)
    ctx.font = `600 150px ${FONT}`
    const lifeWidth = ctx.measureText('Life ').width
    ctx.fillStyle = '#A8E063'
    ctx.fillText('ESTATE', 50 + lifeWidth, h / 2 + 12)
  })
}
