import {
  CAREERS,
  FAMILY_EVENTS,
  CAREER_EVENTS,
  LEGACY_EVENTS,
  LIFE_EVENTS,
  MARKET_EVENTS,
  TILES,
  getCareer,
  propertyTile,
} from './data';
import {
  BOARD_SIZE,
  MAX_LEVEL,
  RENT_MULTIPLIER,
  START_TILE,
  type Effect,
  type EventChoice,
  type GameState,
  type LandingOutcome,
  type LifeEvent,
  type LogEntry,
  type LogKind,
  type MarketEvent,
  type PendingDecision,
  type Player,
  type PlayerResult,
  type PlayerSetup,
  type RollOutcome,
  type StoryCard,
} from './types';

const MAX_LOG = 120;

export const round10 = (value: number): number => Math.round(value / 10) * 10;

export function buyPriceFor(tileIndex: number, careerId: string): number {
  const tile = propertyTile(tileIndex);
  if (!tile?.price) return 0;
  const career = getCareer(careerId);
  return round10(tile.price * (1 - career.discount));
}

export function upgradeCostFor(tileIndex: number, careerId: string): number {
  const tile = propertyTile(tileIndex);
  if (!tile?.price) return 0;
  const career = getCareer(careerId);
  return round10(tile.price * 0.5 * (1 - career.discount));
}

export function paydayFor(player: Player): number {
  const career = getCareer(player.careerId);
  return round10(
    player.salary +
      career.paydayBonus +
      (player.married ? 1200 : 0) +
      player.kids * 500,
  );
}

export function legacyFor(player: Player): number {
  return (player.married ? 2000 : 0) + player.kids * 1500;
}

/** Deterministic, save-friendly PRNG (mulberry32). */
function mulberry32(state: number): { value: number; state: number } {
  let a = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, state: a };
}

export class MilestoneGame {
  state: GameState;

  private constructor(state: GameState) {
    this.state = state;
  }

  static newGame(setups: PlayerSetup[], seed = Date.now()): MilestoneGame {
    const safeSeed = Math.abs(Math.floor(seed)) || 1;
    const players: Player[] = setups.map((setup, index) => {
      const career = getCareer(setup.careerId);
      return {
        id: index,
        name: setup.name.trim() || `Player ${index + 1}`,
        isAI: setup.isAI,
        color: setup.color,
        careerId: career.id,
        cash: career.cash,
        salary: career.salary,
        tile: START_TILE,
        laps: 0,
        married: false,
        kids: 0,
        retired: false,
        bankrupt: false,
      };
    });
    const state: GameState = {
      seed: safeSeed,
      rngState: safeSeed,
      round: 1,
      maxRounds: 16,
      current: 0,
      phase: 'awaitRoll',
      players,
      properties: TILES.map((tile) =>
        tile.type === 'property' ? { owner: null, level: 0 } : null,
      ),
      market: 1,
      pending: null,
      turn: null,
      log: [],
      logSeq: 1,
      gameOver: false,
    };
    const game = new MilestoneGame(state);
    game.addLog('A new story begins. Roll to take your first step.', 'info');
    return game;
  }

  static fromJSON(input: string | GameState): MilestoneGame {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input;
    if (!parsed || !Array.isArray(parsed.players) || !Array.isArray(parsed.properties)) {
      throw new Error('Invalid save data');
    }
    return new MilestoneGame(parsed as GameState);
  }

  toJSON(): GameState {
    return structuredClone(this.state);
  }

  serialize(): string {
    return JSON.stringify(this.state);
  }

  get pending(): PendingDecision | null {
    return this.state.pending;
  }

  get current(): Player {
    return this.state.players[this.state.current];
  }

  get isOver(): boolean {
    return this.state.gameOver;
  }

  get canRoll(): boolean {
    return this.state.phase === 'awaitRoll' && !this.state.gameOver;
  }

  addLog(text: string, kind: LogKind = 'info', playerId?: number): LogEntry {
    const entry: LogEntry = {
      id: this.state.logSeq++,
      text,
      kind,
      playerId,
    };
    this.state.log.push(entry);
    if (this.state.log.length > MAX_LOG) {
      this.state.log.splice(0, this.state.log.length - MAX_LOG);
    }
    return entry;
  }

  teamOwner(tileIndex: number): Player | null {
    const prop = this.state.properties[tileIndex];
    if (!prop || prop.owner == null) return null;
    return this.state.players[prop.owner] ?? null;
  }

