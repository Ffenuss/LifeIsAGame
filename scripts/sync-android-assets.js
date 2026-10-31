import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, 'dist')
const target = resolve(root, 'android/app/src/main/assets/www')

if (!existsSync(resolve(source, 'index.html'))) {
  console.error('Web bundle missing. Run `npm run build` first.')
  process.exit(1)
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
cpSync(source, target, { recursive: true })

console.log(`Copied ${source} -> ${target}`)
