/**
 * Country flags with no icon font, no sprite sheet and no network.
 *
 * 5.1.5 rendered every flag as `<span class="iconify" data-icon="flag:gb-4x3">`
 * and loaded Iconify 3.1.0 from `code.iconify.design` to swap each one for an
 * SVG. With the dropdown built eagerly that is **252 icon lookups** against a
 * third-party origin - on a page that may never open the picker at all - plus
 * the library itself, plus a third origin on the critical path.
 *
 * A flag is two Unicode regional indicator characters: `GB` is U+1F1EC U+1F1E7,
 * which the platform's own emoji font draws. Three lines, zero bytes, zero
 * requests.
 *
 * Windows is the exception: Segoe UI Emoji ships no country flags, so it draws
 * the two indicator letters instead. That is a legible fallback rather than
 * tofu, but it looks accidental, so on Windows we render an explicit two-letter
 * chip and let it look deliberate.
 */

const FIRST_INDICATOR = 0x1f1e6
const LETTER_A = 65

/** `GB` -> 🇬🇧. Returns '' for anything that is not two ASCII letters. */
export function flagEmoji(code: string): string {
    const value = String(code || '').toUpperCase()
    if (!/^[A-Z]{2}$/.test(value)) return ''
    return String.fromCodePoint(
        FIRST_INDICATOR + value.charCodeAt(0) - LETTER_A,
        FIRST_INDICATOR + value.charCodeAt(1) - LETTER_A,
    )
}

type MaybeUAData = { userAgentData?: { platform?: string }; platform?: string; userAgent?: string }

/**
 * Whether the platform draws flag emoji at all.
 *
 * Deliberately a platform check rather than a font measurement: measuring means
 * a canvas, a reflow, or both, on every page with a phone field, to decide the
 * appearance of one 20px glyph.
 */
export function supportsFlagEmoji(nav: unknown = typeof navigator === 'undefined' ? null : navigator): boolean {
    const agent = nav as MaybeUAData | null
    if (!agent) return true
    const platform =
        (agent.userAgentData && agent.userAgentData.platform) || agent.platform || agent.userAgent || ''
    return !/win/i.test(String(platform))
}

export const FLAG_CSS = `
.ffp-flag{display:inline-block;min-width:1.35em;font-size:1.15em;line-height:1;font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif}
.ffp-flag[data-chip="true"]{min-width:2.2em;padding:1px 3px;font-size:.7em;font-family:inherit;font-weight:700;letter-spacing:.02em;text-align:center;border:1px solid currentColor;border-radius:3px;opacity:.75}
`

/** The flag node for a country: emoji where it renders, a lettered chip where it does not. */
export function flagNode(code: string, emoji = supportsFlagEmoji()): HTMLElement {
    const node = document.createElement('span')
    node.className = 'ffp-flag'
    node.setAttribute('aria-hidden', 'true')
    if (emoji) {
        node.textContent = flagEmoji(code)
    } else {
        node.setAttribute('data-chip', 'true')
        node.textContent = String(code || '').toUpperCase()
    }
    return node
}