  ownedTiles(player: Player): number[] {
    return this.state.properties
      .map((prop, index) => (prop?.owner === player.id ? index : -1))
      .filter((index) => index >= 0);
  }

  investedValue(player: Player, tileIndex: number): number {
    const prop = this.state.properties[tileIndex];
    if (!prop) return 0;
    return (
      buyPriceFor(tileIndex, player.careerId) +
      prop.level * upgradeCostFor(tileIndex, player.careerId)
    );
  }

  propertyValue(player: Player, tileIndex: number): number {
    return Math.round(this.investedValue(player, tileIndex) * this.state.market);
  }

  netWorth(player: Player): number {
    const propertyValue = this.ownedTiles(player).reduce(
      (total, tileIndex) => total + this.propertyValue(player, tileIndex),
      0,
    );
    return Math.round(player.cash + propertyValue + legacyFor(player));
  }

  rentFor(tileIndex: number): number {
    const tile = propertyTile(tileIndex);
    const prop = this.state.properties[tileIndex];
    if (!tile?.price || !prop) return 0;
    const base = tile.price * 0.12;
    return round10(base * RENT_MULTIPLIER[prop.level] * this.state.market);
  }

  breakDown(player: Player): { cash: number; propertyValue: number; legacy: number } {
    return {
      cash: player.cash,
      propertyValue: this.ownedTiles(player).reduce(
        (total, tileIndex) => total + this.propertyValue(player, tileIndex),
        0,
      ),
      legacy: legacyFor(player),
    };
  }

  getResults(): PlayerResult[] {
    const rows = this.state.players.map((player) => {
      const breakdown = this.breakDown(player);
      return {
        playerId: player.id,
        rank: 0,
        netWorth: player.retired || player.bankrupt
          ? Math.round(breakdown.cash + breakdown.propertyValue + breakdown.legacy)
          : this.netWorth(player),
        cash: breakdown.cash,
        propertyValue: breakdown.propertyValue,
        legacy: breakdown.legacy,
        properties: this.ownedTiles(player).length,
      };
    });
    rows.sort((a, b) => b.netWorth - a.netWorth);
    rows.forEach((row, index) => {
      row.rank = index + 1;
    });
    return rows;
  }

  private random(): number {
    const result = mulberry32(this.state.rngState);
    this.state.rngState = result.state;
    return result.value;
  }

  private int(maxExclusive: number): number {
    return Math.floor(this.random() * maxExclusive);
  }

  private pick<T>(items: T[]): T {
    return items[this.int(items.length)];
  }

  private activePlayers(): Player[] {
    return this.state.players.filter((p) => !p.retired && !p.bankrupt);
  }

  private charge(
    player: Player,
    amount: number,
    creditor: Player | null,
    reason: string,
  ): number {
    let due = Math.max(0, round10(amount));
    if (due === 0) return 0;
    let paid = 0;

    if (player.cash < due) {
      const owned = this.ownedTiles(player).sort(
        (a, b) => this.investedValue(player, a) - this.investedValue(player, b),
      );
      for (const tileIndex of owned) {
        if (player.cash >= due) break;
        const sale = round10(this.investedValue(player, tileIndex) * 0.6);
        player.cash += sale;
        const prop = this.state.properties[tileIndex]!;
        prop.owner = null;
        prop.level = 0;
        const tile = TILES[tileIndex];
        this.addLog(
          `${player.name} sells ${tile.name} for $${sale.toLocaleString()} to cover the bill.`,
          'bad',
          player.id,
        );
      }
    }

    paid = Math.min(player.cash, due);
    player.cash -= paid;

    if (creditor) {
      creditor.cash += paid;
    }

    if (paid < due) {
      player.bankrupt = true;
      player.retired = true;
      const remaining = this.ownedTiles(player);
      for (const tileIndex of remaining) {
        const prop = this.state.properties[tileIndex]!;
        prop.owner = creditor ? creditor.id : null;
        if (!creditor) prop.level = 0;
      }
      this.addLog(
        `${player.name} cannot pay ${reason} and is out of the game.`,
        'bad',
        player.id,
      );
    }

    return paid;
  }

  private credit(player: Player, amount: number, kind: LogKind = 'money'): void {
    const value = round10(amount);
    if (value === 0) return;
    player.cash += value;
    this.addLog(
      `${player.name} ${value > 0 ? 'receives' : 'pays'} $${Math.abs(value).toLocaleString()}.`,
      kind,
      player.id,
    );
  }

