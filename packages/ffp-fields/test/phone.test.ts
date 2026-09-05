import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import { registerDialCodes, resetDialCodes } from '@flowappz/ffp-core/src/phone-value'
import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import { resetLayers } from '@flowappz/ffp-primitives/src/layer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, fire, publishPopover, resetDom } from './setup'

type Registered = (api: ChunkApi) => void

let registeredDialCodes: Record<string, string> | null = null

async function loadChunk(): Promise<FieldDefinition<FfpFieldConfigV2>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }
    publishPopover()
    vi.resetModules()
    await import('../src/phone/index')

    let definition: FieldDefinition<FfpFieldConfigV2> | null = null
    const api = fakeApi()
    api.defineField = (d) => {
        definition = d as FieldDefinition<FfpFieldConfigV2>
    }
    api.registerDialCodes = (map) => {
        registeredDialCodes = map as Record<string, string>
        registerDialCodes(map)
    }
    registered.phone(api)
    if (!definition) throw new Error('phone chunk registered no field')
    return definition
}

const MARKUP = (attrs = '') => `<body><form><div form-fields-wrapper="true">
  <div data-form-field-pro="number-input-with-country-code" ${attrs}>
    <div class="number-input-icon-wrapper"></div>
    <div class="number-input-dropdown"><input class="number-input-search-field"><ol></ol></div>
    <input class="number-input-field" type="tel" name="Phone">
  </div>
</div></form></body>`

let mounted: FieldInstance | null = null

async function mount(html: string): Promise<HTMLInputElement> {
    resetDom(html)
    const definition = await loadChunk()
    const field = document.querySelector('[data-form-field-pro]') as HTMLElement
    mounted = definition.mount(field, definition.parse!(field), { form: null, version: 'test' })
    // The geo guess resolves on a microtask.
    await Promise.resolve()
    await Promise.resolve()
    return document.querySelector('.number-input-field') as HTMLInputElement
}

const field = () => document.querySelector('[data-form-field-pro]') as HTMLElement
const trigger = () => document.querySelector('.number-input-icon-wrapper') as HTMLElement
const listbox = () => document.querySelector('[data-ffp-listbox]')
const rows = () => Array.from(document.querySelectorAll('[data-ffp-listbox] [role="option"]'))
const search = () => document.querySelector('.ffp-listbox-search') as HTMLInputElement

beforeEach(() => {
    resetDialCodes()
    registeredDialCodes = null
})

afterEach(() => {
    if (mounted) mounted.destroy()
    mounted = null
    resetLayers()
})

describe('what core depends on', () => {
    it('registers the dial codes core validates and submits with', async () => {
        // Core holds no country table; this is the only copy on the page, and
        // `isDialCodeOnlyPhoneValue` answers false without it.
        await mount(MARKUP())
        expect(registeredDialCodes!.BD).toBe('880')
        expect(Object.keys(registeredDialCodes!).length).toBe(252)
    })

    it('keeps data-selected-country on the wrapper', async () => {
        // `getSelectedDialCodeForPhoneInput` in core reads exactly this.
        await mount(MARKUP('data-selected-country="BD"'))
        expect(field().getAttribute('data-selected-country')).toBe('BD')
    })
})

describe('no vendors', () => {
    it('draws flags with regional indicators, not Iconify spans', async () => {
        await mount(MARKUP('data-selected-country="GB"'))
        expect(document.querySelector('.iconify')).toBeNull()
        const flag = trigger().querySelector('.ffp-flag')!
        // Windows has no flag glyphs, so the field paints a two-letter chip
        // instead. Either drawing is ours; Iconify is what this test forbids.
        if (flag.getAttribute('data-chip') === 'true') {
            expect(flag.textContent).toBe('GB')
        } else {
            expect(flag.textContent).toBe('\u{1F1EC}\u{1F1E7}')
        }
    })

    it('builds no country rows until the picker is opened', async () => {
        // 5.1.5 built 252 `<li>`s with 252 Iconify lookups on every page view,
        // whether or not anyone opened the dropdown.
        await mount(MARKUP())
        expect(rows().length).toBe(0)
    })

    it('hides the legacy dropdown shell rather than filling it', async () => {
        await mount(MARKUP())
        expect((document.querySelector('.number-input-dropdown') as HTMLElement).style.display).toBe('none')
    })

    it('makes no network request on mount', async () => {
        const fetchSpy = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }))
        vi.stubGlobal('fetch', fetchSpy)
        await mount(MARKUP())
        expect(fetchSpy).not.toHaveBeenCalled()
        vi.unstubAllGlobals()
    })
})

