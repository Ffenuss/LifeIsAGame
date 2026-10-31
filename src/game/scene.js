import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { DISTRICTS, GROUP_TILES, TILES, TILE_BY_ID } from './data.js';
import { drawIcon, roundedRectPath } from './icons.js';
import {
  addMesh,
  box,
  makeBench,
  makeCloud,
  makeHeartMesh,
  makeHouse,
  makeLamp,
  makePawn,
  makeSignTexture,
  makeTileProp,
  makeTree,
  mat,
} from './models.js';

const TILE_COUNT = TILES.length;
const SPACING = 1.95;
const TILE_SIZE = 1.62;
const TILE_TOP = 0.46;
const PARK_TOP = 0.32;
const BOARD_HALF = 10.9;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// Board layout: a 9×9 perimeter, so the corners land on 0, 8, 16 and 24.
// ---------------------------------------------------------------------------
const COORDS = [];
for (let x = -4; x <= 4; x++) COORDS.push([x, 4]);
for (let z = 3; z >= -4; z--) COORDS.push([4, z]);
for (let x = 3; x >= -4; x--) COORDS.push([x, -4]);
for (let z = -3; z <= 3; z++) COORDS.push([-4, z]);

const TILE_POS = COORDS.map(([x, z]) => new THREE.Vector3(x * SPACING, 0, z * SPACING));

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function damp(current, target, lambda, dt) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

