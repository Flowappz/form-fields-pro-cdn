import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import { resetLayers } from '@flowappz/ffp-primitives/src/layer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, fire, publishPopover, resetDom } from './setup'

type Registered = (api: ChunkApi) => void

async function loadChunk(): Promise<Record<string, FieldDefinition<FfpFieldConfigV2>>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }
    publishPopover()

    vi.resetModules()
    await import('../src/date/index')

    const defined: Record<string, FieldDefinition<FfpFieldConfigV2>> = {}
    const api = fakeApi()
    api.defineField = (d) => {
        defined[d.name] = d as FieldDefinition<FfpFieldConfigV2>
    }
    registered.date(api)
    return defined
}

const MARKUP = (marker: string, attrs = '', extra = '') => `<body><form>
  <div form-fields-wrapper="true">
    <input type="text" name="When" ${marker} ${attrs}>
    ${extra}
  </div>
</form></body>`

let mounted: FieldInstance | null = null

async function mount(html: string, type: 'date' | 'daterange' = 'date'): Promise<HTMLInputElement> {
    resetDom(html)
    const defined = await loadChunk()
    const input = document.querySelector('input') as HTMLInputElement
    mounted = defined[type].mount(input, defined[type].parse!(input), { form: null, version: 'test' })
    return input
}

const calendar = () => document.querySelector('.ffp-cal')
const day = (iso: string) => document.querySelector(`.ffp-cal-day[data-date="${iso}"]`) as HTMLElement
const title = () => Array.from(document.querySelectorAll('.ffp-cal-select')).map((n) => n.textContent)

/**
 * An empty range opens on today, so August fixtures vanish the moment the
 * calendar rolls into September. Days 10 and 14 exist in every month the grid
 * can show; the default format is MM/DD/YYYY.
 */
function thisMonth(dayNum: number): { iso: string; mdY: string } {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const month = pad(now.getMonth() + 1)
    const date = pad(dayNum)
    return { iso: `${now.getFullYear()}-${month}-${date}`, mdY: `${month}/${date}/${now.getFullYear()}` }
}

afterEach(() => {
    if (mounted) mounted.destroy()
    mounted = null
    resetLayers()
})

describe('opening', () => {
    it('opens on a click and closes on the next one', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-picker'))
        expect(calendar()).toBeNull()

        fire(input, 'click')
        expect(calendar()).not.toBeNull()

        fire(input, 'click')
        expect(calendar()).toBeNull()
    })

    it('opens from the keyboard without submitting the form', async () => {
        // Enter inside a form submits it. With a calendar to open, it must not.
        const input = await mount(MARKUP('form-fields-pro-date-picker'))
        // The harness's `fire` stubs `preventDefault`, so spy on it rather than
        // reading `defaultPrevented`.
        const prevented = vi.fn()
        fire(input, 'keydown', { key: 'Enter', preventDefault: prevented })
        expect(calendar()).not.toBeNull()
        expect(prevented).toHaveBeenCalled()
    })

    it('opens from the icon beside it', async () => {
        const input = await mount(
            MARKUP('form-fields-pro-date-picker', '', '<div class="date-input-icon"></div>'),
        )
        fire(document.querySelector('.date-input-icon')!, 'click')
        expect(calendar()).not.toBeNull()
        expect(input.getAttribute('aria-expanded')).toBe('true')
    })

    it('keeps the input read-only', async () => {
        // The value has to match `data-format` exactly for the payload, and a
        // free-text date is the commonest unparseable submission there is.
        const input = await mount(MARKUP('form-fields-pro-date-picker'))
        expect(input.readOnly).toBe(true)
    })

    it('does nothing without the popover chunk', async () => {
        resetDom(MARKUP('form-fields-pro-date-picker'))
        const w = globalThis.window as unknown as { __ffpShared?: unknown; __ffpDefine?: unknown }
        const registered: Record<string, Registered> = {}
        w.__ffpDefine = (key: string, factory: Registered) => {
            registered[key] = factory
        }
        delete w.__ffpShared
        vi.resetModules()
        await import('../src/date/index')
        const defined: Record<string, FieldDefinition<FfpFieldConfigV2>> = {}
        const api = fakeApi()
        api.defineField = (d) => {
            defined[d.name] = d as FieldDefinition<FfpFieldConfigV2>
        }
        registered.date(api)

        const input = document.querySelector('input') as HTMLInputElement
        const instance = defined.date.mount(input, defined.date.parse!(input), {
            form: null,
            version: 'test',
        })
        fire(input, 'click')
        expect(calendar()).toBeNull()
        // And the input is left alone rather than half-built.
        expect(input.readOnly).toBe(false)
        instance.destroy()
    })
})

