/**
 * Range slider, one or two handles. Replaces noUiSlider.
 *
 * The consumed surface was never wide: `{ start, step, connect, tooltips,
 * range }` and `on('update')`. That is what this implements, so the field is a
 * near-exact swap - and the theming carries over unchanged, because 5.1.5
 * already drove noUiSlider's appearance entirely through `--ffp-*` custom
 * properties rather than through its options.
 *
 * What improves: the handles are real `role="slider"` elements in the tab order
 * with per-handle keyboard support, and a value is announced on every change
 * rather than only written to a hidden input for a 450 ms poll to notice.
 */
import { draggable } from './drag'

export type SliderOptions = {
    min: number
    max: number
    step: number
    /** One value for a single slider, two for a range. */
    values: number[]
    /** `lower` fills from the start to the handle; `range` fills between two. */
    connect: 'lower' | 'range' | 'none'
    tooltips: boolean
    onUpdate(values: number[]): void
}

export type SliderHandle = {
    element: HTMLElement
    values(): number[]
    setValues(values: number[]): void
    destroy(): void
}

/**
 * Layout properties use `!important` because this widget lives inside the
 * customer's Webflow form. Site CSS such as `.w-form button` (padding, white
 * background, `position: static`) is more specific than a single class and
 * otherwise stacks the thumb under the track, paints it white-on-white, and
 * leaves a stray native input bar above the widget.
 */
export const SLIDER_CSS = `
.ffp-slider{--track:var(--ffp-track-color,#ededed);--fill:var(--ffp-slider-color,#146ef5);box-sizing:border-box;position:relative!important;height:12px;margin:28px 0 0;background:var(--track);border:0!important;border-radius:11.5px;touch-action:none;overflow:visible;box-shadow:none!important}
.ffp-slider *{box-sizing:border-box}
.ffp-slider .ffp-slider-connect{position:absolute!important;top:0!important;bottom:0!important;height:100%!important;margin:0!important;padding:0!important;background:var(--fill)!important;border:0!important;border-radius:11.5px;box-shadow:none!important;pointer-events:none;z-index:1}
.ffp-slider .ffp-slider-handle{appearance:none!important;-webkit-appearance:none!important;box-sizing:border-box!important;position:absolute!important;top:50%!important;display:block!important;width:22px!important;height:22px!important;min-width:22px!important;min-height:22px!important;max-width:22px!important;max-height:22px!important;margin:0!important;padding:0!important;border:0!important;border-radius:50%!important;background:var(--fill)!important;background-image:none!important;box-shadow:0 0 0 2px #fff,0 0 0 3px #111!important;cursor:grab!important;touch-action:none;transform:translate(-50%,-50%)!important;z-index:2;line-height:0!important;font-size:0!important;color:transparent!important;overflow:visible!important}
.ffp-slider .ffp-slider-handle:active{cursor:grabbing!important}
.ffp-slider .ffp-slider-handle:focus-visible{outline:2px solid var(--fill)!important;outline-offset:3px}
.ffp-slider .ffp-slider-tooltip{position:absolute!important;bottom:calc(100% + 8px)!important;left:50%!important;transform:translateX(-50%)!important;padding:2px 6px!important;border:0!important;border-radius:4px!important;font-size:12px!important;line-height:16px!important;font-weight:600!important;white-space:nowrap!important;color:var(--ffp-tooltip-text-color,#fff)!important;background:var(--fill)!important;box-shadow:none!important;pointer-events:none!important;display:block!important}
.ffp-slider-minmax{display:flex;justify-content:space-between;margin-top:10px;font-size:12px;line-height:16px;color:var(--ffp-max-min-text-color,#1a1a1a)}
`

const clamp = (n: number, min: number, max: number) => (n < min ? min : n > max ? max : n)

