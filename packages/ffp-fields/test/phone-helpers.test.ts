import { describe, expect, it } from 'vitest'
import { COUNTRIES, dialCodeMap, findByCode } from '../src/phone/countries'
import { flagEmoji, supportsFlagEmoji } from '../src/phone/flags'
import { regionFromLocale, regionFromTimeZone } from '../src/phone/geo'

describe('the country table', () => {
    it('is the same 252 rows, in the same order', () => {
        // A reordered list is a dropdown that moves under returning visitors.
        expect(COUNTRIES.length).toBe(252)
        expect(COUNTRIES[0]).toEqual({ name: 'Afghanistan', code: 'AF', phone: '93' })
        expect(COUNTRIES[COUNTRIES.length - 1]).toEqual({ name: 'Zimbabwe', code: 'ZW', phone: '263' })
    })

    it('keeps dial codes as strings, including the ones with leading structure', () => {
        expect(findByCode('BD')!.phone).toBe('880')
        expect(findByCode('US')!.phone).toBe('1')
        expect(findByCode('GB')!.phone).toBe('44')
    })

    it('looks up case-insensitively and answers null for nonsense', () => {
        expect(findByCode('gb')!.code).toBe('GB')
        expect(findByCode('ZZ')).toBeNull()
        expect(findByCode(null)).toBeNull()
    })

    it('produces the ISO-to-dial map core registers', () => {
        const map = dialCodeMap()
        expect(map.BD).toBe('880')
        expect(Object.keys(map).length).toBe(COUNTRIES.length)
    })
})

describe('flags', () => {
    it('builds a flag from two regional indicators', () => {
        // 🇬🇧 is U+1F1EC U+1F1E7 - no icon font, no network, no 252 lookups.
        expect(flagEmoji('GB')).toBe('\u{1F1EC}\u{1F1E7}')
        expect(flagEmoji('bd')).toBe('\u{1F1E7}\u{1F1E9}')
        expect([...flagEmoji('US')].length).toBe(2)
    })

    it('is empty for anything that is not two letters', () => {
        expect(flagEmoji('')).toBe('')
        expect(flagEmoji('G')).toBe('')
        expect(flagEmoji('G1')).toBe('')
    })

    it('knows Windows has no flag glyphs', () => {
        expect(supportsFlagEmoji({ userAgentData: { platform: 'Windows' } })).toBe(false)
        expect(supportsFlagEmoji({ platform: 'Win32' })).toBe(false)
        expect(supportsFlagEmoji({ platform: 'MacIntel' })).toBe(true)
        expect(supportsFlagEmoji({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' })).toBe(true)
    })
})

describe('geo inference', () => {
    it('reads a country out of the time zone', () => {
        expect(regionFromTimeZone('Asia/Dhaka')).toBe('BD')
        expect(regionFromTimeZone('Europe/London')).toBe('GB')
        expect(regionFromTimeZone('America/Sao_Paulo')).toBe('BR')
        // Multi-zone countries list the zones people actually live in.
        expect(regionFromTimeZone('America/Los_Angeles')).toBe('US')
        expect(regionFromTimeZone('Australia/Perth')).toBe('AU')
    })

    it('answers null for a zone it does not carry', () => {
        // The table is not exhaustive on purpose; the locale is the fallback.
        expect(regionFromTimeZone('Antarctica/Troll')).toBeNull()
        expect(regionFromTimeZone('')).toBeNull()
    })

    it('reads a region out of the locale, maximizing a bare language', () => {
        expect(regionFromLocale('en-GB')).toBe('GB')
        expect(regionFromLocale('bn')).toBe('BD')
        expect(regionFromLocale('pt-BR')).toBe('BR')
    })

    it('falls back to the tag suffix when Intl refuses the tag', () => {
        expect(regionFromLocale('not a tag_DE')).toBe('DE')
        expect(regionFromLocale('')).toBeNull()
        expect(regionFromLocale(null)).toBeNull()
    })
})
