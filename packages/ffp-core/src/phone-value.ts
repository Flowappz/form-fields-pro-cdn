/**
 * Phone value normalisation. Pure, and deliberately not in the phone chunk.
 *
 * These four functions are consumed by validation and by the submitted payload,
 * both of which live in core and both of which run on forms whose phone widget
 * may never have mounted. They are also the highest-value pure functions in the
 * runtime to have tests around: a mistake here silently changes what a customer
 * receives as a lead, and it changes it into something that still looks like a
 * phone number.
 *
 * What is *not* here is the 252-country table. 5.1.5 built `PHONE_DIAL_CODE_SET`
 * from it at module scope, which is one of the reasons 6 kB of country names
 * ship to every visitor of every site whether or not a phone field exists. Core
 * holds a registry instead and the phone chunk fills it on load - the chunk is
 * always present when a phone widget is, because it is what makes it one.
 */

/** ISO 3166-1 alpha-2 to dial code, as strings. Filled by the phone chunk. */
let dialByIso: Record<string, string> = {}
let knownDialCodes: Record<string, true> = {}

export function registerDialCodes(map: Record<string, string | number>): void {
    dialByIso = {}
    knownDialCodes = {}
    for (const iso of Object.keys(map)) {
        const dial = String(map[iso])
        dialByIso[iso] = dial
        knownDialCodes[dial] = true
    }
}

export function dialCodeForIso(iso: string | null): string | null {
    if (!iso) return null
    return dialByIso[iso] || null
}

/**
 * True only when the value is exactly a known country dial code, with an
 * optional trailing space. This is what stops a widget that has been given a
 * country but no digits from counting as a filled required field.
 *
 * Full numbers like `+8801686407947` must **not** match. 5.1.5 originally used
 * `/^\+\d+\s*$/`, which matched every international number and discarded them
 * all as empty; the dial-code set is the fix, and it is why an unregistered
 * registry answers `false` rather than guessing. An unregistered registry means
 * the phone chunk never loaded, in which case there is no widget to have left
 * half-filled.
 */
export function isDialCodeOnlyPhoneValue(value: unknown): boolean {
    const trimmed = String(value == null ? '' : value).trim()
    const match = trimmed.match(/^\+(\d+)\s*$/)
    if (!match) return false
    return knownDialCodes[match[1]] === true
}

/** Build `+{digits}` from local, international, or messy autofill values. */
export function normalizePhoneToE164(value: unknown, dialCode?: string | null): string {
    const raw = String(value == null ? '' : value).trim()
    if (!raw) return ''
    if (isDialCodeOnlyPhoneValue(raw)) return '+' + raw.replace(/\D/g, '')

    const hasPlus = raw.charAt(0) === '+'
    const nums = raw.replace(/\D/g, '')
    if (!nums) return ''

    if (hasPlus) return '+' + nums

    // Digits already include the selected dial code - someone typed `8801…`
    // without the plus. The length test is what keeps a national number that
    // happens to start with its own country's digits from being mangled.
    if (dialCode && nums.indexOf(dialCode) === 0 && nums.length > dialCode.length + 3) {
        return '+' + nums
    }

    if (dialCode) {
        const national = nums.replace(/^0+/, '')
        if (!national) return '+' + dialCode
        if (national.indexOf(dialCode) === 0 && national.length > dialCode.length + 3) {
            return '+' + national
        }
        return '+' + dialCode + national
    }

    return nums
}

export function formatPhoneDisplay(e164: unknown, dialCode?: string | null): string {
    const cleaned = String(e164 == null ? '' : e164).replace(/[^\d+]/g, '')
    if (cleaned.charAt(0) !== '+') return cleaned
    const nums = cleaned.slice(1)
    if (dialCode && nums.indexOf(dialCode) === 0 && nums.length > dialCode.length) {
        return '+' + dialCode + ' ' + nums.slice(dialCode.length)
    }
    return cleaned
}

/** Test seam. */
export function resetDialCodes(): void {
    dialByIso = {}
    knownDialCodes = {}
}
