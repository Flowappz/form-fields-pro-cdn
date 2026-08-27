import type { ChunkEntry, ChunkManifest } from './manifest'
import { MANIFEST } from './manifest.generated'

import type { ChunkApi } from './chunk-api'

export type ChunkFactory = (api: ChunkApi) => void

export type ChunkResult = {
    key: string
    ok: boolean
    ms: number
    /** `manifest` | `network` | `timeout` - which stage gave up. */
    reason?: string
}

const DEFAULT_TIMEOUT_MS = 8000

const pending: Record<string, Promise<ChunkResult> | undefined> = {}
const defined: Record<string, ChunkFactory | undefined> = {}
const settle: Record<string, ((factory: ChunkFactory) => void) | undefined> = {}

export const results: ChunkResult[] = []

/**
 * A chunk's only side effect: register its factory under its key.
 *
 * Chunks are classic IIFEs, not modules, because `<script type="module">` cannot
 * carry an `integrity` attribute that browsers other than Chrome honour. This
 * global is the seam that buys SRI back.
 */
export function define(key: string, factory: ChunkFactory): void {
    defined[key] = factory
    const resolve = settle[key]
    if (resolve) resolve(factory)
}

/**
 * Load one chunk and resolve when it has registered itself.
 *
 * Resolution hangs off `define`, not `script.onload`, on purpose. A chunk whose
 * integrity check fails still fires `error`, but a chunk served from a stale
 * proxy or truncated mid-transfer can fire `load` having defined nothing. Only
 * the callback proves the code actually ran.
 */
export function loadChunk(
    key: string,
    manifest: ChunkManifest = MANIFEST,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<ChunkResult> {
    const existing = pending[key]
    if (existing) return existing

    const started = Date.now()
    const record = (ok: boolean, reason?: string): ChunkResult => {
        const result: ChunkResult = { key, ok, ms: Date.now() - started }
        if (reason) result.reason = reason
        results.push(result)
        return result
    }

    const entry: ChunkEntry | undefined = manifest[key]
    if (!entry) {
        const missing = Promise.resolve(record(false, 'manifest'))
        pending[key] = missing
        return missing
    }

    const loading = (async () => {
        // Dependencies first. A shared chunk that fails takes its dependants with
        // it - a listbox-less select is worse than a native select.
        for (const dep of entry.deps || []) {
            const depResult = await loadChunk(dep, manifest, timeoutMs)
            if (!depResult.ok) return record(false, `dep:${dep}`)
        }

        if (defined[key]) return record(true)

        return new Promise<ChunkResult>((resolve) => {
            let done = false
            const finish = (ok: boolean, reason?: string) => {
                if (done) return
                done = true
                delete settle[key]
                resolve(record(ok, reason))
            }

            settle[key] = () => finish(true)

            const script = document.createElement('script')
            script.async = true
            // Attributes, not properties, and integrity/crossorigin before src:
            // the fetch is kicked off by insertion, and a browser that sees no
            // crossorigin attribute skips the integrity check entirely rather
            // than failing it - a silent downgrade to an unverified script.
            script.setAttribute('crossorigin', 'anonymous')
            script.setAttribute('integrity', entry.integrity)
            script.setAttribute('data-ffp-chunk', key)
            script.setAttribute('src', entry.url)
            script.onerror = () => finish(false, 'network')
            document.head.appendChild(script)

            setTimeout(() => finish(false, 'timeout'), timeoutMs)
        })
    })()

    pending[key] = loading
    return loading
}

export function getFactory(key: string): ChunkFactory | undefined {
    return defined[key]
}

/** Test seam: forget every load so a fixture can start from a clean slate. */
export function resetLoader(): void {
    for (const key of Object.keys(pending)) delete pending[key]
    for (const key of Object.keys(defined)) delete defined[key]
    for (const key of Object.keys(settle)) delete settle[key]
    results.length = 0
}
