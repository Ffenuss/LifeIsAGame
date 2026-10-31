/**
 * Captures Play Store artwork from the real game.
 *
 *   npm run build
 *   npm run store:capture
 *
 * Requires Playwright's Chromium: npx playwright install chromium
 *
 * Gameplay is staged through the game's own engine (buying and upgrading real
 * colonies) so captures are deterministic and do not depend on dice rolls.
 * No gameplay code is bypassed beyond choosing which colonies are developed.
 */
import { createServer } from 'node:http'
import { mkdir, stat } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { extname, resolve, dirname, normalize } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

let activeServer = null
let activeBrowser = null

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const OUTPUT = resolve(ROOT, 'store/output')
const SOURCE = resolve(ROOT, 'store/source')
const PORT = 4173

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json'
}

function serve() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost')
      let path = decodeURIComponent(url.pathname)
      if (path === '/') path = '/index.html'
      const file = normalize(resolve(DIST, `.${path}`))
      if (!file.startsWith(DIST)) {
        res.writeHead(403).end()
        return
      }
      const info = await stat(file)
      if (!info.isFile()) throw new Error('not a file')
      res.writeHead(200, {
        'content-type': MIME[extname(file)] || 'application/octet-stream',
        'cache-control': 'no-cache'
      })
      createReadStream(file).pipe(res)
    } catch {
      res.writeHead(404).end('Not found')
    }
  })
  return new Promise((resolvePromise) => {
    server.listen(PORT, '127.0.0.1', () => resolvePromise(server))
  })
}

async function shot(page, path) {
  await page.screenshot({ path, animations: 'disabled' })
  console.log('  captured', path.replace(`${ROOT}/`, ''))
}

async function closeAnyModal(page) {
  await page.evaluate(() => window.__lifeEstate?.ui?.handleBack())
  await page.waitForTimeout(400)
}

async function stageBoard(page) {
  await page.evaluate(() => {
    const debug = window.__lifeEstate
    const { engine, state, scene, ui } = debug
    const players = state.players

    // Spread the four tokens around the ring for a livelier composition.
    players[0].pos = 3
    players[1].pos = 10
    players[2].pos = 17
    players[3].pos = 24

    const colonies = Object.values(state.colonies)
    const picks = [colonies[0], colonies[3], colonies[6], colonies[9], colonies[12], colonies[14]]
    picks.forEach((colony, index) => {
      engine.buyProperty(players[index % players.length], colony, { quiet: true })
    })
    // Grow two of them into groves and one into a biome using free upgrades.
    engine.upgradeProperty(picks[0], true)
    engine.upgradeProperty(picks[3], true)
    engine.upgradeProperty(picks[5], true)
    engine.upgradeProperty(picks[5], true)

    scene.buildTokensFromState(state)
    scene.setGameState(state)
    scene.setActivePlayer(players[0])
    ui.update(state)
  })
  await page.waitForTimeout(1800)
}

