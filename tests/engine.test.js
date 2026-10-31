import test from 'node:test'
import assert from 'node:assert/strict'
import { createGame, netWorth, ownedColonies, validateState } from '../src/game/state.js'
import { GameEngine, instantPresenter } from '../src/game/engine.js'
import { AIPlayer } from '../src/game/ai.js'
import { mulberry32 } from '../src/game/rng.js'
import { GAME, PROPERTIES } from '../src/game/constants.js'
import { population } from '../src/game/life.js'

function engineFor(seed = 42, presenter = {}) {
  const state = createGame({ seed })
  const ai = new AIPlayer('sharp')
  const engine = new GameEngine(state, {
    rng: mulberry32(seed + 1),
    presenter: { ...instantPresenter, ...presenter },
    ai
  })
  return { state, engine, ai }
}

test('new game is valid and fully populated', () => {
  const state = createGame({ seed: 7 })
  assert.equal(state.players.length, 4)
  assert.equal(Object.keys(state.colonies).length, 16)
  assert.equal(validateState(state), true)
  for (const colony of Object.values(state.colonies)) {
    assert.ok(colony.population > 0)
    assert.equal(colony.cells.length, colony.size * colony.size)
  }
})

test('buying a property deducts cash and transfers ownership', () => {
  const { state, engine } = engineFor()
  const player = state.players[0]
  const colony = state.colonies[1]
  const tile = PROPERTIES.get(1)
  const before = player.cash
  const ok = engine.buyProperty(player, colony)
  assert.equal(ok, true)
  assert.equal(player.cash, before - tile.price)
  assert.equal(colony.owner, player.id)
  assert.ok(colony.population > 0)
})

test('rent is higher for developed colonies', () => {
  const { state, engine } = engineFor()
  const player = state.players[0]
  const colony = state.colonies[1]
  engine.buyProperty(player, colony)
  const rent1 = engine.rentAt(colony)
  player.cash += 5000
  engine.upgradeProperty(colony, false)
  const rent2 = engine.rentAt(colony)
  assert.ok(rent2 > rent1)
  assert.equal(colony.level, 2)
  assert.equal(colony.size, 5)
})

test('bankrupt player releases colonies', () => {
  const { state, engine } = engineFor()
  const player = state.players[0]
  const colony = state.colonies[1]
  engine.buyProperty(player, colony)
  player.cash = 0
  engine.bankrupt(player)
  assert.equal(player.bankrupt, true)
  assert.equal(colony.owner, null)
  assert.equal(engine.netWorth(player), 0)
})

test('full AI game finishes', async () => {
  const { state, engine } = engineFor(11)
  for (const p of state.players) p.isAI = true
  let turns = 0
  const guard = setInterval(() => {}, 1000)
  try {
    const original = engine.takeTurn.bind(engine)
    engine.takeTurn = async (player) => {
      turns++
      return original(player)
    }
    await engine.start()
    assert.equal(state.over, true)
    assert.ok(turns > 0)
    assert.ok(state.winner != null || state.players.every((p) => p.bankrupt))
    const winner = state.players[state.winner]
    if (winner) assert.ok(netWorth(state, winner) > 0)
  } finally {
    clearInterval(guard)
  }
})

test('net worth includes cash and book value', () => {
  const { state, engine } = engineFor()
  const player = state.players[0]
  const start = netWorth(state, player)
  assert.equal(start, player.cash)
  engine.buyProperty(player, state.colonies[2])
  const after = netWorth(state, player)
  assert.ok(after >= player.cash)
  assert.equal(ownedColonies(state, player.id).length, 1)
})
