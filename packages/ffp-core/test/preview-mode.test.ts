import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetDom } from './setup'

/**
 * Designer preview mode.
 *
 * The builder mounts the real widgets in the extension's iframe rather than
 * drawing imitations of them. That means core boots on a page which is not a
 * published site: there is no licence to check, no form to submit, and a submit
 * guard bound there would be a handler waiting to swallow something.
 *
 * The property that matters is the *absence* of the submission half. A preview
 * that can post a submission is a bug that only shows up in a customer's
 * inbox.
 */
const previewFlag = (on: boolean) => {
    ;(globalThis.window as unknown as { __ffpPreview?: boolean }).__ffpPreview = on
}

async function bootPreview(html: string, mount = vi.fn(() => ({ destroy: vi.fn() }))) {
    resetDom(html)
    previewFlag(true)

    // Everything has to come from the same fresh module graph: `resetModules`
    // gives `index` a new copy of the registry, and a field defined through the
    // old copy would register into a registry nobody reads.
    vi.resetModules()
    const loader = await import('../src/loader')
    const registry = await import('../src/registry')
    const { start } = await import('../src/index')

    loader.resetLoader()
    registry.resetRegistry()
    loader.define('select', () => {})
    registry.defineField({ name: 'select', mount })

    start()
    // `ready()` fires immediately on an already-parsed document; boot itself is
    // async, so let its microtasks drain.
    await new Promise((resolve) => setTimeout(resolve, 0))
    return mount
}

afterEach(() => {
    previewFlag(false)
    vi.restoreAllMocks()
})

beforeEach(() => {
    vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.reject(new Error('preview mode must not call the network'))),
    )
})

describe('preview mode', () => {
    it('mounts fields without asking the licence service', async () => {
        const mount = await bootPreview('<body><select form-fields-type="select"></select></body>')

        expect(mount).toHaveBeenCalledTimes(1)
        expect(globalThis.fetch).not.toHaveBeenCalled()
    })

    it('binds no submit guard', async () => {
        await bootPreview('<body><div fa-form="true"><form name="ours"></form></div></body>')

        const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
        const event = new w.window.Event('submit', { bubbles: true, cancelable: true })
        document.querySelector('[name="ours"]')!.dispatchEvent(event)

        // Not prevented: the submission half is never installed here, so the
        // page behaves exactly as if the script were absent.
        expect(event.defaultPrevented).toBe(false)
    })

    it('exposes the same global, so the builder can mount and destroy', async () => {
        await bootPreview('<body></body>')
        const api = (globalThis.window as unknown as { FormFieldsPro?: { mount: unknown; destroy: unknown } })
            .FormFieldsPro
        expect(typeof api?.mount).toBe('function')
        expect(typeof api?.destroy).toBe('function')
    })
})
