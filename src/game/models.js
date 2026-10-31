import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const TAU = Math.PI * 2;
const materialCache = new Map();

export function mat(color, { rough = 0.82, metal = 0, emissive = null, emissiveIntensity = 1, flat = true, transparent = false, opacity = 1 } = {}) {
  const key = `${color}|${rough}|${metal}|${emissive}|${emissiveIntensity}|${flat}|${transparent}|${opacity}`;
  if (!materialCache.has(key)) {
    materialCache.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: rough,
        metalness: metal,
        flatShading: flat,
        transparent,
        opacity,
        ...(emissive ? { emissive, emissiveIntensity } : {}),
      }),
    );
  }
  return materialCache.get(key);
}

export function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function box(w, h, d, radius = 0.03) {
  return radius > 0 ? new RoundedBoxGeometry(w, h, d, 2, radius) : new THREE.BoxGeometry(w, h, d);
}

function cylinder(rTop, rBottom, h, segments = 10) {
  return new THREE.CylinderGeometry(rTop, rBottom, h, segments);
}

function sphere(r, detail = 1) {
  return new THREE.IcosahedronGeometry(r, detail);
}

// ---------------------------------------------------------------------------
// Pawns
// ---------------------------------------------------------------------------

export function makePawn(style, index) {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  addMesh(body, cylinder(0.26, 0.29, 0.055, 18), mat(style.dark, { rough: 0.6 }), [0, 0.03, 0]);
  addMesh(body, new THREE.CapsuleGeometry(0.135, 0.2, 4, 10), mat(style.color, { rough: 0.65 }), [0, 0.35, 0]);
  addMesh(body, sphere(0.16, 2), mat('#FFD9B8', { rough: 0.7 }), [0, 0.65, 0]);
  addMesh(body, sphere(0.165, 2), mat(style.color, { rough: 0.65 }), [0, 0.79, -0.01]);
  // eyes
  addMesh(body, sphere(0.022, 1), mat('#2B3044', { rough: 0.4 }), [-0.055, 0.665, 0.145]);
  addMesh(body, sphere(0.022, 1), mat('#2B3044', { rough: 0.4 }), [0.055, 0.665, 0.145]);
  // cheeks
  addMesh(body, sphere(0.028, 1), mat('#FFA9A0', { rough: 0.8 }), [-0.095, 0.62, 0.125]);
  addMesh(body, sphere(0.028, 1), mat('#FFA9A0', { rough: 0.8 }), [0.095, 0.62, 0.125]);
  // scarf
  addMesh(body, new THREE.TorusGeometry(0.135, 0.035, 6, 14), mat(style.dark, { rough: 0.7 }), [0, 0.5, 0], [Math.PI / 2, 0, 0]);

  // A different little hat for every player.
  if (index % 4 === 0) {
    addMesh(body, cylinder(0.19, 0.19, 0.035, 14), mat(style.dark, { rough: 0.6 }), [0, 0.85, 0]);
    addMesh(body, cylinder(0.13, 0.15, 0.12, 14), mat(style.dark, { rough: 0.6 }), [0, 0.92, 0]);
  } else if (index % 4 === 1) {
    addMesh(body, sphere(0.17, 2), mat(style.dark, { rough: 0.8 }), [0, 0.87, 0]);
    addMesh(body, sphere(0.06, 1), mat('#FFF6E6', { rough: 0.8 }), [0, 1.02, 0]);
  } else if (index % 4 === 2) {
    addMesh(body, cylinder(0.21, 0.21, 0.03, 14), mat('#3A2A22', { rough: 0.6 }), [0, 0.85, 0]);
    addMesh(body, cylinder(0.13, 0.13, 0.2, 14), mat('#3A2A22', { rough: 0.6 }), [0, 0.96, 0]);
    addMesh(body, cylinder(0.14, 0.14, 0.04, 14), mat(style.color, { rough: 0.6 }), [0, 0.9, 0]);
  } else {
    addMesh(body, cylinder(0.015, 0.015, 0.22, 6), mat(style.dark, { rough: 0.6 }), [0, 0.94, 0]);
    addMesh(body, sphere(0.055, 1), mat(style.color, { emissive: style.color, emissiveIntensity: 0.35 }), [0, 1.06, 0]);
  }

  group.userData.visual = body;
  group.userData.style = style;
  group.userData.phase = index * 1.7;
  return group;
}

