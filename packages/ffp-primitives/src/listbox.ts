/**
 * An ARIA listbox with search, keyboard navigation and type-ahead.
 *
 * One primitive, three call sites: the select field, the phone country picker
 * and the date field's month/year dropdowns. All three are Select2 today, which
 * is 23 kB gzipped plus jQuery for a widget whose consumed API is
 * `minimumResultsForSearch` and nothing else.
 *
 * Renders into the light DOM so customers can style it with their own Webflow
 * classes - the reason easepick needs ~180 lines of `setProperty(..., 'important')`
 * in the date field is that it renders into a shadow root and its own theming
 * has to be fought back out.
 */
import type { Unbind } from '@flowappz/ffp-core'

export type ListboxOption = {
    value: string
    label: string
    disabled?: boolean
    /** Optional leading node - a flag chip, a colour swatch. */
    prefix?: Node
    /** Optional trailing node, pushed to the end of the row - a dial code. */
    suffix?: Node
    /** Matched against in addition to the label. Dial codes, ISO codes. */
    keywords?: string
}

export type ListboxOptions = {
    id: string
    options: ListboxOption[]
    value?: string | null
    searchable?: boolean
    searchPlaceholder?: string
    emptyText?: string
    onSelect(option: ListboxOption): void
    /** Called when the widget wants to be dismissed (Escape, Tab, pick). */
    onDismiss?(): void
}

export type ListboxHandle = {
    element: HTMLElement
    /** Focus the search box if there is one, otherwise the active option. */
    focus(): void
    setValue(value: string | null): void
    setOptions(options: ListboxOption[]): void
    destroy(): void
}

/** Type-ahead window. Matches the platform's own listbox behaviour. */
const TYPEAHEAD_MS = 250

const norm = (value: string) => value.toLowerCase().trim()

export function filterOptions(options: ListboxOption[], query: string): ListboxOption[] {
    const needle = norm(query)
    if (!needle) return options
    // Prefix matches first, then substring. A visitor typing "uni" for a country
    // wants United States before Tunisia, which is what Select2 got wrong.
    const prefix: ListboxOption[] = []
    const rest: ListboxOption[] = []
    for (const option of options) {
        const haystack = norm(`${option.label} ${option.keywords || ''}`)
        if (haystack.startsWith(needle)) prefix.push(option)
        else if (haystack.indexOf(needle) !== -1) rest.push(option)
    }
    return prefix.concat(rest)
}

