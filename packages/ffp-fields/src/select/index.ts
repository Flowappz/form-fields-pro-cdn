/**
 * `select` chunk - phase 1. Select2 and jQuery are gone.
 *
 * What the vendor cost: 23 kB of JS from jsdelivr, 4 kB of its CSS, a second
 * origin on the critical path, and jQuery, for a widget whose entire consumed
 * API was `minimumResultsForSearch`. What replaces it is this file plus a share
 * of `ui-popover`.
 *
 * Three things change for the customer, all deliberate:
 *
 * 1. `data-searchable="false"` now turns search off. `getAttribute` returns the
 *    string `"false"`, which is truthy, so 5.1.5 (L1106-1108) made every select
 *    searchable regardless of the toggle. `boolAttr` in @flowappz/ffp-config is
 *    the fix; this is the first field to consume it.
 * 2. The trigger inherits the native select's own classes, so a Webflow-styled
 *    field keeps its styling instead of being repainted by `ffp-select2-overrides`
 *    - 60 lines of `!important`-adjacent overrides that existed only to make
 *    Select2 look like the field it replaced.
 * 3. The dropdown is portalled and positioned, so it is no longer clipped by a
 *    Webflow parent with `overflow: hidden`.
 *
 * The native `<select>` stays in the DOM and stays the submitted control. It is
 * clip-hidden, not `display:none`, because a `required` control that is not
 * rendered makes the browser refuse to focus it and Webflow's validation dies
 * with "An invalid form control is not focusable".
 */
import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi, FieldInstance, MountContext, Unbind } from '@flowappz/ffp-core'
import type { ListboxOption, PopoverApi } from '@flowappz/ffp-primitives'

/** Tokens this field themes. Only the four the DX has ever written for select. */
const THEME_TOKENS = [
    'hoverTextColorLight',
    'hoverTextColorDark',
    'hoverBackgroundColorLight',
    'hoverBackgroundColorDark',
]

const SELECT_CSS = `
.ffp-select{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer;user-select:none;font:inherit;color:inherit}
.ffp-select[aria-disabled="true"]{cursor:default;opacity:.6}
.ffp-select-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ffp-select-value:empty::before{content:attr(data-placeholder);opacity:.6}
.ffp-select-arrow{flex:none;width:10px;height:6px;background:currentColor;opacity:.6;clip-path:polygon(0 0,100% 0,50% 100%);transition:transform .12s ease}
.ffp-select.is-open .ffp-select-arrow{transform:rotate(180deg)}
.ffp-select-native{position:absolute!important;width:1px!important;height:1px!important;min-width:0!important;min-height:0!important;max-width:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important;opacity:0!important;appearance:none!important;-webkit-appearance:none!important;pointer-events:none!important}
`

/**
 * Flatten `<option>`s, turning each `<optgroup>` label into a disabled row.
 *
 * The listbox is deliberately flat - a grouped listbox needs `role="group"`
 * bookkeeping that only this one field would use. A disabled header reads the
 * same to a screen reader's option list and costs four lines.
 */
function readOptions(select: HTMLSelectElement): ListboxOption[] {
    const out: ListboxOption[] = []
    let group: Element | null = null

    for (let index = 0; index < select.options.length; index++) {
        const option = select.options[index]
        const parent = option.parentElement
        if (parent && parent.tagName === 'OPTGROUP' && parent !== group) {
            group = parent
            // Attributes, not the `label`/`disabled` properties: those exist
            // only on an upgraded HTMLOptGroupElement, and the attribute is what
            // the customer's HTML carries either way.
            out.push({
                value: ` group-${out.length}`,
                label: group.getAttribute('label') || '',
                disabled: true,
            })
        } else if (!parent || parent.tagName !== 'OPTGROUP') {
            group = null
        }
        out.push({
            value: option.value,
            label: option.text,
            disabled: option.disabled || (group ? group.hasAttribute('disabled') : false),
        })
    }
    return out
}

