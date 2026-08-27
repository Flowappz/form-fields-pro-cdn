import { describe, expect, it } from 'vitest'
import {
    addDays,
    addMonths,
    daysInMonth,
    daysMatrix,
    format,
    isSameDay,
    monthNames,
    normalizeFirstDay,
    normalizeLocale,
    parse,
    startOfDay,
    weekdayNames,
} from '../src/dateengine'

const d = (y: number, m: number, day: number) => new Date(y, m, day)

describe('month maths', () => {
    it('clamps the day when the target month is shorter', () => {
        // Raw `setMonth` turns 31 January into 3 March and skips February.
        expect(format(addMonths(d(2026, 0, 31), 1), 'YYYY-MM-DD')).toBe('2026-02-28')
        expect(format(addMonths(d(2024, 0, 31), 1), 'YYYY-MM-DD')).toBe('2024-02-29')
    })

    it('steps backwards across a year boundary', () => {
        expect(format(addMonths(d(2026, 0, 15), -1), 'YYYY-MM-DD')).toBe('2025-12-15')
    })

    it('knows the length of a month, leap years included', () => {
        expect(daysInMonth(2026, 1)).toBe(28)
        expect(daysInMonth(2024, 1)).toBe(29)
        expect(daysInMonth(2026, 11)).toBe(31)
    })

    it('adds days across a month boundary', () => {
        expect(format(addDays(d(2026, 7, 31), 1), 'YYYY-MM-DD')).toBe('2026-09-01')
    })
})

describe('daysMatrix', () => {
    it('always returns six weeks', () => {
        expect(daysMatrix(2026, 7, 0).length).toBe(42)
        expect(daysMatrix(2026, 1, 0).length).toBe(42)
    })

    it('starts on the requested weekday', () => {
        // August 2026 starts on a Saturday.
        const sunday = daysMatrix(2026, 7, 0)
        expect(sunday[0].getDay()).toBe(0)
        const monday = daysMatrix(2026, 7, 1)
        expect(monday[0].getDay()).toBe(1)
    })

    it('leads with the tail of the previous month and ends in the next', () => {
        const grid = daysMatrix(2026, 7, 0)
        expect(format(grid[0], 'YYYY-MM-DD')).toBe('2026-07-26')
        expect(grid[41].getMonth()).toBe(8)
    })

    it('has no gaps', () => {
        const grid = daysMatrix(2026, 1, 1)
        for (let i = 1; i < grid.length; i++) {
            expect(isSameDay(grid[i], addDays(grid[i - 1], 1))).toBe(true)
        }
    })
})

describe('format', () => {
    const date = new Date(2026, 7, 26, 15, 4, 5)

    it('handles the formats customers actually write', () => {
        expect(format(date, 'MM/DD/YYYY')).toBe('08/26/2026')
        expect(format(date, 'DD/MM/YYYY')).toBe('26/08/2026')
        expect(format(date, 'YYYY-MM-DD')).toBe('2026-08-26')
        expect(format(date, 'D/M/YY')).toBe('26/8/26')
        expect(format(date, 'MMMM D, YYYY')).toBe('August 26, 2026')
        expect(format(date, 'ddd, MMM D')).toBe('Wed, Aug 26')
    })

    it('formats time tokens', () => {
        expect(format(date, 'HH:mm:ss')).toBe('15:04:05')
        expect(format(date, 'hh:mm A')).toBe('03:04 PM')
        expect(format(new Date(2026, 7, 26, 0, 30), 'hh:mm a')).toBe('12:30 am')
    })

    it('passes bracketed text through untouched', () => {
        expect(format(date, '[Booked on] MMMM D')).toBe('Booked on August 26')
        // The bracketed D must not be read as a token.
        expect(format(date, '[D]D')).toBe('D26')
    })

    it('uses the locale for names and nothing else', () => {
        expect(format(date, 'MMMM YYYY', 'fr-FR')).toBe('août 2026')
        expect(format(date, 'MM/DD/YYYY', 'fr-FR')).toBe('08/26/2026')
    })

    it('is empty for no date', () => {
        expect(format(null, 'YYYY')).toBe('')
    })
})