// ---------------------------------------------------------------------------
// Buildings
// ---------------------------------------------------------------------------

export function makeHouse(level, color, dark) {
  const group = new THREE.Group();
  const wall = mat('#FFF6E6', { rough: 0.9 });
  const roof = mat(color, { rough: 0.75 });
  const trim = mat(dark, { rough: 0.7 });

  if (level === 1) {
    addMesh(group, box(0.36, 0.26, 0.32, 0.02), wall, [0, 0.13, 0]);
    addMesh(group, new THREE.ConeGeometry(0.3, 0.2, 4), roof, [0, 0.36, 0], [0, Math.PI / 4, 0]);
    addMesh(group, box(0.09, 0.16, 0.03, 0.01), trim, [0, 0.08, 0.165]);
  } else if (level === 2) {
    addMesh(group, box(0.42, 0.4, 0.36, 0.02), wall, [0, 0.2, 0]);
    addMesh(group, new THREE.ConeGeometry(0.34, 0.22, 4), roof, [0, 0.51, 0], [0, Math.PI / 4, 0]);
    addMesh(group, box(0.16, 0.13, 0.18, 0.02), wall, [0.1, 0.6, 0]);
    addMesh(group, new THREE.ConeGeometry(0.16, 0.13, 4), roof, [0.1, 0.71, 0], [0, Math.PI / 4, 0]);
    addMesh(group, box(0.1, 0.2, 0.03, 0.01), trim, [0, 0.1, 0.185]);
    addMesh(group, box(0.08, 0.08, 0.02, 0.01), mat('#8ED8F8', { rough: 0.3, metal: 0.1 }), [-0.12, 0.28, 0.185]);
  } else {
    addMesh(group, box(0.5, 0.34, 0.4, 0.02), wall, [0, 0.17, 0]);
    addMesh(group, box(0.24, 0.3, 0.28, 0.02), wall, [0.17, 0.47, 0]);
    addMesh(group, new THREE.ConeGeometry(0.42, 0.2, 4), roof, [-0.03, 0.44, 0], [0, Math.PI / 4, 0]);
    addMesh(group, new THREE.ConeGeometry(0.2, 0.16, 4), roof, [0.17, 0.69, 0], [0, Math.PI / 4, 0]);
    addMesh(group, box(0.12, 0.22, 0.03, 0.01), trim, [-0.1, 0.11, 0.205]);
    addMesh(group, box(0.08, 0.08, 0.02, 0.01), mat('#8ED8F8', { rough: 0.3 }), [0.08, 0.23, 0.205]);
    // flag
    addMesh(group, cylinder(0.012, 0.012, 0.4, 5), trim, [0.35, 0.56, 0]);
    addMesh(group, box(0.18, 0.1, 0.012, 0), roof, [0.44, 0.7, 0]);
  }

  return group;
}

// ---------------------------------------------------------------------------
// Special tile props
// ---------------------------------------------------------------------------

