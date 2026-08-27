import { readFieldConfig } from '@flowappz/ffp-config'
// Deep imports on purpose: pulling the core barrel would drag the boot path,
// the licence fetch and the generated manifest into a test that only needs the
// helpers a chunk is handed.
import type { ChunkApi } from '@flowappz/ffp-core/src/chunk-api'
import { delegate, h, injectStyle, on } from '@flowappz/ffp-core/src/dom'
import { registerDialCodes } from '@flowappz/ffp-core/src/phone-value'
import { applyTheme, schemeResolverCss, tokenToVar } from '@flowappz/ffp-core/src/theme'
import { positionFloating } from '@flowappz/ffp-primitives/src/floating'
import { layerZIndex, openLayer } from '@flowappz/ffp-primitives/src/layer'
import { createListbox, LISTBOX_CSS } from '@flowappz/ffp-primitives/src/listbox'
import { parseHTML } from 'linkedom'
import { beforeEach } from 'vitest'

export function resetDom(html = '<body></body>'): void {
    const parsed = parseHTML(`<!doctype html><html>${html}</html>`)
    const g = globalThis as Record<string, unknown>
    g.window = parsed.window
    g.document = parsed.document
    g.Node = parsed.Node
    g.Element = parsed.Element
    g.Event = parsed.window.Event
    g.HTMLElement = parsed.window.HTMLElement
    g.HTMLSelectElement = parsed.window.HTMLSelectElement
    g.HTMLInputElement = parsed.window.HTMLInputElement
    g.requestAnimationFrame = (fn: (t: number) => void) => setTimeout(() => fn(0), 0) as unknown as number
    g.cancelAnimationFrame = (id: number) => clearTimeout(id)
    delete g.ResizeObserver
    patchSelect(parsed.window as unknown as Record<string, { prototype: object }>)
    patchInput(parsed.window as unknown as Record<string, { prototype: object }>)
}

/**
 * `readOnly`, `multiple` and `accept` are reflected IDL attributes every browser
 * has and linkedom does not, so `input.readOnly = true` would set a plain
 * property and vanish. The fields are written against the platform; the shim is
 * what is wrong here.
 */
function patchInput(window: Record<string, { prototype: object }>): void {
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
    reflect('readOnly', 'readonly', true)
    reflect('multiple', 'multiple', true)
    reflect('accept', 'accept', false)
}

/**
 * Fill in the parts of `<select>` linkedom does not implement.
 *
 * `option.text`, `option.disabled` and the `select.value` *setter* are all
 * standard and all missing - linkedom's `value` is getter-only, so assigning to
 * it throws. Patching the shim here rather than working around it in the field
 * keeps the field written against the real platform: it does `select.value = x`
 * because that is what a browser wants, not because a test allows it.
 *
 * Deliberately a faithful reimplementation, not a convenience: `selectedIndex`
 * defaults to 0 for a single select with nothing marked selected, which is what
 * makes the placeholder option show up as the initial label.
 */
function patchSelect(window: Record<string, { prototype: object }>): void {
    const option = window.HTMLOptionElement.prototype as object
    const select = window.HTMLSelectElement.prototype as object

    const define = (proto: object, name: string, descriptor: PropertyDescriptor) =>
        Object.defineProperty(proto, name, { configurable: true, ...descriptor })

    type Opt = Element & { value: string; selected: boolean }
    type Sel = Element & { options: ArrayLike<Opt>; selectedIndex: number }

    define(option, 'text', {
        get(this: Element) {
            return (this.textContent || '').trim()
        },
    })
    define(option, 'disabled', {
        get(this: Element) {
            return this.hasAttribute('disabled')
        },
    })
    define(option, 'selected', {
        get(this: Element) {
            return this.hasAttribute('selected')
        },
        set(this: Element, on: boolean) {
            if (on) this.setAttribute('selected', '')
            else this.removeAttribute('selected')
        },
    })
    define(select, 'selectedIndex', {
        get(this: Sel) {
            for (let i = 0; i < this.options.length; i++) if (this.options[i].selected) return i
            return this.options.length ? 0 : -1
        },
    })
    define(select, 'value', {
        get(this: Sel) {
            const chosen = this.options[this.selectedIndex]
            return chosen ? chosen.value : ''
        },
        set(this: Sel, next: string) {
            for (let i = 0; i < this.options.length; i++) {
                this.options[i].selected = this.options[i].value === next
            }
        },
    })
}

/**
 * The real primitives, published the way the `ui-popover` chunk publishes them.
 *
 * Not a mock: the point is that the select field and the shared chunk agree on
 * a surface neither one imports from the other.
 */
export function publishPopover(): void {
    const w = globalThis.window as unknown as Window
    w.__ffpShared = {
        popover: { positionFloating, openLayer, layerZIndex, createListbox, LISTBOX_CSS },
    }
}

/** A ChunkApi built from the real core helpers, not stubs. */
export function fakeApi(): ChunkApi {
    return {
        version: 'test',
        config: { dataClientUrl: 'https://data.test', licenseUrl: 'https://license.test' },
        defineField: () => {},
        readFieldConfig,
        dom: { h, on, delegate, injectStyle },
        registerDialCodes,
        theme: { applyTheme, schemeResolverCss, tokenToVar },
    }
}

/**
 * Dispatch an event with extra properties on it. linkedom's Event constructor
 * ignores unknown init keys, so `key` has to be assigned afterwards.
 */
export function fire(target: EventTarget, type: string, props: Record<string, unknown> = {}): Event {
    const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
    const event = new w.window.Event(type, { bubbles: true, cancelable: true })
    Object.assign(event, { preventDefault() {}, stopPropagation() {} }, props)
    target.dispatchEvent(event)
    return event
}

beforeEach(() => resetDom())
