import type { FieldType } from '@flowappz/ffp-config'
import { results as chunkResults } from './loader'
import { mountErrors } from './registry'

/**
 * One sampled beacon per page load.
 *
 * Nothing in the runtime reports anything today, so a phase that silently broke
 * one field type on one browser would look exactly like a phase that worked. The
 * comparison that matters is canary versus stable on submission success rate per
 * form; this supplies the denominator and the failure detail.
 *
 * Deliberately carries no field values, no form contents and no page URL beyond
 * the site id the license check already sends.
 */
export type BeaconPayload = {
    version: string
    siteId: string | null
    fields: FieldType[]
    chunkLoadMs: number
    chunkFailures: string[]
    mountErrors: string[]
}

export function buildPayload(version: string, siteId: string | null, fields: FieldType[]): BeaconPayload {
    return {
        version,
        siteId,
        fields,
        chunkLoadMs: chunkResults.reduce((total, r) => Math.max(total, r.ms), 0),
        chunkFailures: chunkResults.filter((r) => !r.ok).map((r) => `${r.key}:${r.reason || 'unknown'}`),
        mountErrors: mountErrors.map((e) => `${e.type}:${e.message}`),
    }
}

/**
 * `sendBeacon` rather than `fetch`: it survives the page being unloaded, does
 * not compete with the customer's own requests for a connection, and cannot
 * delay anything the visitor is waiting on.
 */
export function send(url: string, payload: BeaconPayload, sampleRate = 0.05): boolean {
    if (!url || url.indexOf('__FFP_') === 0) return false
    // Always report a page that had a failure; sample the healthy ones.
    const interesting = payload.chunkFailures.length > 0 || payload.mountErrors.length > 0
    if (!interesting && Math.random() >= sampleRate) return false

    try {
        const body = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        return navigator.sendBeacon(url, body)
    } catch {
        return false
    }
}
