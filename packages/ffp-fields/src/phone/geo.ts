/**
 * Guessing the visitor's country without telling anyone about it.
 *
 * 5.1.5 did this with `$.get('https://ipinfo.io', …, 'jsonp')` on **every page
 * view of every page with a phone field**, whether or not the visitor ever
 * touched it. JSONP means a `<script>` from a third party with no SRI and no
 * CSP-friendly failure mode, and it means the visitor's IP address reaches
 * ipinfo.io on every one of those page views - a third-party disclosure the
 * customer never agreed to and cannot see, which is exactly the kind of thing a
 * GDPR review asks about.
 *
 * Both signals here come from APIs the browser already has:
 *
 * 1. **Time zone.** `Intl.DateTimeFormat().resolvedOptions().timeZone` is where
 *    the machine thinks it is, which for a phone number is the question being
 *    asked. The table below is one primary zone per country for the countries a
 *    form is realistically filled in from - it is not exhaustive, and it does
 *    not need to be, because of:
 * 2. **Locale.** `new Intl.Locale(navigator.language).maximize().region` turns
 *    `en-GB` into `GB` and a bare `bn` into `BD`. Zero bytes, always available.
 *
 * Neither is as accurate as an IP lookup, and neither has to be: this only
 * chooses which flag is showing before the visitor touches the field. Anyone who
 * wants the IP lookup back can ask for it per field with
 * `data-geo-lookup="https://ipinfo.io/json"`, and then it is the customer's
 * disclosure to make rather than ours to make for them.
 */

/**
 * `Zone Country` pairs, space-separated. A string rather than an object literal
 * because 250 quoted keys cost more than the parse does, and this is parsed once
 * per page at most - only when a phone field is actually present.
 *
 * Multi-zone countries list the zones their populations actually live in.
 */
const ZONES =
    'Africa/Abidjan CI Africa/Accra GH Africa/Addis_Ababa ET Africa/Algiers DZ Africa/Cairo EG ' +
    'Africa/Casablanca MA Africa/Dar_es_Salaam TZ Africa/Johannesburg ZA Africa/Kampala UG ' +
    'Africa/Khartoum SD Africa/Kinshasa CD Africa/Lagos NG Africa/Luanda AO Africa/Nairobi KE ' +
    'Africa/Tunis TN Africa/Harare ZW Africa/Maputo MZ Africa/Dakar SN Africa/Bamako ML ' +
    'America/Argentina/Buenos_Aires AR America/Bogota CO America/Caracas VE America/Chicago US ' +
    'America/Denver US America/Detroit US America/Edmonton CA America/Guatemala GT ' +
    'America/Halifax CA America/Havana CU America/Lima PE America/Los_Angeles US ' +
    'America/Mexico_City MX America/Monterrey MX America/Montreal CA America/New_York US ' +
    'America/Panama PA America/Phoenix US America/Santiago CL America/Sao_Paulo BR ' +
    'America/Fortaleza BR America/Manaus BR America/Bahia BR America/Recife BR ' +
    'America/Santo_Domingo DO America/Toronto CA America/Vancouver CA America/Winnipeg CA ' +
    'America/Anchorage US America/Costa_Rica CR America/El_Salvador SV America/Tegucigalpa HN ' +
    'America/Asuncion PY America/Montevideo UY America/La_Paz BO America/Guayaquil EC ' +
    'America/Puerto_Rico PR America/Jamaica JM America/Port-au-Prince HT ' +
    'Asia/Almaty KZ Asia/Amman JO Asia/Baghdad IQ Asia/Baku AZ Asia/Bangkok TH Asia/Beirut LB ' +
    'Asia/Colombo LK Asia/Damascus SY Asia/Dhaka BD Asia/Dubai AE Asia/Ho_Chi_Minh VN ' +
    'Asia/Hong_Kong HK Asia/Jakarta ID Asia/Jayapura ID Asia/Makassar ID Asia/Jerusalem IL ' +
    'Asia/Kabul AF Asia/Karachi PK Asia/Kathmandu NP Asia/Kolkata IN Asia/Calcutta IN ' +
    'Asia/Kuala_Lumpur MY Asia/Kuwait KW Asia/Manila PH Asia/Muscat OM Asia/Phnom_Penh KH ' +
    'Asia/Qatar QA Asia/Riyadh SA Asia/Seoul KR Asia/Shanghai CN Asia/Singapore SG ' +
    'Asia/Taipei TW Asia/Tashkent UZ Asia/Tbilisi GE Asia/Tehran IR Asia/Tokyo JP ' +
    'Asia/Ulaanbaatar MN Asia/Yangon MM Asia/Yerevan AM Asia/Bishkek KG Asia/Vientiane LA ' +
    'Atlantic/Reykjavik IS Atlantic/Canary ES ' +
    'Australia/Adelaide AU Australia/Brisbane AU Australia/Melbourne AU Australia/Perth AU ' +
    'Australia/Sydney AU ' +
    'Europe/Amsterdam NL Europe/Athens GR Europe/Belgrade RS Europe/Berlin DE Europe/Bratislava SK ' +
    'Europe/Brussels BE Europe/Bucharest RO Europe/Budapest HU Europe/Copenhagen DK ' +
    'Europe/Dublin IE Europe/Helsinki FI Europe/Istanbul TR Europe/Kiev UA Europe/Kyiv UA ' +
    'Europe/Lisbon PT Europe/Ljubljana SI Europe/London GB Europe/Luxembourg LU Europe/Madrid ES ' +
    'Europe/Malta MT Europe/Minsk BY Europe/Moscow RU Europe/Oslo NO Europe/Paris FR ' +
    'Europe/Prague CZ Europe/Riga LV Europe/Rome IT Europe/Sarajevo BA Europe/Sofia BG ' +
    'Europe/Stockholm SE Europe/Tallinn EE Europe/Vienna AT Europe/Vilnius LT Europe/Warsaw PL ' +
    'Europe/Zagreb HR Europe/Zurich CH Europe/Bern CH Asia/Yekaterinburg RU Asia/Novosibirsk RU ' +
    'Pacific/Auckland NZ Pacific/Fiji FJ Pacific/Honolulu US Pacific/Port_Moresby PG'

