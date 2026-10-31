/**
 * Headless balance lab: npm run sim -- [games] [difficulty]
 * Every player is AI, so we can measure game length and the win spread.
 */
import { createGame, netWorth } from '../src/game/state.js'
import { GameEngine, instantPresenter } from '../src/game/engine.js'
import { AIPlayer } from '../src/game/ai.js'
import { mulberry32 } from '../src/game/rng.js'
import { GAME } from '../src/game/constants.js'

const games = Number(process.argv[2] || 200)
const difficulty = process.argv[3] || 'sharp'
const results = []

for (let seed = 1; seed <= games; seed++) {
  const state = createGame({ seed, difficulty })
  for (const p of state.players) {
    p.isAI = true
    p.difficulty = difficulty
  }
  const ai = new AIPlayer(difficulty)
  const engine = new GameEngine(state, {
    rng: mulberry32(seed * 7919),
    presenter: instantPresenter,
    ai
  })
  let turns = 0
  const original = engine.takeTurn.bind(engine)
  engine.takeTurn = async (player) => {
    turns++
    if (turns > 600) {
      state.over = true
      state.endReason = 'turn cap'
      return
    }
    return original(player)
  }
  await engine.start()
  const winner = state.players.find((p) => p.id === state.winner)
  results.push({
    seed,
    turns,
    rounds: state.round,
    winner: winner?.name ?? 'none',
    reason: state.endReason ?? '',
    winnerNet: winner ? netWorth(state, winner) : 0,
    bankrupt: state.players.filter((p) => p.bankrupt).length,
    properties: state.players.map((p) => Object.values(state.colonies).filter((c) => c.owner === p.id).length),
    cash: state.players.map((p) => p.cash),
    over: state.over
  })
}

const avg = (xs) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length)
const pct = (n) => ((n / results.length) * 100).toFixed(1) + '%'
const wins = {}
for (const r of results) wins[r.winner] = (wins[r.winner] || 0) + 1
const capped = results.filter((r) => r.turns > 600).length
const targetWins = results.filter((r) => r.reason.includes('net worth')).length
const bankruptcyWins = results.filter((r) => r.reason.includes('bankrupt')).length

console.log(`Games: ${results.length}  difficulty: ${difficulty}`)
console.log(`Turns   avg ${avg(results.map((r) => r.turns)).toFixed(1)}  min ${Math.min(...results.map((r) => r.turns))}  max ${Math.max(...results.map((r) => r.turns))}`)
console.log(`Rounds  avg ${avg(results.map((r) => r.rounds)).toFixed(1)}  max ${Math.max(...results.map((r) => r.rounds))}`)
console.log(`Winner  ${JSON.stringify(wins)}`)
console.log(`End     target ${pct(targetWins)}  bankruptcy ${pct(bankruptcyWins)}  cap ${capped}`)
console.log(`NetWorth avg $${avg(results.map((r) => r.winnerNet)).toFixed(0)}  target $${GAME.victoryNetWorth}`)
console.log(`Bankruptcies avg ${avg(results.map((r) => r.bankrupt)).toFixed(2)}`)
console.log(`Owner spread avg ${JSON.stringify(results[0].properties.map((_, i) => avg(results.map((r) => r.properties[i])).toFixed(1)))}`)
