import {
  CARD_DECKS,
  DISTRICTS,
  GAME,
  LEVEL_SIZE,
  PROPERTY_TILES,
  PROPERTIES,
  TILE_COUNT,
  TILES,
  bookValue,
  levelRent,
  upgradeCost
} from './constants.js'
import {
  addCells,
  bestSeedCells,
  cloneGrid,
  emptyGrid,
  expandGrid,
  placePattern,
  population,
  randomAmbient,
  removeCells,
  stepLife
} from './life.js'
import { mulberry32 } from './rng.js'
import {
  colonyAt,
  currentPlayer,
  districtCounts,
  hasMonopoly,
  livePlayers,
  netWorth,
  ownedColonies,
  propertyValue,
  rentFor
} from './state.js'

const NOOP = async () => {}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const instantPresenter = {
  delay: async () => {},
  roll: NOOP,
  move: NOOP,
  arrive: NOOP,
  salary: NOOP,
  pay: NOOP,
  gain: NOOP,
  notice: NOOP,
  evolve: NOOP,
  update: NOOP,
  waitForRoll: async () => {},
  chooseBuy: async () => true,
  manageProperty: NOOP,
  dormancyChoice: async () => true,
  showCard: NOOP,
  gameOver: NOOP,
  turn: NOOP,
  botThinking: NOOP
}

/**
 * The engine owns the rules. It is deliberately UI agnostic: the presenter
 * handles animation and human prompts, and the AI adapter makes decisions.
 */
export class GameEngine {
  constructor(state, options = {}) {
    this.state = state
    this.rng = options.rng || mulberry32(state.seed ?? Date.now())
    this.ui = { ...instantPresenter, ...(options.presenter || {}) }
    this.ai = options.ai || null
    this.onChange = options.onChange || null
    this.onLog = options.onLog || null
    this.running = false
    this.doublesStreak = 0
    this.extraTurn = false
    this.lastRoll = null
    this.seed = state.seed
    this.paused = false
    this.pauseResolvers = []
    this.stopped = false
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
    const waiters = this.pauseResolvers.splice(0)
    for (const resolve of waiters) resolve()
  }

  stop() {
    this.stopped = true
    this.resume()
  }

  async gate() {
    if (!this.paused || this.stopped) return
    await new Promise((resolve) => this.pauseResolvers.push(resolve))
  }

  emit() {
    this.ui.update?.(this.state)
    this.onChange?.(this.state)
  }

  log(text, kind = 'info') {
    this.state.log.push({ text, kind, round: this.state.round, at: Date.now() })
    if (this.state.log.length > 40) this.state.log.shift()
    this.ui.notice?.(text, kind)
    this.onLog?.(text, kind)
  }

  player(id) {
    return this.state.players.find((p) => p.id === id)
  }

  isHumanTurn() {
    const p = currentPlayer(this.state)
    return p && !p.isAI && !this.state.over
  }

  async start() {
    if (this.running || this.state.over) return
    this.running = true
    await this.ui.turn?.(currentPlayer(this.state))
    while (!this.state.over && !this.stopped) {
      await this.gate()
      if (this.stopped) break
      const p = currentPlayer(this.state)
      if (p.bankrupt) {
        this.advancePlayer()
        continue
      }
      if (p.dormant > 0) {
        p.dormant -= 1
        this.log(`${p.name} is dormant and misses a turn.`, 'muted')
        this.emit()
        await this.ui.delay?.(800)
        this.advancePlayer()
        continue
      }
      await this.takeTurn(p)
      if (this.stopped) break
      if (this.state.over) break
      if (this.checkEnd()) break
      this.advancePlayer()
      await this.ui.turn?.(currentPlayer(this.state))
    }
    this.running = false
    if (!this.stopped) await this.ui.gameOver?.(this.state)
  }

  advancePlayer() {
    if (this.extraTurn) {
      this.extraTurn = false
      this.state.stats.turns++
      this.emit()
      return
    }
    const prev = this.state.turn
    this.state.turn = (this.state.turn + 1) % this.state.players.length
    this.state.stats.turns++
    this.doublesStreak = 0
    if (prev === this.state.players.length - 1 && this.state.turn === 0) {
      this.state.round++
      // Evolution happens between rounds so every colony visibly breathes.
      this.pendingEvolution = true
    }
    this.emit()
  }

