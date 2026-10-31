import '@fontsource-variable/outfit';
import './style.css';
import { Capacitor } from '@capacitor/core';
import { MilestoneGame, ageFor, buyPriceFor, round10 } from './game/engine';
import { ai } from './game/ai';
import {
  CAREERS,
  GROUP_COLORS,
  GROUP_NAMES,
  PLAYER_COLORS,
  TILES,
} from './game/data';
import { MAX_LEVEL, RENT_MULTIPLIER } from './game/types';
import type {
  GameState,
  PendingDecision,
  PlayerSetup,
  StoryCard,
} from './game/types';
import { BoardScene } from './scene/BoardScene';
import { icon } from './ui/icons';
import { sound } from './audio';

const SAVE_KEY = 'milestone.save.v1';
const SETTINGS_KEY = 'milestone.settings.v1';
const MAX_ROUNDS = 16;

const DEFAULT_SETUPS: PlayerSetup[] = [
  { name: 'You', careerId: 'engineer', isAI: false, color: PLAYER_COLORS[0] },
  { name: 'Ava', careerId: 'chef', isAI: true, color: PLAYER_COLORS[1] },
  { name: 'Leo', careerId: 'designer', isAI: true, color: PLAYER_COLORS[2] },
  { name: 'Mia', careerId: 'engineer', isAI: true, color: PLAYER_COLORS[3] },
];

const PLAYER_NAMES = ['You', 'Ava', 'Leo', 'Mia'];
const DEFAULT_CAREERS = ['engineer', 'chef', 'designer', 'engineer'];

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const money = (value: number): string =>
  `$${Math.round(value).toLocaleString('en-US')}`;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const chapterName = (laps: number): string =>
  ['Early Career', 'Building Years', 'Golden Years', 'Retired'][
    Math.min(3, Math.max(0, laps))
  ];

const miniDieLayouts: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function defaultSetups(count = 3): PlayerSetup[] {
  return Array.from({ length: 4 }, (_, index) => ({
    name: PLAYER_NAMES[index],
    careerId: DEFAULT_CAREERS[index],
    isAI: index > 0,
    color: PLAYER_COLORS[index],
  })).slice(0, count);
}

interface SaveData {
  version: number;
  savedAt: number;
  setup: PlayerSetup[];
  state: GameState;
}

class MilestoneApp {
  private scene: BoardScene;
  private app: HTMLElement;
  private game: MilestoneGame | null = null;
  private mode: 'title' | 'setup' | 'game' | 'end' = 'title';
  private runId = 0;
  private rolling = false;
  private busy = false;
  private lastDice: [number, number] | null = null;
  private selectedTile: number | null = null;
  private lastLogSignature = '';
  private setupCount = 3;
  private setupDraft: PlayerSetup[] = defaultSetups(4);
  private lastSetup: PlayerSetup[] | null = null;
  private muted = false;
  private modalClosable = false;
  private storyTimer: number | undefined;
  private toastTimer: number | undefined;

  private playerbar: HTMLElement;
  private turnbar: HTMLElement;
  private logpanel: HTMLElement;
  private hint: HTMLElement;
  private diceReadout: HTMLElement;
  private rollBtn: HTMLButtonElement;
  private inspector: HTMLElement;
  private titleScreen: HTMLElement;
  private modalRoot: HTMLElement;
  private eventToast: HTMLElement;
  private toastEl: HTMLElement;
  private soundBtn: HTMLButtonElement;
  private helpBtn: HTMLButtonElement;
  private menuBtn: HTMLButtonElement;

  constructor() {
    const sceneEl = document.getElementById('scene');
    if (!sceneEl) throw new Error('Missing scene container');
    this.app = document.getElementById('app')!;
    this.playerbar = document.getElementById('playerbar')!;
    this.turnbar = document.getElementById('turnbar')!;
    this.logpanel = document.getElementById('logpanel')!;
    this.hint = document.getElementById('hint')!;
    this.diceReadout = document.getElementById('dice-readout')!;
    this.rollBtn = document.getElementById('roll-btn') as HTMLButtonElement;
    this.inspector = document.getElementById('inspector')!;
    this.titleScreen = document.getElementById('title-screen')!;
    this.modalRoot = document.getElementById('modal-root')!;
    this.eventToast = document.getElementById('event-toast')!;
    this.toastEl = document.getElementById('toast')!;
    this.soundBtn = document.getElementById('sound-btn') as HTMLButtonElement;
    this.helpBtn = document.getElementById('help-btn') as HTMLButtonElement;
    this.menuBtn = document.getElementById('menu-btn') as HTMLButtonElement;

    this.loadSettings();
    this.scene = new BoardScene(sceneEl);
    this.scene.onTileClick = (index) => this.inspectTile(index);
    this.setupStaticButtons();
    this.bindGlobalEvents();
    this.showTitle();
    this.setupNativeBack();
  }

  // ------------------------------------------------------------------ setup

  private setupStaticButtons(): void {
    this.soundBtn.innerHTML = icon('sound', 19);
    this.helpBtn.innerHTML = icon('help', 19);
    this.menuBtn.innerHTML = icon('menu', 19);
    this.soundBtn.addEventListener('click', () => this.toggleSound());
    this.helpBtn.addEventListener('click', () => this.openRules());
    this.menuBtn.addEventListener('click', () => this.openMenu());
    this.rollBtn.addEventListener('click', () => {
      sound.unlock();
      void this.doRoll(this.runId);
    });
  }

  private bindGlobalEvents(): void {
    document.addEventListener(
      'pointerdown',
      () => {
        sound.unlock();
      },
      { passive: true },
    );

    document.addEventListener('keydown', (event) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

      if (event.key === 'Escape') {
        if (this.modalRoot.classList.contains('active')) {
          if (this.modalClosable) this.closeModal();
          return;
        }
        if (this.mode === 'game') this.openMenu();
        return;
      }

      if (event.code === 'Space' || event.code === 'Enter') {
        if (this.modalRoot.classList.contains('active')) return;
        if (
          this.mode === 'game' &&
          this.game &&
          !this.game.current.isAI &&
          this.game.canRoll &&
          !this.rolling
        ) {
          event.preventDefault();
          sound.unlock();
          void this.doRoll(this.runId);
        }
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.saveIfSafe();
    });

    window.addEventListener('beforeunload', () => this.saveIfSafe());
  }

