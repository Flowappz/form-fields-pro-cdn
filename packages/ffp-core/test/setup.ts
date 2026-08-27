import { parseHTML } from 'linkedom'
import { beforeEach, vi } from 'vitest'

/**
 * A DOM just wide enough for core.
 *
 * linkedom does not execute injected `<script>` tags, which is exactly what the
 * loader tests want: they need to observe the tag core created - its `src`,
 * `integrity` and `crossorigin` - and then decide themselves whether the chunk
 * "ran". A real browser would hide that seam.
 */
declare global {
    // eslint-disable-next-line no-var
    var __appended: HTMLScriptElement[]
}

export function resetDom(html = '<body></body>'): void {
    const parsed = parseHTML(`<!doctype html><html data-wf-site="site_123">${html}</html>`)
    const g = globalThis as Record<string, unknown>
    g.window = parsed.window
    g.document = parsed.document
    g.Node = parsed.Node
    g.Element = parsed.Element
    g.Blob = parsed.window.Blob || class {}
    // node's globalThis.navigator is a getter-only accessor, so redefine rather
    // than assign.
    Object.defineProperty(g, 'navigator', {
        value: { sendBeacon: vi.fn(() => true) },
        configurable: true,
        writable: true,
    })

    globalThis.__appended = []
    const head = parsed.document.head
    const original = head.appendChild.bind(head)
    head.appendChild = ((node: Node) => {
        if ((node as Element).tagName === 'SCRIPT') {
            globalThis.__appended.push(node as HTMLScriptElement)
        }
        return original(node)
    }) as typeof head.appendChild

    g.requestAnimationFrame = (fn: FrameRequestCallback) => setTimeout(() => fn(0), 0) as unknown as number
    g.MutationObserver = class {
        observe(): void {}
        disconnect(): void {}
        takeRecords(): [] {
            return []
        }
    }
}

beforeEach(() => resetDom())