export function makeTileProp(tile, color) {
  const group = new THREE.Group();
  const c = color || '#F3B944';
  const white = '#FFF6E6';
  const wood = '#A56A45';
  const green = '#4FAF6A';

  switch (tile.icon) {
    case 'sun': {
      addMesh(group, sphere(0.16, 2), mat('#FFC94A', { emissive: '#FFC94A', emissiveIntensity: 0.35, rough: 0.5 }), [0, 0.3, 0]);
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        addMesh(group, box(0.05, 0.05, 0.18, 0.01), mat('#FFD166', { rough: 0.6 }), [Math.cos(a) * 0.3, 0.3, Math.sin(a) * 0.3], [0, -a, 0]);
      }
      break;
    }
    case 'cup': {
      addMesh(group, cylinder(0.12, 0.09, 0.28, 10), mat('#FFD166', { rough: 0.5 }), [0, 0.14, 0]);
      addMesh(group, cylinder(0.012, 0.012, 0.28, 5), mat('#FF7A6B'), [0.06, 0.3, 0], [0, 0, 0.3]);
      break;
    }
    case 'balloon': {
      addMesh(group, sphere(0.16, 2), mat('#F08BAD', { rough: 0.5 }), [0, 0.36, 0]);
      addMesh(group, cylinder(0.005, 0.005, 0.3, 4), mat(white), [0, 0.12, 0]);
      break;
    }
    case 'book': {
      addMesh(group, box(0.32, 0.06, 0.24, 0.01), mat('#5B8DEF'), [0, 0.03, 0]);
      addMesh(group, box(0.3, 0.06, 0.22, 0.01), mat('#F08BAD'), [0.01, 0.09, 0]);
      addMesh(group, box(0.26, 0.05, 0.2, 0.01), mat('#59C08A'), [-0.02, 0.15, 0]);
      break;
    }
    case 'star': {
      const shape = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 0.1 : 0.24;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      addMesh(group, new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false }), mat('#FFC94A', { emissive: '#FFC94A', emissiveIntensity: 0.2 }), [0, 0.32, 0]);
      break;
    }
    case 'ball': {
      addMesh(group, sphere(0.18, 2), mat(white, { rough: 0.5 }), [0, 0.18, 0]);
      addMesh(group, new THREE.TorusGeometry(0.18, 0.018, 6, 18), mat('#FF7A6B'), [0, 0.18, 0], [Math.PI / 2, 0, 0]);
      break;
    }
    case 'gift': {
      addMesh(group, box(0.28, 0.22, 0.28, 0.02), mat('#FF7A6B'), [0, 0.11, 0]);
      addMesh(group, box(0.06, 0.23, 0.29, 0.01), mat('#FFD166'), [0, 0.12, 0]);
      addMesh(group, box(0.29, 0.23, 0.06, 0.01), mat('#FFD166'), [0, 0.12, 0]);
      addMesh(group, sphere(0.07, 1), mat('#FFD166'), [-0.06, 0.27, 0]);
      addMesh(group, sphere(0.07, 1), mat('#FFD166'), [0.06, 0.27, 0]);
      break;
    }
    case 'blocks': {
      addMesh(group, box(0.18, 0.18, 0.18, 0.02), mat('#FF7A6B'), [-0.1, 0.09, 0]);
      addMesh(group, box(0.18, 0.18, 0.18, 0.02), mat('#5B8DEF'), [0.1, 0.09, 0.02]);
      addMesh(group, box(0.18, 0.18, 0.18, 0.02), mat('#FFC44D'), [0, 0.27, 0]);
      break;
    }
    case 'cap': {
      addMesh(group, box(0.34, 0.05, 0.34, 0.01), mat('#2B3044'), [0, 0.24, 0]);
      addMesh(group, box(0.2, 0.1, 0.2, 0.02), mat('#2B3044'), [0, 0.16, 0]);
      addMesh(group, cylinder(0.008, 0.008, 0.22, 4), mat('#FFC44D'), [0.16, 0.14, 0]);
      break;
    }
    case 'briefcase': {
      addMesh(group, box(0.32, 0.24, 0.12, 0.02), mat('#A56A45'), [0, 0.12, 0]);
      addMesh(group, new THREE.TorusGeometry(0.07, 0.018, 5, 10, Math.PI), mat('#6B4226'), [0, 0.25, 0]);
      break;
    }
    case 'laptop': {
      addMesh(group, box(0.3, 0.2, 0.03, 0.01), mat('#2B3044'), [0, 0.24, -0.05], [-0.25, 0, 0]);
      addMesh(group, box(0.32, 0.03, 0.22, 0.01), mat('#6B7A99'), [0, 0.04, 0.05]);
      break;
    }
    case 'coffee': {
      addMesh(group, cylinder(0.12, 0.1, 0.22, 12), mat(white), [0, 0.11, 0]);
      addMesh(group, new THREE.TorusGeometry(0.07, 0.018, 5, 10, Math.PI), mat(white), [0.13, 0.12, 0], [0, 0, -Math.PI / 2]);
      addMesh(group, cylinder(0.1, 0.1, 0.02, 12), mat('#6B4226'), [0, 0.225, 0]);
      break;
    }
    case 'medal': {
      addMesh(group, cylinder(0.13, 0.13, 0.035, 14), mat('#FFC44D', { metal: 0.4, rough: 0.35 }), [0, 0.3, 0], [Math.PI / 2, 0, 0]);
      addMesh(group, box(0.09, 0.22, 0.02, 0.01), mat('#5B8DEF'), [-0.05, 0.12, 0], [0, 0, 0.18]);
      addMesh(group, box(0.09, 0.22, 0.02, 0.01), mat('#F08BAD'), [0.05, 0.12, 0], [0, 0, -0.18]);
      break;
    }
    case 'rocket': {
      addMesh(group, cylinder(0.05, 0.1, 0.34, 8), mat(white), [0, 0.24, 0]);
      addMesh(group, new THREE.ConeGeometry(0.1, 0.16, 8), mat('#FF7A6B'), [0, 0.49, 0]);
      addMesh(group, box(0.04, 0.14, 0.12, 0.01), mat('#FF7A6B'), [-0.1, 0.16, 0], [0, 0, 0.2]);
      addMesh(group, box(0.04, 0.14, 0.12, 0.01), mat('#FF7A6B'), [0.1, 0.16, 0], [0, 0, -0.2]);
      addMesh(group, sphere(0.035, 1), mat('#8ED8F8'), [0, 0.3, 0.075]);
      break;
    }
    case 'moon': {
      addMesh(group, sphere(0.17, 2), mat('#FFF2C4', { emissive: '#FFF2C4', emissiveIntensity: 0.25 }), [0, 0.32, 0]);
      addMesh(group, sphere(0.05, 1), mat('#FFD166', { emissive: '#FFD166', emissiveIntensity: 0.4 }), [0.24, 0.45, 0]);
      break;
    }
    case 'compass': {
      addMesh(group, cylinder(0.2, 0.2, 0.06, 16), mat('#FFC44D', { metal: 0.3, rough: 0.4 }), [0, 0.03, 0]);
      addMesh(group, box(0.035, 0.02, 0.28, 0.005), mat('#2B3044'), [0, 0.07, 0], [0, 0.6, 0]);
      break;
    }
    case 'heart': {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0.18);
      shape.bezierCurveTo(-0.3, -0.02, -0.22, -0.26, -0.08, -0.26);
      shape.bezierCurveTo(-0.02, -0.26, 0, -0.2, 0, -0.16);
      shape.bezierCurveTo(0, -0.2, 0.02, -0.26, 0.08, -0.26);
      shape.bezierCurveTo(0.22, -0.26, 0.3, -0.02, 0, 0.18);
      addMesh(group, new THREE.ExtrudeGeometry(shape, { depth: 0.09, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }), mat('#F08BAD'), [0, 0.38, -0.045]);
      break;
    }
    case 'rings': {
      addMesh(group, new THREE.TorusGeometry(0.13, 0.025, 8, 20), mat('#FFC44D', { metal: 0.5, rough: 0.3 }), [-0.06, 0.2, 0], [Math.PI / 2, 0.4, 0]);
      addMesh(group, new THREE.TorusGeometry(0.13, 0.025, 8, 20), mat('#FFF6E6', { metal: 0.4, rough: 0.3 }), [0.06, 0.2, 0], [Math.PI / 2, -0.4, 0]);
      break;
    }
    case 'home': {
      const house = makeHouse(2, '#59C08A', '#237B51');
      house.scale.setScalar(0.85);
      group.add(house);
      break;
    }
    case 'crib': {
      addMesh(group, box(0.34, 0.2, 0.22, 0.02), mat('#A56A45'), [0, 0.2, 0]);
      for (const x of [-0.15, 0.15]) {
        for (const z of [-0.1, 0.1]) addMesh(group, cylinder(0.015, 0.015, 0.22, 5), mat('#6B4226'), [x, 0.11, z]);
      }
      addMesh(group, sphere(0.05, 1), mat('#FFD9B8'), [0, 0.3, 0]);
      break;
    }
    case 'plane': {
      addMesh(group, box(0.4, 0.05, 0.14, 0.01), mat(white), [0, 0.26, 0]);
      addMesh(group, box(0.16, 0.03, 0.24, 0.01), mat('#8ED8F8'), [0.02, 0.26, 0]);
      addMesh(group, box(0.12, 0.12, 0.02, 0.01), mat('#FF7A6B'), [-0.2, 0.32, 0], [0, 0, 0.2]);
      break;
    }
    case 'flower': {
      addMesh(group, cylinder(0.012, 0.012, 0.3, 5), mat(green), [0, 0.15, 0]);
      for (let i = 0; i < 6; i++) {
        const a = (i * TAU) / 6;
        addMesh(group, sphere(0.07, 1), mat('#F08BAD'), [Math.cos(a) * 0.1, 0.34, Math.sin(a) * 0.1]);
      }
      addMesh(group, sphere(0.06, 1), mat('#FFD166'), [0, 0.35, 0]);
      break;
    }
    case 'shop': {
      addMesh(group, box(0.38, 0.26, 0.26, 0.02), mat(white), [0, 0.13, 0]);
      addMesh(group, box(0.42, 0.06, 0.3, 0.01), mat('#FF7A6B'), [0, 0.3, 0]);
      addMesh(group, box(0.1, 0.15, 0.02, 0.01), mat('#8ED8F8'), [0, 0.12, 0.14]);
      break;
    }
    case 'nest': {
      addMesh(group, new THREE.TorusGeometry(0.18, 0.05, 6, 14), mat('#A56A45'), [0, 0.08, 0], [Math.PI / 2, 0, 0]);
      addMesh(group, sphere(0.06, 1), mat('#FFF6E6'), [-0.05, 0.14, 0.02]);
      addMesh(group, sphere(0.055, 1), mat('#FFF6E6'), [0.06, 0.14, -0.02]);
      break;
    }
    case 'globe': {
      addMesh(group, sphere(0.18, 2), mat('#5B8DEF'), [0, 0.25, 0]);
      addMesh(group, new THREE.TorusGeometry(0.18, 0.01, 4, 18), mat('#FFD166'), [0, 0.25, 0], [Math.PI / 2, 0.5, 0]);
      addMesh(group, cylinder(0.02, 0.02, 0.12, 5), mat('#A56A45'), [0, 0.06, 0]);
      break;
    }
    case 'umbrella': {
      addMesh(group, new THREE.ConeGeometry(0.24, 0.14, 10, 1, true), mat('#FF7A6B'), [0, 0.32, 0]);
      addMesh(group, cylinder(0.012, 0.012, 0.32, 5), mat(wood), [0, 0.14, 0]);
      break;
    }
    case 'mountain': {
      addMesh(group, new THREE.ConeGeometry(0.28, 0.36, 5), mat('#8B7BB5'), [0, 0.18, 0]);
      addMesh(group, new THREE.ConeGeometry(0.13, 0.14, 5), mat(white), [0, 0.34, 0]);
      break;
    }
    case 'palette': {
      addMesh(group, cylinder(0.18, 0.18, 0.035, 14), mat('#E8C9A0'), [0, 0.25, 0], [Math.PI / 2, 0, 0]);
      const colors = ['#FF7A6B', '#5B8DEF', '#FFC44D', '#59C08A'];
      colors.forEach((col, i) => {
        const a = (i * TAU) / 4 + 0.4;
        addMesh(group, sphere(0.035, 1), mat(col), [Math.cos(a) * 0.1, 0.26 + Math.sin(a) * 0.1, 0.03]);
      });
      break;
    }
    case 'chart': {
      addMesh(group, box(0.07, 0.12, 0.08, 0.01), mat('#59C08A'), [-0.12, 0.06, 0]);
      addMesh(group, box(0.07, 0.2, 0.08, 0.01), mat('#5B8DEF'), [0, 0.1, 0]);
      addMesh(group, box(0.07, 0.28, 0.08, 0.01), mat('#FF7A6B'), [0.12, 0.14, 0]);
      addMesh(group, box(0.36, 0.02, 0.02, 0.005), mat('#FFC44D'), [0, 0.33, 0], [0, 0, 0.2]);
      break;
    }
    case 'car': {
      addMesh(group, box(0.4, 0.14, 0.2, 0.04), mat('#FF7A6B'), [0, 0.16, 0]);
      addMesh(group, box(0.2, 0.12, 0.18, 0.03), mat('#FF7A6B'), [-0.02, 0.28, 0]);
      addMesh(group, box(0.16, 0.08, 0.17, 0.02), mat('#8ED8F8'), [-0.02, 0.29, 0]);
      for (const x of [-0.13, 0.13]) {
        for (const z of [-0.1, 0.1]) addMesh(group, cylinder(0.055, 0.055, 0.03, 10), mat('#2B3044'), [x, 0.07, z], [Math.PI / 2, 0, 0]);
      }
      break;
    }
    case 'flag': {
      addMesh(group, cylinder(0.012, 0.012, 0.4, 5), mat(wood), [0, 0.2, 0]);
      addMesh(group, box(0.24, 0.14, 0.015, 0), mat(c), [0.13, 0.34, 0]);
      break;
    }
    default: {
      addMesh(group, sphere(0.16, 1), mat(c), [0, 0.2, 0]);
    }
  }

  return group;
}