  private async setupNativeBack(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    const { App } = await import('@capacitor/app');
    void App.addListener('backButton', () => {
      if (this.modalRoot.classList.contains('active')) {
        if (this.modalClosable) this.closeModal();
        return;
      }
      if (this.mode === 'game') {
        this.openMenu();
        return;
      }
      if (this.mode === 'setup') {
        this.showTitle();
        return;
      }
      void App.exitApp();
    });
    void App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) this.saveIfSafe();
    });
  }

  private loadSettings(): void {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { muted?: boolean };
      this.muted = Boolean(parsed.muted);
    } catch {
      this.muted = false;
    }
    sound.setMuted(this.muted);
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ muted: this.muted }));
    } catch {
      /* storage is optional */
    }
  }

  private toggleSound(): void {
    this.muted = !this.muted;
    sound.setMuted(this.muted);
    if (!this.muted) sound.unlock();
    this.saveSettings();
    this.updateSoundButtons();
  }

  private updateSoundButtons(): void {
    this.soundBtn.innerHTML = icon(this.muted ? 'mute' : 'sound', 19);
    this.soundBtn.setAttribute('aria-label', this.muted ? 'Enable sound' : 'Mute sound');
    const titleSound = document.getElementById('title-sound');
    if (titleSound) titleSound.innerHTML = icon(this.muted ? 'mute' : 'sound', 17);
    const label = document.querySelector('[data-sound-label]');
    if (label) label.textContent = this.muted ? 'Off' : 'On';
  }

  private setMode(mode: 'title' | 'setup' | 'game' | 'end'): void {
    this.mode = mode;
    this.app.classList.remove('is-title', 'is-game', 'is-end');
    if (mode === 'title') this.app.classList.add('is-title');
    if (mode === 'game' || mode === 'end') {
      this.app.classList.add('is-game');
      if (mode === 'end') this.app.classList.add('is-end');
    }
  }

  // ----------------------------------------------------------------- title

  private showTitle(): void {
    this.saveIfSafe();
    this.runId += 1;
    this.rolling = false;
    this.busy = false;
    this.game = null;
    this.lastDice = null;
    this.selectedTile = null;
    this.lastLogSignature = '';
    this.closeModal();
    this.hideStory();
    this.hideToast();
    this.closeInspector();
    this.scene.stopCelebrate();
    this.scene.setSelectedTile(null);
    this.setMode('title');
    this.renderPreview();
    this.renderTitle();
    this.updateSoundButtons();
  }

  private renderPreview(): void {
    const demo = MilestoneGame.newGame(defaultSetups(4), 424242);
    const tiles = [0, 11, 21, 30];
    demo.state.players.forEach((player, index) => {
      player.tile = tiles[index];
    });
    const owned: [number, number, number][] = [
      [1, 0, 2],
      [4, 1, 3],
      [13, 2, 1],
      [20, 3, 2],
      [28, 0, 1],
      [33, 1, 3],
    ];
    for (const [tile, owner, level] of owned) {
      demo.state.properties[tile] = { owner, level };
    }
    this.scene.setPlayers(demo.state.players);
    this.scene.sync(demo.state, true);
    this.scene.setActivePlayer(0);
    this.scene.showDice([3, 4]);
  }

  private renderTitle(): void {
    const save = this.readSave();
    this.titleScreen.innerHTML = `
      <div class="title-copy">
        <div class="eyebrow">3D board game · offline</div>
        <h1>MILE<span>STONE</span></h1>
        <div class="title-sub">Roll · Build · Live</div>
        <p class="title-desc">
          One board. A whole lifetime. Buy a home, build a family, ride the market,
          and retire with the best story — and the biggest fortune.
        </p>
        <div class="title-actions">
          <button class="btn btn-primary" id="title-new">
            ${icon('play', 17)} New story
          </button>
          ${
            save
              ? `<button class="btn btn-secondary" id="title-continue">
                  ${icon('rotate', 17)} Continue · round ${Math.min(
                    save.state.round,
                    MAX_ROUNDS,
                  )}
                </button>`
              : ''
          }
          <button class="btn btn-ghost" id="title-rules">
            ${icon('help', 17)} How to play
          </button>
        </div>
        <div class="title-meta">
          2–4 players · pass &amp; play or vs. AI · no internet needed
        </div>
      </div>
      <button class="icon-btn title-sound" id="title-sound" aria-label="${
        this.muted ? 'Enable sound' : 'Mute sound'
      }">${icon(this.muted ? 'mute' : 'sound', 17)}</button>
      <div class="title-foot">v1.0.0 · MADE FOR ANDROID</div>
    `;

    document.getElementById('title-new')?.addEventListener('click', () => {
      sound.unlock();
      this.openSetup(defaultSetups(3));
    });
    document.getElementById('title-continue')?.addEventListener('click', () => {
      sound.unlock();
      this.continueGame();
    });
    document.getElementById('title-rules')?.addEventListener('click', () => this.openRules());
    document.getElementById('title-sound')?.addEventListener('click', () => this.toggleSound());
  }

  private readSave(): SaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SaveData;
      if (!parsed || parsed.version !== 1) return null;
      if (!parsed.state || !Array.isArray(parsed.state.players)) return null;
      if (parsed.state.phase !== 'awaitRoll') return null;
      if (!Array.isArray(parsed.setup) || parsed.setup.length < 2) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private continueGame(): void {
    const save = this.readSave();
    if (!save) {
      this.showToast('No saved story found.');
      return;
    }
    try {
      this.game = MilestoneGame.fromJSON(save.state);
    } catch {
      this.showToast('That save could not be loaded.');
      return;
    }
    this.lastSetup = save.setup;
    this.runId += 1;
    this.rolling = false;
    this.busy = false;
    this.lastDice = null;
    this.lastLogSignature = '';
    this.selectedTile = null;
    this.closeModal();
    this.closeInspector();
    this.hideStory();
    this.setMode('game');
    this.scene.stopCelebrate();
    this.scene.setPlayers(this.game.state.players);
    this.scene.sync(this.game.state, true);
    this.scene.showDice([3, 4]);
    this.scene.setActivePlayer(this.game.state.current);
    this.renderAll(true);
    this.showToast('Story restored. Welcome back.');
    void this.startCurrentTurn(600);
  }

  private saveIfSafe(): void {
    if (!this.game || this.game.isOver) return;
    if (this.game.state.phase !== 'awaitRoll') return;
    try {
      const payload: SaveData = {
        version: 1,
        savedAt: Date.now(),
        setup: this.lastSetup ?? defaultSetups(this.game.state.players.length),
        state: this.game.state,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch {
      /* storage is optional */
    }
  }

  private clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* storage is optional */
    }
  }

  // ----------------------------------------------------------------- setup

  private openSetup(prefill?: PlayerSetup[]): void {
    this.setMode('setup');
    this.scene.stopCelebrate();
    this.scene.setSelectedTile(null);
    this.selectedTile = null;
    this.closeInspector();
    this.setupDraft = Array.from({ length: 4 }, (_, index) => {
      const base = prefill?.[index] ?? DEFAULT_SETUPS[index];
      return {
        name: base.name || PLAYER_NAMES[index],
        careerId: base.careerId || DEFAULT_CAREERS[index],
        isAI: index === 0 ? false : base.isAI,
        color: PLAYER_COLORS[index],
      };
    });
    this.setupCount = Math.min(4, Math.max(2, prefill?.length ?? 3));
    this.renderSetup();
  }

  private captureSetupDraft(): void {
    document.querySelectorAll<HTMLElement>('.setup-player').forEach((row) => {
      const index = Number(row.dataset.index);
      const draft = this.setupDraft[index];
      if (!draft) return;
      const input = row.querySelector<HTMLInputElement>('.name-input');
      if (input) draft.name = input.value;
      const select = row.querySelector<HTMLSelectElement>('.career-select');
      if (select) draft.careerId = select.value;
      const activeRole = row.querySelector<HTMLElement>('.role-tabs button.active');
      if (activeRole) draft.isAI = activeRole.dataset.role === 'ai';
    });
  }

  private renderSetup(): void {
    const rows = this.setupDraft
      .map((player, index) => {
        const hidden = index >= this.setupCount ? 'hidden' : '';
        return `
          <div class="setup-player ${hidden}" data-index="${index}" style="--pc:${PLAYER_COLORS[index]}">
            <span class="color-dot"></span>
            <input class="name-input" maxlength="14" value="${escapeHtml(player.name)}" aria-label="Player ${index + 1} name" />
            <div class="role-tabs" role="group" aria-label="Player ${index + 1} control">
              <button data-role="human" class="${player.isAI ? '' : 'active'}">${icon('users', 12)} You</button>
              <button data-role="ai" class="${player.isAI ? 'active' : ''}">${icon('bot', 12)} AI</button>
            </div>
            <select class="career-select" aria-label="Player ${index + 1} career">
              ${CAREERS.map(
                (career) =>
                  `<option value="${career.id}" ${
                    career.id === player.careerId ? 'selected' : ''
                  }>${career.name} · ${money(career.salary)}</option>`,
              ).join('')}
            </select>
          </div>
        `;
      })
      .join('');

    this.openModal(
      `
      <div class="modal-card modal-card--wide">
        <div class="modal-head">
          <div>
            <div class="eyebrow">New story</div>
            <h2>Who is playing?</h2>
            <p>Pass one device around, or take on up to three AI rivals. Every path starts
            at 25 and ends at retirement.</p>
          </div>
          <button class="modal-close" data-setup-back aria-label="Back to title">${icon('close', 18)}</button>
        </div>
        <div class="setup-intro">
          ${icon('spark', 22)}
          <span>Choose a career for your starting salary. The rest — love, luck, and property —
          is decided by the dice.</span>
        </div>
        <div class="count-row">
          <span>Players</span>
          <div class="count-tabs">
            ${[2, 3, 4]
              .map(
                (count) =>
                  `<button data-count="${count}" class="${
                    count === this.setupCount ? 'active' : ''
                  }">${count}</button>`,
              )
              .join('')}
          </div>
        </div>
        <div class="setup-players">${rows}</div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-setup-back>Back</button>
          <button class="btn btn-primary" id="setup-start">${icon('arrow', 17)} Begin story</button>
        </div>
        <div class="setup-hint">Saved automatically on this device. No account, no ads.</div>
      </div>
    `,
      false,
    );

    const closeSetup = () => this.showTitle();
    document.querySelectorAll('[data-setup-back]').forEach((element) => {
      element.addEventListener('click', closeSetup);
    });

    this.modalRoot.querySelectorAll<HTMLButtonElement>('[data-count]').forEach((button) => {
      button.addEventListener('click', () => {
        this.captureSetupDraft();
        this.setupCount = Number(button.dataset.count);
        this.renderSetup();
      });
    });

    this.modalRoot.querySelectorAll<HTMLElement>('.setup-player').forEach((row) => {
      const index = Number(row.dataset.index);
      const draft = this.setupDraft[index];
      if (!draft) return;
      row.querySelectorAll<HTMLButtonElement>('.role-tabs button').forEach((button) => {
        button.addEventListener('click', () => {
          this.captureSetupDraft();
          draft.isAI = button.dataset.role === 'ai';
          this.renderSetup();
        });
      });
    });

    const start = document.getElementById('setup-start');
    start?.addEventListener('click', () => {
      this.captureSetupDraft();
      const setups = this.setupDraft.slice(0, this.setupCount).map((player, index) => ({
        ...player,
        name: player.name.trim() || `Player ${index + 1}`,
        color: PLAYER_COLORS[index],
      }));
      this.startGame(setups);
    });
  }

  // ------------------------------------------------------------------ game

  private startGame(setups: PlayerSetup[], seed?: number): void {
    const normalized = setups.map((setup, index) => ({
      ...setup,
      name: setup.name.trim() || `Player ${index + 1}`,
      color: PLAYER_COLORS[index],
    }));
    this.lastSetup = normalized;
    this.game = MilestoneGame.newGame(normalized, seed ?? Date.now());
    this.runId += 1;
    this.rolling = false;
    this.busy = false;
    this.lastDice = null;
    this.lastLogSignature = '';
    this.selectedTile = null;
    this.closeModal();
    this.closeInspector();
    this.hideStory();
    this.hideToast();
    this.scene.stopCelebrate();
    this.scene.setSelectedTile(null);
    this.setMode('game');
    this.scene.setPlayers(this.game.state.players);
    this.scene.sync(this.game.state, true);
    this.scene.showDice([3, 4]);
    this.scene.setActivePlayer(0);
    this.renderAll(true);
    this.saveIfSafe();
    const run = this.runId;
    void this.startCurrentTurn(420, run);
  }

  private isValidRun(run: number): boolean {
    return run === this.runId && Boolean(this.game);
  }

  private async startCurrentTurn(delay = 0, run = this.runId): Promise<void> {
    if (delay > 0) await wait(delay);
    if (!this.isValidRun(run)) return;
    const game = this.game!;
    if (game.isOver) {
      this.endGame();
      return;
    }
    this.rolling = false;
    this.renderAll(true);
    const player = game.current;
    if (player.isAI) {
      this.busy = true;
      this.renderActionbar();
      this.setHint(`${player.name} is taking their turn…`);
      await wait(ai.rollDelay());
      if (!this.isValidRun(run)) return;
      await this.doRoll(run);
    } else {
      this.busy = false;
      this.renderActionbar();
      const again =
        game.state.turn?.doubles && (game.state.turn?.extraRolls ?? 0) > 0;
      this.setHint(again ? 'Doubles — you roll again!' : 'Tap Roll to move');
    }
  }

  private async doRoll(run: number): Promise<void> {
    const game = this.game;
    if (!game || run !== this.runId || !game.canRoll || this.rolling) return;
    this.rolling = true;
    this.busy = true;
    this.closeInspector();
    this.hideStory();
    const player = game.current;

    this.setHint(`${player.name} is rolling…`);
    this.renderActionbar();
    sound.roll();

    const outcome = game.roll();
    this.lastDice = outcome.dice;
    this.renderDice();
    this.renderPlayers();
    this.renderTurnbar();
    this.renderLog();
    this.scene.setActivePlayer(outcome.playerId);

    await this.sceneRollDice(outcome.dice);
    if (!this.isValidRun(run)) return;

    await this.sceneMovePawn(outcome.playerId, outcome.path);
    if (!this.isValidRun(run)) return;

    this.renderAll(true);
    const landing = game.resolveLanding();
    this.renderAll(true);

    if (landing.retiredNow) {
      sound.retire();
      this.showToast(`${player.name} retires at ${ageFor(player)}.`);
    } else if (landing.story && !landing.pending) {
      this.showStory(landing.story);
    }

    if (landing.pending) {
      sound.event();
      if (game.current.isAI) {
        this.setHint(`${player.name} is deciding…`);
        await wait(750);
        if (!this.isValidRun(run)) return;
        this.applyAIDecision();
        this.renderAll(true);
        await wait(750);
        if (!this.isValidRun(run)) return;
      } else {
        this.showDecisionModal(landing.pending);
        return;
      }
    } else {
      await wait(650);
      if (!this.isValidRun(run)) return;
    }

    await this.completeTurn(run);
  }

  private applyAIDecision(): void {
    const game = this.game;
    if (!game || !game.pending) return;
    const pending = game.pending;
    const player = game.current;
    if (pending.kind === 'buy') {
      game.decide(
        ai.shouldBuy(player, pending.tile, game.ownedTiles(player).length)
          ? 'buy'
          : 'pass',
      );
    } else if (pending.kind === 'upgrade') {
      game.decide(
        ai.shouldUpgrade(player, pending.tile, pending.cost) ? 'upgrade' : 'decline',
      );
    } else {
      game.decide(ai.chooseEventOption(player, pending));
    }
    const latest = game.state.log[game.state.log.length - 1];
    if (latest) this.showToast(latest.text);
  }

  private async completeTurn(run: number): Promise<void> {
    const game = this.game;
    if (!game || !this.isValidRun(run)) return;
    if (game.state.phase !== 'turnEnd') return;

    const result = game.finishTurn();
    this.rolling = false;
    this.renderAll(true);

    if (result.gameOver) {
      this.endGame();
      return;
    }

    this.saveIfSafe();
    const player = game.current;

    if (player.isAI) {
      this.busy = true;
      this.renderActionbar();
      this.setHint(`${player.name} is thinking…`);
      this.soundTurn(result.again);
      await wait(result.again ? 650 : 950);
      if (!this.isValidRun(run)) return;
      await this.doRoll(run);
    } else {
      this.busy = false;
      this.renderActionbar();
      this.soundTurn(result.again);
      this.setHint(result.again ? 'Doubles — roll again!' : 'Tap Roll to move');
    }
  }

  private soundTurn(again: boolean): void {
    if (again) sound.good();
    else sound.turn();
  }

  private endGame(): void {
    const game = this.game;
    if (!game) return;
    this.runId += 1;
    this.rolling = false;
    this.busy = true;
    this.clearSave();
    this.closeInspector();
    this.scene.setSelectedTile(null);
    this.scene.sync(game.state, true);
    this.scene.setActivePlayer(-1);
    this.scene.celebrate();
    sound.win();
    this.setMode('end');
    this.renderResults();
  }

  private renderResults(): void {
    const game = this.game;
    if (!game) return;
    const results = game.getResults();
    const winner = game.state.players[results[0].playerId];
    const winnerResult = results[0];
    const title =
      winner.name === 'You'
        ? 'You built a life worth remembering.'
        : `${winner.name} built the life worth remembering.`;
    const sub = `Retired at ${ageFor(winner)} with ${money(winnerResult.netWorth)} — ${
      winnerResult.properties
    } ${winnerResult.properties === 1 ? 'property' : 'properties'} and a family legacy of ${money(
      winnerResult.legacy,
    )}.`;

    const rows = results
      .map((result, index) => {
        const player = game.state.players[result.playerId];
        const familyBits = [
          player.married ? 'married' : null,
          player.kids > 0 ? `${player.kids} ${player.kids === 1 ? 'child' : 'children'}` : null,
        ]
          .filter(Boolean)
          .join(' · ');
        return `
        <div class="rank-row ${index === 0 ? 'winner' : ''}" style="--pc:${player.color}">
          <div class="rank-num">${result.rank}</div>
          <div class="rank-avatar">${escapeHtml(player.name.slice(0, 1).toUpperCase())}</div>
          <div class="rank-main">
            <strong>${escapeHtml(player.name)} ${index === 0 ? '· winner' : ''}</strong>
            <span>${familyBits || 'A quiet, independent life'} · ${result.properties} ${
              result.properties === 1 ? 'home' : 'homes'
            } · ${money(result.cash)} cash</span>
          </div>
          <div class="rank-worth">${money(result.netWorth)}<small>NET WORTH</small></div>
        </div>
      `;
      })
      .join('');

    this.modalRoot.classList.add('active');
    this.modalRoot.innerHTML = `
      <div class="end-screen">
        <div class="end-card">
          <div class="eyebrow">The story closes</div>
          <h2>${escapeHtml(title)}</h2>
          <p class="end-sub">${escapeHtml(sub)}</p>
          <div class="ranking">${rows}</div>
          <div class="end-actions">
            <button class="btn btn-primary" id="end-again">${icon('rotate', 17)} Play again</button>
            <button class="btn btn-secondary" id="end-setup">${icon('users', 17)} New players</button>
            <button class="btn btn-ghost" id="end-home">${icon('home', 17)} Title</button>
          </div>
          <div class="end-tag">Net worth = cash + property value + family legacy</div>
        </div>
      </div>
    `;

    document.getElementById('end-again')?.addEventListener('click', () => {
      this.closeModal();
      this.app.classList.remove('is-end');
      this.startGame(this.lastSetup ?? defaultSetups(3));
    });
    document.getElementById('end-setup')?.addEventListener('click', () => {
      this.closeModal();
      this.app.classList.remove('is-end');
      this.openSetup(this.lastSetup ?? defaultSetups(3));
    });
    document.getElementById('end-home')?.addEventListener('click', () => this.showTitle());
  }

  // ------------------------------------------------------------ decisions

  private showDecisionModal(pending: PendingDecision): void {
    if (pending.kind === 'buy') {
      this.showBuyModal(pending);
    } else if (pending.kind === 'upgrade') {
      this.showUpgradeModal(pending);
    } else {
      this.showEventModal(pending);
    }
  }

  private showBuyModal(pending: Extract<PendingDecision, { kind: 'buy' }>): void {
    const game = this.game!;
    const player = game.current;
    const tile = TILES[pending.tile];
    const groupColor = tile.group ? GROUP_COLORS[tile.group] : '#e8c170';
    const groupName = tile.group ? GROUP_NAMES[tile.group] : 'Property';
    const rent = game.rentFor(pending.tile);
    const fullRent = round10(
      (tile.price ?? 0) * 0.12 * RENT_MULTIPLIER[MAX_LEVEL] * game.state.market,
    );
    const ownedInGroup = game
      .ownedTiles(player)
      .filter((index) => TILES[index].group === tile.group).length;

    this.openModal(
      `
      <div class="modal-card property-modal">
        <div class="property-banner" style="--group:${groupColor}">
          <div class="kicker">${groupName} · property</div>
          <h2>${escapeHtml(tile.name)}</h2>
          <div class="price-tag"><strong>${money(pending.price)}</strong><span>purchase price</span></div>
        </div>
        <div class="property-body">
          <div class="property-stats">
            <div class="property-stat"><span>Rent now</span><strong>${money(rent)}</strong></div>
            <div class="property-stat"><span>Fully built</span><strong>${money(fullRent)}</strong></div>
            <div class="property-stat"><span>Your cash</span><strong>${money(player.cash)}</strong></div>
          </div>
          <p>Own this address to collect rent whenever a rival lands here. Land on it
          yourself to build up to ${MAX_LEVEL} levels.</p>
          ${
            ownedInGroup > 0
              ? `<div class="property-owner-note"><i style="--pc:${player.color}"></i> You already own ${ownedInGroup} in ${groupName}.</div>`
              : ''
          }
          <div class="modal-actions">
            <button class="btn btn-ghost" data-action="pass">Pass</button>
            <button class="btn btn-primary" data-action="buy">Buy · ${money(pending.price)}</button>
          </div>
          <div class="modal-note">After buying you would have ${money(player.cash - pending.price)} left.</div>
        </div>
      </div>
    `,
      false,
    );

    this.bindDecisionButtons();
  }

  private showUpgradeModal(pending: Extract<PendingDecision, { kind: 'upgrade' }>): void {
    const game = this.game!;
    const player = game.current;
    const tile = TILES[pending.tile];
    const groupColor = tile.group ? GROUP_COLORS[tile.group] : '#e8c170';
    const groupName = tile.group ? GROUP_NAMES[tile.group] : 'Property';
    const currentRent = game.rentFor(pending.tile);
    const nextLevel = pending.level + 1;
    const nextRent = round10(
      (tile.price ?? 0) *
        0.12 *
        RENT_MULTIPLIER[Math.min(MAX_LEVEL, nextLevel)] *
        game.state.market,
    );

    this.openModal(
      `
      <div class="modal-card property-modal">
        <div class="property-banner" style="--group:${groupColor}">
          <div class="kicker">${groupName} · upgrade</div>
          <h2>${escapeHtml(tile.name)}</h2>
          <div class="price-tag"><strong>${money(pending.cost)}</strong><span>build cost</span></div>
        </div>
        <div class="property-body">
          <div class="property-stats">
            <div class="property-stat"><span>Level</span><strong>${pending.level} → ${nextLevel}</strong></div>
            <div class="property-stat"><span>Rent now</span><strong>${money(currentRent)}</strong></div>
            <div class="property-stat"><span>New rent</span><strong><em>${money(nextRent)}</em></strong></div>
          </div>
          <div class="upgrade-preview">
            <span>${'◉'.repeat(pending.level)}${'○'.repeat(MAX_LEVEL - pending.level)}</span>
            <span>Build a new home on this lot.</span>
            <span class="arrow">→</span>
            <strong>+${money(nextRent - currentRent)} rent</strong>
          </div>
          <p>Houses raise the rent every rival pays when they land here. Level
          ${MAX_LEVEL} is the landmark on the block.</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" data-action="decline">Not now</button>
            <button class="btn btn-primary" data-action="upgrade">Build · ${money(pending.cost)}</button>
          </div>
          <div class="modal-note">Your cash after building: ${money(player.cash - pending.cost)}.</div>
        </div>
      </div>
    `,
      false,
    );

    this.bindDecisionButtons();
  }

  private showEventModal(pending: Extract<PendingDecision, { kind: 'event' }>): void {
    const game = this.game!;
    const player = game.current;
    const event = pending.event;
    const tile = TILES[pending.tile];
    const kicker =
      tile.type === 'life'
        ? 'Life event'
        : tile.type === 'career'
          ? 'Career event'
          : tile.type === 'family'
            ? 'Family event'
            : 'Legacy event';
    const tone =
      event.tone === 'good' ? '#5fc9a5' : event.tone === 'bad' ? '#d36767' : '#d8a441';
    const choices = event.choices ?? [];

    const choiceHtml = choices
      .map((choice, index) => {
        const affordable = !choice.cost || player.cash >= choice.cost;
        const odds = choice.chance != null ? `${Math.round(choice.chance * 100)}% chance` : '';
        const meta = [choice.detail, odds].filter(Boolean).join(' · ');
        return `
          <button class="choice-btn" data-choice="${index}" ${
            affordable ? '' : 'disabled'
          }>
            <span class="choice-main">
              <strong>${escapeHtml(choice.label)}</strong>
              <span>${
                affordable
                  ? escapeHtml(meta)
                  : `Needs ${money((choice.cost ?? 0) - player.cash)} more cash`
              }</span>
            </span>
            <span class="choice-go">${icon('arrow', 15)}</span>
          </button>
        `;
      })
      .join('');

    this.openModal(
      `
      <div class="modal-card event-modal tone-${event.tone}" style="--tone:${tone}">
        <div class="event-banner">
          <div class="event-icon">${icon(event.icon, 30)}</div>
          <div class="event-kicker">${kicker}</div>
          <h2>${escapeHtml(event.title)}</h2>
        </div>
        <div class="event-body">
          <p class="event-text">${escapeHtml(event.text)}</p>
          <div class="event-cash">${icon('cash', 14)} Your cash: <strong>${money(player.cash)}</strong></div>
          <div class="event-choices">${choiceHtml}</div>
          <div class="decision-note">This choice is final. Choose with care.</div>
        </div>
      </div>
    `,
      false,
    );

    this.modalRoot.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.choice);
        this.modalRoot
          .querySelectorAll<HTMLButtonElement>('button')
          .forEach((buttonEl) => {
            buttonEl.disabled = true;
          });
        void this.submitDecision(index);
      });
    });
  }

  private bindDecisionButtons(): void {
    this.modalRoot.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action as 'buy' | 'pass' | 'upgrade' | 'decline';
        this.modalRoot
          .querySelectorAll<HTMLButtonElement>('button')
          .forEach((buttonEl) => {
            buttonEl.disabled = true;
          });
        void this.submitDecision(action);
      });
    });
  }

  private async submitDecision(action: 'buy' | 'pass' | 'upgrade' | 'decline' | number): Promise<void> {
    const game = this.game;
    if (!game || !game.pending) return;
    const run = this.runId;
    this.closeModal();
    game.decide(action);
    if (action === 'buy' || action === 'upgrade') sound.buy();
    else if (typeof action === 'number') sound.event();
    else sound.click();

    const latest = game.state.log[game.state.log.length - 1];
    if (latest) this.showToast(latest.text);
    this.renderAll(true);
    await wait(700);
    if (!this.isValidRun(run)) return;
    await this.completeTurn(run);
  }

  // ------------------------------------------------------------------ hud

  private renderAll(syncScene = true): void {
    const game = this.game;
    if (!game) return;
    this.renderPlayers();
    this.renderTurnbar();
    this.renderActionbar();
    this.renderLog();
    this.renderDice();
    if (syncScene) {
      this.scene.sync(game.state);
      this.scene.setActivePlayer(game.state.current);
    }
    if (this.selectedTile != null) this.renderInspector();
  }

  private renderPlayers(): void {
    const game = this.game;
    if (!game) {
      this.playerbar.innerHTML = '';
      return;
    }
    this.playerbar.innerHTML = game.state.players
      .map((player) => {
        const active = player.id === game.state.current && !game.isOver;
        const owned = game.ownedTiles(player).length;
        const bits: string[] = [`Net ${money(game.netWorth(player))}`];
        if (owned > 0) bits.push(`${owned} ${owned === 1 ? 'home' : 'homes'}`);
        if (player.kids > 0) bits.push(`${player.kids} ${player.kids === 1 ? 'kid' : 'kids'}`);
        if (player.married) bits.push('married');
        const status = player.bankrupt ? 'Out of the game' : player.retired ? 'Retired' : bits.join(' · ');
        return `
          <div class="player-card ${active ? 'active' : ''} ${
            player.retired ? 'retired' : ''
          }" style="--pc:${player.color}" aria-label="${escapeHtml(player.name)}: ${money(
            player.cash,
          )}">
            <div class="player-avatar">${escapeHtml(player.name.slice(0, 1).toUpperCase())}
              ${
                player.isAI
                  ? `<span class="bot-dot">${icon('bot', 8)}</span>`
                  : ''
              }
            </div>
            <div class="player-main">
              <div class="player-line">
                <span class="player-name">${escapeHtml(player.name)}</span>
                <span class="player-age">AGE ${ageFor(player)}</span>
              </div>
              <div class="player-cash">${money(player.cash)}</div>
              <div class="player-sub">${status}</div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  private renderTurnbar(): void {
    const game = this.game;
    if (!game) {
      this.turnbar.innerHTML = '';
      return;
    }
    const player = game.current;
    const round = Math.min(game.state.round, MAX_ROUNDS);
    this.turnbar.innerHTML = `
      <span class="dot" style="background:${player.color}"></span>
      <strong>${escapeHtml(player.name)}</strong>
      <span>·</span>
      <span>ROUND ${round}/${MAX_ROUNDS}</span>
      <span>·</span>
      <span>${chapterName(player.laps).toUpperCase()}</span>
    `;
  }

  private renderActionbar(): void {
    const game = this.game;
    if (!game) {
      this.rollBtn.disabled = true;
      return;
    }
    const player = game.current;
    const pendingHuman = Boolean(game.pending) && !player.isAI;
    let title = 'ROLL';
    let sub = 'two dice';
    let disabled = true;
    let thinking = false;

    if (pendingHuman) {
      title = 'CHOOSE';
      sub = 'pick an option';
      this.rollBtn.classList.remove('thinking');
    } else if (player.isAI) {
      title = 'AI TURN';
      sub = `${player.name} is playing`;
      thinking = true;
    } else if (this.busy || this.rolling) {
      title = 'MOVING';
      sub = 'hold tight';
    } else if (game.canRoll) {
      title = 'ROLL';
      sub = 'two dice';
      disabled = false;
    } else {
      title = 'WAIT';
      sub = '';
    }

    this.rollBtn.disabled = disabled;
    this.rollBtn.classList.toggle('thinking', thinking || disabled);
    this.rollBtn.innerHTML = `
      <span class="roll-icon">${icon(thinking ? 'rotate' : 'dice', 27, thinking ? 'spin' : '')}</span>
      <span class="roll-copy"><strong>${title}</strong><small>${escapeHtml(sub)}</small></span>
    `;
  }

  private renderLog(): void {
    const game = this.game;
    if (!game) {
      this.logpanel.innerHTML = '';
      this.lastLogSignature = '';
      return;
    }
    const entries = game.state.log.slice(-5);
    const signature = entries.map((entry) => entry.id).join(',');
    if (signature === this.lastLogSignature) return;
    this.lastLogSignature = signature;
    this.logpanel.innerHTML = entries
      .map(
        (entry) => `
        <div class="log-entry kind-${entry.kind}">
          <span class="log-dot"></span>
          <span>${escapeHtml(entry.text)}</span>
        </div>
      `,
      )
      .join('');
  }

  private renderDice(): void {
    if (!this.lastDice) {
      this.diceReadout.innerHTML = '';
      return;
    }
    this.diceReadout.innerHTML = this.lastDice
      .map((value) => {
        const on = new Set(miniDieLayouts[value] ?? miniDieLayouts[1]);
        const cells = Array.from({ length: 9 }, (_, index) =>
          `<span class="${on.has(index) ? 'on' : ''}"></span>`,
        ).join('');
        return `<span class="mini-die" aria-label="Die showing ${value}">${cells}</span>`;
      })
      .join('');
  }

  private setHint(text: string): void {
    this.hint.textContent = text;
  }

  // ------------------------------------------------------------- inspector

  private inspectTile(index: number): void {
    if (this.mode !== 'game' && this.mode !== 'end') return;
    this.selectedTile = index;
    this.scene.setSelectedTile(index);
    sound.click();
    this.renderInspector();
  }

  private closeInspector(): void {
    this.selectedTile = null;
    this.inspector.classList.add('hidden');
    this.scene.setSelectedTile(null);
  }

  private renderInspector(): void {
    const game = this.game;
    if (!game || this.selectedTile == null) {
      this.inspector.classList.add('hidden');
      return;
    }
    const tile = TILES[this.selectedTile];
    const prop = game.state.properties[this.selectedTile];
    const owner = prop?.owner != null ? game.state.players[prop.owner] : null;
    const isProperty = tile.type === 'property';
    const kicker = isProperty
      ? `${tile.group ? GROUP_NAMES[tile.group] : 'Property'} · property`
      : tile.type === 'start'
        ? 'The beginning · start'
        : `${tile.type} tile`;
    let body = '';

    if (isProperty && prop) {
      const rent = game.rentFor(this.selectedTile);
      const value = owner ? game.propertyValue(owner, this.selectedTile) : 0;
      body = `
        <p>${owner ? `${escapeHtml(owner.name)} owns this lot.` : 'Unowned — land here to buy it.'}</p>
        <div class="inspector-stats">
          <div class="inspector-stat"><span>Price</span><strong>${money(
            buyPriceFor(this.selectedTile, game.current.careerId),
          )}</strong></div>
          <div class="inspector-stat"><span>Rent</span><strong>${money(rent)}</strong></div>
          <div class="inspector-stat"><span>Level</span><strong>${prop.level} / ${MAX_LEVEL}</strong></div>
          <div class="inspector-stat"><span>${owner ? 'Value' : 'Market'}</span><strong>${
            owner ? money(value) : `×${game.state.market.toFixed(2)}`
          }</strong></div>
        </div>
        ${
          owner
            ? `<div class="owner-chip" style="--pc:${owner.color}"><i></i>${escapeHtml(
                owner.name,
              )}</div>`
            : ''
        }
      `;
    } else {
      let detail = tile.blurb ?? '';
      if (tile.type === 'tax' && tile.tax) {
        const bits = [];
        if (tile.tax.percent) bits.push(`${Math.round(tile.tax.percent * 100)}% of cash`);
        if (tile.tax.flat) bits.push(`${money(tile.tax.flat)} minimum`);
        if (tile.tax.perProperty) bits.push(`${money(tile.tax.perProperty)} per property`);
        detail = `Pay ${bits.join(' + ')}.`;
      }
      body = `
        <p>${escapeHtml(detail)}</p>
        <div class="inspector-stats">
          <div class="inspector-stat"><span>Current cash</span><strong>${money(
            game.current.cash,
          )}</strong></div>
          <div class="inspector-stat"><span>Market</span><strong>×${game.state.market.toFixed(2)}</strong></div>
        </div>
      `;
    }

    this.inspector.classList.remove('hidden');
    this.inspector.innerHTML = `
      <div class="inspector-head">
        <div>
          <div class="inspector-kicker">${escapeHtml(kicker)}</div>
          <h3>${escapeHtml(tile.name)}</h3>
        </div>
        <button class="inspector-close" id="inspector-close" aria-label="Close tile details">${icon(
          'close',
          14,
        )}</button>
      </div>
      ${body}
    `;
    document.getElementById('inspector-close')?.addEventListener('click', () => {
      sound.click();
      this.closeInspector();
    });
  }

  // ----------------------------------------------------------------- modal

  private openModal(html: string, closable: boolean): void {
    this.modalClosable = closable;
    this.modalRoot.innerHTML = `
      <div class="modal-scrim" ${closable ? 'data-close' : ''}></div>
      ${html}
    `;
    this.modalRoot.classList.add('active');
    if (closable) {
      this.modalRoot.querySelectorAll('[data-close]').forEach((element) => {
        element.addEventListener('click', () => this.closeModal());
      });
    }
  }

  private closeModal(): void {
    this.modalRoot.classList.remove('active');
    this.modalRoot.innerHTML = '';
    this.modalClosable = false;
  }

  private openRules(): void {
    this.openModal(
      `
      <div class="modal-card">
        <div class="modal-head">
          <div>
            <div class="eyebrow">How to play</div>
            <h2>A life in six rules.</h2>
            <p>Roll, move, buy, build, and live. The player with the greatest net worth
            at retirement wins the story.</p>
          </div>
          <button class="modal-close" data-close aria-label="Close rules">${icon('close', 18)}</button>
        </div>
        <div class="rules-list">
          <div class="rule"><span class="rule-num">1</span><div><h4>Roll and move</h4><p>Roll two dice and move clockwise. Doubles earn another roll, up to two extra rolls per turn.</p></div></div>
          <div class="rule"><span class="rule-num">2</span><div><h4>Collect a payday</h4><p>Pass New Beginnings to collect your salary, plus married and family bonuses. Each lap is a new chapter of life.</p></div></div>
          <div class="rule"><span class="rule-num">3</span><div><h4>Buy the block</h4><p>Land on an unowned property to buy it. Magazine rent goes to the owner whenever a rival lands there.</p></div></div>
          <div class="rule"><span class="rule-num">4</span><div><h4>Build a home</h4><p>Land on your own property to upgrade it. Each of the three levels raises the rent — level 3 is a landmark.</p></div></div>
          <div class="rule"><span class="rule-num">5</span><div><h4>Live a little</h4><p>Life, career, family, market, and tax tiles change your fortune. Some cards offer a choice; spend and risk wisely.</p></div></div>
          <div class="rule"><span class="rule-num">6</span><div><h4>Retire on top</h4><p>The game ends after three laps or 16 rounds. Net worth = cash + property value + family legacy. Highest wins.</p></div></div>
        </div>
        <div class="rules-foot">${icon('info', 20)} Tap any tile on the board to inspect its rent, owner, and value.</div>
        <div class="modal-actions">
          <button class="btn btn-primary btn-wide" data-close>${icon('check', 17)} Got it</button>
        </div>
      </div>
    `,
      true,
    );
  }

  private openMenu(): void {
    if (!this.game || this.mode !== 'game') return;
    const game = this.game;
    const player = game.current;
    this.openModal(
      `
      <div class="modal-card">
        <div class="modal-head">
          <div>
            <div class="eyebrow">Paused</div>
            <h2>The story so far</h2>
            <p>Round ${Math.min(game.state.round, MAX_ROUNDS)} of ${MAX_ROUNDS} · ${
              chapterName(player.laps)
            } · ${escapeHtml(player.name)}'s turn.</p>
          </div>
          <button class="modal-close" data-close aria-label="Resume game">${icon('close', 18)}</button>
        </div>
        <div class="menu-grid">
          <button class="menu-item" data-close>${icon('play', 19)}<span>Resume</span><small>Back to the board</small></button>
          <button class="menu-item" id="menu-sound">${icon(this.muted ? 'mute' : 'sound', 19)}<span>Sound</span><small data-sound-label>${
            this.muted ? 'Off' : 'On'
          }</small></button>
          <button class="menu-item" id="menu-rules">${icon('help', 19)}<span>How to play</span><small>Rules &amp; tips</small></button>
          <button class="menu-item" id="menu-restart">${icon('rotate', 19)}<span>Restart story</span><small>Same players, fresh start</small></button>
          <button class="menu-item menu-item--danger" id="menu-quit">${icon('home', 19)}<span>Exit to title</span><small>Progress is saved</small></button>
        </div>
        <div class="modal-note">Milestone works fully offline. Your story stays on this device.</div>
      </div>
    `,
      true,
    );

    document.getElementById('menu-sound')?.addEventListener('click', () => {
      this.toggleSound();
      const item = document.getElementById('menu-sound');
      if (item) {
        item.innerHTML = `${icon(this.muted ? 'mute' : 'sound', 19)}<span>Sound</span><small data-sound-label>${
          this.muted ? 'Off' : 'On'
        }</small>`;
      }
    });
    document.getElementById('menu-rules')?.addEventListener('click', () => {
      this.closeModal();
      this.openRules();
    });
    document.getElementById('menu-restart')?.addEventListener('click', () => {
      this.closeModal();
      this.openConfirm(
        'Restart this story?',
        'The current game will be replaced with a fresh board and the same players.',
        'Restart',
        () => {
          this.closeModal();
          this.startGame(this.lastSetup ?? defaultSetups(3));
        },
      );
    });
    document.getElementById('menu-quit')?.addEventListener('click', () => {
      this.saveIfSafe();
      this.closeModal();
      this.showTitle();
    });
  }

  private openConfirm(
    title: string,
    text: string,
    confirmLabel: string,
    onConfirm: () => void,
  ): void {
    this.openModal(
      `
      <div class="modal-card" style="max-width:420px">
        <div class="modal-head">
          <div><div class="eyebrow">Please confirm</div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(
            text,
          )}</p></div>
          <button class="modal-close" data-close aria-label="Cancel">${icon('close', 18)}</button>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-close>Cancel</button>
          <button class="btn btn-primary" id="confirm-yes">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    `,
      true,
    );
    document.getElementById('confirm-yes')?.addEventListener('click', onConfirm);
  }

  // ------------------------------------------------------------- feedback

  private showStory(story: StoryCard): void {
    const tone =
      story.tone === 'good' ? '#5fc9a5' : story.tone === 'bad' ? '#d36767' : '#d8a441';
    this.eventToast.style.setProperty('--tone', tone);
    this.eventToast.innerHTML = `
      <span class="toast-icon">${icon(story.icon, 19)}</span>
      <div>
        <h4>${escapeHtml(story.title)}</h4>
        <p>${escapeHtml(story.text)}</p>
      </div>
    `;
    this.eventToast.classList.remove('hidden');
    if (this.storyTimer) window.clearTimeout(this.storyTimer);
    this.storyTimer = window.setTimeout(() => this.hideStory(), 4300);
  }

  private hideStory(): void {
    this.eventToast.classList.add('hidden');
    if (this.storyTimer) {
      window.clearTimeout(this.storyTimer);
      this.storyTimer = undefined;
    }
  }

  private showToast(text: string): void {
    this.toastEl.textContent = text.length > 110 ? `${text.slice(0, 107)}…` : text;
    this.toastEl.classList.remove('hidden');
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.hideToast(), 3000);
  }

  private hideToast(): void {
    this.toastEl.classList.add('hidden');
    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }
  }

  // -------------------------------------------------------------- visuals

  private sceneRollDice(dice: [number, number]): Promise<void> {
    return new Promise((resolve) => {
      this.scene.rollDice(dice, resolve);
    });
  }

  private sceneMovePawn(playerId: number, path: number[]): Promise<void> {
    return new Promise((resolve) => {
      this.scene.animatePawnMove(playerId, path, resolve);
    });
  }
}

const boot = () => {
  const start = () => {
    try {
      new MilestoneApp();
    } catch (error) {
      console.error(error);
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = `<div style="display:grid;place-items:center;height:100%;font-family:sans-serif;color:#f6edd9;text-align:center;padding:24px">
          <div><h1>Milestone</h1><p>This device could not start the 3D board.</p><p style="opacity:.6">Please update Android System WebView and try again.</p></div>
        </div>`;
      }
    }
  };
  if (document.fonts?.ready) {
    Promise.race([
      document.fonts.ready,
      new Promise((resolve) => window.setTimeout(resolve, 1800)),
    ]).then(start);
  } else {
    start();
  }
};

boot();

