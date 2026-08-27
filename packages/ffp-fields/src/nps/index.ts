/**
 * `nps` chunk - phase 1. No vendor to retire here, only jQuery.
 *
 * NPS was always pure DOM; it rode on Webflow's `$` for `.find`, `.each`, `.on`,
 * `.data`, `.val`, `.hide`/`.show` and nothing more. On a page without Webflow's
 * jQuery the whole field threw a `ReferenceError` before drawing anything.
 *
 * Two things go away with it:
 *
 * 1. **The JS painter.** 5.1.5 computed `activeColors()` from `matchMedia` at
 *    mount time and wrote `background-color`/`color`/`border-color` inline with
 *    `!important` on every cell, for idle, hover and selected. Every one of
 *    those states is already expressed in `ffp-nps-states-v3` in terms of the
 *    `--nps-*` custom properties, including its own `prefers-color-scheme`
 *    block - the JS was duplicating the stylesheet, not extending it. Deleting
 *    it fixes the bug that a visitor switching their OS to dark mode mid-session
 *    kept the light palette, because the resolved-at-mount colours never changed.
 * 2. **The `data-ffp-nps-bound` attribute.** The registry's WeakMap is the one
 *    idempotency mechanism now.
 *
 * The theme ladder itself is not reimplemented here: `readFieldConfig(el, 'nps')`
 * in @flowappz/ffp-config already carries it, hover-resolved-before-selected and
 * the stock-blue follow rule included.
 */
import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi, FieldInstance, MountContext, Unbind } from '@flowappz/ffp-core'
import { LIKERT_CSS } from './likert'
import { NPS_CSS } from './styles'

const SELECTED_CLASS = 'ffp-nps-selected'
/** Webflow's own class, kept in sync so a customer's Designer styling still hits. */
const ACTIVE_CLASS = 'net-promoter-active'

const CELL = '[data-name="net-promoter-score-value"]'
const INPUT = '[data-input="net-promoter-score"]'
const EXTRA = '[data-field="extra-feedback-collection"]'

/** Config token to the custom property the stylesheet reads. */
const VARS: Array<[string, string]> = [
    ['textColorLight', '--nps-text-light'],
    ['backgroundColorLight', '--nps-bg-light'],
    ['hoverTextColorLight', '--nps-hover-text-light'],
    ['hoverBackgroundColorLight', '--nps-hover-bg-light'],
    ['selectedTextColorLight', '--nps-selected-text-light'],
    ['selectedBackgroundColorLight', '--nps-selected-bg-light'],
    ['borderColorLight', '--nps-border-light'],
    ['textColorDark', '--nps-text-dark'],
    ['backgroundColorDark', '--nps-bg-dark'],
    ['hoverTextColorDark', '--nps-hover-text-dark'],
    ['hoverBackgroundColorDark', '--nps-hover-bg-dark'],
    ['selectedTextColorDark', '--nps-selected-text-dark'],
    ['selectedBackgroundColorDark', '--nps-selected-bg-dark'],
    ['borderColorDark', '--nps-border-dark'],
    ['borderRadius', '--nps-radius-value'],
]

