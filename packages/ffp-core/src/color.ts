/**
 * hex <-> rgb <-> hsv.
 *
 * Replaces the private `toRgba` duplicated inside the date field and the colour
 * maths spectrum brought in. Pure, tiny, and in core because the theme layer
 * needs it before any chunk has loaded.
 */

export type Rgb = { r: number; g: number; b: number; a: number }
export type Hsv = { h: number; s: number; v: number }

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const clamp255 = (n: number) => Math.min(255, Math.max(0, Math.round(n)))

/**
 * Parse any colour spelling a customer can type into a Webflow field.
 *
 * Returns null rather than a fallback colour: callers need to tell "unset" from
 * "black", because unset means fall through to the next rung of the config
 * ladder and black means the author chose black.
 */
export function parseColor(input: unknown): Rgb | null {
    if (input === null || input === undefined) return null
    const value = String(input).trim().toLowerCase()
    if (!value || value === 'transparent') return null

    const hex = value.match(/^#?([0-9a-f]{3,8})$/)
    if (hex) {
        const digits = hex[1]
        if (digits.length === 3 || digits.length === 4) {
            const parts = digits.split('').map((d) => parseInt(d + d, 16))
            return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] === undefined ? 1 : parts[3] / 255 }
        }
        if (digits.length === 6 || digits.length === 8) {
            const pair = (i: number) => parseInt(digits.slice(i * 2, i * 2 + 2), 16)
            return { r: pair(0), g: pair(1), b: pair(2), a: digits.length === 8 ? pair(3) / 255 : 1 }
        }
        return null
    }

    const fn = value.match(/^rgba?\(([^)]+)\)$/)
    if (fn) {
        const parts = fn[1].split(/[\s,/]+/).filter(Boolean).map(Number)
        if (parts.length < 3 || parts.some((n) => !Number.isFinite(n))) return null
        return {
            r: clamp255(parts[0]),
            g: clamp255(parts[1]),
            b: clamp255(parts[2]),
            a: parts[3] === undefined ? 1 : clamp01(parts[3]),
        }
    }

    return null
}

export function toHex({ r, g, b, a }: Rgb, withAlpha = false): string {
    const pair = (n: number) => clamp255(n).toString(16).padStart(2, '0')
    const base = `#${pair(r)}${pair(g)}${pair(b)}`
    return withAlpha && a < 1 ? `${base}${pair(a * 255)}` : base
}

export function toRgbaString({ r, g, b, a }: Rgb): string {
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255
    const max = Math.max(rn, gn, bn)
    const min = Math.min(rn, gn, bn)
    const delta = max - min

    let hue = 0
    if (delta !== 0) {
        if (max === rn) hue = ((gn - bn) / delta) % 6
        else if (max === gn) hue = (bn - rn) / delta + 2
        else hue = (rn - gn) / delta + 4
    }
    hue = Math.round(hue * 60)
    if (hue < 0) hue += 360

    return { h: hue, s: max === 0 ? 0 : delta / max, v: max }
}

export function hsvToRgb({ h, s, v }: Hsv, a = 1): Rgb {
    const chroma = v * s
    const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - chroma
    const sector = Math.floor(((h % 360) + 360) % 360 / 60)
    const table: Array<[number, number, number]> = [
        [chroma, x, 0],
        [x, chroma, 0],
        [0, chroma, x],
        [0, x, chroma],
        [x, 0, chroma],
        [chroma, 0, x],
    ]
    const [r, g, b] = table[sector]
    return { r: clamp255((r + m) * 255), g: clamp255((g + m) * 255), b: clamp255((b + m) * 255), a }
}

/** Perceived luminance, for picking readable text over an arbitrary swatch. */
export function isDark({ r, g, b }: Rgb): boolean {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}
