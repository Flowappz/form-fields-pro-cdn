import { readFieldConfig, type FfpFieldConfigV2, type FieldType } from '@flowappz/ffp-config'
import type { ChunkApi } from './chunk-api'
import { rafDebounce } from './dom'
import { getFactory, loadChunk } from './loader'
import type { ChunkManifest } from './manifest'
import { CHUNK_FOR_TYPE, FIELD_SELECTORS, FIELD_TYPES } from './selectors'

export type FieldInstance = {
    destroy(): void
    value?(): unknown
    setValue?(value: unknown): void
    validate?(): string | null
    serialize?(): Record<string, unknown>
    /** Resolves when async setup (an upload, a geo lookup) has settled. */
    ready?: Promise<void>
}

export type MountContext = {
    /** The form the field belongs to, when it is inside one. */
    form: HTMLFormElement | null
    version: string
}

export type FieldDefinition<C = FfpFieldConfigV2> = {
    /** Also the chunk key. */
    name: FieldType
    /** Cheap scan. Runs in core, before the chunk exists. */
    select?(root: ParentNode): Element[]
    parse?(el: Element): C
    mount(el: Element, config: C, ctx: MountContext): FieldInstance
}

const definitions = new Map<FieldType, FieldDefinition>()

/**
 * One instance per element, forever.
 *
 * Replaces all four idempotency spellings in runtime 5.1.5 - `dataset.ffpDateInit`,
 * `$input.data('ffpSpectrumInit')`, `data-ffp-nps-bound`, and the sibling-exists
 * probe in `createSliderWrap`. A WeakMap cannot be cleared by a customer script
 * touching attributes, and it does not leak when Webflow swaps a page.
 */
const instances = new WeakMap<Element, FieldInstance>()

export const mountErrors: Array<{ type: string; message: string }> = []

/**
 * The entitlement gate, set once by `boot()`.
 *
 * It lives here rather than around the single `mountAll` call in `boot()`
 * because there are three ways into a mount - boot, the MutationObserver's
 * rescan, and the public `window.FormFieldsPro.mount()` - and a gate on one of
 * them is not a gate. The registry does not know what "licensed" means; it
 * knows whether mounting is permitted.
 */
let mountAllowed = true

export function setMountAllowed(allowed: boolean): void {
    mountAllowed = allowed
}

export function isMountAllowed(): boolean {
    return mountAllowed
}

export function defineField<C = FfpFieldConfigV2>(definition: FieldDefinition<C>): void {
    definitions.set(definition.name, definition as FieldDefinition)
}

/**
 * The API object handed to every chunk factory. Set once by core at boot.
 *
 * A chunk cannot import core - that would bundle the registry and the loader
 * into each chunk and undo the split - so this is the only channel between them.
 */
let chunkApi: ChunkApi | null = null
const ranFactories = new Set<string>()

export function setChunkApi(api: ChunkApi): void {
    chunkApi = api
}

/** Run a loaded chunk's factory once, so it can register its field. */
function runFactory(key: string): void {
    if (ranFactories.has(key) || !chunkApi) return
    const factory = getFactory(key)
    if (!factory) return
    ranFactories.add(key)
    try {
        factory(chunkApi)
    } catch (err) {
        console.warn(`Form Fields Pro: chunk ${key} failed to initialise`, err)
    }
}

export function getInstance(el: Element): FieldInstance | undefined {
    return instances.get(el)
}

function elementsFor(type: FieldType, root: ParentNode): Element[] {
    const definition = definitions.get(type)
    if (definition && definition.select) return definition.select(root)
    return Array.from(root.querySelectorAll(FIELD_SELECTORS[type]))
}

function mountOne(type: FieldType, el: Element, version: string): void {
    if (instances.has(el)) return

    // Survives the canary window, when an old immutably-cached bundle and a new
    // one can both be live on one page and neither can see the other's WeakMap.
    if (el.getAttribute('data-ffp-mounted')) return

    const definition = definitions.get(type)
    if (!definition) return

    try {
        const config = definition.parse ? definition.parse(el) : readFieldConfig(el, type)
        const ctx: MountContext = { form: el.closest('form'), version }
        const instance = definition.mount(el, config, ctx)
        instances.set(el, instance)
        el.setAttribute('data-ffp-mounted', type)
    } catch (err) {
        // Per element, not per type. In 5.1.5 the try/catch wraps a whole
        // initializer, so one malformed element silently kills every instance of
        // that field type on the page.
        const message = err instanceof Error ? err.message : String(err)
        mountErrors.push({ type, message })
        console.warn(`Form Fields Pro: ${type} failed to mount`, err)
    }
}

/**
 * Scan, request the chunks that are actually needed, mount what arrives.
 *
 * One synchronous pass over the selectors first, then every chunk request fires
 * in parallel - a form with a date and a select must not serialise two network
 * round trips.
 */
export type MountOptions = {
    /** Override the manifest core was built with. Tests and the debug console. */
    manifest?: ChunkManifest
    /** Override the per-chunk load timeout. */
    timeoutMs?: number
}

export async function mountAll(
    root: ParentNode = document,
    version = 'dev',
    options: MountOptions = {},
): Promise<void> {
    // Withheld, not failed: every element stays the native input Webflow
    // generated, so the form still types, validates and submits.
    if (!mountAllowed) return

    const work: Array<{ type: FieldType; elements: Element[] }> = []
    for (const type of FIELD_TYPES) {
        const elements = elementsFor(type, root).filter((el) => !instances.has(el))
        if (elements.length) work.push({ type, elements })
    }
    if (!work.length) return

    const chunks = Array.from(new Set(work.map((item) => CHUNK_FOR_TYPE[item.type])))
    await Promise.all(chunks.map((key) => loadChunk(key, options.manifest, options.timeoutMs)))
    for (const key of chunks) runFactory(key)

    for (const { type, elements } of work) {
        // A chunk that failed to load leaves no definition registered, so these
        // elements stay as the native inputs Webflow generated - still typed
        // into, still validated by the browser, still submitted.
        for (const el of elements) mountOne(type, el, version)
    }
}

export function destroy(el: Element): boolean {
    const instance = instances.get(el)
    if (!instance) return false
    try {
        instance.destroy()
    } catch (err) {
        console.warn('Form Fields Pro: destroy failed', err)
    }
    instances.delete(el)
    el.removeAttribute('data-ffp-mounted')
    return true
}

/**
 * Watch for fields added after load - CMS pagination, a tab switch, a modal.
 *
 * One observer on body, coalesced to one frame. This is what replaces the 450 ms
 * forever-recursing `setTimeout` in `observeInputChangesAndFireConditionalLogic`,
 * which runs on every published page whether or not anything ever changes.
 */
export function observe(version: string, afterRescan?: () => void): () => void {
    const rescan = rafDebounce(() => {
        void mountAll(document, version).then(() => {
            // Forms, conditional logic and multi-step all key off the DOM too,
            // and a page that inserts a field after load has to pick all of them
            // up - not only the widget. One observer drives the lot.
            if (afterRescan) afterRescan()
        })
    })
    const observer = new MutationObserver(rescan)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
}

/** Test seam. */
export function resetRegistry(): void {
    mountAllowed = true
    definitions.clear()
    ranFactories.clear()
    chunkApi = null
    mountErrors.length = 0
}

export function definedTypes(): FieldType[] {
    return Array.from(definitions.keys())
}
