import { Capacitor } from '@capacitor/core';
import { createGame, currentPlayer, deserialize, serialize, endTurn } from './engine.js';
import {
  acknowledgeCard,
  buyProperty,
  chooseOption,
  completeMove,
  passBuy,
  passUpgrade,
  rollDice,
  upgradeProperty,
} from './engine.js';
import { aiPendingAction } from './ai.js';
import { createScene } from './scene.js';
import { createUI } from './ui.js';
import { play, setMuted, unlockAudio } from './audio.js';
import { TILE_BY_ID, PLAYER_STYLES } from './data.js';

const SAVE_KEY = 'liag.save.v1';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function haptic(style = 'light') {
  if (!Capacitor.isNativePlatform()) {
    if (navigator.vibrate) navigator.vibrate(style === 'heavy' ? 18 : 8);
    return;
  }
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    const map = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
    await Haptics.impact({ style: map[style] || ImpactStyle.Light });
  } catch {
    /* Haptics are a bonus, never a requirement. */
  }
}

function inferSettings(state) {
  const humans = state.players.filter((player) => !player.isAI);
  return {
    mode: humans.length > 1 ? 'pass' : 'solo',
    count: state.players.length,
    laps: state.laps,
    players: state.players.map((player) => ({ name: player.name, isAI: player.isAI })),
  };
}

export class GameApp {
  constructor() {
    this.state = null;
    this.scene = null;
    this.ui = null;
    this.busy = false;
    this.paused = false;
    this.token = 0;
    this.savedState = null;
    this.lastSettings = null;
  }

