/**
 * Regenerate packages/ffp-fields/src/phone/countries.ts from the frozen runtime.
 *
 * The table is data, not code, and it is the one piece of the phone field that
 * must survive the rewrite unchanged: a wrong dial code is a phone number that
 * fails validation for an entire country, and a reordered list is a dropdown
 * that moves under returning visitors. Generating it means nobody retypes it.
 *
 * The whole file is emitted from the template below rather than patched in
 * place. The first version of this script kept the existing header and tail by
 * splitting the target on `]]\n`, which ate one newline per run: the second run
 * produced `]]export const COUNTRIES`, and the third found no delimiter at all
 * and wrote the string "undefined" over the accessors. A generator that damages
 * its own output on the second run cannot be a CI check, and `countries-are-clean`
 * in .github/workflows/ci.yml is exactly that check.
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = resolve(ROOT, 'src/5.1.5/form-fields-pro-cdn.js')
const TARGET = resolve(ROOT, 'packages/ffp-fields/src/phone/countries.ts')

const source = readFileSync(SOURCE, 'utf8')
const match = source.match(/const countries = (\[\[[\s\S]*?\]\])\.map/)
if (!match) {
    console.error('✗ Could not find the `countries` table in', SOURCE)
    process.exit(1)
}

const rows = JSON.parse(match[1])
if (!Array.isArray(rows) || rows.length < 200) {
    console.error(`✗ Refusing to write a table of ${rows.length} rows`)
    process.exit(1)
}

const file = `/**
 * ISO 3166-1 alpha-2 code, English name, dial code.
 *
 * GENERATED from src/5.1.5/form-fields-pro-cdn.js by scripts/extract-countries.mjs
 * - the same ${rows.length} rows, in the same order, so the dropdown a customer's visitor
 * sees is ordered exactly as it was. Not hand-transcribed: a typo in a dial code
 * here is a phone number that fails validation for a whole country.
 *
 * Tuples rather than objects: ${rows.length} repetitions of \`{name:...,code:...,phone:...}\`
 * cost about 4 kB before gzip and buy nothing the accessors below do not.
 */
export type Country = { name: string; code: string; phone: string }

const RAW: Array<[string, string, number]> = ${match[1]}

export const COUNTRIES: Country[] = RAW.map(([name, code, phone]) => ({
    name,
    code,
    phone: String(phone),
}))

export function findByCode(code: string | null | undefined): Country | null {
    if (!code) return null
    const wanted = String(code).toUpperCase()
    for (const country of COUNTRIES) if (country.code === wanted) return country
    return null
}

/** The ISO-to-dial map core needs for validation and the submitted payload. */
export function dialCodeMap(): Record<string, string> {
    const map: Record<string, string> = {}
    for (const country of COUNTRIES) map[country.code] = country.phone
    return map
}
`

writeFileSync(TARGET, file)
console.log(`✓ ${rows.length} countries written to ${TARGET}`)
