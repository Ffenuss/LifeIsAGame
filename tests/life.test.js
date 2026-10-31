import test from 'node:test'
import assert from 'node:assert/strict'
import {
  emptyGrid,
  population,
  placePattern,
  stepLife,
  expandGrid,
  bestSeedCells,
  seedColony
} from '../src/game/life.js'
import { mulberry32 } from '../src/game/rng.js'

test('blinker oscillates with period 2', () => {
  const size = 6
  let grid = emptyGrid(size)
  placePattern(grid, size, 'blinker', mulberry32(1), 1, 1)
  assert.equal(population(grid), 3)
  const a = stepLife(grid, size, mulberry32(2), { immigration: false })
  assert.equal(a.population, 3)
  const b = stepLife(a.grid, size, mulberry32(3), { immigration: false })
  assert.deepEqual(Array.from(b.grid), Array.from(grid))
})

test('block is a still life', () => {
  const size = 6
  let grid = emptyGrid(size)
  placePattern(grid, size, 'block', mulberry32(1), 1, 1)
  const next = stepLife(grid, size, mulberry32(2), { immigration: false })
  assert.deepEqual(Array.from(next.grid), Array.from(grid))
  assert.equal(next.population, 4)
})

test('torus wraps gliders and preserves population', () => {
  const size = 6
  let grid = emptyGrid(size)
  placePattern(grid, size, 'glider', mulberry32(1), 1, 1)
  const initial = population(grid)
  let current = grid
  for (let i = 0; i < 4; i++) {
    current = stepLife(current, size, mulberry32(i), { immigration: false }).grid
  }
  assert.equal(population(current), initial)
})

test('immigration rescues a dead colony', () => {
  const size = 4
  const dead = emptyGrid(size)
  const next = stepLife(dead, size, mulberry32(9))
  assert.ok(next.population >= 1)
})

test('expandGrid centers the old colony', () => {
  const size = 4
  const grid = emptyGrid(size)
  grid[0] = 1
  const bigger = expandGrid(grid, size, 6)
  assert.equal(bigger.length, 36)
  assert.equal(bigger[1 * 6 + 1], 1)
  assert.equal(population(bigger), 1)
})

test('seed selection favours fertile empty cells', () => {
  const size = 6
  const grid = emptyGrid(size)
  placePattern(grid, size, 'blinker', mulberry32(1), 2, 2)
  const picks = bestSeedCells(grid, size, 2, mulberry32(4))
  assert.equal(picks.length, 2)
  for (const i of picks) assert.equal(grid[i], 0)
})

test('seeded colonies are alive', () => {
  const grid = seedColony(5, 'rpent', mulberry32(7))
  assert.ok(population(grid) >= 5)
})
