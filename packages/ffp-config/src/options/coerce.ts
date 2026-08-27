/** Coercions lifted verbatim from runtime 5.1.5 so normalized output matches. */

export function clamp(value: unknown, min: number, max: number, fallback: number): number {
    const n = Number(value)
    if (!Number.isFinite(n)) return fallback
    return Math.min(max, Math.max(min, n))
}

/** Webflow's day picker is 1-7; easepick wants 0-6, and 7 means Sunday. */
export function toFirstDay(raw: unknown): number {
    const day = Number(raw)
    if (!Number.isFinite(day)) return 0
    if (day === 7) return 0
    if (day < 0 || day > 6) return 0
    return day
}

export function toLang(raw: unknown): string {
    if (!raw || raw === 'en') return 'en-US'
    return String(raw)
}

export function str(raw: unknown, fallback: string): string {
    return raw === null || raw === undefined || String(raw) === '' ? fallback : String(raw)
}

export function strOrNull(raw: unknown): string | null {
    return raw === null || raw === undefined || String(raw) === '' ? null : String(raw)
}

/**
 * A number, or the fallback when the attribute is absent.
 *
 * The absent check is load-bearing and is a fix, not a port: `Number(null)` is
 * `0`, so 5.1.5's `Number(el.getAttribute('data-max'))` turned a missing
 * `data-max` into a slider whose maximum was zero, and a missing
 * `data-max-default` into a range slider pinned to `0,0`. Every table entry
 * already declares what it wants instead - `num(r, 100)`, `num(r, NaN)` - and
 * this is what lets that declaration take effect.
 */
export function num(raw: unknown, fallback: number): number {
    if (raw === null || raw === undefined || raw === '') return fallback
    const n = Number(raw)
    return Number.isFinite(n) ? n : fallback
}

export function posIntOr(raw: unknown, fallback: number): number {
    const n = parseInt(String(raw), 10)
    return Number.isFinite(n) && n > 0 ? n : fallback
}

/**
 * Attribute presence, not truthiness.
 *
 * This is the fix for the live bug at 5.1.5 L1106: `getAttribute('data-searchable')`
 * returns the string "false", which is truthy, so every select whose searchable
 * toggle is OFF is searchable on customer sites today. Treat the literal strings
 * "false", "0" and "" as false; anything else present is true.
 */
export function boolAttr(raw: unknown): boolean {
    if (raw === null || raw === undefined) return false
    const normalized = String(raw).trim().toLowerCase()
    if (normalized === '' || normalized === 'false' || normalized === '0') return false
    return true
}