describe('parse', () => {
    it('round-trips every format it can produce', () => {
        const date = d(2026, 7, 26)
        for (const pattern of ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'D/M/YY', 'MMMM D, YYYY', 'MMM D YYYY']) {
            const parsed = parse(format(date, pattern), pattern)
            expect(isSameDay(parsed, date), pattern).toBe(true)
        }
    })

    it('reads the pattern, not the browser', () => {
        // `Date.parse('03/04/2026')` is March everywhere. The customer said day
        // first, so it is April.
        expect(format(parse('03/04/2026', 'DD/MM/YYYY'), 'YYYY-MM-DD')).toBe('2026-04-03')
        expect(format(parse('03/04/2026', 'MM/DD/YYYY'), 'YYYY-MM-DD')).toBe('2026-03-04')
    })

    it('accepts a missing leading zero', () => {
        expect(format(parse('3/4/2026', 'MM/DD/YYYY'), 'YYYY-MM-DD')).toBe('2026-03-04')
    })

    it('rejects an impossible date rather than rolling it over', () => {
        // A silently wrong date is a wrong booking. Null shows an empty field.
        expect(parse('02/31/2026', 'MM/DD/YYYY')).toBeNull()
        expect(parse('13/01/2026', 'MM/DD/YYYY')).toBeNull()
        expect(parse('not a date', 'MM/DD/YYYY')).toBeNull()
        expect(parse('', 'MM/DD/YYYY')).toBeNull()
    })

    it('reads month names in the field locale', () => {
        expect(format(parse('août 26, 2026', 'MMMM D, YYYY', 'fr-FR'), 'YYYY-MM-DD')).toBe('2026-08-26')
    })

    it('windows a two-digit year the way day.js does', () => {
        expect(parse('01/01/68', 'MM/DD/YY')!.getFullYear()).toBe(2068)
        expect(parse('01/01/69', 'MM/DD/YY')!.getFullYear()).toBe(1969)
    })

    it('ignores a weekday name in the pattern', () => {
        expect(format(parse('Wed, Aug 26 2026', 'ddd, MMM D YYYY'), 'YYYY-MM-DD')).toBe('2026-08-26')
    })

    it('keeps bracketed literals literal', () => {
        expect(format(parse('Booked on August 26, 2026', '[Booked on] MMMM D, YYYY'), 'MM-DD')).toBe('08-26')
    })

    it('reads time and the meridiem', () => {
        const parsed = parse('08/26/2026 03:04 PM', 'MM/DD/YYYY hh:mm A')!
        expect(parsed.getHours()).toBe(15)
        expect(parsed.getMinutes()).toBe(4)
    })

    it('produces local midnight for a date-only pattern', () => {
        // A visitor in UTC+13 picking a day must not submit the day before.
        const parsed = parse('2026-08-26', 'YYYY-MM-DD')!
        expect(parsed.getHours()).toBe(0)
        expect(isSameDay(parsed, startOfDay(parsed))).toBe(true)
    })
})

describe('names', () => {
    it('reads month names from Intl', () => {
        expect(monthNames('en-US', 'long')[0]).toBe('January')
        expect(monthNames('en-US', 'short')[0]).toBe('Jan')
        expect(monthNames('es-ES', 'long')[0].toLowerCase()).toBe('enero')
    })

    it('rotates weekdays to the first day of the week', () => {
        expect(weekdayNames('en-US', 'short', 0)[0]).toBe('Sun')
        expect(weekdayNames('en-US', 'short', 1)[0]).toBe('Mon')
        expect(weekdayNames('en-US', 'short', 1)[6]).toBe('Sun')
    })

    it('falls back to en-US for a nonsense language rather than throwing', () => {
        expect(monthNames('not a locale', 'long')[0]).toBe('January')
    })
})

describe('normalizers', () => {
    it('maps firstDay 7 to Sunday and rejects the rest', () => {
        expect(normalizeFirstDay('7')).toBe(0)
        expect(normalizeFirstDay('1')).toBe(1)
        expect(normalizeFirstDay('9')).toBe(0)
        expect(normalizeFirstDay(null)).toBe(0)
    })

    it('expands a bare en, leaving other languages alone', () => {
        expect(normalizeLocale('en')).toBe('en-US')
        expect(normalizeLocale('')).toBe('en-US')
        expect(normalizeLocale('pt-BR')).toBe('pt-BR')
    })
})