  async takeTurn(player) {
    await this.gate()
    if (this.stopped) return
    this.ui.turn?.(player)
    if (this.pendingEvolution) {
      this.pendingEvolution = false
      await this.evolveBoard()
    }
    if (this.state.over) return

    if (player.isAI) {
      await this.ui.botThinking?.(player)
      await this.ui.delay?.(520)
    } else {
      await this.ui.waitForRoll?.(player)
    }

    const dice = this.rollDice()
    this.lastRoll = dice
    player.stats.rolls++
    this.log(`${player.name} rolled ${dice.a} + ${dice.b} = ${dice.total}.`, 'roll')
    await this.ui.roll?.(dice, player)
    this.emit()

    if (dice.a === dice.b) {
      this.doublesStreak++
      if (this.doublesStreak >= 3) {
        player.dormant = 1
        this.log(`${player.name} rolled three doubles and went dormant.`, 'bad')
        this.extraTurn = false
        this.emit()
        await this.ui.delay?.(700)
        return
      }
      this.extraTurn = true
    } else {
      this.doublesStreak = 0
      this.extraTurn = false
    }

    await this.movePlayer(player, dice.total)
    if (this.state.over) return
    await this.resolveLanding(player, player.pos, 0)
    if (this.state.over) return
    if (this.checkEnd()) return
    this.emit()
  }

  rollDice() {
    const a = 1 + Math.floor(this.rng() * 6)
    const b = 1 + Math.floor(this.rng() * 6)
    return { a, b, total: a + b, double: a === b }
  }

  async movePlayer(player, steps, options = {}) {
    let passed = false
    for (let i = 0; i < steps; i++) {
      const from = player.pos
      player.pos = (player.pos + 1) % TILE_COUNT
      if (player.pos === 0) {
        player.laps++
        passed = true
        if (options.salary !== false) await this.collectSalary(player)
      }
      await this.ui.move?.(player, from, player.pos, { passed })
    }
    await this.ui.arrive?.(player, player.pos)
    this.emit()
    return passed
  }

  async collectSalary(player) {
    player.cash += GAME.salary
    let yieldTotal = 0
    const yields = []
    for (const colony of ownedColonies(this.state, player.id)) {
      const income = colony.population * GAME.passIncomePerCell
      if (income > 0) {
        colony.cashEarned = (colony.cashEarned || 0) + income
        yieldTotal += income
        yields.push({ tile: colony.tile, income })
      }
    }
    player.cash += yieldTotal
    player.stats.rentEarned += yieldTotal
    this.log(
      yieldTotal > 0
        ? `${player.name} passed Genesis: +$${GAME.salary} salary, +$${yieldTotal} colony yield.`
        : `${player.name} passed Genesis: +$${GAME.salary} salary.`,
      'good'
    )
    await this.ui.salary?.(player, GAME.salary, yieldTotal, yields)
    this.emit()
  }

