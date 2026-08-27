import { beforeEach, describe, expect, it } from 'vitest'
import { define, loadChunk, resetLoader, results } from '../src/loader'
import type { ChunkManifest } from '../src/manifest'
import { resetDom } from './setup'

const MANIFEST: ChunkManifest = {
    select: { url: 'https://cdn.example/select.abc.js', integrity: 'sha384-SELECT', deps: ['ui-popover'] },
    'ui-popover': { url: 'https://cdn.example/ui-popover.def.js', integrity: 'sha384-POPOVER' },
    orphan: { url: 'https://cdn.example/orphan.js', integrity: 'sha384-ORPHAN' },
}

/** Stand in for the chunk executing: register the factory the browser would. */
const arrive = (key: string) => define(key, () => {})

/** linkedom builds Event off its own window, not the node global. */
const fire = (tag: Element, type: string) =>
    tag.dispatchEvent(new (globalThis.window as unknown as { Event: typeof Event }).Event(type))

beforeEach(() => {
    resetDom()
    resetLoader()
})

describe('chunk tag', () => {
    it('carries integrity and crossorigin, without which SRI is a no-op', () => {
        void loadChunk('ui-popover', MANIFEST)
        const [tag] = globalThis.__appended
        expect(tag.getAttribute('src')).toBe('https://cdn.example/ui-popover.def.js')
        expect(tag.getAttribute('integrity')).toBe('sha384-POPOVER')
        // Without crossorigin the browser refuses to check integrity at all and
        // loads the script unverified. R2 already sends access-control-allow-origin.
        expect(tag.getAttribute('crossorigin')).toBe('anonymous')
        expect(tag.getAttribute('data-ffp-chunk')).toBe('ui-popover')
    })

    it('requests a chunk once no matter how many fields want it', () => {
        void loadChunk('ui-popover', MANIFEST)
        void loadChunk('ui-popover', MANIFEST)
        expect(globalThis.__appended).toHaveLength(1)
    })
})

describe('resolution', () => {
    it('resolves on the define callback, not on script load', async () => {
        const promise = loadChunk('orphan', MANIFEST)
        const [tag] = globalThis.__appended
        // A truncated or proxy-mangled response can fire load having defined
        // nothing. Only the callback proves the code ran.
        fire(tag, 'load')
        arrive('orphan')
        await expect(promise).resolves.toMatchObject({ key: 'orphan', ok: true })
    })

    it('loads dependencies before the chunk that needs them', async () => {
        const promise = loadChunk('select', MANIFEST)
        expect(globalThis.__appended.map((t) => t.getAttribute('data-ffp-chunk'))).toEqual(['ui-popover'])
        arrive('ui-popover')
        await Promise.resolve()
        await Promise.resolve()
        arrive('select')
        await expect(promise).resolves.toMatchObject({ ok: true })
    })

    it('fails the dependant when a shared chunk fails', async () => {
        const promise = loadChunk('select', MANIFEST, 20)
        fire(globalThis.__appended[0], 'error')
        await expect(promise).resolves.toMatchObject({ ok: false, reason: 'dep:ui-popover' })
    })
})

describe('failure', () => {
    it('reports a network or integrity rejection rather than hanging', async () => {
        const promise = loadChunk('orphan', MANIFEST)
        fire(globalThis.__appended[0], 'error')
        await expect(promise).resolves.toMatchObject({ ok: false, reason: 'network' })
    })

    it('gives up after the timeout so a blocked CDN cannot stall the page', async () => {
        await expect(loadChunk('orphan', MANIFEST, 10)).resolves.toMatchObject({
            ok: false,
            reason: 'timeout',
        })
    })

    it('reports a key missing from the manifest without touching the network', async () => {
        await expect(loadChunk('nope', MANIFEST)).resolves.toMatchObject({ ok: false, reason: 'manifest' })
        expect(globalThis.__appended).toHaveLength(0)
    })

    it('records every attempt for the debug report and the beacon', async () => {
        await loadChunk('nope', MANIFEST)
        await loadChunk('orphan', MANIFEST, 10)
        expect(results.map((r) => `${r.key}:${r.reason}`)).toEqual(['nope:manifest', 'orphan:timeout'])
    })
})
