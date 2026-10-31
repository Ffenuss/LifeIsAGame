import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acknowledgeCard,
  buyProperty,
  chooseOption,
  completeMove,
  createGame,
  currentPlayer,
  deserialize,
  endTurn,
  passBuy,
  rollDice,
  scorePlayer,
  serialize,
  upgradeProperty,
} from '../src/game/engine.js';
import { aiPendingAction } from '../src/game/ai.js';
import { CONFIG, TILE_BY_ID, upgradeCost } from '../src/game/data.js';

function game(players = 2, laps = 3) {
  return createGame({
    seed: 42,
    laps,
    players: Array.from({ length: players }, (_, i) => ({
      name: `P${i}`,
      isAI: i > 0,
      color: ['#f00', '#0f0', '#00f', '#ff0'][i],
    })),
  });
}

function landOn(state, tileId) {
  state.phase = 'moving';
  const from = (tileId - 1 + 32) % 32;
  state.players[state.current].position = from;
  state.lastRoll = 1;
  return completeMove(state);
}

test('a new game is deterministic and everyone starts equal', () => {
  const a = game();
  const b = game();
  assert.equal(a.players.length, 2);
  assert.equal(a.players[0].cash, CONFIG.startingCash);
  assert.equal(a.players[0].salary, CONFIG.baseSalary);
  assert.equal(a.players[0].happiness, CONFIG.startingHappiness);
  assert.equal(a.players[0].position, 0);
  assert.notEqual(a.players[0].goal, null);
  assert.deepEqual(a.deck, b.deck);
  assert.deepEqual(
    a.players.map((p) => p.goal),
    b.players.map((p) => p.goal),
  );
});

test('rolling moves along the board and wraps correctly', () => {
  const state = game();
  state.players[0].position = 30;
  const result = rollDice(state);
  assert.equal(state.phase, 'moving');
  assert.equal(result.path.length, result.roll);
  assert.equal(result.to, (30 + result.roll) % 32);
});

test('passing Fresh Start pays salary and starts a new chapter', () => {
  const state = game();
  const player = state.players[0];
  player.position = 31;
  state.phase = 'moving';
  state.lastRoll = 2;
  const { events } = completeMove(state);
  assert.equal(player.position, 1);
  assert.equal(player.laps, 1);
  assert.equal(player.cash, CONFIG.startingCash + CONFIG.baseSalary);
  assert.ok(events.some((e) => e.type === 'salary'));
});

test('landing on an unowned property offers a purchase', () => {
  const state = game();
  const tile = TILE_BY_ID[1];
  landOn(state, 1);
  assert.equal(state.pending.type, 'buy');
  assert.equal(state.phase, 'action');
  buyProperty(state);
  assert.equal(state.owners[1].owner, 0);
  assert.equal(state.owners[1].level, 1);
  assert.equal(state.players[0].cash, CONFIG.startingCash - tile.price);
  assert.equal(state.phase, 'end');
});

test('passing on a property leaves it unowned', () => {
  const state = game();
  landOn(state, 1);
  passBuy(state);
  assert.equal(state.owners[1], undefined);
  assert.equal(state.pending, null);
});

test('rent is paid and a full colour group doubles it', () => {
  const state = game();
  state.owners[1] = { owner: 1, level: 1 };
  state.players[1].cash = 0;
  landOn(state, 1);
  const rent = TILE_BY_ID[1].rent[0];
  assert.equal(state.players[0].cash, CONFIG.startingCash - rent);
  assert.equal(state.players[1].cash, rent);

  // Give player 1 the whole childhood group and land player 0 again.
  for (const id of [3, 5, 7]) state.owners[id] = { owner: 1, level: 1 };
  state.players[0].position = 0;
  state.players[0].cash = 5000;
  state.phase = 'moving';
  state.lastRoll = 1;
  completeMove(state);
  assert.equal(state.players[0].cash, 5000 - rent * CONFIG.groupRentMultiplier);
});

