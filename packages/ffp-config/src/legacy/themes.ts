import type { ThemeTokens } from '../types'

/**
 * Positional key order for the tilde-delimited compact theme blobs the Designer
 * Extension has emitted historically. Index in the array === index in the split.
 *
 * The tilde format exists because Webflow limits how many custom attributes an
 * element can carry; config v2 replaces it with a single JSON attribute, but the
 * reader must understand it forever - published customer HTML cannot be rewritten.
 */
const DATE_POSITIONS = [
    'selectedDateTextColorLight',
    'selectedDateBackgroundColorLight',
    'todayDateColorLight',
    'calendarBackgroundColorLight',
    'calendarBorderColorLight',
    'dateTextColorLight',
    'weekdayTextColorLight',
    'headerTextColorLight',
    'dropdownBackgroundColorLight',
    'hoverBackgroundColorLight',
    'selectedDateTextColorDark',
    'selectedDateBackgroundColorDark',
    'todayDateColorDark',
    'calendarBackgroundColorDark',
    'calendarBorderColorDark',
    'dateTextColorDark',
    'weekdayTextColorDark',
    'headerTextColorDark',
    'dropdownBackgroundColorDark',
    'hoverBackgroundColorDark',
    'borderRadius',
    'calendarTheme',
] as const

const SLIDER_POSITIONS = [
    'maxMinTextColorLight',
    'tooltipTextColorLight',
    'sliderColorLight',
    'trackColorLight',
    'maxMinTextColorDark',
    'tooltipTextColorDark',
    'sliderColorDark',
    'trackColorDark',
] as const

const NPS_POSITIONS = [
    'textColorLight',
    'backgroundColorLight',
    'hoverTextColorLight',
    'hoverBackgroundColorLight',
    'selectedTextColorLight',
    'selectedBackgroundColorLight',
    'borderColorLight',
    'borderRadius',
    'layout',
    'textColorDark',
    'backgroundColorDark',
    'hoverTextColorDark',
    'hoverBackgroundColorDark',
    'selectedTextColorDark',
    'selectedBackgroundColorDark',
    'borderColorDark',
] as const

/**
 * Minimum tilde arity before a blob is considered usable. Below this the value is
 * rejected and resolution falls through to the next rung, which is the behaviour
 * runtime 5.1.5 relies on. Arity is a floor, not an equality check: the Designer
 * has emitted different lengths over time and longer blobs must still parse.
 */
const MIN_PARTS = { date: 21, slider: 8, nps: 9 } as const

function fromPositions(parts: string[], positions: readonly string[]): ThemeTokens {
    const out: ThemeTokens = {}
    for (let i = 0; i < positions.length; i++) {
        const value = parts[i]
        if (value !== undefined) out[positions[i]] = value
    }
    return out
}

function tryJson(value: string): ThemeTokens | null {
    if (value.charAt(0) !== '{') return null
    try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' ? (parsed as ThemeTokens) : null
    } catch {
        return null
    }
}

/**
 * Parse a compact theme blob in either representation.
 *
 * Deliberately more permissive than any single parser in 5.1.5. There, only
 * `parseNpsTheme` sniffed for JSON; `parseDateTheme` and `parseSliderTheme` were
 * tilde-only, so a JSON blob split to one element, failed the arity gate, and
 * silently fell through to a lower-priority rung. Accepting JSON for every type
 * means a date or slider field whose blob happens to be JSON now resolves from
 * the blob instead of from defaults.
 */
export function parseCompactTheme(raw: unknown, kind: keyof typeof MIN_PARTS): ThemeTokens | null {
    if (!raw) return null
    const value = String(raw)

    const json = tryJson(value)
    if (json) return json

    const parts = value.split('~')
    if (parts.length < MIN_PARTS[kind]) return null

    if (kind === 'date') return fromPositions(parts, DATE_POSITIONS)
    if (kind === 'slider') return fromPositions(parts, SLIDER_POSITIONS)
    return fromPositions(parts, NPS_POSITIONS)
}

/** `pickColor` from 5.1.5: an all-whitespace value counts as absent. */
export function pick<T>(value: unknown, fallback: T): T | string {
    return value && String(value).trim() ? (value as string) : fallback
}

/** Slider treats an all-white palette as "unset" and falls back to defaults. */
export function isWhite(value: unknown): boolean {
    const normalized = String(value || '')
        .replace(/\s/g, '')
        .toLowerCase()
    return (
        !normalized ||
        normalized === 'rgb(255,255,255)' ||
        normalized === '#ffffff' ||
        normalized === '#fff' ||
        normalized === 'white'
    )
}

const colorKey = (value: unknown) =>
    String(value || '')
        .replace(/\s/g, '')
        .toLowerCase()

/**
 * High contrast used to write the same colour onto fill and empty track in dark
 * mode (both white). The filled portion then vanished into the track, and on a
 * light page the thumb disappeared too. Keep the fill; flip the empty track.
 */
export function contrastSliderTrack(fill: string | undefined, track: string | undefined): string {
    const next = track && String(track).trim() ? String(track) : ''
    if (!fill || !next || colorKey(fill) !== colorKey(next)) return next
    return isWhite(fill) ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
}

export function isStockBlue(value: unknown): boolean {
    const normalized = String(value || '')
        .replace(/\s/g, '')
        .toLowerCase()
    return !normalized || normalized === 'rgb(20,110,245)' || normalized === '#146ef5'
}

/**
 * NPS keeps the selected color in step with hover when the author never moved it
 * off the stock blue. Preserved exactly - dropping it visibly changes every NPS
 * field whose hover color was customised but whose selected color was not.
 */
export function followHoverIfStockBlue(selected: unknown, hover: unknown): unknown {
    if (isStockBlue(selected) && hover && !isStockBlue(hover)) return hover
    return selected
}

/** NPS radius is stored bare or px-suffixed; output is always px-suffixed. */
export function normalizeRadius(value: unknown): string | null {
    if (value === undefined || value === null || String(value).trim() === '') return null
    return `${String(value).replace(/px$/i, '')}px`
}
