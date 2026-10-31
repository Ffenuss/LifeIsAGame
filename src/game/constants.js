/**
 * Static game data. Everything the board, economy and cards need lives here so
 * balance can be tuned in one place.
 */

export const GAME = {
  startCash: 1100,
  salary: 180,
  passIncomePerCell: 2,
  victoryNetWorth: 5000,
  maxLevel: 3,
  startingSeeds: 0,
  dormancyFee: 70,
  sanctuaryBonus: 120,
  geneLabBonus: 150,
  taxRate: 0.1,
  taxCap: 220,
  harvestMultiplier: 9,
  sellRatio: 0.7,
  aiReserve: { cozy: 520, sharp: 280, ruthless: 120 }
}

export const PLAYER_BLUEPRINTS = [
  { id: 0, name: 'Sprout', token: 'sprout', color: '#A8E063', glow: '#D6FF8F', isAI: false },
  { id: 1, name: 'Koi', token: 'koi', color: '#5BD6E8', glow: '#A8F4FF', isAI: true },
  { id: 2, name: 'Ember', token: 'ember', color: '#FF8D66', glow: '#FFC2AE', isAI: true },
  { id: 3, name: 'Moth', token: 'moth', color: '#C9A6FF', glow: '#E8DAFF', isAI: true }
]

export const DISTRICTS = {
  meadow: {
    id: 'meadow',
    name: 'Meadow',
    color: '#8FD46A',
    deep: '#2F6B33',
    pale: '#E4F6CC',
    blurb: 'Sunlit allotments where quick colonies bloom.'
  },
  tide: {
    id: 'tide',
    name: 'Tide',
    color: '#55C7D8',
    deep: '#1F5F70',
    pale: '#D6F4F7',
    blurb: 'Floating terraces fed by warm currents.'
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    color: '#F3905E',
    deep: '#803B22',
    pale: '#FBE3D4',
    blurb: 'Glasshouses humming with thermal energy.'
  },
  circuit: {
    id: 'circuit',
    name: 'Circuit',
    color: '#B293F2',
    deep: '#4D3A80',
    pale: '#EADFFC',
    blurb: 'Neon nurseries where patterns replicate.'
  }
}

/**
 * 28 tiles around an 8x8 perimeter. Corners are 0, 7, 14 and 21.
 * Coordinates are grid coordinates (x, z) before spacing is applied.
 */
export const TILES = [
  { tile: 0, type: 'start', name: 'Genesis', short: 'Genesis', desc: 'Pass to collect a salary. Land to collect a little more.' },
  { tile: 1, type: 'property', name: 'Fern Row', district: 'meadow', price: 100, baseRent: 10, pattern: 'blinker' },
  { tile: 2, type: 'property', name: 'Moss Court', district: 'meadow', price: 120, baseRent: 12, pattern: 'toad' },
  { tile: 3, type: 'mutation', name: 'Mutation', short: 'Mutation', desc: 'Draw a mutation card.' },
  { tile: 4, type: 'property', name: 'Clover Walk', district: 'meadow', price: 150, baseRent: 16, pattern: 'beacon' },
  { tile: 5, type: 'property', name: 'Cedar Gate', district: 'meadow', price: 180, baseRent: 20, pattern: 'glider' },
  { tile: 6, type: 'tax', name: 'Bloom Tax', short: 'Bloom Tax', desc: 'Pay 10% of your cash (max $220).' },
  { tile: 7, type: 'dormancy', name: 'Dormancy', short: 'Dormancy', desc: 'Lose your next turn, or pay $70 to wake now.' },
  { tile: 8, type: 'property', name: 'Shell Lane', district: 'tide', price: 130, baseRent: 13, pattern: 'blinker' },
  { tile: 9, type: 'property', name: 'Coral Rise', district: 'tide', price: 160, baseRent: 17, pattern: 'beacon' },
  { tile: 10, type: 'ecosystem', name: 'Ecosystem', short: 'Ecosystem', desc: 'Draw an ecosystem card.' },
  { tile: 11, type: 'property', name: 'Drift Pier', district: 'tide', price: 190, baseRent: 21, pattern: 'toad' },
  { tile: 12, type: 'property', name: 'Tidal Plaza', district: 'tide', price: 220, baseRent: 25, pattern: 'glider' },
  { tile: 13, type: 'mutation', name: 'Mutation', short: 'Mutation', desc: 'Draw a mutation card.' },
  { tile: 14, type: 'sanctuary', name: 'Sanctuary', short: 'Sanctuary', desc: 'Collect $120 and a free seed.' },
  { tile: 15, type: 'property', name: 'Spark Alley', district: 'ember', price: 150, baseRent: 16, pattern: 'blinker' },
  { tile: 16, type: 'property', name: 'Cinder Way', district: 'ember', price: 180, baseRent: 20, pattern: 'beacon' },
  { tile: 17, type: 'tax', name: 'Bloom Tax', short: 'Bloom Tax', desc: 'Pay 10% of your cash (max $220).' },
  { tile: 18, type: 'property', name: 'Kiln Square', district: 'ember', price: 210, baseRent: 24, pattern: 'toad' },
  { tile: 19, type: 'property', name: 'Solstice Ave', district: 'ember', price: 250, baseRent: 30, pattern: 'glider' },
  { tile: 20, type: 'ecosystem', name: 'Ecosystem', short: 'Ecosystem', desc: 'Draw an ecosystem card.' },
  { tile: 21, type: 'geneLab', name: 'Gene Lab', short: 'Gene Lab', desc: 'A free upgrade, or $150 if you own no districts.' },
  { tile: 22, type: 'property', name: 'Neon Row', district: 'circuit', price: 190, baseRent: 22, pattern: 'blinker' },
  { tile: 23, type: 'property', name: 'Logic Lane', district: 'circuit', price: 220, baseRent: 26, pattern: 'beacon' },
  { tile: 24, type: 'mutation', name: 'Mutation', short: 'Mutation', desc: 'Draw a mutation card.' },
  { tile: 25, type: 'property', name: 'Pixel Park', district: 'circuit', price: 250, baseRent: 30, pattern: 'toad' },
  { tile: 26, type: 'property', name: 'Quantum Quay', district: 'circuit', price: 280, baseRent: 36, pattern: 'glider' },
  { tile: 27, type: 'ecosystem', name: 'Ecosystem', short: 'Ecosystem', desc: 'Draw an ecosystem card.' }
]

