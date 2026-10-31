import { CARDS, DISTRICTS, GOAL_BY_ID, RULES, TILE_BY_ID } from './data.js';
import { choiceFor, goalProgress, scorePlayer } from './engine.js';
import { iconDataURL } from './icons.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const CARDS_BY_ID = Object.fromEntries(CARDS.map((card) => [card.id, card]));
const ICON_CACHE = new Map();
function iconURL(name, color, size = 96) {
  const key = `${name}|${color}|${size}`;
  if (!ICON_CACHE.has(key)) ICON_CACHE.set(key, iconDataURL(name, color, size));
  return ICON_CACHE.get(key);
}

const SPEAKER_ON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;
const SPEAKER_OFF = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 5m0-5-5 5"/></svg>`;
const DIE_SVG = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="14" fill="#FFF7E8" stroke="#D9BE93" stroke-width="3"/><circle cx="21" cy="21" r="4.5" fill="#2B3044"/><circle cx="43" cy="21" r="4.5" fill="#2B3044"/><circle cx="32" cy="32" r="4.5" fill="#2B3044"/><circle cx="21" cy="43" r="4.5" fill="#2B3044"/><circle cx="43" cy="43" r="4.5" fill="#2B3044"/></svg>`;
const MENU_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
const CENTER_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/><circle cx="12" cy="12" r="2.5"/></svg>`;

const DEFAULT_SETTINGS = { mode: 'solo', count: 3, laps: 3, sound: true };

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('liag.settings') || '{}') };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem('liag.settings', JSON.stringify(settings));
  } catch {
    /* Storage can be unavailable in private mode. */
  }
}

