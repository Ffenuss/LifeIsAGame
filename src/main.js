import '@fontsource-variable/fraunces/wght.css'
import '@fontsource-variable/outfit'
import './styles.css'

import { createGame, loadGame, saveGame, clearSave, netWorth } from './game/state.js'
import { GameEngine } from './game/engine.js'
import { AIPlayer } from './game/ai.js'
import { mulberry32 } from './game/rng.js'
import { GAME, PROPERTIES, TILES } from './game/constants.js'
import { Scene3D } from './render/scene.js'
import { audio } from './render/audio.js'
import { UI } from './ui/ui.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const VERSION = '1.0.0'

let scene
let ui
let engine
let state = null
let saveTimer = null
let lastOptions = { token: 'sprout', difficulty: 'sharp' }
let hasSave = false

const canvas = document.getElementById('scene')

ui = new UI({
  onNewGame: (options) => startNewGame(options),
  onContinue: () => continueGame(),
  onRestart: () => startNewGame(lastOptions),
  onQuitToTitle: () => quitToTitle(),
  onPause: () => engine?.pause(),
  onResume: () => engine?.resume(),
  onRotate: () => scene?.rotate(Math.PI / 2),
  onResetView: () => scene?.resetCamera(),
  onSettings: (settings) => applySettings(settings)
})
ui.setVersion(VERSION)

try {
  scene = new Scene3D(canvas, {
    onTileTap: (tile) => {
      if (!state || state.over) return
      ui.showTileCard(tile)
    },
    onHover: () => {},
    reducedMotion: ui.settings.motion,
    quality: ui.settings.battery ? 'low' : 'high'
  })
} catch (error) {
  console.error(error)
  ui.toast('3D could not start on this device. Try updating Android System WebView.', 'bad', 8000)
}

// A calm living board behind the title screen.
const demo = createGame({ seed: 20260214 })
demo.players.forEach((player, index) => {
  player.pos = [0, 7, 14, 21][index]
})
scene?.setMode('title')
scene?.setGameState(demo)
scene?.setActivePlayer(null)

// ----------------------------------------------------------------- presenter
const presenter = {
  update(next) {
    ui.update(next)
    scene?.setGameState(next)
  },
  turn(player) {
    ui.turn(player)
    scene?.selectTile(null)
    scene?.setActivePlayer(player)
  },
  async roll(dice, player) {
    ui.hideTileCard()
    audio.dice()
    await scene?.rollDice(dice)
  },
  async move(player, from, to) {
    audio.hop()
    await scene?.hopToken(player, from, to)
    scene?.setActivePlayer(player)
  },
  async arrive(player, tile) {
    scene?.selectTile(tile)
    await wait(180)
  },
  async salary(player, salary, yieldTotal) {
    scene?.floatText(player.id, `+$${salary}`, '#D6FF8E')
    if (yieldTotal > 0) {
      setTimeout(() => scene?.floatText(player.id, `+$${yieldTotal} yield`, '#8CF0B0'), 240)
    }
    audio.coin()
    ui.haptic('light')
    await wait(320)
  },
  async pay(player, creditor, amount) {
    scene?.floatText(player.id, `-$${amount}`, '#FF8D66')
    if (creditor) setTimeout(() => scene?.floatText(creditor.id, `+$${amount}`, '#D6FF8E'), 180)
    audio.pay()
    ui.haptic('medium')
    await wait(380)
  },
  async gain(player, amount) {
    scene?.floatText(player.id, `+$${amount}`, '#D6FF8E')
    audio.coin()
    await wait(240)
  },
  notice(text, kind) {
    if (['good', 'bad', 'card', 'life', 'end'].includes(kind)) {
      ui.toast(text, kind, kind === 'bad' ? 3000 : 2600)
    }
  },
  async evolve(reports) {
    audio.evolve()
    await scene?.animateEvolution(reports)
  },
  waitForRoll(player) {
    return ui.waitForRoll(player)
  },
  chooseBuy(player, tile, colony, canAfford) {
    return ui.chooseBuy(player, tile, colony, canAfford)
  },
  manageProperty(player, tile, colony) {
    return ui.manageProperty(player, tile, colony)
  },
  dormancyChoice(player, fee) {
    return ui.dormancyChoice(player, fee)
  },
  showCard(player, card, deck) {
    return ui.showCard(player, card, deck)
  },
  async gameOver(next) {
    clearSave(localStorage)
    hasSave = false
    audio.win()
    ui.gameOver(next)
  },
  botThinking(player) {
    ui.botThinking(player)
  },
  delay(ms) {
    return wait(ms)
  }
}

