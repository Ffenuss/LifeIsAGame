import './style.css';
import { Capacitor } from '@capacitor/core';
import { GameApp } from './game/app.js';

const app = new GameApp();
window.lifeIsAGame = app;

function showFatal(message) {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.innerHTML = `
      <div class="splash-inner">
        <div class="splash-logo">L</div>
        <h1>Life is a Game</h1>
        <p style="max-width:280px;line-height:1.6;letter-spacing:.04em;text-transform:none;font-size:12px;text-align:center">${message}</p>
      </div>
    `;
  }
}

async function setupNative() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { StatusBar } = await import('@capacitor/status-bar');
    await StatusBar.hide();
    await StatusBar.setBackgroundColor({ color: '#101b33' });
  } catch {
    /* The status bar plugin is optional. */
  }
  try {
    const { App } = await import('@capacitor/app');
    App.addListener('backButton', () => {
      if (app.ui?.activeModal) {
        const kind = app.ui.activeModal.kind;
        app.ui.closeModal();
        if (kind === 'pause') app.resume();
        return;
      }
      if (app.state) {
        app.openPause();
      } else {
        App.exitApp();
      }
    });
  } catch {
    /* The app plugin is optional. */
  }
}

app
  .boot()
  .then(setupNative)
  .catch((error) => {
    console.error(error);
    showFatal('This game needs WebGL. Please update your browser or device and try again.');
  });
