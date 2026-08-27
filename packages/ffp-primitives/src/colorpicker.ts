/**
 * Colour picker. Replaces spectrum-colorpicker2.
 *
 * The saturation/value square is **stacked CSS gradients, not a canvas**: a
 * white-to-transparent gradient over a black-to-transparent gradient over the
 * pure hue. That is sharper on a HiDPI screen than a scaled canvas, needs no
 * `getImageData` (which is a fingerprinting-surface prompt in some browsers),
 * and costs nothing to redraw - changing hue is one `background-color` write.
 *
 * spectrum was also **unpinned** in 5.1.5 (`spectrum-colorpicker2` with no
 * version), so an upstream publish could change or break every customer site
 * with no deploy from us. That risk goes with it.
 *
 * Commit semantics are spectrum's, deliberately: the value is written when the
 * visitor presses Choose *and* when the panel is dismissed, because 5.1.5 bound
 * both `change` and `hide` to the same write.
 */
import { hsvToRgb, parseColor, rgbToHsv, toHex, type Hsv } from '@flowappz/ffp-core/src/color'
import { draggable } from './drag'

export type ColorPickerOptions = {
    /** Any spelling `parseColor` accepts. Falls back to black, as spectrum did. */
    value: string
    /** Fires continuously while dragging, for the trigger swatch. */
    onPreview?(hex: string): void
    /** Fires on Choose and on dismiss. */
    onCommit(hex: string): void
    onDismiss?(): void
}

export type ColorPickerHandle = {
    element: HTMLElement
    value(): string
    setValue(value: string): void
    focus(): void
    destroy(): void
}

export const COLORPICKER_CSS = `
.ffp-cp{box-sizing:border-box;width:232px;padding:10px;background:var(--ffp-dropdown-background-color,#fff);border:1px solid var(--ffp-border-color,#d4d4d4);border-radius:var(--ffp-border-radius,8px);box-shadow:0 8px 24px rgba(0,0,0,.12);font:inherit;font-size:13px;color:inherit}
.ffp-cp *{box-sizing:border-box}
.ffp-cp-area{position:relative;height:140px;border-radius:6px;cursor:crosshair;touch-action:none;background-image:linear-gradient(to top,#000,rgba(0,0,0,0)),linear-gradient(to right,#fff,rgba(255,255,255,0))}
.ffp-cp-thumb{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.4);pointer-events:none}
.ffp-cp-hue{position:relative;height:12px;margin-top:10px;border-radius:6px;cursor:pointer;touch-action:none;background:linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)}
.ffp-cp-hue-thumb{position:absolute;top:-2px;width:16px;height:16px;margin-left:-8px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.4);pointer-events:none;background:currentColor}
.ffp-cp-foot{display:flex;align-items:center;gap:8px;margin-top:10px}
.ffp-cp-swatch{flex:none;width:26px;height:26px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
.ffp-cp-input{flex:1;min-width:0;height:26px;padding:0 8px;font:inherit;font-size:13px;border:1px solid var(--ffp-border-color,#d4d4d4);border-radius:6px;background:transparent;color:inherit}
.ffp-cp-choose{flex:none;height:26px;padding:0 10px;border:0;border-radius:6px;font:inherit;font-size:13px;cursor:pointer;background:var(--ffp-hover-background-color,#111);color:var(--ffp-hover-text-color,#fff)}
`

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

export function createColorPicker(options: ColorPickerOptions): ColorPickerHandle {
    // spectrum ran with `allowEmpty: false`, so an unparseable value is black
    // rather than nothing - the field always submits a colour.
    const initial = parseColor(options.value) || { r: 0, g: 0, b: 0, a: 1 }
    let hsv: Hsv = rgbToHsv(initial)

    const root = document.createElement('div')
    root.className = 'ffp-cp'

    const area = document.createElement('div')
    area.className = 'ffp-cp-area'
    const thumb = document.createElement('div')
    thumb.className = 'ffp-cp-thumb'
    area.appendChild(thumb)

    const hue = document.createElement('div')
    hue.className = 'ffp-cp-hue'
    const hueThumb = document.createElement('div')
    hueThumb.className = 'ffp-cp-hue-thumb'
    hue.appendChild(hueThumb)

    const foot = document.createElement('div')
    foot.className = 'ffp-cp-foot'
    const swatch = document.createElement('div')
    swatch.className = 'ffp-cp-swatch'
    const text = document.createElement('input')
    text.type = 'text'
    text.className = 'ffp-cp-input'
    text.setAttribute('aria-label', 'Colour value')
    text.setAttribute('spellcheck', 'false')
    text.setAttribute('autocomplete', 'off')
    const choose = document.createElement('button')
    choose.type = 'button'
    choose.className = 'ffp-cp-choose'
    choose.textContent = 'Choose'
    foot.appendChild(swatch)
    foot.appendChild(text)
    foot.appendChild(choose)

    root.appendChild(area)
    root.appendChild(hue)
    root.appendChild(foot)

    const hex = () => toHex(hsvToRgb(hsv))

    function paint(updateText = true): void {
        const pure = toHex(hsvToRgb({ h: hsv.h, s: 1, v: 1 }))
        // Only the base colour changes; the two gradients above it are static,
        // which is the whole reason this is not a canvas.
        area.style.backgroundColor = pure
        // Rounded: sub-pixel precision here buys nothing and floods the DOM
        // with values like `60.15624999999999%`.
        const percent = (n: number) => `${Number((n * 100).toFixed(3))}%`
        thumb.style.left = percent(hsv.s)
        thumb.style.top = percent(1 - hsv.v)
        hueThumb.style.left = percent(hsv.h / 360)
        hue.style.color = pure
        swatch.style.background = hex()
        if (updateText) text.value = hex()
        if (options.onPreview) options.onPreview(hex())
    }

    const unbinds = [
        draggable(area, {
            onMove: (point) => {
                hsv = { h: hsv.h, s: clamp01(point.x), v: clamp01(1 - point.y) }
                paint()
            },
        }),
        draggable(hue, {
            onMove: (point) => {
                hsv = { h: Math.round(clamp01(point.x) * 360), s: hsv.s, v: hsv.v }
                paint()
            },
        }),
    ]

    const onText = () => {
        const parsed = parseColor(text.value)
        // Typing is progressive: `#f` is not a colour yet, and rewriting the
        // field mid-keystroke would fight the visitor.
        if (!parsed) return
        hsv = rgbToHsv(parsed)
        paint(false)
    }
    text.addEventListener('input', onText)
    unbinds.push(() => text.removeEventListener('input', onText))

    const onChoose = () => {
        options.onCommit(hex())
        if (options.onDismiss) options.onDismiss()
    }
    choose.addEventListener('click', onChoose)
    unbinds.push(() => choose.removeEventListener('click', onChoose))

    const onKeyDown = (event: Event) => {
        const key = (event as KeyboardEvent).key
        if (key !== 'Enter') return
        // Enter inside a form submits it. Here it means "Choose".
        event.preventDefault()
        onChoose()
    }
    root.addEventListener('keydown', onKeyDown)
    unbinds.push(() => root.removeEventListener('keydown', onKeyDown))

    paint()

    return {
        element: root,
        value: hex,
        setValue(next) {
            const parsed = parseColor(next)
            if (!parsed) return
            hsv = rgbToHsv(parsed)
            paint()
        },
        focus() {
            text.focus()
        },
        destroy() {
            for (const unbind of unbinds) unbind()
            root.remove()
        },
    }
}
