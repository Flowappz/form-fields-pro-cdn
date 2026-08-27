/**
 * Date maths and formatting. Pure - no DOM, no locale packs, no vendor.
 *
 * Replaces easepick's `DateTime`. Two decisions carry most of the weight:
 *
 * 1. **`Intl` supplies every name.** Month and weekday names come from
 *    `Intl.DateTimeFormat`, which every target browser has had since 2017, so a
 *    calendar in Bengali or Portuguese costs zero extra bytes. easepick shipped
 *    per-language modules for the same thing.
 * 2. **Everything is local time.** A date field submits `2026-08-26`, not an
 *    instant, and the one thing that must never happen is a visitor in UTC+13
 *    picking a day and having the value come out as the day before. Every date
 *    here is built with the local `Date(y, m, d)` constructor and read with the
 *    local getters; `Date.parse` and anything ISO-with-Z are deliberately absent.
 *
 * Token set matches easepick's, which is day.js-shaped, including `[escaped]`
 * literals. Formats in the wild come from customer `data-format` attributes, so
 * the parser must accept everything the formatter can produce.
 */

export type DateParts = { year: number; month: number; day: number }

const pad = (n: number, width = 2) => String(n).padStart(width, '0')

/** Local midnight, so two dates from different sources compare by day. */
export function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function today(): Date {
    return startOfDay(new Date())
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
    if (!a || !b) return false
    return (
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    )
}

export function isSameMonth(a: Date | null, b: Date | null): boolean {
    if (!a || !b) return false
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/**
 * Add months, clamping the day to the target month's length.
 *
 * `new Date(2026, 0, 31)` plus one month is 3 March in raw JS, because day 31 of
 * February overflows. Every calendar that steps by month has to clamp instead,
 * or "next month" from 31 January skips February entirely.
 */
export function addMonths(date: Date, count: number): Date {
    const year = date.getFullYear()
    const month = date.getMonth() + count
    const day = Math.min(date.getDate(), daysInMonth(year, month))
    return new Date(year, month, day)
}

export function addDays(date: Date, count: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count)
}

export function daysInMonth(year: number, month: number): number {
    // Day 0 of the next month is the last day of this one, and the constructor
    // normalises a month of 12 into January of the next year for free.
    return new Date(year, month + 1, 0).getDate()
}

/**
 * The 6x7 grid for a month, `firstDay` being the weekday the week starts on
 * (0 = Sunday). Always six rows, so the calendar does not change height when the
 * visitor pages through the year.
 */
export function daysMatrix(year: number, month: number, firstDay = 0): Date[] {
    const first = new Date(year, month, 1)
    const offset = (first.getDay() - firstDay + 7) % 7
    const start = new Date(year, month, 1 - offset)
    const out: Date[] = []
    for (let i = 0; i < 42; i++) out.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
    return out
}

const nameCache: Record<string, string[]> = {}

function namesFor(key: string, build: () => string[]): string[] {
    if (!nameCache[key]) nameCache[key] = build()
    return nameCache[key]
}

function formatterFor(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    try {
        return new Intl.DateTimeFormat(locale, options)
    } catch {
        // An invalid `data-language` must not take the field down with it.
        return new Intl.DateTimeFormat('en-US', options)
    }
}

export function monthNames(locale: string, style: 'long' | 'short' = 'long'): string[] {
    return namesFor(`m:${locale}:${style}`, () => {
        const format = formatterFor(locale, { month: style })
        const out: string[] = []
        for (let m = 0; m < 12; m++) out.push(format.format(new Date(2021, m, 1)))
        return out
    })
}

export function weekdayNames(
    locale: string,
    style: 'long' | 'short' | 'narrow' = 'short',
    firstDay = 0,
): string[] {
    const all = namesFor(`w:${locale}:${style}`, () => {
        const format = formatterFor(locale, { weekday: style })
        const out: string[] = []
        // 2021-08-01 was a Sunday, so index 0 is Sunday whatever the locale.
        for (let d = 0; d < 7; d++) out.push(format.format(new Date(2021, 7, 1 + d)))
        return out
    })
    return all.slice(firstDay).concat(all.slice(0, firstDay))
}

/** Tokens, longest first: `MMMM` must win before `MM`, and `MM` before `M`. */
const TOKEN = /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|d|HH|hh|mm|ss|A|a/g

