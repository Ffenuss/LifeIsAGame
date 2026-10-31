import {
  CARDS,
  CHOICES,
  CONFIG,
  GOALS,
  PLAYER_STYLES,
  GOAL_BY_ID,
  TILES,
  TILE_BY_ID,
  assetValue,
  countAssets,
  hasMaxLevelAsset,
  rentFor,
  upgradeCost,
} from './data.js';
import { clamp, nextRandom, randomInt, shuffle } from './rng.js';

const TILE_COUNT = TILES.length;
const CARD_BY_ID = Object.fromEntries(CARDS.map((card) => [card.id, card]));

export function currentPlayer(state) {
  return state.players[state.current];
}

export function createGame({ players, laps = CONFIG.laps, seed = Math.floor(Math.random() * 1e9) } = {}) {
  const safePlayers = (players && players.length ? players : [{ name: 'You', isAI: false }]).slice(0, 4);
  const state = {
    version: 1,
    seed,
    rng: seed >>> 0,
    laps: Math.max(1, Math.min(5, laps)),
    players: safePlayers.map((player, index) => ({
      id: index,
      name: player.name || `Player ${index + 1}`,
      color: player.color || PLAYER_STYLES[index % PLAYER_STYLES.length].color,
      colorDark: player.colorDark || PLAYER_STYLES[index % PLAYER_STYLES.length].dark,
      isAI: Boolean(player.isAI),
      cash: CONFIG.startingCash,
      salary: CONFIG.baseSalary,
      happiness: CONFIG.startingHappiness,
      position: 0,
      laps: 0,
      partner: false,
      kids: 0,
      retired: false,
      bankrupt: false,
      goal: null,
      flags: {},
      stats: { assetsBought: 0, rentPaid: 0, rentEarned: 0, events: 0, donated: 0 },
    })),
    owners: {},
    deck: [],
    deckIndex: 0,
    current: 0,
    phase: 'roll',
    turn: 1,
    lastRoll: null,
    pending: null,
    log: [],
    winner: null,
    results: null,
    startedAt: Date.now(),
  };

  const goals = shuffle(state, GOALS.map((goal) => goal.id));
  state.players.forEach((player, index) => {
    player.goal = goals[index % goals.length];
  });
  state.deck = shuffle(state, CARDS.map((card) => card.id));

  addLog(state, `${state.players[0].name} begins a brand new life.`, 'start');
  addLog(state, 'Roll the die to take your first steps.', 'info');
  return state;
}

// ---------------------------------------------------------------------------
// Turn flow
// ---------------------------------------------------------------------------

export function rollDice(state) {
  if (state.phase !== 'roll') throw new Error(`Cannot roll during phase ${state.phase}`);
  const player = currentPlayer(state);
  if (player.retired || player.bankrupt) throw new Error('Player is not active');

  const roll = randomInt(state, 1, 6);
  const from = player.position;
  const path = [];
  for (let step = 1; step <= roll; step++) path.push((from + step) % TILE_COUNT);

  state.lastRoll = roll;
  state.phase = 'moving';
  return { roll, from, path, to: path[path.length - 1] };
}

export function completeMove(state) {
  if (state.phase !== 'moving') throw new Error(`Cannot complete move during phase ${state.phase}`);
  const player = currentPlayer(state);
  const events = [];
  const from = player.position;
  const roll = state.lastRoll;
  const to = (from + roll) % TILE_COUNT;
  const passedStart = from + roll >= TILE_COUNT;

  player.position = to;

  if (passedStart) {
    player.laps += 1;
    player.cash += player.salary;
    events.push({ type: 'salary', playerId: player.id, amount: player.salary });
    addLog(state, `${player.name} passes Fresh Start and collects $${player.salary} salary.`, 'money');
    addLog(state, `Chapter ${Math.min(player.laps + 1, state.laps)} begins.`, 'info');
  }

  const landing = resolveLanding(state, player, to, events);
  if (landing) events.push(landing);
  if (state.pending) state.phase = 'action';
  else if (player.bankrupt) state.phase = 'end';
  else state.phase = 'end';

  return { events, from, to, passedStart, roll };
}

