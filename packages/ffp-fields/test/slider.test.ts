import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import type { FieldDefinition, FieldInstance } from '@flowappz/ffp-core/src/registry'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeApi, fire, resetDom } from './setup'

type Registered = (api: ChunkApi) => void

async function loadChunk(): Promise<Record<string, FieldDefinition<FfpFieldConfigV2>>> {
    const registered: Record<string, Registered> = {}
    const w = globalThis.window as unknown as { __ffpDefine?: (k: string, f: Registered) => void }
    w.__ffpDefine = (key, factory) => {
        registered[key] = factory
    }
    vi.resetModules()
    await import('../src/slider/index')

    const defined: Record<string, FieldDefinition<FfpFieldConfigV2>> = {}
    const api = fakeApi()
    api.defineField = (d) => {
        defined[d.name] = d as FieldDefinition<FfpFieldConfigV2>
    }
    registered.slider(api)
    return defined
}

const MARKUP = (attrs = '') => `<body><form><div form-fields-wrapper="true">
  <input form-fields-pro-number-slider form-fields-data-input name="Budget" ${attrs}>
</div></form></body>`

let mounted: FieldInstance | null = null

async function mount(html: string, type: 'slider' | 'rangeslider' = 'slider'): Promise<HTMLInputElement> {
    resetDom(html)
    const defined = await loadChunk()
    const input = document.querySelector('input') as HTMLInputElement
    mounted = defined[type].mount(input, defined[type].parse!(input), { form: null, version: 'test' })
    // linkedom has no layout; the drag core needs a width to divide by.
    const track = document.querySelector('.ffp-slider') as HTMLElement
    if (track) {
        track.getBoundingClientRect = () =>
            ({ left: 0, top: 0, width: 200, height: 12, right: 200, bottom: 12, x: 0, y: 0 }) as DOMRect
    }
    return input
}

const handles = () => Array.from(document.querySelectorAll('.ffp-slider-handle')) as unknown as HTMLElement[]
const labels = () => Array.from(document.querySelectorAll('.ffp-slider-minmax span')).map((n) => n.textContent)

afterEach(() => {
    if (mounted) mounted.destroy()
    mounted = null
})