// -------------------------------------------------------------------- engine
function startEngine(nextState) {
  if (engine) engine.stop()
  const ai = new AIPlayer(nextState.difficulty || 'sharp')
  engine = new GameEngine(nextState, {
    rng: mulberry32((nextState.seed ^ (Date.now() & 0xffffffff)) >>> 0),
    presenter,
    ai,
    onChange: scheduleSave
  })
  ui.engine = engine
  engine.start()
}

function scheduleSave() {
  if (!state || state.over) return
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    hasSave = saveGame(localStorage, state)
  }, 220)
}

function startNewGame(options = {}) {
  lastOptions = { token: options.token || 'sprout', difficulty: options.difficulty || 'sharp' }
  if (options.seed != null) lastOptions.seed = options.seed
  if (engine) engine.stop()
  ui.cancelPrompts()
  ui.closeModalSilently()
  clearSave(localStorage)
  hasSave = false
  state = createGame(lastOptions)
  scene?.setMode('game')
  scene?.resetCamera()
  scene?.setGameState(state)
  scene?.setActivePlayer(state.players[0])
  ui.showGame(state)
  ui.gameOverShown = false
  audio.init()
  startEngine(state)
}

function continueGame() {
  const saved = loadGame(localStorage)
  if (!saved || saved.over) {
    hasSave = false
    ui.hasSave(false)
    ui.toast('That save has finished. Start a new estate.', 'bad', 3000)
    return
  }
  state = saved
  lastOptions = { token: saved.players.find((p) => !p.isAI)?.token || 'sprout', difficulty: saved.difficulty || 'sharp' }
  if (engine) engine.stop()
  ui.cancelPrompts()
  ui.closeModalSilently()
  scene?.setMode('game')
  scene?.resetCamera()
  scene?.setGameState(state)
  ui.showGame(state)
  ui.gameOverShown = false
  audio.init()
  startEngine(state)
}

function quitToTitle() {
  if (state && !state.over) {
    saveGame(localStorage, state)
    hasSave = true
  }
  engine?.stop()
  engine = null
  ui.engine = null
  ui.cancelPrompts()
  ui.showTitle(hasSave)
  scene?.setMode('title')
  scene?.setActivePlayer(null)
  scene?.selectTile(null)
  scene?.resetCamera()
  audio.click()
}

function applySettings(settings) {
  scene?.setQuality(settings.battery ? 'low' : 'high')
  scene?.setReducedMotion(settings.motion)
  document.documentElement.classList.toggle('reduce-motion', settings.motion)
  audio.setMuted(!settings.sound)
}

// ---------------------------------------------------------------------- boot
const saved = loadGame(localStorage)
hasSave = !!(saved && !saved.over)
ui.hasSave(hasSave)

applySettings(ui.settings)
ui.showTitle(hasSave)

window.addEventListener(
  'pointerdown',
  () => {
    audio.init()
  },
  { once: true }
)
window.addEventListener('keydown', () => audio.init(), { once: true })

document.fonts?.ready?.then(() => {
  scene?.resize()
})

requestAnimationFrame(() => {
  setTimeout(() => ui.setBooted(), 420)
})

// Android / tab lifecycle hooks. The native shell calls these from onPause and
// onResume so audio stops and progress is flushed when the app is backgrounded.
window.lifeEstateOnHide = () => {
  if (state && !state.over) {
    saveGame(localStorage, state)
    hasSave = true
  }
  audio.stopMusic()
  audio.ctx?.suspend?.()
}

window.lifeEstateOnShow = () => {
  audio.ctx?.resume?.()
  if (audio.ready && !audio.muted) audio.startMusic()
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) window.lifeEstateOnHide()
  else window.lifeEstateOnShow()
})

// Android back button and debug hooks.
window.lifeEstateBack = () => ui.handleBack()
window.__lifeEstate = {
  ui,
  scene,
  get engine() {
    return engine
  },
  get state() {
    return state
  },
  startNewGame,
  continueGame,
  quitToTitle,
  constants: { TILES, PROPERTIES },
  winState() {
    if (!engine || !state) return null
    const w = state.players.find((p) => !p.isAI)
    if (!w) return null
    w.cash += GAME.victoryNetWorth
    engine.checkEnd()
    return state
  },
  netWorth: (p) => netWorth(state, p)
}