export function createSlider(options: SliderOptions): SliderHandle {
    const { min, max } = options
    const step = options.step > 0 ? options.step : 1
    const span = max - min || 1

    const root = document.createElement('div')
    root.className = 'ffp-slider'

    const connect = document.createElement('div')
    connect.className = 'ffp-slider-connect'
    if (options.connect !== 'none') root.appendChild(connect)

    let values = options.values.slice()

    /** Snap to the step grid, measured from `min` - not from zero. */
    function snap(raw: number): number {
        const stepped = Math.round((raw - min) / step) * step + min
        // Floating point: a step of 0.1 gives 0.30000000000000004 otherwise.
        const rounded = Number(stepped.toFixed(10))
        return clamp(rounded, min, max)
    }

    const handles: HTMLButtonElement[] = values.map((_, index) => {
        const handle = document.createElement('button')
        // `type="button"`: these sit inside the customer's form.
        handle.type = 'button'
        handle.className = 'ffp-slider-handle'
        handle.setAttribute('role', 'slider')
        handle.setAttribute('aria-valuemin', String(min))
        handle.setAttribute('aria-valuemax', String(max))
        handle.setAttribute('data-handle', String(index))
        if (options.tooltips) {
            const tooltip = document.createElement('span')
            tooltip.className = 'ffp-slider-tooltip'
            handle.appendChild(tooltip)
        }
        root.appendChild(handle)
        return handle
    })

    function paint(): void {
        const fraction = (value: number) => (value - min) / span
        // `(0.8 - 0.2) * 100` is 60.00000000000001. Harmless to the layout,
        // ugly in the DOM, and it defeats any comparison of the rendered style.
        const percent = (value: number) => `${Number((value * 100).toFixed(4))}%`

        handles.forEach((handle, index) => {
            const value = values[index]
            handle.style.left = percent(fraction(value))
            handle.setAttribute('aria-valuenow', String(value))
            handle.setAttribute('aria-valuetext', String(value))
            const tooltip = handle.firstChild as HTMLElement | null
            if (tooltip) tooltip.textContent = String(Math.round(value))
        })

        if (options.connect === 'lower') {
            connect.style.left = '0%'
            connect.style.width = percent(fraction(values[0]))
        } else if (options.connect === 'range') {
            const low = fraction(Math.min(values[0], values[1]))
            const high = fraction(Math.max(values[0], values[1]))
            connect.style.left = percent(low)
            connect.style.width = percent(high - low)
        }
    }

    function commit(index: number, raw: number): void {
        let next = snap(raw)
        // Handles cannot cross. noUiSlider pushed them apart; clamping is the
        // same outcome with none of the surprise of one handle shoving another.
        if (values.length === 2) {
            if (index === 0) next = Math.min(next, values[1])
            else next = Math.max(next, values[0])
        }
        if (next === values[index]) return
        values[index] = next
        paint()
        options.onUpdate(values.slice())
    }

    function nearest(fraction: number): number {
        if (values.length === 1) return 0
        const target = min + fraction * span
        return Math.abs(target - values[0]) <= Math.abs(target - values[1]) ? 0 : 1
    }

    let dragging = -1
    const unbinds = [
        draggable(root, {
            onStart: (point, event) => {
                const target = event.target as HTMLElement | null
                const owned = target && target.closest ? target.closest('[data-handle]') : null
                // Grabbing a handle moves that handle; pressing the bare track
                // moves whichever handle is closer, which is what makes a track
                // click jump rather than do nothing.
                dragging = owned ? Number(owned.getAttribute('data-handle')) : nearest(point.x)
                handles[dragging].focus()
            },
            onMove: (point) => {
                if (dragging < 0) return
                commit(dragging, min + point.x * span)
            },
            onEnd: () => {
                dragging = -1
            },
        }),
    ]

    handles.forEach((handle, index) => {
        const onKeyDown = (event: Event) => {
            const key = (event as KeyboardEvent).key
            const big = step * 10
            let delta = 0
            if (key === 'ArrowRight' || key === 'ArrowUp') delta = step
            else if (key === 'ArrowLeft' || key === 'ArrowDown') delta = -step
            else if (key === 'PageUp') delta = big
            else if (key === 'PageDown') delta = -big
            else if (key === 'Home') {
                event.preventDefault()
                commit(index, min)
                return
            } else if (key === 'End') {
                event.preventDefault()
                commit(index, max)
                return
            } else return

            event.preventDefault()
            commit(index, values[index] + delta)
        }
        handle.addEventListener('keydown', onKeyDown)
        unbinds.push(() => handle.removeEventListener('keydown', onKeyDown))
    })

    values = values.map((value) => snap(value))
    paint()

    return {
        element: root,
        values: () => values.slice(),
        setValues(next) {
            values = next.slice().map((value) => snap(value))
            paint()
            options.onUpdate(values.slice())
        },
        destroy() {
            for (const unbind of unbinds) unbind()
            root.remove()
        },
    }
}
