import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TILES } from '../game/data';
import type { GameState, Player } from '../game/types';
import {
  createCenterDecal,
  createDiceTexture,
  createGroundTexture,
  createTileTexture,
} from './textures';

const TILE_SIZE = 0.97;
const BOARD_SPAN = 9;
const MAX_LEVEL = 3;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

interface Pawn {
  group: THREE.Group;
  car: THREE.Group;
  playerId: number;
  tile: number;
  angle: number;
  phase: number;
}

interface Tween {
  elapsed: number;
  duration: number;
  delay: number;
  update: (t: number) => void;
  done?: () => void;
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function tilePosition(index: number): { x: number; z: number; side: number } {
  const side = Math.floor(index / 9) % 4;
  const j = index % 9;
  const half = BOARD_SPAN / 2;
  if (side === 0) return { x: -half + j, z: -half, side };
  if (side === 1) return { x: half, z: -half + j, side };
  if (side === 2) return { x: half - j, z: half, side };
  return { x: -half, z: half - j, side };
}

function tileAngle(index: number): number {
  const { side } = tilePosition(index);
  if (side === 0) return 0;
  if (side === 1) return -Math.PI / 2;
  if (side === 2) return Math.PI;
  return Math.PI / 2;
}

const pawnOffsets = [
  { x: -0.2, z: -0.2 },
  { x: 0.2, z: -0.2 },
  { x: -0.2, z: 0.2 },
  { x: 0.2, z: 0.2 },
];

export class BoardScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  onTileClick?: (index: number) => void;

  private container: HTMLElement;
  private clock = new THREE.Clock();
  private tweens: Tween[] = [];
  private pawns: Pawn[] = [];
  private tileGroups: THREE.Group[] = [];
  private tileBases: THREE.Mesh[] = [];
  private ownerMeshes: THREE.Mesh[] = [];
  private houseGroups: THREE.Group[] = [];
  private selectFrame!: THREE.Group;
  private dice: THREE.Mesh[] = [];
  private diceRest: THREE.Vector3[] = [];
  private movingPlayer: number | null = null;
  private activePlayer = 0;
  private baseCameraPos = new THREE.Vector3();
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDown = { x: 0, y: 0, time: 0 };
  private highlightTimer = 0;
  private tower?: THREE.Group;
  private towerCore?: THREE.Mesh;
  private towerCrown?: THREE.Mesh;
  private towerHalo?: THREE.Mesh;
  private confetti?: THREE.InstancedMesh;
  private confettiData: {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Euler;
    spin: THREE.Vector3;
  }[] = [];
  private celebrating = 0;
  private disposed = false;
  private quality: 'high' | 'low';
  private resizeObserver: ResizeObserver;