export function format(date: Date | null, pattern: string, locale = 'en-US'): string {
    if (!date) return ''
    const hours = date.getHours()
    return pattern.replace(TOKEN, (token, escaped?: string) => {
        if (escaped !== undefined) return escaped
        switch (token) {
            case 'YYYY':
                return String(date.getFullYear())
            case 'YY':
                return pad(date.getFullYear() % 100)
            case 'MMMM':
                return monthNames(locale, 'long')[date.getMonth()]
            case 'MMM':
                return monthNames(locale, 'short')[date.getMonth()]
            case 'MM':
                return pad(date.getMonth() + 1)
            case 'M':
                return String(date.getMonth() + 1)
            case 'DD':
                return pad(date.getDate())
            case 'D':
                return String(date.getDate())
            case 'dddd':
                return weekdayNames(locale, 'long')[date.getDay()]
            case 'ddd':
                return weekdayNames(locale, 'short')[date.getDay()]
            case 'dd':
                return weekdayNames(locale, 'narrow')[date.getDay()]
            case 'd':
                return String(date.getDay())
            case 'HH':
                return pad(hours)
            case 'hh':
                return pad(hours % 12 || 12)
            case 'mm':
                return pad(date.getMinutes())
            case 'ss':
                return pad(date.getSeconds())
            case 'A':
                return hours < 12 ? 'AM' : 'PM'
            case 'a':
                return hours < 12 ? 'am' : 'pm'
            default:
                return token
        }
    })
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Parse a value written in `pattern`.
 *
 * Driven by the pattern rather than by `Date.parse`, because `Date.parse` reads
 * `03/04/2026` as March in every engine and the customer may well have written
 * `DD/MM/YYYY`. Returns null rather than a wrong date: a null shows the visitor
 * an empty field, where a silently wrong date is a wrong booking.
 */
export function parse(value: string, pattern: string, locale = 'en-US'): Date | null {
    const raw = String(value == null ? '' : value).trim()
    if (!raw) return null

    const order: string[] = []
    let source = ''
    let lastIndex = 0
    TOKEN.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = TOKEN.exec(pattern))) {
        source += escapeRegex(pattern.slice(lastIndex, match.index))
        lastIndex = match.index + match[0].length
        if (match[1] !== undefined) {
            source += escapeRegex(match[1])
            continue
        }
        const token = match[0]
        switch (token) {
            case 'YYYY':
                order.push(token)
                source += '(\\d{4})'
                break
            case 'YY':
                order.push(token)
                source += '(\\d{2})'
                break
            case 'MMMM':
            case 'MMM':
                order.push(token)
                source += '(\\p{L}+)'
                break
            case 'MM':
            case 'DD':
            case 'HH':
            case 'hh':
            case 'mm':
            case 'ss':
                order.push(token)
                // Tolerant of a missing leading zero: people type `3/4/2026`.
                source += '(\\d{1,2})'
                break
            case 'M':
            case 'D':
                order.push(token)
                source += '(\\d{1,2})'
                break
            case 'A':
            case 'a':
                order.push('A')
                source += '([AaPp][Mm])'
                break
            default:
                // Weekday names carry no information a date needs; skip them.
                source += token === 'd' ? '\\d' : '\\p{L}+'
        }
    }
    source += escapeRegex(pattern.slice(lastIndex))

    let found: RegExpExecArray | null
    try {
        found = new RegExp('^' + source + '$', 'iu').exec(raw)
    } catch {
        return null
    }
    if (!found) return null

    const now = new Date()
    let year = now.getFullYear()
    let month = 0
    let day = 1
    let hours = 0
    let minutes = 0
    let seconds = 0
    let meridiem = ''
    let sawMonth = false

    order.forEach((token, index) => {
        const text = found![index + 1]
        const number = parseInt(text, 10)
        switch (token) {
            case 'YYYY':
                year = number
                break
            case 'YY':
                // Same window day.js uses: 00-68 is 2000s, 69-99 is 1900s.
                year = number < 69 ? 2000 + number : 1900 + number
                break
            case 'MMMM':
            case 'MMM': {
                const list = monthNames(locale, token === 'MMMM' ? 'long' : 'short')
                const lower = text.toLowerCase()
                let index2 = list.findIndex((name) => name.toLowerCase() === lower)
                if (index2 === -1) {
                    index2 = list.findIndex((name) => lower.indexOf(name.toLowerCase().slice(0, 3)) === 0)
                }
                if (index2 === -1) return
                month = index2
                sawMonth = true
                break
            }
            case 'MM':
            case 'M':
                month = number - 1
                sawMonth = true
                break
            case 'DD':
            case 'D':
                day = number
                break
            case 'HH':
            case 'hh':
                hours = number
                break
            case 'mm':
                minutes = number
                break
            case 'ss':
                seconds = number
                break
            case 'A':
                meridiem = text.toLowerCase()
                break
        }
    })

    if (meridiem === 'pm' && hours < 12) hours += 12
    if (meridiem === 'am' && hours === 12) hours = 0

    if (month < 0 || month > 11) return null
    if (!sawMonth && !/M/.test(pattern)) month = now.getMonth()
    if (day < 1 || day > daysInMonth(year, month)) return null

    return new Date(year, month, day, hours, minutes, seconds)
}

/** `7` means Sunday to some builders and `0` to the calendar. Normalise. */
export function normalizeFirstDay(raw: unknown): number {
    const day = Number(raw)
    if (!isFinite(day)) return 0
    if (day === 7) return 0
    if (day < 0 || day > 6) return 0
    return Math.floor(day)
}

/** easepick treated a bare `en` as `en-US`; keep that, reject nothing else. */
export function normalizeLocale(raw: unknown): string {
    const value = String(raw == null ? '' : raw).trim()
    if (!value || value === 'en') return 'en-US'
    return value
}

/** Test seam - `Intl` results are cached per locale for the page's lifetime. */
export function resetNameCache(): void {
    for (const key of Object.keys(nameCache)) delete nameCache[key]
}