describe('the picker', () => {
    it('opens a listbox of every country with its dial code', async () => {
        await mount(MARKUP())
        fire(trigger(), 'pointerdown')
        expect(listbox()).not.toBeNull()
        expect(rows().length).toBe(252)

        const bangladesh = rows().filter((r) => r.textContent!.indexOf('Bangladesh') !== -1)[0]
        expect(bangladesh.textContent).toContain('+880')
        expect(bangladesh.querySelector('.ffp-flag')).not.toBeNull()
    })

    it('searches by name, ISO code and dial code', async () => {
        // 5.1.5 matched on the country name alone.
        await mount(MARKUP())
        fire(trigger(), 'pointerdown')

        search().value = '880'
        fire(search(), 'input')
        expect(rows()[0].textContent).toContain('Bangladesh')

        search().value = 'bd'
        fire(search(), 'input')
        expect(rows()[0].textContent).toContain('Bangladesh')
    })

    it('writes the dial code and the country when one is picked', async () => {
        const input = await mount(MARKUP())
        fire(trigger(), 'pointerdown')
        const bangladesh = rows().filter((r) => r.textContent!.indexOf('Bangladesh') !== -1)[0]
        ;(bangladesh as HTMLElement).click()

        expect(input.value).toBe('+880 ')
        expect(field().getAttribute('data-selected-country')).toBe('BD')
        expect(listbox()).toBeNull()
    })

    it('closes on Escape through the layer stack', async () => {
        // 5.1.5 had its own `$(document).on('click.ffpPhoneDropdown')` and no
        // Escape handling at all.
        await mount(MARKUP())
        fire(trigger(), 'pointerdown')
        // linkedom has no KeyboardEvent constructor; the layer stack only reads
        // `key`, and `fire` assigns it onto a plain Event.
        fire(document, 'keydown', { key: 'Escape' })
        expect(listbox()).toBeNull()
    })

    it('opens from the keyboard', async () => {
        await mount(MARKUP())
        expect(trigger().getAttribute('tabindex')).toBe('0')
        fire(trigger(), 'keydown', { key: 'Enter' })
        expect(listbox()).not.toBeNull()
    })
})

describe('the value', () => {
    it('seeds the dial code when the field is empty', async () => {
        const input = await mount(MARKUP('data-selected-country="GB"'))
        expect(input.value).toBe('+44 ')
    })

    it('does not clobber a number already in the field', async () => {
        resetDom(MARKUP('data-selected-country="GB"'))
        const definition = await loadChunk()
        ;(document.querySelector('.number-input-field') as HTMLInputElement).value = '+44 7700900123'
        const el = document.querySelector('[data-form-field-pro]') as HTMLElement
        mounted = definition.mount(el, definition.parse!(el), { form: null, version: 'test' })
        expect((document.querySelector('.number-input-field') as HTMLInputElement).value).toBe(
            '+44 7700900123',
        )
    })

    it('normalises a national number on blur', async () => {
        // Autofill hands back `07700900123`; the lead is useless without E.164.
        const input = await mount(MARKUP('data-selected-country="GB"'))
        input.value = '07700 900123'
        fire(input, 'blur')
        expect(input.value).toBe('+44 7700900123')
    })

    it('leaves a bare dial code alone', async () => {
        const input = await mount(MARKUP('data-selected-country="GB"'))
        input.value = '+44 '
        fire(input, 'blur')
        expect(input.value).toBe('+44 ')
    })

    it('leaves a number too short to be real alone', async () => {
        const input = await mount(MARKUP('data-selected-country="GB"'))
        input.value = '123'
        fire(input, 'blur')
        expect(input.value).toBe('123')
    })
})

describe('the geo default', () => {
    it('never overrules a country already on the element', async () => {
        const input = await mount(MARKUP('data-selected-country="BD"'))
        expect(field().getAttribute('data-selected-country')).toBe('BD')
        expect(input.value).toBe('+880 ')
    })

    it('uses the opt-in lookup when the field asks for one', async () => {
        const fetchSpy = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ country: 'BD' }) }),
        )
        vi.stubGlobal('fetch', fetchSpy)
        const input = await mount(MARKUP('data-geo-lookup="https://ipinfo.io/json"'))
        await Promise.resolve()

        expect(fetchSpy).toHaveBeenCalledWith('https://ipinfo.io/json', { credentials: 'omit' })
        expect(field().getAttribute('data-selected-country')).toBe('BD')
        expect(input.value).toBe('+880 ')
        vi.unstubAllGlobals()
    })
})

describe('lifecycle', () => {
    it('restores the legacy shell on destroy', async () => {
        await mount(MARKUP())
        fire(trigger(), 'pointerdown')
        mounted!.destroy()
        mounted = null

        expect(listbox()).toBeNull()
        expect((document.querySelector('.number-input-dropdown') as HTMLElement).style.display).toBe('')
        expect(trigger().getAttribute('aria-expanded')).toBeNull()
    })
})
