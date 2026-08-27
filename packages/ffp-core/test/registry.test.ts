import { beforeEach, describe, expect, it, vi } from 'vitest'
import { define, resetLoader } from '../src/loader'
import type { ChunkManifest } from '../src/manifest'
import {
    defineField,
    destroy,
    getInstance,
    mountAll,
    mountErrors,
    resetRegistry,
} from '../src/registry'
import { detectTypes } from '../src/selectors'
import { resetDom } from './setup'

const MANIFEST: ChunkManifest = {}

/**
 * Always mount against an explicit manifest.
 *
 * `mountAll` falls back to the *generated* manifest, which points at whatever
 * R2 URLs the last `build.mjs` run produced. A test that omits it passes on a
 * clean checkout and then hangs on a real network fetch the moment someone
 * builds - which is exactly what happened once already.
 */
const mountFields = (root: ParentNode, version: string) =>
    mountAll(root, version, { manifest: MANIFEST, timeoutMs: 10 })

beforeEach(() => {
    resetLoader()
    resetRegistry()
})

/** Register a field whose chunk is already "loaded". */
function stubField(name: 'select' | 'date', mount = vi.fn(() => ({ destroy: vi.fn() }))) {
    define(name, () => {})
    defineField({ name, mount })
    return mount
}

describe('detection', () => {
    it('reports only the types actually on the page', () => {
        resetDom(`<body>
            <select form-fields-type="select"></select>
            <div class="dropzone"></div>
        </body>`)
        expect(detectTypes(document).sort()).toEqual(['file', 'select'])
    })

    it('does not report rangeslider separately - it shares the slider chunk', () => {
        resetDom(`<body><input form-fields-pro-number-slider allow-range></body>`)
        expect(detectTypes(document)).toEqual(['slider'])
    })
})

describe('mounting', () => {
    it('mounts each matching element once', async () => {
        resetDom(`<body>
            <select form-fields-type="select" name="a"></select>
            <select form-fields-type="select" name="b"></select>
        </body>`)
        const mount = stubField('select')
        await mountFields(document, 'test')
        expect(mount).toHaveBeenCalledTimes(2)
    })

    it('is idempotent across repeated scans', async () => {
        resetDom(`<body><select form-fields-type="select" name="a"></select></body>`)
        const mount = stubField('select')
        await mountFields(document, 'test')
        await mountFields(document, 'test')
        await mountFields(document, 'test')
        expect(mount).toHaveBeenCalledTimes(1)
    })

    it('skips an element another bundle already claimed', async () => {
        // During a canary an old immutably-cached bundle and a new one can both
        // be live on one page, and neither can see the other's WeakMap.
        resetDom(`<body><select form-fields-type="select" name="a" data-ffp-mounted="select"></select></body>`)
        const mount = stubField('select')
        await mountFields(document, 'test')
        expect(mount).not.toHaveBeenCalled()
    })

    it('hands the field a normalized config and its enclosing form', async () => {
        resetDom(`<body><form><select form-fields-type="select" name="a" data-searchable="false"></select></form></body>`)
        const mount = vi.fn(() => ({ destroy: vi.fn() }))
        stubField('select', mount)
        await mountFields(document, '9.9.9')
        const [, config, ctx] = mount.mock.calls[0] as unknown as [Element, Record<string, unknown>, Record<string, unknown>]
        expect(config).toMatchObject({ v: 2, type: 'select', name: 'a', options: { searchable: false } })
        expect((ctx.form as Element).tagName).toBe('FORM')
        expect(ctx.version).toBe('9.9.9')
    })
})

describe('error isolation', () => {
    it('keeps mounting after one element throws', async () => {
        // 5.1.5 wraps a whole initializer, so one malformed element silently
        // kills every instance of that field type on the page.
        resetDom(`<body>
            <select form-fields-type="select" name="bad"></select>
            <select form-fields-type="select" name="good"></select>
        </body>`)
        const mount = vi.fn((el: Element) => {
            if (el.getAttribute('name') === 'bad') throw new Error('boom')
            return { destroy: vi.fn() }
        })
        stubField('select', mount as never)
        await mountFields(document, 'test')

        expect(mountErrors).toEqual([{ type: 'select', message: 'boom' }])
        expect(getInstance(document.querySelector('[name="good"]')!)).toBeTruthy()
        expect(getInstance(document.querySelector('[name="bad"]')!)).toBeUndefined()
    })

    it('leaves the native input alone when the chunk never loads', async () => {
        resetDom(`<body><select form-fields-type="select" name="a"></select></body>`)
        // No define, no definition, and an empty manifest: the chunk cannot
        // arrive by any route.
        await mountAll(document, 'test', { manifest: MANIFEST, timeoutMs: 10 })
        const el = document.querySelector('[name="a"]')!
        expect(el.getAttribute('data-ffp-mounted')).toBeNull()
        expect(el.tagName).toBe('SELECT')
        expect(MANIFEST.select).toBeUndefined()
    })
})

describe('destroy', () => {
    it('tears the instance down and releases the element for remounting', async () => {
        resetDom(`<body><select form-fields-type="select" name="a"></select></body>`)
        const teardown = vi.fn()
        stubField('select', vi.fn(() => ({ destroy: teardown })))
        await mountFields(document, 'test')

        const el = document.querySelector('[name="a"]')!
        expect(destroy(el)).toBe(true)
        expect(teardown).toHaveBeenCalledOnce()
        expect(el.getAttribute('data-ffp-mounted')).toBeNull()
        expect(destroy(el)).toBe(false)
    })
})