  async resolveLanding(player, tileIndex, depth = 0) {
    const tile = TILES[tileIndex]
    if (!tile) return

    if (tile.type === 'property') {
      const colony = colonyAt(this.state, tile.tile)
      if (!colony) return
      if (colony.owner == null) {
        const canAfford = player.cash >= tile.price
        let wants = false
        if (player.isAI) {
          wants = this.ai ? this.ai.shouldBuy(this, player, tile, colony) : canAfford
        } else {
          wants = await this.ui.chooseBuy?.(player, tile, colony, canAfford)
        }
        if (wants && canAfford) {
          this.buyProperty(player, colony, { quiet: false })
        } else if (!player.isAI) {
          this.log(`${player.name} passed on ${tile.name}.`, 'muted')
        }
        return
      }
      if (colony.owner === player.id) {
        this.log(`${player.name} stopped at their own ${tile.name}.`, 'muted')
        if (player.isAI && this.ai) {
          await this.ai.manage(this, player, colony)
        } else {
          await this.ui.manageProperty?.(player, tile, colony)
        }
        this.emit()
        return
      }
      const owner = this.player(colony.owner)
      const rent = rentFor(this.state, colony)
      this.log(`${player.name} pays ${owner.name} $${rent} at ${tile.name}.`, 'bad')
      player.stats.rentPaid += rent
      owner.stats.rentEarned += rent
      await this.charge(player, rent, owner, `rent at ${tile.name}`)
      return
    }

    if (tile.type === 'mutation' || tile.type === 'ecosystem') {
      const deckKey = tile.type
      const deck = CARD_DECKS[deckKey]
      const card = deck[Math.floor(this.rng() * deck.length)]
      this.state.stats.cards++
      await this.ui.showCard?.(player, card, deckKey)
      this.log(`${player.name} drew ${card.title}.`, 'card')
      await this.applyCard(player, card, depth)
      return
    }

    if (tile.type === 'tax') {
      const amount = Math.min(GAME.taxCap, Math.round(player.cash * GAME.taxRate))
      this.log(`${player.name} pays $${amount} Bloom Tax.`, 'bad')
      await this.charge(player, amount, null, 'Bloom Tax')
      return
    }

    if (tile.type === 'dormancy') {
      let pay = false
      if (player.isAI) {
        pay = this.ai ? this.ai.shouldPayDormancy(this, player) : player.cash > 500
      } else {
        pay = await this.ui.dormancyChoice?.(player, GAME.dormancyFee)
      }
      if (pay && player.cash >= GAME.dormancyFee) {
        await this.charge(player, GAME.dormancyFee, null, 'revival')
        this.log(`${player.name} pays to wake up immediately.`, 'info')
      } else {
        player.dormant = 1
        this.log(`${player.name} falls dormant and will skip a turn.`, 'bad')
      }
      this.emit()
      return
    }

    if (tile.type === 'sanctuary') {
      player.cash += GAME.sanctuaryBonus
      for (const colony of ownedColonies(this.state, player.id)) {
        const grid = Uint8Array.from(colony.cells)
        if (addCells(grid, colony.size, 1, this.rng)) {
          colony.cells = Array.from(grid)
          colony.population = population(grid)
        }
      }
      this.log(`${player.name} rests at Sanctuary: +$${GAME.sanctuaryBonus} and fresh spores.`, 'good')
      await this.ui.gain?.(player, GAME.sanctuaryBonus, 'Sanctuary')
      this.emit()
      return
    }

    if (tile.type === 'geneLab') {
      const owned = ownedColonies(this.state, player.id).filter((c) => c.level < GAME.maxLevel)
      if (owned.length) {
        owned.sort((a, b) => a.level - b.level || a.population - b.population)
        this.freeUpgrade(player, owned[0])
        this.log(`Gene Lab upgrades ${PROPERTIES.get(owned[0].tile).name} for free.`, 'good')
      } else {
        player.cash += GAME.geneLabBonus
        this.log(`Gene Lab pays ${player.name} $${GAME.geneLabBonus}.`, 'good')
        await this.ui.gain?.(player, GAME.geneLabBonus, 'Gene Lab')
      }
      this.emit()
      return
    }

    if (tile.type === 'start') {
      player.cash += 80
      this.log(`${player.name} lands on Genesis: +$80.`, 'good')
      await this.ui.gain?.(player, 80, 'Genesis')
      this.emit()
    }
  }

  buyProperty(player, colony, options = {}) {
    const tile = PROPERTIES.get(colony.tile)
    if (!tile || colony.owner != null) return false
    if (player.cash < tile.price) return false
    player.cash -= tile.price
    colony.owner = player.id
    colony.invested = 0
    colony.acquiredRound = this.state.round
    const grid = Uint8Array.from(colony.cells)
    placePattern(grid, colony.size, tile.pattern, this.rng)
    addCells(grid, colony.size, 1, this.rng)
    colony.cells = Array.from(grid)
    colony.population = population(grid)
    player.stats.propertiesBought++
    this.state.stats.purchases++
    if (!options.quiet) this.log(`${player.name} bought ${tile.name} for $${tile.price}.`, 'good')
    this.emit()
    return true
  }