function mountSelect(el: Element, config: FfpFieldConfigV2, api: ChunkApi): FieldInstance {
    const popover = window.__ffpShared && window.__ffpShared.popover
    // The loader resolves `deps` before the dependant, so this only happens if
    // something loaded the chunk by hand. Leave the native select alone: a plain
    // working select beats a half-built one.
    if (!popover) return { destroy() {} }
    if (!(el instanceof HTMLSelectElement)) return { destroy() {} }

    const select = el
    const { positionFloating, openLayer, layerZIndex, createListbox, LISTBOX_CSS } =
        popover as PopoverApi

    api.dom.injectStyle('ffp-listbox', LISTBOX_CSS)
    api.dom.injectStyle(
        'ffp-select',
        SELECT_CSS + api.theme.schemeResolverCss('.ffp-listbox', THEME_TOKENS),
    )

    const searchable = config.options.searchable === true
    const placeholder = select.getAttribute('data-placeholder') || ''

    const value = api.dom.h('span', { class: 'ffp-select-value', 'data-placeholder': placeholder })
    const trigger = api.dom.h(
        'div',
        {
            class: 'ffp-select',
            role: 'combobox',
            tabindex: select.disabled ? '-1' : '0',
            'aria-haspopup': 'listbox',
            'aria-expanded': 'false',
            'aria-disabled': select.disabled ? 'true' : null,
        },
        [value, api.dom.h('span', { class: 'ffp-select-arrow', 'aria-hidden': 'true' })],
    )

    // Carry the author's own classes over. Webflow's `.w-select` and any custom
    // class the customer added are what make the closed control look like the
    // rest of their form; Select2 threw them away and rebuilt the look.
    for (const name of Array.from(select.classList)) trigger.classList.add(name)

    const label = select.labels && select.labels[0]
    if (label) {
        if (!label.id) label.id = `ffp-select-label-${Math.random().toString(36).slice(2, 8)}`
        trigger.setAttribute('aria-labelledby', label.id)
    } else if (select.getAttribute('aria-label')) {
        trigger.setAttribute('aria-label', select.getAttribute('aria-label')!)
    }
    if (select.required) trigger.setAttribute('aria-required', 'true')

    const originalStyle = select.getAttribute('style')
    select.classList.add('ffp-select-native')
    select.setAttribute('tabindex', '-1')
    select.setAttribute('aria-hidden', 'true')
    // The builder stamps `width: 100% !important` on the native control.
    // Inline `!important` beats the stylesheet, so the clip-hide class alone
    // left a full-width overlay sitting on the trigger and the Submit button.
    select.style.setProperty('width', '1px', 'important')
    select.style.setProperty('height', '1px', 'important')
    select.style.setProperty('pointer-events', 'none', 'important')
    select.insertAdjacentElement('afterend', trigger)

    const id = `ffp-select-${Math.random().toString(36).slice(2, 8)}`
    const unbinds: Unbind[] = []
    let close: (() => void) | null = null
    /** Set while we are the ones dispatching, so our own `change` is ignored. */
    let echoing = false

    function syncLabel(): void {
        const option = select.options[select.selectedIndex]
        value.textContent = option ? option.text : ''
    }

    function commit(next: string): void {
        if (select.value === next) return
        select.value = next
        syncLabel()
        echoing = true
        // Both events, bubbling: conditional logic listens on `input`, Webflow
        // interactions and most customer scripts listen on `change`.
        select.dispatchEvent(new Event('input', { bubbles: true }))
        select.dispatchEvent(new Event('change', { bubbles: true }))
        echoing = false
    }

    function open(): void {
        if (close || select.disabled) return

        const listbox = createListbox({
            id,
            options: readOptions(select),
            value: select.value,
            searchable,
            searchPlaceholder: select.getAttribute('data-search-placeholder') || 'Search',
            emptyText: select.getAttribute('data-empty-text') || 'No results',
            onSelect: (option) => commit(option.value),
            onDismiss: () => close && close(),
        })

        // Theme lands on the listbox root, not the document: two selects on one
        // page can carry different hover colours, which the adopted stylesheet in
        // 5.1.5 could only do by mutating each select's `id` at runtime.
        api.theme.applyTheme(listbox.element, config.theme)

        const unlayer = openLayer({
            element: listbox.element,
            anchors: [trigger],
            onClose: () => close && close(),
        })
        const floating = positionFloating(trigger, listbox.element, {
            placement: 'bottom-start',
            matchWidth: true,
            zIndex: layerZIndex(),
        })

        trigger.setAttribute('aria-expanded', 'true')
        trigger.setAttribute('aria-controls', `${id}-list`)
        trigger.classList.add('is-open')
        listbox.focus()

        close = () => {
            close = null
            // Return focus only if it is about to be destroyed with the listbox.
            // On an outside click the visitor is already aiming somewhere else.
            const restore = listbox.element.contains(document.activeElement)
            floating.destroy()
            listbox.destroy()
            unlayer()
            trigger.setAttribute('aria-expanded', 'false')
            trigger.removeAttribute('aria-controls')
            trigger.classList.remove('is-open')
            if (restore) trigger.focus()
        }
    }

    unbinds.push(
        api.dom.on(trigger, 'pointerdown', (event) => {
            // Before the layer stack sees it, so a click on the trigger of an
            // open dropdown closes rather than closes-then-reopens.
            event.preventDefault()
            if (close) close()
            else open()
        }),
    )
    unbinds.push(
        api.dom.on(trigger, 'keydown', (event) => {
            const key = (event as KeyboardEvent).key
            if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
                event.preventDefault()
                open()
            }
        }),
    )
    // Clicking the `<label>` focuses the native select. Hand focus on.
    unbinds.push(api.dom.on(select, 'focus', () => trigger.focus()))
    // Someone else changed the value - a reset, a prefill, a customer script.
    unbinds.push(
        api.dom.on(select, 'change', () => {
            if (!echoing) syncLabel()
        }),
    )

    syncLabel()

    return {
        destroy() {
            if (close) close()
            for (const unbind of unbinds) unbind()
            trigger.remove()
            select.classList.remove('ffp-select-native')
            select.removeAttribute('tabindex')
            select.removeAttribute('aria-hidden')
            if (originalStyle === null) select.removeAttribute('style')
            else select.setAttribute('style', originalStyle)
        },
        value: () => select.value,
        setValue: (next) => commit(String(next)),
    }
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('select', (api: ChunkApi) => {
        api.defineField({
            name: 'select',
            parse: (el) => api.readFieldConfig(el, 'select'),
            mount: (el: Element, config: FfpFieldConfigV2, _ctx: MountContext) =>
                mountSelect(el, config, api),
        })
    })
} else {
    console.warn('Form Fields Pro: chunk select loaded without core')
}