export const TILE_COUNT = TILES.length
export const CORNERS = [0, 7, 14, 21]
export const BOARD_SPACING = 1.8

export const PROPERTY_TILES = TILES.filter((t) => t.type === 'property')
export const PROPERTIES = new Map(PROPERTY_TILES.map((t) => [t.tile, t]))

export function tileGridPosition(index) {
  const i = ((index % TILE_COUNT) + TILE_COUNT) % TILE_COUNT
  if (i <= 7) return { x: 3.5 - i, z: 3.5, rot: 0 }
  if (i <= 14) return { x: -3.5, z: 3.5 - (i - 7), rot: -Math.PI / 2 }
  if (i <= 21) return { x: -3.5 + (i - 14), z: -3.5, rot: Math.PI }
  return { x: 3.5, z: -3.5 + (i - 21), rot: Math.PI / 2 }
}

export function boardPosition(index) {
  const p = tileGridPosition(index)
  return { x: p.x * BOARD_SPACING, z: p.z * BOARD_SPACING, rot: p.rot }
}

export const LEVEL_MULTIPLIER = [1, 3.2, 6.5]
export const LEVEL_SIZE = [4, 5, 6]
export const LEVEL_LABEL = ['Seedling', 'Grove', 'Biome']

export function upgradeCost(property, level) {
  if (level >= GAME.maxLevel) return null
  const base = property.price
  return level === 1 ? Math.round(base * 0.8) : Math.round(base * 1.35)
}

export function levelRent(property, level, population) {
  const mult = LEVEL_MULTIPLIER[level - 1] || 1
  const lifeMult = 1 + population * 0.1
  return Math.max(1, Math.round(property.baseRent * mult * lifeMult))
}

export function bookValue(property, colony) {
  if (!colony) return property.price
  let value = property.price + (colony.invested || 0)
  value += colony.population * 12
  return Math.round(value)
}