function mountNps(el: Element, config: FfpFieldConfigV2, api: ChunkApi): FieldInstance {
    api.dom.injectStyle('ffp-nps-states-v3', NPS_CSS)

    const root = el as HTMLElement
    const cells = Array.from(el.querySelectorAll(CELL)) as HTMLElement[]
    const input = el.querySelector(INPUT) as HTMLInputElement | null
    const extra = el.querySelector(EXTRA) as HTMLElement | null

    // Two different nodes in 5.1.5, and they are not always the same one: the
    // custom properties go on whatever carries `data-nps-scale`, the layout
    // attribute goes on the cells' actual parent. A published page where the
    // scale attribute sits one level up from the cells relies on both.
    const marked = el.querySelector('[data-nps-scale]') as HTMLElement | null
    const scale = (cells.length ? cells[0].parentElement : null) as HTMLElement | null

    const theme = config.theme
    const layout = theme.layout || 'connected'

    for (const target of [root, marked]) {
        if (!target || !target.style) continue
        for (const [token, name] of VARS) {
            const value = theme[token]
            if (value !== undefined && value !== null && String(value) !== '') {
                target.style.setProperty(name, String(value))
            }
        }
    }

    root.setAttribute('data-nps-layout', layout)
    if (marked) marked.setAttribute('data-nps-layout', layout)
    if (scale) {
        // The stylesheet keys the whole scale off `data-nps-scale="true"`, so a
        // page whose Designer output only has the bare attribute still lays out.
        scale.setAttribute('data-nps-scale', 'true')
        scale.setAttribute('data-nps-layout', layout)
    }

    /**
     * `data-extra-feedback-collection` is a threshold, or the words "always" or
     * "never".
     *
     * 5.1.5 wrapped this in `if (!s.includes('never') || !s.includes('always'))`
     * inside a branch that had already established `!s.includes('always')` - a
     * tautology, so its `else` never ran. Written out, the rule is the one below,
     * and `parseInt('never')` being NaN is what makes "never" work: no score is
     * less than NaN.
     */
    const setting = String(root.getAttribute('data-extra-feedback-collection') || '')
    const always = setting.indexOf('always') !== -1
    const threshold = parseInt(setting, 10)

    const showExtra = (on: boolean) => {
        if (!extra) return
        extra.style.display = on ? '' : 'none'
    }
    if (!always) showExtra(false)

    const unbinds: Unbind[] = []

    function select(cell: HTMLElement): void {
        const value = (cell.textContent || '').trim()

        for (const other of cells) {
            other.classList.remove(SELECTED_CLASS, ACTIVE_CLASS)
            other.setAttribute('aria-pressed', 'false')
        }
        cell.classList.add(SELECTED_CLASS)
        cell.setAttribute('aria-pressed', 'true')

        if (input) {
            input.value = value
            // 5.1.5 set `.val()` and nothing else, and got away with it because
            // conditional logic polled every 450 ms. Core listens for events
            // instead, so the field has to announce itself.
            input.dispatchEvent(new Event('input', { bubbles: true }))
            input.dispatchEvent(new Event('change', { bubbles: true }))
        }

        if (!always) showExtra(Number(value) < threshold)
    }

    for (const cell of cells) {
        unbinds.push(api.dom.on(cell, 'click', () => select(cell)))
        unbinds.push(
            api.dom.on(cell, 'keydown', (event) => {
                const key = (event as KeyboardEvent).key
                if (key !== 'Enter' && key !== ' ') return
                event.preventDefault()
                select(cell)
            }),
        )
        // Reachable and announced. 5.1.5 bound click and keydown but left the
        // cells out of the tab order, so the keydown handler could only ever fire
        // for a visitor who had already clicked one.
        if (!cell.hasAttribute('tabindex')) cell.setAttribute('tabindex', '0')
        if (!cell.hasAttribute('role')) cell.setAttribute('role', 'button')
        if (!cell.hasAttribute('aria-pressed')) cell.setAttribute('aria-pressed', 'false')
    }

    return {
        destroy() {
            for (const unbind of unbinds) unbind()
            for (const target of [root, marked]) {
                if (!target || !target.style) continue
                for (const [, name] of VARS) target.style.removeProperty(name)
            }
            for (const cell of cells) cell.classList.remove(SELECTED_CLASS, ACTIVE_CLASS)
        },
        value: () => (input ? input.value : ''),
        setValue(next) {
            const wanted = String(next).trim()
            const cell = cells.filter((c) => (c.textContent || '').trim() === wanted)[0]
            if (cell) select(cell)
        },
    }
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('nps', (api: ChunkApi) => {
        api.defineField({
            name: 'nps',
            parse: (el) => api.readFieldConfig(el, 'nps'),
            mount: (el: Element, config: FfpFieldConfigV2, _ctx: MountContext) =>
                mountNps(el, config, api),
        })

        // Likert shares this chunk and is a stylesheet, nothing more: native
        // radios with sibling labels, and CSS that turns the label into a
        // circle. It has no per-element state, so the instance only has to
        // exist for the registry's idempotency to hold.
        api.defineField({
            name: 'likert',
            mount: (): FieldInstance => {
                api.dom.injectStyle('ffp-likert-overrides', LIKERT_CSS)
                return { destroy() {} }
            },
        })
    })
} else {
    console.warn('Form Fields Pro: chunk nps loaded without core')
}