function money(n) {
  const rounded = Math.round(n);
  return `$${rounded.toLocaleString('en-US')}`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

function initial(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

export function playerRoster({ mode, count }) {
  if (mode === 'pass') {
    return [
      { name: 'Player 1', isAI: false },
      { name: 'Player 2', isAI: false },
    ];
  }
  const aiNames = ['Maya', 'Leo', 'Iris'];
  return [{ name: 'You', isAI: false }, ...aiNames.slice(0, Math.max(1, count - 1)).map((name) => ({ name, isAI: true }))];
}

export function createUI() {
  const root = $('#ui');
  const settings = loadSettings();
  const handlers = {};
  let soundOn = settings.sound !== false;
  let state = null;
  let busy = false;
  let busyLabel = '';
  let pendingKey = '';
  let activeModal = null;
  let splashHidden = false;
  let lastTurnKey = '';
  let logSignature = '';

  root.innerHTML = `
    <div id="splash">
      <div class="splash-inner">
        <div class="splash-logo">L</div>
        <h1>Life is a Game</h1>
        <p>Build a life · beat your friends</p>
        <div class="splash-bar"><i></i></div>
      </div>
    </div>

    <div id="start-screen" class="hidden">
      <div class="start-top">
        <div class="brand-lockup">
          <div class="brand-mark">L</div>
          <div class="brand-text">
            <strong>LIFE IS A GAME</strong>
            <span>A 3D board game about being alive</span>
          </div>
        </div>
        <button class="sound-toggle" data-action="sound" aria-label="Toggle sound">
          <span class="dot"></span><span class="sound-label">Sound on</span>
        </button>
      </div>

      <div class="start-main">
        <section class="hero">
          <div class="hero-kicker">Buy a home · find love · retire happy</div>
          <h1>
            <span class="line">LIFE</span>
            <span class="line outline">IS A</span>
            <span class="line accent">GAME.</span>
          </h1>
          <p>Roll the die, travel through childhood, career, family and adventure, and build a life worth more than money.</p>
          <div class="hero-badges">
            <span>3D board</span>
            <span>2–4 players</span>
            <span>10–15 min</span>
            <span>No ads</span>
          </div>
        </section>

        <section class="setup-card" aria-label="Game setup">
          <h2>Start a new life</h2>
          <p class="sub">A little Monopoly, a little Game of Life, and a lot of choices.</p>

          <div class="field">
            <div class="field-label"><span>Play mode</span></div>
            <div class="segmented" id="mode-seg">
              <button data-mode="solo">Solo vs CPU</button>
              <button data-mode="pass">Pass &amp; play</button>
            </div>
          </div>

          <div class="field" id="count-field">
            <div class="field-label"><span>Players</span><span id="count-note">You + 2 friends</span></div>
            <div class="segmented" id="count-seg">
              <button data-count="2">2</button>
              <button data-count="3">3</button>
              <button data-count="4">4</button>
            </div>
          </div>

          <div class="field">
            <div class="field-label"><span>Life length</span></div>
            <div class="segmented" id="laps-seg">
              <button data-laps="2">Quick · 2 ch.</button>
              <button data-laps="3">Classic · 3 ch.</button>
            </div>
          </div>

          <div class="setup-actions">
            <button class="btn" data-action="start">Begin your life</button>
            <button class="btn continue-btn hidden" data-action="continue">Continue your life</button>
            <button class="btn secondary" data-action="how">How to play</button>
          </div>
        </section>
      </div>

      <div class="start-footer">
        <span>Made with care · works offline · no ads · no tracking</span>
        <span>v1.0</span>
      </div>
    </div>

    <div id="hud" class="hidden">
      <div class="hud-top">
        <div class="hud-brand">
          <div class="brand-mark">L</div>
          <div class="brand-text">
            <strong>LIFE IS A GAME</strong>
            <span>Build a life</span>
          </div>
        </div>
        <div class="chapter-pill" id="chapter-pill"></div>
        <div class="hud-actions">
          <button class="icon-btn" data-action="sound" aria-label="Toggle sound"></button>
          <button class="icon-btn" data-action="center" aria-label="Center board">${CENTER_SVG}</button>
          <button class="icon-btn" data-action="menu" aria-label="Menu">${MENU_SVG}</button>
        </div>
      </div>

      <div class="mobile-players" id="mobile-players"></div>

      <div class="players-panel" id="players-panel"></div>

      <div class="hud-main">
        <div class="center-column">
          <div class="turn-banner" id="turn-banner"></div>
          <div class="log-panel" id="log-panel"></div>
        </div>
        <div class="side-panel" id="side-panel"></div>
      </div>

      <div class="hud-bottom">
        <div class="dock" id="dock">
          <div class="die-preview">${DIE_SVG}</div>
          <button class="btn roll-btn" data-action="roll">ROLL THE DIE</button>
          <button class="btn end-btn hidden" data-action="end">END TURN</button>
          <div class="hint" id="dock-hint"></div>
        </div>
      </div>
    </div>

    <div id="toasts" aria-live="polite"></div>
    <div id="floaters"></div>
    <div id="modal-root"></div>
    <div id="confetti"></div>
  `;

  const startScreen = $('#start-screen');
  const hud = $('#hud');
  const modalRoot = $('#modal-root');
  const toasts = $('#toasts');
  const floaters = $('#floaters');
  const confettiLayer = $('#confetti');

  // -------------------------------------------------------------------------
  // Setup screen
  // -------------------------------------------------------------------------
  function renderSetup() {
    $$('#mode-seg button').forEach((button) => button.classList.toggle('active', button.dataset.mode === settings.mode));
    $$('#count-seg button').forEach((button) => button.classList.toggle('active', Number(button.dataset.count) === settings.count));
    $$('#laps-seg button').forEach((button) => button.classList.toggle('active', Number(button.dataset.laps) === settings.laps));
    $('#count-field').classList.toggle('hidden', settings.mode === 'pass');
    const opponents = Math.max(1, settings.count - 1);
    $('#count-note').textContent =
      settings.mode === 'pass' ? 'Two humans, one device' : `You + ${opponents} ${opponents === 1 ? 'friend' : 'friends'}`;
  }

  function setSound(on) {
    soundOn = on;
    settings.sound = on;
    saveSettings(settings);
    $$('.sound-toggle').forEach((button) => {
      button.classList.toggle('off', !on);
      button.innerHTML = `<span class="dot"></span><span class="sound-label">Sound ${on ? 'on' : 'off'}</span>`;
    });
    $$('.hud-actions .icon-btn[data-action="sound"]').forEach((button) => {
      button.innerHTML = on ? SPEAKER_ON : SPEAKER_OFF;
    });
  }

  function setContinueAvailable(available) {
    $$('[data-action="continue"]').forEach((button) => button.classList.toggle('hidden', !available));
  }

  function showStart({ continueAvailable = false } = {}) {
    closeModal(true);
    hud.classList.add('hidden');
    startScreen.classList.remove('hidden');
    setContinueAvailable(continueAvailable);
    renderSetup();
    setSound(soundOn);
    lastTurnKey = '';
    logSignature = '';
  }

  function hideStart() {
    startScreen.classList.add('hidden');
    hud.classList.remove('hidden');
  }

  // -------------------------------------------------------------------------
  // HUD
  // -------------------------------------------------------------------------
  function playerTag(player) {
    if (player.bankrupt) return 'OUT';
    if (player.retired) return 'RETIRED';
    if (player.isAI) return 'CPU';
    return state?.players.filter((p) => !p.isAI).length > 1 ? `P${player.id + 1}` : 'YOU';
  }

  function goalLine(player) {
    const goal = GOAL_BY_ID[player.goal];
    if (!goal) return '';
    const progress = goalProgress(state, player);
    return `<div class="player-goal ${progress.met ? 'met' : ''}" title="${escapeHtml(goal.desc)}"><b>${escapeHtml(goal.name)}</b> · ${escapeHtml(progress.text)}</div>`;
  }

  function renderPlayerCards() {
    const panel = $('#players-panel');
    panel.innerHTML = state.players
      .map((player) => {
        const active = player.id === state.current && state.phase !== 'ended';
        const tag = playerTag(player);
        return `
          <div class="player-card ${active ? 'active' : ''} ${player.retired || player.bankrupt ? 'retired' : ''}" style="--player-color:${player.color}">
            <div class="player-avatar">${initial(player.name)}</div>
            <div>
              <div class="p-name">${escapeHtml(player.name)} <span class="tag">${tag}</span></div>
              <div class="player-stats">
                <span class="cash">${money(player.cash)}</span>
                <span class="joy"><span class="joy-bar"><i style="width:${player.happiness}%"></i></span>${player.happiness}</span>
              </div>
              ${goalLine(player)}
            </div>
          </div>
        `;
      })
      .join('');

    const mobile = $('#mobile-players');
    mobile.innerHTML = state.players
      .map((player) => {
        const active = player.id === state.current && state.phase !== 'ended';
        return `
          <div class="m-player ${active ? 'active' : ''} ${player.retired || player.bankrupt ? 'retired' : ''}" style="--player-color:${player.color}">
            <div class="m-avatar">${initial(player.name)}</div>
            <div class="m-info">
              <span class="m-name">${escapeHtml(player.name)}</span>
              <span class="m-cash">${money(player.cash)}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function renderChapter() {
    const active = state.players[state.current];
    const chapter = Math.min(active.laps + 1, state.laps);
    const dots = Array.from({ length: state.laps }, (_, i) => {
      return `<span class="chapter-dot ${i < active.laps ? 'done' : ''}"></span>`;
    }).join('');
    $('#chapter-pill').innerHTML = `<span>Chapter ${chapter} / ${state.laps}</span><span class="chapter-dots">${dots}</span>`;
  }

  function renderTurnBanner() {
    const player = state.players[state.current];
    if (!player) return;
    const key = `${state.turn}:${state.current}`;
    if (key === lastTurnKey) return;
    lastTurnKey = key;
    const banner = $('#turn-banner');
    const isHuman = !player.isAI;
    banner.style.setProperty('--player-color', player.color);
    banner.innerHTML = `<span class="dot"></span><span>${isHuman ? (state.players.filter((p) => !p.isAI).length > 1 ? `${escapeHtml(player.name)}'s turn` : 'Your turn') : `${escapeHtml(player.name)}'s turn`}</span>`;
    banner.classList.remove('enter');
    void banner.offsetWidth;
    banner.classList.add('enter');
  }

  function renderLog() {
    const entries = state.log.slice(-4);
    const signature = entries.map((e) => e.id).join(',');
    if (signature === logSignature) return;
    logSignature = signature;
    $('#log-panel').innerHTML = entries
      .map(
        (entry) =>
          `<div class="log-entry ${entry.kind}"><span class="log-dot"></span><span>${escapeHtml(entry.text)}</span></div>`,
      )
      .join('');
  }

  function renderSidePanel() {
    const player = state.players[state.current];
    if (!player) return;
    const goal = GOAL_BY_ID[player.goal];
    const progress = goalProgress(state, player);
    const tip =
      player.cash > 900
        ? 'Landing on your own property lets you upgrade it. Higher levels mean much bigger rent.'
        : 'Complete a whole colour group to double the rent on every property in it.';
    $('#side-panel').innerHTML = `
      <div class="side-note">
        <strong>${player.isAI ? `${escapeHtml(player.name)}'s life goal` : 'Your life goal'}</strong>
        ${goal ? `${escapeHtml(goal.name)} — ${escapeHtml(goal.desc)}` : ''}
        <div style="margin-top:6px;color:${progress.met ? '#1f7a5c' : '#8a7a63'};font-weight:800">${escapeHtml(progress.text)}</div>
      </div>
      <div class="side-note"><strong>Little tip</strong>${escapeHtml(tip)}</div>
    `;
  }

  function renderDock() {
    const player = state.players[state.current];
    const roll = $('.roll-btn');
    const end = $('.end-btn');
    const hint = $('#dock-hint');
    const dock = $('#dock');
    if (!player || state.phase === 'ended') {
      roll.classList.add('hidden');
      end.classList.add('hidden');
      hint.textContent = '';
      return;
    }

    const isHuman = !player.isAI;
    const thinking = !isHuman;

    if (busy) {
      roll.classList.remove('hidden');
      end.classList.add('hidden');
      roll.disabled = true;
      roll.innerHTML = `<span class="thinking">${escapeHtml(busyLabel || 'One moment')}<i></i><i></i><i></i></span>`;
      hint.textContent = '';
      dock.classList.add('busy');
      return;
    }

    dock.classList.remove('busy');
    if (state.phase === 'roll') {
      if (thinking) {
        roll.classList.remove('hidden');
        end.classList.add('hidden');
        roll.disabled = true;
        roll.innerHTML = `<span class="thinking">${escapeHtml(player.name)} is thinking<i></i><i></i><i></i></span>`;
        hint.textContent = 'Watch the board.';
      } else {
        roll.classList.remove('hidden');
        end.classList.add('hidden');
        roll.disabled = false;
        roll.innerHTML = 'ROLL THE DIE';
        hint.textContent = 'Tap the board to inspect a tile.';
      }
      return;
    }

    if (state.phase === 'action') {
      roll.classList.remove('hidden');
      end.classList.add('hidden');
      roll.disabled = true;
      roll.innerHTML = 'MAKE A CHOICE';
      hint.textContent = '';
      return;
    }

    if (state.phase === 'end') {
      roll.classList.add('hidden');
      end.classList.remove('hidden');
      end.disabled = !isHuman;
      hint.textContent = isHuman ? 'That is your move. Ready for the next chapter?' : '';
      return;
    }

    roll.classList.remove('hidden');
    end.classList.add('hidden');
    roll.disabled = true;
    roll.innerHTML = 'ROLLING…';
    hint.textContent = '';
  }

  function render(nextState, options = {}) {
    state = nextState;
    if (!state) return;
    if (typeof options.busy === 'boolean') busy = options.busy;
    if (options.busyLabel !== undefined) busyLabel = options.busyLabel;
    renderPlayerCards();
    renderChapter();
    renderTurnBanner();
    renderLog();
    renderSidePanel();
    renderDock();
  }

  function setBusy(value, label = '') {
    busy = value;
    busyLabel = label;
    if (state) renderDock();
  }

  // -------------------------------------------------------------------------
  // Modals
  // -------------------------------------------------------------------------
  function closeModal(immediate = false) {
    if (!activeModal) return;
    const { wrap, backdrop } = activeModal;
    activeModal = null;
    if (immediate) {
      wrap.remove();
      backdrop.remove();
      return;
    }
    wrap.classList.remove('show');
    backdrop.classList.remove('show');
    setTimeout(() => {
      wrap.remove();
      backdrop.remove();
    }, 220);
  }

  function openModal(html, { kind = 'generic', wide = false, closable = true, onClose = null } = {}) {
    closeModal(true);
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    const wrap = document.createElement('div');
    wrap.className = `modal ${wide ? 'wide' : ''}`;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = html;
    if (closable) {
      const close = document.createElement('button');
      close.className = 'modal-close';
      close.setAttribute('data-close', '');
      close.setAttribute('aria-label', 'Close');
      close.innerHTML = '✕';
      wrap.appendChild(close);
    }
    modalRoot.append(backdrop, wrap);
    requestAnimationFrame(() => {
      backdrop.classList.add('show');
      wrap.classList.add('show');
    });
    const modal = { wrap, backdrop, kind, onClose };
    activeModal = modal;
    wrap.addEventListener('click', (event) => {
      if (event.target.closest('[data-close]')) {
        closeModal();
        onClose?.();
      }
    });
    backdrop.addEventListener('click', () => {
      if (!closable) return;
      closeModal();
      onClose?.();
    });
    return wrap;
  }

  function deedModal(tile, own, player, mode) {
    const district = DISTRICTS[tile.district];
    const owner = own ? state.players[own.owner] : null;
    const rent = tile.rent;
    const upgradeCost = mode === 'upgrade' && own ? Math.round((tile.price * [0.5, 0.8][own.level - 1]) / 10) * 10 : 0;
    const canAfford = mode === 'buy' ? player.cash >= tile.price : player.cash >= upgradeCost;
    const priceLabel = mode === 'buy' ? money(tile.price) : money(upgradeCost);
    const badge = mode === 'buy' ? 'For sale' : `Level ${own?.level || 1} → ${Math.min(3, (own?.level || 1) + 1)}`;
    const rentRows = rent
      .map(
        (value, index) =>
          `<div class="deed-row"><span>Level ${index + 1} rent</span><b class="${index + 1 === (own?.level || 0) ? 'rent' : ''}">${money(value)}</b></div>`,
      )
      .join('');
    const note =
      mode === 'buy'
        ? `Own all ${DISTRICTS[tile.district].name} properties to double every rent in the group.`
        : `Upgrading raises the rent from ${money(rent[(own?.level || 1) - 1])} to ${money(rent[Math.min(2, own?.level || 1)])}.`;
    const actions =
      mode === 'buy'
        ? `<button class="btn" data-action="buy" ${canAfford ? '' : 'disabled'}>Buy for ${money(tile.price)}</button>
           <button class="btn secondary" data-action="pass">Pass</button>`
        : `<button class="btn" data-action="upgrade" ${canAfford ? '' : 'disabled'}>Upgrade for ${money(upgradeCost)}</button>
           <button class="btn secondary" data-action="skipUpgrade">Not now</button>`;
    return `
      <div class="deed">
        <div class="deed-head" style="background:linear-gradient(135deg, ${district.color}, ${district.dark})">
          <div class="kicker">${district.name} · ${mode === 'buy' ? 'Property' : 'Your property'}</div>
          <h2>${escapeHtml(tile.name)}</h2>
          <div class="price">${priceLabel}</div>
        </div>
        <div class="deed-body">
          <span class="deed-badge ${owner ? 'owned' : ''}">${badge}</span>
          ${rentRows}
          <div class="deed-row"><span>Full group bonus</span><b>×2 rent</b></div>
          <div class="deed-note">${escapeHtml(note)}<br><strong>You have ${money(player.cash)}.</strong></div>
          <div class="modal-actions">${actions}</div>
        </div>
      </div>
    `;
  }

  function cardModal(card) {
    const pills = [];
    if (card.cash) pills.push(`<span class="effect-pill ${card.cash > 0 ? 'good' : 'bad'}">${card.cash > 0 ? '+' : '−'}${money(Math.abs(card.cash))}</span>`);
    if (card.salary) pills.push(`<span class="effect-pill ${card.salary > 0 ? 'good' : 'bad'}">${card.salary > 0 ? '+' : '−'}${money(Math.abs(card.salary))} salary</span>`);
    if (card.happiness) pills.push(`<span class="effect-pill ${card.happiness > 0 ? 'joy' : 'bad'}">${card.happiness > 0 ? '+' : '−'}${Math.abs(card.happiness)} happiness</span>`);
    return `
      <div class="event-card">
        <div class="event-icon"><img src="${iconURL(card.icon, '#8A5A00', 128)}" alt="" /></div>
        <div class="kicker">Life happens</div>
        <h2>${escapeHtml(card.title)}</h2>
        <p class="event-text">${escapeHtml(card.text)}</p>
        <div class="effect-pills">${pills.join('')}</div>
        <div class="modal-actions"><button class="btn" data-action="ack">Continue</button></div>
      </div>
    `;
  }

  function choiceModal(choice, player) {
    const options = choice.options
      .map((option) => {
        const affordable = !option.cost || player.cash >= option.cost;
        const number = choice.options.indexOf(option) + 1;
        return `
          <button class="choice-option ${affordable ? '' : 'cant-afford'}" data-option="${option.id}" ${affordable ? '' : 'disabled'}>
            <span class="opt-icon">${number}</span>
            <span class="opt-main">
              <span class="opt-label">${escapeHtml(option.label)}</span>
              <span class="opt-detail">${escapeHtml(option.detail)}${affordable ? '' : ' · not enough cash'}</span>
            </span>
            <span class="opt-arrow">›</span>
          </button>
        `;
      })
      .join('');
    return `
      <div class="choice-card">
        <div class="choice-head">
          <div class="choice-icon"><img src="${iconURL(choice.icon, '#8A5A00', 96)}" alt="" /></div>
          <div>
            <div class="kicker" style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#b0821d">Milestone</div>
            <h2>${escapeHtml(choice.title)}</h2>
          </div>
        </div>
        <p class="modal-sub">${escapeHtml(choice.prompt)}</p>
        <div class="choice-options">${options}</div>
        <div class="deed-note" style="margin-top:14px">You have ${money(player.cash)} in cash. Every path has a trade-off.</div>
      </div>
    `;
  }

  function showPending(nextState) {
    state = nextState;
    if (!state || !state.pending) {
      pendingKey = '';
      if (activeModal && ['buy', 'upgrade', 'card', 'choice'].includes(activeModal.kind)) closeModal(true);
      return;
    }
    const player = state.players[state.pending.playerId];
    if (!player || player.isAI) return;
    const key = `${state.pending.type}:${state.pending.tileId || ''}:${state.pending.cardId || ''}:${state.pending.choiceId || ''}:${state.turn}`;
    if (key === pendingKey && activeModal) return;

    if (state.pending.type === 'buy') {
      const tile = TILE_BY_ID[state.pending.tileId];
      openModal(deedModal(tile, null, player, 'buy'), { kind: 'buy', closable: false });
    } else if (state.pending.type === 'upgrade') {
      const tile = TILE_BY_ID[state.pending.tileId];
      openModal(deedModal(tile, state.owners[tile.id], player, 'upgrade'), { kind: 'upgrade', closable: false });
    } else if (state.pending.type === 'card') {
      const card = state.pending.cardId;
      // Card data lives in data.js; import lazily through the pending card id.
      const cardData = CARDS_BY_ID[card];
      if (cardData) openModal(cardModal(cardData), { kind: 'card', closable: false });
    } else if (state.pending.type === 'choice') {
      const choice = choiceFor(state, state.pending.choiceId, player);
      openModal(choiceModal(choice, player), { kind: 'choice', closable: false });
    }
    pendingKey = key;
  }

  // -------------------------------------------------------------------------
  // Results, pause, rules, inspect
  // -------------------------------------------------------------------------
  function showResults(nextState) {
    state = nextState;
    const results = state.results || [];
    const winner = results[0];
    const winnerPlayer = state.players[winner?.playerId];
    const breakdown = winnerPlayer ? scorePlayer(state, winnerPlayer) : null;
    const rows = results
      .map((result, index) => {
        const player = state.players[result.playerId];
        return `
          <div class="rank-row ${index === 0 ? 'winner' : ''}" style="--player-color:${player.color}">
            <div class="rank">${index + 1}</div>
            <div class="avatar">${initial(player.name)}</div>
            <div>
              <div class="r-name">${escapeHtml(player.name)}</div>
              <div class="r-detail">${money(result.cash)} cash · ${money(result.assets)} assets · ${result.happiness / 8} joy</div>
            </div>
            <div class="r-score">${result.total}</div>
          </div>
        `;
      })
      .join('');
    const breakdownHtml = breakdown
      ? `
        <div class="breakdown">
          <h3>How ${escapeHtml(winnerPlayer.name)} scored</h3>
          <div class="breakdown-grid">
            <div class="breakdown-row"><span>Cash</span><b>${money(breakdown.cash)}</b></div>
            <div class="breakdown-row"><span>Assets</span><b>${money(breakdown.assets)}</b></div>
            <div class="breakdown-row"><span>Happiness</span><b>${money(breakdown.happiness)}</b></div>
            <div class="breakdown-row"><span>Family</span><b>${money(breakdown.family)}</b></div>
            <div class="breakdown-row"><span>Life goal</span><b>${breakdown.goalMet ? money(breakdown.goal) : '—'}</b></div>
            <div class="breakdown-row"><span>Retirement</span><b>${money(breakdown.retirement)}</b></div>
            <div class="breakdown-row total"><span>Life score</span><b>${breakdown.total}</b></div>
          </div>
        </div>
      `
      : '';
    openModal(
      `
      <div class="results">
        <div class="results-head">
          <div class="crown">♛</div>
          <h2>${escapeHtml(winnerPlayer?.name || 'Someone')} wins at life</h2>
          <p>${winner?.goalMet ? 'They even pulled off their secret life goal.' : 'A life well lived — and a score to prove it.'}</p>
        </div>
        <div class="ranking">${rows}</div>
        ${breakdownHtml}
        <div class="results-actions">
          <button class="btn" data-action="playAgain">Play again</button>
          <button class="btn secondary" data-action="newLife">New life</button>
        </div>
      </div>
      `,
      { kind: 'results', wide: true, closable: false },
    );
    confetti();
  }

  function showPause() {
    if (!state) return;
    const player = state.players[state.current];
    openModal(
      `
      <div class="pause-card">
        <div class="logo-row">
          <div class="brand-mark">L</div>
          <div>
            <h2>Paused</h2>
            <p class="modal-sub" style="margin:2px 0 0">${escapeHtml(player?.name || '')} · chapter ${Math.min((player?.laps || 0) + 1, state.laps)} of ${state.laps}</p>
          </div>
        </div>
        <div class="pause-actions">
          <button class="btn" data-action="resume">Keep playing</button>
          <button class="btn secondary" data-action="restart">Restart this life</button>
          <button class="btn secondary" data-action="how">How to play</button>
          <button class="btn danger" data-action="quit">Leave to main menu</button>
        </div>
        <div class="pause-meta"><span>Turn ${state.turn}</span><span>Autosaved on this device</span></div>
      </div>
      `,
      { kind: 'pause', closable: true },
    );
  }

  function showRules() {
    const rules = RULES.map(
      (rule) => `
        <div class="rule">
          <div class="rule-icon"><img src="${iconURL(rule.icon, '#8A5A00', 96)}" alt="" /></div>
          <div><strong>${escapeHtml(rule.title)}</strong><p>${escapeHtml(rule.text)}</p></div>
        </div>
      `,
    ).join('');
    openModal(
      `
      <div class="modal-pad">
        <h2>How to play</h2>
        <p class="modal-sub">Roll, travel, choose, and build a life. The highest life score after the final chapter wins.</p>
        <div class="rules-list">${rules}</div>
        <div class="modal-actions">
          <button class="btn" data-close>Got it</button>
        </div>
      </div>
      `,
      { kind: 'rules', closable: true },
    );
  }

  function showInspect(tileId) {
    if (!state) return;
    if (activeModal) return;
    const tile = TILE_BY_ID[tileId];
    if (!tile) return;
    const district = DISTRICTS[tile.district];
    const own = state.owners[tileId];
    const owner = own ? state.players[own.owner] : null;
    let rows = '';
    if (tile.type === 'property') {
      rows = tile.rent
        .map((value, index) => `<div class="deed-row"><span>Level ${index + 1} rent</span><b>${money(value)}${index + 1 === own?.level ? ' · current' : ''}</b></div>`)
        .join('');
      rows += `<div class="deed-row"><span>Price</span><b>${money(tile.price)}</b></div>`;
      rows += `<div class="deed-row"><span>Owner</span><b>${owner ? escapeHtml(owner.name) + ` · level ${own.level}` : 'For sale'}</b></div>`;
    } else {
      rows = `<div class="deed-row"><span>Type</span><b>${tile.type === 'choice' ? 'Milestone choice' : tile.type === 'event' ? 'Life event' : tile.type === 'bonus' ? 'Bonus' : tile.type === 'rest' ? 'Rest' : tile.type === 'start' ? 'Start' : 'Milestone'}</b></div>`;
    }
    openModal(
      `
      <div class="deed inspect-card">
        <div class="deed-head" style="background:linear-gradient(135deg, ${district.color}, ${district.dark})">
          <div class="kicker">${district.name}</div>
          <h2>${escapeHtml(tile.name)}</h2>
        </div>
        <div class="inspect-body">
          <p class="modal-sub" style="margin-bottom:12px">${escapeHtml(tile.blurb)}</p>
          ${rows}
          <div class="modal-actions"><button class="btn secondary" data-close>Close</button></div>
        </div>
      </div>
      `,
      { kind: 'inspect', closable: true },
    );
  }

  // -------------------------------------------------------------------------
  // Toasts, floaters, confetti
  // -------------------------------------------------------------------------
  function toast(text, tone = '') {
    const element = document.createElement('div');
    element.className = `toast ${tone}`;
    element.textContent = text;
    toasts.appendChild(element);
    while (toasts.children.length > 3) toasts.firstElementChild.remove();
    setTimeout(() => {
      element.classList.add('out');
      setTimeout(() => element.remove(), 320);
    }, 2600);
  }

  function floater(x, y, text, tone = '') {
    const element = document.createElement('div');
    element.className = `floater ${tone}`;
    element.textContent = text;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    floaters.appendChild(element);
    setTimeout(() => element.remove(), 1500);
  }

  function confetti() {
    const colors = ['#FFC94A', '#FF7A6B', '#35C4B5', '#9C7BF3', '#59C08A', '#F08BAD', '#FFF6E6'];
    for (let i = 0; i < 90; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = `${2.2 + Math.random() * 2.2}s`;
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.width = `${5 + Math.random() * 7}px`;
      piece.style.height = `${9 + Math.random() * 10}px`;
      piece.style.opacity = `${0.7 + Math.random() * 0.3}`;
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 5200);
    }
  }

  // -------------------------------------------------------------------------
  // Splash
  // -------------------------------------------------------------------------
  function hideSplash() {
    if (splashHidden) return;
    splashHidden = true;
    const splash = $('#splash');
    if (!splash) return;
    splash.classList.add('done');
    setTimeout(() => splash.remove(), 700);
  }

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------
  root.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-mode]');
    if (modeButton) {
      settings.mode = modeButton.dataset.mode;
      saveSettings(settings);
      renderSetup();
      return;
    }
    const countButton = event.target.closest('[data-count]');
    if (countButton) {
      settings.count = Number(countButton.dataset.count);
      saveSettings(settings);
      renderSetup();
      return;
    }
    const lapsButton = event.target.closest('[data-laps]');
    if (lapsButton) {
      settings.laps = Number(lapsButton.dataset.laps);
      saveSettings(settings);
      renderSetup();
      return;
    }
    const optionButton = event.target.closest('[data-option]');
    if (optionButton) {
      handlers.choose?.(optionButton.dataset.option);
      return;
    }
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    switch (action) {
      case 'start':
        handlers.start?.({
          mode: settings.mode,
          count: settings.mode === 'pass' ? 2 : settings.count,
          laps: settings.laps,
          players: playerRoster(settings),
          sound: soundOn,
        });
        break;
      case 'continue':
        handlers.continue?.();
        break;
      case 'how':
        showRules();
        break;
      case 'sound':
        setSound(!soundOn);
        handlers.sound?.(soundOn);
        break;
      case 'roll':
        handlers.roll?.();
        break;
      case 'end':
        handlers.end?.();
        break;
      case 'buy':
        handlers.buy?.();
        break;
      case 'pass':
        handlers.pass?.();
        break;
      case 'upgrade':
        handlers.upgrade?.();
        break;
      case 'skipUpgrade':
        handlers.skipUpgrade?.();
        break;
      case 'ack':
        handlers.ack?.();
        break;
      case 'menu':
        handlers.menu?.();
        break;
      case 'center':
        handlers.center?.();
        break;
      case 'resume':
        closeModal();
        handlers.resume?.();
        break;
      case 'restart':
        closeModal();
        handlers.restart?.();
        break;
      case 'quit':
        closeModal();
        handlers.quit?.();
        break;
      case 'playAgain':
        closeModal();
        handlers.playAgain?.();
        break;
      case 'newLife':
        closeModal();
        handlers.newLife?.();
        break;
      default:
        break;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (activeModal && ['pause', 'rules', 'inspect'].includes(activeModal.kind)) {
        const kind = activeModal.kind;
        closeModal();
        if (kind === 'pause') handlers.resume?.();
      }
      return;
    }
    if (event.code === 'Space' || event.key === 'Enter') {
      if (!state || activeModal) return;
      if (state.phase === 'roll' && !state.players[state.current].isAI && !busy) {
        event.preventDefault();
        handlers.roll?.();
      } else if (state.phase === 'end' && !state.players[state.current].isAI && !busy) {
        event.preventDefault();
        handlers.end?.();
      }
    }
  });

  setSound(soundOn);

  return {
    handlers,
    showStart,
    hideStart,
    setContinueAvailable,
    render,
    setBusy,
    showPending,
    closeModal,
    toast,
    floater,
    showResults,
    showPause,
    showRules,
    showInspect,
    hideSplash,
    confetti,
    setSound,
    get settings() {
      return settings;
    },
    get soundOn() {
      return soundOn;
    },
    get activeModal() {
      return activeModal;
    },
  };
}