  private applyEffect(
    player: Player,
    effect: Effect,
    isLifeEvent: boolean,
    context: string,
  ): void {
    if (!effect) return;

    if (effect.cash) {
      if (effect.cash > 0) this.credit(player, effect.cash);
      else {
        const paid = this.charge(player, -effect.cash, null, context);
        if (paid > 0) {
          this.addLog(
            `${player.name} pays $${paid.toLocaleString()} (${context}).`,
            'bad',
            player.id,
          );
        }
      }
    }

    if (effect.cashPct) {
      const amount = round10(player.cash * effect.cashPct);
      if (amount > 0) this.credit(player, amount);
      else if (amount < 0) {
        const paid = this.charge(player, -amount, null, context);
        if (paid > 0) {
          this.addLog(
            `${player.name} pays $${paid.toLocaleString()} (${context}).`,
            'bad',
            player.id,
          );
        }
      }
    }

    if (effect.cashPerKid && player.kids > 0) {
      const value = effect.cashPerKid * player.kids;
      if (value > 0) this.credit(player, value);
      else {
        const paid = this.charge(player, -value, null, context);
        if (paid > 0) {
          this.addLog(
            `${player.name} pays $${paid.toLocaleString()} for ${player.kids} ${
              player.kids === 1 ? 'child' : 'children'
            }.`,
            'bad',
            player.id,
          );
        }
      }
    }

    if (effect.cashPerProperty) {
      const count = this.ownedTiles(player).length;
      if (count > 0) {
        const value = effect.cashPerProperty * count;
        if (value > 0) this.credit(player, value);
        else {
          const paid = this.charge(player, -value, null, context);
          if (paid > 0) {
            this.addLog(
              `${player.name} pays $${paid.toLocaleString()} across ${count} ${
                count === 1 ? 'property' : 'properties'
              }.`,
              'bad',
              player.id,
            );
          }
        }
      }
    }

    if (effect.salary) {
      player.salary = Math.max(1200, round10(player.salary + effect.salary));
      this.addLog(
        `${player.name}'s salary ${effect.salary > 0 ? 'rises' : 'falls'} to $${player.salary.toLocaleString()}.`,
        effect.salary > 0 ? 'good' : 'bad',
        player.id,
      );
    }

    if (effect.kids) {
      player.kids = Math.max(0, player.kids + effect.kids);
      if (effect.kids > 0) {
        this.addLog(
          `${player.name} welcomes ${effect.kids === 1 ? 'a child' : `${effect.kids} children`} to the family.`,
          'good',
          player.id,
        );
      }
    }

    if (effect.married === true && !player.married) {
      player.married = true;
      this.addLog(`${player.name} gets married.`, 'good', player.id);
    } else if (effect.married === false && player.married) {
      player.married = false;
      this.addLog(`${player.name} is single again.`, 'bad', player.id);
    }

    if (effect.freeUpgrade) {
      let upgrades = effect.freeUpgrade;
      while (upgrades > 0) {
        const owned = this.ownedTiles(player)
          .filter((tileIndex) => (this.state.properties[tileIndex]?.level ?? MAX_LEVEL) < MAX_LEVEL)
          .sort(
            (a, b) =>
              (propertyTile(b)?.price ?? 0) - (propertyTile(a)?.price ?? 0),
          );
        const tileIndex = owned[0];
        if (tileIndex == null) break;
        this.state.properties[tileIndex]!.level += 1;
        this.addLog(
          `${TILES[tileIndex].name} is upgraded for free (level ${this.state.properties[tileIndex]!.level}).`,
          'buy',
          player.id,
        );
        upgrades -= 1;
      }
    }

    const career = getCareer(player.careerId);
    if (isLifeEvent && career.lifeBonus > 0 && (effect.cash || effect.cashPct)) {
      player.cash += career.lifeBonus;
      this.addLog(
        `${career.name} perk: +$${career.lifeBonus.toLocaleString()}.`,
        'good',
        player.id,
      );
    }
  }

  private applyEvent(player: Player, event: LifeEvent, poolLabel: string): void {
    this.addLog(`${player.name} draws "${event.title}" (${poolLabel}).`, 'event', player.id);
    if (event.effect) {
      this.applyEffect(player, event.effect, true, event.title);
    }
  }