describe('single date', () => {
    it('writes the picked date in the customer format and announces it', async () => {
        const input = await mount(
            MARKUP('form-fields-pro-date-picker', 'data-format="DD/MM/YYYY" value="10/08/2026"'),
        )
        const onInput = vi.fn()
        const onChange = vi.fn()
        input.addEventListener('input', onInput)
        input.addEventListener('change', onChange)

        fire(input, 'click')
        day('2026-08-14').click()

        expect(input.value).toBe('14/08/2026')
        expect(onInput).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('closes once a single date is chosen', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-picker', 'value="08/10/2026"'))
        fire(input, 'click')
        day('2026-08-14').click()
        expect(calendar()).toBeNull()
    })

    it('opens on the month of the current value', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-picker', 'value="12/25/2026"'))
        fire(input, 'click')
        expect(title()).toEqual(['December', '2026'])
    })

    it('reads the value back through the same format it wrote', async () => {
        // The round trip that matters: a customer on DD/MM/YYYY must not have
        // 03/04 reopened as 4 March.
        const input = await mount(
            MARKUP('form-fields-pro-date-picker', 'data-format="DD/MM/YYYY" value="03/04/2026"'),
        )
        fire(input, 'click')
        expect(title()).toEqual(['April', '2026'])
    })

    it('survives a value it cannot parse', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-picker', 'value="tomorrow"'))
        fire(input, 'click')
        expect(calendar()).not.toBeNull()
    })
})

describe('range', () => {
    it('writes both ends with the easepick delimiter', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-range-picker'), 'daterange')
        const start = thisMonth(10)
        const end = thisMonth(14)
        fire(input, 'click')
        day(start.iso).click()
        expect(input.value).toBe('')
        day(end.iso).click()
        expect(input.value).toBe(`${start.mdY} - ${end.mdY}`)
    })

    it('reopens on the range it wrote', async () => {
        const input = await mount(
            MARKUP('form-fields-pro-date-range-picker', 'value="08/10/2026 - 08/14/2026"'),
            'daterange',
        )
        fire(input, 'click')
        expect(day('2026-08-12').getAttribute('data-in-range')).toBe('true')
        expect(day('2026-08-10').getAttribute('data-edge')).toBe('start')
    })

    it('stays open between the two picks', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-range-picker'), 'daterange')
        fire(input, 'click')
        day(thisMonth(10).iso).click()
        expect(calendar()).not.toBeNull()
        day(thisMonth(14).iso).click()
        expect(calendar()).toBeNull()
    })
})

describe('options', () => {
    it('honours months and columns', async () => {
        const input = await mount(
            MARKUP('form-fields-pro-date-picker', 'data-months="3" data-columns="3"'),
        )
        fire(input, 'click')
        expect(document.querySelectorAll('.ffp-cal-month').length).toBe(3)
        expect((calendar() as HTMLElement).style.getPropertyValue('--cal-columns')).toBe('3')
    })

    it('honours firstDay, including 7 for Sunday', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-picker', 'data-firstDay="7"'))
        fire(input, 'click')
        expect(document.querySelector('.ffp-cal-week span')!.textContent).toBe('S')

        mounted!.destroy()
        const monday = await mount(MARKUP('form-fields-pro-date-picker', 'data-firstDay="1"'))
        fire(monday, 'click')
        expect(document.querySelector('.ffp-cal-week span')!.textContent).toBe('M')
    })

    it('honours the language, with no locale pack to download', async () => {
        const input = await mount(
            MARKUP('form-fields-pro-date-picker', 'data-language="fr-FR" value="08/26/2026"'),
        )
        fire(input, 'click')
        expect(title()[0]).toBe('août')
    })

    it('honours zIndex', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-picker', 'data-zIndex="4200"'))
        fire(input, 'click')
        expect((calendar() as HTMLElement).style.zIndex).toBe('4200')
    })
})

describe('theme', () => {
    it('writes the palette onto the calendar, not the document', async () => {
        // Two date fields on one page can carry different palettes. 5.1.5 could
        // only manage that by reaching into easepick's shadow root on every
        // render.
        const input = await mount(
            MARKUP(
                'form-fields-pro-date-picker',
                'data-light-theme-selected-date-background-color="#ff0000"',
            ),
        )
        fire(input, 'click')
        expect((calendar() as HTMLElement).style.getPropertyValue('--ffp-selected-date-background-color-light')).toBe(
            '#ff0000',
        )
    })

    it('paints no colours inline on the day cells', async () => {
        const input = await mount(
            MARKUP(
                'form-fields-pro-date-picker',
                'data-light-theme-selected-date-background-color="#ff0000" value="08/10/2026"',
            ),
        )
        fire(input, 'click')
        expect(day('2026-08-10').getAttribute('style')).toBeNull()
    })
})

describe('lifecycle', () => {
    it('exposes and accepts a value', async () => {
        await mount(MARKUP('form-fields-pro-date-picker'))
        mounted!.setValue!('08/26/2026')
        expect(mounted!.value!()).toBe('08/26/2026')
    })

    it('closes the calendar and unbinds on destroy', async () => {
        const input = await mount(MARKUP('form-fields-pro-date-picker'))
        fire(input, 'click')
        mounted!.destroy()
        mounted = null

        expect(calendar()).toBeNull()
        fire(input, 'click')
        expect(calendar()).toBeNull()
        expect(input.getAttribute('aria-expanded')).toBeNull()
    })

    it('registers both date and daterange from one chunk', async () => {
        resetDom('<body></body>')
        const defined = await loadChunk()
        expect(Object.keys(defined).sort()).toEqual(['date', 'daterange'])
    })
})
