import { parseHTML } from 'linkedom'

/**
 * Parse a fragment and hand back the element carrying `data-test-target`.
 *
 * linkedom rather than jsdom: `readFieldConfig` only needs `getAttribute`,
 * `closest` and `querySelector`, so a full browser environment buys nothing and
 * costs seconds per run. These tests are pure - no layout, no styles, no timers.
 */
export function el(html: string): Element {
    const { document } = parseHTML(`<!doctype html><body>${html}</body>`)
    const target = document.querySelector('[data-test-target]')
    if (!target) throw new Error('fixture has no [data-test-target] element')
    return target as unknown as Element
}
