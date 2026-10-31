import { buyPriceFor, upgradeCostFor } from './engine';
import { type Effect, type PendingDecision, type Player } from './types';

/** A simple, readable opponent: cautious with cash, greedy about good deals. */
export class MilestoneAI {
  shouldBuy(player: Player, tileIndex: number, ownedCount: number): boolean {
    const price = buyPriceFor(tileIndex, player.careerId);
    if (player.cash < price) return false;
    const reserve = 1800 + player.kids * 300;
    const cushion = player.cash - price;

    if (ownedCount === 0) return cushion >= 600;
    return cushion >= reserve || (cushion >= 700 && price <= 2400);
  }

  shouldUpgrade(player: Player, _tileIndex: number, cost: number): boolean {
    if (player.cash < cost) return false;
    const cushion = player.cash - cost;
    if (cost <= 1200 && cushion >= 1600) return true;
    return cushion >= 3000;
  }

  chooseEventOption(player: Player, pending: PendingDecision): number {
    if (pending.kind !== 'event' || !pending.event.choices) return 0;
    let best = 0;
    let bestScore = -Infinity;

    pending.event.choices.forEach((choice, index) => {
      if (choice.cost && player.cash < choice.cost) return;
      let score = 0;
      if (choice.effect) score = this.effectScore(player, choice.effect);
      if (choice.chance != null) {
        const success = choice.success ? this.effectScore(player, choice.success) : 0;
        const fail = choice.fail ? this.effectScore(player, choice.fail) : 0;
        score = choice.chance * success + (1 - choice.chance) * fail;
      }
      score -= choice.cost ?? 0;
      if (score > bestScore) {
        bestScore = score;
        best = index;
      }
    });

    return best;
  }

  private effectScore(player: Player, effect: Effect): number {
    let score = 0;
    score += effect.cash ?? 0;
    score += (effect.cashPct ?? 0) * player.cash;
    score += (effect.cashPerKid ?? 0) * player.kids;
    const owned = 2 + player.kids;
    score += (effect.cashPerProperty ?? 0) * owned;
    score += (effect.salary ?? 0) * 9;
    score += (effect.kids ?? 0) * 1800;
    if (effect.married) score += 2000;
    score += (effect.freeUpgrade ?? 0) * 1800;
    return score;
  }

  rollDelay(): number {
    return 700 + Math.random() * 450;
  }

  actionDelay(): number {
    return 850 + Math.random() * 550;
  }

  upgradeCost(player: Player, tileIndex: number): number {
    return upgradeCostFor(tileIndex, player.careerId);
  }
}

export const ai = new MilestoneAI();