// ---------------------------------------------------------------------------
// Environment props
// ---------------------------------------------------------------------------

export function makeTree(scale = 1, foliage = '#59B96B') {
  const group = new THREE.Group();
  addMesh(group, cylinder(0.09 * scale, 0.13 * scale, 0.7 * scale, 7), mat('#8A5A3B', { rough: 0.95 }), [0, 0.35 * scale, 0]);
  addMesh(group, sphere(0.38 * scale, 1), mat(foliage, { rough: 0.9 }), [0, 0.85 * scale, 0]);
  addMesh(group, sphere(0.3 * scale, 1), mat(foliage, { rough: 0.9 }), [0.25 * scale, 0.7 * scale, 0.06 * scale]);
  addMesh(group, sphere(0.27 * scale, 1), mat(foliage, { rough: 0.9 }), [-0.22 * scale, 0.75 * scale, -0.05 * scale]);
  return group;
}

export function makeCloud(scale = 1) {
  const group = new THREE.Group();
  const cloudMat = mat('#FFFFFF', { rough: 1, flat: false });
  const blobs = [
    [0, 0, 0, 0.55],
    [0.5, 0.08, 0.1, 0.42],
    [-0.5, 0.02, -0.05, 0.4],
    [0.15, 0.22, -0.1, 0.36],
    [-0.2, 0.18, 0.15, 0.32],
  ];
  for (const [x, y, z, r] of blobs) {
    addMesh(group, new THREE.SphereGeometry(r * scale, 10, 8), cloudMat, [x * scale, y * scale, z * scale]);
  }
  group.traverse((child) => {
    if (child.isMesh) child.castShadow = false;
  });
  return group;
}