  constructor(container: HTMLElement) {
    this.container = container;
    this.quality = window.matchMedia('(pointer: coarse)').matches ? 'low' : 'high';

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.quality === 'high' ? 2 : 1.75),
    );
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.14;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.className = 'game-canvas';
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#05171d');
    this.scene.fog = new THREE.Fog('#05171d', 46, 120);

    this.camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      120,
    );

    this.createLights();
    this.createGround();
    this.createBoard();
    this.createDice();
    this.createConfetti();
    this.createSelectionFrame();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.bindPointer();

    this.clock.start();
    this.renderer.setAnimationLoop(() => this.animate());
  }

  private createLights(): void {
    const hemi = new THREE.HemisphereLight('#d8f2ff', '#0c2220', 1.72);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#ffe6bd', 2.6);
    sun.position.set(7, 15, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(
      this.quality === 'high' ? 2048 : 1024,
      this.quality === 'high' ? 2048 : 1024,
    );
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 42;
    sun.shadow.camera.left = -9;
    sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 9;
    sun.shadow.camera.bottom = -9;
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.02;
    this.scene.add(sun);

    const rim = new THREE.DirectionalLight('#7fd7ca', 0.9);
    rim.position.set(-10, 6, -8);
    this.scene.add(rim);

    const fill = new THREE.PointLight('#ffcf87', 18, 18, 2);
    fill.position.set(0, 4.5, 1.5);
    this.scene.add(fill);

    const under = new THREE.PointLight('#1d8f85', 8, 20, 2);
    under.position.set(0, 0.6, -6);
    this.scene.add(under);
  }

  private createGround(): void {
    const texture = createGroundTexture();
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(38, 64), material);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.62;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Fine dust in the air for depth.
    const count = this.quality === 'high' ? 160 : 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 4 + Math.random() * 14;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.6 + Math.random() * 7;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dust = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: '#ffe3b0',
        size: 0.035,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    this.scene.add(dust);
  }

  private createBoard(): void {
    const base = new THREE.Mesh(
      new RoundedBoxGeometry(11.55, 0.52, 11.55, 8, 0.22),
      new THREE.MeshStandardMaterial({
        color: '#10373e',
        roughness: 0.58,
        metalness: 0.18,
      }),
    );
    base.position.y = -0.27;
    base.receiveShadow = true;
    base.castShadow = true;
    this.scene.add(base);

    const trim = new THREE.Mesh(
      new RoundedBoxGeometry(11.18, 0.08, 11.18, 6, 0.12),
      new THREE.MeshStandardMaterial({
        color: '#c8a15b',
        roughness: 0.32,
        metalness: 0.72,
      }),
    );
    trim.position.y = -0.01;
    trim.receiveShadow = true;
    this.scene.add(trim);

    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(10.02, 0.05, 10.02),
      new THREE.MeshStandardMaterial({
        color: '#0c2a30',
        roughness: 0.72,
        metalness: 0.08,
      }),
    );
    inner.position.y = 0.035;
    inner.receiveShadow = true;
    this.scene.add(inner);

    // Gold corner caps
    const capGeo = new THREE.CylinderGeometry(0.09, 0.13, 0.16, 12);
    const capMat = new THREE.MeshStandardMaterial({
      color: '#d8b46a',
      roughness: 0.28,
      metalness: 0.85,
    });
    for (const x of [-5.52, 5.52]) {
      for (const z of [-5.52, 5.52]) {
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(x, 0.02, z);
        cap.castShadow = true;
        this.scene.add(cap);
      }
    }

    for (const tile of TILES) {
      const group = new THREE.Group();
      const { x, z } = tilePosition(tile.index);
      group.position.set(x, 0, z);

      const owner = new THREE.Mesh(
        new THREE.PlaneGeometry(1.06, 1.06),
        new THREE.MeshBasicMaterial({
          color: '#ffffff',
          transparent: true,
          opacity: 0.95,
        }),
      );
      owner.rotation.x = -Math.PI / 2;
      owner.position.y = 0.056;
      owner.visible = false;
      group.add(owner);
      this.ownerMeshes[tile.index] = owner;

      const baseMat = new THREE.MeshStandardMaterial({
        color: tile.type === 'property' ? '#eadfc9' : '#e9ddc4',
        roughness: 0.66,
        metalness: 0.05,
      });
      const tileMesh = new THREE.Mesh(
        new RoundedBoxGeometry(TILE_SIZE, 0.16, TILE_SIZE, 3, 0.035),
        baseMat,
      );
      tileMesh.position.y = 0.15;
      tileMesh.castShadow = true;
      tileMesh.receiveShadow = true;
      tileMesh.userData.tileIndex = tile.index;
      group.add(tileMesh);
      this.tileBases[tile.index] = tileMesh;

      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(TILE_SIZE * 0.96, TILE_SIZE * 0.96),
        new THREE.MeshBasicMaterial({
          map: createTileTexture(tile),
          transparent: true,
          depthWrite: false,
        }),
      );
      label.rotation.x = -Math.PI / 2;
      label.position.y = 0.233;
      label.userData.tileIndex = tile.index;
      group.add(label);

      const houses = new THREE.Group();
      houses.position.y = 0.24;
      group.add(houses);
      this.houseGroups[tile.index] = houses;

      this.scene.add(group);
      this.tileGroups[tile.index] = group;
    }

    this.createPlaza();
  }

  private createPlaza(): void {
    const plate = new THREE.Mesh(
      new RoundedBoxGeometry(8.1, 0.05, 8.1, 4, 0.12),
      new THREE.MeshStandardMaterial({
        color: '#143a40',
        roughness: 0.62,
        metalness: 0.12,
      }),
    );
    plate.position.y = 0.065;
    plate.receiveShadow = true;
    this.scene.add(plate);

    const decal = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 7.5),
      new THREE.MeshBasicMaterial({
        map: createCenterDecal(),
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    );
    decal.rotation.x = -Math.PI / 2;
    decal.position.y = 0.097;
    this.scene.add(decal);

    // Central monument: a tower that grows as the city develops.
    this.tower = new THREE.Group();
    this.tower.position.y = 0.1;

    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.2, 0.22, 48),
      new THREE.MeshStandardMaterial({
        color: '#e8dcc3',
        roughness: 0.55,
        metalness: 0.1,
      }),
    );
    plinth.position.y = 0.11;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    this.tower.add(plinth);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.82, 0.035, 12, 64),
      new THREE.MeshStandardMaterial({
        color: '#d9b469',
        roughness: 0.25,
        metalness: 0.9,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.24;
    this.tower.add(ring);

    const coreMat = new THREE.MeshStandardMaterial({
      color: '#f3e7cf',
      roughness: 0.38,
      metalness: 0.2,
      emissive: '#3a2a12',
      emissiveIntensity: 0.25,
    });
    this.towerCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.3, 1, 6),
      coreMat,
    );
    this.towerCore.position.y = 0.7;
    this.towerCore.castShadow = true;
    this.tower.add(this.towerCore);

    const crown = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.28, 0),
      new THREE.MeshStandardMaterial({
        color: '#f0c979',
        metalness: 0.9,
        roughness: 0.2,
        emissive: '#6b4a12',
        emissiveIntensity: 0.5,
      }),
    );
    crown.position.y = 1.25;
    crown.userData.crown = true;
    this.tower.add(crown);
    this.towerCrown = crown;

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.018, 8, 64),
      new THREE.MeshBasicMaterial({
        color: '#e8c170',
        transparent: true,
        opacity: 0.55,
      }),
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.22;
    halo.userData.halo = true;
    this.tower.add(halo);
    this.towerHalo = halo;

    this.scene.add(this.tower);

    // Trees and benches around the plaza
    const treePositions = [
      [-2.7, -2.6],
      [2.7, -2.6],
      [-2.7, 2.6],
      [2.7, 2.6],
    ];
    for (const [x, z] of treePositions) {
      this.scene.add(this.createTree(x, z));
    }

    const benchMat = new THREE.MeshStandardMaterial({
      color: '#6b4a2f',
      roughness: 0.8,
    });
    for (const [x, z, rot] of [
      [-2.7, -1.7, 0],
      [2.7, 1.7, Math.PI],
      [-1.7, 2.7, Math.PI / 2],
      [1.7, -2.7, -Math.PI / 2],
    ]) {
      const bench = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.045, 0.18), benchMat);
      seat.position.y = 0.11;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.035), benchMat);
      back.position.set(0, 0.18, -0.08);
      bench.add(seat, back);
      bench.position.set(x, 0.1, z);
      bench.rotation.y = rot;
      this.scene.add(bench);
    }
  }

  private createTree(x: number, z: number): THREE.Group {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.06, 0.28, 8),
      new THREE.MeshStandardMaterial({ color: '#6d4c34', roughness: 0.9 }),
    );
    trunk.position.y = 0.18;
    trunk.castShadow = true;
    tree.add(trunk);

    const leafMat = new THREE.MeshStandardMaterial({
      color: '#2f8b72',
      roughness: 0.85,
    });
    const leafMat2 = new THREE.MeshStandardMaterial({
      color: '#3ba98b',
      roughness: 0.85,
    });
    const lower = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 1), leafMat);
    lower.position.y = 0.4;
    lower.castShadow = true;
    const upper = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 1), leafMat2);
    upper.position.set(0.06, 0.55, 0.02);
    upper.castShadow = true;
    tree.add(lower, upper);

    tree.position.set(x, 0.09, z);
    return tree;
  }

  private createDice(): void {
    const faces = [3, 4, 1, 6, 2, 5];
    const materials = faces.map(
      (value) =>
        new THREE.MeshStandardMaterial({
          map: createDiceTexture(value),
          roughness: 0.4,
          metalness: 0.05,
        }),
    );
    const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    geometry.clearGroups();
    for (let i = 0; i < 6; i += 1) {
      geometry.addGroup(i * 6, 6, i);
    }

    const rest = [
      new THREE.Vector3(-0.33, 0.32, 2.42),
      new THREE.Vector3(0.33, 0.32, 2.42),
    ];
    this.diceRest = rest;
    for (let i = 0; i < 2; i += 1) {
      const die = new THREE.Mesh(geometry, materials);
      die.castShadow = true;
      die.receiveShadow = true;
      die.position.copy(rest[i]);
      die.quaternion.copy(this.quaternionForValue(i === 0 ? 3 : 4));
      this.scene.add(die);
      this.dice.push(die);
    }
  }

  private quaternionForValue(value: number): THREE.Quaternion {
    const q = new THREE.Quaternion();
    const euler = new THREE.Euler();
    switch (value) {
      case 1:
        break;
      case 6:
        euler.set(Math.PI, 0, 0);
        break;
      case 2:
        euler.set(-Math.PI / 2, 0, 0);
        break;
      case 5:
        euler.set(Math.PI / 2, 0, 0);
        break;
      case 3:
        euler.set(0, 0, Math.PI / 2);
        break;
      case 4:
        euler.set(0, 0, -Math.PI / 2);
        break;
      default:
        break;
    }
    q.setFromEuler(euler);
    return q;
  }

  private createSelectionFrame(): void {
    const frame = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: '#ffe4a8',
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const bar = new THREE.BoxGeometry(0.92, 0.025, 0.05);
    for (const [x, z, rot] of [
      [0, -0.5, 0],
      [0, 0.5, 0],
      [-0.5, 0, Math.PI / 2],
      [0.5, 0, Math.PI / 2],
    ]) {
      const mesh = new THREE.Mesh(bar, mat);
      mesh.position.set(x, 0, z);
      mesh.rotation.y = rot;
      frame.add(mesh);
    }
    frame.position.y = 0.26;
    frame.visible = false;
    this.selectFrame = frame;
    this.scene.add(frame);
  }

  private createConfetti(): void {
    const count = 160;
    const geometry = new THREE.PlaneGeometry(0.06, 0.12);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: false,
      transparent: true,
      opacity: 1,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const palette = ['#f4c95d', '#5fc9a5', '#6ba7f5', '#ef7d9b', '#f5ecd9'];
    for (let i = 0; i < count; i += 1) {
      mesh.setColorAt(i, new THREE.Color(palette[i % palette.length]));
    }
    mesh.visible = false;
    mesh.frustumCulled = false;
    this.confetti = mesh;
    this.scene.add(mesh);
  }

  private createPawn(player: Player): Pawn {
    const group = new THREE.Group();
    const car = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: player.color,
      roughness: 0.32,
      metalness: 0.35,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: '#132c31',
      roughness: 0.5,
      metalness: 0.4,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: '#9fd6d9',
      roughness: 0.12,
      metalness: 0.5,
      transparent: true,
      opacity: 0.85,
    });

    const body = new THREE.Mesh(
      new RoundedBoxGeometry(0.4, 0.12, 0.22, 3, 0.045),
      bodyMat,
    );
    body.position.y = 0.11;
    body.castShadow = true;
    car.add(body);

    const cabin = new THREE.Mesh(
      new RoundedBoxGeometry(0.2, 0.12, 0.18, 2, 0.04),
      glassMat,
    );
    cabin.position.set(-0.02, 0.21, 0);
    cabin.castShadow = true;
    car.add(cabin);

    const wheelGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.045, 12);
    for (const x of [-0.12, 0.12]) {
      for (const z of [-0.11, 0.11]) {
        const wheel = new THREE.Mesh(wheelGeo, darkMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, 0.055, z);
        car.add(wheel);
      }
    }

    const lightMat = new THREE.MeshStandardMaterial({
      color: '#fff3cc',
      emissive: '#ffd88a',
      emissiveIntensity: 1.4,
    });
    for (const z of [-0.055, 0.055]) {
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), lightMat);
      light.position.set(0.195, 0.115, z);
      car.add(light);
    }

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.29, 0.29, 0.022, 24),
      new THREE.MeshStandardMaterial({
        color: player.color,
        emissive: player.color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.65,
      }),
    );
    base.position.y = 0.012;
    group.add(base);

    car.scale.setScalar(0.86);
    group.add(car);
    group.position.set(0, 0.26, 0);
    this.scene.add(group);

    return {
      group,
      car,
      playerId: player.id,
      tile: 0,
      angle: 0,
      phase: Math.random() * Math.PI * 2,
    };
  }

  setPlayers(players: Player[]): void {
    for (const pawn of this.pawns) {
      this.scene.remove(pawn.group);
      this.disposeObject(pawn.group);
    }
    this.pawns = players.map((player) => this.createPawn(player));
    this.activePlayer = 0;
  }

  setActivePlayer(playerId: number): void {
    this.activePlayer = playerId;
  }

  sync(state: GameState, immediate = false): void {
    this.tileGroups.forEach((group, index) => {
      const prop = state.properties[index];
      const ownerMesh = this.ownerMeshes[index];
      const houses = this.houseGroups[index];
      const tile = TILES[index];

      if (prop && prop.owner != null) {
        const owner = state.players[prop.owner];
        ownerMesh.visible = true;
        (ownerMesh.material as THREE.MeshBasicMaterial).color.set(owner?.color ?? '#ffffff');
        (ownerMesh.material as THREE.MeshBasicMaterial).opacity = 0.9;
      } else {
        ownerMesh.visible = false;
      }

      const signature = prop?.owner != null ? `${prop.owner}:${prop.level}` : '';
      if (houses.userData.signature !== signature) {
        houses.userData.signature = signature;
        for (const child of [...houses.children]) {
          houses.remove(child);
          this.disposeObject(child);
        }
        if (prop && prop.owner != null && prop.level > 0) {
          const owner = state.players[prop.owner];
          this.fillHouses(houses, index, prop.level, owner?.color ?? '#f4c95d');
        }
      }
      void group;
      void tile;
    });

    let totalLevels = 0;
    state.properties.forEach((prop) => {
      if (prop?.owner != null) totalLevels += prop.level;
    });
    if (this.towerCore) {
      const targetHeight = 1 + Math.min(totalLevels, 60) * 0.035;
      this.towerCore.scale.y = THREE.MathUtils.lerp(
        this.towerCore.scale.y,
        targetHeight,
        0.25,
      );
      const top = 0.22 + this.towerCore.scale.y;
      this.towerCore.position.y = 0.22 + this.towerCore.scale.y / 2;
      if (this.towerCrown) this.towerCrown.position.y = top + 0.25;
      if (this.towerHalo) this.towerHalo.position.y = top + 0.22;
    }

    this.pawns.forEach((pawn) => {
      const player = state.players[pawn.playerId];
      if (!player) return;
      if (this.movingPlayer === pawn.playerId) return;
      pawn.group.visible = !player.retired && !player.bankrupt;
      this.placePawn(pawn, player.tile, immediate);
    });

    this.activePlayer = state.current;
  }

  private fillHouses(
    group: THREE.Group,
    tileIndex: number,
    level: number,
    ownerColor: string,
  ): void {
    const count = Math.min(level, MAX_LEVEL);
    const { side } = tilePosition(tileIndex);
    for (let i = 0; i < count; i += 1) {
      const house = this.createHouse(ownerColor, i === count - 1 && level >= 3);
      const offset = (i - (count - 1) / 2) * 0.2;
      if (side === 0) house.position.set(offset, 0, 0.24);
      else if (side === 1) house.position.set(-0.24, 0, offset);
      else if (side === 2) house.position.set(offset, 0, -0.24);
      else house.position.set(0.24, 0, offset);
      house.rotation.y = side === 1 || side === 3 ? Math.PI / 2 : 0;
      house.scale.setScalar(level >= 3 ? 0.88 : 1);
      group.add(house);
    }
  }

  private createHouse(color: string, gold: boolean): THREE.Group {
    const house = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({
      color: '#f5ead4',
      roughness: 0.7,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: gold ? '#e8c170' : color,
      roughness: 0.5,
      metalness: gold ? 0.5 : 0.1,
      emissive: gold ? '#5b3f13' : color,
      emissiveIntensity: gold ? 0.35 : 0.08,
    });
    const walls = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.13), wallMat);
    walls.position.y = 0.06;
    walls.castShadow = true;
    house.add(walls);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.11, 4), roofMat);
    roof.position.y = 0.175;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);
    return house;
  }

  private placePawn(pawn: Pawn, tileIndex: number, immediate = false): void {
    const { x, z, side } = tilePosition(tileIndex);
    const offset = pawnOffsets[pawn.playerId % 4];
    const target = new THREE.Vector3(x + offset.x, 0.27, z + offset.z);
    const angle = tileAngle(tileIndex);
    pawn.tile = tileIndex;

    if (immediate) {
      pawn.group.position.copy(target);
      pawn.angle = angle;
      pawn.group.rotation.y = angle;
      return;
    }

    this.tween(
      0.34,
      (t) => {
        pawn.group.position.lerpVectors(pawn.group.position, target, 0.35);
        pawn.group.position.y = 0.27 + Math.sin(t * Math.PI) * 0.02;
      },
      () => {
        pawn.group.position.copy(target);
      },
    );

    const startAngle = pawn.angle;
    let delta = angle - startAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    this.tween(0.3, (t) => {
      pawn.group.rotation.y = startAngle + delta * easeInOutCubic(t);
      pawn.angle = pawn.group.rotation.y;
    });
    void side;
  }

  animatePawnMove(playerId: number, path: number[], done?: () => void): void {
    const pawn = this.pawns.find((p) => p.playerId === playerId);
    if (!pawn || path.length === 0) {
      done?.();
      return;
    }
    this.movingPlayer = playerId;
    let index = 0;

    const hop = () => {
      const tileIndex = path[index];
      const { x, z } = tilePosition(tileIndex);
      const offset = pawnOffsets[playerId % 4];
      const from = pawn.group.position.clone();
      const target = new THREE.Vector3(x + offset.x, 0.27, z + offset.z);
      const angle = tileAngle(tileIndex);
      const startAngle = pawn.angle;
      let delta = angle - startAngle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;

      this.tween(
        0.2,
        (t) => {
          const eased = easeInOutCubic(t);
          pawn.group.position.set(
            THREE.MathUtils.lerp(from.x, target.x, eased),
            0.27 + Math.sin(Math.PI * eased) * 0.34,
            THREE.MathUtils.lerp(from.z, target.z, eased),
          );
          pawn.group.rotation.y = startAngle + delta * eased;
          pawn.car.rotation.z = Math.sin(Math.PI * eased) * 0.08;
        },
        () => {
          pawn.group.position.copy(target);
          pawn.group.rotation.y = angle;
          pawn.angle = angle;
          pawn.car.rotation.z = 0;
          pawn.tile = tileIndex;
          index += 1;
          if (index < path.length) {
            hop();
          } else {
            this.movingPlayer = null;
            done?.();
          }
        },
      );
    };

    hop();
  }

  rollDice(dice: [number, number], done?: () => void): void {
    const targets = dice.map((value) => this.quaternionForValue(value));
    const starts = this.dice.map((die) => ({
      position: die.position.clone(),
      quaternion: die.quaternion.clone(),
    }));

    this.dice.forEach((die, index) => {
      const rest = this.diceRest[index];
      const start = starts[index];
      const target = targets[index];
      const spins = Array.from({ length: 3 }, () =>
        new THREE.Euler(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ),
      );
      const spinQuats = spins.map((euler) => new THREE.Quaternion().setFromEuler(euler));

      this.tween(
        0.95,
        (raw) => {
          const t = raw;
          if (t < 0.62) {
            const local = t / 0.62;
            const lift = Math.sin(local * Math.PI) * 1.15;
            die.position.set(
              THREE.MathUtils.lerp(start.position.x, rest.x, local * 0.55),
              rest.y + lift,
              THREE.MathUtils.lerp(start.position.z, rest.z, local * 0.55),
            );
            const spinIndex = Math.min(2, Math.floor(local * 3));
            const nextIndex = Math.min(2, spinIndex + 1);
            die.quaternion
              .copy(start.quaternion)
              .slerp(spinQuats[spinIndex], local)
              .slerp(spinQuats[nextIndex], local * 0.4);
          } else {
            const local = (t - 0.62) / 0.38;
            const eased = easeOutCubic(local);
            die.position.set(
              THREE.MathUtils.lerp(die.position.x, rest.x, eased),
              rest.y + Math.sin(local * Math.PI) * 0.16,
              THREE.MathUtils.lerp(die.position.z, rest.z, eased),
            );
            die.quaternion.slerp(target, eased * 0.7);
          }
        },
        () => {
          die.position.copy(rest);
          die.quaternion.copy(target);
          if (index === this.dice.length - 1) {
            done?.();
          }
        },
      );
    });
  }

  showDice(values: [number, number]): void {
    this.dice.forEach((die, index) => {
      die.position.copy(this.diceRest[index]);
      die.quaternion.copy(this.quaternionForValue(values[index]));
    });
  }

  setSelectedTile(index: number | null): void {
    if (index == null) {
      this.selectFrame.visible = false;
      return;
    }
    const { x, z } = tilePosition(index);
    this.selectFrame.position.set(x, 0.27, z);
    this.selectFrame.visible = true;
  }

  celebrate(): void {
    if (!this.confetti) return;
    this.celebrating = 1;
    this.confetti.visible = true;
    this.confettiData = [];
    const palette = ['#f4c95d', '#5fc9a5', '#6ba7f5', '#ef7d9b', '#f5ecd9'];
    for (let i = 0; i < 160; i += 1) {
      this.confettiData.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 11,
          6 + Math.random() * 3,
          (Math.random() - 0.5) * 11,
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.35,
          -0.9 - Math.random() * 0.6,
          (Math.random() - 0.5) * 0.35,
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
        ),
      });
      this.confetti.setColorAt(i, new THREE.Color(palette[i % palette.length]));
    }
    if (this.confetti.instanceColor) this.confetti.instanceColor.needsUpdate = true;
  }

  stopCelebrate(): void {
    this.celebrating = 0;
    if (this.confetti) this.confetti.visible = false;
  }

  private updateConfetti(dt: number): void {
    if (!this.confetti || this.celebrating <= 0) return;
    const matrix = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    this.confettiData.forEach((piece, index) => {
      piece.velocity.y -= 0.35 * dt;
      piece.position.addScaledVector(piece.velocity, dt);
      piece.rotation.x += piece.spin.x * dt;
      piece.rotation.y += piece.spin.y * dt;
      piece.rotation.z += piece.spin.z * dt;
      if (piece.position.y < 0.4) {
        piece.position.y = 0.4;
        piece.velocity.set(0, 0, 0);
      }
      quat.setFromEuler(piece.rotation);
      matrix.compose(piece.position, quat, scale);
      this.confetti!.setMatrixAt(index, matrix);
    });
    this.confetti.instanceMatrix.needsUpdate = true;
  }

  private bindPointer(): void {
    const element = this.renderer.domElement;
    element.addEventListener('pointerdown', (event) => {
      this.pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() };
    });
    element.addEventListener('pointerup', (event) => {
      const dx = event.clientX - this.pointerDown.x;
      const dy = event.clientY - this.pointerDown.y;
      if (Math.hypot(dx, dy) > 9) return;
      if (performance.now() - this.pointerDown.time > 700) return;
      const rect = element.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.tileBases, false);
      const tileIndex = hits[0]?.object.userData.tileIndex as number | undefined;
      if (tileIndex != null) {
        this.setSelectedTile(tileIndex);
        this.onTileClick?.(tileIndex);
      }
    });
  }

  private tween(duration: number, update: (t: number) => void, done?: () => void, delay = 0): void {
    this.tweens.push({ elapsed: 0, duration, delay, update, done });
  }

  private updateTweens(dt: number): void {
    const active = this.tweens.slice();
    for (const tween of active) {
      if (tween.delay > 0) {
        tween.delay -= dt;
        continue;
      }
      tween.elapsed += dt;
      const t = Math.min(1, tween.elapsed / tween.duration);
      tween.update(t);
      if (t >= 1) {
        const index = this.tweens.indexOf(tween);
        if (index >= 0) this.tweens.splice(index, 1);
        tween.done?.();
      }
    }
  }

  private animate(): void {
    if (this.disposed) return;
    const dt = Math.min(0.05, this.clock.getDelta());
    const time = this.clock.elapsedTime;

    this.updateTweens(dt);
    this.updateConfetti(dt);

    if (this.selectFrame.visible) {
      this.highlightTimer += dt;
      const pulse = 1 + Math.sin(this.highlightTimer * 4) * 0.02;
      this.selectFrame.scale.setScalar(pulse);
      this.selectFrame.position.y = 0.27 + Math.sin(this.highlightTimer * 2.5) * 0.008;
    }

    this.pawns.forEach((pawn, index) => {
      if (this.movingPlayer === pawn.playerId) return;
      const bob = Math.sin(time * 2.1 + pawn.phase) * 0.012;
      pawn.group.position.y = 0.27 + bob;
      const active = pawn.playerId === this.activePlayer;
      const glow = active ? 0.55 : 0.3;
      const base = pawn.group.children[0] as THREE.Mesh;
      if (base?.material) {
        (base.material as THREE.MeshStandardMaterial).emissiveIntensity =
          glow + Math.sin(time * 3 + index) * 0.1;
      }
    });

    if (this.tower) {
      this.tower.rotation.y = Math.sin(time * 0.12) * 0.03;
      this.tower.children.forEach((child) => {
        if (child.userData.crown && this.towerCrown) {
          child.rotation.y = time * 0.35;
          child.position.y = this.towerCrown.position.y + Math.sin(time * 1.2) * 0.02;
        }
        if (child.userData.halo && this.towerHalo) {
          child.rotation.z = time * 0.2;
        }
      });
    }

    const sway = Math.sin(time * 0.1) * 0.02;
    const pos = this.baseCameraPos.clone().applyAxisAngle(Y_AXIS, sway);
    this.camera.position.copy(pos);
    this.camera.lookAt(0, 0.35, 0);

    if (this.celebrating > 0) {
      this.celebrating += dt;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.fitCamera();
    this.camera.updateProjectionMatrix();
  }

  private fitCamera(): void {
    const direction = new THREE.Vector3(0.12, 1.0, 0.78).normalize();
    const target = new THREE.Vector3(0, 0.35, 0);
    const corners = [
      new THREE.Vector3(-5.85, 0.1, -5.85),
      new THREE.Vector3(5.85, 0.1, -5.85),
      new THREE.Vector3(-5.85, 0.1, 5.85),
      new THREE.Vector3(5.85, 0.1, 5.85),
    ];
    const marginX = 0.92;
    const marginY = 0.86;

    let low = 8;
    let high = 90;
    let best = 28;
    for (let iteration = 0; iteration < 18; iteration += 1) {
      const distance = (low + high) / 2;
      this.camera.position.copy(direction.clone().multiplyScalar(distance)).add(target);
      this.camera.lookAt(target);
      this.camera.updateMatrixWorld(true);
      this.camera.updateProjectionMatrix();
      const fits = corners.every((corner) => {
        const projected = corner.clone().project(this.camera);
        return (
          Math.abs(projected.x) <= marginX &&
          Math.abs(projected.y) <= marginY &&
          projected.z < 1
        );
      });
      if (fits) {
        best = distance;
        high = distance;
      } else {
        low = distance;
      }
    }

    this.baseCameraPos.copy(direction.multiplyScalar(best)).add(target);
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(target);
    this.camera.updateProjectionMatrix();
  }

  private disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        const material = child.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      }
    });
  }

  dispose(): void {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.disposeObject(this.scene);
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