export const MUTATIONS = [
  { id: 'solar', title: 'Solar Flare', icon: '☀', text: 'The sun floods your terraces. Collect $160.', effect: { type: 'gain', amount: 160 } },
  { id: 'spores', title: 'Spore Storm', icon: '✺', text: 'A warm wind seeds every district you own. Add 2 living cells to each of your colonies.', effect: { type: 'seedAll', count: 2 } },
  { id: 'predation', title: 'Predation', icon: '◈', text: 'Invasive species spread. Pay each rival $30.', effect: { type: 'payEach', amount: 30 } },
  { id: 'symbiosis', title: 'Symbiosis', icon: '❋', text: 'Your districts trade nutrients. Collect $25 per district you own.', effect: { type: 'collectPerProperty', amount: 25 } },
  { id: 'drought', title: 'Long Drought', icon: '☵', text: 'Water runs low. Remove 2 living cells from every colony on the board.', effect: { type: 'killAll', count: 2 } },
  { id: 'glider', title: 'Glider Season', icon: '➤', text: 'Gliders glide in. Add a glider pattern to each of your colonies.', effect: { type: 'patternAll', pattern: 'glider' } },
  { id: 'boom', title: 'Market Bloom', icon: '↗', text: 'Land values surge. Collect $40 for every level of development you own.', effect: { type: 'collectPerLevel', amount: 40 } },
  { id: 'migration', title: 'Migration', icon: '⇢', text: 'Follow the flock. Move forward 3 tiles without collecting salary.', effect: { type: 'move', steps: 3, salary: false } },
  { id: 'recession', title: 'Spore Recession', icon: '↘', text: 'Markets cool. Pay $20 for every district you own.', effect: { type: 'payPerProperty', amount: 20 } },
  { id: 'revival', title: 'Revival', icon: '✦', text: 'Dormant life stirs. Advance every one of your colonies one generation, then collect $15 per living cell.', effect: { type: 'evolveGain', generations: 1, perCell: 15 } },
  { id: 'treasure', title: 'Buried Compost', icon: '◆', text: 'You turn up a rich cache. Collect $120 and add a free seed to any colony.', effect: { type: 'gainSeed', amount: 120, count: 1 } },
  { id: 'taxrefund', title: 'Civic Rebate', icon: '◎', text: 'The council returns your Bloom Tax. Collect $90.', effect: { type: 'gain', amount: 90 } }
]

export const ECOSYSTEMS = [
  { id: 'garden', title: 'Community Garden', icon: '❀', text: 'Neighbours pitch in. Collect $100.', effect: { type: 'gain', amount: 100 } },
  { id: 'grant', title: 'Seed Grant', icon: '✿', text: 'Collect $60 and add 2 living cells to each of your colonies.', effect: { type: 'gainSeedAll', amount: 60, count: 2 } },
  { id: 'recycle', title: 'Nutrient Cycling', icon: '♲', text: 'Collect $15 for every living cell in your colonies.', effect: { type: 'collectPerCell', amount: 15 } },
  { id: 'storm', title: 'Storm Drain', icon: '☂', text: 'Repairs cost you $60.', effect: { type: 'lose', amount: 60 } },
  { id: 'festival', title: 'Firefly Festival', icon: '✧', text: 'Every rival pays you $20 for a ticket.', effect: { type: 'collectEach', amount: 20 } },
  { id: 'civic', title: 'Civic Grant', icon: '▣', text: 'If you own two or more districts in one colour, collect $250. Otherwise collect $50.', effect: { type: 'districtGrant', amount: 250, fallback: 50 } },
  { id: 'research', title: 'Research Breakthrough', icon: '⌬', text: 'Upgrade your least-developed colony for free.', effect: { type: 'freeUpgrade' } },
  { id: 'windfall', title: 'Windfall', icon: '✷', text: 'A patent pays out. Collect $140.', effect: { type: 'gain', amount: 140 } },
  { id: 'dormant', title: 'Wintering', icon: '❄', text: 'Your colonies rest. Add a living cell to each, then skip nothing — wintering is free.', effect: { type: 'seedAll', count: 1 } },
  { id: 'audit', title: 'Colony Audit', icon: '☰', text: 'Pay $15 for every level of development you own.', effect: { type: 'payPerLevel', amount: 15 } }
]

export const CARD_DECKS = { mutation: MUTATIONS, ecosystem: ECOSYSTEMS }

/** Patterns are [x, y] offsets that fit inside a 4x4 / 5x5 / 6x6 grid. */
export const PATTERNS = {
  blinker: [[1, 0], [1, 1], [1, 2]],
  block: [[0, 0], [1, 0], [0, 1], [1, 1]],
  beacon: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2], [3, 2], [2, 3], [3, 3]],
  toad: [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]],
  glider: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
  rpent: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
  lwss: [[1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [4, 1], [4, 2], [0, 3], [3, 3]],
  cupholder: [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]]
}
