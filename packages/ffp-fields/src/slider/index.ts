/**
 * `slider` chunk - phase 3. noUiSlider is gone.
 *
 * The consumed vendor surface was `{ start, step, connect, tooltips, range }`
 * and `on('update')`, so this is close to a straight swap. Its theming carries
 * over untouched: 5.1.5 already drove noUiSlider's appearance entirely through
 * `--ffp-*` custom properties, which is the pattern the whole library now uses.
 *
 * The submitted value is unchanged and must stay that way: a single slider
 * writes `"40"` and a range writes `"20,80"` - rounded, comma-joined, no space.
 * That string is what the backend has been storing for every submission.
 *
 * Two things improve:
 *
 * 1. **The handles are focusable `role="slider"` elements.** noUiSlider's were
 *    divs with no keyboard support at all, so the field could not be filled in
 *    without a pointer.
 * 2. **The value announces itself.** 5.1.5 only assigned `.value`, and got away
 *    with it because conditional logic polled every 450 ms.
 */
import { contrastSliderTrack, type FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi, FieldInstance, MountContext, Unbind } from '@flowappz/ffp-core'
import { createSlider, SLIDER_CSS, type SliderHandle } from '@flowappz/ffp-primitives/src/slider'

const THEME_TOKENS = [
    'maxMinTextColorLight',
    'maxMinTextColorDark',
    'tooltipTextColorLight',
    'tooltipTextColorDark',
    'sliderColorLight',
    'sliderColorDark',
    'trackColorLight',
    'trackColorDark',
]

const WRAP_CLASS = 'ffp-number-slider-wrap'

/**
 * The value input is a sibling of the widget, not inside it. Webflow themes
 * often style every `input` (including `type="hidden"`) as a full-width field,
 * which is the extra bar above the track. The Designer also leaves a grey
 * stand-in that the runtime removes; this hides it if a cached bundle misses
 * that step.
 */
const FIELD_CSS = `
.ffp-number-slider-wrap{position:relative;isolation:isolate}
[form-fields-pro-number-slider]{display:none!important;width:0!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important;opacity:0!important;position:absolute!important;overflow:hidden!important;pointer-events:none!important;appearance:none!important;-webkit-appearance:none!important}
[form-fields-wrapper]:has(.ffp-number-slider-wrap) [data-ffp-slider-placeholder],[form-fields-wrapper]:has(.ffp-slider) [data-ffp-slider-placeholder]{display:none!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}
`

type SliderOptions = {
    min: number
    max: number
    default: number
    minDefault: number
    maxDefault: number
}

/** NaN means the attribute was missing; fall back the way 5.1.5 did. */
const orElse = (value: number, fallback: number) => (isFinite(value) ? value : fallback)

function mountSlider(el: Element, config: FfpFieldConfigV2, api: ChunkApi): FieldInstance {
    const input = el as HTMLInputElement
    const parent = input.parentElement
    if (!parent) return { destroy() {} }
    // 5.1.5 used a sibling probe for idempotency; the registry's WeakMap is the
    // one mechanism now, but a wrap left behind by an older cached bundle on the
    // same page still has to be recognised.
    if (parent.querySelector('.' + WRAP_CLASS)) return { destroy() {} }

    parent.querySelector('[data-ffp-slider-placeholder]')?.remove()

    // Keep it in the form for submit, but never paint it. Preview markup used
    // to ship as `type="text"`, and published hidden inputs still get unhidden
    // by `input { display:block }` on some customer sites.
    input.setAttribute('type', 'hidden')
    input.setAttribute('aria-hidden', 'true')
    input.tabIndex = -1

    api.dom.injectStyle(
        'ffp-slider',
        SLIDER_CSS + FIELD_CSS + api.theme.schemeResolverCss('.' + WRAP_CLASS, THEME_TOKENS),
    )

    const options = config.options as unknown as SliderOptions
    const range = input.hasAttribute('allow-range')
    const min = options.min
    const max = options.max

    const values = range
        ? [orElse(options.minDefault, min), orElse(options.maxDefault, max)]
        : [orElse(options.default, min)]

    const wrap = api.dom.h('div', { class: WRAP_CLASS })
    const theme = { ...config.theme }
    theme.trackColorLight = contrastSliderTrack(theme.sliderColorLight, theme.trackColorLight)
    theme.trackColorDark = contrastSliderTrack(theme.sliderColorDark, theme.trackColorDark)
    api.theme.applyTheme(wrap, theme)

    let echoing = false
    function write(next: number[]): void {
        // The submitted string. Rounded and comma-joined, exactly as before.
        const text = next.map((value) => Math.round(value)).join(',')
        if (input.value === text) return
        input.value = text
        echoing = true
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
        echoing = false
    }

    const slider: SliderHandle = createSlider({
        min,
        max,
        step: 1,
        values,
        connect: range ? 'range' : 'lower',
        tooltips: true,
        onUpdate: write,
    })

    wrap.appendChild(slider.element)

    const labels = api.dom.h('div', { class: 'ffp-slider-minmax' }, [
        api.dom.h('span', {}, [String(min)]),
        api.dom.h('span', {}, [String(max)]),
    ])
    wrap.appendChild(labels)
    parent.appendChild(wrap)

    // `on('update')` fired at creation in noUiSlider, so the input carried the
    // default before anyone touched it. Keep that: a form submitted untouched
    // must still carry a value.
    write(slider.values())

    const unbinds: Unbind[] = [
        // Someone else set the value - a reset, a prefill, a customer script.
        api.dom.on(input, 'change', () => {
            if (echoing) return
            const parsed = String(input.value || '')
                .split(',')
                .map((part) => Number(part))
                .filter((value) => isFinite(value))
            if (parsed.length === slider.values().length) slider.setValues(parsed)
        }),
    ]

    return {
        destroy() {
            for (const unbind of unbinds) unbind()
            slider.destroy()
            wrap.remove()
        },
        value: () => input.value,
        setValue(next) {
            const parsed = String(next)
                .split(',')
                .map((part) => Number(part))
                .filter((value) => isFinite(value))
            if (parsed.length) slider.setValues(parsed)
        },
    }
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('slider', (api: ChunkApi) => {
        for (const name of ['slider', 'rangeslider'] as const) {
            api.defineField({
                name,
                parse: (element) => api.readFieldConfig(element, name),
                mount: (element: Element, config: FfpFieldConfigV2, _ctx: MountContext) =>
                    mountSlider(element, config, api),
            })
        }
    })
} else {
    console.warn('Form Fields Pro: chunk slider loaded without core')
}