export function makeBench(color = '#A56A45') {
  const group = new THREE.Group();
  addMesh(group, box(0.7, 0.06, 0.24, 0.02), mat(color), [0, 0.2, 0]);
  addMesh(group, box(0.7, 0.2, 0.05, 0.01), mat(color), [0, 0.32, -0.11]);
  for (const x of [-0.28, 0.28]) {
    addMesh(group, box(0.05, 0.2, 0.2, 0.01), mat('#6B4226'), [x, 0.1, 0]);
  }
  return group;
}

export function makeLamp() {
  const group = new THREE.Group();
  addMesh(group, cylinder(0.025, 0.04, 0.75, 6), mat('#4B4F63'), [0, 0.37, 0]);
  addMesh(group, sphere(0.09, 1), mat('#FFE7A3', { emissive: '#FFC44D', emissiveIntensity: 1.6, rough: 0.4 }), [0, 0.8, 0]);
  const light = new THREE.PointLight('#FFD48A', 1.6, 3.2, 2);
  light.position.set(0, 0.8, 0);
  group.add(light);
  return group;
}

export function makeHeartMesh(color = '#F08BAD', scale = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.18);
  shape.bezierCurveTo(-0.3, -0.02, -0.22, -0.26, -0.08, -0.26);
  shape.bezierCurveTo(-0.02, -0.26, 0, -0.2, 0, -0.16);
  shape.bezierCurveTo(0, -0.2, 0.02, -0.26, 0.08, -0.26);
  shape.bezierCurveTo(0.22, -0.26, 0.3, -0.02, 0, 0.18);
  const mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }),
    mat(color, { rough: 0.5 }),
  );
  mesh.scale.setScalar(scale);
  mesh.castShadow = true;
  return mesh;
}

export function makeSignTexture(title = 'LIFE IS A GAME', subtitle = 'BUILD A LIFE · BEAT YOUR FRIENDS') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#F7E7C8';
  ctx.fillRect(0, 0, 1024, 384);
  ctx.strokeStyle = '#A56A45';
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, 1006, 366);
  ctx.strokeStyle = '#D9BE93';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, 960, 320);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#2B3044';
  ctx.font = '700 118px Fredoka, sans-serif';
  ctx.fillText(title, 512, 190);
  ctx.fillStyle = '#8A6B45';
  ctx.font = '600 40px Nunito, sans-serif';
  ctx.fillText(subtitle, 512, 274);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
