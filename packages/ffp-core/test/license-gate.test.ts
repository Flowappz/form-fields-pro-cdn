import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    canMountFields,
    fetchLicense,
    isUsingWebflowDomain,
    resetLicense,
    type LicenseState,
} from '../src/license'
import { define, resetLoader } from '../src/loader'
import type { ChunkManifest } from '../src/manifest'
import { defineField, isMountAllowed, mountAll, resetRegistry, setMountAllowed } from '../src/registry'
import { resetDom } from './setup'

/**
 * The entitlement gate.
 *
 * The property under test is not "unlicensed sites get nothing" - it is the
 * three-way split. A definitive no withholds the widgets (5.1.5's behaviour,
 * and the revenue leak this closes); *no answer* mounts them, because a licence
 * outage must not strip the fields from every paying customer's page at once.
 */
const MANIFEST: ChunkManifest = {}
const LICENSE_URL = 'https://license.test/check'

const mountFields = (root: ParentNode) => mountAll(root, 'test', { manifest: MANIFEST, timeoutMs: 10 })

function stubField(name: 'select' = 'select', mount = vi.fn(() => ({ destroy: vi.fn() }))) {
    define(name, () => {})
    defineField({ name, mount })
    return mount
}

const state = (over: Partial<LicenseState> = {}): LicenseState => ({ active: false, stale: false, ...over })

beforeEach(() => {
    resetLoader()
    resetRegistry()
    resetLicense()
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('canMountFields', () => {
    it('mounts on staging whatever the licence says', () => {
        expect(canMountFields(state({ active: false }), true)).toBe(true)
    })

    it('mounts on a custom domain with an active licence', () => {
        expect(canMountFields(state({ active: true }), false)).toBe(true)
    })

    it('withholds on a custom domain when the service answers no', () => {
        expect(canMountFields(state({ active: false, stale: false }), false)).toBe(false)
    })

    it('mounts on a custom domain when the service gives no answer', () => {
        // The whole point of the divergence from 5.1.5: an outage is not a
        // billing event, and must not read as one.
        expect(canMountFields(state({ active: false, stale: true }), false)).toBe(true)
    })

    it('mounts when there is no licence state at all', () => {
        expect(canMountFields(null, false)).toBe(true)
    })

    it('reads the staging flag off the page by default', () => {
        expect(isUsingWebflowDomain('https://Example.Webflow.IO./contact')).toBe(true)
        expect(isUsingWebflowDomain('https://example.com/contact')).toBe(false)
    })
})

describe('fetchLicense: an answer versus no answer', () => {
    const stub = (impl: () => Promise<unknown>) => vi.stubGlobal('fetch', vi.fn(impl))

    it('treats active:false as a definitive negative', async () => {
        stub(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ active: false }) }))
        const result = await fetchLicense(LICENSE_URL, 'site_123')
        expect(result).toMatchObject({ active: false, stale: false })
        expect(canMountFields(result, false)).toBe(false)
    })

    it('treats a 4xx as a definitive negative - it is an answer about this site', async () => {
        stub(() => Promise.resolve({ ok: false, status: 404 }))
        const result = await fetchLicense(LICENSE_URL, 'site_123')
        expect(result.stale).toBe(false)
        expect(canMountFields(result, false)).toBe(false)
    })

    it('treats a 5xx as no answer', async () => {
        stub(() => Promise.resolve({ ok: false, status: 503 }))
        const result = await fetchLicense(LICENSE_URL, 'site_123')
        expect(result).toMatchObject({ active: false, stale: true })
        expect(canMountFields(result, false)).toBe(true)
    })

    it('treats a throttle as no answer, not as a revoked licence', async () => {
        stub(() => Promise.resolve({ ok: false, status: 429 }))
        expect((await fetchLicense(LICENSE_URL, 'site_123')).stale).toBe(true)
    })

    it('treats a blocked or offline request as no answer', async () => {
        // Blocking the licence domain is the obvious bypass attempt, and it is
        // the same signal as a real outage. It resolves to "mount" on purpose:
        // the enforceable check is the backend's, on the submission.
        stub(() => Promise.reject(new Error('blocked')))
        const result = await fetchLicense(LICENSE_URL, 'site_123')
        expect(result).toMatchObject({ active: false, stale: true })
        expect(canMountFields(result, false)).toBe(true)
    })

    it('does not cache a non-answer as the answer', async () => {
        let status = 503
        stub(() => Promise.resolve({ ok: status === 200, status, json: () => Promise.resolve({ active: true }) }))
        expect((await fetchLicense(LICENSE_URL, 'site_123')).stale).toBe(true)

        resetLicense()
        status = 200
        expect(await fetchLicense(LICENSE_URL, 'site_123')).toMatchObject({ active: true, stale: false })
    })

    it('answers no for a page with no Webflow site id, without a request', async () => {
        const fetchMock = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ active: true }) }))
        vi.stubGlobal('fetch', fetchMock)
        expect(await fetchLicense(LICENSE_URL, null)).toMatchObject({ active: false, stale: false })
        expect(fetchMock).not.toHaveBeenCalled()
    })
})

describe('the gate is enforced in the registry, not at one call site', () => {
    it('mounts nothing while withheld', async () => {
        resetDom(`<body><select form-fields-type="select" name="a"></select></body>`)
        const mount = stubField()
        setMountAllowed(false)
        await mountFields(document)
        expect(mount).not.toHaveBeenCalled()
    })

    it('leaves the native input in place rather than removing it', async () => {
        resetDom(`<body><select form-fields-type="select" name="a"></select></body>`)
        stubField()
        setMountAllowed(false)
        await mountFields(document)
        const el = document.querySelector('[form-fields-type="select"]')
        expect(el).not.toBeNull()
        expect(el && el.getAttribute('data-ffp-mounted')).toBeNull()
    })

    it('cannot be walked around by calling mount() again', async () => {
        // `window.FormFieldsPro.mount()` is a public entry point and would be a
        // one-line bypass if the gate lived around boot's single call.
        resetDom(`<body><select form-fields-type="select" name="a"></select></body>`)
        const mount = stubField()
        setMountAllowed(false)
        await mountFields(document)
        await mountFields(document)
        await mountAll(document, 'test', { manifest: MANIFEST, timeoutMs: 10 })
        expect(mount).not.toHaveBeenCalled()
    })

    it('mounts once the gate is open', async () => {
        resetDom(`<body><select form-fields-type="select" name="a"></select></body>`)
        const mount = stubField()
        setMountAllowed(canMountFields(state({ active: true }), false))
        await mountFields(document)
        expect(mount).toHaveBeenCalledTimes(1)
    })

    it('defaults to open, so a reset never leaves a page silently gated', () => {
        setMountAllowed(false)
        resetRegistry()
        expect(isMountAllowed()).toBe(true)
    })
})
