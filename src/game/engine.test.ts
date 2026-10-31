import { describe, expect, it } from 'vitest';
import { MilestoneGame, buyPriceFor, paydayFor } from './engine';
import { ai } from './ai';
import { PLAYER_COLORS, TILES } from './data';
import type { PlayerSetup } from './types';

const setups: PlayerSetup[] = ['engineer', 'chef', 'designer', 'engineer'].map(
  (careerId, index) => ({
    name: `P${index + 1}`,
    careerId,
    isAI: true,
    color: PLAYER_COLORS[index],
  }),
);

function autoplay(seed: number) {
  const game = MilestoneGame.newGame(setups, seed);
  let guard = 0;

  while (!game.isOver && guard < 2000) {
    guard += 1;
    if (game.state.phase === 'awaitRoll') {
      game.roll();
      game.resolveLanding();
    }

    if (game.state.pending) {
      const pending = game.state.pending;
      const player = game.current;
      if (pending.kind === 'buy') {
        game.decide(
          ai.shouldBuy(player, pending.tile, game.ownedTiles(player).length)
            ? 'buy'
            : 'pass',
        );
      } else if (pending.kind === 'upgrade') {
        game.decide(
          ai.shouldUpgrade(player, pending.tile, pending.cost)
            ? 'upgrade'
            : 'decline',
        );
      } else {
        game.decide(ai.chooseEventOption(player, pending));
      }
    }

    if (game.state.phase === 'turnEnd') {
      game.finishTurn();
    }
  }

  return game;
}

describe('Milestone engine', () => {
  it('produces varied dice across a long game', () => {
    const game = MilestoneGame.newGame(setups, 123456);
    const seen = new Set<string>();
    for (let turn = 0; turn < 24; turn += 1) {
      if (!game.canRoll) break;
      const roll = game.roll();
      seen.add(roll.dice.join('+'));
      game.resolveLanding();
      const pending = game.state.pending;
      if (pending) {
        if (pending.kind === 'event') {
          game.decide(ai.chooseEventOption(game.current, pending));
        } else {
          game.decide('pass');
        }
      }
      if (game.state.phase === 'turnEnd') game.finishTurn();
    }
    expect(seen.size).toBeGreaterThan(4);
    expect(seen.has('1+1') && seen.size === 1).toBe(false);
  });

  it('creates a valid opening state', () => {
    const game = MilestoneGame.newGame(setups, 42);
    expect(game.state.players).toHaveLength(4);
    expect(game.state.phase).toBe('awaitRoll');
    expect(game.state.properties.filter(Boolean)).toHaveLength(
      TILES.filter((tile) => tile.type === 'property').length,
    );
    expect(game.current.name).toBe('P1');
    expect(game.current.cash).toBe(9000);
  });

  it('charges the correct discounted price to the designer', () => {
    expect(buyPriceFor(33, 'designer')).toBeLessThan(buyPriceFor(33, 'engineer'));
    expect(buyPriceFor(33, 'engineer')).toBe(5200);
  });

  it('adds family bonuses to payday', () => {
    const game = MilestoneGame.newGame(setups, 42);
    const player = game.state.players[0];
    const base = paydayFor(player);
    player.married = true;
    player.kids = 2;
    expect(paydayFor(player)).toBeGreaterThan(base);
  });

  it('purchases a property through a pending decision', () => {
    const game = MilestoneGame.newGame(setups, 7);
    game.roll();
    game.state.players[0].tile = 1;
    game.state.phase = 'moving';
    const outcome = game.resolveLanding();
    expect(outcome.pending?.kind).toBe('buy');
    const cashBefore = game.current.cash;
    game.decide('buy');
    expect(game.state.properties[1]?.owner).toBe(0);
    expect(game.current.cash).toBe(cashBefore - buyPriceFor(1, 'engineer'));
    expect(game.state.phase).toBe('turnEnd');
  });

  it('pays rent to the owner', () => {
    const game = MilestoneGame.newGame(setups, 9);
    game.state.properties[1] = { owner: 1, level: 0 };
    game.roll();
    game.state.players[0].tile = 1;
    game.state.phase = 'moving';
    const ownerCash = game.state.players[1].cash;
    const playerCash = game.current.cash;
    game.resolveLanding();
    expect(game.state.players[1].cash).toBeGreaterThan(ownerCash);
    expect(game.current.cash).toBeLessThan(playerCash);
  });

  it('completes full games without corrupt state', () => {
    for (const seed of [1, 7, 99, 1234, 9999]) {
      const game = autoplay(seed);
      expect(game.isOver).toBe(true);
      expect(game.state.players.every((p) => p.cash >= 0)).toBe(true);
      expect(game.state.players.every((p) => Number.isFinite(p.cash))).toBe(true);
      expect(game.state.market).toBeGreaterThanOrEqual(0.7);
      expect(game.state.market).toBeLessThanOrEqual(1.6);
      const results = game.getResults();
      expect(results).toHaveLength(4);
      expect(results[0].netWorth).toBeGreaterThanOrEqual(results[3].netWorth);
      expect(new Set(results.map((r) => r.rank)).size).toBe(4);
    }
  });

  it('serializes and resumes a game', () => {
    const game = autoplay(31);
    const restored = MilestoneGame.fromJSON(game.serialize());
    expect(restored.getResults()).toEqual(game.getResults());
    expect(restored.state.players).toEqual(game.state.players);
  });
});
