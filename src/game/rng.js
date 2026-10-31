// Small, fast, serialisable PRNG. The whole game state carries its own seed so
// saves are reproducible and tests can be deterministic.
export function nextRandom(state) {
  state.rng = (state.rng + 0x6d2b79f5) >>> 0;
  let t = state.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function randomInt(state, min, max) {
  return min + Math.floor(nextRandom(state) * (max - min + 1));
}

export function shuffle(state, items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom(state) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