  private resolveChoice(player: Player, event: LifeEvent, choice: EventChoice): void {
    if (choice.cost && choice.cost > player.cash) {
      this.addLog(`${player.name} cannot afford that choice.`, 'bad', player.id);
      return;
    }
    if (choice.cost) {
      this.charge(player, choice.cost, null, choice.label);
      this.addLog(
        `${player.name} spends $${choice.cost.toLocaleString()} on "${choice.label}".`,
        'money',
        player.id,
      );
    }

    if (choice.chance != null) {
      const success = this.random() < choice.chance;
      const effect = success ? choice.success : choice.fail;
      if (effect) this.applyEffect(player, effect, true, event.title);
      this.addLog(
        success
          ? choice.successText ?? `${event.title}: it works out.`
          : choice.failText ?? `${event.title}: it does not work out.`,
        success ? 'good' : 'bad',
        player.id,
      );
    } else {
      if (choice.effect) this.applyEffect(player, choice.effect, true, event.title);
      this.addLog(
        choice.resultText ?? `${player.name} chooses "${choice.label}".`,
        'event',
        player.id,
      );
    }
  }

  private drawMarket(player: Player): MarketEvent {
    const event: MarketEvent = this.pick(MARKET_EVENTS);
    this.addLog(`${player.name} triggers a market event: ${event.title}.`, 'market');
    let detail = event.text;

    if (event.marketFactor) {
      this.state.market = Math.min(
        1.6,
        Math.max(0.7, Math.round(this.state.market * event.marketFactor * 100) / 100),
      );
      detail += ` Property values and rents are now ×${this.state.market.toFixed(2)}.`;
    }
    if (event.cashAll) {
      for (const p of this.state.players) {
        if (p.retired || p.bankrupt) continue;
        p.cash += event.cashAll;
      }
      detail += ` Every player collects $${event.cashAll.toLocaleString()}.`;
    }
    if (event.careerCash) {
      for (const p of this.state.players) {
        if (p.retired || p.bankrupt) continue;
        const bonus = event.careerCash[p.careerId];
        if (bonus) {
          p.cash += bonus;
          detail += ` ${p.name} (${getCareer(p.careerId).name}) collects $${bonus.toLocaleString()}.`;
        }
      }
    }
    if (event.perPropertyCost) {
      for (const p of this.state.players) {
        const count = this.ownedTiles(p).length;
        if (count > 0) {
          const paid = this.charge(
            p,
            event.perPropertyCost * count,
            null,
            'owner levy',
          );
          if (paid > 0) {
            detail += ` ${p.name} pays $${paid.toLocaleString()} on ${count} properties.`;
          }
        }
      }
    }

    this.addLog(detail, event.tone === 'bad' ? 'bad' : 'good');
    return event;
  }

  private applyTax(player: Player, tileIndex: number): void {
    const tile = TILES[tileIndex];
    const rule = tile.tax ?? { flat: 500 };
    const propertyCount = this.ownedTiles(player).length;
    const percentPart = rule.percent ? player.cash * rule.percent : 0;
    const flatPart = rule.flat ?? 0;
    const base = Math.max(percentPart, flatPart);
    const total = round10(base + (rule.perProperty ?? 0) * propertyCount);
    const paid = this.charge(player, total, null, 'taxes');
    this.addLog(
      `${player.name} pays $${paid.toLocaleString()} in ${tile.name.toLowerCase()}.`,
      'bad',
      player.id,
    );
  }

  roll(): RollOutcome {
    if (!this.canRoll) throw new Error('Not ready to roll');
    const player = this.current;
    const dice: [number, number] = [this.int(6) + 1, this.int(6) + 1];
    const doubles = dice[0] === dice[1];
    const total = dice[0] + dice[1];
    const path: number[] = [];
    let pos = player.tile;
    let salary = 0;
    let retiredNow = false;

    for (let step = 0; step < total; step += 1) {
      pos = (pos + 1) % BOARD_SIZE;
      path.push(pos);
      if (pos === START_TILE) {
        player.laps += 1;
        const amount = paydayFor(player);
        player.cash += amount;
        salary += amount;
        this.addLog(
          `${player.name} reaches a new chapter (age ${ageFor(player)}) and collects a $${amount.toLocaleString()} payday.`,
          'money',
          player.id,
        );
        if (player.laps >= 3) {
          player.retired = true;
          retiredNow = true;
          this.addLog(
            `${player.name} retires at ${ageFor(player)} with $${this.netWorth(player).toLocaleString()} to their name.`,
            'retire',
            player.id,
          );
          break;
        }
      }
    }

    player.tile = pos;
    const extraRolls = this.state.turn?.extraRolls ?? 0;
    this.state.turn = {
      dice,
      doubles,
      path,
      salary,
      extraRolls,
      retiredNow,
    };
    this.state.phase = 'moving';
    this.addLog(
      `${player.name} rolls ${dice[0]} + ${dice[1]} = ${total}${doubles ? ' — doubles!' : ''}.`,
      'turn',
      player.id,
    );

    return {
      dice,
      doubles,
      path,
      salary,
      retiredNow,
      playerId: player.id,
    };
  }

