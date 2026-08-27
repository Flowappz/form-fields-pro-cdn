/**
 * A stack of open overlays with one set of document listeners.
 *
 * Runtime 5.1.5 has each vendor bring its own outside-click logic, plus our own
 * `$(document).on('click.ffpPhoneDropdown')`. Four independent listeners that do
 * not know about each other, so Escape with a calendar open inside a phone
 * dropdown closes whichever one bound last rather than the topmost.
 *
 * One stack fixes that by construction: Escape always closes the top layer, and
 * an outside click closes from the top down until it reaches a layer that
 * contains the click.
 */

export type Layer = {
    element: HTMLElement
    /** Clicks inside these also count as inside - the trigger button, usually. */
    anchors: HTMLElement[]
    onClose: () => void
    closeOnOutside: boolean
    closeOnEscape: boolean
}

const stack: Layer[] = []
let bound = false

function contains(layer: Layer, target: Node): boolean {
    if (layer.element.contains(target)) return true
    return layer.anchors.some((anchor) => anchor.contains(target))
}

function closeLayer(layer: Layer): void {
    const index = stack.indexOf(layer)
    if (index === -1) return
    stack.splice(index, 1)
    if (!stack.length) unbind()
    layer.onClose()
}

function onPointerDown(event: Event): void {
    const target = event.target as Node | null
    if (!target) return
    // Top down: a click inside layer N is outside layers N+1..top, so those
    // close and layer N stays. Snapshot first - onClose mutates the stack.
    for (const layer of stack.slice().reverse()) {
        if (contains(layer, target)) break
        if (!layer.closeOnOutside) break
        closeLayer(layer)
    }
}

function onKeyDown(event: Event): void {
    if ((event as KeyboardEvent).key !== 'Escape') return
    const top = stack[stack.length - 1]
    if (!top || !top.closeOnEscape) return
    // Stop the page's own Escape handling: a Webflow modal wrapping our field
    // would otherwise close too, and the visitor loses the whole form.
    event.preventDefault()
    event.stopPropagation()
    closeLayer(top)
}

function bind(): void {
    if (bound) return
    bound = true
    // Capture phase and pointerdown, not click: a customer script that calls
    // stopPropagation on click would otherwise leave every dropdown stuck open.
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
}

function unbind(): void {
    if (!bound) return
    bound = false
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('keydown', onKeyDown, true)
}

export type OpenLayerOptions = {
    element: HTMLElement
    anchors?: HTMLElement[]
    onClose: () => void
    closeOnOutside?: boolean
    closeOnEscape?: boolean
}

/** Push a layer. Returns the closer; calling it twice is a no-op. */
export function openLayer(options: OpenLayerOptions): () => void {
    const layer: Layer = {
        element: options.element,
        anchors: options.anchors || [],
        onClose: options.onClose,
        closeOnOutside: options.closeOnOutside !== false,
        closeOnEscape: options.closeOnEscape !== false,
    }
    stack.push(layer)
    bind()
    return () => closeLayer(layer)
}

/**
 * Base z-index for a layer, honouring the author's `data-zIndex`.
 *
 * Each layer sits one above the last so a calendar opened from inside a
 * dropdown renders over it rather than behind.
 */
export function layerZIndex(base = 999): number {
    return base + stack.length
}

export function openLayerCount(): number {
    return stack.length
}

/** Test seam. */
export function resetLayers(): void {
    stack.length = 0
    unbind()
}
