/**
 * Pointer dragging over a surface, normalised to 0..1.
 *
 * Pointer Events only - one code path for mouse, touch and pen, where the
 * vendors this replaces each carried three. `setPointerCapture` is what makes a
 * drag survive the pointer leaving the element, so a visitor who drags a slider
 * handle off the end of the track keeps dragging it instead of dropping it: no
 * document-level listeners, and nothing left bound if the element is removed
 * mid-drag.
 *
 * Deliberately duplicated into the `slider` and `color` chunks rather than
 * shared through `ui-popover`: ~500 B in two chunks beats a third round trip on
 * a page that has only one of them.
 */

export type DragPoint = { x: number; y: number }

export type DragOptions = {
    onStart?(point: DragPoint, event: PointerEvent): void
    onMove(point: DragPoint, event: PointerEvent): void
    onEnd?(point: DragPoint, event: PointerEvent): void
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

function pointFor(surface: HTMLElement, event: PointerEvent): DragPoint {
    const rect = surface.getBoundingClientRect()
    return {
        x: rect.width ? clamp01((event.clientX - rect.left) / rect.width) : 0,
        y: rect.height ? clamp01((event.clientY - rect.top) / rect.height) : 0,
    }
}

export function draggable(surface: HTMLElement, options: DragOptions): () => void {
    let active = false

    const down = (event: Event) => {
        const pointer = event as PointerEvent
        // Primary button only: a right-click on a slider should open the
        // context menu, not move the handle.
        if (pointer.button !== undefined && pointer.button !== 0) return
        active = true
        // Stops the browser turning the drag into a scroll or a text selection.
        if (pointer.preventDefault) pointer.preventDefault()
        if (surface.setPointerCapture && pointer.pointerId !== undefined) {
            try {
                surface.setPointerCapture(pointer.pointerId)
            } catch {
                // Safari throws for a pointer that has already been released.
            }
        }
        const point = pointFor(surface, pointer)
        if (options.onStart) options.onStart(point, pointer)
        options.onMove(point, pointer)
    }

    const move = (event: Event) => {
        if (!active) return
        const pointer = event as PointerEvent
        if (pointer.preventDefault) pointer.preventDefault()
        options.onMove(pointFor(surface, pointer), pointer)
    }

    const up = (event: Event) => {
        if (!active) return
        active = false
        const pointer = event as PointerEvent
        if (surface.releasePointerCapture && pointer.pointerId !== undefined) {
            try {
                surface.releasePointerCapture(pointer.pointerId)
            } catch {
                /* already released */
            }
        }
        if (options.onEnd) options.onEnd(pointFor(surface, pointer), pointer)
    }

    surface.addEventListener('pointerdown', down)
    surface.addEventListener('pointermove', move)
    surface.addEventListener('pointerup', up)
    // A cancelled pointer is a finished drag, not a dropped one: leaving
    // `active` set would make the next move over the surface drag without a
    // press.
    surface.addEventListener('pointercancel', up)

    return () => {
        surface.removeEventListener('pointerdown', down)
        surface.removeEventListener('pointermove', move)
        surface.removeEventListener('pointerup', up)
        surface.removeEventListener('pointercancel', up)
    }
}