  resolveLanding(): LandingOutcome {
    if (this.state.phase !== 'moving') throw new Error('Not moving');
    const player = this.current;
    const startSeq = this.state.logSeq;
    let pending: PendingDecision | null = null;
    let story: StoryCard | undefined;
    const retiredNow = this.state.turn?.retiredNow ?? false;
    const tileIndex = player.tile;
    const tile = TILES[tileIndex];

    if (!retiredNow && !player.retired) {
      if (tile.type === 'property') {
        const prop = this.state.properties[tileIndex]!;
        if (prop.owner == null) {
          const price = buyPriceFor(tileIndex, player.careerId);
          if (player.cash >= price) {
            pending = { kind: 'buy', tile: tileIndex, price };
            this.state.pending = pending;
            this.state.phase = 'awaitDecision';
          } else {
            this.addLog(
              `${tile.name} is for sale for $${price.toLocaleString()}, but ${player.name} cannot afford it.`,
              'info',
              player.id,
            );
          }
        } else if (prop.owner === player.id) {
          const cost = upgradeCostFor(tileIndex, player.careerId);
          if (prop.level < MAX_LEVEL && player.cash >= cost) {
            pending = {
              kind: 'upgrade',
              tile: tileIndex,
              cost,
              level: prop.level,
            };
            this.state.pending = pending;
            this.state.phase = 'awaitDecision';
          } else if (prop.level >= MAX_LEVEL) {
            this.addLog(
              `${player.name} visits ${tile.name}. It is fully developed and earning well.`,
              'good',
              player.id,
            );
          } else {
            this.addLog(
              `${player.name} visits ${tile.name}, but cannot afford the $${cost.toLocaleString()} upgrade.`,
              'info',
              player.id,
            );
          }
        } else {
          const owner = this.state.players[prop.owner];
          const rent = this.rentFor(tileIndex);
          const paid = this.charge(player, rent, owner, `rent at ${tile.name}`);
          this.addLog(
            `${player.name} pays $${paid.toLocaleString()} rent to ${owner.name} at ${tile.name}.`,
            'rent',
            player.id,
          );
        }
      } else if (
        tile.type === 'life' ||
        tile.type === 'career' ||
        tile.type === 'family' ||
        tile.type === 'legacy'
      ) {
        const pool =
          tile.type === 'career'
            ? CAREER_EVENTS
            : tile.type === 'family'
              ? FAMILY_EVENTS
              : tile.type === 'legacy'
                ? LEGACY_EVENTS
                : LIFE_EVENTS;
        const label =
          tile.type === 'career'
            ? 'career'
            : tile.type === 'family'
              ? 'family'
              : tile.type === 'legacy'
                ? 'legacy'
                : 'life';
        const event = this.pick(pool);
        story = {
          title: event.title,
          text: event.text,
          tone: event.tone,
          icon: event.icon,
          kind: label,
        };
        if (event.choices) {
          pending = { kind: 'event', tile: tileIndex, event };
          this.state.pending = pending;
          this.state.phase = 'awaitDecision';
          this.addLog(
            `${player.name} draws "${event.title}" — a choice awaits.`,
            'event',
            player.id,
          );
        } else {
          this.applyEvent(player, event, label);
        }
      } else if (tile.type === 'market') {
        const marketEvent = this.drawMarket(player);
        story = {
          title: marketEvent.title,
          text: marketEvent.text,
          tone: marketEvent.tone,
          icon: marketEvent.icon,
          kind: 'market',
        };
      } else if (tile.type === 'tax') {
        this.applyTax(player, tileIndex);
      } else if (tile.type === 'start') {
        player.cash += 1000;
        this.addLog(
          `${player.name} lands on New Beginnings and collects a $1,000 fresh-start bonus.`,
          'money',
          player.id,
        );
      }
    }

    if (this.state.phase !== 'awaitDecision') {
      this.state.phase = 'turnEnd';
    }

    return {
      pending,
      playerId: player.id,
      events: this.state.log.filter((entry) => entry.id >= startSeq),
      retiredNow,
      story,
    };
  }

