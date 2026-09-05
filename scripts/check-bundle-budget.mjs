#!/usr/bin/env node
/**
 * Fail the build when a bundle outgrows its budget.
 *
 * The whole delivery design was chosen for size: a tiny core, aggressive
 * per-field splitting, zero runtime dependencies. That erodes one reasonable
 * exception at a time unless something fails, so this is a gate and not a
 * report. Raising a number here is a deliberate, reviewable change.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { gzipSync } from 'zlib'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Gzipped byte budgets.
 *
 * Phase 0 ships the existing field code verbatim, so these are set from what
 * that code actually costs today. Each phase that retires a vendor should lower
 * the matching number in the same pull request - a phase that removes a
 * dependency without shrinking its chunk did not do what it claimed.
 *
 * `select` is the exception that proves the rule: phase 1 grew the chunk itself
 * (1802 -> 1888 B) because it now contains a select widget rather than two
 * `loadScript` calls, while removing 23 kB of Select2, 4 kB of its CSS and the
 * jQuery dependency from the page. Judge a phase on the page total, which
 * `pageTotal` below prints, not on one chunk.
 */
const BUDGETS = {
    /**
     * Raised once, deliberately, from 9 kB when the submission pipeline landed.
     *
     * The 9 kB figure was set while core meant delivery only - registry, loader,
     * config reader, theming, licence, beacon - measuring 7243 B. Core's job per
     * A1 is "registry, loader, forms, validation, submission", and the second
     * half of that had not been written yet. Porting it added 4124 B gz:
     * submission and payload building, validation, conditional logic,
     * multi-step, phone normalisation.
     *
     * None of it can be lazy-loaded honestly. A chunk that fails to arrive
     * leaves a widget missing, which is survivable - the native input still
     * works. A submission path that fails to arrive loses the lead.
     *
     * The number to judge this against is the 5.1.5 monolith: 21,471 B gz for
     * this same code plus all nine widgets, on every page. Core now carries the
     * whole non-widget runtime for 11.4 kB, and a select page totals 13.3 kB
     * against 21.5 kB plus roughly 27 kB of Select2. The budget stays tight
     * (~600 B of headroom) so the next kilobyte is still an argument someone has
     * to make on purpose.
     */
    core: 12 * 1024,
    // Shared by select, phone and date. Paid once per page, not per field, so it
    // is cheaper than it looks next to the per-field numbers below.
    'ui-popover': 3 * 1024,
    /**
     * Phase 2 grew the chunk (4600 -> 5323 B) because it now *is* the calendar
     * rather than two `loadScript` calls and a blocking stylesheet fetch, while
     * removing 17 kB of easepick, 3 kB of its CSS and a round trip to jsdelivr.
     * Same shape as `select` in phase 1: judge it on the page total below.
     */
    date: 5.5 * 1024,
    /**
     * The biggest chunk, and the only one that is mostly data: 252 countries
     * with names and dial codes, plus the time-zone table the geo default reads.
     * Phase 4 took it from 5602 to 6978 B and removed, from the page, the
     * Iconify library on a third origin, **up to 252 flag-icon requests**, the
     * ipinfo JSONP call that disclosed every visitor's IP, and the last
     * dependency on Webflow's jQuery. Chunk up, page down by an order of
     * magnitude.
     */
    phone: 7 * 1024,
    // Phase 1 de-jQueried NPS and deleted its inline painter: 3686 -> 2552 B.
    nps: 3 * 1024,
    /**
     * Phase 3: 2652 -> 3329 B, and Dropzone's ~14.5 kB plus its stylesheet stop
     * being fetched from unpkg. The chunk now contains the picker, previews and
     * remove links it used to download.
     */
    file: 3.5 * 1024,
    /**
     * Phase 3 was 2477 B against ~7 kB of noUiSlider. The Designer stand-in
     * hide and the Webflow / high-contrast thumb rules that followed are CSS
     * that has to ship in this chunk: a lazy split would leave a grey bar on
     * the page until the extra file arrived. 3088 B gz today.
     */
    slider: 3.25 * 1024,
    select: 2 * 1024,
    /**
     * Phase 3: 1471 -> 3363 B, against ~17 kB of spectrum and its CSS. It also
     * retires the one dependency that was **unpinned**, so an upstream publish
     * can no longer change every customer site without a deploy from us.
     */
    color: 3.5 * 1024,
    userip: 1 * 1024,
}

/**
 * The build that was actually produced last, by mtime.
 *
 * Not by name: sorting `['5.1.5', '9.9.9-dev']` puts the dev placeholder last
 * forever, so the gate would keep measuring a stale build and keep passing. A
 * size gate that reads the wrong bytes is worse than no gate.
 */
function latestBuild() {
    const buildDir = resolve(ROOT, 'build')
    if (!existsSync(buildDir)) return null
    const versions = readdirSync(buildDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => resolve(buildDir, d.name))
        .filter((d) => existsSync(resolve(d, 'build-manifest.json')))
        .sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs)
    return versions.length ? versions[versions.length - 1] : null
}

const dir = latestBuild()
if (!dir) {
    console.error('✗ No build/ output. Run scripts/build.mjs first.')
    process.exit(1)
}

const manifest = JSON.parse(readFileSync(resolve(dir, 'build-manifest.json'), 'utf8'))
const gz = (path) => gzipSync(readFileSync(path), { level: 9 }).length

const rows = [['core', manifest.coreGzip, BUDGETS.core]]
for (const name of Object.keys(manifest.chunks).sort()) {
    const file = new URL(manifest.chunks[name].url).pathname.split('/').pop()
    rows.push([name, gz(resolve(dir, 'chunks', file)), BUDGETS[name]])
}

let failed = false
console.log(`Bundle budgets for v${manifest.version} (gzipped bytes)\n`)
for (const [name, size, budget] of rows) {
    const over = budget !== undefined && size > budget
    if (over) failed = true
    const limit = budget === undefined ? '   no budget' : `${String(budget).padStart(6)} B`
    console.log(`  ${over ? 'FAIL' : ' ok '}  ${name.padEnd(8)} ${String(size).padStart(6)} B / ${limit}`)
}

// The number a customer actually pays on the most common form we ship.
// Shared chunks are pulled in through `deps` and counted once, which is the
// whole reason `ui-popover` exists - counting it per field would say a select
// page costs what three of them do.
const common = ['date', 'select', 'phone']
const needed = new Set()
const add = (name) => {
    if (needed.has(name)) return
    needed.add(name)
    for (const dep of manifest.chunks[name]?.deps ?? []) add(dep)
}
for (const name of common) if (manifest.chunks[name]) add(name)

const sizeOf = (name) => rows.find((r) => r[0] === name)?.[1] ?? 0
const total = manifest.coreGzip + [...needed].reduce((sum, n) => sum + sizeOf(n), 0)
const shared = [...needed].filter((n) => !common.includes(n))
console.log(
    `\n  date + select + phone page: ${total} B gz core+chunks (vendors excluded)` +
        (shared.length ? `\n  including shared: ${shared.join(', ')}` : ''),
)

if (failed) {
    console.error('\n✗ Over budget. Move code into a lazy chunk rather than raising the number.')
    process.exit(1)
}
console.log('\n✓ All bundles within budget')
