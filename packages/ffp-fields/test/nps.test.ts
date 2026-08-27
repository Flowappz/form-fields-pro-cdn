import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, fire } from './setup'

type Registered = (api: ChunkApi) => void

async function loadChunk(): Promise<Record<string, FieldDefinition<FfpFieldConfigV2>>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }

    vi.resetModules()
    await import('../src/nps/index')

    const defined: Record<string, FieldDefinition<FfpFieldConfigV2>> = {}
    const api = fakeApi()
    api.defineField = (d) => {
        defined[d.name] = d as FieldDefinition<FfpFieldConfigV2>
    }
    registered.nps(api)
    return defined
}

const MARKUP = (attrs = '') => `<div data-field-name="net-promoter-score" ${attrs}>
    <input type="hidden" data-input="net-promoter-score" name="NPS">
    <div data-nps-scale>
        <div data-name="net-promoter-score-value">0</div>
        <div data-name="net-promoter-score-value">5</div>
        <div data-name="net-promoter-score-value">9</div>
    </div>
    <div data-field="extra-feedback-collection"><textarea></textarea></div>
</div>`

let mounted: FieldInstance | null = null

async function mount(html: string): Promise<{ root: HTMLElement; cells: HTMLElement[] }> {
    document.body.innerHTML = html
    const defined = await loadChunk()
    const root = document.querySelector('[data-field-name="net-promoter-score"]') as HTMLElement
    mounted = defined.nps.mount(root, defined.nps.parse!(root), { form: null, version: 'test' })
    return {
        root,
        cells: Array.from(
            root.querySelectorAll('[data-name="net-promoter-score-value"]'),
        ) as unknown as HTMLElement[],
    }
}

const input = () => document.querySelector('[data-input="net-promoter-score"]') as HTMLInputElement
const extra = () => document.querySelector('[data-field="extra-feedback-collection"]') as HTMLElement

afterEach(() => {
    if (mounted) mounted.destroy()
    mounted = null
})

