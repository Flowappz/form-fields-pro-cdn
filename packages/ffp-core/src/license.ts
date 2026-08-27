import type { FieldType } from '@flowappz/ffp-config'

/**
 * License check, extended into the runtime kill switch.
 *
 * The response gains three optional keys beyond the `active` flag 5.1.5 already
 * reads. They are the only lever that reaches a customer's published page
 * without that customer re-publishing, which is what makes them the kill switch
 * that actually matters during a rollout:
 *
 *   { active: boolean, disabledFields?: string[], forceLegacy?: boolean, ttlMs?: number }
 */
export type LicenseResponse = {
    active: boolean
    /** Field types to leave as native inputs, by name. Server-side, per site. */
    disabledFields?: FieldType[]
    /** Send every site back to the vendor code path. */
    forceLegacy?: boolean
    /** Server-chosen cache lifetime, so a rollout can shorten it centrally. */
    ttlMs?: number
}

/**
 * `stale` is the third entitlement state, and the whole posture turns on it.
 *
 * `active: false, stale: false` is the service *answering no*.
 * `active: false, stale: true` is the service *not answering* - offline, timed
 * out, rate limited, 5xx, DNS-blocked. Those are not the same fact and the
 * runtime must not treat them the same way: one is an unlicensed site, the
 * other is our outage on a customer's page.
 */
export type LicenseState = LicenseResponse & { stale: boolean }

const SUCCESS_TTL_MS = 60 * 60 * 1000
const FAILURE_TTL_MS = 60 * 1000

/** 4xx that are the service failing, not an answer about this site. */
const TRANSIENT_STATUSES = [408, 425, 429]

let cached: LicenseState | null = null
let cachedAt = 0
let inFlight: Promise<LicenseState> | null = null

/** No answer. Never cached as an answer, and never a definitive negative. */
function unknown(): LicenseState {
    return { active: false, disabledFields: [], forceLegacy: false, stale: true }
}

/**
 * Fetch the license state, cached.
 *
 * Two different failure postures on purpose:
 *
 * - `active` keeps 5.1.5's fail-closed behaviour: a definitive no is a no, for
 *   the backend post and for the field mounts alike.
 * - The kill-switch keys, and an *indeterminate* answer, fail **open**. An
 *   unreachable service must not disable every field on every site - that turns
 *   one outage into a total outage, and it is the opposite of what a safety
 *   mechanism is for. See `canMountFields`.
 */
export function fetchLicense(url: string, siteId: string | null): Promise<LicenseState> {
    // A production page with no Webflow site id cannot have a license, and 5.1.5
    // treated that as a definitive no. Kept.
    if (!siteId) return Promise.resolve({ active: false, stale: false })

    const ttl = cached && cached.active ? cached.ttlMs || SUCCESS_TTL_MS : FAILURE_TTL_MS
    if (inFlight && Date.now() - cachedAt < ttl) return inFlight

    cachedAt = Date.now()
    inFlight = (async () => {
        try {
            const res = await fetch(`${url}?siteId=${encodeURIComponent(siteId)}&appName=form-fields-pro`)
            if (!res.ok) {
                // A 4xx is the service answering about *this site* - unknown
                // site, revoked key - and is a real negative. A 5xx (or a
                // throttle) is the service failing to answer at all, and 5.1.5
                // scored both as "unlicensed", which is what made a licence
                // outage indistinguishable from mass non-payment.
                if (res.status >= 400 && res.status < 500 && TRANSIENT_STATUSES.indexOf(res.status) === -1) {
                    return (cached = { active: false, disabledFields: [], forceLegacy: false, stale: false })
                }
                console.warn(`Form Fields Pro: License check failed (HTTP ${res.status})`)
                return unknown()
            }
            const data = (await res.json()) as LicenseResponse
            return (cached = {
                active: data.active === true,
                disabledFields: Array.isArray(data.disabledFields) ? data.disabledFields : [],
                forceLegacy: data.forceLegacy === true,
                ttlMs: typeof data.ttlMs === 'number' ? data.ttlMs : undefined,
                stale: false,
            })
        } catch (err) {
            console.warn('Form Fields Pro: License check failed', err)
            // Entitlement unknown, kill switch open.
            return unknown()
        }
    })()

    return inFlight
}

export function isFieldDisabled(state: LicenseState | null, type: FieldType): boolean {
    if (!state || state.stale) return false
    return (state.disabledFields || []).indexOf(type) !== -1
}

/** Logged once, on the only path that withholds the widgets. */
export const UNLICENSED_WARNING =
    'Form Fields Pro: No valid license. Without a license you can publish to Staging (*.webflow.io) only. ' +
    'A valid license is required to use Form Fields Pro on Production (custom domain).'

/**
 * May the paid widgets mount on this page?
 *
 * This is the entitlement gate, and it is deliberately *not* the same test as
 * the one guarding the backend post:
 *
 * | page             | licence answer      | fields | backend post |
 * |------------------|---------------------|--------|--------------|
 * | *.webflow.io     | any                 | mount  | skipped      |
 * | custom domain    | active              | mount  | sent         |
 * | custom domain    | no (definitive)     | **withheld** | skipped |
 * | custom domain    | no answer (outage)  | mount  | skipped      |
 *
 * The third row is 5.1.5's behaviour restored: an unlicensed production site
 * gets native inputs, not the paid widgets. The fourth row is why this is not
 * simply 5.1.5's `isAppAllowedToRun` back verbatim - that one scored an outage
 * as unlicensed, so a licence-service failure would strip the fields from every
 * paying customer's site at once. The failure mode of an entitlement check
 * should be a missed sale, not an incident on a customer's page.
 *
 * None of this is a security boundary. The bundle is public and a determined
 * site owner can serve a patched copy; the enforceable gate is the backend's
 * own licence check on `handleFormSubmission`. This gate exists so a site that
 * simply never bought a licence does not get the product for free.
 */
export function canMountFields(state: LicenseState | null, staging: boolean = isUsingWebflowDomain()): boolean {
    if (staging) return true
    if (!state) return true
    return state.active || state.stale === true
}

/** Test seam. */
export function resetLicense(): void {
    cached = null
    cachedAt = 0
    inFlight = null
}

/**
 * True when the page is on `*.webflow.io`.
 *
 * This is the staging test in 5.1.5 and the reason an unlicensed site still gets
 * working fields while a customer builds: entitlement is only enforced on a
 * custom domain. Normalising case and the trailing dot of a fully qualified
 * hostname matters - `Example.Webflow.IO.` is the same host.
 */
export function isUsingWebflowDomain(url: string = window.location.href): boolean {
    let hostname: string
    try {
        hostname = new URL(url).hostname
    } catch {
        hostname = String(url)
    }
    hostname = hostname.toLowerCase().replace(/\.$/, '')
    return hostname === 'webflow.io' || hostname.slice(-11) === '.webflow.io'
}
