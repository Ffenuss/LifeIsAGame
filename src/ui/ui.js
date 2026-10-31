import {
  DISTRICTS,
  GAME,
  PLAYER_BLUEPRINTS,
  PROPERTIES,
  TILES,
  LEVEL_LABEL,
  levelRent
} from '../game/constants.js'
import { netWorth, ownedColonies } from '../game/state.js'
import { audio } from '../render/audio.js'

const TOKEN_GLYPHS = { sprout: '✿', koi: '◉', ember: '▲', moth: '✦' }
const TOKEN_NAMES = { sprout: 'Sprout', koi: 'Koi', ember: 'Ember', moth: 'Moth' }
const SETTINGS_KEY = 'life-estate-settings-v1'
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`

function readSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    return {
      sound: parsed.sound !== false,
      haptics: parsed.haptics !== false,
      battery: parsed.battery === true,
      motion: parsed.motion === true
    }
  } catch {
    return { sound: true, haptics: true, battery: false, motion: false }
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* ignore */
  }
}

export class UI {
  constructor(callbacks = {}) {
    this.callbacks = callbacks
    this.settings = readSettings()
    this.state = null
    this.engine = null
    this.awaitingRoll = false
    this.rollResolve = null
    this.modalOpen = false
    this.modalResolve = null
    this.modalDefault = null
    this.modalDismissible = true
    this.selectedTile = null
    this.manage = null
    this.paused = false
    this.titleVisible = true
    this.gameOverShown = false

    this.el = {
      boot: document.getElementById('boot'),
      title: document.getElementById('title-screen'),
      game: document.getElementById('game-ui'),
      newBtn: document.getElementById('new-btn'),
      continueBtn: document.getElementById('continue-btn'),
      howBtn: document.getElementById('how-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      continueLabel: null,
      roundLabel: document.getElementById('round-label'),
      turnLabel: document.getElementById('turn-label'),
      playerRail: document.getElementById('player-rail'),
      menuBtn: document.getElementById('menu-btn'),
      rollBtn: document.getElementById('roll-btn'),
      rollLabel: document.getElementById('roll-label'),
      turnKicker: document.getElementById('turn-kicker'),
      turnCopy: document.getElementById('turn-copy'),
      rotateBtn: document.getElementById('rotate-btn'),
      resetViewBtn: document.getElementById('reset-view-btn'),
      tileCard: document.getElementById('tile-card'),
      tileCardBody: document.getElementById('tile-card-body'),
      tileClose: document.getElementById('tile-close'),
      toastStack: document.getElementById('toast-stack'),
      backdrop: document.getElementById('modal-backdrop'),
      modalRoot: document.getElementById('modal-root'),
      titleVersion: document.getElementById('title-version')
    }

    this.bind()
    this.applySettingsToBody()
  }

  bind() {
    this.el.newBtn.addEventListener('click', () => {
      this.click()
      this.openSetup()
    })
    this.el.continueBtn.addEventListener('click', () => {
      this.click()
      this.callbacks.onContinue?.()
    })
    this.el.howBtn.addEventListener('click', () => {
      this.click()
      this.showHowTo()
    })
    this.el.settingsBtn.addEventListener('click', () => {
      this.click()
      this.openSettings()
    })
    this.el.menuBtn.addEventListener('click', () => {
      this.click()
      this.openPause()
    })
    this.el.rollBtn.addEventListener('click', () => this.roll())
    this.el.rotateBtn.addEventListener('click', () => {
      this.click()
      this.callbacks.onRotate?.()
    })
    this.el.resetViewBtn.addEventListener('click', () => {
      this.click()
      this.callbacks.onResetView?.()
    })
    this.el.tileClose.addEventListener('click', () => this.hideTileCard())
    this.el.backdrop.addEventListener('click', () => {
      if (this.modalOpen && this.modalDismissible) this.finishModal(this.modalDefault)
    })
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.handleBack()) event.preventDefault()
      } else if ((event.key === ' ' || event.key === 'Enter') && this.awaitingRoll) {
        if (!this.modalOpen) {
          event.preventDefault()
          this.roll()
        }
      }
    })
    window.lifeEstateBack = () => this.handleBack()
  }

  click() {
    audio.init()
    audio.click()
    this.haptic('light')
  }

  haptic(kind = 'light') {
    if (!this.settings.haptics) return
    try {
      if (kind === 'heavy') navigator.vibrate?.([18, 24, 32])
      else if (kind === 'medium') navigator.vibrate?.(18)
      else navigator.vibrate?.(9)
    } catch {
      /* not supported */
    }
  }

  applySettingsToBody() {
    document.documentElement.classList.toggle('battery-saver', this.settings.battery)
    document.documentElement.classList.toggle('reduce-motion', this.settings.motion)
    audio.setMuted(!this.settings.sound)
  }

  updateSettings(next) {
    this.settings = { ...this.settings, ...next }
    saveSettings(this.settings)
    this.applySettingsToBody()
    this.callbacks.onSettings?.(this.settings)
  }

  setBooted() {
    this.el.boot.classList.add('hidden')
  }

  setVersion(version) {
    this.el.titleVersion.textContent = `v${version}`
  }

  hasSave(save) {
    this.el.continueBtn.classList.toggle('hidden', !save)
  }

  showTitle(hasSave = false) {
    this.titleVisible = true
    this.awaitingRoll = false
    this.rollResolve = null
    this.el.game.classList.add('hidden')
    this.el.title.classList.remove('hidden', 'leaving')
    this.el.continueBtn.classList.toggle('hidden', !hasSave)
    this.hideTileCard()
    this.closeModalSilently()
    this.gameOverShown = false
  }

  hideTitle() {
    this.titleVisible = false
    this.el.title.classList.add('leaving')
    setTimeout(() => {
      if (!this.titleVisible) this.el.title.classList.add('hidden')
    }, 600)
    this.el.game.classList.remove('hidden')
  }

  showGame(state) {
    this.hideTitle()
    this.el.game.classList.remove('hidden')
    if (state) this.update(state)
  }

  // --------------------------------------------------------------- HUD / dock
  update(state) {
    this.state = state
    if (!state) return
    this.renderPlayers()
    this.renderDock()
    if (this.selectedTile != null) this.renderTileCard()
  }

  renderPlayers() {
    const state = this.state
    if (!state) return
    const current = state.players[state.turn]
    this.el.playerRail.innerHTML = state.players
      .map((player) => {
        const active = !state.over && current?.id === player.id && !player.bankrupt
        const nw = netWorth(state, player)
        return `
          <div class="player-card ${active ? 'active' : ''} ${player.bankrupt ? 'bankrupt' : ''}" style="--pc:${player.color}">
            <span class="pc-token">${TOKEN_GLYPHS[player.token] || '●'}</span>
            <div class="pc-main">
              <span class="pc-name">${player.isAI ? player.name : 'You'}</span>
              <span class="pc-cash">${player.bankrupt ? 'Bankrupt' : money(player.cash)}</span>
            </div>
            <span class="pc-nw">${player.bankrupt ? '—' : money(nw)}</span>
            <span class="pc-turn-dot"></span>
          </div>
        `
      })
      .join('')
    this.el.roundLabel.textContent = `Round ${state.round}`
    const human = state.players.find((p) => !p.isAI)
    if (state.over) {
      this.el.turnLabel.textContent = 'Final'
    } else if (current?.isAI) {
      this.el.turnLabel.textContent = `${current.name}'s turn`
    } else {
      this.el.turnLabel.textContent = 'Your turn'
    }
  }

  renderDock() {
    const state = this.state
    if (!state) return
    const current = state.players[state.turn]
    const human = state.players.find((p) => !p.isAI)
    const over = state.over
    const awaiting = this.awaitingRoll && current && !current.isAI && !over && !current.bankrupt

    this.el.rollBtn.disabled = !awaiting
    this.el.rollLabel.textContent = awaiting ? 'Roll' : over ? 'Over' : current?.isAI ? 'Waiting' : 'Roll'
    this.el.rollBtn.classList.toggle('ready', awaiting)
    this.el.turnCopy.classList.remove('thinking')

    if (over) {
      this.el.turnKicker.textContent = 'Game over'
      this.el.turnCopy.textContent = state.winner != null ? `${state.players[state.winner]?.name || 'Someone'} wins` : 'The board is quiet'
    } else if (awaiting) {
      this.el.turnKicker.textContent = 'Your turn'
      this.el.turnCopy.textContent = 'Roll the dice and see where the board takes you.'
    } else if (current?.isAI) {
      this.el.turnKicker.textContent = `${current.name}'s turn`
      this.el.turnCopy.textContent = `${current.name} is thinking`
      this.el.turnCopy.classList.add('thinking')
    } else if (current && !current.isAI) {
      this.el.turnKicker.textContent = 'Your turn'
      this.el.turnCopy.textContent = 'Choose an action to continue.'
    } else {
      this.el.turnKicker.textContent = 'Waiting'
      this.el.turnCopy.textContent = 'The board is breathing.'
    }
    if (human?.bankrupt) {
      this.el.turnKicker.textContent = 'Bankrupt'
      this.el.turnCopy.textContent = 'Your estate has folded. Review the results.'
    }
  }

  waitForRoll(player) {
    this.awaitingRoll = true
    this.hideTileCard()
    this.update(this.state)
    this.el.rollBtn.classList.add('ready')
    return new Promise((resolve) => {
      this.rollResolve = resolve
    })
  }

  roll() {
    if (!this.awaitingRoll) return
    this.awaitingRoll = false
    const resolve = this.rollResolve
    this.rollResolve = null
    this.el.rollBtn.disabled = true
    this.el.rollBtn.classList.remove('ready')
    this.click()
    this.haptic('medium')
    resolve?.()
  }

  botThinking(player) {
    if (!this.state) return
    this.el.turnKicker.textContent = `${player.name}'s turn`
    this.el.turnCopy.textContent = `${player.name} is thinking`
    this.el.turnCopy.classList.add('thinking')
  }

  turn(player) {
    if (!this.state) return
    this.hideTileCard()
    this.update(this.state)
  }

  // ------------------------------------------------------------------ toasts
  toast(html, kind = 'info', ms = 2800) {
    const el = document.createElement('div')
    el.className = `toast ${kind}`
    el.innerHTML = html
    this.el.toastStack.appendChild(el)
    while (this.el.toastStack.children.length > 4) this.el.toastStack.firstElementChild.remove()
    setTimeout(() => {
      el.classList.add('out')
      setTimeout(() => el.remove(), 400)
    }, ms)
  }

  // ------------------------------------------------------------------ tile card
  showTileCard(tileIndex) {
    this.selectedTile = tileIndex
    this.renderTileCard()
    this.el.tileCard.classList.remove('hidden')
  }

  hideTileCard() {
    this.selectedTile = null
    this.el.tileCard.classList.add('hidden')
  }

  renderTileCard() {
    if (this.selectedTile == null || !this.state) return
    const tile = TILES[this.selectedTile]
    const colony = this.state.colonies[this.selectedTile]
    const property = PROPERTIES.get(this.selectedTile)
    let accent = '#B9F26B'
    let eyebrow = 'Board tile'
    let desc = tile.desc || ''
    let stats = []

    if (tile.type === 'property') {
      const district = DISTRICTS[tile.district]
      accent = district.color
      eyebrow = district.name
      if (colony.owner == null) {
        desc = district.blurb
        stats = [
          ['Price', money(tile.price)],
          ['Rent now', money(levelRent(tile, colony.level, colony.population))],
          ['Life', `${colony.population}/${colony.size * colony.size}`]
        ]
      } else {
        const owner = this.state.players[colony.owner]
        accent = owner.color
        eyebrow = `${owner.name}'s district`
        desc = `${LEVEL_LABEL[colony.level - 1]} · ${colony.size}×${colony.size} colony grid.`
        stats = [
          ['Rent', money(levelRent(tile, colony.level, colony.population))],
          ['Life', `${colony.population}/${colony.size * colony.size}`],
          ['Value', money(propertyValueFor(this.state, colony))]
        ]
      }
    } else if (tile.type === 'start') {
      accent = '#B9F26B'
      eyebrow = 'Corner'
      stats = [['Salary', money(GAME.salary)], ['Landing', '+$80']]
    } else if (tile.type === 'tax') {
      accent = '#FF6F61'
      eyebrow = 'Hazard'
      stats = [['Rate', '10%'], ['Cap', money(GAME.taxCap)]]
    } else if (tile.type === 'dormancy') {
      accent = '#8FA7C9'
      eyebrow = 'Hazard'
      stats = [['Skip', '1 turn'], ['Wake fee', money(GAME.dormancyFee)]]
    } else if (tile.type === 'sanctuary') {
      accent = '#FFD37A'
      eyebrow = 'Refuge'
      stats = [['Bonus', money(GAME.sanctuaryBonus)], ['Gift', '+1 cell']]
    } else if (tile.type === 'geneLab') {
      accent = '#C7A6FF'
      eyebrow = 'Corner'
      stats = [['Gift', 'Free upgrade'], ['Fallback', money(GAME.geneLabBonus)]]
    } else if (tile.type === 'mutation') {
      accent = '#FF8F6B'
      eyebrow = 'Card tile'
      stats = [['Draw', 'Mutation'], ['Deck', '12 cards']]
    } else if (tile.type === 'ecosystem') {
      accent = '#7EDDA0'
      eyebrow = 'Card tile'
      stats = [['Draw', 'Ecosystem'], ['Deck', '10 cards']]
    }

    const ownerTag =
      tile.type === 'property' && colony.owner != null
        ? `<span class="tile-owner" style="--pc:${this.state.players[colony.owner].color}"><span>●</span>${this.state.players[colony.owner].name}${colony.owner === 0 ? ' (you)' : ''}</span>`
        : ''

    this.el.tileCardBody.innerHTML = `
      <div class="tile-eyebrow" style="--district:${accent}"><i></i>${eyebrow}</div>
      <h3 class="tile-name">${tile.name}</h3>
      <p class="tile-desc">${desc}</p>
      <div class="tile-stats">
        ${stats
          .map(
            ([label, value]) => `
          <div class="tile-stat"><span>${label}</span><strong>${value}</strong></div>
        `
          )
          .join('')}
      </div>
      ${ownerTag}
    `
    this.el.tileCard.style.setProperty('--district', accent)
  }

  // ------------------------------------------------------------------- modals
  openModal({ html, className = '', accent = '#B9F26B', dismissible = true, defaultResult = null, onMount = null }) {
    this.closeModalSilently()
    this.el.modalRoot.innerHTML = `<div class="modal ${className}" style="--accent:${accent}"><div class="modal-accent"></div>${html}</div>`
    this.el.backdrop.classList.add('visible')
    this.modalOpen = true
    this.modalDismissible = dismissible
    this.modalDefault = defaultResult
    this.hideTileCard()
    const modal = this.el.modalRoot.firstElementChild
    modal.querySelectorAll('[data-close]').forEach((button) => {
      button.addEventListener('click', () => this.finishModal(defaultResult))
    })
    const promise = new Promise((resolve) => {
      this.modalResolve = resolve
    })
    const finish = (value) => this.finishModal(value)
    onMount?.(modal, finish)
    requestAnimationFrame(() => {
      const focus = modal.querySelector('[autofocus], .btn-primary, button')
      focus?.focus?.({ preventScroll: true })
    })
    return promise
  }

  finishModal(value) {
    if (!this.modalOpen) return
    this.modalOpen = false
    this.modalDismissible = true
    const resolve = this.modalResolve
    this.modalResolve = null
    this.el.backdrop.classList.remove('visible')
    this.el.modalRoot.innerHTML = ''
    this.manage = null
    resolve?.(value)
  }

  closeModalSilently() {
    this.modalOpen = false
    this.modalDismissible = true
    this.modalResolve = null
    this.manage = null
    this.el.backdrop.classList.remove('visible')
    this.el.modalRoot.innerHTML = ''
  }

  handleBack() {
    if (this.modalOpen) {
      if (this.modalDismissible) {
        if (this.manage) this.finishManage()
        else this.finishModal(this.modalDefault)
      }
      return true
    }
    if (this.selectedTile != null) {
      this.hideTileCard()
      return true
    }
    if (!this.titleVisible && this.state && !this.state.over) {
      this.openPause()
      return true
    }
    return false
  }

  cancelPrompts() {
    this.awaitingRoll = false
    this.rollResolve?.()
    this.rollResolve = null
    if (this.modalOpen) {
      const resolve = this.modalResolve
      this.modalResolve = null
      this.closeModalSilently()
      resolve?.(this.modalDefault)
    }
  }

  // ------------------------------------------------------------- setup screen
  openSetup() {
    let token = 'sprout'
    let difficulty = 'sharp'
    const notes = {
      cozy: 'Rivals keep a big cash cushion and buy less often. A gentle first game.',
      sharp: 'Rivals complete colour sets and upgrade their best colonies. The intended challenge.',
      ruthless: 'Rivals spend aggressively, upgrade fast and leave little breathing room.'
    }
    const tokenHTML = PLAYER_BLUEPRINTS.map(
      (p) => `
        <button class="token-choice ${p.token === token ? 'selected' : ''}" style="--tc:${p.color}" data-token="${p.token}">
          <span class="tc-orb">${TOKEN_GLYPHS[p.token]}</span>
          <span class="tc-name">${TOKEN_NAMES[p.token]}</span>
        </button>
      `
    ).join('')

    this.openModal({
      accent: '#B9F26B',
      className: 'setup-modal',
      html: `
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow"><i></i>New estate</div>
            <h2>Choose your lifeform</h2>
            <p class="modal-sub">You will share the board with three rivals. Every district is a living colony.</p>
          </div>
          <button class="modal-close" data-close aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <div>
            <h3>Your token</h3>
            <div class="token-grid">${tokenHTML}</div>
          </div>
          <div>
            <h3>Rival instinct</h3>
            <div class="segmented">
              <button class="segment ${difficulty === 'cozy' ? 'selected' : ''}" data-diff="cozy">Cozy</button>
              <button class="segment ${difficulty === 'sharp' ? 'selected' : ''}" data-diff="sharp">Sharp</button>
              <button class="segment ${difficulty === 'ruthless' ? 'selected' : ''}" data-diff="ruthless">Ruthless</button>
            </div>
            <p class="difficulty-note">${notes[difficulty]}</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" data-start>Start game</button>
          </div>
          <p class="modal-sub" style="text-align:center;font-size:9px;letter-spacing:.1em;text-transform:uppercase">First to ${money(GAME.victoryNetWorth)} net worth wins</p>
        </div>
      `,
      onMount: (modal, finish) => {
        modal.querySelectorAll('[data-token]').forEach((button) => {
          button.addEventListener('click', () => {
            token = button.dataset.token
            modal.querySelectorAll('[data-token]').forEach((b) => b.classList.toggle('selected', b === button))
            this.click()
          })
        })
        modal.querySelectorAll('[data-diff]').forEach((button) => {
          button.addEventListener('click', () => {
            difficulty = button.dataset.diff
            modal.querySelectorAll('[data-diff]').forEach((b) => b.classList.toggle('selected', b === button))
            const note = modal.querySelector('.difficulty-note')
            if (note) note.textContent = notes[difficulty]
            this.click()
          })
        })
        modal.querySelector('[data-start]').addEventListener('click', () => {
          this.click()
          finish({ token, difficulty })
        })
      }
    }).then((result) => {
      if (result) this.callbacks.onNewGame?.(result)
    })
  }

  // --------------------------------------------------------------- how to play
  showHowTo() {
    return this.openModal({
      accent: '#B9F26B',
      className: 'howto-modal',
      html: `
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow"><i></i>Field guide</div>
            <h2>How to grow an estate</h2>
            <p class="modal-sub">Monopoly bones, cellular life. Population drives rent, so keep your colonies breathing.</p>
          </div>
          <button class="modal-close" data-close aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <div class="how-list">
            <div class="how-step">
              <span class="how-num">1</span>
              <div><strong>Roll and roam</strong><p>Move around 28 tiles. Buy wild districts, upgrade them, and collect a salary each time you pass Genesis.</p></div>
            </div>
            <div class="how-step">
              <span class="how-num">2</span>
              <div><strong>Every district is alive</strong><p>Each property runs Conway's Game of Life. The number of living cells sets its rent. Between rounds, every colony evolves one generation.</p></div>
            </div>
            <div class="how-step">
              <span class="how-num">3</span>
              <div><strong>Cultivate your land</strong><p>Land on your own district to plant up to three cells, expand the grid, or harvest the colony for quick cash.</p></div>
            </div>
            <div class="how-step">
              <span class="how-num">4</span>
              <div><strong>Outgrow the rivals</strong><p>Rent, yields and district values build your net worth. The first estate to reach ${money(GAME.victoryNetWorth)} wins. Go broke and you are out.</p></div>
            </div>
          </div>
          <div class="how-note">Tip: a colony with more living cells charges more rent — but you can only plant on your own turn. Watch the board evolve before you commit.</div>
          <div class="modal-actions"><button class="btn btn-primary" data-close>Got it</button></div>
        </div>
      `
    })
  }

  // ------------------------------------------------------------------ settings
  openSettings() {
    return this.openModal({
      accent: '#B9F26B',
      className: 'settings-modal',
      html: `
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow"><i></i>Preferences</div>
            <h2>Settings</h2>
            <p class="modal-sub">Everything is stored on this device. No account, no tracking.</p>
          </div>
          <button class="modal-close" data-close aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <div>
            <div class="setting-row">
              <div class="setting-copy"><strong>Sound & music</strong><span>Synth soundtrack and board effects</span></div>
              <label class="switch"><input type="checkbox" data-setting="sound" ${this.settings.sound ? 'checked' : ''}/><span></span></label>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><strong>Haptics</strong><span>Subtle vibration on dice and purchases</span></div>
              <label class="switch"><input type="checkbox" data-setting="haptics" ${this.settings.haptics ? 'checked' : ''}/><span></span></label>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><strong>Battery saver</strong><span>Softer shadows and fewer particles</span></div>
              <label class="switch"><input type="checkbox" data-setting="battery" ${this.settings.battery ? 'checked' : ''}/><span></span></label>
            </div>
            <div class="setting-row">
              <div class="setting-copy"><strong>Reduce motion</strong><span>Quicker hops and calmer camera</span></div>
              <label class="switch"><input type="checkbox" data-setting="motion" ${this.settings.motion ? 'checked' : ''}/><span></span></label>
            </div>
          </div>
          <div class="modal-actions"><button class="btn btn-primary" data-close>Done</button></div>
        </div>
      `,
      onMount: (modal) => {
        modal.querySelectorAll('[data-setting]').forEach((input) => {
          input.addEventListener('change', () => {
            this.updateSettings({ [input.dataset.setting]: input.checked })
            this.click()
          })
        })
      }
    })
  }

  // --------------------------------------------------------------------- pause
  openPause() {
    if (this.modalOpen) return
    this.paused = true
    this.hideTileCard()
    this.callbacks.onPause?.()
    this.openModal({
      accent: '#B9F26B',
      className: 'pause-modal',
      html: `
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow"><i></i>Paused</div>
            <h2>The board can wait</h2>
            <p class="modal-sub">Your colonies are frozen mid-generation.</p>
          </div>
        </div>
        <div class="modal-body">
          <div class="pause-list">
            <button class="btn btn-primary" data-resume>Resume</button>
            <button class="btn btn-ghost" data-how>How to play</button>
            <button class="btn btn-ghost" data-settings>Settings</button>
            <button class="btn btn-danger" data-quit>Save & exit</button>
          </div>
          <p class="modal-sub" style="text-align:center;font-size:9px">Progress is saved automatically after every move.</p>
        </div>
      `,
      onMount: (modal, finish) => {
        modal.querySelector('[data-resume]').addEventListener('click', () => finish('resume'))
        modal.querySelector('[data-how]').addEventListener('click', () => finish('how'))
        modal.querySelector('[data-settings]').addEventListener('click', () => finish('settings'))
        modal.querySelector('[data-quit]').addEventListener('click', () => finish('quit'))
      }
    }).then((result) => {
      this.paused = false
      if (result === 'how') {
        this.showHowTo().then(() => this.openPause())
        return
      }
      if (result === 'settings') {
        this.openSettings().then(() => this.openPause())
        return
      }
      this.callbacks.onResume?.()
      if (result === 'quit') this.callbacks.onQuitToTitle?.()
    })
  }

  // --------------------------------------------------------------- interaction
  chooseBuy(player, tile, colony, canAfford) {
    const district = DISTRICTS[tile.district]
    this.haptic('light')
    return this.openModal({
      accent: district.color,
      className: 'property-modal',
      defaultResult: false,
      html: `
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow"><i></i>${district.name} district</div>
            <h2>${tile.name}</h2>
            <p class="modal-sub">${district.blurb}</p>
          </div>
          <button class="modal-close" data-close aria-label="Pass">×</button>
        </div>
        <div class="modal-body">
          <div class="property-price-row"><span>Asking price</span><strong>${money(tile.price)}</strong></div>
          ${this.lifeBlockHTML(colony, district.color, 'A wild colony already lives here. Buying it adds your colour and a starting pattern.')}
          <div class="stat-grid">
            <div class="stat-box"><span>Your cash</span><strong>${money(player.cash)}</strong></div>
            <div class="stat-box"><span>Rent now</span><strong class="accent">${money(levelRent(tile, colony.level, colony.population))}</strong></div>
            <div class="stat-box"><span>Population</span><strong>${colony.population}/${colony.size * colony.size}</strong></div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" data-close>Pass</button>
            <button class="btn btn-primary" data-buy ${canAfford ? '' : 'disabled'}>${canAfford ? `Buy · ${money(tile.price)}` : 'Not enough cash'}</button>
          </div>
        </div>
      `,
      onMount: (modal, finish) => {
        modal.querySelector('[data-buy]').addEventListener('click', () => {
          if (!canAfford) return
          this.click()
          this.haptic('medium')
          finish(true)
        })
      }
    })
  }

  manageProperty(player, tile, colony) {
    this.manage = {
      player,
      tile,
      colony,
      mode: 'view',
      selected: [],
      seeded: false,
      resolve: null
    }
    this.el.backdrop.classList.add('visible')
    this.modalOpen = true
    this.modalDismissible = true
    this.modalDefault = null
    this.hideTileCard()
    this.renderManage()
    return new Promise((resolve) => {
      this.manage.resolve = resolve
    })
  }

  renderManage() {
    const m = this.manage
    if (!m) return
    const { tile, colony, player } = m
    const engine = this.engine
    const district = DISTRICTS[tile.district]
    const districtColors = Object.values(DISTRICTS)
    const size = colony.size
    const maxLevel = GAME.maxLevel
    const cost = engine ? engine.upgradePrice(colony) : null
    const canUpgrade = engine ? engine.canUpgrade(player, colony) : false
    const harvest = Math.max(12, colony.population * GAME.harvestMultiplier)
    const rent = levelRent(tile, colony.level, colony.population)
    const selectedCount = m.selected.length
    const seedMode = m.mode === 'seed'

    let cells = ''
    for (let i = 0; i < size * size; i++) {
      const alive = !!colony.cells[i]
      const selected = m.selected.includes(i)
      const selectable = seedMode && !alive && !selected
      cells += `<button class="life-cell ${alive ? 'alive' : ''} ${selected ? 'selected' : ''} ${selectable ? 'selectable' : ''}" ${
        selectable || selected ? `data-cell="${i}"` : ''
      } aria-label="Cell ${i + 1}${alive ? ' alive' : ' empty'}" ${alive || !seedMode ? 'disabled' : ''}></button>`
    }

    const nextLevel = Math.min(maxLevel, colony.level + 1)
    const nextSize = [4, 5, 6][nextLevel - 1]

    const html = `
      <div class="modal" style="--accent:${district.color}">
        <div class="modal-accent"></div>
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow"><i></i>${district.name} · ${LEVEL_LABEL[colony.level - 1]}</div>
            <h2>${tile.name}</h2>
            <p class="modal-sub">${seedMode ? 'Tap empty cells to plant up to three new lifeforms.' : 'Your colony is alive. Tend it, grow it, or cash it in.'}</p>
          </div>
          <button class="modal-close" data-act="done" aria-label="Done">×</button>
        </div>
        <div class="modal-body">
          <div class="life-wrap">
            <div class="life-grid" style="--n:${size};--district:${district.color}">${cells}</div>
            <div class="life-side">
              <span class="label">Population</span>
              <span class="big">${colony.population}</span>
              <span class="label">of ${size * size} cells</span>
              <span class="hint">${seedMode ? 'Empty cells with living neighbours are the best investment.' : 'More life means more rent when a rival lands here.'}</span>
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat-box"><span>Rent</span><strong class="accent">${money(rent)}</strong></div>
            <div class="stat-box"><span>Grid</span><strong>${size}×${size}</strong></div>
            <div class="stat-box"><span>Value</span><strong>${money(propertyValueFor(this.state, colony))}</strong></div>
          </div>
          ${seedMode ? `<div class="life-edit-note"><span>${selectedCount}/3 cells selected</span><span>Pop ${colony.population}</span></div>` : ''}
          <div class="action-list">
            ${
              seedMode
                ? `
              <button class="action-btn" data-act="plant" ${selectedCount === 0 ? 'disabled' : ''}>
                <span class="action-icon">✦</span>
                <span class="action-text"><strong>Plant ${selectedCount || ''} cell${selectedCount === 1 ? '' : 's'}</strong><span>Add life to the grid</span></span>
                <span class="action-cost">Free</span>
              </button>
              <button class="action-btn" data-act="cancel-seed">
                <span class="action-icon coral">×</span>
                <span class="action-text"><strong>Cancel planting</strong><span>Keep the colony as it is</span></span>
              </button>
            `
                : `
              <button class="action-btn" data-act="seed-mode" ${m.seeded ? 'disabled' : ''}>
                <span class="action-icon">✦</span>
                <span class="action-text"><strong>Plant cells</strong><span>${m.seeded ? 'You already planted on this visit' : 'Place up to 3 living cells · free'}</span></span>
                <span class="action-cost">${m.seeded ? 'Used' : 'Free'}</span>
              </button>
              <button class="action-btn" data-act="upgrade" ${canUpgrade ? '' : 'disabled'}>
                <span class="action-icon gold">▲</span>
                <span class="action-text"><strong>${colony.level >= maxLevel ? 'Fully grown' : `Grow to ${nextLevel === 2 ? 'Grove' : 'Biome'}`}</strong><span>${colony.level >= maxLevel ? 'This district is a biome' : `Expands to ${nextSize}×${nextSize} · higher rent`}</span></span>
                <span class="action-cost">${colony.level >= maxLevel ? 'Max' : money(cost)}</span>
              </button>
              <button class="action-btn" data-act="harvest">
                <span class="action-icon coral">✂</span>
                <span class="action-text"><strong>Harvest colony</strong><span>Cash in now · resets the grid</span></span>
                <span class="action-cost">+${money(harvest)}</span>
              </button>
            `
            }
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" data-act="${seedMode ? 'cancel-seed' : 'done'}">${seedMode ? 'Cancel' : 'Done'}</button>
          </div>
        </div>
      </div>
    `
    this.el.modalRoot.innerHTML = html
    const modal = this.el.modalRoot.firstElementChild
    modal.querySelectorAll('[data-act]').forEach((button) => {
      const act = button.dataset.act
      if (act === 'done') button.addEventListener('click', () => this.finishManage())
      else if (act === 'seed-mode') {
        button.addEventListener('click', () => {
          m.mode = 'seed'
          m.selected = []
          this.click()
          this.renderManage()
        })
      } else if (act === 'cancel-seed') {
        button.addEventListener('click', () => {
          m.mode = 'view'
          m.selected = []
          this.click()
          this.renderManage()
        })
      } else if (act === 'plant') {
        button.addEventListener('click', () => {
          if (!m.selected.length) return
          this.engine.seedColony(colony, m.selected)
          m.seeded = true
          m.mode = 'view'
          m.selected = []
          this.click()
          this.haptic('medium')
          audio.coin()
          this.update(this.engine.state)
          this.renderManage()
        })
      } else if (act === 'upgrade') {
        button.addEventListener('click', () => {
          const ok = this.engine.upgradeProperty(colony, false)
          if (ok) {
            this.click()
            this.haptic('medium')
            audio.upgrade()
            this.toast(`<b>${tile.name}</b> grew to ${LEVEL_LABEL[colony.level - 1]}.`, 'good', 2200)
          } else {
            audio.error()
            this.toast('Not enough cash for that upgrade.', 'bad', 2000)
          }
          this.update(this.engine.state)
          this.renderManage()
        })
      } else if (act === 'harvest') {
        button.addEventListener('click', () => {
          const gained = this.engine.harvestColony(player, colony)
          if (gained) {
            this.click()
            this.haptic('medium')
            audio.pay()
            this.toast(`Harvested <b>${tile.name}</b> for <b>${money(gained)}</b>.`, 'good', 2400)
          }
          this.update(this.engine.state)
          this.renderManage()
        })
      }
    })
    modal.querySelectorAll('[data-cell]').forEach((button) => {
      button.addEventListener('click', () => {
        const i = Number(button.dataset.cell)
        if (m.selected.includes(i)) m.selected = m.selected.filter((x) => x !== i)
        else if (m.selected.length < 3) m.selected.push(i)
        this.click()
        this.renderManage()
      })
    })
  }

  finishManage() {
    if (!this.manage) return
    const resolve = this.manage.resolve
    this.manage = null
    this.modalOpen = false
    this.el.backdrop.classList.remove('visible')
    this.el.modalRoot.innerHTML = ''
    resolve?.()
  }

  dormancyChoice(player, fee) {
    return this.openModal({
      accent: '#8FA7C9',
      className: 'dormancy-modal',
      defaultResult: false,
      html: `
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow"><i></i>Dormancy</div>
            <h2>The colony sleeps</h2>
            <p class="modal-sub">Cold air settles over your estate. You can pay to wake it now, or lose your next turn.</p>
          </div>
        </div>
        <div class="modal-body">
          <div class="stat-grid">
            <div class="stat-box"><span>Wake fee</span><strong>${money(fee)}</strong></div>
            <div class="stat-box"><span>Your cash</span><strong>${money(player.cash)}</strong></div>
            <div class="stat-box"><span>Penalty</span><strong>Skip 1</strong></div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" data-close>Sleep · skip turn</button>
            <button class="btn btn-primary" data-pay ${player.cash >= fee ? '' : 'disabled'}>Pay ${money(fee)}</button>
          </div>
        </div>
      `,
      onMount: (modal, finish) => {
        modal.querySelector('[data-pay]').addEventListener('click', () => {
          if (player.cash < fee) return
          this.click()
          finish(true)
        })
      }
    })
  }

  async showCard(player, card, deckKey) {
    const isMutation = deckKey === 'mutation'
    const accent = isMutation ? '#FF8F6B' : '#7EDDA0'
    const deckName = isMutation ? 'Mutation' : 'Ecosystem'
    if (player.isAI) {
      this.toast(`<b>${player.name}</b> drew <b>${card.title}</b><br>${card.text}`, 'card', 3000)
      await wait(1000)
      return
    }
    await this.openModal({
      accent,
      className: 'card-modal',
      html: `
        <div class="card-icon">${card.icon}</div>
        <div class="card-deck">${deckName} card</div>
        <h2 class="card-title">${card.title}</h2>
        <p class="card-text">${card.text}</p>
        <button class="btn btn-primary" data-close>Continue</button>
      `
    })
  }

  gameOver(state) {
    if (this.gameOverShown) return
    this.gameOverShown = true
    this.awaitingRoll = false
    const winner = state.players.find((p) => p.id === state.winner)
    const human = state.players.find((p) => !p.isAI)
    const youWon = winner && human && winner.id === human.id
    const rows = [...state.players]
      .sort((a, b) => netWorth(state, b) - netWorth(state, a))
      .map((p) => {
        const nw = netWorth(state, p)
        return `
          <div class="victory-row ${winner?.id === p.id ? 'active' : ''}" style="--pc:${p.color}">
            <span class="vr-name"><span class="vr-dot"></span>${p.isAI ? p.name : 'You'}${p.bankrupt ? ' · bankrupt' : ''}</span>
            <span class="vr-cash">${money(p.cash)}</span>
            <span class="vr-nw">${money(nw)} net</span>
          </div>
        `
      })
      .join('')

    const owned = winner ? ownedColonies(state, winner.id).length : 0
    const fields = winner ? winner.stats : { propertiesBought: 0, rentEarned: 0 }
    this.openModal({
      accent: '#FFD37A',
      className: 'victory-modal',
      dismissible: false,
      html: `
        <div class="victory-mark">♛</div>
        <div class="victory-label">${youWon ? 'You own the future' : 'Estate champion'}</div>
        <h2 class="victory-name">${winner ? winner.name : 'No one'}</h2>
        <p class="victory-reason">${state.endReason || 'The board has settled.'}</p>
        <div class="victory-stats">
          <div class="stat-box"><span>Rounds</span><strong>${state.round}</strong></div>
          <div class="stat-box"><span>Net worth</span><strong class="accent">${winner ? money(netWorth(state, winner)) : '—'}</strong></div>
          <div class="stat-box"><span>Districts</span><strong>${owned}</strong></div>
        </div>
        <div class="victory-table">${rows}</div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-menu>Main menu</button>
          <button class="btn btn-primary" data-again>Play again</button>
        </div>
        <p class="modal-sub" style="font-size:9px;text-align:center">${fields.propertiesBought} districts bought · ${money(fields.rentEarned || 0)} life income</p>
      `,
      onMount: (modal, finish) => {
        modal.querySelector('[data-menu]').addEventListener('click', () => {
          this.click()
          finish('menu')
        })
        modal.querySelector('[data-again]').addEventListener('click', () => {
          this.click()
          finish('again')
        })
      }
    }).then((result) => {
      if (result === 'menu') this.callbacks.onQuitToTitle?.()
      else if (result === 'again') this.callbacks.onRestart?.()
    })
  }

  // --------------------------------------------------------------------- misc
  lifeBlockHTML(colony, accent, hint) {
    const size = colony.size
    let cells = ''
    for (let i = 0; i < size * size; i++) {
      cells += `<span class="life-cell ${colony.cells[i] ? 'alive' : ''}"></span>`
    }
    return `
      <div class="life-wrap">
        <div class="life-grid" style="--n:${size};--district:${accent}">${cells}</div>
        <div class="life-side">
          <span class="label">Living cells</span>
          <span class="big">${colony.population}</span>
          <span class="label">of ${size * size}</span>
          <span class="hint">${hint}</span>
        </div>
      </div>
    `
  }

  showSetupError(message) {
    this.toast(message, 'bad', 3000)
  }
}

function propertyValueFor(state, colony) {
  const property = PROPERTIES.get(colony.tile)
  if (!property) return 0
  return Math.round(property.price + (colony.invested || 0) + colony.population * 12)
}