  decide(action: 'buy' | 'pass' | 'upgrade' | 'decline' | number): void {
    if (this.state.phase !== 'awaitDecision' || !this.state.pending) {
      throw new Error('No decision pending');
    }
    const player = this.current;
    const pending = this.state.pending;

    if (pending.kind === 'buy') {
      if (action === 'buy') {
        const price = pending.price;
        if (player.cash < price) {
          this.addLog(`${player.name} cannot afford ${TILES[pending.tile].name}.`, 'bad', player.id);
        } else {
          player.cash -= price;
          const prop = this.state.properties[pending.tile]!;
          prop.owner = player.id;
          prop.level = 0;
          this.addLog(
            `${player.name} buys ${TILES[pending.tile].name} for $${price.toLocaleString()}.`,
            'buy',
            player.id,
          );
        }
      } else {
        this.addLog(`${player.name} passes on ${TILES[pending.tile].name}.`, 'info', player.id);
      }
    } else if (pending.kind === 'upgrade') {
      if (action === 'upgrade') {
        if (player.cash < pending.cost) {
          this.addLog(`${player.name} cannot afford the upgrade.`, 'bad', player.id);
        } else {
          player.cash -= pending.cost;
          this.state.properties[pending.tile]!.level += 1;
          const level = this.state.properties[pending.tile]!.level;
          this.addLog(
            `${player.name} upgrades ${TILES[pending.tile].name} to level ${level} for $${pending.cost.toLocaleString()}.`,
            'buy',
            player.id,
          );
        }
      } else {
        this.addLog(`${player.name} keeps ${TILES[pending.tile].name} as it is.`, 'info', player.id);
      }
    } else if (pending.kind === 'event') {
      if (typeof action !== 'number') {
        throw new Error('Event requires a choice index');
      }
      const choice = pending.event.choices?.[action];
      if (!choice) throw new Error('Invalid choice');
      this.resolveChoice(player, pending.event, choice);
    }

    this.state.pending = null;
    this.state.phase = 'turnEnd';
  }

  /**
   * Ends the current turn. Returns whether the same player rolls again
   * (doubles) and whether the game has ended.
   */
  finishTurn(): { again: boolean; gameOver: boolean } {
    if (this.state.phase !== 'turnEnd') {
      throw new Error('Turn is not finished');
    }
    const player = this.current;
    const turn = this.state.turn;

    if (
      turn &&
      turn.doubles &&
      turn.extraRolls < 2 &&
      !player.retired &&
      !player.bankrupt &&
      !this.state.gameOver
    ) {
      turn.extraRolls += 1;
      this.state.phase = 'awaitRoll';
      this.addLog(`${player.name} rolled doubles and goes again.`, 'turn', player.id);
      return { again: true, gameOver: false };
    }

    const total = this.state.players.length;
    let next = this.state.current;
    let nextActive: Player | null = null;
    for (let i = 1; i <= total; i += 1) {
      const candidate = this.state.players[(this.state.current + i) % total];
      if (!candidate.retired && !candidate.bankrupt) {
        next = candidate.id;
        nextActive = candidate;
        break;
      }
    }

    if (nextActive) {
      if (next <= this.state.current) {
        this.state.round += 1;
      }
      this.state.current = next;
    }

    if (this.state.round > this.state.maxRounds) {
      for (const p of this.state.players) {
        if (!p.retired) {
          p.retired = true;
          this.addLog(`${p.name} reaches retirement age ${ageFor(p)}.`, 'retire', p.id);
        }
      }
      this.state.gameOver = true;
      this.state.phase = 'gameOver';
      return { again: false, gameOver: true };
    }

    if (!nextActive || this.activePlayers().length === 0) {
      this.state.gameOver = true;
      this.state.phase = 'gameOver';
      return { again: false, gameOver: true };
    }

    this.state.phase = 'awaitRoll';
    this.state.turn = null;
    this.state.pending = null;
    this.addLog(`It is ${this.current.name}'s turn.`, 'turn', this.current.id);
    return { again: false, gameOver: false };
  }

  /** Used by the AI and by save-resume to rebuild a clean turn. */
  retireEveryone(): void {
    for (const player of this.state.players) {
      if (!player.retired) {
        player.retired = true;
        this.addLog(`${player.name} retires with $${this.netWorth(player).toLocaleString()}.`, 'retire', player.id);
      }
    }
    this.state.gameOver = true;
    this.state.phase = 'gameOver';
  }
}

export function ageFor(player: Player): number {
  return 25 + player.laps * 18;
}

export function careerById(id: string) {
  return CAREERS.find((career) => career.id === id) ?? CAREERS[0];
}