test('upgrading raises the rent and costs the right amount', () => {
  const state = game();
  const tile = TILE_BY_ID[1];
  state.owners[1] = { owner: 0, level: 1 };
  state.players[0].position = 0;
  state.phase = 'moving';
  state.lastRoll = 1;
  completeMove(state);
  assert.equal(state.pending.type, 'upgrade');
  assert.equal(state.pending.cost, upgradeCost(tile, 1));
  upgradeProperty(state);
  assert.equal(state.owners[1].level, 2);
  assert.equal(state.players[0].cash, CONFIG.startingCash - upgradeCost(tile, 1));
});

test('graduation choices apply cash, salary and the scholar flag', () => {
  const state = game();
  landOn(state, 8);
  assert.equal(state.pending.type, 'choice');
  chooseOption(state, 'college');
  const player = state.players[0];
  assert.equal(player.cash, CONFIG.startingCash - 400);
  assert.equal(player.salary, CONFIG.baseSalary + 120);
  assert.equal(player.flags.scholar, true);
  assert.equal(player.happiness, CONFIG.startingHappiness + 6);
  assert.equal(state.phase, 'end');
});

test('choices cannot be bought without cash', () => {
  const state = game();
  state.players[0].cash = 100;
  landOn(state, 8);
  assert.throws(() => chooseOption(state, 'college'), /enough cash/);
});

test('life event cards resolve and can be acknowledged', () => {
  const state = game();
  landOn(state, 17);
  assert.equal(state.pending.type, 'card');
  const cardId = state.pending.cardId;
  assert.ok(cardId);
  acknowledgeCard(state);
  assert.equal(state.pending, null);
  assert.equal(state.phase, 'end');
});

test('retirement triggers after the configured chapters and scores the game', () => {
  const state = game(2, 1);
  const p = state.players[0];
  p.laps = 1;
  state.phase = 'end';
  const { ended } = endTurn(state);
  assert.equal(ended, false);
  assert.equal(p.retired, true);
  assert.equal(p.cash, CONFIG.startingCash + CONFIG.retirementBonus);

  const q = state.players[1];
  q.laps = 1;
  state.phase = 'end';
  const finish = endTurn(state);
  assert.equal(finish.ended, true);
  assert.equal(state.phase, 'ended');
  assert.equal(state.results.length, 2);
  assert.ok(state.results[0].total > 0);
});

test('a player who cannot pay rent goes bankrupt and hands over assets', () => {
  const state = game();
  state.owners[13] = { owner: 1, level: 3 };
  state.players[1].cash = 0;
  state.players[0].cash = 10;
  landOn(state, 13);
  assert.equal(state.players[0].bankrupt, true);
  assert.equal(state.players[0].cash, 0);
  assert.equal(state.players[1].cash, 10);
  assert.equal(state.phase, 'end');
});

test('AI makes a legal pending decision', () => {
  const state = game();
  landOn(state, 1);
  const action = aiPendingAction(state);
  assert.equal(action.type, 'buy');
  state.players[0].cash = 50;
  landOn(state, 3);
  assert.equal(aiPendingAction(state).type, 'pass');
});

test('game state survives a save/load round trip', () => {
  const state = game();
  state.owners[1] = { owner: 0, level: 2 };
  state.players[0].flags.scholar = true;
  const restored = deserialize(serialize(state));
  assert.equal(restored.players[0].cash, state.players[0].cash);
  assert.equal(restored.owners[1].level, 2);
  assert.equal(restored.players[0].flags.scholar, true);
  assert.equal(restored.deck.length, state.deck.length);
});

test('scores combine cash, assets, happiness and family', () => {
  const state = game();
  const p = state.players[0];
  state.owners[1] = { owner: 0, level: 3 };
  p.cash = 1000;
  p.happiness = 60;
  p.partner = true;
  p.kids = 1;
  const score = scorePlayer(state, p);
  assert.ok(score.assets > 0);
  assert.equal(score.family, 150 + 120);
  assert.equal(score.happiness, 480);
  assert.ok(score.total > 1000);
});

test('currentPlayer tracks endTurn', () => {
  const state = game(3);
  assert.equal(currentPlayer(state).id, 0);
  state.phase = 'end';
  endTurn(state);
  assert.equal(currentPlayer(state).id, 1);
  state.phase = 'end';
  endTurn(state);
  assert.equal(currentPlayer(state).id, 2);
});
