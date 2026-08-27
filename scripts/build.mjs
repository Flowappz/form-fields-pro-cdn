#!/usr/bin/env node
/**
 * Bundle the runtime packages into one core script plus per-field chunks.
 *
 * Build order is the whole trick, and it is not negotiable:
 *
 *   1. bundle + minify every chunk
 *   2. content-hash each one, derive its public R2 URL and its sha384
 *   3. write those literals into packages/ffp-core/src/manifest.generated.ts
 *   4. bundle core LAST, so the manifest is inlined in the bytes Webflow pins
 *
 * That gives one unbroken chain of trust with no manifest fetch:
 *
 *   Webflow <script integrity> -> core bytes -> manifest literals -> chunk bytes
 *
 * This script does not touch R2 or the backend. It writes build/<version>/ and
 * stops; scripts/upload.mjs owns every outward-facing step.
 */
import { createHash } from 'crypto'
import { gzipSync } from 'zlib'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import * as esbuild from 'esbuild'
import { minify } from 'terser'
import dotenv from 'dotenv'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PACKAGES = resolve(ROOT, 'packages')
const FIELDS_DIR = resolve(PACKAGES, 'ffp-fields/src')
const SHARED_DIR = resolve(PACKAGES, 'ffp-primitives/src/chunks')
const CORE_ENTRY = resolve(PACKAGES, 'ffp-core/src/entry.ts')
const MANIFEST_OUT = resolve(PACKAGES, 'ffp-core/src/manifest.generated.ts')

/** Every placeholder upload.mjs substitutes. Chunks must contain none of them. */
const PLACEHOLDERS = [
    '__FFP_DATA_CLIENT_URL__',
    '__FFP_LICENSE_URL__',
    '__FFP_BEACON_URL__',
    '__FFP_SUBMISSION_SECRET__',
]

/**
 * Core budget in gzipped bytes. Exceeding it fails the build, not a review.
 * Raised from 9 kB when the submission pipeline landed; the reasoning is in
 * scripts/check-bundle-budget.mjs next to the same number.
 */
const CORE_GZIP_BUDGET = 12 * 1024

const args = process.argv.slice(2)
const versionFlag = args.indexOf('--version')
// Skip the value that belongs to --version, or `build.mjs --version 5.1.5` picks
// the semver up as the environment name and loads a `.env.5.1.5` that does not
// exist - silently building with whatever is already in the shell.
const env = args.find((a, i) => !a.startsWith('--') && i !== versionFlag + 1) || 'dev'

dotenv.config({ path: resolve(ROOT, env === 'dev' ? '.env' : `.env.${env}`) })

const { NODE_ENV, APP_SLUG, R2_PUBLIC_URL } = process.env
if (!NODE_ENV || !APP_SLUG || !R2_PUBLIC_URL) {
    console.error('✗ build.mjs needs NODE_ENV, APP_SLUG and R2_PUBLIC_URL to derive chunk URLs.')
    console.error('  Chunk URLs are baked into core, so they must be final before core is built.')
    process.exit(1)
}

/**
 * The release version, from `runtimeVersion` in package.json.
 *
 * It used to be the highest-numbered directory under `src/`, which meant the
 * build could not run without the frozen 5.1.5 tree beside it and that deleting
 * that tree would silently change what version got published. Nothing in
 * `packages/` reads `src/` any more, so the version has to live somewhere that
 * is actually about releases. Note this is **not** the package's own `version`:
 * that is the repo's, this is the runtime's, and they have never matched.
 */
function configuredVersion() {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'))
    return pkg.runtimeVersion || null
}

const version = versionFlag !== -1 ? args[versionFlag + 1] : configuredVersion()
if (!version) {
    console.error('✗ No version. Pass --version X.Y.Z or set `runtimeVersion` in package.json.')
    process.exit(1)
}

const publicBase = String(R2_PUBLIC_URL).trim().replace(/\/+$/, '')
const outDir = resolve(ROOT, 'build', version)
const chunkDir = resolve(outDir, 'chunks')

rmSync(outDir, { recursive: true, force: true })
mkdirSync(chunkDir, { recursive: true })

const shared = {
    bundle: true,
    format: 'iife',
    target: 'es2019',
    platform: 'browser',
    legalComments: 'none',
    logLevel: 'warning',
    write: false,
}

async function bundle(entry) {
    const result = await esbuild.build({ ...shared, entryPoints: [entry] })
    return result.outputFiles[0].text
}

async function compress(code) {
    const out = await minify(code, { compress: true, mangle: true, format: { comments: false } })
    if (!out.code) throw new Error('terser produced empty output')
    return Buffer.from(out.code, 'utf8')
}

