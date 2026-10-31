import { GROUP_TILES, TILE_BY_ID, upgradeCost } from './data.js';
import { choiceFor, currentPlayer } from './engine.js';

// A friendly, slightly greedy opponent. It values a complete colour group,
// keeps a cash cushion, and generally says yes to love and learning.
export function aiPendingAction(state) {
  const pending = state.pending;
  if (!pending) return null;
  const player = currentPlayer(state);

  if (pending.type === 'buy') {
    const tile = TILE_BY_ID[pending.tileId];
    const completesGroup = (GROUP_TILES[tile.district] || []).filter((id) => id !== tile.id).every(
      (id) => state.owners[id]?.owner === player.id,
    );
    const cushion = completesGroup ? 60 : 220;
    const buy = player.cash - tile.price >= cushion || (tile.price <= 180 && player.cash - tile.price >= 100);
    return { type: buy ? 'buy' : 'pass' };
  }

  if (pending.type === 'upgrade') {
    const tile = TILE_BY_ID[pending.tileId];
    const cost = upgradeCost(tile, state.owners[tile.id].level);
    const groupComplete = (GROUP_TILES[tile.district] || []).every((id) => state.owners[id]?.owner === player.id);
    const upgrade = player.cash - cost >= (groupComplete ? 180 : 380);
    return { type: upgrade ? 'upgrade' : 'skipUpgrade' };
  }

  if (pending.type === 'card') {
    return { type: 'card' };
  }

  if (pending.type === 'choice') {
    const choice = choiceFor(state, pending.choiceId, player);
    const affordable = choice.options.filter((option) => !option.cost || player.cash >= option.cost);
    const pool = affordable.length ? affordable : [choice.options[0]];
    let best = pool[0];
    let bestScore = -Infinity;
    for (const option of pool) {
      let score = option.ai ?? 1;
      if (option.cost) {
        const remaining = player.cash - option.cost;
        if (remaining < 150) score -= 3;
        else if (remaining < 350) score -= 1;
      }
      if (option.gamble && player.cash < 600) score -= 2;
      if (option.id === 'baby' && player.kids >= 2) score -= 2;
      if (score > bestScore) {
        bestScore = score;
        best = option;
      }
    }
    return { type: 'choice', optionId: best.id };
  }

  return null;
}