async function main() {
  await mkdir(resolve(OUTPUT, 'phone'), { recursive: true })
  await mkdir(resolve(OUTPUT, 'tablet'), { recursive: true })
  await mkdir(SOURCE, { recursive: true })

  const server = await serve()
  activeServer = server

  // WebGL is dramatically faster in a headed browser. Set STORE_HEADLESS=1 on
  // CI machines that provide a software GL stack.
  const browser = await chromium.launch({
    headless: process.env.STORE_HEADLESS === '1',
    args: [
      '--enable-unsafe-swiftshader',
      '--enable-gpu',
      '--ignore-gpu-blocklist',
      '--use-angle=vulkan',
      '--enable-features=Vulkan',
      '--use-vulkan=swiftshader',
      '--disable-vulkan-surface'
    ]
  })
  activeBrowser = browser

  const context = await browser.newContext({
    viewport: { width: 540, height: 960 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'en-US',
    colorScheme: 'dark'
  })

  const page = await context.newPage()
  page.on('pageerror', (error) => console.error('PAGE ERROR:', error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') console.error('CONSOLE:', message.text())
  })

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)

  console.log('Title screen')
  await shot(page, resolve(OUTPUT, 'phone/01-title.png'))

  // Speed up presentation tweens; software GL can otherwise take minutes.
  await page.evaluate(() => window.__lifeEstate.scene.setTimeScale(8))
  await page.evaluate(() =>
    window.__lifeEstate.startNewGame({ seed: 20260214, token: 'sprout', difficulty: 'sharp' })
  )
  await page.waitForTimeout(1800)
  await stageBoard(page)

  console.log('Board')
  await shot(page, resolve(OUTPUT, 'phone/02-board.png'))

  // The real purchase sheet, opened for an unowned colony.
  await page.evaluate(() => {
    const debug = window.__lifeEstate
    const colony = Object.values(debug.state.colonies).find((item) => item.owner == null)
    const tile = debug.constants.TILES[colony.tile]
    debug.ui.chooseBuy(debug.state.players[0], tile, colony, true)
  })
  await page.waitForTimeout(700)
  console.log('Purchase sheet')
  await shot(page, resolve(OUTPUT, 'phone/03-buy.png'))
  await closeAnyModal(page)

  // The manage sheet for a colony the player actually owns.
  await page.evaluate(() => {
    const debug = window.__lifeEstate
    const colony = Object.values(debug.state.colonies).find((item) => item.owner === 0)
    const tile = debug.constants.TILES[colony.tile]
    debug.ui.manageProperty(debug.state.players[0], tile, colony)
  })
  await page.waitForTimeout(700)
  console.log('Manage sheet')
  await shot(page, resolve(OUTPUT, 'phone/04-manage.png'))
  await closeAnyModal(page)

  await page.waitForTimeout(800)
  console.log('Developed board')
  await shot(page, resolve(OUTPUT, 'phone/05-progress.png'))

  // Tablet versions of the core gameplay views.
  await page.setViewportSize({ width: 600, height: 960 })
  await page.waitForTimeout(1400)
  await shot(page, resolve(OUTPUT, 'tablet/01-board.png'))
  await page.evaluate(() => {
    const debug = window.__lifeEstate
    const colony = Object.values(debug.state.colonies).find((item) => item.owner === 0)
    const tile = debug.constants.TILES[colony.tile]
    debug.ui.manageProperty(debug.state.players[0], tile, colony)
  })
  await page.waitForTimeout(700)
  await shot(page, resolve(OUTPUT, 'tablet/02-manage.png'))
  await closeAnyModal(page)

  // Clean, UI-free board for the feature graphic.
  await page.setViewportSize({ width: 1440, height: 900 })
  const hideUi = await page.addStyleTag({
    content: '#game-ui, .vignette, .toast-stack { display: none !important; }'
  })
  await page.waitForTimeout(1600)
  await shot(page, resolve(SOURCE, 'board-wide.png'))
  await hideUi.evaluate((node) => node.remove())
  await page.setViewportSize({ width: 540, height: 960 })

  // Victory screen.
  await page.waitForTimeout(1200)
  await page.evaluate(() => window.__lifeEstate.winState())
  await page.waitForTimeout(1200)
  console.log('Victory')
  await shot(page, resolve(OUTPUT, 'phone/06-victory.png'))

  // Icon.
  const icon = await context.newPage()
  await icon.setViewportSize({ width: 512, height: 512 })
  await icon.goto(pathToFileURL(resolve(ROOT, 'store/icon.html')).href)
  await icon.waitForTimeout(300)
  await shot(icon, resolve(OUTPUT, 'icon-512.png'))

  // Feature graphic uses the clean board capture.
  const feature = await context.newPage()
  await feature.setViewportSize({ width: 1024, height: 500 })
  await feature.goto(pathToFileURL(resolve(ROOT, 'store/feature.html')).href, {
    waitUntil: 'networkidle'
  })
  await feature.waitForTimeout(500)
  await shot(feature, resolve(OUTPUT, 'feature-1024x500.png'))

  await browser.close()
  activeBrowser = null
  server.close()
  activeServer = null
  console.log('\nStore artwork written to store/output/')
}

main().catch(async (error) => {
  console.error(error)
  await activeBrowser?.close().catch(() => {})
  activeServer?.close()
  process.exitCode = 1
})
