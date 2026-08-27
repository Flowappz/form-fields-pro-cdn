/**
 * Position a floating element against an anchor.
 *
 * Replaces the positioning inside easepick, Select2 and spectrum - three
 * implementations of the same job, none of which handled the failure the support
 * queue actually sees: a dropdown clipped by a Webflow parent with
 * `overflow: hidden`. Portalling to `document.body` fixes that class of bug
 * outright, which is why `portal` defaults on.
 */

export type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export type FloatingOptions = {
    placement?: Placement
    /** Gap between anchor and floating element, in px. */
    offset?: number
    /** Flip to the opposite side when there is not enough room. */
    flip?: boolean
    /** Slide along the cross axis to stay inside the viewport. */
    shift?: boolean
    /** Match the floating element's width to the anchor's. */
    matchWidth?: boolean
    zIndex?: number
    /** Move the element to document.body so no ancestor can clip it. */
    portal?: boolean
}

const DEFAULTS: Required<Omit<FloatingOptions, 'zIndex'>> = {
    placement: 'bottom-start',
    offset: 4,
    flip: true,
    shift: true,
    matchWidth: true,
    portal: true,
}

export type FloatingHandle = {
    /** Recompute now. Called on scroll, resize and content changes. */
    update(): void
    destroy(): void
}

function viewport() {
    return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    }
}

/** Resolved geometry, exported so it can be tested without a layout engine. */
export function computePosition(
    anchor: DOMRect,
    floating: { width: number; height: number },
    view: { width: number; height: number },
    options: Required<Omit<FloatingOptions, 'zIndex'>>,
): { top: number; left: number; placement: Placement } {
    let [side, align] = options.placement.split('-') as ['bottom' | 'top', 'start' | 'end']

    if (options.flip) {
        const below = view.height - anchor.bottom - options.offset
        const above = anchor.top - options.offset
        // Flip only when the preferred side cannot fit AND the other side is
        // roomier. Flipping into an equally cramped space just moves the problem
        // and makes the dropdown jump as the user scrolls.
        if (side === 'bottom' && floating.height > below && above > below) side = 'top'
        else if (side === 'top' && floating.height > above && below > above) side = 'bottom'
    }

    const top = side === 'bottom' ? anchor.bottom + options.offset : anchor.top - floating.height - options.offset

    let left = align === 'start' ? anchor.left : anchor.right - floating.width

    if (options.shift) {
        const margin = 8
        left = Math.min(left, view.width - floating.width - margin)
        left = Math.max(margin, left)
    }

    return { top, left, placement: `${side}-${align}` as Placement }
}

export function positionFloating(
    anchor: HTMLElement,
    floating: HTMLElement,
    options: FloatingOptions = {},
): FloatingHandle {
    const opts = { ...DEFAULTS, ...options }

    if (opts.portal && floating.parentElement !== document.body) {
        document.body.appendChild(floating)
    }

    floating.style.position = opts.portal ? 'fixed' : 'absolute'
    floating.style.margin = '0'
    if (options.zIndex !== undefined) floating.style.zIndex = String(options.zIndex)

    const update = () => {
        const rect = anchor.getBoundingClientRect()
        if (opts.matchWidth) floating.style.minWidth = `${rect.width}px`

        const result = computePosition(
            rect,
            { width: floating.offsetWidth, height: floating.offsetHeight },
            viewport(),
            opts,
        )
        floating.style.top = `${result.top}px`
        floating.style.left = `${result.left}px`
        floating.setAttribute('data-placement', result.placement)
    }

    // Coalesce to one frame: scroll fires far more often than layout changes,
    // and reading getBoundingClientRect per event is what makes vendor dropdowns
    // stutter on a long page.
    let queued = 0
    const schedule = () => {
        if (queued) return
        queued = requestAnimationFrame(() => {
            queued = 0
            update()
        })
    }

    update()

    // `capture: true` so a scrolling ancestor is heard, not just the window.
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule, { passive: true })

    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null
    if (observer) {
        observer.observe(anchor)
        observer.observe(floating)
    }

    return {
        update,
        destroy() {
            if (queued) cancelAnimationFrame(queued)
            window.removeEventListener('scroll', schedule, { capture: true } as EventListenerOptions)
            window.removeEventListener('resize', schedule)
            if (observer) observer.disconnect()
        },
    }
}