  async boot() {
    this.ui = createUI();
    Object.assign(this.ui.handlers, {
      start: (settings) => this.startNew(settings),
      continue: () => this.continueGame(),
      roll: () => this.humanRoll(),
      end: () => this.humanEnd(),
      buy: () => this.humanBuy(),
      pass: () => this.humanPass(),
      upgrade: () => this.humanUpgrade(),
      skipUpgrade: () => this.humanSkipUpgrade(),
      ack: () => this.humanAcknowledge(),
      choose: (optionId) => this.humanChoose(optionId),
      menu: () => this.openPause(),
      resume: () => this.resume(),
      restart: () => this.restart(),
      quit: () => this.quitToMenu(),
      playAgain: () => this.startNew(this.lastSettings),
      newLife: () => this.quitToMenu(),
      center: () => this.scene?.resetView(true),
      sound: (on) => setMuted(!on),
    });

    this.scene = await createScene({
      container: document.getElementById('scene-container'),
      onTileTap: (tileId) => this.inspectTile(tileId),
    });
    this.scene.setInteractive(false);
    this.scene.setAutoRotate(true);
    this.scene.resetView(false);

    this.loadSave();
    this.ui.showStart({ continueAvailable: Boolean(this.savedState) });
    this.ui.setSound(!this.savedMuted());
    setMuted(this.savedMuted());

    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });

    setTimeout(() => this.ui.hideSplash(), 900);
  }

  savedMuted() {
    try {
      return JSON.parse(localStorage.getItem('liag.settings') || '{}').sound === false;
    } catch {
      return false;
    }
  }

  loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      const state = raw ? deserialize(raw) : null;
      if (!state || state.phase === 'ended') {
        this.savedState = null;
        return;
      }
      // A save taken mid-hop has not applied the landing yet; put the pawn back
      // in the "ready to roll" state instead of teleporting it.
      if (state.phase === 'moving') {
        state.phase = 'roll';
        state.lastRoll = null;
      }
      if (state.phase === 'action' && !state.pending) state.phase = 'end';
      this.savedState = state;
    } catch {
      this.savedState = null;
    }
  }

  save() {
    try {
      if (this.state && this.state.phase !== 'ended') {
        localStorage.setItem(SAVE_KEY, serialize(this.state));
        this.savedState = this.state;
      } else {
        localStorage.removeItem(SAVE_KEY);
        this.savedState = null;
      }
    } catch {
      /* Ignore quota/private-mode failures. */
    }
  }

  startNew(settings) {
    if (!settings) return;
    this.token += 1;
    this.paused = false;
    this.busy = false;
    this.lastSettings = {
      ...settings,
      players: settings.players || this.lastSettings?.players,
    };
    const players = (settings.players || []).map((player, index) => ({
      ...player,
      color: player.color || PLAYER_STYLES[index % PLAYER_STYLES.length].color,
      colorDark: player.colorDark || PLAYER_STYLES[index % PLAYER_STYLES.length].dark,
    }));
    this.state = createGame({
      players,
      laps: settings.laps,
      seed: Math.floor(Math.random() * 1e9),
    });
    this.lastSettings.players = this.state.players.map((player) => ({ name: player.name, isAI: player.isAI }));

    this.ui.hideStart();
    this.ui.closeModal(true);
    this.ui.setBusy(false);
    this.scene.setAutoRotate(false);
    this.scene.setInteractive(true);
    this.scene.updateState(this.state, { instant: true });
    this.scene.resetView(false);
    this.save();
    this.beginTurn();
    haptic('medium');
  }

  continueGame() {
    if (!this.savedState) return;
    this.token += 1;
    this.paused = false;
    this.busy = false;
    this.state = this.savedState;
    this.lastSettings = inferSettings(this.state);

    this.ui.hideStart();
    this.ui.closeModal(true);
    this.scene.setAutoRotate(false);
    this.scene.setInteractive(true);
    this.scene.updateState(this.state, { instant: true });
    this.scene.resetView(false);
    this.ui.render(this.state, { busy: false });
    this.scene.setActiveRing(this.state.current, this.state);
    this.scene.focusPlayer(this.state.current, this.state);

    if (this.state.phase === 'ended') {
      this.endGame();
      return;
    }
    if (this.state.pending) {
      if (currentPlayer(this.state).isAI) this.scheduleAI(700);
      else this.ui.showPending(this.state);
    } else if (currentPlayer(this.state).isAI) {
      this.scheduleAI(700);
    }
  }

  beginTurn() {
    if (!this.state || this.state.phase === 'ended') return;
    this.busy = false;
    this.ui.setBusy(false);
    this.ui.render(this.state, { busy: false });
    this.scene.updateState(this.state);
    this.scene.setActiveRing(this.state.current, this.state);
    this.scene.focusPlayer(this.state.current, this.state);
    this.save();

    const player = currentPlayer(this.state);
    if (player.isAI && !this.paused) this.scheduleAI(850);
  }

  scheduleAI(delay = 700) {
    if (this.paused) return;
    const token = this.token;
    setTimeout(() => {
      if (token !== this.token || this.paused) return;
      this.driveAI();
    }, delay);
  }

  async driveAI() {
    if (this.paused || this.busy || !this.state) return;
    const player = currentPlayer(this.state);
    if (!player || !player.isAI || this.state.phase === 'ended') return;

    if (this.state.phase === 'roll') {
      await this.performRoll(true);
      if (this.paused) return;
      await wait(550);
      if (this.paused) return;
    }

    if (this.state.pending && currentPlayer(this.state).isAI) {
      await this.resolveAI();
      if (this.paused) return;
      await wait(500);
      if (this.paused) return;
    }

    if (this.state.phase === 'end' && currentPlayer(this.state).isAI) {
      await wait(400);
      if (this.paused) return;
      await this.finishTurn(true);
    }
  }

  async performRoll(isAI = false) {
    if (this.busy || this.paused || !this.state || this.state.phase !== 'roll') return;
    const token = this.token;
    const player = currentPlayer(this.state);
    this.busy = true;
    this.ui.setBusy(true, 'Rolling');

    const { roll, path } = rollDice(this.state);
    play('dice');
    haptic('light');

    await this.scene.rollDice(roll);
    if (token !== this.token) {
      this.busy = false;
      return;
    }
    play('diceLand');
    this.ui.setBusy(true, 'Moving');
    await this.scene.movePawn(player.id, path, this.state);
    if (token !== this.token) {
      this.busy = false;
      return;
    }

    const { events } = completeMove(this.state);
    this.busy = false;
    this.ui.setBusy(false);
    this.applyEvents(events);
    this.save();
    this.ui.render(this.state, { busy: false });
    this.scene.updateState(this.state);
    this.scene.setActiveRing(player.id, this.state);
    this.scene.focusPlayer(player.id, this.state);

    if (this.state.pending && !player.isAI) {
      this.ui.showPending(this.state);
      haptic('light');
    } else if (this.state.phase === 'end' && !player.isAI) {
      this.ui.toast('Move complete. End your turn when you are ready.', '');
    }
  }

  async humanRoll() {
    if (!this.state || this.busy || this.paused) return;
    if (currentPlayer(this.state).isAI) return;
    await this.performRoll(false);
  }

  async humanEnd() {
    if (!this.state || this.busy || this.paused) return;
    if (currentPlayer(this.state).isAI) return;
    await this.finishTurn(false);
  }

  async finishTurn(isAI = false) {
    if (!this.state || this.busy || this.paused) return;
    if (this.state.phase !== 'end') return;
    this.busy = true;
    this.ui.setBusy(true, 'Ending turn');
    const { events, ended } = endTurn(this.state);
    this.applyEvents(events);
    this.busy = false;
    this.ui.setBusy(false);
    this.save();

    if (ended) {
      this.endGame();
      return;
    }
    this.beginTurn();
    if (!isAI) haptic('light');
  }

  humanBuy() {
    if (!this.state?.pending || this.state.pending.type !== 'buy') return;
    const player = currentPlayer(this.state);
    const tile = TILE_BY_ID[this.state.pending.tileId];
    const { events } = buyProperty(this.state);
    this.ui.closeModal(true);
    this.applyEvents(events);
    this.ui.toast(`${player.name} bought ${tile.name}.`, 'good');
    play('buy');
    haptic('medium');
    this.afterDecision();
  }

  humanPass() {
    if (!this.state?.pending || this.state.pending.type !== 'buy') return;
    const tile = TILE_BY_ID[this.state.pending.tileId];
    passBuy(this.state);
    this.ui.closeModal(true);
    this.ui.toast(`You passed on ${tile.name}.`, '');
    this.afterDecision();
  }

  humanUpgrade() {
    if (!this.state?.pending || this.state.pending.type !== 'upgrade') return;
    const tile = TILE_BY_ID[this.state.pending.tileId];
    const { events } = upgradeProperty(this.state);
    this.ui.closeModal(true);
    this.applyEvents(events);
    this.ui.toast(`${tile.name} upgraded. Rent is now higher.`, 'good');
    play('buy');
    haptic('medium');
    this.afterDecision();
  }

  humanSkipUpgrade() {
    if (!this.state?.pending || this.state.pending.type !== 'upgrade') return;
    passUpgrade(this.state);
    this.ui.closeModal(true);
    this.afterDecision();
  }

  humanAcknowledge() {
    if (!this.state?.pending || this.state.pending.type !== 'card') return;
    acknowledgeCard(this.state);
    this.ui.closeModal(true);
    this.afterDecision();
  }

  humanChoose(optionId) {
    if (!this.state?.pending || this.state.pending.type !== 'choice') return;
    const player = currentPlayer(this.state);
    const { events, option } = chooseOption(this.state, optionId);
    this.ui.closeModal(true);
    this.applyEvents(events);
    this.ui.toast(`${player.name} chose “${option.label}”.`, '');
    play('choice');
    this.afterDecision();
  }

  afterDecision() {
    this.save();
    this.ui.render(this.state, { busy: false });
    this.scene.updateState(this.state);
    this.scene.setActiveRing(this.state.current, this.state);
    this.scene.focusPlayer(this.state.current, this.state);
    if (this.state.phase === 'end') haptic('light');
  }

  async resolveAI() {
    if (!this.state?.pending || this.paused) return;
    const action = aiPendingAction(this.state);
    if (!action) return;
    const player = currentPlayer(this.state);
    const pending = this.state.pending;

    switch (action.type) {
      case 'buy': {
        const tile = TILE_BY_ID[pending.tileId];
        const { events } = buyProperty(this.state);
        this.applyEvents(events);
        this.ui.toast(`${player.name} bought ${tile.name}.`, '');
        break;
      }
      case 'pass': {
        passBuy(this.state);
        break;
      }
      case 'upgrade': {
        const tile = TILE_BY_ID[pending.tileId];
        const { events } = upgradeProperty(this.state);
        this.applyEvents(events);
        this.ui.toast(`${player.name} upgraded ${tile.name}.`, '');
        break;
      }
      case 'skipUpgrade':
        passUpgrade(this.state);
        break;
      case 'card':
        acknowledgeCard(this.state);
        break;
      case 'choice': {
        const { events, option } = chooseOption(this.state, action.optionId);
        this.applyEvents(events);
        this.ui.toast(`${player.name} chose “${option.label}”.`, '');
        break;
      }
      default:
        break;
    }

    this.save();
    this.ui.render(this.state, { busy: false });
    this.scene.updateState(this.state);
    this.scene.setActiveRing(this.state.current, this.state);
    this.scene.focusPlayer(this.state.current, this.state);
  }

  applyEvents(events = []) {
    for (const event of events) {
      const player = event.playerId !== undefined ? this.state.players[event.playerId] : null;
      const pos = player ? this.scene.projectTile(player.position) : null;
      switch (event.type) {
        case 'money': {
          if (!event.amount) break;
          const sign = event.amount > 0 ? '+' : '−';
          if (pos) this.ui.floater(pos.x, pos.y, `${sign}$${Math.abs(Math.round(event.amount))}`, event.amount < 0 ? 'negative' : '');
          if (player && !player.isAI) {
            this.ui.toast(`${sign}$${Math.abs(Math.round(event.amount))} ${event.reason ? `· ${event.reason}` : ''}`.trim(), event.amount > 0 ? 'good' : 'bad');
          }
          play(event.amount > 0 ? 'coin' : 'bad');
          if (event.amount > 0) this.scene.burstTile(player.position, '#FFC94A', 8, 2);
          break;
        }
        case 'happiness': {
          if (!event.amount) break;
          if (pos) this.ui.floater(pos.x, pos.y - 12, `${event.amount > 0 ? '+' : '−'}${Math.abs(event.amount)} joy`, 'joy');
          if (event.amount > 0) play('joy');
          break;
        }
        case 'salary': {
          if (pos) this.ui.floater(pos.x, pos.y, `+$${event.amount}`, '');
          this.ui.toast(`${player.name} collected $${event.amount} salary.`, 'gold');
          play('coin');
          this.scene.burstTile(player.position, '#FFD166', 12, 2.2);
          break;
        }
        case 'rent': {
          const from = this.state.players[event.fromId];
          const to = this.state.players[event.toId];
          const humanInvolved = !from.isAI || !to.isAI;
          if (humanInvolved) {
            this.ui.toast(`${from.name} paid ${to.name} $${Math.round(event.amount)} rent.`, from.isAI ? 'good' : 'bad');
          }
          const fromPos = this.scene.projectTile(from.position);
          const toPos = this.scene.projectTile(to.position);
          this.ui.floater(fromPos.x, fromPos.y, `−$${Math.round(event.amount)}`, 'negative');
          this.ui.floater(toPos.x, toPos.y, `+$${Math.round(event.amount)}`, '');
          play('rent');
          this.scene.burstTile(from.position, '#FFB4A8', 8, 1.8);
          break;
        }
        case 'buy': {
          this.scene.burstTile(event.tileId, '#9FC0FF', 14, 2.6);
          if (player?.isAI) this.ui.toast(`${player.name} bought ${TILE_BY_ID[event.tileId].name}.`, '');
          haptic('light');
          break;
        }
        case 'upgrade': {
          this.scene.burstTile(event.tileId, '#FFD166', 14, 2.6);
          haptic('light');
          break;
        }
        case 'card':
          play('card');
          break;
        case 'choice':
          play('choice');
          break;
        case 'bankrupt':
          this.ui.toast(`${this.state.players[event.playerId].name} is out of the game.`, 'bad');
          play('bankrupt');
          haptic('heavy');
          break;
        case 'retire': {
          const retired = this.state.players[event.playerId];
          this.ui.toast(`${retired.name} retires with $${Math.round(retired.cash)}.`, 'gold');
          play('retire');
          this.scene.retirePawn(event.playerId, this.state);
          break;
        }
        case 'gameover':
          break;
        default:
          break;
      }
    }
  }

  endGame() {
    if (!this.state) return;
    this.token += 1;
    this.paused = false;
    this.busy = false;
    this.ui.setBusy(false);
    this.scene.setInteractive(false);
    this.scene.setAutoRotate(true);
    this.scene.resetView(true);
    this.scene.updateState(this.state, { instant: true });
    this.scene.celebrate();
    this.ui.render(this.state, { busy: false });
    this.ui.showResults(this.state);
    play('win');
    haptic('heavy');
    this.save();
  }

  openPause() {
    if (!this.state || this.state.phase === 'ended') return;
    this.paused = true;
    this.ui.showPause();
    this.scene.setInteractive(false);
  }

  resume() {
    if (!this.state) return;
    this.paused = false;
    this.scene.setInteractive(true);
    this.ui.render(this.state, { busy: false });
    if (this.state.pending && !currentPlayer(this.state).isAI) {
      this.ui.showPending(this.state);
    } else if (currentPlayer(this.state).isAI) {
      this.scheduleAI(500);
    }
  }

  restart() {
    if (!this.lastSettings) return;
    this.ui.closeModal(true);
    this.startNew(this.lastSettings);
  }

  quitToMenu() {
    this.token += 1;
    this.paused = false;
    this.busy = false;
    this.save();
    this.state = null;
    this.loadSave();
    this.ui.closeModal(true);
    this.ui.setBusy(false);
    this.scene.setInteractive(false);
    this.scene.setAutoRotate(true);
    this.scene.resetView(true);
    this.ui.showStart({ continueAvailable: Boolean(this.savedState) });
  }

  inspectTile(tileId) {
    if (!this.state || this.paused || this.busy) return;
    if (this.ui.activeModal) return;
    this.ui.showInspect(tileId);
  }
}
