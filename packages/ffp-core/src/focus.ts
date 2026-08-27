import { on, type Unbind } from './dom'

const TABBABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',')

export function tabbable(root: ParentNode): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter(
        (node) => node.offsetWidth > 0 || node.offsetHeight > 0 || node === document.activeElement,
    )
}

/**
 * Keep Tab inside an open widget and hand focus back on close.
 *
 * Not a modal trap: Escape and outside-click still close, and the layer stack
 * owns those. This only stops Tab walking into the page behind an open calendar,
 * which is the accessibility complaint the vendor widgets all share.
 */
export function trapFocus(container: HTMLElement): Unbind {
    const previous = document.activeElement as HTMLElement | null

    const unbind = on(container, 'keydown', (event) => {
        const key = (event as KeyboardEvent).key
        if (key !== 'Tab') return
        const nodes = tabbable(container)
        if (!nodes.length) return

        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement

        if ((event as KeyboardEvent).shiftKey && active === first) {
            event.preventDefault()
            last.focus()
        } else if (!(event as KeyboardEvent).shiftKey && active === last) {
            event.preventDefault()
            first.focus()
        }
    })

    return () => {
        unbind()
        if (previous && document.contains(previous)) previous.focus()
    }
}
