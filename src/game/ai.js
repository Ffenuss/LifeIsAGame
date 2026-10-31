import { GAME, PROPERTIES } from './constants.js'
import { bestSeedCells, emptyGrid, isAlive, liveNeighbours, population } from './life.js'

/**
 * A compact heuristic opponent. It values completing a colour set, keeps a
 * cash buffer, upgrades developed colonies and reseeds empty ones.
 */
export class AIPlayer {
  constructor(difficulty = 'sharp') {
    this.difficulty = difficulty
    this.reserve = GAME.aiReserve[difficulty] ?? GAME.aiReserve.sharp
  }

  shouldBuy(engine, player, tile, colony) {
    const price = tile.price
    if (player.cash < price) return false
    const counts = engine.districtCounts(player)
    const completes = counts[tile.district] >= 2
    const after = player.cash - price
    if (after < 0) return false
    if (!completes && after < this.reserve) return false
    if (completes) return true

    if (this.difficulty === 'cozy') {
      if (player.cash - price < this.reserve) return false
      return engine.rng() < 0.7
    }
    if (this.difficulty === 'sharp') {
      if (after < this.reserve * 0.6) return engine.rng() < 0.5
      return true
    }
    return true
  }

  shouldPayDormancy(engine, player) {
    return player.cash > Math.max(220, this.reserve * 0.7)
  }

  async manage(engine, player, colony) {
    const tile = PROPERTIES.get(colony.tile)
    const counts = engine.districtCounts(player)
    const monopoly = counts[tile.district] >= 4
    const reserve = this.reserve * (this.difficulty === 'ruthless' ? 0.45 : 0.8)
    let actions = 0

    const tryUpgrade = () => {
      if (actions >= 2) return false
      if (!engine.canUpgrade(player, colony)) return false
      const cost = engine.upgradePrice(colony)
      const should =
        player.cash - cost > reserve ||
        (monopoly && colony.level < 3) ||
        (colony.level === 1 && player.cash - cost > reserve * 0.5)
      if (!should) return false
      engine.upgradeProperty(colony, false)
      actions++
      return true
    }

    if (colony.level < GAME.maxLevel) {
      if (colony.level === 1 || monopoly) tryUpgrade()
    }

    if (actions === 0 || colony.population < 8) {
      const cells = this.chooseSeeds(engine, colony, this.difficulty === 'ruthless' ? 3 : 2)
      if (cells.length) {
        engine.seedColony(colony, cells)
        actions++
      }
    }

    if (
      actions === 0 &&
      colony.population >= 8 &&
      player.cash < this.reserve * 0.8 &&
      this.difficulty !== 'cozy'
    ) {
      engine.harvestColony(player, colony)
      actions++
    }

    return actions
  }

  chooseSeeds(engine, colony, count) {
    if (colony.population === 0) {
      return bestSeedCells(emptyGrid(colony.size), colony.size, count, engine.rng)
    }
    // Prefer births with 2 or 3 neighbours; avoid overcrowded cells.
    const size = colony.size
    const grid = Uint8Array.from(colony.cells)
    const options = []
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (isAlive(grid, size, x, y)) continue
        const n = liveNeighbours(grid, size, x, y)
        if (n === 2 || n === 3) options.push({ i: y * size + x, n })
      }
    }
    if (!options.length) return bestSeedCells(grid, size, count, engine.rng)
    options.sort((a, b) => b.n - a.n)
    return options.slice(0, count).map((o) => o.i)
  }

  choosePattern(engine, colony, pattern) {
    const cells = []
    const size = colony.size
    const grid = Uint8Array.from(colony.cells)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!isAlive(grid, size, x, y)) cells.push(y * size + x)
      }
    }
    return cells.slice(0, 3)
  }
}

export function aiFor(difficulty) {
  return new AIPlayer(difficulty)
}
