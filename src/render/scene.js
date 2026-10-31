import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  BOARD_SPACING,
  DISTRICTS,
  LEVEL_MULTIPLIER,
  PLAYER_BLUEPRINTS,
  PROPERTIES,
  TILES,
  boardPosition,
  levelRent,
  tileGridPosition
} from '../game/constants.js'
import { population } from '../game/life.js'
import {
  boardTexture,
  cloudTexture,
  glowTexture,
  grassTexture,
  pipTexture
} from './textures.js'

const TILE_SIZE = 1.68
const TILE_TOP = 0.31
const CELL_AREA = 1.12
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

const TYPE_COLORS = {
  start: { accent: '#B9F26B', pale: '#E8F8CE' },
  mutation: { accent: '#FF8F6B', pale: '#F8D9CD' },
  ecosystem: { accent: '#7EDDA0', pale: '#D7F2DF' },
  tax: { accent: '#FF6F61', pale: '#F7D4CE' },
  dormancy: { accent: '#8FA7C9', pale: '#DCE4F1' },
  sanctuary: { accent: '#FFD37A', pale: '#F8EAC7' },
  geneLab: { accent: '#C7A6FF', pale: '#EBE0FF' }
}

const TYPE_ICONS = {
  start: '✦',
  mutation: '✺',
  ecosystem: '❋',
  tax: '◈',
  dormancy: '☾',
  sanctuary: '❀',
  geneLab: '⌬'
}

function rounded(w, h, d, r = 0.08) {
  return new RoundedBoxGeometry(w, h, d, 3, r)
}

function color(hex) {
  return new THREE.Color(hex)
}

function mesh(geometry, material, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geometry, material)
  m.castShadow = cast
  m.receiveShadow = receive
  return m
}