describe('single slider', () => {
    it('writes the default into the input at mount', async () => {
        // noUiSlider's `on('update')` fired at creation, so a form submitted
        // untouched still carried a value.
        const input = await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        expect(input.value).toBe('40')
    })

    it('writes a rounded, comma-free value as it moves', async () => {
        const input = await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        fire(document.querySelector('.ffp-slider')!, 'pointerdown', {
            clientX: 100,
            clientY: 6,
            button: 0,
            pointerId: 1,
        })
        expect(input.value).toBe('50')
    })

    it('announces the value instead of waiting to be polled', async () => {
        const input = await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        const onInput = vi.fn()
        const onChange = vi.fn()
        input.addEventListener('input', onInput)
        input.addEventListener('change', onChange)

        fire(handles()[0], 'keydown', { key: 'ArrowRight' })

        expect(input.value).toBe('41')
        expect(onInput).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('shows the min and max labels', async () => {
        await mount(MARKUP('data-min="10" data-max="90" data-default="50"'))
        expect(labels()).toEqual(['10', '90'])
    })

    it('starts at min when no default is given', async () => {
        const input = await mount(MARKUP('data-min="5" data-max="50"'))
        expect(input.value).toBe('5')
    })
})

describe('range slider', () => {
    it('writes both handles as "20,80"', async () => {
        // The exact string the backend has been storing for every submission.
        const input = await mount(
            MARKUP('allow-range data-min="0" data-max="100" data-min-default="20" data-max-default="80"'),
            'rangeslider',
        )
        expect(input.value).toBe('20,80')
        expect(handles().length).toBe(2)
    })

    it('keeps the comma format as it moves', async () => {
        const input = await mount(
            MARKUP('allow-range data-min="0" data-max="100" data-min-default="20" data-max-default="80"'),
            'rangeslider',
        )
        fire(handles()[1], 'keydown', { key: 'ArrowLeft' })
        expect(input.value).toBe('20,79')
    })

    it('falls back to min and max when no defaults are given', async () => {
        const input = await mount(MARKUP('allow-range data-min="0" data-max="100"'), 'rangeslider')
        expect(input.value).toBe('0,100')
    })
})

describe('theme', () => {
    it('writes the palette onto the wrap, not the document', async () => {
        await mount(
            MARKUP('data-min="0" data-max="100" data-default="40" data-light-theme-slider-color="#ff0000"'),
        )
        const wrap = document.querySelector('.ffp-number-slider-wrap') as HTMLElement
        expect(wrap.style.getPropertyValue('--ffp-slider-color-light')).toBe('#ff0000')
    })

    it('reads the legacy tilde blob too', async () => {
        await mount(
            MARKUP(
                'data-min="0" data-max="100" data-default="40" ' +
                    'data-slider-theme="#111~#fff~#00ff00~#eee~#222~#fff~#00ff00~#333"',
            ),
        )
        const wrap = document.querySelector('.ffp-number-slider-wrap') as HTMLElement
        expect(wrap.style.getPropertyValue('--ffp-slider-color-light')).toBe('#00ff00')
    })
})

describe('lifecycle', () => {
    it('follows a value set from outside', async () => {
        const input = await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        input.value = '75'
        fire(input, 'change')
        expect(handles()[0].getAttribute('aria-valuenow')).toBe('75')
    })

    it('accepts a value through the registry', async () => {
        const input = await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        mounted!.setValue!('60')
        expect(input.value).toBe('60')
        expect(mounted!.value!()).toBe('60')
    })

    it('mounts once even if a stale wrap is already there', async () => {
        await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        const defined = await loadChunk()
        const input = document.querySelector('input') as HTMLInputElement
        const second = defined.slider.mount(input, defined.slider.parse!(input), {
            form: null,
            version: 'test',
        })
        expect(document.querySelectorAll('.ffp-number-slider-wrap').length).toBe(1)
        second.destroy()
    })

    it('removes the slider on destroy', async () => {
        await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        mounted!.destroy()
        mounted = null
        expect(document.querySelector('.ffp-number-slider-wrap')).toBeNull()
    })

    it('removes the Designer placeholder so the live slider is the only track', async () => {
        const input = await mount(`<body><form><div form-fields-wrapper="true">
  <input form-fields-pro-number-slider form-fields-data-input name="Budget" data-min="0" data-max="100" data-default="40">
  <div data-ffp-slider-placeholder></div>
</div></form></body>`)
        expect(document.querySelector('[data-ffp-slider-placeholder]')).toBeNull()
        expect(document.querySelector('.ffp-slider')).toBeTruthy()
        expect(input.value).toBe('40')
    })

    it('hides the backing input so it cannot paint as a second bar above the track', async () => {
        const input = await mount(MARKUP('data-min="0" data-max="100" data-default="40"'))
        expect(input.getAttribute('type')).toBe('hidden')
        const css = document.getElementById('ffp-slider')?.textContent || ''
        expect(css).toContain('[form-fields-pro-number-slider]')
        expect(css).toContain('display:none!important')
        expect(css).toContain('[data-ffp-slider-placeholder]')
    })

    it('separates a colliding dark fill and track so high contrast stays visible', async () => {
        await mount(
            MARKUP(
                'data-min="0" data-max="100" data-default="40" data-ffp=\'' +
                    JSON.stringify({
                        v: 2,
                        type: 'slider',
                        theme: {
                            sliderColorLight: 'rgb(20, 110, 245)',
                            sliderColorDark: 'rgb(255, 255, 255)',
                            trackColorLight: 'rgb(0, 0, 0)',
                            trackColorDark: 'rgb(255, 255, 255)',
                        },
                    }) +
                    "'",
            ),
        )
        const wrap = document.querySelector('.ffp-number-slider-wrap') as HTMLElement
        expect(wrap.style.getPropertyValue('--ffp-slider-color-dark')).toBe('rgb(255, 255, 255)')
        expect(wrap.style.getPropertyValue('--ffp-track-color-dark')).toBe('rgb(0, 0, 0)')
    })

    it('registers both slider and rangeslider from one chunk', async () => {
        resetDom('<body></body>')
        const defined = await loadChunk()
        expect(Object.keys(defined).sort()).toEqual(['rangeslider', 'slider'])
    })
})
