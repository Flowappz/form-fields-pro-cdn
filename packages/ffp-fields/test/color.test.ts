import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import { resetLayers } from '@flowappz/ffp-primitives/src/layer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, fire, publishPopover, resetDom } from './setup'

type Registered = (api: ChunkApi) => void

async function loadChunk(): Promise<FieldDefinition<FfpFieldConfigV2>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }
    publishPopover()
    vi.resetModules()
    await import('../src/color/index')

    let definition: FieldDefinition<FfpFieldConfigV2> | null = null
    const api = fakeApi()
    api.defineField = (d) => {
        definition = d as FieldDefinition<FfpFieldConfigV2>
    }
    registered.color(api)
    if (!definition) throw new Error('color chunk registered no field')
    return definition
}

const MARKUP = (attrs = '') => `<body><form><div form-fields-wrapper="true">
  <input class="color-input" name="Brand colour" ${attrs}>
</div></form></body>`

let mounted: FieldInstance | null = null

async function mount(html: string): Promise<HTMLInputElement> {
    resetDom(html)
    const definition = await loadChunk()
    const input = document.querySelector('.color-input') as HTMLInputElement
    mounted = definition.mount(input, definition.parse!(input), { form: null, version: 'test' })
    return input
}

const trigger = () => document.querySelector('.ffp-color-trigger') as HTMLElement
const panel = () => document.querySelector('.ffp-cp')
const hue = () => document.querySelector('.ffp-cp-hue') as HTMLElement
const choose = () => document.querySelector('.ffp-cp-choose') as HTMLElement

function rect(el: HTMLElement, width: number, height: number): void {
    el.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width, height, right: width, bottom: height, x: 0, y: 0 }) as DOMRect
}

afterEach(() => {
    if (mounted) mounted.destroy()
    mounted = null
    resetLayers()
})

describe('the trigger', () => {
    it('replaces the input with a swatch and keeps the input as the control', async () => {
        // spectrum hid the input behind its own; here the customer's input is
        // still the thing that gets submitted.
        const input = await mount(MARKUP('value="#146ef5"'))
        expect(trigger()).not.toBeNull()
        expect(trigger().style.background).toBe('#146ef5')
        expect(input.classList.contains('ffp-color-native')).toBe(true)
        expect(input.getAttribute('name')).toBe('Brand colour')
    })

    it('takes the default colour when the input is empty', async () => {
        const input = await mount(MARKUP('data-default-color="#ff0000"'))
        expect(input.value).toBe('#ff0000')
        expect(trigger().style.background).toBe('#ff0000')
    })

    it('opens and closes the panel', async () => {
        await mount(MARKUP('value="#146ef5"'))
        trigger().click()
        expect(panel()).not.toBeNull()
        expect(trigger().getAttribute('aria-expanded')).toBe('true')

        trigger().click()
        expect(panel()).toBeNull()
    })

    it('does nothing without the popover chunk', async () => {
        resetDom(MARKUP('value="#146ef5"'))
        const registered: Record<string, Registered> = {}
        const w = globalThis.window as unknown as { __ffpShared?: unknown; __ffpDefine?: unknown }
        w.__ffpDefine = (key: string, factory: Registered) => {
            registered[key] = factory
        }
        delete w.__ffpShared
        vi.resetModules()
        await import('../src/color/index')
        let definition: FieldDefinition<FfpFieldConfigV2> | null = null
        const api = fakeApi()
        api.defineField = (d) => {
            definition = d as FieldDefinition<FfpFieldConfigV2>
        }
        registered.color(api)

        const input = document.querySelector('.color-input') as HTMLInputElement
        const instance = definition!.mount(input, definition!.parse!(input), {
            form: null,
            version: 'test',
        })
        expect(trigger()).toBeNull()
        expect(input.classList.contains('ffp-color-native')).toBe(false)
        instance.destroy()
    })
})

describe('choosing a colour', () => {
    it('writes a hex string and announces it', async () => {
        const input = await mount(MARKUP('value="#ff0000"'))
        const onChange = vi.fn()
        input.addEventListener('change', onChange)

        trigger().click()
        rect(hue(), 200, 12)
        fire(hue(), 'pointerdown', { clientX: 100, clientY: 6, button: 0, pointerId: 1 })
        choose().click()

        expect(input.value).toBe('#00ffff')
        expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('commits on dismiss too, as spectrum did on hide', async () => {
        const input = await mount(MARKUP('value="#ff0000"'))
        trigger().click()
        rect(hue(), 200, 12)
        fire(hue(), 'pointerdown', { clientX: 100, clientY: 6, button: 0, pointerId: 1 })

        // Click outside: the layer stack closes the panel.
        fire(document.body, 'pointerdown', { clientX: 0, clientY: 0, button: 0, pointerId: 2 })

        expect(input.value).toBe('#00ffff')
        expect(panel()).toBeNull()
    })

    it('previews on the trigger while dragging, before any commit', async () => {
        const input = await mount(MARKUP('value="#ff0000"'))
        trigger().click()
        rect(hue(), 200, 12)
        fire(hue(), 'pointerdown', { clientX: 100, clientY: 6, button: 0, pointerId: 1 })

        expect(trigger().style.background).toBe('#00ffff')
        expect(input.value).toBe('#ff0000')
    })
})

describe('theme', () => {
    it('writes the palette onto the panel', async () => {
        await mount(MARKUP('value="#146ef5" data-light-theme-color-picker-background-color="#00ff00"'))
        trigger().click()
        expect((panel() as HTMLElement).style.getPropertyValue('--ffp-hover-background-color-light')).toBe(
            '#00ff00',
        )
    })
})

describe('lifecycle', () => {
    it('accepts a value through the registry', async () => {
        const input = await mount(MARKUP('value="#000000"'))
        mounted!.setValue!('#123456')
        expect(input.value).toBe('#123456')
        expect(trigger().style.background).toBe('#123456')
    })

    it('restores the input on destroy', async () => {
        const input = await mount(MARKUP('value="#146ef5"'))
        trigger().click()
        mounted!.destroy()
        mounted = null

        expect(panel()).toBeNull()
        expect(document.querySelector('.ffp-color-trigger')).toBeNull()
        expect(input.classList.contains('ffp-color-native')).toBe(false)
        expect(input.getAttribute('tabindex')).toBeNull()
    })
})