  upgradeProperty(colony, free = false) {
    const player = this.player(colony.owner)
    if (!player) return false
    if (colony.level >= GAME.maxLevel) return false
    const tile = PROPERTIES.get(colony.tile)
    const cost = upgradeCost(tile, colony.level)
    if (!free && player.cash < cost) return false
    if (!free) player.cash -= cost
    colony.invested += free ? 0 : cost
    const oldSize = colony.size
    colony.level++
    colony.size = LEVEL_SIZE[colony.level - 1]
    const grid = expandGrid(Uint8Array.from(colony.cells), oldSize, colony.size)
    addCells(grid, colony.size, 2, this.rng)
    colony.cells = Array.from(grid)
    colony.population = population(grid)
    if (!free) this.log(`${player.name} upgraded ${tile.name} to ${colony.level === 2 ? 'Grove' : 'Biome'} for $${cost}.`, 'good')
    this.emit()
    return true
  }

  freeUpgrade(player, colony) {
    const p = this.player(player.id)
    if (!p || colony.owner !== p.id) return false
    return this.upgradeProperty(colony, true)
  }

  seedColony(colony, indices) {
    if (!colony || !Array.isArray(indices) || !indices.length) return 0
    const grid = Uint8Array.from(colony.cells)
    let added = 0
    for (const i of indices.slice(0, 3)) {
      if (i < 0 || i >= grid.length) continue
      if (grid[i]) continue
      grid[i] = 1
      added++
    }
    if (added) {
      const owner = this.player(colony.owner)
      if (owner) owner.stats.cellsPlanted += added
      colony.cells = Array.from(grid)
      colony.population = population(grid)
      this.log(`${owner ? owner.name : 'A colony'} planted ${added} cell${added === 1 ? '' : 's'} in ${PROPERTIES.get(colony.tile).name}.`, 'good')
      this.emit()
    }
    return added
  }

  harvestColony(player, colony) {
    if (!player || colony.owner !== player.id) return 0
    const gain = Math.max(12, colony.population * GAME.harvestMultiplier)
    player.cash += gain
    const grid = emptyGrid(colony.size)
    addCells(grid, colony.size, 2, this.rng)
    colony.cells = Array.from(grid)
    colony.population = population(grid)
    player.stats.cellsPlanted += 0
    this.log(`${player.name} harvests ${PROPERTIES.get(colony.tile).name} for $${gain}.`, 'info')
    this.emit()
    return gain
  }

  async charge(player, amount, creditor = null, reason = '') {
    if (amount <= 0) return true
    if (player.cash < amount) {
      const needed = amount - player.cash
      await this.liquidate(player, needed)
    }
    const paid = Math.min(player.cash, Math.max(0, amount))
    player.cash -= paid
    if (creditor && creditor.id !== player.id) creditor.cash += paid
    await this.ui.pay?.(player, creditor, paid, reason)
    this.emit()
    if (paid < amount) {
      this.bankrupt(player, creditor)
      return false
    }
    return true
  }

  async liquidate(player, needed) {
    const owned = ownedColonies(this.state, player.id).sort(
      (a, b) => propertyValue(this.state, a) - propertyValue(this.state, b)
    )
    for (const colony of owned) {
      if (player.cash >= needed + 0) break
      const tile = PROPERTIES.get(colony.tile)
      const sale = Math.round(bookValue(tile, colony) * GAME.sellRatio)
      player.cash += sale
      this.releaseColony(colony)
      this.log(`${player.name} sold ${tile.name} to the bank for $${sale}.`, 'bad')
      await this.ui.notice?.(`${tile.name} sold for $${sale}`, 'bad')
    }
    this.emit()
  }

  releaseColony(colony) {
    const tile = PROPERTIES.get(colony.tile)
    colony.owner = null
    colony.level = 1
    colony.size = LEVEL_SIZE[0]
    colony.invested = 0
    colony.cells = Array.from(randomAmbient(colony.size, this.rng))
    colony.population = population(colony.cells)
    return tile
  }

  bankrupt(player, creditor = null) {
    if (player.bankrupt) return
    player.cash = 0
    player.bankrupt = true
    player.pos = 0
    for (const colony of ownedColonies(this.state, player.id)) this.releaseColony(colony)
    this.log(`${player.name} has gone bankrupt${creditor ? ` to ${creditor.name}` : ''}.`, 'bad')
    this.emit()
    if (!player.isAI) this.checkEnd()
  }