const gzipSize = (buf) => gzipSync(buf, { level: 9 }).length

/** Discover chunk entry points: one directory per chunk, each with an index.ts. */
function discover(dir, prefix) {
    if (!existsSync(dir)) return []
    return readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(resolve(dir, d.name, 'index.ts')))
        .map((d) => ({ key: d.name, entry: resolve(dir, d.name, 'index.ts'), prefix }))
}

/**
 * `deps.json` next to a chunk names the shared chunks it needs first. Explicit
 * rather than inferred: a chunk's dependency is a loading decision, and the
 * loader has to know it before it has parsed a single byte of the chunk.
 */
function readDeps(entry) {
    const path = resolve(dirname(entry), 'deps.json')
    if (!existsSync(path)) return []
    return JSON.parse(readFileSync(path, 'utf8'))
}

const targets = [...discover(SHARED_DIR, 'ui'), ...discover(FIELDS_DIR, 'field')]
if (!targets.length) {
    console.error(`✗ No chunks found under ${FIELDS_DIR} or ${SHARED_DIR}.`)
    process.exit(1)
}

console.log(`Building ${targets.length} chunks for v${version} (${NODE_ENV})\n`)

const manifest = {}
for (const { key, entry, prefix } of targets) {
    const code = await bundle(entry)

    // A chunk that carries a placeholder would either ship an unsubstituted
    // token or spread FORM_SUBMISSION_SECRET across more public objects. Neither
    // is recoverable once the key is immutable, so fail here.
    for (const token of PLACEHOLDERS) {
        if (code.includes(token)) {
            console.error(`✗ Chunk "${key}" contains ${token}.`)
            console.error('  Chunks are environment-independent by contract - move that read into core.')
            process.exit(1)
        }
    }

    const body = await compress(code)
    const contentHash = createHash('sha256').update(body).digest('hex').slice(0, 12)
    // `ui-popover` is already prefixed; do not ship `ui-ui-popover.js`. These
    // URLs end up in support threads and R2 request logs.
    const base = key.startsWith(`${prefix}-`) ? key : `${prefix}-${key}`
    const filename = `${base}.${contentHash}.js`
    writeFileSync(resolve(chunkDir, filename), body)

    manifest[key] = {
        url: `${publicBase}/${APP_SLUG}/${NODE_ENV}/${version}/chunks/${filename}`,
        integrity: 'sha384-' + createHash('sha384').update(body).digest('base64'),
        deps: readDeps(entry),
        bytes: body.length,
    }

    console.log(`  ${key.padEnd(14)} ${String(body.length).padStart(7)} B  ${String(gzipSize(body)).padStart(6)} B gz`)
}

const entries = Object.keys(manifest)
    .sort()
    .map((key) => `    ${JSON.stringify(key)}: ${JSON.stringify(manifest[key])},`)
    .join('\n')

writeFileSync(
    MANIFEST_OUT,
    `import type { ChunkManifest } from './manifest'\n\n` +
        `/** Generated by scripts/build.mjs. Do not edit. */\n` +
        `export const MANIFEST: ChunkManifest = {\n${entries}\n}\n\n` +
        `export const VERSION = ${JSON.stringify(version)}\n`,
)
console.log(`\n✓ Manifest written: ${MANIFEST_OUT}`)

// Core last, so the literals above are in the bytes Webflow pins.
const coreCode = await bundle(CORE_ENTRY)
const corePath = resolve(outDir, 'form-fields-pro-cdn.js')
writeFileSync(corePath, coreCode)

// Budget is measured on the minified+gzipped bytes, which is what a visitor
// downloads. upload.mjs re-minifies after substitution; the placeholder URLs are
// the same length class as the real ones, so this estimate is the gate.
const coreBody = await compress(coreCode)
const coreGz = gzipSize(coreBody)
console.log(`✓ Core: ${coreBody.length} B min / ${coreGz} B gz`)

if (coreGz > CORE_GZIP_BUDGET) {
    console.error(`\n✗ Core is ${coreGz} B gzipped, over the ${CORE_GZIP_BUDGET} B budget.`)
    console.error('  Move code into a lazy chunk rather than raising the budget.')
    process.exit(1)
}

writeFileSync(
    resolve(outDir, 'build-manifest.json'),
    JSON.stringify({ version, nodeEnv: NODE_ENV, appSlug: APP_SLUG, coreGzip: coreGz, chunks: manifest }, null, 2),
)

console.log(`\n✓ Build output: ${outDir}`)
console.log('  Next: node scripts/upload.mjs <env> --version ' + version)
