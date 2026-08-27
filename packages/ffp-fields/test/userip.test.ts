import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, resetDom } from './setup'

type Registered = (api: ChunkApi) => void

async function loadChunk(): Promise<FieldDefinition<unknown>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }
    vi.resetModules()
    const module = await import('../src/userip/index')
    ;(module as { resetUserIp: () => void }).resetUserIp()

    let definition: FieldDefinition<unknown> | null = null
    const api = fakeApi()
    api.defineField = (d) => {
        definition = d as FieldDefinition<unknown>
    }
    registered.userip(api)
    if (!definition) throw new Error('userip chunk registered no field')
    return definition
}

let mounted: FieldInstance[] = []

async function mount(html: string, ip = '203.0.113.9'): Promise<ReturnType<typeof vi.fn>> {
    resetDom(html)
    const fetchSpy = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ip }) }))
    vi.stubGlobal('fetch', fetchSpy)

    const definition = await loadChunk()
    for (const el of Array.from(
        document.querySelectorAll('[form-fields-pro-user-ip-input], [form-fields-pro-user-ip-admin-alert]'),
    )) {
        mounted.push(definition.mount(el, {}, { form: null, version: 'test' }))
    }
    await Promise.resolve()
    await Promise.resolve()
    return fetchSpy
}

afterEach(() => {
    for (const instance of mounted) instance.destroy()
    mounted = []
    vi.unstubAllGlobals()
})

describe('userip', () => {
    it('fills the input from our own data client', async () => {
        await mount('<body><input form-fields-pro-user-ip-input name="IP"></body>')
        const input = document.querySelector('input') as HTMLInputElement
        expect(input.value).toBe('203.0.113.9')
    })

    it('announces the value it wrote', async () => {
        resetDom('<body><input form-fields-pro-user-ip-input name="IP"></body>')
        vi.stubGlobal('fetch', () => Promise.resolve({ ok: true, json: () => Promise.resolve({ ip: '1.2.3.4' }) }))
        const definition = await loadChunk()
        const input = document.querySelector('input') as HTMLInputElement
        const onChange = vi.fn()
        input.addEventListener('change', onChange)
        mounted.push(definition.mount(input, {}, { form: null, version: 'test' }))
        // fetch, then `response.json()`: more microtasks than a couple of ticks.
        await new Promise((resolve) => setTimeout(resolve, 0))
        expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('makes one request however many inputs are on the page', async () => {
        const fetchSpy = await mount(
            '<body><input form-fields-pro-user-ip-input name="a"><input form-fields-pro-user-ip-input name="b"></body>',
        )
        expect(fetchSpy).toHaveBeenCalledTimes(1)
        const values = Array.from(document.querySelectorAll('input')).map((i) => (i as HTMLInputElement).value)
        expect(values).toEqual(['203.0.113.9', '203.0.113.9'])
    })

    it('hides the admin alert and restores it on destroy', async () => {
        await mount('<body><div form-fields-pro-user-ip-admin-alert>Only on the published site</div></body>')
        const alert = document.querySelector('[form-fields-pro-user-ip-admin-alert]') as HTMLElement
        expect(alert.style.display).toBe('none')

        for (const instance of mounted) instance.destroy()
        mounted = []
        expect(alert.style.display).toBe('')
    })

    it('leaves the input empty when the lookup fails', async () => {
        resetDom('<body><input form-fields-pro-user-ip-input name="IP"></body>')
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')))
        const definition = await loadChunk()
        const input = document.querySelector('input') as HTMLInputElement
        mounted.push(definition.mount(input, {}, { form: null, version: 'test' }))
        await Promise.resolve()
        await Promise.resolve()
        expect(input.value).toBe('')
        warn.mockRestore()
    })

    it('does not write into an input that was destroyed while in flight', async () => {
        resetDom('<body><input form-fields-pro-user-ip-input name="IP"></body>')
        let resolveIp: (v: unknown) => void = () => {}
        vi.stubGlobal('fetch', () => new Promise((resolve) => (resolveIp = resolve)))
        const definition = await loadChunk()
        const input = document.querySelector('input') as HTMLInputElement
        const instance = definition.mount(input, {}, { form: null, version: 'test' })

        instance.destroy()
        resolveIp({ ok: true, json: () => Promise.resolve({ ip: '9.9.9.9' }) })
        await Promise.resolve()
        await Promise.resolve()
        expect(input.value).toBe('')
    })
})