// ---------------------------------------------------------------------------
// Canvas textures
// ---------------------------------------------------------------------------

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function createTileTexture(tile, ownerColor = null, groupComplete = false) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const district = DISTRICTS[tile.district];

  ctx.clearRect(0, 0, size, size);
  roundedRectPath(ctx, 10, 10, 492, 492, 64);
  ctx.fillStyle = '#FFF9ED';
  ctx.fill();

  // Colour band
  ctx.save();
  roundedRectPath(ctx, 10, 10, 492, 492, 64);
  ctx.clip();
  ctx.fillStyle = district.color;
  ctx.fillRect(10, 10, 492, 94);
  ctx.restore();

  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 27px Fredoka, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(district.name.toUpperCase(), 36, 59);

  ctx.textAlign = 'right';
  ctx.font = '700 38px Fredoka, sans-serif';
  const bandLabel =
    tile.type === 'property'
      ? `$${tile.price}`
      : tile.type === 'choice' || tile.type === 'emptyNest'
        ? 'MILESTONE'
        : tile.type === 'event'
          ? 'LIFE EVENT'
          : tile.type === 'bonus'
            ? 'BONUS'
            : tile.type === 'start'
              ? 'START'
              : 'TAKE A BREAK';
  ctx.fillText(bandLabel, 476, 59);

  // Icon badge
  ctx.beginPath();
  ctx.arc(256, 232, 92, 0, TAU);
  ctx.fillStyle = district.soft;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 6;
  ctx.stroke();
  drawIcon(ctx, tile.icon, 256, 232, 116, district.dark);

  // Name
  ctx.fillStyle = '#28304A';
  ctx.textAlign = 'center';
  ctx.font = '700 52px Fredoka, sans-serif';
  let lines = wrapLines(ctx, tile.name, 430);
  if (lines.length > 2) {
    ctx.font = '700 44px Fredoka, sans-serif';
    lines = wrapLines(ctx, tile.name, 440);
  }
  if (lines.length === 1) {
    ctx.fillText(lines[0], 256, 392);
  } else {
    ctx.fillText(lines[0], 256, 364);
    ctx.fillText(lines[1], 256, 418);
  }

  // Footer
  ctx.font = '600 27px Nunito, sans-serif';
  ctx.fillStyle = district.dark;
  let footer = '';
  if (tile.type === 'property') footer = `RENT $${tile.rent[0]} · UPGRADABLE`;
  else if (tile.type === 'start') footer = 'COLLECT SALARY';
  else if (tile.type === 'event') footer = 'DRAW A CARD';
  else if (tile.type === 'choice') footer = 'CHOOSE YOUR PATH';
  else if (tile.type === 'bonus') footer = `+$${tile.cash || 0} BONUS`;
  else if (tile.type === 'rest') footer = 'REST + HAPPINESS';
  else if (tile.type === 'emptyNest') footer = 'A QUIETER HOUSE';
  ctx.fillText(footer, 256, 474);

  // Ownership border
  if (ownerColor) {
    ctx.save();
    roundedRectPath(ctx, 10, 10, 492, 492, 64);
    ctx.strokeStyle = ownerColor;
    ctx.lineWidth = 14;
    ctx.stroke();
    if (groupComplete) {
      ctx.strokeStyle = '#FFC94A';
      ctx.lineWidth = 5;
      roundedRectPath(ctx, 24, 24, 464, 464, 52);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(452, 446, 24, 0, TAU);
    ctx.fillStyle = ownerColor;
    ctx.fill();
    ctx.strokeStyle = '#FFF9ED';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 26px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', 452, 448);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function makeDiceFaceTexture(value) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFF7E8';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#E8D3AF';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  const positions = {
    1: [[128, 128]],
    2: [
      [72, 72],
      [184, 184],
    ],
    3: [
      [72, 72],
      [128, 128],
      [184, 184],
    ],
    4: [
      [72, 72],
      [184, 72],
      [72, 184],
      [184, 184],
    ],
    5: [
      [72, 72],
      [184, 72],
      [128, 128],
      [72, 184],
      [184, 184],
    ],
    6: [
      [72, 64],
      [184, 64],
      [72, 128],
      [184, 128],
      [72, 192],
      [184, 192],
    ],
  };
  for (const [x, y] of positions[value]) {
    ctx.beginPath();
    ctx.arc(x, y, 19, 0, TAU);
    ctx.fillStyle = '#2B3044';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 5, 0, TAU);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeTrayTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const colors = ['#F08BAD', '#5B8DEF', '#FFC44D', '#59C08A', '#A57BE0', '#FF7A6B'];
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, TAU);
  ctx.fillStyle = '#FFF3D8';
  ctx.fill();
  colors.forEach((color, i) => {
    const a0 = (i / colors.length) * TAU - Math.PI / 2;
    const a1 = ((i + 1) / colors.length) * TAU - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 236, a0, a1);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  });
  ctx.beginPath();
  ctx.arc(cx, cy, 118, 0, TAU);
  ctx.fillStyle = '#FFF9ED';
  ctx.fill();
  ctx.strokeStyle = '#FFC94A';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, 244, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = '#8A6B45';
  ctx.font = '700 34px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DESTINY', cx, cy + 166);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export async function createScene({ container, onTileTap, onHoverTile }) {
  try {
    await Promise.all([
      document.fonts.load('700 52px Fredoka'),
      document.fonts.load('600 28px Nunito'),
      document.fonts.load('700 38px Fredoka'),
    ]);
    await document.fonts.ready;
  } catch {
    /* Fonts are a nicety; the game still works without them. */
  }

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-label', '3D game board');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#D8EEFF', 46, 120);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 260);
  camera.position.set(0, 24, 26);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.minDistance = 10;
  controls.maxDistance = 90;
  controls.minPolarAngle = 0.32;
  controls.maxPolarAngle = 1.3;
  controls.rotateSpeed = 0.62;
  controls.zoomSpeed = 0.8;
  controls.autoRotateSpeed = 0.45;
  controls.target.set(0, 0.5, 0);

  const timeUniform = { value: 0 };
  const sunDirection = new THREE.Vector3(0.55, 0.4, 0.72).normalize();

  // Sky dome ---------------------------------------------------------------
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(150, 32, 18),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        topColor: { value: new THREE.Color('#79C3F2') },
        midColor: { value: new THREE.Color('#BFE8FF') },
        bottomColor: { value: new THREE.Color('#FFF0D3') },
        sunDir: { value: sunDirection },
      },
      vertexShader: `
        varying vec3 vWorld;
        void main() {
          vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorld;
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        uniform vec3 sunDir;
        void main() {
          vec3 dir = normalize(vWorld);
          float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 color = mix(bottomColor, midColor, smoothstep(0.35, 0.58, h));
          color = mix(color, topColor, smoothstep(0.58, 0.95, h));
          float sun = pow(max(dot(dir, sunDir), 0.0), 40.0);
          color = mix(color, vec3(1.0, 0.86, 0.62), sun * 0.65);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
  );
  sky.frustumCulled = false;
  scene.add(sky);

  // Lights -----------------------------------------------------------------
  const hemi = new THREE.HemisphereLight('#FFF4DE', '#9BBF92', 1.05);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight('#FFF1D6', 2.45);
  sun.position.set(13, 19, 11);
  sun.castShadow = true;
  const shadowSize = window.innerWidth < 760 ? 1536 : 2048;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.025;
  scene.add(sun);

  const fill = new THREE.DirectionalLight('#A7CEFF', 0.55);
  fill.position.set(-12, 8, -10);
  scene.add(fill);

  const treeLight = new THREE.PointLight('#FFD277', 9, 10, 2);
  treeLight.position.set(0, 3.2, -1.2);
  scene.add(treeLight);

  // Island -----------------------------------------------------------------
  const island = new THREE.Group();
  scene.add(island);

  addMesh(island, new RoundedBoxGeometry(20.8, 0.38, 20.8, 4, 0.55), mat('#F8E6C6', { rough: 0.92 }), [0, 0.01, 0]);
  addMesh(island, new RoundedBoxGeometry(21.5, 0.52, 21.5, 4, 0.62), mat('#E98262', { rough: 0.85 }), [0, -0.25, 0]);
  addMesh(island, new RoundedBoxGeometry(20.7, 0.95, 20.7, 4, 0.6), mat('#B96B4A', { rough: 0.95 }), [0, -0.78, 0]);

  const rock = addMesh(island, new THREE.ConeGeometry(9.6, 6.8, 9), mat('#8B6B5A', { rough: 1 }), [0, -4.55, 0], [Math.PI, 0.3, 0]);
  rock.castShadow = false;
  const rock2 = addMesh(island, new THREE.ConeGeometry(5.4, 4.6, 7), mat('#7A5C4D', { rough: 1 }), [5.2, -3.3, -4.4], [Math.PI, 0.9, 0]);
  rock2.castShadow = false;
  const rock3 = addMesh(island, new THREE.ConeGeometry(4.2, 3.8, 6), mat('#7A5C4D', { rough: 1 }), [-5.6, -3.1, 4.2], [Math.PI, 1.4, 0]);
  rock3.castShadow = false;

  // Hanging vines
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU + 0.3;
    const r = 9.3 + Math.sin(i * 2.1) * 0.6;
    const h = 0.7 + (i % 4) * 0.35;
    addMesh(
      island,
      new THREE.CylinderGeometry(0.018, 0.012, h, 4),
      mat('#4E9B5E', { rough: 1 }),
      [Math.cos(a) * r, -0.95 - h / 2, Math.sin(a) * r],
      [Math.sin(a) * 0.08, 0, Math.cos(a) * 0.08],
    );
  }

  // Park -------------------------------------------------------------------
  const park = new THREE.Group();
  park.position.y = PARK_TOP;
  scene.add(park);

  addMesh(park, new RoundedBoxGeometry(12.9, 0.1, 12.9, 4, 0.3), mat('#F2D8A7', { rough: 0.95 }), [0, -0.06, 0]);
  addMesh(park, new RoundedBoxGeometry(12.35, 0.09, 12.35, 4, 0.3), mat('#8ED081', { rough: 0.95 }), [0, 0.01, 0]);

  // Paths
  const pathMat = mat('#F4DFB6', { rough: 0.95 });
  addMesh(park, box(1.2, 0.035, 3.1, 0.14), pathMat, [0, 0.06, 4.55]);
  addMesh(park, box(3.4, 0.035, 1.1, 0.14), pathMat, [0, 0.06, 2.0]);
  addMesh(park, new THREE.CircleGeometry(2.1, 24), pathMat, [0, 0.062, 0.2], [-Math.PI / 2, 0, 0]);

  // Central hill + life tree
  const hill = new THREE.Group();
  park.add(hill);
  addMesh(hill, new THREE.CylinderGeometry(2.1, 2.5, 0.5, 24), mat('#7BC46F', { rough: 1 }), [0, 0.2, -1.2]);
  addMesh(hill, new THREE.CylinderGeometry(0.32, 0.48, 1.8, 9), mat('#8A5A3B', { rough: 1 }), [0, 1.25, -1.2]);
  const foliageColors = ['#5DBB72', '#6ECB7F', '#4CA862'];
  const foliagePositions = [
    [0, 2.5, -1.2, 1.05],
    [-0.7, 2.2, -0.9, 0.72],
    [0.75, 2.3, -1.0, 0.78],
    [-0.25, 2.95, -1.35, 0.7],
    [0.4, 2.8, -1.6, 0.62],
    [-0.55, 2.75, -1.6, 0.56],
  ];
  foliagePositions.forEach(([x, y, z, r], i) => {
    addMesh(hill, new THREE.IcosahedronGeometry(r, 1), mat(foliageColors[i % 3], { rough: 0.9 }), [x, y, z]);
  });
  addMesh(hill, new THREE.TorusGeometry(2.35, 0.06, 6, 40), mat('#FFD166', { rough: 0.4, metal: 0.35 }), [0, 0.45, -1.2], [Math.PI / 2, 0, 0]);

  const orbs = new THREE.Group();
  orbs.position.set(0, 2.3, -1.2);
  hill.add(orbs);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    addMesh(
      orbs,
      new THREE.SphereGeometry(0.09, 10, 8),
      mat(i % 2 ? '#FFE08A' : '#FFF6D8', { emissive: '#FFD166', emissiveIntensity: 1.4, rough: 0.3 }),
      [Math.cos(a) * 1.8, Math.sin(i * 1.7) * 0.35, Math.sin(a) * 1.8],
    );
  }

  // Sign
  const signGroup = new THREE.Group();
  signGroup.position.set(-4.35, 0.03, -4.45);
  signGroup.rotation.y = 0.38;
  park.add(signGroup);
  for (const x of [-1.35, 1.35]) {
    addMesh(signGroup, new THREE.CylinderGeometry(0.07, 0.09, 1.75, 7), mat('#8A5A3B', { rough: 1 }), [x, 0.875, 0]);
  }
  const signPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 1.35),
    new THREE.MeshStandardMaterial({ map: makeSignTexture(), roughness: 0.9 }),
  );
  signPlane.position.set(0, 1.72, 0.055);
  signPlane.castShadow = true;
  signGroup.add(signPlane);

  // Pond
  const pond = new THREE.Group();
  pond.position.set(4.1, 0.06, -3.5);
  park.add(pond);
  addMesh(pond, new THREE.CircleGeometry(1.35, 26), mat('#6EC6E8', { rough: 0.18, metal: 0.15 }), [0, 0, 0], [-Math.PI / 2, 0, 0]);
  addMesh(pond, new THREE.TorusGeometry(1.38, 0.08, 5, 26), mat('#D9BE93', { rough: 1 }), [0, 0.015, 0], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU;
    addMesh(pond, new THREE.SphereGeometry(0.12, 6, 4), mat('#B8A58B', { rough: 1 }), [Math.cos(a) * 1.45, 0.04, Math.sin(a) * 1.45]);
  }
  for (let i = 0; i < 3; i++) {
    addMesh(pond, new THREE.CylinderGeometry(0.15, 0.15, 0.02, 8), mat('#59C08A', { rough: 0.8 }), [-0.4 + i * 0.35, 0.02, -0.2 + i * 0.25]);
  }
  addMesh(pond, new THREE.CapsuleGeometry(0.07, 0.18, 3, 8), mat('#FF9F43', { rough: 0.5 }), [0.35, 0.04, 0.2], [0, 0, Math.PI / 2]);

  // Benches, lamps, trees
  const benchA = makeBench();
  benchA.position.set(-4.6, 0.06, 1.9);
  benchA.rotation.y = Math.PI / 2;
  park.add(benchA);
  const benchB = makeBench();
  benchB.position.set(4.6, 0.06, 1.9);
  benchB.rotation.y = -Math.PI / 2;
  park.add(benchB);

  const treeSpots = [
    [-4.5, 0.06, -2.7, 1.0],
    [3.9, 0.06, 2.9, 0.78],
    [-3.0, 0.06, 4.2, 0.72],
    [5.0, 0.06, 4.5, 0.6],
    [-5.0, 0.06, 4.3, 0.55],
  ];
  for (const [x, y, z, s] of treeSpots) {
    const tree = makeTree(s, s > 0.9 ? '#4FAF6A' : '#68C078');
    tree.position.set(x, y, z);
    park.add(tree);
  }

  const lampSpots = [
    [-5.1, 0.06, 5.1],
    [5.1, 0.06, 5.1],
    [-5.1, 0.06, -5.1],
    [5.1, 0.06, -5.1],
  ];
  for (const [x, y, z] of lampSpots) {
    const lamp = makeLamp();
    lamp.position.set(x, y, z);
    park.add(lamp);
  }

  // Flowers
  const flowerColors = ['#F08BAD', '#FFC44D', '#5B8DEF', '#FFF6E6'];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * TAU + 0.2;
    const r = 5.2 + Math.sin(i * 3.1) * 0.5;
    addMesh(
      park,
      new THREE.SphereGeometry(0.055, 5, 4),
      mat(flowerColors[i % flowerColors.length], { rough: 0.7 }),
      [Math.cos(a) * r, 0.1, Math.sin(a) * r],
    );
  }

  // Dice tray
  const tray = new THREE.Group();
  tray.position.set(0, 0.06, 3.75);
  park.add(tray);
  addMesh(tray, new THREE.CylinderGeometry(1.55, 1.6, 0.1, 40), mat('#F8E6C6', { rough: 0.85 }), [0, 0, 0]);
  addMesh(tray, new THREE.TorusGeometry(1.55, 0.06, 8, 48), mat('#FFC94A', { rough: 0.35, metal: 0.4 }), [0, 0.06, 0], [Math.PI / 2, 0, 0]);
  const trayFace = new THREE.Mesh(
    new THREE.CircleGeometry(1.5, 48),
    new THREE.MeshBasicMaterial({ map: makeTrayTexture(), transparent: true }),
  );
  trayFace.rotation.x = -Math.PI / 2;
  trayFace.position.y = 0.056;
  tray.add(trayFace);

  // Tiles ------------------------------------------------------------------
  const tileMeshes = [];
  const tileGroups = new Map();
  const ownerSignatures = new Map();
  const houseGroups = new Map();
  const markers = new Map();

  const tileBaseGeo = new RoundedBoxGeometry(TILE_SIZE, 0.26, TILE_SIZE, 3, 0.07);
  const topGeo = new THREE.PlaneGeometry(TILE_SIZE - 0.06, TILE_SIZE - 0.06);

  TILES.forEach((tile, index) => {
    const district = DISTRICTS[tile.district];
    const group = new THREE.Group();
    group.position.copy(TILE_POS[index]);
    group.position.y = 0.33;
    group.userData.tileId = tile.id;

    const baseMat = mat(district.color, { rough: 0.88 });
    const base = new THREE.Mesh(tileBaseGeo, baseMat);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const texture = createTileTexture(tile);
    const topMat = new THREE.MeshBasicMaterial({ map: texture });
    const top = new THREE.Mesh(topGeo, topMat);
    top.rotation.x = -Math.PI / 2;
    top.position.y = 0.136;
    top.userData.tileId = tile.id;
    group.add(top);

    // A small raised lip makes the tiles read as physical pieces.
    const lip = new THREE.Mesh(
      new THREE.TorusGeometry(TILE_SIZE * 0.49, 0.018, 4, 4),
      mat(district.dark, { rough: 0.7 }),
    );
    lip.rotation.x = Math.PI / 2;
    lip.rotation.z = Math.PI / 4;
    lip.position.y = 0.132;
    group.add(lip);

    island.add(group);
    tileMeshes.push(top);
    tileGroups.set(tile.id, { group, top, base, texture, topMat, district });

    if (tile.type !== 'property') {
      const prop = makeTileProp(tile, district.color);
      const outer = TILE_POS[index].clone().normalize();
      prop.position.copy(TILE_POS[index]).addScaledVector(outer, 0.44);
      prop.position.y = TILE_TOP + 0.005;
      prop.scale.setScalar(0.9);
      prop.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
      island.add(prop);
    }
  });

  // Ownership markers (a little flag on the outer corner of each property).
  for (const tile of TILES) {
    if (tile.type !== 'property') continue;
    const marker = new THREE.Group();
    const outer = TILE_POS[tile.id].clone().normalize();
    marker.position.copy(TILE_POS[tile.id]).addScaledVector(outer, 0.46);
    marker.position.y = TILE_TOP + 0.02;
    marker.rotation.y = Math.atan2(outer.x, outer.z);
    marker.visible = false;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 5), mat('#FFF6E6', { rough: 0.6 }));
    pole.position.y = 0.25;
    pole.castShadow = true;
    marker.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.18), new THREE.MeshBasicMaterial({ color: '#FFFFFF', side: THREE.DoubleSide }));
    flag.position.set(0.14, 0.42, 0);
    marker.add(flag);
    marker.userData.flag = flag;
    island.add(marker);
    markers.set(tile.id, marker);
  }

  // Active player ring
  const activeRing = new THREE.Mesh(
    new THREE.RingGeometry(0.72, 0.86, 40),
    new THREE.MeshBasicMaterial({ color: '#FF7A6B', transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
  );
  activeRing.rotation.x = -Math.PI / 2;
  activeRing.position.y = TILE_TOP + 0.012;
  activeRing.visible = false;
  island.add(activeRing);

  // Clouds -----------------------------------------------------------------
  const clouds = [];
  const cloudMat = mat('#FFFFFF', { rough: 1, flat: false, emissive: '#FFFFFF', emissiveIntensity: 0.22 });
  for (let i = 0; i < 16; i++) {
    const cloud = makeCloud(1.6 + (i % 5) * 0.8);
    const a = (i / 16) * TAU + i * 0.17;
    const r = 24 + (i % 6) * 3.5;
    cloud.position.set(Math.cos(a) * r, 4 + (i % 7) * 1.7, Math.sin(a) * r);
    cloud.userData = { a, r, y: cloud.position.y, speed: 0.008 + (i % 4) * 0.003, phase: i * 0.7, layer: 1 };
    cloud.traverse((c) => {
      if (c.isMesh) c.material = cloudMat;
    });
    scene.add(cloud);
    clouds.push(cloud);
  }
  for (let i = 0; i < 12; i++) {
    const cloud = makeCloud(2.5 + (i % 4) * 1.2);
    const a = (i / 12) * TAU + 0.5;
    const r = 16 + (i % 5) * 5;
    cloud.position.set(Math.cos(a) * r, -7 - (i % 4) * 1.5, Math.sin(a) * r);
    cloud.userData = { a, r, y: cloud.position.y, speed: 0.004, phase: i, layer: 2 };
    scene.add(cloud);
    clouds.push(cloud);
  }

  // Distant floating islands
  const islands = [];
  for (const [x, y, z, s] of [
    [-18, 3.5, -15, 1.1],
    [19, 1.2, -10, 0.8],
    [17, 4.5, 15, 0.65],
  ]) {
    const mini = new THREE.Group();
    mini.position.set(x, y, z);
    mini.scale.setScalar(s);
    addMesh(mini, new THREE.CylinderGeometry(2.4, 2.6, 0.6, 8), mat('#8ED081', { rough: 1 }), [0, 0, 0]);
    addMesh(mini, new THREE.ConeGeometry(2.4, 3.4, 8), mat('#8B6B5A', { rough: 1 }), [0, -1.9, 0], [Math.PI, 0, 0]);
    const t = makeTree(0.9, '#5DBB72');
    t.position.set(0.2, 0.3, 0);
    mini.add(t);
    scene.add(mini);
    islands.push(mini);
  }

  // Dice -------------------------------------------------------------------
  const faceValues = [3, 4, 1, 6, 2, 5];
  const diceMaterials = faceValues.map((v) => new THREE.MeshStandardMaterial({ map: makeDiceFaceTexture(v), roughness: 0.55, metalness: 0 }));
  const die = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.62, 0.62, 4, 0.09), diceMaterials);
  const diceBase = new THREE.Vector3(0, PARK_TOP + 0.42, 3.75);
  die.position.copy(diceBase);
  die.castShadow = true;
  die.receiveShadow = true;
  scene.add(die);
  const diceShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.34, 20),
    new THREE.MeshBasicMaterial({ color: '#4B3B2A', transparent: true, opacity: 0.18, depthWrite: false }),
  );
  diceShadow.rotation.x = -Math.PI / 2;
  diceShadow.position.set(0, PARK_TOP + 0.115, 3.75);
  scene.add(diceShadow);

  // Pawns ------------------------------------------------------------------
  const pawns = new Map();
  let pawnSignature = '';
  const pawnSpots = {
    1: [[0, 0]],
    2: [
      [-0.3, -0.02],
      [0.3, -0.02],
    ],
    3: [
      [-0.32, -0.2],
      [0.32, -0.2],
      [0, 0.28],
    ],
    4: [
      [-0.32, -0.22],
      [0.32, -0.22],
      [-0.32, 0.22],
      [0.32, 0.22],
    ],
  };
  const retiredSpots = [
    [-5.0, 2.8],
    [-5.0, 3.55],
    [5.0, 2.8],
    [5.0, 3.55],
  ];
  let playerCount = 1;

  function pawnOffset(playerId) {
    const spots = pawnSpots[playerCount] || pawnSpots[4];
    return spots[playerId] || spots[0];
  }

  function tilePosition(tileId) {
    return TILE_POS[tileId].clone();
  }

  function setPawnInstant(playerId, statePlayer) {
    const pawn = pawns.get(playerId);
    if (!pawn) return;
    if (statePlayer.retired || statePlayer.bankrupt) {
      if (statePlayer.bankrupt) {
        pawn.visible = false;
        return;
      }
      const [x, z] = retiredSpots[playerId] || retiredSpots[0];
      pawn.position.set(x, PARK_TOP + 0.02, z);
      pawn.rotation.y = Math.atan2(-x, -z);
      pawn.visible = true;
      return;
    }
    pawn.visible = true;
    const [ox, oz] = pawnOffset(playerId);
    const pos = tilePosition(statePlayer.position);
    pawn.position.set(pos.x + ox, TILE_TOP + 0.02, pos.z + oz);
  }

  // Interaction ------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerStart = null;
  let interactive = false;
  let hovered = null;

  function pickTile(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(tileMeshes, false);
    return hits.length ? hits[0].object.userData.tileId : null;
  }

  function onPointerDown(event) {
    pointerStart = { x: event.clientX, y: event.clientY, t: performance.now() };
  }

  function onPointerUp(event) {
    if (!pointerStart || !interactive) return;
    const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    const elapsed = performance.now() - pointerStart.t;
    pointerStart = null;
    if (moved > 9 || elapsed > 700) return;
    const tileId = pickTile(event.clientX, event.clientY);
    if (tileId !== null && onTileTap) onTileTap(tileId);
  }

  let hoverFrame = 0;
  function onPointerMove(event) {
    if (!interactive || window.matchMedia('(pointer: coarse)').matches) return;
    if (hoverFrame) return;
    hoverFrame = requestAnimationFrame(() => {
      hoverFrame = 0;
      const tileId = pickTile(event.clientX, event.clientY);
      if (tileId === hovered) return;
      hovered = tileId;
      renderer.domElement.style.cursor = tileId === null ? 'grab' : 'pointer';
      if (onHoverTile) onHoverTile(tileId);
    });
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointermove', onPointerMove);

  // Tweens, particles ------------------------------------------------------
  const tweens = [];
  function tween(duration, update, ease = easeOutCubic) {
    return new Promise((resolve) => {
      tweens.push({ start: performance.now(), duration: duration * 1000, update, resolve, ease });
    });
  }

  const particleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.025, 8);
  const particleMats = new Map();
  const particles = [];
  function getParticleMat(color) {
    if (!particleMats.has(color)) {
      particleMats.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3, emissive: color, emissiveIntensity: 0.2 }));
    }
    return particleMats.get(color);
  }

  function burstAt(position, color = '#FFC94A', count = 10, power = 2.4) {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(particleGeometry, getParticleMat(color));
      mesh.position.copy(position);
      mesh.position.y += 0.4;
      mesh.rotation.set(Math.random() * TAU, Math.random() * TAU, Math.random() * TAU);
      scene.add(mesh);
      const a = Math.random() * TAU;
      const speed = power * (0.4 + Math.random() * 0.7);
      particles.push({
        mesh,
        vx: Math.cos(a) * speed * 0.5,
        vz: Math.sin(a) * speed * 0.5,
        vy: 2.2 + Math.random() * power,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.5,
      });
    }
  }

  // Camera -----------------------------------------------------------------
  let baseRadius = 30;
  let desiredTarget = new THREE.Vector3(0, 0.5, 0);
  let radiusAnim = null;
  let autoRotate = false;
  let portrait = false;
  let lastWidth = 0;
  let lastHeight = 0;

  function computeFit(aspect) {
    const vFov = portrait ? 50 : 40;
    camera.fov = vFov;
    const tanV = Math.tan(THREE.MathUtils.degToRad(vFov / 2));
    const tanH = tanV * aspect;
    const polar = portrait ? 0.68 : 0.86;
    const sinPolar = Math.sin(polar);
    const cosPolar = Math.cos(polar);
    const halfSpan = BOARD_HALF + 0.55;
    const nearSpan = BOARD_HALF + 0.4;
    // The near edge of the board sits much closer to the camera than the
    // centre, so a flat width/depth fit crops the corners. Solve for the
    // distance that keeps those near corners inside the safe frame.
    const safety = portrait ? 0.99 : 0.94;
    const widthFit = nearSpan * sinPolar + halfSpan / (safety * tanH);
    const heightFit = nearSpan * sinPolar + (nearSpan * cosPolar) / (safety * tanV);
    return Math.max(widthFit, heightFit) * 1.015;
  }

  function applyViewport(force = false) {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    if (!force && w === lastWidth && h === lastHeight) return;
    lastWidth = w;
    lastHeight = h;
    portrait = w / h < 0.92;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, portrait ? 2 : 2));
    camera.aspect = w / h;
    baseRadius = computeFit(w / h);
    for (const cloud of clouds) {
      const backLayer = cloud.userData.layer === 2;
      cloud.visible = !portrait || !backLayer;
      cloud.scale.setScalar(portrait ? (backLayer ? 0.5 : 0.62) : 1);
    }
    camera.updateProjectionMatrix();
    if (force) {
      radiusAnim = { from: camera.position.distanceTo(controls.target), to: baseRadius, start: performance.now(), duration: 500 };
    } else {
      radiusAnim = { from: camera.position.distanceTo(controls.target), to: baseRadius, start: performance.now(), duration: 0 };
    }
    controls.maxDistance = baseRadius * 1.7;
    controls.minDistance = baseRadius * 0.42;
  }

  applyViewport(true);
  camera.position.set(0, baseRadius * Math.cos(0.86), baseRadius * Math.sin(0.86));

  const resizeObserver = new ResizeObserver(() => applyViewport());
  resizeObserver.observe(container);

  function setRadius(target, duration = 800) {
    radiusAnim = {
      from: camera.position.distanceTo(controls.target),
      to: target,
      start: performance.now(),
      duration,
    };
  }

  function focusPlayer(playerId, state) {
    const player = state.players[playerId];
    if (!player) return;
    if (player.retired || player.bankrupt) {
      desiredTarget.set(0, 0.5, 0);
      setRadius(baseRadius, 900);
      return;
    }
    desiredTarget.set(0, -2.8, 0);
    setRadius(baseRadius * (portrait ? 1 : 0.98), 900);
  }

  function resetView(animate = true) {
    desiredTarget.set(0, 0.5, 0);
    setRadius(baseRadius, animate ? 800 : 0);
  }

  // Public actions ---------------------------------------------------------
  async function rollDice(value) {
    const finalQuats = {
      1: new THREE.Quaternion(),
      2: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
      3: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)),
      4: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2)),
      5: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)),
      6: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0)),
    };
    const finalQ = finalQuats[value].clone();
    finalQ.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * TAU));
    const startQ = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(Math.random() * TAU, Math.random() * TAU, Math.random() * TAU),
    );
    const startPos = die.position.clone();
    const spinAxis = new THREE.Vector3(Math.random() - 0.5, Math.random() * 2 - 1, Math.random() - 0.5).normalize();
    await tween(0.9, (t) => {
      const ease = easeOutCubic(t);
      die.position.x = THREE.MathUtils.lerp(startPos.x, diceBase.x, ease);
      die.position.z = THREE.MathUtils.lerp(startPos.z, diceBase.z, ease);
      die.position.y = diceBase.y + Math.sin(t * Math.PI) * 2.1 + (1 - t) * 0.2;
      const q = startQ.clone().slerp(finalQ, ease);
      const spin = new THREE.Quaternion().setFromAxisAngle(spinAxis, (1 - t) * Math.PI * 5);
      die.quaternion.copy(spin).multiply(q);
      die.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.06);
    });
    die.position.copy(diceBase);
    die.quaternion.copy(finalQ);
    die.scale.setScalar(1);
    await tween(0.18, (t) => {
      const bounce = Math.sin(t * Math.PI) * 0.12;
      die.position.y = diceBase.y + bounce;
      die.scale.set(1 + bounce * 0.6, 1 - bounce * 1.2, 1 + bounce * 0.6);
    });
    die.scale.setScalar(1);
    die.position.copy(diceBase);
  }

  async function movePawn(playerId, path, state) {
    const pawn = pawns.get(playerId);
    if (!pawn) return;
    const [ox, oz] = pawnOffset(playerId);
    let previous = pawn.position.clone();
    for (const tileId of path) {
      const target = tilePosition(tileId);
      const to = new THREE.Vector3(target.x + ox, TILE_TOP + 0.02, target.z + oz);
      const from = previous.clone();
      const dir = to.clone().sub(from);
      const angle = Math.atan2(dir.x, dir.z);
      await tween(0.24, (t) => {
        const ease = easeInOutCubic(t);
        pawn.position.x = THREE.MathUtils.lerp(from.x, to.x, ease);
        pawn.position.z = THREE.MathUtils.lerp(from.z, to.z, ease);
        pawn.position.y = TILE_TOP + 0.02 + Math.sin(t * Math.PI) * 0.34;
        pawn.rotation.y = angle;
        const squash = 1 + Math.sin(t * Math.PI) * 0.08;
        pawn.scale.set(1 / squash, squash, 1 / squash);
      });
      pawn.position.copy(to);
      pawn.scale.set(1, 1, 1);
      await tween(0.08, (t) => {
        pawn.position.y = TILE_TOP + 0.02 + Math.sin(t * Math.PI) * 0.04;
      });
      previous = to;
      if (tileId === 0) burstAt(new THREE.Vector3(to.x, TILE_TOP, to.z), '#FFC94A', 8, 1.8);
    }
    // Face the camera on arrival.
    await tween(0.25, (t) => {
      pawn.rotation.y = THREE.MathUtils.lerp(pawn.rotation.y, 0, t);
    });
    pawn.rotation.y = 0;
    pawn.position.y = TILE_TOP + 0.02;
    const player = state.players[playerId];
    if (player?.retired) setPawnInstant(playerId, player);
  }

  async function retirePawn(playerId, state) {
    const pawn = pawns.get(playerId);
    if (!pawn) return;
    const [x, z] = retiredSpots[playerId] || retiredSpots[0];
    const from = pawn.position.clone();
    const to = new THREE.Vector3(x, PARK_TOP + 0.02, z);
    const angle = Math.atan2(-x, -z);
    await tween(1.1, (t) => {
      const ease = easeInOutCubic(t);
      pawn.position.lerpVectors(from, to, ease);
      pawn.position.y += Math.sin(t * Math.PI) * 0.5;
      pawn.rotation.y = THREE.MathUtils.lerp(0, angle, ease);
    });
    pawn.position.copy(to);
    pawn.rotation.y = angle;
    burstAt(to, '#FFD166', 12, 2);
  }

  function updateState(state, { instant = false } = {}) {
    playerCount = state.players.length;

    // Create pawns on first render.
    const signature = state.players.map((p) => `${p.color}:${p.colorDark}`).join('|');
    if (pawns.size !== state.players.length || signature !== pawnSignature) {
      pawnSignature = signature;
      for (const pawn of pawns.values()) island.remove(pawn);
      pawns.clear();
      state.players.forEach((player, index) => {
        const pawn = makePawn({ color: player.color, dark: player.colorDark || '#333333' }, index);
        island.add(pawn);
        pawns.set(index, pawn);
        setPawnInstant(index, player);
      });
    }

    state.players.forEach((player, index) => {
      const pawn = pawns.get(index);
      if (!pawn) return;
      if (instant) setPawnInstant(index, player);
      if (player.bankrupt) pawn.visible = false;
      else pawn.visible = true;
    });

    // Ownership visuals
    for (const tile of TILES) {
      if (tile.type !== 'property') continue;
      const own = state.owners[tile.id];
      const owner = own ? state.players[own.owner] : null;
      const groupComplete = own ? (GROUP_TILES[tile.district] || []).every((id) => state.owners[id]?.owner === own.owner) : false;
      const signature = `${own?.owner ?? 'none'}:${own?.level ?? 0}:${groupComplete}`;
      if (ownerSignatures.get(tile.id) === signature) continue;
      ownerSignatures.set(tile.id, signature);

      const tileData = tileGroups.get(tile.id);
      const oldTexture = tileData.texture;
      tileData.texture = createTileTexture(tile, owner ? owner.color : null, groupComplete);
      tileData.topMat.map = tileData.texture;
      tileData.topMat.needsUpdate = true;
      oldTexture.dispose();

      // Buildings
      const existing = houseGroups.get(tile.id);
      if (existing) {
        island.remove(existing);
        houseGroups.delete(tile.id);
      }
      if (own && owner) {
        const house = makeHouse(own.level, owner.color, owner.colorDark || '#333333');
        const outer = TILE_POS[tile.id].clone().normalize();
        house.position.copy(TILE_POS[tile.id]).addScaledVector(outer, 0.44);
        house.position.y = TILE_TOP + 0.005;
        house.rotation.y = Math.atan2(-outer.x, -outer.z);
        house.scale.setScalar(own.level === 3 ? 0.92 : 1);
        island.add(house);
        houseGroups.set(tile.id, house);
      }

      // Marker
      const marker = markers.get(tile.id);
      if (marker) {
        marker.visible = Boolean(own);
        if (own && owner) marker.userData.flag.material.color.set(owner.color);
      }
    }

    // Active ring
    const active = state.players[state.current];
    if (active && !active.retired && !active.bankrupt && state.phase !== 'ended') {
      const pos = tilePosition(active.position);
      activeRing.position.set(pos.x, TILE_TOP + 0.012, pos.z);
      activeRing.material.color.set(active.color);
      activeRing.visible = true;
    } else {
      activeRing.visible = false;
    }

    if (instant) {
      desiredTarget.set(0, 0.5, 0);
    }
  }

  function setActiveRing(playerId, state) {
    const player = state.players[playerId];
    if (!player) return;
    const pos = tilePosition(player.position);
    activeRing.position.set(pos.x, TILE_TOP + 0.012, pos.z);
    activeRing.material.color.set(player.color);
    activeRing.visible = !player.retired && !player.bankrupt;
  }

  function setInteractive(value) {
    interactive = value;
    renderer.domElement.style.cursor = value ? 'grab' : 'default';
  }

  function setAutoRotate(value) {
    autoRotate = value;
    controls.autoRotate = value;
  }

  function projectTile(tileId) {
    const v = TILE_POS[tileId].clone();
    v.y = TILE_TOP + 0.4;
    v.project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * lastWidth,
      y: (-v.y * 0.5 + 0.5) * lastHeight,
      visible: v.z < 1,
    };
  }

  function burstTile(tileId, color = '#FFC94A', count = 10, power = 2.4) {
    burstAt(TILE_POS[tileId].clone().setY(TILE_TOP), color, count, power);
  }

  function celebrate() {
    for (let i = 0; i < 8; i++) {
      const tileId = Math.floor(Math.random() * TILE_COUNT);
      burstAt(TILE_POS[tileId].clone().setY(TILE_TOP), ['#FFC94A', '#F08BAD', '#5B8DEF', '#59C08A'][i % 4], 8, 3);
    }
  }

  // Animation loop ---------------------------------------------------------
  let last = performance.now();
  let elapsed = 0;

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    elapsed += dt;
    timeUniform.value = elapsed;

    // Tweens
    for (let i = tweens.length - 1; i >= 0; i--) {
      const item = tweens[i];
      const t = Math.min(1, (now - item.start) / Math.max(1, item.duration));
      item.update(item.ease(t), t);
      if (t >= 1) {
        tweens.splice(i, 1);
        item.resolve();
      }
    }

    // Idle pawn bob
    for (const [id, pawn] of pawns) {
      if (!pawn.visible) continue;
      const visual = pawn.userData.visual;
      visual.position.y = Math.sin(elapsed * 1.8 + pawn.userData.phase) * 0.018;
      visual.rotation.z = Math.sin(elapsed * 1.2 + pawn.userData.phase) * 0.015;
    }

    // Orbiting life orbs
    orbs.rotation.y = elapsed * 0.35;
    orbs.children.forEach((orb, i) => {
      orb.position.y = Math.sin(elapsed * 1.1 + i * 1.7) * 0.35;
    });

    // Clouds
    for (const cloud of clouds) {
      const data = cloud.userData;
      const a = data.a + elapsed * data.speed;
      cloud.position.x = Math.cos(a) * data.r;
      cloud.position.z = Math.sin(a) * data.r;
      cloud.position.y = data.y + Math.sin(elapsed * 0.25 + data.phase) * 0.35;
    }

    // Distant islands bob
    islands.forEach((islandMesh, i) => {
      islandMesh.position.y += Math.sin(elapsed * 0.5 + i * 2) * 0.0015;
      islandMesh.rotation.y += dt * 0.01 * (i % 2 ? 1 : -1);
    });

    // Active ring pulse
    if (activeRing.visible) {
      const s = 1 + Math.sin(elapsed * 3.2) * 0.05;
      activeRing.scale.setScalar(s);
      activeRing.material.opacity = 0.65 + Math.sin(elapsed * 3.2) * 0.2;
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      p.vy -= 9.5 * dt;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.mesh.rotation.x += dt * 8;
      p.mesh.rotation.y += dt * 6;
      const life = p.life / p.maxLife;
      p.mesh.scale.setScalar(Math.max(0.001, 1 - life * life));
      if (p.life >= p.maxLife) {
        scene.remove(p.mesh);
        particles.splice(i, 1);
      }
    }

    // Camera follow + radius animation
    const prev = controls.target.clone();
    controls.target.lerp(desiredTarget, 1 - Math.exp(-4.2 * dt));
    const delta = controls.target.clone().sub(prev);
    camera.position.add(delta);

    if (radiusAnim) {
      const t = Math.min(1, (now - radiusAnim.start) / Math.max(1, radiusAnim.duration));
      const dist = camera.position.distanceTo(controls.target);
      const wanted = THREE.MathUtils.lerp(radiusAnim.from, radiusAnim.to, easeOutCubic(t));
      if (Math.abs(wanted - dist) > 0.001) {
        const dir = camera.position.clone().sub(controls.target).normalize();
        const next = t >= 1 ? wanted : THREE.MathUtils.lerp(dist, wanted, 0.25);
        camera.position.copy(controls.target).addScaledVector(dir, next);
      }
      if (t >= 1) radiusAnim = null;
    }

    diceShadow.position.set(die.position.x, PARK_TOP + 0.115, die.position.z);
    const height = Math.max(0, die.position.y - diceBase.y);
    diceShadow.scale.setScalar(Math.max(0.45, 1 - height * 0.14));
    diceShadow.material.opacity = Math.max(0.06, 0.2 - height * 0.025);

    controls.autoRotate = autoRotate;
    controls.update();
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(frame);

  // Handle WebGL context loss gracefully.
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    console.warn('WebGL context lost');
  });

  function dispose() {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    controls.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return {
    renderer,
    scene,
    camera,
    updateState,
    setActiveRing,
    focusPlayer,
    resetView,
    movePawn,
    rollDice,
    retirePawn,
    burstAt,
    burstTile,
    projectTile,
    setInteractive,
    setAutoRotate,
    celebrate,
    dispose,
    getBaseRadius: () => baseRadius,
  };
}