  async applyCard(player, card, depth = 0) {
    const effect = card.effect
    if (effect.type === 'gain') {
      player.cash += effect.amount
      await this.ui.gain?.(player, effect.amount, card.title)
    } else if (effect.type === 'lose') {
      await this.charge(player, effect.amount, null, card.title)
    } else if (effect.type === 'seedAll') {
      for (const colony of ownedColonies(this.state, player.id)) this.seedColony(colony, this.randomCells(colony, effect.count))
    } else if (effect.type === 'gainSeedAll') {
      player.cash += effect.amount
      await this.ui.gain?.(player, effect.amount, card.title)
      for (const colony of ownedColonies(this.state, player.id)) this.seedColony(colony, this.randomCells(colony, effect.count))
    } else if (effect.type === 'payEach') {
      for (const other of livePlayers(this.state)) {
        if (other.id === player.id) continue
        await this.charge(player, effect.amount, other, card.title)
      }
    } else if (effect.type === 'collectEach') {
      for (const other of livePlayers(this.state)) {
        if (other.id === player.id) continue
        await this.charge(other, effect.amount, player, card.title)
      }
    } else if (effect.type === 'collectPerProperty') {
      const amount = ownedColonies(this.state, player.id).length * effect.amount
      player.cash += amount
      await this.ui.gain?.(player, amount, card.title)
    } else if (effect.type === 'payPerProperty') {
      await this.charge(player, ownedColonies(this.state, player.id).length * effect.amount, null, card.title)
    } else if (effect.type === 'collectPerCell') {
      let cells = 0
      for (const colony of ownedColonies(this.state, player.id)) cells += colony.population
      const amount = cells * effect.amount
      player.cash += amount
      await this.ui.gain?.(player, amount, card.title)
    } else if (effect.type === 'collectPerLevel') {
      let levels = 0
      for (const colony of ownedColonies(this.state, player.id)) levels += colony.level
      const amount = levels * effect.amount
      player.cash += amount
      await this.ui.gain?.(player, amount, card.title)
    } else if (effect.type === 'payPerLevel') {
      let levels = 0
      for (const colony of ownedColonies(this.state, player.id)) levels += colony.level
      await this.charge(player, levels * effect.amount, null, card.title)
    } else if (effect.type === 'killAll') {
      for (const colony of Object.values(this.state.colonies)) {
        const grid = Uint8Array.from(colony.cells)
        removeCells(grid, colony.size, effect.count, this.rng)
        colony.cells = Array.from(grid)
        colony.population = population(grid)
      }
      this.log('A dry spell thins every colony on the board.', 'bad')
    } else if (effect.type === 'patternAll') {
      for (const colony of ownedColonies(this.state, player.id)) {
        const grid = Uint8Array.from(colony.cells)
        placePattern(grid, colony.size, effect.pattern, this.rng)
        colony.cells = Array.from(grid)
        colony.population = population(grid)
      }
    } else if (effect.type === 'move' && depth < 2) {
      this.log(`${player.name} migrates ${effect.steps} tiles.`, 'info')
      await this.movePlayer(player, effect.steps, { salary: effect.salary })
      await this.resolveLanding(player, player.pos, depth + 1)
    } else if (effect.type === 'evolveGain') {
      let cells = 0
      for (const colony of ownedColonies(this.state, player.id)) {
        for (let g = 0; g < effect.generations; g++) {
          const result = stepLife(Uint8Array.from(colony.cells), colony.size, this.rng)
          colony.cells = Array.from(result.grid)
          colony.population = result.population
          colony.generations += 1
        }
        cells += colony.population
      }
      const amount = cells * effect.perCell
      player.cash += amount
      this.log(`Revival stirs ${cells} cells: +$${amount}.`, 'good')
      await this.ui.gain?.(player, amount, card.title)
    } else if (effect.type === 'gainSeed') {
      player.cash += effect.amount
      await this.ui.gain?.(player, effect.amount, card.title)
      const owned = ownedColonies(this.state, player.id)
      if (owned.length) this.seedColony(owned[0], this.randomCells(owned[0], effect.count))
    } else if (effect.type === 'districtGrant') {
      const counts = districtCounts(this.state, player.id)
      const best = Math.max(...Object.values(counts))
      const amount = best >= 2 ? effect.amount : effect.fallback
      player.cash += amount
      this.log(`Civic Grant pays ${player.name} $${amount}.`, 'good')
      await this.ui.gain?.(player, amount, card.title)
    } else if (effect.type === 'freeUpgrade') {
      const owned = ownedColonies(this.state, player.id)
        .filter((c) => c.level < GAME.maxLevel)
        .sort((a, b) => a.level - b.level || a.population - b.population)
      if (owned.length) {
        this.freeUpgrade(player, owned[0])
        this.log(`Research upgrades ${PROPERTIES.get(owned[0].tile).name}.`, 'good')
      } else {
        player.cash += 120
        await this.ui.gain?.(player, 120, card.title)
      }
    }
    this.emit()
  }