let zoneMap: Record<string, string> | null = null

function zones(): Record<string, string> {
    if (zoneMap) return zoneMap
    zoneMap = {}
    const parts = ZONES.split(' ')
    for (let i = 0; i + 1 < parts.length; i += 2) zoneMap[parts[i]] = parts[i + 1]
    return zoneMap
}

export function regionFromTimeZone(zone?: string | null): string | null {
    let name = zone
    if (name === undefined) {
        try {
            name = Intl.DateTimeFormat().resolvedOptions().timeZone
        } catch {
            return null
        }
    }
    if (!name) return null
    return zones()[name] || null
}

export function regionFromLocale(language?: string | null): string | null {
    // Only an omitted argument reaches for `navigator`. An explicit empty or
    // null tag means "no locale", and answering with the machine's own would
    // make the caller's fallback chain lie.
    const tag =
        language === undefined
            ? typeof navigator === 'undefined'
                ? null
                : navigator.language
            : language
    if (!tag) return null
    try {
        // `maximize()` is what turns a bare `bn` into `bn-Beng-BD`.
        const locale = new Intl.Locale(tag)
        const maximized = locale.maximize ? locale.maximize() : locale
        return maximized.region || null
    } catch {
        // A malformed `navigator.language` must not take the field down.
        const match = String(tag).match(/[-_]([A-Za-z]{2})$/)
        return match ? match[1].toUpperCase() : null
    }
}

/** Time zone first - it is about where the machine is, not what it reads in. */
export function detectRegion(): string | null {
    return regionFromTimeZone() || regionFromLocale()
}

/**
 * Opt-in IP lookup, for a customer who wants the old accuracy back.
 *
 * `fetch`, not JSONP: a failure is a rejected promise rather than a third-party
 * script that runs whatever it likes on the page.
 */
export async function regionFromLookup(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { credentials: 'omit' })
        if (!response.ok) return null
        const data = (await response.json()) as { country?: string }
        return data && data.country ? String(data.country).toUpperCase() : null
    } catch {
        return null
    }
}
