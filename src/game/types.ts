/** Shared types for the Milestone game engine. */

export type TileType =
  | 'start'
  | 'property'
  | 'life'
  | 'market'
  | 'tax'
  | 'career'
  | 'family'
  | 'legacy';

export type PropertyGroup = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface TaxRule {
  percent?: number;
  flat?: number;
  perProperty?: number;
}

export interface Tile {
  index: number;
  type: TileType;
  name: string;
  group?: PropertyGroup;
  price?: number;
  blurb?: string;
  tax?: TaxRule;
}

export interface Career {
  id: string;
  name: string;
  icon: string;
  salary: number;
  cash: number;
  paydayBonus: number;
  lifeBonus: number;
  discount: number;
  perk: string;
}

export interface Effect {
  cash?: number;
  cashPct?: number;
  cashPerKid?: number;
  cashPerProperty?: number;
  salary?: number;
  kids?: number;
  married?: boolean;
  freeUpgrade?: number;
}

export interface EventChoice {
  label: string;
  detail: string;
  cost?: number;
  chance?: number;
  effect?: Effect;
  success?: Effect;
  fail?: Effect;
  successText?: string;
  failText?: string;
  resultText?: string;
}

export type EventTone = 'good' | 'bad' | 'neutral';

export interface LifeEvent {
  id: string;
  title: string;
  text: string;
  icon: string;
  tone: EventTone;
  effect?: Effect;
  choices?: EventChoice[];
}

export interface MarketEvent {
  id: string;
  title: string;
  text: string;
  icon: string;
  tone: EventTone;
  /** Multiplies all property values and rents. */
  marketFactor?: number;
  /** Cash paid to every player. */
  cashAll?: number;
  /** Career-specific payment (career id -> cash). */
  careerCash?: Record<string, number>;
  /** Every property owner pays this per property. */
  perPropertyCost?: number;
}

export interface PlayerSetup {
  name: string;
  careerId: string;
  isAI: boolean;
  color: string;
}

export interface Player {
  id: number;
  name: string;
  isAI: boolean;
  color: string;
  careerId: string;
  cash: number;
  salary: number;
  tile: number;
  laps: number;
  married: boolean;
  kids: number;
  retired: boolean;
  bankrupt: boolean;
}

export interface PropertyState {
  owner: number | null;
  level: number;
}

export type PendingDecision =
  | { kind: 'buy'; tile: number; price: number }
  | { kind: 'upgrade'; tile: number; cost: number; level: number }
  | { kind: 'event'; tile: number; event: LifeEvent };

export type LogKind =
  | 'info'
  | 'money'
  | 'good'
  | 'bad'
  | 'rent'
  | 'buy'
  | 'event'
  | 'market'
  | 'turn'
  | 'retire';

export interface LogEntry {
  id: number;
  text: string;
  kind: LogKind;
  playerId?: number;
}

export interface TurnInfo {
  dice: [number, number];
  doubles: boolean;
  path: number[];
  salary: number;
  extraRolls: number;
  retiredNow: boolean;
}

export type GamePhase =
  | 'awaitRoll'
  | 'moving'
  | 'awaitDecision'
  | 'turnEnd'
  | 'gameOver';

export interface GameState {
  seed: number;
  rngState: number;
  round: number;
  maxRounds: number;
  current: number;
  phase: GamePhase;
  players: Player[];
  properties: (PropertyState | null)[];
  market: number;
  pending: PendingDecision | null;
  turn: TurnInfo | null;
  log: LogEntry[];
  logSeq: number;
  gameOver: boolean;
}

export interface PlayerResult {
  playerId: number;
  rank: number;
  netWorth: number;
  cash: number;
  propertyValue: number;
  legacy: number;
  properties: number;
}

export interface RollOutcome {
  dice: [number, number];
  doubles: boolean;
  path: number[];
  salary: number;
  retiredNow: boolean;
  playerId: number;
}

export interface StoryCard {
  title: string;
  text: string;
  tone: EventTone;
  icon: string;
  kind: 'life' | 'market' | 'tax' | 'career' | 'family' | 'legacy';
}

export interface LandingOutcome {
  pending: PendingDecision | null;
  playerId: number;
  events: LogEntry[];
  retiredNow: boolean;
  story?: StoryCard;
}

export const BOARD_SIZE = 36;
export const START_TILE = 0;
export const MAX_LEVEL = 3;
export const RENT_MULTIPLIER = [1, 2, 3.5, 5];
