/**
 * Conway's Game of Life on a torus, with a small "immigration" rule so a
 * property never becomes permanently dead. Pure functions only.
 */

import { PATTERNS } from './constants.js'

export function emptyGrid(size) {
  return new Uint8Array(size * size)
}

export function cloneGrid(grid) {
  return Uint8Array.from(grid)
}

export function population(grid) {
  let n = 0
  for (let i = 0; i < grid.length; i++) n += grid[i] ? 1 : 0
  return n
}

export function idx(size, x, y) {
  return ((y % size) + size) % size * size + (((x % size) + size) % size)
}

export function isAlive(grid, size, x, y) {
  return grid[idx(size, x, y)] === 1
}

export function toggleCell(grid, size, x, y) {
  const i = idx(size, x, y)
  grid[i] = grid[i] ? 0 : 1
  return grid[i] === 1
}

export function liveNeighbours(grid, size, x, y) {
  let n = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      if (isAlive(grid, size, x + dx, y + dy)) n++
    }
  }
  return n
}

/**
 * Advance one generation. Returns the next grid plus a small change report
 * which the renderer uses for birth/death animations.
 */
export function stepLife(grid, size, rng = Math.random, options = {}) {
  const next = emptyGrid(size)
  const born = []
  const died = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x
      const alive = grid[i] === 1
      const n = liveNeighbours(grid, size, x, y)
      const lives = alive ? n === 2 || n === 3 : n === 3
      if (lives) {
        next[i] = 1
        if (!alive) born.push(i)
      } else if (alive) {
        died.push(i)
      }
    }
  }

  let pop = population(next)
  if (options.immigration !== false) {
    // A tiny amount of spontaneous life keeps colonies from flat-lining and
    // makes every property worth visiting. It is deliberately rare.
    if (pop === 0) {
      const a = randomEmpty(next, rng)
      const b = randomEmpty(next, rng)
      if (a >= 0) next[a] = 1
      if (b >= 0) next[b] = 1
      pop += (a >= 0 ? 1 : 0) + (b >= 0 ? 1 : 0)
    } else if (pop <= 2 && rng() < 0.45) {
      const a = randomEmpty(next, rng)
      if (a >= 0) {
        next[a] = 1
        pop++
      }
    }
  }
  return { grid: next, born, died, population: pop }
}

export function randomEmpty(grid, rng = Math.random) {
  const empty = []
  for (let i = 0; i < grid.length; i++) if (!grid[i]) empty.push(i)
  if (!empty.length) return -1
  return empty[Math.floor(rng() * empty.length)]
}

export function randomLive(grid, rng = Math.random) {
  const live = []
  for (let i = 0; i < grid.length; i++) if (grid[i]) live.push(i)
  if (!live.length) return -1
  return live[Math.floor(rng() * live.length)]
}

export function addCells(grid, size, count, rng = Math.random, candidates = null) {
  let added = 0
  for (let tries = 0; tries < count * 12 && added < count; tries++) {
    let i
    if (candidates && candidates.length) {
      i = candidates[Math.floor(rng() * candidates.length)]
      if (grid[i]) continue
    } else {
      i = randomEmpty(grid, rng)
    }
    if (i < 0) break
    grid[i] = 1
    added++
  }
  return added
}

export function removeCells(grid, size, count, rng = Math.random) {
  let removed = 0
  for (let tries = 0; tries < count * 12 && removed < count; tries++) {
    const i = randomLive(grid, rng)
    if (i < 0) break
    grid[i] = 0
    removed++
  }
  return removed
}

export function placePattern(grid, size, name, rng = Math.random, offsetX = null, offsetY = null) {
  const pattern = typeof name === 'string' ? PATTERNS[name] : name
  if (!pattern) return 0
  const width = Math.max(...pattern.map(([x]) => x)) + 1
  const height = Math.max(...pattern.map(([, y]) => y)) + 1
  const ox = offsetX == null ? Math.floor((size - width) / 2) : offsetX
  const oy = offsetY == null ? Math.floor((size - height) / 2) : offsetY
  let added = 0
  for (const [x, y] of pattern) {
    const tx = ((ox + x) % size + size) % size
    const ty = ((oy + y) % size + size) % size
    const i = ty * size + tx
    if (!grid[i]) {
      grid[i] = 1
      added++
    }
  }
  return added
}

export function seedColony(size, pattern = 'rpent', rng = Math.random) {
  const grid = emptyGrid(size)
  placePattern(grid, size, pattern, rng)
  const jitter = size <= 4 ? 1 : 2
  addCells(grid, size, jitter, rng)
  return grid
}

export function reseed(grid, size, count = 3, rng = Math.random) {
  const next = cloneGrid(grid)
  // Choose empty cells with the most live neighbours: these are the most
  // likely to give birth next generation, which feels good to new players.
  const candidates = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isAlive(next, size, x, y)) continue
      const n = liveNeighbours(next, size, x, y)
      if (n > 0) candidates.push(y * size + x)
    }
  }
  const added = addCells(next, size, count, rng, candidates.length ? candidates : null)
  return { grid: next, added }
}

export function expandGrid(grid, oldSize, newSize) {
  const next = emptyGrid(newSize)
  const offset = Math.floor((newSize - oldSize) / 2)
  for (let y = 0; y < oldSize; y++) {
    for (let x = 0; x < oldSize; x++) {
      if (grid[y * oldSize + x]) next[(y + offset) * newSize + (x + offset)] = 1
    }
  }
  return next
}

export function bestSeedCells(grid, size, count = 3, rng = Math.random) {
  const options = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isAlive(grid, size, x, y)) continue
      const n = liveNeighbours(grid, size, x, y)
      options.push({ i: y * size + x, score: n + rng() * 0.5 })
    }
  }
  options.sort((a, b) => b.score - a.score)
  return options.slice(0, count).map((o) => o.i)
}

export function randomAmbient(size, rng = Math.random) {
  const patterns = ['blinker', 'beacon', 'toad', 'glider']
  const grid = seedColony(size, patterns[Math.floor(rng() * patterns.length)], rng)
  removeCells(grid, size, Math.floor(rng() * 2), rng)
  return grid
}
