import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import { resetLayers } from '@flowappz/ffp-primitives/src/layer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, fire, publishPopover } from './setup'

type Registered = (api: ChunkApi) => void

/**
 * Load the chunk the way core does: publish `__ffpDefine`, let the module
 * register itself, then run the factory with a ChunkApi.
 */
async function loadChunk(): Promise<FieldDefinition<FfpFieldConfigV2>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }
    publishPopover()

    // Modules register on import, so each test needs a fresh evaluation.
    vi.resetModules()
    await import('../src/select/index')

    let definition: FieldDefinition<FfpFieldConfigV2> | null = null
    const api = fakeApi()
    api.defineField = (d) => {
        definition = d as FieldDefinition<FfpFieldConfigV2>
    }
    registered.select(api)
    if (!definition) throw new Error('select chunk registered no field')
    return definition
}

const MARKUP = (attrs = '', options = '') => `<body><form>
  <label for="country">Country</label>
  <select id="country" name="Country" class="w-select my-field" form-fields-type="select" ${attrs}>
    <option value="">Choose one</option>
    <option value="us">United States</option>
    <option value="gb" ${options}>United Kingdom</option>
  </select>
</form></body>`

let definition: FieldDefinition<FfpFieldConfigV2>
let mounted: FieldInstance | null = null

async function mount(html: string): Promise<{ select: HTMLSelectElement; trigger: HTMLElement }> {
    document.body.innerHTML = html.replace(/^<body>|<\/body>$/g, '')
    definition = await loadChunk()
    const select = document.querySelector('select') as unknown as HTMLSelectElement
    const config = definition.parse ? definition.parse(select) : ({} as FfpFieldConfigV2)
    mounted = definition.mount(select, config, { form: null, version: 'test' })
    return { select, trigger: document.querySelector('.ffp-select') as HTMLElement }
}

const listbox = () => document.querySelector('.ffp-listbox') as HTMLElement | null
const rows = () =>
    Array.from(document.querySelectorAll('.ffp-listbox-option')) as unknown as HTMLElement[]

beforeEach(() => resetLayers())
afterEach(() => {
    if (mounted) mounted.destroy()
    mounted = null
})