  randomCells(colony, count) {
    const grid = Uint8Array.from(colony.cells)
    const picks = bestSeedCells(grid, colony.size, count, this.rng)
    return picks
  }

  async evolveBoard() {
    const reports = []
    for (const colony of Object.values(this.state.colonies)) {
      const before = Uint8Array.from(colony.cells)
      const result = stepLife(before, colony.size, this.rng)
      const tile = PROPERTIES.get(colony.tile)
      colony.cells = Array.from(result.grid)
      colony.population = result.population
      colony.generations += 1
      let income = 0
      if (colony.owner != null) {
        income = colony.population * (colony.level >= 3 ? 2 : 1)
        const owner = this.player(colony.owner)
        if (owner) {
          owner.cash += income
          owner.stats.rentEarned += income
        }
      }
      reports.push({
        tile: colony.tile,
        name: tile.name,
        before,
        after: result.grid,
        born: result.born,
        died: result.died,
        population: result.population,
        income,
        owner: colony.owner
      })
    }
    this.state.stats.evolutions++
    await this.ui.evolve?.(reports, this.state)
    this.log(`Generation ${this.state.round}: every colony evolved.`, 'life')
    this.emit()
  }

  checkEnd() {
    if (this.state.over) return true
    const alive = livePlayers(this.state)
    const target = alive.find((p) => netWorth(this.state, p) >= GAME.victoryNetWorth)
    if (target) {
      this.endGame(target, `${target.name} reached $${GAME.victoryNetWorth.toLocaleString()} net worth.`)
      return true
    }
    if (alive.length <= 1) {
      this.endGame(alive[0] || null, alive[0] ? 'Every rival has gone bankrupt.' : 'The board has emptied.')
      return true
    }
    const human = this.state.players.find((p) => !p.isAI)
    if (human && human.bankrupt) {
      const leader = [...alive].sort((a, b) => netWorth(this.state, b) - netWorth(this.state, a))[0]
      this.endGame(leader || null, 'You have gone bankrupt.')
      return true
    }
    return false
  }

  endGame(winner, reason) {
    this.state.over = true
    this.state.phase = 'over'
    this.state.winner = winner ? winner.id : null
    this.state.endReason = reason
    if (winner) winner.isWinner = true
    this.log(reason, 'end')
    this.emit()
  }

  // ---- public helpers used by UI modals -----------------------------------

  canBuy(player, tile, colony) {
    return colony.owner == null && player.cash >= tile.price && currentPlayer(this.state).id === player.id
  }

  canUpgrade(player, colony) {
    if (colony.owner !== player.id || colony.level >= GAME.maxLevel) return false
    const cost = upgradeCost(PROPERTIES.get(colony.tile), colony.level)
    return player.cash >= cost && currentPlayer(this.state).id === player.id
  }

  upgradePrice(colony) {
    return upgradeCost(PROPERTIES.get(colony.tile), colony.level)
  }

  rentAt(colony) {
    return levelRent(PROPERTIES.get(colony.tile), colony.level, colony.population)
  }

  netWorth(player) {
    return netWorth(this.state, player)
  }

  districtCounts(player) {
    return districtCounts(this.state, player.id)
  }

  hasMonopoly(player, district) {
    return hasMonopoly(this.state, player.id, district)
  }
}

export { NOOP, wait }