function resolveLanding(state, player, tileId, events) {
  const tile = TILE_BY_ID[tileId];
  events.push({ type: 'land', playerId: player.id, tileId });

  switch (tile.type) {
    case 'property': {
      const owned = state.owners[tileId];
      if (!owned) {
        state.pending = { type: 'buy', tileId, playerId: player.id };
        events.push({ type: 'offer', kind: 'buy', tileId });
        addLog(state, `${player.name} arrives at ${tile.name}. It is for sale for $${tile.price}.`, 'info');
        return null;
      }
      if (owned.owner === player.id) {
        if (owned.level < 3) {
          const cost = upgradeCost(tile, owned.level);
          state.pending = { type: 'upgrade', tileId, cost, playerId: player.id };
          events.push({ type: 'offer', kind: 'upgrade', tileId, cost });
          addLog(state, `${player.name} visits their own ${tile.name}. Upgrade available for $${cost}.`, 'info');
        } else {
          applyHappiness(state, player, 2, events);
          addLog(state, `${player.name} enjoys their fully upgraded ${tile.name}. +2 happiness.`, 'happy');
        }
        return null;
      }

      const owner = state.players[owned.owner];
      const rent = rentFor(state, tileId);
      const paid = payPlayer(state, player, owner, rent, `rent at ${tile.name}`);
      player.stats.rentPaid += paid;
      owner.stats.rentEarned += paid;
      addLog(
        state,
        `${player.name} pays $${paid} rent to ${owner.name} at ${tile.name}${rent > tile.rent[owned.level - 1] ? ' (full group bonus!)' : ''}.`,
        'money',
      );
      events.push({ type: 'rent', fromId: player.id, toId: owner.id, amount: paid, tileId });
      if (player.bankrupt) events.push({ type: 'bankrupt', playerId: player.id });
      return null;
    }

    case 'event': {
      const card = drawCard(state, player, events);
      return card;
    }

    case 'bonus': {
      if (tile.cash) applyCash(state, player, tile.cash, events);
      if (tile.salary) {
        player.salary = Math.max(100, player.salary + tile.salary);
        events.push({ type: 'salaryUp', playerId: player.id, amount: tile.salary });
      }
      if (tile.happiness) applyHappiness(state, player, tile.happiness, events);
      addLog(state, `${tile.name}: +$${tile.cash || 0}${tile.salary ? `, salary +$${tile.salary}` : ''}${tile.happiness ? `, +${tile.happiness} happiness` : ''}.`, 'good');
      return null;
    }

    case 'rest': {
      applyHappiness(state, player, tile.happiness || 4, events);
      addLog(state, `${player.name} takes a moment at the ${tile.name}. +${tile.happiness || 4} happiness.`, 'happy');
      return null;
    }

    case 'start': {
      applyCash(state, player, 100, events);
      applyHappiness(state, player, 3, events);
      addLog(state, `${player.name} lands on Fresh Start. A little bonus for new beginnings: +$100.`, 'good');
      return null;
    }

    case 'emptyNest': {
      if (player.kids > 0) {
        const bonus = 120 * player.kids;
        applyCash(state, player, bonus, events);
        applyHappiness(state, player, 8, events);
        addLog(state, `${player.name} watches the kids fly the nest. +$${bonus}, +8 happiness.`, 'happy');
      } else {
        applyCash(state, player, 80, events);
        applyHappiness(state, player, 4, events);
        addLog(state, `${player.name} enjoys a quiet, wonderfully cheap house. +$80.`, 'good');
      }
      return null;
    }

    case 'choice': {
      const choice = choiceFor(state, tile.choiceId, player);
      state.pending = { type: 'choice', choiceId: choice.id, tileId, playerId: player.id };
      events.push({ type: 'choice', choiceId: choice.id, tileId });
      addLog(state, `${player.name} faces a milestone: ${choice.title}.`, 'choice');
      return null;
    }

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Pending decisions
// ---------------------------------------------------------------------------

export function choiceFor(state, choiceId, player) {
  const base = CHOICES[choiceId];
  if (!base) throw new Error(`Unknown choice ${choiceId}`);

  if (choiceId === 'wedding' && player.partner) {
    return {
      ...base,
      title: 'Anniversary',
      prompt: 'A familiar face, a shared history, and one more year together.',
      options: [
        {
          id: 'renew',
          label: 'Renew your vows',
          detail: '−$100 · +8 happiness',
          cost: 100,
          effects: { cash: -100, happiness: 8 },
          ai: 3,
        },
        {
          id: 'skip',
          label: 'A quiet night in',
          detail: '+2 happiness',
          effects: { happiness: 2 },
          ai: 1,
        },
      ],
    };
  }

  if (choiceId === 'nursery' && player.kids >= CONFIG.maxKids) {
    return {
      ...base,
      title: 'Full House',
      prompt: 'The house is loud, joyful, and completely out of bedrooms.',
      options: [
        {
          id: 'full',
          label: 'Enjoy the chaos',
          detail: '+6 happiness',
          effects: { happiness: 6 },
          ai: 2,
        },
      ],
    };
  }

  return base;
}

export function buyProperty(state) {
  assertPending(state, 'buy');
  const player = currentPlayer(state);
  const tile = TILE_BY_ID[state.pending.tileId];
  if (player.cash < tile.price) throw new Error('Not enough cash');
  const events = [];
  player.cash -= tile.price;
  player.stats.assetsBought += 1;
  state.owners[tile.id] = { owner: player.id, level: 1 };
  addLog(state, `${player.name} buys ${tile.name} for $${tile.price}.`, 'buy');
  events.push({ type: 'buy', playerId: player.id, tileId: tile.id, amount: tile.price });
  finishPending(state, events);
  return { events };
}

export function passBuy(state) {
  assertPending(state, 'buy');
  const player = currentPlayer(state);
  const tile = TILE_BY_ID[state.pending.tileId];
  addLog(state, `${player.name} passes on ${tile.name}.`, 'info');
  finishPending(state, [{ type: 'pass', playerId: player.id, tileId: tile.id }]);
  return { events: [{ type: 'pass', playerId: player.id, tileId: tile.id }] };
}

export function upgradeProperty(state) {
  assertPending(state, 'upgrade');
  const player = currentPlayer(state);
  const tile = TILE_BY_ID[state.pending.tileId];
  const own = state.owners[tile.id];
  if (!own || own.owner !== player.id) throw new Error('You do not own this property');
  if (own.level >= 3) throw new Error('Already fully upgraded');
  const cost = upgradeCost(tile, own.level);
  if (player.cash < cost) throw new Error('Not enough cash');
  player.cash -= cost;
  own.level += 1;
  addLog(state, `${player.name} upgrades ${tile.name} to level ${own.level} for $${cost}.`, 'buy');
  const events = [{ type: 'upgrade', playerId: player.id, tileId: tile.id, level: own.level, amount: cost }];
  finishPending(state, events);
  return { events };
}

export function passUpgrade(state) {
  assertPending(state, 'upgrade');
  const player = currentPlayer(state);
  const tile = TILE_BY_ID[state.pending.tileId];
  addLog(state, `${player.name} decides ${tile.name} is fine as it is.`, 'info');
  finishPending(state, [{ type: 'pass', playerId: player.id, tileId: tile.id }]);
  return { events: [{ type: 'pass', playerId: player.id, tileId: tile.id }] };
}

export function acknowledgeCard(state) {
  if (!state.pending || state.pending.type !== 'card') throw new Error('No card to acknowledge');
  state.pending = null;
  state.phase = 'end';
  return { events: [] };
}

export function chooseOption(state, optionId) {
  if (!state.pending || state.pending.type !== 'choice') throw new Error('No choice to resolve');
  const player = currentPlayer(state);
  const choice = choiceFor(state, state.pending.choiceId, player);
  const option = choice.options.find((item) => item.id === optionId);
  if (!option) throw new Error(`Unknown option ${optionId}`);
  if (option.cost && player.cash < option.cost) throw new Error('Not enough cash for that choice');

  const events = [];
  applyEffects(state, player, option.effects || {}, events);

  if (option.gamble) {
    const win = nextRandom(state) < option.gamble.chance;
    if (win) {
      player.cash += option.gamble.win;
      events.push({ type: 'money', playerId: player.id, amount: option.gamble.win, reason: 'investment' });
      addLog(state, `${option.gamble.winText} +$${option.gamble.win}.`, 'good');
    } else {
      addLog(state, `${option.gamble.loseText} −$${option.cost}.`, 'bad');
    }
    events.push({ type: 'gamble', playerId: player.id, win });
  }

  addLog(state, `${player.name} chose “${option.label}”.`, 'choice');
  finishPending(state, events);
  return { events, option };
}

function applyEffects(state, player, effects, events) {
  if (effects.cash) applyCash(state, player, effects.cash, events);
  if (effects.salary) {
    player.salary = Math.max(100, player.salary + effects.salary);
    events.push({ type: 'salaryUp', playerId: player.id, amount: effects.salary });
  }
  if (effects.happiness) applyHappiness(state, player, effects.happiness, events);
  if (effects.partner) {
    player.partner = true;
    events.push({ type: 'family', playerId: player.id, partner: true });
  }
  if (effects.kids) {
    player.kids += effects.kids;
    events.push({ type: 'family', playerId: player.id, kids: player.kids });
  }
  for (const flag of effects.flags || []) player.flags[flag] = true;
}

function finishPending(state, events) {
  state.pending = null;
  state.phase = 'end';
  return events;
}

export function endTurn(state) {
  if (state.phase !== 'end' && state.phase !== 'action') {
    throw new Error(`Cannot end turn during phase ${state.phase}`);
  }
  const events = [];
  const player = currentPlayer(state);
  if (!player.retired && !player.bankrupt && player.laps >= state.laps) {
    player.retired = true;
    player.cash += CONFIG.retirementBonus;
    addLog(state, `${player.name} retires after chapter ${state.laps}. A $${CONFIG.retirementBonus} retirement bonus.`, 'retire');
    events.push({ type: 'retire', playerId: player.id });
  }

  const active = state.players.filter((p) => !p.retired && !p.bankrupt);
  if (active.length === 0) {
    finishGame(state, events);
    return { events, ended: true };
  }

  let next = state.current;
  for (let i = 0; i < state.players.length; i++) {
    next = (next + 1) % state.players.length;
    if (!state.players[next].retired && !state.players[next].bankrupt) break;
  }

  state.current = next;
  state.phase = 'roll';
  state.lastRoll = null;
  state.pending = null;
  state.turn += 1;
  addLog(state, `${state.players[next].name}'s turn.`, 'turn');
  return { events, ended: false };
}

// ---------------------------------------------------------------------------
// Cards, money, bankruptcy
// ---------------------------------------------------------------------------

function drawCard(state, player, events) {
  if (state.deckIndex >= state.deck.length) {
    state.deck = shuffle(state, CARDS.map((card) => card.id));
    state.deckIndex = 0;
    addLog(state, 'The deck is reshuffled.', 'info');
  }
  const card = CARD_BY_ID[state.deck[state.deckIndex++]];
  player.stats.events += 1;

  if (card.cash) {
    const before = player.cash;
    player.cash = Math.max(0, player.cash + card.cash);
    events.push({ type: 'money', playerId: player.id, amount: player.cash - before, reason: card.title });
  }
  if (card.salary) {
    player.salary = Math.max(100, player.salary + card.salary);
    events.push({ type: 'salaryUp', playerId: player.id, amount: card.salary });
  }
  if (card.happiness) applyHappiness(state, player, card.happiness, events);

  state.pending = { type: 'card', cardId: card.id, playerId: player.id };
  addLog(state, `Life event — ${card.title}: ${card.text}`, card.tone);
  return { type: 'card', card, playerId: player.id };
}

function applyCash(state, player, amount, events) {
  player.cash = Math.max(0, player.cash + amount);
  events.push({ type: 'money', playerId: player.id, amount, reason: 'life' });
}

function applyHappiness(state, player, amount, events) {
  const before = player.happiness;
  player.happiness = clamp(player.happiness + amount, 0, 100);
  const delta = player.happiness - before;
  if (delta) events.push({ type: 'happiness', playerId: player.id, amount: delta });
}

function payPlayer(state, from, to, amount, reason) {
  const paid = Math.min(from.cash, amount);
  from.cash -= paid;
  if (to) to.cash += paid;

  if (paid < amount) {
    bankruptPlayer(state, from, to);
  }
  return paid;
}

function bankruptPlayer(state, player, creditor) {
  player.bankrupt = true;
  player.retired = true;
  player.happiness = 0;
  state.pending = null;
  const released = [];
  for (const [tileId, own] of Object.entries(state.owners)) {
    if (own.owner !== player.id) continue;
    if (creditor) {
      own.owner = creditor.id;
      released.push(Number(tileId));
    } else {
      delete state.owners[tileId];
    }
  }
  addLog(state, `${player.name} goes bankrupt and leaves the board.`, 'bad');
  if (released.length) addLog(state, `${creditor.name} takes over their properties.`, 'bad');
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function scorePlayer(state, player) {
  const owned = Object.entries(state.owners).filter(([, own]) => own.owner === player.id);
  const assets = owned.reduce((sum, [tileId, own]) => sum + assetValue(TILE_BY_ID[Number(tileId)], own.level), 0);
  const goal = GOAL_BY_ID[player.goal];
  const goalMet = !player.bankrupt && goal ? Boolean(goal.check(state, player)) : false;
  const family = (player.partner ? 150 : 0) + player.kids * 120;
  const happiness = player.happiness * 8;
  const retirement = player.retired && !player.bankrupt ? 200 : 0;
  const goalBonus = goalMet ? CONFIG.goalBonus : 0;
  const total = Math.round(player.cash + assets + happiness + family + goalBonus + retirement);

  return {
    playerId: player.id,
    cash: player.cash,
    assets,
    happiness,
    family,
    goal: goalBonus,
    goalMet,
    retirement,
    total,
  };
}

function finishGame(state, events) {
  const results = state.players
    .map((player) => scorePlayer(state, player))
    .sort((a, b) => b.total - a.total || b.cash - a.cash);
  state.phase = 'ended';
  state.results = results;
  state.winner = results[0]?.playerId ?? null;
  state.pending = null;
  const winner = state.players[state.winner];
  addLog(state, `${winner?.name} wins with a life score of ${results[0]?.total}.`, 'retire');
  events.push({ type: 'gameover', winner: state.winner, results });
}

export function isGameOver(state) {
  return state.phase === 'ended';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function assertPending(state, type) {
  if (!state.pending || state.pending.type !== type) throw new Error(`Expected pending ${type}`);
}

function addLog(state, text, kind = 'info') {
  state.log.push({ id: state.log.length + 1, turn: state.turn, text, kind });
  if (state.log.length > 80) state.log.shift();
}

export function goalProgress(state, player) {
  const goal = GOAL_BY_ID[player.goal];
  if (!goal) return { text: '', met: false };
  switch (goal.id) {
    case 'tycoon':
      return { text: `${Math.min(4, countAssets(state, player.id))}/4 assets`, met: goal.check(state, player) };
    case 'globetrotter':
      return {
        text: `${Math.min(2, countAssets(state, player.id, (tile) => tile.district === 'adventure'))}/2 adventure assets`,
        met: goal.check(state, player),
      };
    case 'family':
      return { text: `${player.partner ? 'Partner ✓' : 'No partner'} · ${Math.min(2, player.kids)}/2 kids`, met: goal.check(state, player) };
    case 'scholar':
      return { text: player.flags.scholar ? 'Graduated ✓' : 'Not yet', met: goal.check(state, player) };
    case 'philanthropist':
      return { text: player.flags.philanthropist ? 'Donated ✓' : 'Not yet', met: goal.check(state, player) };
    case 'homeowner':
      return { text: hasMaxLevelAsset(state, player.id) ? 'Level 3 ✓' : 'No level 3 asset', met: goal.check(state, player) };
    case 'socialite':
      return { text: `${player.happiness}/80 happiness`, met: goal.check(state, player) };
    case 'investor':
      return { text: `$${player.cash}/$2,000`, met: goal.check(state, player) };
    default:
      return { text: '', met: false };
  }
}

export function serialize(state) {
  return JSON.stringify(state);
}

export function deserialize(raw) {
  if (!raw) return null;
  try {
    const state = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!state || state.version !== 1) return null;
    if (!Array.isArray(state.players) || !state.players.length) return null;
    if (!TILE_BY_ID[state.players[state.current]?.position ?? -1]) return null;
    if (!['roll', 'moving', 'action', 'end', 'ended'].includes(state.phase)) return null;
    return state;
  } catch {
    return null;
  }
}
