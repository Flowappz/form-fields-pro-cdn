import { beforeEach, describe, expect, it } from 'vitest'
import {
    dialCodeForIso,
    formatPhoneDisplay,
    isDialCodeOnlyPhoneValue,
    normalizePhoneToE164,
    registerDialCodes,
    resetDialCodes,
} from '../src/phone-value'

beforeEach(() => {
    resetDialCodes()
    registerDialCodes({ BD: 880, GB: 44, US: 1, KZ: 7 })
})

describe('isDialCodeOnlyPhoneValue', () => {
    it('matches a bare dial code, with or without the trailing space', () => {
        expect(isDialCodeOnlyPhoneValue('+880')).toBe(true)
        expect(isDialCodeOnlyPhoneValue('+880 ')).toBe(true)
        expect(isDialCodeOnlyPhoneValue(' +44 ')).toBe(true)
    })

    it('does not match a full number', () => {
        // The bug the dial-code set exists to fix: `/^\+\d+\s*$/` matched this,
        // so every international number was treated as an empty field and
        // discarded before it reached the payload.
        expect(isDialCodeOnlyPhoneValue('+8801686407947')).toBe(false)
    })

    it('does not match an unknown dial code', () => {
        expect(isDialCodeOnlyPhoneValue('+999')).toBe(false)
    })

    it('answers false with no registry rather than guessing', () => {
        // No registry means the phone chunk never loaded, so there is no widget
        // to have left half-filled. Guessing here would discard real numbers.
        resetDialCodes()
        expect(isDialCodeOnlyPhoneValue('+880')).toBe(false)
    })
})

describe('normalizePhoneToE164', () => {
    it('keeps an already international number', () => {
        expect(normalizePhoneToE164('+880 1686 407947', '880')).toBe('+8801686407947')
    })

    it('strips a national leading zero and prefixes the dial code', () => {
        expect(normalizePhoneToE164('07700 900123', '44')).toBe('+447700900123')
    })

    it('does not double the dial code when the digits already carry it', () => {
        expect(normalizePhoneToE164('8801686407947', '880')).toBe('+8801686407947')
    })

    it('treats a short number starting with its own dial code as national', () => {
        // `4412` is four digits: too short to be `+44` plus a number, so it is a
        // national number that happens to start with 44.
        expect(normalizePhoneToE164('4412', '44')).toBe('+444412')
    })

    it('returns a bare dial code unchanged', () => {
        expect(normalizePhoneToE164('+880', '880')).toBe('+880')
    })

    it('returns the digits alone with no country selected', () => {
        expect(normalizePhoneToE164('7700900123', null)).toBe('7700900123')
    })

    it('is empty for empty or letters-only input', () => {
        expect(normalizePhoneToE164('', '44')).toBe('')
        expect(normalizePhoneToE164('   ', '44')).toBe('')
        expect(normalizePhoneToE164('call me', '44')).toBe('')
    })
})

describe('formatPhoneDisplay', () => {
    it('spaces the dial code off from the number', () => {
        expect(formatPhoneDisplay('+8801686407947', '880')).toBe('+880 1686407947')
    })

    it('leaves a value with no plus alone', () => {
        expect(formatPhoneDisplay('07700900123', '44')).toBe('07700900123')
    })

    it('leaves a number that does not start with the selected dial code', () => {
        expect(formatPhoneDisplay('+17700900123', '44')).toBe('+17700900123')
    })
})

describe('dialCodeForIso', () => {
    it('reads the registered map and is null for anything else', () => {
        expect(dialCodeForIso('BD')).toBe('880')
        expect(dialCodeForIso('ZZ')).toBeNull()
        expect(dialCodeForIso(null)).toBeNull()
    })
})