describe('nps field', () => {
    it('writes the score to the hidden input and announces it', async () => {
        const { cells } = await mount(MARKUP())
        const onInput = vi.fn()
        const onChange = vi.fn()
        input().addEventListener('input', onInput)
        input().addEventListener('change', onChange)

        fire(cells[1], 'click')

        expect(input().value).toBe('5')
        // 5.1.5 only set `.val()`; conditional logic noticed because it polled
        // every 450 ms. Core listens for events, so silence would break it.
        expect(onInput).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('keeps exactly one cell selected', async () => {
        const { cells } = await mount(MARKUP())
        fire(cells[1], 'click')
        fire(cells[2], 'click')

        expect(cells.map((c) => c.classList.contains('ffp-nps-selected'))).toEqual([false, false, true])
        expect(cells.map((c) => c.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true'])
    })

    it('selects from the keyboard', async () => {
        const { cells } = await mount(MARKUP())
        fire(cells[0], 'keydown', { key: 'Enter' })
        expect(input().value).toBe('0')

        fire(cells[1], 'keydown', { key: ' ' })
        expect(input().value).toBe('5')
    })

    it('ignores other keys', async () => {
        const { cells } = await mount(MARKUP())
        fire(cells[0], 'keydown', { key: 'a' })
        expect(input().value).toBe('')
    })

    it('puts the cells in the tab order', async () => {
        // 5.1.5 bound keydown but never made a cell focusable, so the handler
        // could only fire for someone who had already clicked one.
        const { cells } = await mount(MARKUP())
        expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual(['0', '0', '0'])
        expect(cells[0].getAttribute('role')).toBe('button')
    })

    describe('extra feedback', () => {
        it('is hidden until a score below the threshold', async () => {
            const { cells } = await mount(MARKUP('data-extra-feedback-collection="7"'))
            expect(extra().style.display).toBe('none')

            fire(cells[1], 'click')
            expect(extra().style.display).toBe('')

            fire(cells[2], 'click')
            expect(extra().style.display).toBe('none')
        })

        it('stays visible when the setting is "always"', async () => {
            const { cells } = await mount(MARKUP('data-extra-feedback-collection="always"'))
            expect(extra().style.display).toBe('')
            fire(cells[2], 'click')
            expect(extra().style.display).toBe('')
        })

        it('never appears when the setting is "never"', async () => {
            // `parseInt('never')` is NaN and no score is less than NaN. That is
            // the whole implementation of "never", in 5.1.5 and here.
            const { cells } = await mount(MARKUP('data-extra-feedback-collection="never"'))
            fire(cells[0], 'click')
            expect(extra().style.display).toBe('none')
        })
    })

    describe('theme', () => {
        it('writes the palette as custom properties on the root and the scale', async () => {
            const { root } = await mount(
                MARKUP(
                    'data-light-theme-score-background-color="#ff0000" data-light-theme-idle-text-color="#111111"',
                ),
            )
            const scale = root.querySelector('[data-nps-scale]') as HTMLElement

            expect(root.style.getPropertyValue('--nps-hover-bg-light')).toBe('#ff0000')
            expect(root.style.getPropertyValue('--nps-text-light')).toBe('#111111')
            // Both nodes, because the stylesheet scopes some rules to the scale.
            expect(scale.style.getPropertyValue('--nps-hover-bg-light')).toBe('#ff0000')
        })

        it('follows hover for the selected colour when hover is not stock blue', async () => {
            // The ladder lives in @flowappz/ffp-config; this asserts the field
            // actually consumes it rather than re-deriving its own.
            const { root } = await mount(MARKUP('data-light-theme-score-background-color="#ff0000"'))
            expect(root.style.getPropertyValue('--nps-selected-bg-light')).toBe('#ff0000')
        })

        it('defaults the layout to connected and marks the scale', async () => {
            const { root } = await mount(MARKUP())
            const scale = root.querySelector('[data-nps-scale]') as HTMLElement
            expect(root.getAttribute('data-nps-layout')).toBe('connected')
            expect(scale.getAttribute('data-nps-scale')).toBe('true')
            expect(scale.getAttribute('data-nps-layout')).toBe('connected')
        })

        it('carries a separated layout through to the scale', async () => {
            const { root } = await mount(MARKUP('data-nps-layout="separated"'))
            const scale = root.querySelector('[data-nps-scale]') as HTMLElement
            expect(scale.getAttribute('data-nps-layout')).toBe('separated')
        })

        it('paints no colours inline on the cells', async () => {
            // The point of the rewrite: every state is CSS now, so a visitor who
            // switches their OS to dark mode mid-session follows along.
            const { cells } = await mount(MARKUP('data-light-theme-score-background-color="#ff0000"'))
            fire(cells[1], 'click')
            expect(cells[1].getAttribute('style')).toBeNull()
        })
    })

    it('exposes and accepts a value', async () => {
        await mount(MARKUP())
        mounted!.setValue!('9')
        expect(input().value).toBe('9')
        expect(mounted!.value!()).toBe('9')
    })

    it('cleans up on destroy', async () => {
        const { root, cells } = await mount(MARKUP('data-light-theme-score-background-color="#ff0000"'))
        fire(cells[1], 'click')
        mounted!.destroy()
        mounted = null

        expect(root.style.getPropertyValue('--nps-hover-bg-light')).toBe('')
        expect(cells[1].classList.contains('ffp-nps-selected')).toBe(false)
        fire(cells[2], 'click')
        expect(input().value).toBe('5')
    })

    it('still registers likert from the same chunk', async () => {
        document.body.innerHTML = ''
        const defined = await loadChunk()
        // Likert rides along here rather than paying its own round trip for a
        // stylesheet. It was nearly lost twice while NPS was being rewritten.
        expect(Object.keys(defined).sort()).toEqual(['likert', 'nps'])
    })

    it('injects the likert stylesheet on mount, and fixes the checked-input jump', async () => {
        document.body.innerHTML = '<input data-field="likert-scale-field-radio"><label></label>'
        const defined = await loadChunk()
        const radio = document.querySelector('[data-field]') as HTMLElement
        const instance = defined.likert.mount(radio, {} as never, { form: null, version: 'test' })

        const css = (document.getElementById('ffp-likert-overrides') as HTMLElement).textContent || ''
        // 5.1.5's selector list was `…:checked, …:not(:checked) + label`, so the
        // 20x20 box also landed on the checked *input* - which the rule above
        // sizes to 0x0 - and the row shifted sideways as the visitor clicked.
        expect(css).toContain(':checked + label')
        expect(css).not.toMatch(/:checked,\s*\[data-field/)
        instance.destroy()
    })
})
