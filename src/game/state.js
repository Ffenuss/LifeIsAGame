import {
  GAME,
  PLAYER_BLUEPRINTS,
  PROPERTY_TILES,
  LEVEL_SIZE,
  bookValue,
  levelRent,
  upgradeCost
} from './constants.js'
import { population, randomAmbient } from './life.js'
import { mulberry32, randomSeed } from './rng.js'

export const SAVE_VERSION = 1
export const SAVE_KEY = 'life-estate-save-v1'

export function createGame(options = {}) {
  const seed = options.seed ?? randomSeed()
  const rng = mulberry32(seed)
  const difficulty = options.difficulty || 'sharp'
  const humanToken = options.token || 'sprout'

  const players = PLAYER_BLUEPRINTS.map((bp) => ({
    ...bp,
    isAI: bp.id === 0 ? false : true,
    difficulty,
    cash: GAME.startCash,
    pos: 0,
    laps: 0,
    dormant: 0,
    bankrupt: false,
    stats: { rolls: 0, doubles: 0, propertiesBought: 0, rentPaid: 0, rentEarned: 0, cellsPlanted: 0 }
  }))

  // Allow the player to choose their token in future; keep colours unique now.
  const chosen = PLAYER_BLUEPRINTS.find((p) => p.token === humanToken)
  if (chosen && chosen.id !== 0) {
    const i = players.findIndex((p) => p.id === 0)
    const j = players.findIndex((p) => p.id === chosen.id)
    const a = players[i]
    const b = players[j]
    players[i] = { ...b, id: 0, isAI: false }
    players[j] = { ...a, id: chosen.id, isAI: true }
  }

  const colonies = {}
  for (const tile of PROPERTY_TILES) {
    const size = LEVEL_SIZE[0]
    const cells = randomAmbient(size, rng)
    colonies[tile.tile] = {
      tile: tile.tile,
      owner: null,
      level: 1,
      size,
      cells: Array.from(cells),
      population: population(cells),
      invested: 0,
      generations: 0
    }
  }

  return {
    version: SAVE_VERSION,
    seed,
    difficulty,
    turn: 0,
    round: 1,
    phase: 'playing',
    players,
    colonies,
    over: false,
    winner: null,
    pending: null,
    log: [],
    stats: { turns: 0, evolutions: 0, cards: 0, purchases: 0 },
    startedAt: Date.now()
  }
}

export function currentPlayer(state) {
  return state.players[state.turn]
}

export function livePlayers(state) {
  return state.players.filter((p) => !p.bankrupt)
}

export function ownedColonies(state, playerId) {
  return Object.values(state.colonies).filter((c) => c.owner === playerId)
}

export function colonyAt(state, tile) {
  return state.colonies[tile] || null
}

export function propertyValue(state, colony) {
  const tile = PROPERTY_TILES.find((t) => t.tile === colony.tile)
  return bookValue(tile, colony)
}

export function netWorth(state, player) {
  let total = player.cash
  for (const colony of ownedColonies(state, player.id)) {
    total += propertyValue(state, colony)
  }
  return Math.round(total)
}

export function rentFor(state, colony) {
  const tile = PROPERTY_TILES.find((t) => t.tile === colony.tile)
  return levelRent(tile, colony.level, colony.population)
}

export function districtCounts(state, playerId) {
  const counts = { meadow: 0, tide: 0, ember: 0, circuit: 0 }
  for (const colony of ownedColonies(state, playerId)) {
    const tile = PROPERTY_TILES.find((t) => t.tile === colony.tile)
    if (tile?.district) counts[tile.district]++
  }
  return counts
}

export function hasMonopoly(state, playerId, district) {
  return districtCounts(state, playerId)[district] === 4
}

export function upgradeCostFor(colony) {
  const tile = PROPERTY_TILES.find((t) => t.tile === colony.tile)
  return upgradeCost(tile, colony.level)
}

export function netWorthLeader(state) {
  return [...state.players].filter((p) => !p.bankrupt).sort((a, b) => netWorth(state, b) - netWorth(state, a))[0]
}

export function validateState(state) {
  if (!state || state.version !== SAVE_VERSION) return false
  if (!Array.isArray(state.players) || state.players.length !== 4) return false
  if (!state.colonies || typeof state.colonies !== 'object') return false
  for (const tile of PROPERTY_TILES) {
    const c = state.colonies[tile.tile]
    if (!c || !Array.isArray(c.cells)) return false
    if (c.size !== LEVEL_SIZE[c.level - 1]) return false
    if (c.cells.length !== c.size * c.size) return false
  }
  if (!Number.isFinite(state.turn) || state.turn < 0 || state.turn > 3) return false
  return true
}

export function loadGame(storage) {
  try {
    const raw = storage?.getItem(SAVE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw)
    if (!validateState(state)) return null
    return state
  } catch {
    return null
  }
}

export function saveGame(storage, state) {
  try {
    storage?.setItem(SAVE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearSave(storage) {
  try {
    storage?.removeItem(SAVE_KEY)
  } catch {
    /* storage may be unavailable */
  }
}
