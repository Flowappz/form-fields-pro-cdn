/** DOM helpers shared by every field. Lives in core - too small to lazy-load. */

type Attrs = Record<string, string | number | boolean | null | undefined>

/**
 * Create an element with attributes and children in one call.
 *
 * `class` and `style` are spelled as they are in HTML, not as DOM properties, so
 * markup in the field chunks reads the same as the markup it replaces.
 */
export function h<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attrs?: Attrs,
    children?: Array<Node | string | null | undefined>,
): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag)
    if (attrs) {
        for (const name of Object.keys(attrs)) {
            const value = attrs[name]
            if (value === null || value === undefined || value === false) continue
            node.setAttribute(name, value === true ? '' : String(value))
        }
    }
    if (children) {
        for (const child of children) {
            if (child === null || child === undefined) continue
            node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child)
        }
    }
    return node
}

export type Unbind = () => void

/** Bind a listener and get its removal back, so `destroy` cannot forget one. */
export function on<T extends EventTarget>(
    target: T,
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
): Unbind {
    target.addEventListener(type, handler, options)
    return () => target.removeEventListener(type, handler, options)
}

/**
 * Delegated listener. One handler on a container instead of one per row, so a
 * listbox with 252 countries binds once rather than 252 times.
 */
export function delegate(
    root: EventTarget & ParentNode,
    type: string,
    selector: string,
    handler: (event: Event, match: Element) => void,
    options?: AddEventListenerOptions,
): Unbind {
    return on(
        root,
        type,
        (event) => {
            const target = event.target as Element | null
            if (!target || !target.closest) return
            const match = target.closest(selector)
            if (match && root.contains(match)) handler(event, match)
        },
        options,
    )
}

/** Inject a stylesheet once, keyed by id. Lifted from runtime 5.1.5 L129. */
export function injectStyle(id: string, css: string): void {
    let style = document.getElementById(id) as HTMLStyleElement | null
    if (!style) {
        style = document.createElement('style')
        style.id = id
        document.head.appendChild(style)
    }
    style.textContent = css
}

/** Run once the document is parsed, immediately if it already is. */
export function ready(fn: () => void): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn, { once: true })
        return
    }
    fn()
}

/**
 * Coalesce a burst of mutations into one call on the next frame.
 *
 * Falls back to a timer while the document is hidden, because `requestAnimation-
 * Frame` does not fire in a background tab. This drives conditional logic and
 * the registry's rescan, and a visitor who opens a form in a background tab -
 * middle-click, "open in new tab", a restored session - has a page whose fields
 * are filled by autofill or a customer script with nothing reacting to it. It
 * would catch up on focus, but only after showing the wrong thing first.
 */
export function rafDebounce(fn: () => void): () => void {
    let scheduled: number | ReturnType<typeof setTimeout> = 0
    return () => {
        if (scheduled) return
        const run = () => {
            scheduled = 0
            fn()
        }
        // Not `requestAnimationFrame` bare: it throws "Illegal invocation" when
        // called detached from `window`.
        scheduled = document.hidden ? setTimeout(run, 16) : requestAnimationFrame(run)
    }
}