export function createListbox(config: ListboxOptions): ListboxHandle {
    const unbinds: Unbind[] = []
    let all = config.options.slice()
    let visible = all.slice()
    let value = config.value ?? null
    let active = -1
    let typeahead = ''
    let typeaheadAt = 0

    const root = document.createElement('div')
    root.className = 'ffp-listbox'
    root.setAttribute('data-ffp-listbox', config.id)

    let search: HTMLInputElement | null = null
    if (config.searchable) {
        search = document.createElement('input')
        search.type = 'text'
        search.className = 'ffp-listbox-search'
        search.setAttribute('autocomplete', 'off')
        search.setAttribute('autocorrect', 'off')
        search.setAttribute('spellcheck', 'false')
        search.setAttribute('role', 'combobox')
        search.setAttribute('aria-expanded', 'true')
        search.setAttribute('aria-controls', `${config.id}-list`)
        search.setAttribute('aria-autocomplete', 'list')
        if (config.searchPlaceholder) search.placeholder = config.searchPlaceholder
        root.appendChild(search)
    }

    const list = document.createElement('div')
    list.className = 'ffp-listbox-list'
    list.id = `${config.id}-list`
    list.setAttribute('role', 'listbox')
    list.tabIndex = config.searchable ? -1 : 0
    root.appendChild(list)

    const empty = document.createElement('div')
    empty.className = 'ffp-listbox-empty'
    empty.textContent = config.emptyText || 'No results'
    empty.hidden = true
    root.appendChild(empty)

    const optionId = (index: number) => `${config.id}-opt-${index}`

    function render(): void {
        list.textContent = ''
        visible.forEach((option, index) => {
            const node = document.createElement('div')
            node.className = 'ffp-listbox-option'
            node.id = optionId(index)
            node.setAttribute('role', 'option')
            node.setAttribute('data-value', option.value)
            node.setAttribute('aria-selected', String(option.value === value))
            if (option.disabled) node.setAttribute('aria-disabled', 'true')
            if (option.prefix) node.appendChild(option.prefix.cloneNode(true))
            node.appendChild(document.createTextNode(option.label))
            if (option.suffix) node.appendChild(option.suffix.cloneNode(true))
            list.appendChild(node)
        })
        empty.hidden = visible.length > 0
        list.hidden = visible.length === 0

        const selected = visible.findIndex((o) => o.value === value)
        setActive(selected !== -1 ? selected : firstEnabled())
    }

    function firstEnabled(): number {
        return visible.findIndex((o) => !o.disabled)
    }

    function setActive(index: number, scroll = true): void {
        const nodes = list.children
        if (active >= 0 && nodes[active]) (nodes[active] as HTMLElement).classList.remove('is-active')
        active = index

        const owner = search || list
        if (index < 0 || !nodes[index]) {
            owner.removeAttribute('aria-activedescendant')
            return
        }
        const node = nodes[index] as HTMLElement
        node.classList.add('is-active')
        // aria-activedescendant, not focus: moving real focus to each option
        // would fight the search box and break type-to-filter entirely.
        owner.setAttribute('aria-activedescendant', node.id)
        if (scroll) scrollIntoView(node)
    }

    /**
     * Manual scroll rather than `scrollIntoView`.
     *
     * The native call scrolls every scrollable ancestor, which yanks the whole
     * page when the listbox is portalled to body - the exact bug that made
     * Select2 jump on long Webflow pages.
     */
    function scrollIntoView(node: HTMLElement): void {
        const top = node.offsetTop
        const bottom = top + node.offsetHeight
        if (top < list.scrollTop) list.scrollTop = top
        else if (bottom > list.scrollTop + list.clientHeight) {
            list.scrollTop = bottom - list.clientHeight
        }
    }

    function move(delta: number): void {
        if (!visible.length) return
        let next = active
        for (let step = 0; step < visible.length; step++) {
            next = (next + delta + visible.length) % visible.length
            if (!visible[next].disabled) break
        }
        setActive(next)
    }

    function moveTo(index: number): void {
        if (!visible.length) return
        const bounded = Math.max(0, Math.min(visible.length - 1, index))
        if (visible[bounded] && visible[bounded].disabled) return move(bounded > active ? 1 : -1)
        setActive(bounded)
    }

    function choose(index: number): void {
        const option = visible[index]
        if (!option || option.disabled) return
        value = option.value
        config.onSelect(option)
        if (config.onDismiss) config.onDismiss()
    }

    function applyFilter(query: string): void {
        visible = filterOptions(all, query)
        render()
    }

    function onKey(event: Event): void {
        const key = (event as KeyboardEvent).key

        switch (key) {
            case 'ArrowDown':
                event.preventDefault()
                move(1)
                return
            case 'ArrowUp':
                event.preventDefault()
                move(-1)
                return
            case 'Home':
                event.preventDefault()
                moveTo(0)
                return
            case 'End':
                event.preventDefault()
                moveTo(visible.length - 1)
                return
            case 'PageDown':
                event.preventDefault()
                moveTo(active + 10)
                return
            case 'PageUp':
                event.preventDefault()
                moveTo(active - 10)
                return
            case 'Enter':
                event.preventDefault()
                choose(active)
                return
            case 'Tab':
                // Tab commits and moves on, matching a native select. Escape is
                // the layer stack's job, not ours.
                if (active >= 0) choose(active)
                return
            default:
                break
        }

        // Type-ahead, only where there is no search box to type into.
        if (search || key.length !== 1 || (event as KeyboardEvent).metaKey || (event as KeyboardEvent).ctrlKey) {
            return
        }
        const now = Date.now()
        typeahead = now - typeaheadAt > TYPEAHEAD_MS ? key : typeahead + key
        typeaheadAt = now
        const needle = norm(typeahead)
        const found = visible.findIndex((o) => !o.disabled && norm(o.label).startsWith(needle))
        if (found !== -1) setActive(found)
    }

    if (search) {
        search.addEventListener('input', () => applyFilter(search!.value))
        search.addEventListener('keydown', onKey)
        unbinds.push(() => search!.replaceWith(search!.cloneNode(true) as Node))
    }
    list.addEventListener('keydown', onKey)

    // Delegated: a 252-country list binds once, not 252 times.
    list.addEventListener('pointerdown', (event) => {
        // Keep focus where it is so the search box does not lose its caret.
        event.preventDefault()
    })
    list.addEventListener('click', (event) => {
        const target = (event.target as Element).closest('.ffp-listbox-option')
        if (!target || !list.contains(target)) return
        choose(Array.prototype.indexOf.call(list.children, target))
    })
    list.addEventListener('pointermove', (event) => {
        const target = (event.target as Element).closest('.ffp-listbox-option')
        if (!target || !list.contains(target)) return
        // No scroll on hover: the pointer is already where the user wants it,
        // and scrolling under the cursor makes the list feel like it is fighting.
        setActive(Array.prototype.indexOf.call(list.children, target), false)
    })

    render()

    return {
        element: root,
        focus() {
            if (search) search.focus()
            else list.focus()
        },
        setValue(next) {
            value = next
            render()
        },
        setOptions(next) {
            all = next.slice()
            applyFilter(search ? search.value : '')
        },
        destroy() {
            for (const unbind of unbinds) unbind()
            root.remove()
        },
    }
}

/**
 * Styles for the listbox. Emitted once by whichever chunk mounts first.
 *
 * Kept minimal and low-specificity on purpose: this is the default look, and a
 * customer's own Webflow classes on the wrapper should be able to override any
 * of it without `!important`.
 */
export const LISTBOX_CSS = `
.ffp-listbox{box-sizing:border-box;background:var(--ffp-dropdown-background-color,var(--ffp-background-color,#fff));border:1px solid var(--ffp-border-color,#d4d4d4);border-radius:var(--ffp-border-radius,8px);box-shadow:0 8px 24px rgba(0,0,0,.12);overflow:hidden;font:inherit;color:var(--ffp-text-color,inherit)}
.ffp-listbox-search{box-sizing:border-box;width:100%;border:0;border-bottom:1px solid var(--ffp-border-color,#d4d4d4);padding:8px 10px;font:inherit;color:inherit;background:transparent;outline:none}
.ffp-listbox-list{max-height:16rem;overflow-y:auto;overscroll-behavior:contain;outline:none}
.ffp-listbox-option{display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;user-select:none}
.ffp-listbox-option.is-active{background:var(--ffp-hover-background-color,#f3f4f6);color:var(--ffp-hover-text-color,inherit)}
.ffp-listbox-option[aria-selected="true"]{font-weight:600}
.ffp-listbox-option[aria-disabled="true"]{opacity:.5;cursor:default}
.ffp-listbox-empty{padding:8px 10px;opacity:.7}
`
