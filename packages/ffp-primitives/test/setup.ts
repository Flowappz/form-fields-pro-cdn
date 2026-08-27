import { parseHTML } from 'linkedom'
import { beforeEach } from 'vitest'

export function resetDom(html = '<body></body>'): void {
    const parsed = parseHTML(`<!doctype html><html>${html}</html>`)
    const g = globalThis as Record<string, unknown>
    g.window = parsed.window
    g.document = parsed.document
    g.Node = parsed.Node
    g.Element = parsed.Element
    g.HTMLElement = parsed.HTMLElement
    g.requestAnimationFrame = (fn: (t: number) => void) => setTimeout(() => fn(0), 0) as unknown as number
    g.cancelAnimationFrame = (id: number) => clearTimeout(id)
    // Deliberately left undefined: `positionFloating` must work without it, and
    // a stub here would hide a regression that only bites in older Safari.
    delete g.ResizeObserver
    patchInput(parsed.window as unknown as { HTMLInputElement: { prototype: object } })
}

/**
 * `multiple` and `accept` are reflected IDL attributes every browser has and
 * linkedom does not, so `input.multiple = true` would set a plain property and
 * vanish. The primitives are written against the platform; the shim is what is
 * missing here.
 */
function patchInput(window: { HTMLInputElement: { prototype: object } }): void {
    const proto = window.HTMLInputElement.prototype as object
    const reflect = (name: string, attribute: string, boolean: boolean) =>
        Object.defineProperty(proto, name, {
            configurable: true,
            get(this: Element) {
                return boolean ? this.hasAttribute(attribute) : this.getAttribute(attribute) || ''
            },
            set(this: Element, value: unknown) {
                if (boolean) {
                    if (value) this.setAttribute(attribute, '')
                    else this.removeAttribute(attribute)
                    return
                }
                this.setAttribute(attribute, String(value))
            },
        })
    reflect('multiple', 'multiple', true)
    reflect('accept', 'accept', false)
}

/**
 * Dispatch an event with extra properties on it.
 *
 * linkedom's Event constructor ignores unknown init keys, so `key` has to be
 * assigned afterwards. Everything here is a plain object, so it takes.
 */
export function fire(target: EventTarget, type: string, props: Record<string, unknown> = {}): Event {
    const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
    const event = new w.window.Event(type, { bubbles: true, cancelable: true })
    Object.assign(event, props)
    target.dispatchEvent(event)
    return event
}

beforeEach(() => resetDom())