export class Scene3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.onTileTap = options.onTileTap || (() => {})
    this.onHover = options.onHover || (() => {})
    this.reducedMotion = options.reducedMotion || false
    this.quality = options.quality || 'high'

    this.state = null
    this.mode = 'title'
    this.tokens = new Map()
    this.colonyViews = new Map()
    this.tileObjects = []
    this.pickables = []
    this.tweens = []
    this.hoverTile = null
    this.selectedTile = null
    this.activeTile = null
    this.autoRotate = true
    this.showDebug = false
    this.disposed = false

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.08
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x081b1c, 1)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x0a2424, 0.012)

    this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 160)
    this.cameraBase = { theta: 0.16, elevation: 0.94, zoom: 1 }
    this.cameraState = { theta: 0.64, elevation: 0.92, zoom: 1 }
    this.cameraTarget = new THREE.Vector3(0, 0.1, 0)
    this.cameraGoal = new THREE.Vector3(0, 0.1, 0)
    this.autoAngle = 0
    this.cameraDistance = 42
    this.fitDirty = true
    this.lastAspect = 0
    this.screenW = 1
    this.screenH = 1

    this.lastFrameTime = performance.now()
    this.elapsed = 0
    this.timeScale = 1
    this.pointer = {
      down: false,
      moved: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      id: null,
      pinch: null
    }
    this.raycaster = new THREE.Raycaster()
    this.ndc = new THREE.Vector2()

    this.buildLights()
    this.buildSky()
    this.buildBoard()
    this.buildGarden()
    this.buildTiles()
    this.buildDice()
    this.buildSelectionRings()
    this.buildTokensFromState(null)
    this.resize()
    this.bindEvents()
    this.loop = this.loop.bind(this)
    this.raf = requestAnimationFrame(this.loop)
  }

  // ---------------------------------------------------------------- lighting
  buildLights() {
    const hemi = new THREE.HemisphereLight(0xd9fff0, 0x2a1c36, 1.35)
    this.scene.add(hemi)

    const key = new THREE.DirectionalLight(0xffe7bd, 2.6)
    key.position.set(7, 15, 8)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = -11
    key.shadow.camera.right = 11
    key.shadow.camera.top = 11
    key.shadow.camera.bottom = -11
    key.shadow.camera.near = 1
    key.shadow.camera.far = 40
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.03
    this.keyLight = key
    this.scene.add(key)
    this.scene.add(key.target)

    const fill = new THREE.DirectionalLight(0x6fd6ff, 0.75)
    fill.position.set(-9, 7, -7)
    this.scene.add(fill)

    const warm = new THREE.PointLight(0xffb677, 22, 22, 2)
    warm.position.set(0, 5, 1)
    this.scene.add(warm)
    this.centerLight = warm
  }

  // --------------------------------------------------------------------- sky
  buildSky() {
    const geometry = new THREE.SphereGeometry(70, 32, 24)
    const material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        top: { value: color('#061618') },
        mid: { value: color('#103635') },
        bottom: { value: color('#25534a') },
        glow: { value: color('#efad7c') }
      },
      vertexShader: `
        varying vec3 vPos;
        void main(){
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; uniform vec3 glow;
        varying vec3 vPos;
        void main(){
          float h = normalize(vPos).y;
          vec3 c = mix(bottom, mid, smoothstep(-0.65, 0.05, h));
          c = mix(c, top, smoothstep(0.0, 0.9, h));
          float band = smoothstep(0.22, 0.0, abs(h + 0.18));
          c = mix(c, glow, band * 0.28);
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }
      `
    })
    this.sky = new THREE.Mesh(geometry, material)
    this.sky.renderOrder = -10
    this.scene.add(this.sky)

    // stars
    const starCount = 320
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 45 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 1.6 - 0.6)
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      positions[i * 3 + 1] = Math.cos(phi) * r
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xdcffe9,
        size: 0.22,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
    this.scene.add(this.stars)

    // clouds drift beneath the island
    const cloudMap = cloudTexture()
    this.clouds = []
    for (let i = 0; i < 10; i++) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: cloudMap,
          transparent: true,
          opacity: 0.11 + Math.random() * 0.09,
          depthWrite: false,
          toneMapped: false
        })
      )
      const angle = Math.random() * Math.PI * 2
      const radius = 16 + Math.random() * 18
      sprite.position.set(Math.cos(angle) * radius, -6 - Math.random() * 8, Math.sin(angle) * radius)
      const s = 10 + Math.random() * 12
      sprite.scale.set(s, s * 0.48, 1)
      sprite.userData.speed = 0.04 + Math.random() * 0.07
      this.clouds.push(sprite)
      this.scene.add(sprite)
    }

    // fireflies
    const fireflyCount = 48
    const flyPositions = new Float32Array(fireflyCount * 3)
    this.fireflyData = []
    for (let i = 0; i < fireflyCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 7.5 + Math.random() * 3.5
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = 0.6 + Math.random() * 3.2
      flyPositions.set([x, y, z], i * 3)
      this.fireflyData.push({ x, z, y, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.7 })
    }
    const flyGeo = new THREE.BufferGeometry()
    flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPositions, 3))
    this.fireflies = new THREE.Points(
      flyGeo,
      new THREE.PointsMaterial({
        color: 0xd6ff8e,
        size: 0.16,
        map: glowTexture('#D6FF8E'),
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
    this.scene.add(this.fireflies)

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture('#F7B27E'),
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false
      })
    )
    halo.position.set(0, -1, -12)
    halo.scale.set(34, 34, 1)
    this.scene.add(halo)
  }

  // ------------------------------------------------------------------- board
  buildBoard() {
    const group = new THREE.Group()
    this.boardGroup = group
    this.scene.add(group)

    const boardMap = boardTexture()
    boardMap.wrapS = boardMap.wrapT = THREE.RepeatWrapping
    boardMap.repeat.set(2, 2)

    const top = mesh(rounded(15.1, 0.55, 15.1, 0.32), new THREE.MeshStandardMaterial({
      map: boardMap,
      color: 0x2a6a5b,
      roughness: 0.82,
      metalness: 0.02
    }))
    top.position.y = -0.28
    top.receiveShadow = true
    group.add(top)

    const rim = mesh(rounded(16.0, 0.42, 16.0, 0.35), new THREE.MeshStandardMaterial({
      color: 0xe8dcc0,
      roughness: 0.72
    }))
    rim.position.y = -0.34
    rim.receiveShadow = true
    group.add(rim)

    const field = mesh(new THREE.PlaneGeometry(13.6, 13.6), new THREE.MeshStandardMaterial({
      map: boardMap,
      color: 0x2f7663,
      roughness: 0.9
    }), { cast: false })
    field.rotation.x = -Math.PI / 2
    field.position.y = 0.005
    field.receiveShadow = true
    group.add(field)

    const soil = mesh(rounded(14.4, 0.9, 14.4, 0.5), new THREE.MeshStandardMaterial({
      color: 0x5a4030,
      roughness: 1
    }), { cast: false })
    soil.position.y = -0.95
    group.add(soil)

    const rock = mesh(rounded(13.2, 1.3, 13.2, 0.6), new THREE.MeshStandardMaterial({
      color: 0x3a3137,
      roughness: 0.95
    }), { cast: false })
    rock.position.y = -1.95
    group.add(rock)

    const deep = mesh(new THREE.ConeGeometry(6.1, 4.2, 7, 2), new THREE.MeshStandardMaterial({
      color: 0x2b2832,
      roughness: 1,
      flatShading: true
    }), { cast: false })
    deep.position.y = -4.4
    deep.rotation.y = 0.4
    group.add(deep)

    // hanging roots / vines
    const rootMat = new THREE.MeshStandardMaterial({ color: 0x6f563f, roughness: 1 })
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 + 0.3
      const radius = 5.4 + (i % 3) * 0.5
      const root = mesh(new THREE.CylinderGeometry(0.06, 0.16, 1.2 + (i % 4) * 0.8, 5), rootMat, {
        cast: false
      })
      root.position.set(Math.cos(angle) * radius, -3.2 - (i % 3) * 0.4, Math.sin(angle) * radius)
      root.rotation.z = 0.15 * Math.sin(angle)
      group.add(root)
    }

    // corner posts
    const postMat = new THREE.MeshStandardMaterial({ color: 0xd9c9a7, roughness: 0.6 })
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xffd37a,
      emissive: 0xffb347,
      emissiveIntensity: 0.5,
      roughness: 0.25
    })
    for (const [x, z] of [[7.35, 7.35], [-7.35, 7.35], [-7.35, -7.35], [7.35, -7.35]]) {
      const post = mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.8, 8), postMat)
      post.position.set(x, 0.1, z)
      group.add(post)
      const gem = mesh(new THREE.OctahedronGeometry(0.18, 0), gemMat, { cast: false })
      gem.position.set(x, 0.62, z)
      group.add(gem)
    }

    // soft contact shadow below the floating board
    const shadow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture('#000000'),
        color: 0x000000,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        toneMapped: false
      })
    )
    shadow.position.y = -9
    shadow.scale.set(22, 8, 1)
    group.add(shadow)
  }

  buildGarden() {
    const garden = new THREE.Group()
    garden.position.y = 0.02
    this.garden = garden
    this.boardGroup.add(garden)

    const grassMap = grassTexture()
    grassMap.wrapS = grassMap.wrapT = THREE.RepeatWrapping
    grassMap.repeat.set(2, 2)
    const ground = mesh(new THREE.CylinderGeometry(5.0, 5.3, 0.22, 48), new THREE.MeshStandardMaterial({
      map: grassMap,
      color: 0x5f9d58,
      roughness: 0.95
    }))
    ground.position.y = 0.11
    ground.receiveShadow = true
    garden.add(ground)

    // little paths
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xcfbd98, roughness: 0.9 })
    const path = mesh(new THREE.CircleGeometry(1.2, 24), pathMat, { cast: false })
    path.rotation.x = -Math.PI / 2
    path.scale.set(1.6, 0.55, 1)
    path.position.set(0.4, 0.235, 1.3)
    garden.add(path)

    // pond
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x3aa9b8,
      roughness: 0.2,
      metalness: 0.15,
      transparent: true,
      opacity: 0.9
    })
    const pond = mesh(new THREE.CircleGeometry(1.05, 32), pondMat, { cast: false })
    pond.rotation.x = -Math.PI / 2
    pond.position.set(2.35, 0.225, 1.55)
    garden.add(pond)
    this.pond = pond
    const pondRim = mesh(new THREE.TorusGeometry(1.08, 0.1, 8, 40), new THREE.MeshStandardMaterial({
      color: 0x8f7c60,
      roughness: 0.8
    }), { cast: false })
    pondRim.rotation.x = -Math.PI / 2
    pondRim.position.set(2.35, 0.24, 1.55)
    garden.add(pondRim)

    // central plinth for the dice
    const plinth = mesh(new THREE.CylinderGeometry(1.55, 1.85, 0.5, 32), new THREE.MeshStandardMaterial({
      color: 0x2b4a42,
      roughness: 0.55,
      metalness: 0.15
    }))
    plinth.position.y = 0.42
    plinth.receiveShadow = true
    garden.add(plinth)

    const plinthTop = mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.06, 32), new THREE.MeshStandardMaterial({
      color: 0x1b352f,
      roughness: 0.4
    }), { cast: false })
    plinthTop.position.y = 0.7
    garden.add(plinthTop)

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.05, 8, 48), new THREE.MeshBasicMaterial({
      color: 0xb9f26b,
      transparent: true,
      opacity: 0.75
    }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.73
    garden.add(ring)
    this.diceRing = ring

    // trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 1 })
    const leafMats = [
      new THREE.MeshStandardMaterial({ color: 0x4e8f4f, roughness: 0.9, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: 0x6fae5b, roughness: 0.9, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: 0x3f7c49, roughness: 0.9, flatShading: true })
    ]
    const tree = (x, z, scale = 1, variant = 0) => {
      const g = new THREE.Group()
      g.position.set(x, 0.22, z)
      g.scale.setScalar(scale)
      const trunk = mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.7, 6), trunkMat)
      trunk.position.y = 0.35
      g.add(trunk)
      if (variant === 0) {
        const crown = mesh(new THREE.IcosahedronGeometry(0.55, 0), leafMats[0])
        crown.position.y = 0.92
        crown.scale.set(1, 1.1, 1)
        g.add(crown)
        const crown2 = mesh(new THREE.IcosahedronGeometry(0.36, 0), leafMats[1])
        crown2.position.set(0.26, 1.18, 0.1)
        g.add(crown2)
      } else {
        const crown = mesh(new THREE.ConeGeometry(0.48, 1.1, 7), leafMats[2])
        crown.position.y = 1.0
        g.add(crown)
        const crown2 = mesh(new THREE.ConeGeometry(0.36, 0.8, 7), leafMats[0])
        crown2.position.y = 1.45
        g.add(crown2)
      }
      garden.add(g)
      return g
    }
    tree(-3.2, -1.6, 1.15, 0)
    tree(-2.35, -2.6, 0.9, 1)
    tree(-3.6, 1.9, 1.0, 1)
    tree(3.4, -2.2, 1.05, 0)
    tree(1.5, -3.2, 0.85, 1)
    tree(3.9, 0.2, 0.7, 0)

    // bushes and rocks
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x5f9c52, roughness: 1, flatShading: true })
    for (const [x, z, s] of [[-1.3, 2.8, 0.3], [0.6, 2.9, 0.22], [-3.9, -0.3, 0.26], [2.5, -2.7, 0.25], [4.1, 2.1, 0.2]]) {
      const bush = mesh(new THREE.IcosahedronGeometry(s, 0), bushMat)
      bush.position.set(x, 0.3, z)
      garden.add(bush)
    }
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x6d6a63, roughness: 1, flatShading: true })
    for (const [x, z, s] of [[1.6, 2.7, 0.25], [-1.8, -2.4, 0.2], [4.4, -0.6, 0.18], [-4.5, 1.0, 0.2]]) {
      const rock = mesh(new THREE.DodecahedronGeometry(s, 0), rockMat)
      rock.position.set(x, 0.28, z)
      rock.rotation.set(Math.random(), Math.random(), Math.random())
      garden.add(rock)
    }

    // flowers in district colours
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x4d7c45, roughness: 1 })
    const flowerColors = Object.values(DISTRICTS).map((d) => d.color)
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3.2 + Math.random() * 1.6
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      if (x > 1.2 && x < 3.6 && z > 0.2 && z < 2.9) continue
      const stem = mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.14, 4), stemMat, { cast: false })
      stem.position.set(x, 0.28, z)
      garden.add(stem)
      const petal = mesh(new THREE.IcosahedronGeometry(0.055, 0), new THREE.MeshStandardMaterial({
        color: flowerColors[i % flowerColors.length],
        emissive: flowerColors[i % flowerColors.length],
        emissiveIntensity: 0.22,
        roughness: 0.6,
        flatShading: true
      }), { cast: false })
      petal.position.set(x, 0.37, z)
      garden.add(petal)
    }

    // genesis tree with orbiting cells
    const genesis = new THREE.Group()
    genesis.position.set(-2.5, 0.22, 1.35)
    garden.add(genesis)
    const gTrunk = mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.4, 7), trunkMat)
    gTrunk.position.y = 0.7
    genesis.add(gTrunk)
    const canopies = [
      [0, 1.62, 0, 0.78, 0x74b85e],
      [0.48, 1.42, 0.2, 0.5, 0x8dcd6c],
      [-0.42, 1.5, -0.22, 0.54, 0x5c9e50]
    ]
    for (const [x, y, z, r, c] of canopies) {
      const canopy = mesh(new THREE.IcosahedronGeometry(r, 0), new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.85,
        flatShading: true
      }))
      canopy.position.set(x, y, z)
      genesis.add(canopy)
    }
    this.orbitingCells = []
    for (let i = 0; i < 5; i++) {
      const cell = mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), new THREE.MeshStandardMaterial({
        color: 0xd6ff8e,
        emissive: 0xb9f26b,
        emissiveIntensity: 1.1,
        roughness: 0.3
      }), { cast: false })
      genesis.add(cell)
      this.orbitingCells.push({ mesh: cell, angle: (i / 5) * Math.PI * 2, radius: 1.15 + (i % 2) * 0.25, height: 1.5 + (i % 3) * 0.35 })
    }

    // district flags around the garden
    Object.values(DISTRICTS).forEach((district, i) => {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
      const flag = new THREE.Group()
      flag.position.set(Math.cos(angle) * 4.15, 0.24, Math.sin(angle) * 4.15)
      const pole = mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.7, 5), new THREE.MeshStandardMaterial({
        color: 0xd8c9a8,
        roughness: 0.7
      }), { cast: false })
      pole.position.y = 0.35
      flag.add(pole)
      const cloth = mesh(new THREE.PlaneGeometry(0.34, 0.2), new THREE.MeshStandardMaterial({
        color: district.color,
        emissive: district.color,
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide,
        roughness: 0.7
      }), { cast: false })
      cloth.position.set(0.17, 0.62, 0)
      flag.add(cloth)
      garden.add(flag)
    })
  }

  buildTiles() {
    const edgeColor = '#F6EFDF'
    const baseMat = new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.7 })
    const hitMat = new THREE.MeshBasicMaterial({ visible: false })

    TILES.forEach((tile) => {
      const pos = boardPosition(tile.tile)
      const group = new THREE.Group()
      group.position.set(pos.x, 0, pos.z)
      group.rotation.y = pos.rot
      this.boardGroup.add(group)

      const base = mesh(rounded(TILE_SIZE, 0.24, TILE_SIZE, 0.07), baseMat)
      base.position.y = 0.14
      base.receiveShadow = true
      group.add(base)

      const colors = tile.type === 'property'
        ? { accent: DISTRICTS[tile.district].color, pale: DISTRICTS[tile.district].pale }
        : TYPE_COLORS[tile.type]
      const topMat = new THREE.MeshStandardMaterial({ color: colors.pale, roughness: 0.72 })
      const top = mesh(rounded(TILE_SIZE - 0.2, 0.06, TILE_SIZE - 0.2, 0.05), topMat, { cast: false })
      top.position.y = 0.275
      top.receiveShadow = true
      group.add(top)

      const strip = mesh(new THREE.BoxGeometry(TILE_SIZE - 0.2, 0.1, 0.12), new THREE.MeshStandardMaterial({
        color: colors.accent,
        emissive: colors.accent,
        emissiveIntensity: 0.12,
        roughness: 0.55
      }), { cast: false })
      strip.position.set(0, 0.28, TILE_SIZE / 2 - 0.13)
      group.add(strip)

      const hit = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE + 0.22, 0.8, TILE_SIZE + 0.22), hitMat)
      hit.position.y = 0.5
      hit.userData.tile = tile.tile
      group.add(hit)
      this.pickables.push(hit)

      const view = { tile, group, top, strip, base, colors, hit, icon: null, ownerRing: null }
      this.tileObjects.push(view)

      if (tile.type === 'property') {
        const dots = Math.min(4, 1 + Math.floor((tile.price - 100) / 55))
        for (let i = 0; i < dots; i++) {
          const dot = mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({
            color: 0xffd37a,
            emissive: 0xffb347,
            emissiveIntensity: 0.6,
            metalness: 0.6,
            roughness: 0.3
          }), { cast: false })
          dot.position.set(-0.3 + i * 0.2, 0.33, 0.62)
          group.add(dot)
        }
      } else {
        this.addTileIcon(view)
      }
    })
  }

  addTileIcon(view) {
    const tile = view.tile
    const g = new THREE.Group()
    g.position.y = 0.3
    view.group.add(g)
    const accent = TYPE_COLORS[tile.type].accent

    if (tile.type === 'start') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.055, 8, 32), new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.8,
        roughness: 0.3
      }))
      ring.position.y = 0.55
      ring.rotation.y = 0.4
      g.add(ring)
      const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 1), new THREE.MeshStandardMaterial({
        color: 0xf6ffe3,
        emissive: 0xb9f26b,
        emissiveIntensity: 1.4,
        roughness: 0.2
      }))
      orb.position.y = 0.55
      g.add(orb)
      view.spin = [ring, orb]
    } else if (tile.type === 'mutation') {
      const core = mesh(new THREE.IcosahedronGeometry(0.22, 0), new THREE.MeshStandardMaterial({
        color: 0xff8f6b,
        emissive: 0xff6f4f,
        emissiveIntensity: 0.45,
        roughness: 0.5,
        flatShading: true
      }))
      core.position.y = 0.45
      g.add(core)
      for (let i = 0; i < 10; i++) {
        const spike = mesh(new THREE.ConeGeometry(0.05, 0.24, 4), new THREE.MeshStandardMaterial({
          color: 0xffb39d,
          roughness: 0.6
        }), { cast: false })
        const a = (i / 10) * Math.PI * 2
        spike.position.set(Math.cos(a) * 0.25, 0.45 + Math.sin(i * 2) * 0.12, Math.sin(a) * 0.25)
        spike.rotation.z = -Math.cos(a) * 1.2
        spike.rotation.x = Math.sin(a) * 1.2
        g.add(spike)
      }
      view.spin = [core]
    } else if (tile.type === 'ecosystem') {
      for (let i = 0; i < 3; i++) {
        const leaf = mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshStandardMaterial({
          color: 0x7edda0,
          emissive: 0x3f9a65,
          emissiveIntensity: 0.25,
          roughness: 0.7,
          flatShading: true
        }))
        leaf.scale.set(1, 0.28, 0.55)
        leaf.position.set(-0.16 + i * 0.16, 0.38 + i * 0.12, 0)
        leaf.rotation.z = -0.5 + i * 0.4
        g.add(leaf)
      }
    } else if (tile.type === 'tax') {
      for (let i = 0; i < 3; i++) {
        const coin = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20), new THREE.MeshStandardMaterial({
          color: 0xffd37a,
          emissive: 0xff9f3a,
          emissiveIntensity: 0.35,
          metalness: 0.8,
          roughness: 0.25
        }))
        coin.position.y = 0.33 + i * 0.075
        coin.rotation.y = i * 0.4
        g.add(coin)
      }
    } else if (tile.type === 'dormancy') {
      const crystal = mesh(new THREE.OctahedronGeometry(0.28, 0), new THREE.MeshStandardMaterial({
        color: 0x8fa7c9,
        emissive: 0x5a74a8,
        emissiveIntensity: 0.45,
        roughness: 0.3,
        metalness: 0.2,
        flatShading: true
      }))
      crystal.position.y = 0.48
      crystal.scale.y = 1.35
      g.add(crystal)
      view.spin = [crystal]
    } else if (tile.type === 'sanctuary') {
      const center = mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshStandardMaterial({
        color: 0xffe49a,
        emissive: 0xffbe4d,
        emissiveIntensity: 0.8,
        roughness: 0.4
      }), { cast: false })
      center.position.y = 0.45
      g.add(center)
      for (let i = 0; i < 6; i++) {
        const petal = mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshStandardMaterial({
          color: 0xffd37a,
          emissive: 0xffa94d,
          emissiveIntensity: 0.35,
          roughness: 0.6
        }), { cast: false })
        const a = (i / 6) * Math.PI * 2
        petal.scale.set(1, 0.4, 0.65)
        petal.position.set(Math.cos(a) * 0.2, 0.45, Math.sin(a) * 0.2)
        petal.rotation.y = -a
        g.add(petal)
      }
    } else if (tile.type === 'geneLab') {
      const flask = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 10), new THREE.MeshStandardMaterial({
        color: 0xe7dcff,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8
      }), { cast: false })
      flask.position.y = 0.38
      g.add(flask)
      const bulb = mesh(new THREE.ConeGeometry(0.24, 0.32, 12), new THREE.MeshStandardMaterial({
        color: 0xc7a6ff,
        emissive: 0x9d6bff,
        emissiveIntensity: 0.65,
        roughness: 0.25,
        transparent: true,
        opacity: 0.85
      }), { cast: false })
      bulb.position.y = 0.55
      bulb.rotation.z = Math.PI
      g.add(bulb)
      const liquid = mesh(new THREE.CylinderGeometry(0.19, 0.05, 0.2, 12), new THREE.MeshBasicMaterial({
        color: 0xb9f26b
      }), { cast: false })
      liquid.position.y = 0.48
      g.add(liquid)
    }
    view.icon = g
  }

  // ---------------------------------------------------------------- colonies
  createColonyView(colony) {
    const tile = PROPERTIES.get(colony.tile)
    const district = DISTRICTS[tile.district]
    const pos = boardPosition(colony.tile)
    const group = new THREE.Group()
    group.position.set(pos.x, TILE_TOP + 0.01, pos.z)
    this.boardGroup.add(group)

    const base = mesh(new THREE.CylinderGeometry(0.62, 0.67, 0.05, 28), new THREE.MeshStandardMaterial({
      color: 0x12332e,
      roughness: 0.85
    }), { cast: false })
    base.position.y = 0.025
    base.receiveShadow = true
    group.add(base)

    const ownerRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.035, 8, 48), new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    }))
    ownerRing.rotation.x = -Math.PI / 2
    ownerRing.position.y = 0.055
    group.add(ownerRing)

    const view = {
      tile,
      district,
      group,
      base,
      ownerRing,
      mesh: null,
      size: 0,
      h: [],
      target: [],
      colors: [],
      lastOwner: undefined,
      lastLevel: undefined
    }
    this.rebuildColonyMesh(view, colony)
    this.colonyViews.set(colony.tile, view)
    return view
  }

  rebuildColonyMesh(view, colony) {
    if (view.mesh) {
      view.group.remove(view.mesh)
      view.mesh.geometry.dispose()
      view.mesh.material.dispose()
      view.mesh = null
    }
    const size = colony.size
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.38,
      metalness: 0.04,
      emissive: 0xffffff,
      emissiveIntensity: 0.06
    })
    const geo = new THREE.BoxGeometry(1, 1, 1)
    const inst = new THREE.InstancedMesh(geo, material, size * size)
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    inst.receiveShadow = true
    inst.castShadow = false
    view.group.add(inst)
    view.mesh = inst
    view.size = size
    view.h = new Array(size * size).fill(0)
    view.target = new Array(size * size).fill(0)
    view.colors = new Array(size * size).fill(null)
    view.tempColor = new THREE.Color()
    view.tempMatrix = new THREE.Matrix4()
    view.tempPos = new THREE.Vector3()
    view.tempScale = new THREE.Vector3()
    view.tempQuat = new THREE.Quaternion()
    for (let i = 0; i < size * size; i++) {
      view.h[i] = colony.cells[i] ? 1 : 0
      view.target[i] = view.h[i]
      inst.setColorAt(i, new THREE.Color(0x12332e))
    }
    inst.instanceColor.needsUpdate = true
    this.applyColonyColors(view, colony)
    this.writeColonyMatrix(view, colony)
  }

  applyColonyColors(view, colony) {
    if (!view.mesh) return
    const owner = colony.owner != null ? PLAYER_BLUEPRINTS.find((p) => p.id === colony.owner) : null
    const live = new THREE.Color(view.district.color).lerp(new THREE.Color('#ffffff'), 0.16)
    if (owner) live.lerp(new THREE.Color(owner.color), 0.18)
    const dead = new THREE.Color(0x1d453c)
    const deadOwned = new THREE.Color(0x28524a)
    for (let i = 0; i < view.size * view.size; i++) {
      const c = colony.cells[i] ? live : owner ? deadOwned : dead
      if (!view.colors[i] || !view.colors[i].equals(c)) {
        view.colors[i] = c.clone()
        view.mesh.setColorAt(i, c)
      }
    }
    view.mesh.instanceColor.needsUpdate = true
    if (owner) {
      view.ownerRing.material.color.set(owner.color)
      view.ownerRing.material.opacity = 0.9
      view.base.material.color.set(0x1b443c)
    } else {
      view.ownerRing.material.opacity = 0
      view.base.material.color.set(0x12332e)
    }
  }

  writeColonyMatrix(view, colony) {
    const size = view.size
    const spacing = CELL_AREA / size
    const cell = spacing * 0.8
    const half = CELL_AREA / 2 - spacing / 2
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x
        const h = view.h[i]
        const height = 0.03 + h * 0.22
        view.tempPos.set(x * spacing - half, 0.06 + height / 2, y * spacing - half)
        view.tempScale.set(cell, height, cell)
        view.tempMatrix.compose(view.tempPos, view.tempQuat, view.tempScale)
        view.mesh.setMatrixAt(i, view.tempMatrix)
      }
    }
    view.mesh.instanceMatrix.needsUpdate = true
    view.mesh.count = size * size
  }

  syncColonies(state, force = false) {
    for (const colony of Object.values(state.colonies)) {
      let view = this.colonyViews.get(colony.tile)
      if (!view) view = this.createColonyView(colony)
      if (view.size !== colony.size || force) {
        this.rebuildColonyMesh(view, colony)
      }
      for (let i = 0; i < view.size * view.size; i++) view.target[i] = colony.cells[i] ? 1 : 0
      this.applyColonyColors(view, colony)
      view.lastOwner = colony.owner
      view.lastLevel = colony.level
    }
  }

  animateEvolution(reports) {
    const tasks = []
    for (const report of reports) {
      const view = this.colonyViews.get(report.tile)
      if (!view) continue
      for (let i = 0; i < view.size * view.size; i++) {
        view.h[i] = report.before[i] ? 1 : 0
        view.target[i] = report.after[i] ? 1 : 0
      }
      view.mesh.instanceMatrix.needsUpdate = true
    }
    return this.addTween(760, (p) => {
      // heights are interpolated by the main loop; this tween just controls wait
    })
  }

  // ------------------------------------------------------------------ tokens
  buildTokensFromState(state) {
    for (const token of this.tokens.values()) {
      this.boardGroup.remove(token.group)
    }
    this.tokens.clear()
    if (!state) return
    for (const player of state.players) {
      const token = this.createToken(player)
      this.boardGroup.add(token.group)
      this.tokens.set(player.id, token)
      token.group.position.copy(this.tokenPosition(player, player.pos))
      token.tile = player.pos
    }
  }

  createToken(player) {
    const group = new THREE.Group()
    const blueprint = PLAYER_BLUEPRINTS.find((p) => p.id === player.id) || player
    const main = new THREE.MeshStandardMaterial({
      color: blueprint.color,
      emissive: blueprint.color,
      emissiveIntensity: 0.16,
      roughness: 0.32,
      metalness: 0.12
    })
    const pale = new THREE.Color(blueprint.color).lerp(new THREE.Color('#FFFFFF'), 0.55)

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.028, 8, 32), new THREE.MeshBasicMaterial({
      color: blueprint.color,
      transparent: true,
      opacity: 0.8
    }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    group.add(ring)

    const profile = [
      [0, 0],
      [0.17, 0.015],
      [0.19, 0.06],
      [0.15, 0.13],
      [0.095, 0.24],
      [0.085, 0.33],
      [0.13, 0.37],
      [0.13, 0.41],
      [0.09, 0.45],
      [0, 0.46]
    ].map(([x, y]) => new THREE.Vector2(x, y))
    const body = mesh(new THREE.LatheGeometry(profile, 24), main)
    body.position.y = 0.04
    group.add(body)

    const head = mesh(new THREE.SphereGeometry(0.135, 20, 16), new THREE.MeshStandardMaterial({
      color: pale,
      emissive: blueprint.color,
      emissiveIntensity: 0.15,
      roughness: 0.25
    }))
    head.position.y = 0.56
    group.add(head)

    const accent = new THREE.MeshStandardMaterial({
      color: pale,
      roughness: 0.5,
      emissive: blueprint.color,
      emissiveIntensity: 0.2,
      flatShading: true
    })
    if (player.token === 'sprout') {
      for (const s of [-1, 1]) {
        const leaf = mesh(new THREE.SphereGeometry(0.11, 8, 6), accent)
        leaf.scale.set(1.3, 0.28, 0.55)
        leaf.position.set(s * 0.1, 0.69, 0)
        leaf.rotation.z = s * -0.7
        group.add(leaf)
      }
    } else if (player.token === 'koi') {
      const tail = mesh(new THREE.ConeGeometry(0.12, 0.24, 4), accent)
      tail.scale.z = 0.32
      tail.position.set(0, 0.58, -0.16)
      tail.rotation.x = Math.PI / 2
      group.add(tail)
      const fin = mesh(new THREE.ConeGeometry(0.06, 0.16, 4), accent)
      fin.position.set(0.14, 0.55, 0)
      fin.rotation.z = -1.1
      group.add(fin)
    } else if (player.token === 'ember') {
      for (const s of [-1, 1]) {
        const ear = mesh(new THREE.ConeGeometry(0.075, 0.18, 4), accent)
        ear.position.set(s * 0.09, 0.72, 0)
        ear.rotation.z = s * -0.25
        group.add(ear)
      }
    } else if (player.token === 'moth') {
      for (const s of [-1, 1]) {
        const wing = mesh(new THREE.CircleGeometry(0.16, 8), new THREE.MeshStandardMaterial({
          color: pale,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          emissive: blueprint.color,
          emissiveIntensity: 0.25
        }))
        wing.position.set(s * 0.17, 0.58, -0.04)
        wing.rotation.y = s * 0.9
        wing.scale.set(0.65, 1.15, 1)
        group.add(wing)
      }
    }

    const base = group.position
    return {
      group,
      ring,
      body,
      playerId: player.id,
      color: blueprint.color,
      tile: player.pos,
      hop: null,
      bobPhase: player.id * 1.7,
      baseY: TILE_TOP
    }
  }

  tokenPosition(player, tileIndex) {
    const pos = boardPosition(tileIndex)
    const angle = (player.id / 4) * Math.PI * 2 + Math.PI / 4
    return new THREE.Vector3(
      pos.x + Math.cos(angle) * 0.34,
      TILE_TOP + 0.02,
      pos.z + Math.sin(angle) * 0.34
    )
  }

  hopToken(player, from, to) {
    const token = this.tokens.get(player.id)
    if (!token) return Promise.resolve()
    const start = token.group.position.clone()
    const end = this.tokenPosition(player, to)
    token.tile = to
    const duration = this.reducedMotion ? 120 : 300
    return this.addTween(duration, (p) => {
      token.group.position.lerpVectors(start, end, p)
      token.group.position.y = start.y + Math.sin(p * Math.PI) * 0.48
      token.group.rotation.y = Math.PI * easeOut(p)
    }).then(() => {
      token.group.position.copy(end)
      token.group.rotation.y = 0
    })
  }

  setActivePlayer(player) {
    this.activeTile = player ? player.pos : null
    const ring = this.activeRing
    if (!ring) return
    if (!player) {
      ring.visible = false
      return
    }
    const pos = boardPosition(player.pos)
    ring.visible = true
    ring.position.set(pos.x, 0.315, pos.z)
    ring.material.color.set(player.color)
  }

  // -------------------------------------------------------------------- dice
  buildDice() {
    this.dice = []
    const faceValues = [1, 6, 2, 5, 3, 4]
    this.diceFaceValues = faceValues
    for (let d = 0; d < 2; d++) {
      const materials = faceValues.map((value) => new THREE.MeshStandardMaterial({
        map: pipTexture(value),
        roughness: 0.45,
        metalness: 0.05
      }))
      const die = mesh(new THREE.BoxGeometry(0.56, 0.56, 0.56), materials)
      die.position.set(d === 0 ? -0.5 : 0.5, 1.75, 0)
      die.castShadow = true
      die.receiveShadow = true
      this.boardGroup.add(die)
      this.dice.push({ mesh: die, rest: die.position.clone() })
    }
    this.diceGroup = new THREE.Group()
    this.diceGroup.visible = false
  }

  faceQuaternion(value, yaw = 0) {
    const q = new THREE.Quaternion()
    if (value === 2) q.identity()
    else if (value === 5) q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI)
    else if (value === 1) q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
    else if (value === 6) q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
    else if (value === 3) q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    else if (value === 4) q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
    const y = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
    return y.multiply(q)
  }

  rollDice(dice) {
    const duration = this.reducedMotion ? 260 : 1050
    const start = this.dice.map((d) => ({
      pos: d.mesh.position.clone(),
      quat: d.mesh.quaternion.clone()
    }))
    const targets = [dice.a, dice.b].map((value, i) => {
      const yaw = (Math.random() - 0.5) * 1.2 + (i ? 0.4 : -0.4)
      return this.faceQuaternion(value, yaw)
    })
    const randomQuats = this.dice.map(
      () => new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 8, Math.random() * 8, Math.random() * 8))
    )
    return this.addTween(duration, (p) => {
      this.dice.forEach((die, i) => {
        const s = start[i]
        const arc = Math.sin(p * Math.PI)
        die.mesh.position.set(
          s.pos.x + Math.sin(p * Math.PI * 2 + i) * 0.28 * (1 - p),
          1.75 + arc * 1.25 - p * 0.0,
          s.pos.z + Math.cos(p * Math.PI * 2 + i) * 0.14 * (1 - p)
        )
        const q = new THREE.Quaternion().slerpQuaternions(s.quat, randomQuats[i], Math.min(1, p * 2.2))
        const settle = Math.max(0, (p - 0.55) / 0.45)
        q.slerp(targets[i], easeOut(settle))
        die.mesh.quaternion.copy(q)
        die.mesh.rotation.y += (1 - settle) * 0.1
      })
    }).then(() => {
      this.dice.forEach((die, i) => {
        die.mesh.position.copy(die.rest)
        die.mesh.quaternion.copy(targets[i])
      })
      this.lastDice = dice
    })
  }

  // --------------------------------------------------------------- selection
  buildSelectionRings() {
    const ringGeo = new THREE.RingGeometry(0.72, 0.86, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd6ff8e,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    this.hoverRing = new THREE.Mesh(ringGeo, ringMat)
    this.hoverRing.rotation.x = -Math.PI / 2
    this.hoverRing.position.y = 0.315
    this.hoverRing.visible = false
    this.boardGroup.add(this.hoverRing)

    this.selectedRing = new THREE.Mesh(ringGeo.clone(), new THREE.MeshBasicMaterial({
      color: 0xffd37a,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }))
    this.selectedRing.rotation.x = -Math.PI / 2
    this.selectedRing.position.y = 0.31
    this.selectedRing.visible = false
    this.boardGroup.add(this.selectedRing)

    this.activeRing = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.06, 48), new THREE.MeshBasicMaterial({
      color: 0xb9f26b,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }))
    this.activeRing.rotation.x = -Math.PI / 2
    this.activeRing.position.y = 0.305
    this.activeRing.visible = false
    this.boardGroup.add(this.activeRing)
  }

  selectTile(tile, { focus = true } = {}) {
    this.selectedTile = tile
    if (tile == null) {
      this.selectedRing.visible = false
      return
    }
    const pos = boardPosition(tile)
    this.selectedRing.position.set(pos.x, 0.31, pos.z)
    this.selectedRing.visible = true
    this.selectedRing.material.opacity = 0
    this.addTween(320, (p) => {
      this.selectedRing.material.opacity = 0.2 * p
      this.selectedRing.scale.setScalar(1 + (1 - p) * 0.35)
    })
  }

  setHoverTile(tile) {
    this.hoverTile = tile
    if (tile == null) {
      this.hoverRing.visible = false
      this.canvas.style.cursor = ''
      return
    }
    const pos = boardPosition(tile)
    this.hoverRing.position.set(pos.x, 0.315, pos.z)
    this.hoverRing.visible = true
    this.canvas.style.cursor = 'pointer'
  }

  // ----------------------------------------------------------------- camera
  setMode(mode) {
    this.mode = mode
    this.autoRotate = mode === 'title'
    this.updateCameraBase()
    this.applyTileVisibility()
  }

  updateCameraBase() {
    const aspect = this.screenW / Math.max(1, this.screenH)
    if (this.mode === 'title') {
      this.cameraBase.theta = aspect > 0.9 ? 0.62 : 0.28
      this.cameraBase.elevation = 0.9
    } else {
      this.cameraBase.theta = aspect > 1.15 ? 0.55 : 0.13
      this.cameraBase.elevation = aspect > 1.15 ? 0.98 : 0.94
    }
    this.cameraState.theta = this.angleNear(this.cameraState.theta, this.cameraBase.theta)
    this.fitDirty = true
  }

  angleNear(current, target) {
    let diff = ((target - current + Math.PI * 3) % (Math.PI * 2)) - Math.PI
    return current + diff
  }

  rotate(step = Math.PI / 2) {
    this.cameraBase.theta += step
    this.fitDirty = true
  }

  zoom(delta) {
    this.cameraBase.zoom = THREE.MathUtils.clamp(this.cameraBase.zoom * delta, 0.82, 1.65)
    this.fitDirty = true
  }

  resetCamera() {
    this.cameraBase.zoom = 1
    this.updateCameraBase()
  }

  focusTile(tile) {
    const pos = boardPosition(tile)
    this.cameraGoal.set(pos.x * 0.18, 0.1, pos.z * 0.18)
    this.cameraBase.zoom = 1.12
    this.fitDirty = true
  }

  releaseFocus() {
    this.cameraGoal.set(0, 0.1, 0)
    this.cameraBase.zoom = 1
    this.fitDirty = true
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth
    const h = this.canvas.clientHeight || window.innerHeight
    this.screenW = w
    this.screenH = h
    this.renderer.setSize(w, h, false)
    this.updateCameraBase()
    this.fitCamera()
  }

  fitCamera() {
    const aspect = this.screenW / Math.max(1, this.screenH)
    const theta = this.cameraState.theta
    const elevation = this.cameraState.elevation
    const dir = new THREE.Vector3(
      Math.sin(theta) * Math.cos(elevation),
      Math.sin(elevation),
      Math.cos(theta) * Math.cos(elevation)
    )
    const position = this.cameraTarget.clone().add(dir.multiplyScalar(this.cameraDistance))
    this.camera.position.copy(position)
    this.camera.lookAt(this.cameraTarget)

    const forward = this.cameraTarget.clone().sub(position).normalize()
    const right = new THREE.Vector3().crossVectors(forward, WORLD_UP).normalize()
    const up = new THREE.Vector3().crossVectors(right, forward).normalize()

    const xExtent = 8.15
    const zExtent = 8.15
    let halfX = 0
    let halfY = 0
    for (const x of [-xExtent, xExtent]) {
      for (const z of [-zExtent, zExtent]) {
        for (const y of [-2.8, 1.2]) {
          const v = new THREE.Vector3(x, y, z).sub(this.cameraTarget)
          halfX = Math.max(halfX, Math.abs(v.dot(right)))
          halfY = Math.max(halfY, Math.abs(v.dot(up)))
        }
      }
    }
    const margin = this.mode === 'title' ? 1.08 : 1.075
    halfX *= margin
    halfY *= margin
    const baseHalfH = Math.max(halfY, halfX / Math.max(0.2, aspect))
    const baseHalfW = baseHalfH * aspect
    this.camera.left = -baseHalfW
    this.camera.right = baseHalfW
    this.camera.top = baseHalfH
    this.camera.bottom = -baseHalfH
    this.camera.zoom = this.cameraState.zoom
    this.camera.updateProjectionMatrix()
    this.fitDirty = false
  }

  // ------------------------------------------------------------- interaction
  bindEvents() {
    this.onResize = () => this.resize()
    window.addEventListener('resize', this.onResize)
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.resize())
      this.resizeObserver.observe(this.canvas)
    }

    const canvas = this.canvas
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      canvas.setPointerCapture?.(e.pointerId)
      this.pointers = this.pointers || new Map()
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (this.pointers.size === 1) {
        this.pointer.down = true
        this.pointer.moved = false
        this.pointer.id = e.pointerId
        this.pointer.startX = e.clientX
        this.pointer.startY = e.clientY
        this.pointer.x = e.clientX
        this.pointer.y = e.clientY
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()]
        this.pointer.pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: this.cameraBase.zoom }
        this.pointer.down = false
      }
    })

    canvas.addEventListener('pointermove', (e) => {
      if (this.pointers?.has(e.pointerId)) this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (this.pointers?.size === 2 && this.pointer.pinch) {
        const [a, b] = [...this.pointers.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        const ratio = dist / Math.max(1, this.pointer.pinch.dist)
        this.cameraBase.zoom = THREE.MathUtils.clamp(this.pointer.pinch.zoom * ratio, 0.82, 1.65)
        this.fitDirty = true
        return
      }
      if (!this.pointer.down) {
        this.updateHoverFromEvent(e)
        return
      }
      const dx = e.clientX - this.pointer.x
      const dy = e.clientY - this.pointer.y
      if (Math.hypot(e.clientX - this.pointer.startX, e.clientY - this.pointer.startY) > 7) {
        this.pointer.moved = true
      }
      if (this.pointer.moved && this.mode !== 'title') {
        this.cameraBase.theta -= dx * 0.004
        this.cameraBase.elevation = THREE.MathUtils.clamp(this.cameraBase.elevation + dy * 0.0025, 0.72, 1.16)
        this.fitDirty = true
      }
      this.pointer.x = e.clientX
      this.pointer.y = e.clientY
    })

    canvas.addEventListener('pointerup', (e) => {
      this.pointers?.delete(e.pointerId)
      const wasDown = this.pointer.down
      const moved = this.pointer.moved
      this.pointer.down = false
      if (this.pointers?.size === 0) this.pointer.pinch = null
      if (wasDown && !moved) this.pickAt(e.clientX, e.clientY)
    })

    canvas.addEventListener('pointercancel', () => {
      this.pointers?.clear()
      this.pointer.down = false
      this.pointer.pinch = null
    })

    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
        this.zoom(e.deltaY < 0 ? 1.06 : 0.94)
      },
      { passive: false }
    )
  }

  updateHoverFromEvent(e) {
    if (this.mode === 'title') return
    const tile = this.pickAt(e.clientX, e.clientY, false)
    if (tile !== this.hoverTile) {
      this.setHoverTile(tile)
      this.onHover?.(tile)
    }
  }

  pickAt(clientX, clientY, fire = true) {
    const rect = this.canvas.getBoundingClientRect()
    this.ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1
    this.ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1
    this.raycaster.setFromCamera(this.ndc, this.camera)
    const hits = this.raycaster.intersectObjects(this.pickables, false)
    const tile = hits.length ? hits[0].object.userData.tile : null
    if (fire && tile != null) {
      this.selectTile(tile)
      this.onTileTap?.(tile)
    }
    return tile
  }

  // ------------------------------------------------------------------- fx/ui
  worldToScreen(vec3) {
    const p = vec3.clone().project(this.camera)
    return {
      x: (p.x * 0.5 + 0.5) * this.screenW,
      y: (-p.y * 0.5 + 0.5) * this.screenH
    }
  }

  floatText(target, text, color = '#D6FF8E') {
    const layer = document.getElementById('fx-layer')
    if (!layer) return
    let world
    if (typeof target === 'number') {
      const token = this.tokens.get(target)
      world = token ? token.group.position.clone().add(new THREE.Vector3(0, 0.9, 0)) : new THREE.Vector3(0, 2, 0)
    } else {
      world = target.clone()
    }
    const screen = this.worldToScreen(world)
    const el = document.createElement('div')
    el.className = 'float-text'
    el.textContent = text
    el.style.color = color
    el.style.left = `${screen.x}px`
    el.style.top = `${screen.y}px`
    layer.appendChild(el)
    setTimeout(() => el.remove(), 1500)
  }

  sparkle(world, color = '#D6FF8E') {
    const layer = document.getElementById('fx-layer')
    if (!layer) return
    const screen = this.worldToScreen(world)
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('span')
      el.className = 'spark'
      el.style.color = color
      el.style.left = `${screen.x}px`
      el.style.top = `${screen.y}px`
      el.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`)
      el.style.setProperty('--dy', `${-40 - Math.random() * 80}px`)
      layer.appendChild(el)
      setTimeout(() => el.remove(), 900)
    }
  }

  applyTileVisibility() {
    for (const view of this.tileObjects) {
      view.group.visible = true
    }
  }

  setQuality(quality) {
    this.quality = quality
    const high = quality === 'high'
    this.renderer.shadowMap.enabled = high
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 1.8 : 1.15))
    if (this.keyLight) {
      this.keyLight.shadow.mapSize.set(high ? 2048 : 1024, high ? 2048 : 1024)
      this.keyLight.shadow.map?.dispose()
      this.keyLight.shadow.map = null
    }
    if (this.fireflies) this.fireflies.visible = high
    if (this.stars) this.stars.visible = high
    this.resize()
  }

  setGameState(state) {
    const changed = this.state !== state
    this.state = state
    if (changed) {
      this.buildTokensFromState(state)
      this.syncColonies(state, true)
    } else {
      this.syncColonies(state)
    }
    this.setActivePlayer(state.players[state.turn])
  }

  setReducedMotion(value) {
    this.reducedMotion = value
  }

  // Debug / capture helper: speeds up dice and token tweens without touching
  // game rules. Leave at 1 in production.
  setTimeScale(value) {
    this.timeScale = Math.max(0.1, Math.min(20, value))
  }

  // ------------------------------------------------------------------ tween
  addTween(duration, update) {
    return new Promise((resolve) => {
      this.tweens.push({ time: 0, duration: Math.max(1, duration), update, resolve })
    })
  }

  // ------------------------------------------------------------------- loop
  loop() {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    const now = performance.now()
    const rawDt = Math.max(0, (now - this.lastFrameTime) / 1000)
    const dt = Math.min(0.05 * this.timeScale, rawDt * this.timeScale)
    this.lastFrameTime = now
    this.elapsed += dt

    // camera
    let cameraChanged = false
    if (this.autoRotate && this.mode === 'title') {
      this.cameraBase.theta += dt * 0.035
      this.fitDirty = true
    }
    const targetZoom = this.cameraBase.zoom
    for (const key of ['theta', 'elevation', 'zoom']) {
      const target = this.cameraBase[key]
      const current = this.cameraState[key]
      if (Math.abs(target - current) > 0.0005) {
        this.cameraState[key] += (target - current) * Math.min(1, dt * 9)
        cameraChanged = true
      } else if (current !== target) {
        this.cameraState[key] = target
        cameraChanged = true
      }
    }
    if (this.cameraTarget.distanceToSquared(this.cameraGoal) > 0.00001) {
      this.cameraTarget.lerp(this.cameraGoal, Math.min(1, dt * 5))
      cameraChanged = true
    }
    if (cameraChanged || this.fitDirty) this.fitCamera()

    // tweens
    if (this.tweens.length) {
      for (let i = this.tweens.length - 1; i >= 0; i--) {
        const tween = this.tweens[i]
        tween.time += dt * 1000
        const p = Math.min(1, tween.time / tween.duration)
        tween.update(easeInOut(p), p)
        if (p >= 1) {
          this.tweens.splice(i, 1)
          tween.resolve()
        }
      }
    }

    // colonies breathe
    for (const view of this.colonyViews.values()) {
      let dirty = false
      for (let i = 0; i < view.size * view.size; i++) {
        const target = view.target[i]
        const current = view.h[i]
        if (Math.abs(target - current) > 0.001) {
          view.h[i] = current + (target - current) * Math.min(1, dt * 10)
          dirty = true
        } else if (current !== target) {
          view.h[i] = target
          dirty = true
        }
      }
      if (dirty) this.writeColonyMatrix(view, this.state ? this.state.colonies[view.tile.tile] : null)
    }

    // tokens bob
    for (const token of this.tokens.values()) {
      if (!token.hop) {
        const player = this.state?.players?.find((p) => p.id === token.playerId)
        const active = player && this.state && this.state.players[this.state.turn]?.id === player.id
        const bob = this.reducedMotion ? 0 : Math.sin(this.elapsed * 2.2 + token.bobPhase) * 0.018
        token.group.position.y = TILE_TOP + 0.02 + bob + (active ? 0.01 : 0)
        token.ring.scale.setScalar(1 + (active ? Math.sin(this.elapsed * 3) * 0.04 : 0))
        token.ring.material.opacity = active ? 0.95 : 0.45
      }
    }

    // dice idle
    if (this.dice && !this.tweens.some((t) => t.dice)) {
      this.dice.forEach((d, i) => {
        if (!this.rolling) {
          d.mesh.position.y = d.rest.y + (this.reducedMotion ? 0 : Math.sin(this.elapsed * 1.6 + i) * 0.035)
          d.mesh.rotation.y += dt * (0.12 + i * 0.04)
        }
      })
    }

    // fireflies
    if (this.fireflies && this.fireflies.visible) {
      const pos = this.fireflies.geometry.attributes.position
      this.fireflyData.forEach((f, i) => {
        pos.array[i * 3] = f.x + Math.sin(this.elapsed * f.speed + f.phase) * 0.35
        pos.array[i * 3 + 1] = f.y + Math.sin(this.elapsed * f.speed * 1.4 + f.phase) * 0.45
        pos.array[i * 3 + 2] = f.z + Math.cos(this.elapsed * f.speed + f.phase) * 0.35
      })
      pos.needsUpdate = true
    }

    // clouds
    if (this.clouds) {
      for (const cloud of this.clouds) {
        cloud.position.x += dt * cloud.userData.speed
        if (cloud.position.x > 36) cloud.position.x = -36
      }
    }

    // orbiting cells
    if (this.orbitingCells) {
      for (const orb of this.orbitingCells) {
        const a = orb.angle + this.elapsed * 0.3
        orb.mesh.position.set(Math.cos(a) * orb.radius, orb.height + Math.sin(this.elapsed * 1.2 + a) * 0.1, Math.sin(a) * orb.radius)
        orb.mesh.rotation.x += dt
        orb.mesh.rotation.y += dt * 0.7
      }
    }

    // selection rings pulse
    if (this.hoverRing?.visible) {
      this.hoverRing.material.opacity = 0.4 + Math.sin(this.elapsed * 4) * 0.15
    }
    if (this.activeRing?.visible) {
      this.activeRing.material.opacity = 0.18 + Math.sin(this.elapsed * 2.4) * 0.07
      this.activeRing.rotation.z += dt * 0.25
    }
    if (this.diceRing) this.diceRing.material.opacity = 0.55 + Math.sin(this.elapsed * 2) * 0.2

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    this.resizeObserver?.disconnect()
    this.renderer.dispose()
  }
}