describe('select field', () => {
    it('hides the native select without removing it from the form', async () => {
        const { select, trigger } = await mount(MARKUP())
        expect(trigger).not.toBeNull()
        // Clip-hidden, not display:none: a `required` control the browser cannot
        // render is a control it refuses to focus, and Webflow's validation dies
        // with "An invalid form control is not focusable".
        expect(select.classList.contains('ffp-select-native')).toBe(true)
        expect(select.getAttribute('tabindex')).toBe('-1')
        expect(select.isConnected).toBe(true)
        expect(select.form).not.toBeNull()
    })

    it('carries the author own classes onto the trigger', async () => {
        const { trigger } = await mount(MARKUP())
        // Select2 threw these away and repainted the control with 60 lines of
        // overrides. Keeping them is what makes a Webflow-styled field survive.
        expect(trigger.classList.contains('w-select')).toBe(true)
        expect(trigger.classList.contains('my-field')).toBe(true)
    })

    it('shows the selected option label', async () => {
        const { trigger } = await mount(MARKUP())
        expect((trigger.querySelector('.ffp-select-value') as HTMLElement).textContent).toBe('Choose one')
    })

    it('respects data-searchable="false"', async () => {
        // The live bug this phase fixes. `getAttribute` returns the string
        // "false", which is truthy, so 5.1.5 handed Select2
        // `minimumResultsForSearch: 0` and every select was searchable.
        const { trigger } = await mount(MARKUP('data-searchable="false"'))
        fire(trigger, 'pointerdown')
        expect(listbox()).not.toBeNull()
        expect(listbox()!.querySelector('.ffp-listbox-search')).toBeNull()
    })

    it('shows the search box when data-searchable is true', async () => {
        const { trigger } = await mount(MARKUP('data-searchable="true"'))
        fire(trigger, 'pointerdown')
        expect(listbox()!.querySelector('.ffp-listbox-search')).not.toBeNull()
    })

    it('leaves search off when the attribute is absent', async () => {
        const { trigger } = await mount(MARKUP())
        fire(trigger, 'pointerdown')
        expect(listbox()!.querySelector('.ffp-listbox-search')).toBeNull()
    })

    it('writes the choice back to the native select and fires both events', async () => {
        const { select, trigger } = await mount(MARKUP())
        const input = vi.fn()
        const change = vi.fn()
        select.addEventListener('input', input)
        select.addEventListener('change', change)

        fire(trigger, 'pointerdown')
        fire(rows()[1], 'click')

        expect(select.value).toBe('us')
        // Both, once each: conditional logic listens on `input`, Webflow
        // interactions and customer scripts listen on `change`.
        expect(input).toHaveBeenCalledTimes(1)
        expect(change).toHaveBeenCalledTimes(1)
        expect((trigger.querySelector('.ffp-select-value') as HTMLElement).textContent).toBe('United States')
    })

    it('closes after a choice and on a second click of the trigger', async () => {
        const { trigger } = await mount(MARKUP())
        fire(trigger, 'pointerdown')
        fire(rows()[1], 'click')
        expect(listbox()).toBeNull()
        expect(trigger.getAttribute('aria-expanded')).toBe('false')

        fire(trigger, 'pointerdown')
        expect(listbox()).not.toBeNull()
        fire(trigger, 'pointerdown')
        expect(listbox()).toBeNull()
    })

    it('closes on Escape', async () => {
        const { trigger } = await mount(MARKUP())
        fire(trigger, 'pointerdown')
        fire(document.body, 'keydown', { key: 'Escape' })
        expect(listbox()).toBeNull()
        expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('opens from the keyboard', async () => {
        const { trigger } = await mount(MARKUP())
        fire(trigger, 'keydown', { key: 'ArrowDown' })
        expect(listbox()).not.toBeNull()
    })

    it('marks a disabled option disabled', async () => {
        const { trigger } = await mount(MARKUP('', 'disabled'))
        fire(trigger, 'pointerdown')
        expect(rows()[2].getAttribute('aria-disabled')).toBe('true')
    })

    it('turns an optgroup label into a disabled header row', async () => {
        await mount(`<form><select name="X" form-fields-type="select">
            <option value="a">Alpha</option>
            <optgroup label="Europe"><option value="gb">United Kingdom</option></optgroup>
        </select></form>`)
        const trigger = document.querySelector('.ffp-select') as HTMLElement
        fire(trigger, 'pointerdown')
        const labels = rows().map((r) => [r.textContent, r.getAttribute('aria-disabled')])
        expect(labels).toEqual([
            ['Alpha', null],
            ['Europe', 'true'],
            ['United Kingdom', null],
        ])
    })

    it('applies the hover theme to the listbox, not to the document', async () => {
        const { trigger } = await mount(
            MARKUP('data-light-theme-hover-background-color="#ff0000" data-light-theme-hover-text-color="#ffffff"'),
        )
        fire(trigger, 'pointerdown')
        const root = listbox()!
        // Per-element custom properties, so two selects on one page can differ.
        // 5.1.5 could only do this by mutating each select's `id` at runtime and
        // pushing another sheet onto `document.adoptedStyleSheets`.
        expect(root.style.getPropertyValue('--ffp-hover-background-color-light')).toBe('#ff0000')
        expect(root.style.getPropertyValue('--ffp-hover-text-color-light')).toBe('#ffffff')
        // Highlight is copied onto both scheme halves so dark-mode visitors
        // still see the colour the author picked.
        expect(root.style.getPropertyValue('--ffp-hover-background-color-dark')).toBe('#ff0000')
        expect(root.style.getPropertyValue('--ffp-hover-text-color-dark')).toBe('#ffffff')
    })

    it('paints idle option colours from the dark-hover attributes', async () => {
        const { trigger } = await mount(
            MARKUP(
                'data-light-theme-hover-background-color="#146ef5" data-light-theme-hover-text-color="#ffffff" data-dark-theme-hover-background-color="#fafafa" data-dark-theme-hover-text-color="#111111"',
            ),
        )
        fire(trigger, 'pointerdown')
        const root = listbox()!
        expect(root.style.getPropertyValue('--ffp-text-color')).toBe('#111111')
        expect(root.style.getPropertyValue('--ffp-dropdown-background-color')).toBe('#fafafa')
        // Must not land on the hover-dark tokens: those are the highlighted row.
        expect(root.style.getPropertyValue('--ffp-hover-background-color-dark')).toBe('#146ef5')
        expect(root.style.getPropertyValue('--ffp-hover-text-color-dark')).toBe('#ffffff')
    })

    it('reflects a value changed by someone else', async () => {
        const { select, trigger } = await mount(MARKUP())
        select.value = 'gb'
        fire(select, 'change')
        expect((trigger.querySelector('.ffp-select-value') as HTMLElement).textContent).toBe('United Kingdom')
    })

    it('restores the native select on destroy', async () => {
        const { select } = await mount(MARKUP())
        mounted!.destroy()
        mounted = null
        expect(document.querySelector('.ffp-select')).toBeNull()
        expect(select.classList.contains('ffp-select-native')).toBe(false)
        expect(select.getAttribute('tabindex')).toBeNull()
        expect(select.getAttribute('aria-hidden')).toBeNull()
    })

    it('leaves the native select alone when the shared chunk is missing', async () => {
        document.body.innerHTML = MARKUP().replace(/^<body>|<\/body>$/g, '')
        definition = await loadChunk()
        // Loaded, then the shared surface disappears - a hand-loaded chunk, or a
        // `ui-popover` that failed SRI. A plain working select beats a half-built one.
        ;(globalThis.window as unknown as { __ffpShared?: unknown }).__ffpShared = undefined
        const select = document.querySelector('select') as unknown as HTMLSelectElement
        const instance = definition.mount(select, definition.parse!(select), { form: null, version: 'test' })
        expect(document.querySelector('.ffp-select')).toBeNull()
        expect(select.classList.contains('ffp-select-native')).toBe(false)
        instance.destroy()
    })
})
