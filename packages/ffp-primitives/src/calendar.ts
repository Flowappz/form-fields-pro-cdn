/**
 * Calendar: single date or range, one to twelve months, in the light DOM.
 *
 * Replaces easepick plus its AmpPlugin and RangePlugin. The single biggest
 * change is where it renders. easepick builds inside a shadow root, which is why
 * the date field in 5.1.5 carries ~180 lines of theming apparatus -
 * `applyPickerTheme`, `applyHostVars`, `pickerThemeCss`, walls of
 * `setProperty(..., 'important')` - re-run on every `show` and every `render`,
 * plus a blocking `fetch` of the vendor stylesheet as *text* so it can be
 * injected into that shadow root. Rendering into the light DOM deletes all of
 * it: the customer's own CSS reaches the calendar, and so does ours.
 *
 * The month and year dropdowns are the shared listbox, handed in rather than
 * imported: this file is bundled into the `date` chunk, and importing the
 * listbox directly would give date its own copy of the one `ui-popover` already
 * ships for select and phone.
 */
import type { PopoverApi } from './shared-types'
import {
    addDays,
    addMonths,
    daysInMonth,
    daysMatrix,
    format,
    isSameDay,
    isSameMonth,
    monthNames,
    startOfDay,
    today,
    weekdayNames,
} from './dateengine'

export type CalendarOptions = {
    popover: PopoverApi
    locale: string
    firstDay: number
    /** How many months to render. easepick called this `calendars`. */
    months: number
    /** How many to lay out per row. easepick called this `grid`. */
    columns: number
    range: boolean
    start?: Date | null
    end?: Date | null
    /** Month to open on when nothing is selected yet. Defaults to today. */
    view?: Date | null
    min?: Date | null
    max?: Date | null
    resetButton?: boolean
    /** Fires when a selection completes: one date, or both ends of a range. */
    onSelect(start: Date | null, end: Date | null): void
    onDismiss?(): void
}

export type CalendarHandle = {
    element: HTMLElement
    focus(): void
    setValue(start: Date | null, end: Date | null): void
    destroy(): void
}

export const CALENDAR_CSS = `
.ffp-cal{--cal-radius:var(--ffp-border-radius,12px);box-sizing:border-box;display:inline-block;padding:12px;font:inherit;font-size:14px;line-height:1.2;background:var(--ffp-calendar-background-color,#fff);color:var(--ffp-date-text-color,#111827);border:1px solid var(--ffp-calendar-border-color,#e5e7eb);border-radius:var(--cal-radius);box-shadow:0 8px 24px rgba(0,0,0,.12)}
.ffp-cal *{box-sizing:border-box}
.ffp-cal-months{display:grid;grid-template-columns:repeat(var(--cal-columns,1),minmax(0,1fr));gap:12px}
.ffp-cal-head{display:flex;align-items:center;gap:4px;margin-bottom:8px;color:var(--ffp-header-text-color,#111827)}
.ffp-cal-title{display:flex;align-items:center;gap:4px;flex:1;justify-content:center}
.ffp-cal-nav,.ffp-cal-select,.ffp-cal-reset{font:inherit;color:inherit;background:none;border:0;padding:4px 6px;border-radius:6px;cursor:pointer}
.ffp-cal-select{font-weight:600}
.ffp-cal-nav:hover,.ffp-cal-select:hover,.ffp-cal-reset:hover{background:var(--ffp-hover-background-color,#f3f4f6)}
.ffp-cal-nav[disabled]{opacity:0;pointer-events:none}
.ffp-cal-nav svg{display:block;width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2}
.ffp-cal-week,.ffp-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.ffp-cal-week{margin-bottom:4px;color:var(--ffp-weekday-text-color,#6b7280);font-size:12px;text-align:center}
.ffp-cal-day{font:inherit;color:inherit;background:none;border:0;padding:0;height:32px;border-radius:8px;cursor:pointer;text-align:center}
.ffp-cal-day[data-other="true"]{opacity:.35}
.ffp-cal-day[disabled]{opacity:.25;cursor:default}
.ffp-cal-day:hover:not([disabled]){background:var(--ffp-hover-background-color,#f3f4f6)}
.ffp-cal-day[data-today="true"]{color:var(--ffp-today-date-color,#146ef5);font-weight:700}
.ffp-cal-day[data-in-range="true"]{background:var(--ffp-hover-background-color,#f3f4f6);border-radius:0}
.ffp-cal-day[data-selected="true"]{background:var(--ffp-selected-date-background-color,#146ef5);color:var(--ffp-selected-date-text-color,#fff);font-weight:600}
.ffp-cal-day[data-edge="start"]{border-radius:8px 0 0 8px}
.ffp-cal-day[data-edge="end"]{border-radius:0 8px 8px 0}
.ffp-cal-day[data-edge="both"]{border-radius:8px}
.ffp-cal-day:focus-visible{outline:2px solid var(--ffp-selected-date-background-color,#146ef5);outline-offset:1px}
.ffp-cal-foot{display:flex;justify-content:flex-end;margin-top:8px}
.ffp-cal .ffp-listbox{background:var(--ffp-dropdown-background-color,#fff);color:var(--ffp-date-text-color,#111827)}
`

const CHEVRON = (direction: 'left' | 'right') =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${
        direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'
    }"/></svg>`

const KEY_STEP: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }

function button(className: string, label: string): HTMLButtonElement {
    const node = document.createElement('button')
    // Always `type="button"`: these live inside the customer's `<form>`, and a
    // bare <button> submits it. A calendar that posts the form on every arrow
    // click is the kind of bug that only shows up in production.
    node.type = 'button'
    node.className = className
    node.innerHTML = label
    return node
}

export function createCalendar(options: CalendarOptions): CalendarHandle {
    const { popover, locale, range } = options
    const firstDay = options.firstDay
    const months = Math.max(1, Math.min(12, options.months || 1))
    const columns = Math.max(1, Math.min(months, options.columns || 1))

    let start = options.start ? startOfDay(options.start) : null
    let end = options.end ? startOfDay(options.end) : null
    let preview: Date | null = null
    let view = startOfDay(start || options.view || today())
    view = new Date(view.getFullYear(), view.getMonth(), 1)
    let focused = start ? new Date(start) : today()
    let closeDropdown: (() => void) | null = null

    const root = document.createElement('div')
    root.className = 'ffp-cal'
    root.setAttribute('role', 'application')
    root.style.setProperty('--cal-columns', String(columns))

    const grid = document.createElement('div')
    grid.className = 'ffp-cal-months'
    root.appendChild(grid)

    if (options.resetButton !== false) {
        const foot = document.createElement('div')
        foot.className = 'ffp-cal-foot'
        const reset = button('ffp-cal-reset', 'Reset')
        reset.addEventListener('click', () => {
            start = null
            end = null
            preview = null
            options.onSelect(null, null)
            render()
        })
        foot.appendChild(reset)
        root.appendChild(foot)
    }

    const beforeMin = (date: Date) => Boolean(options.min && date < startOfDay(options.min))
    const afterMax = (date: Date) => Boolean(options.max && date > startOfDay(options.max))
    const disabled = (date: Date) => beforeMin(date) || afterMax(date)

    /** The far end of the range being previewed while the pointer moves. */
    function rangeEnd(): Date | null {
        if (!range) return null
        if (end) return end
        return preview
    }

    function within(date: Date): boolean {
        const far = rangeEnd()
        if (!range || !start || !far) return false
        const low = start < far ? start : far
        const high = start < far ? far : start
        return date > low && date < high
    }

    function edgeOf(date: Date): string | null {
        const far = rangeEnd()
        if (!range || !start) return null
        if (!far) return isSameDay(date, start) ? 'both' : null
        const low = start < far ? start : far
        const high = start < far ? far : start
        if (isSameDay(low, high)) return isSameDay(date, low) ? 'both' : null
        if (isSameDay(date, low)) return 'start'
        if (isSameDay(date, high)) return 'end'
        return null
    }

    function selected(date: Date): boolean {
        if (isSameDay(date, start)) return true
        if (range && isSameDay(date, end)) return true
        return false
    }

    function pick(date: Date): void {
        if (disabled(date)) return

        if (!range) {
            start = date
            end = null
            options.onSelect(start, null)
            render()
            return
        }

        if (!start || end) {
            // Starting a new range. The second click completes it.
            start = date
            end = null
            preview = null
            render()
            return
        }

        // Backwards selection is a selection, not a mistake: swap the ends.
        if (date < start) {
            end = start
            start = date
        } else {
            end = date
        }
        preview = null
        options.onSelect(start, end)
        render()
    }

    function openDropdown(anchor: HTMLElement, items: Array<{ value: string; label: string }>, current: string, apply: (value: string) => void): void {
        if (closeDropdown) {
            closeDropdown()
            return
        }
        const listbox = popover.createListbox({
            id: `ffp-cal-${Math.random().toString(36).slice(2, 8)}`,
            options: items,
            value: current,
            onSelect: (option) => {
                apply(option.value)
                if (closeDropdown) closeDropdown()
            },
            onDismiss: () => closeDropdown && closeDropdown(),
        })
        const floating = popover.positionFloating(anchor, listbox.element, {
            placement: 'bottom-start',
            zIndex: popover.layerZIndex(),
        })
        const unlayer = popover.openLayer({
            element: listbox.element,
            anchors: [anchor],
            onClose: () => closeDropdown && closeDropdown(),
        })
        listbox.focus()
        closeDropdown = () => {
            closeDropdown = null
            floating.destroy()
            listbox.destroy()
            unlayer()
            anchor.focus()
        }
    }

    function monthPanel(offset: number): HTMLElement {
        const panel = document.createElement('div')
        panel.className = 'ffp-cal-month'

        const shown = addMonths(view, offset)
        const year = shown.getFullYear()
        const month = shown.getMonth()

        const head = document.createElement('div')
        head.className = 'ffp-cal-head'

        const previous = button('ffp-cal-nav', CHEVRON('left'))
        previous.setAttribute('aria-label', 'Previous month')
        // Only the first panel gets a back arrow and only the last a forward
        // one, so a three-month view scrolls as one strip rather than three.
        if (offset !== 0) previous.disabled = true
        previous.addEventListener('click', () => {
            view = addMonths(view, -1)
            render()
        })

        const next = button('ffp-cal-nav', CHEVRON('right'))
        next.setAttribute('aria-label', 'Next month')
        if (offset !== months - 1) next.disabled = true
        next.addEventListener('click', () => {
            view = addMonths(view, 1)
            render()
        })

        const title = document.createElement('div')
        title.className = 'ffp-cal-title'

        const names = monthNames(locale, 'long')
        const monthButton = button('ffp-cal-select', names[month])
        monthButton.setAttribute('aria-label', 'Month')
        monthButton.addEventListener('click', () =>
            openDropdown(
                monthButton,
                names.map((label, index) => ({ value: String(index), label })),
                String(month),
                (value) => {
                    view = addMonths(new Date(year, Number(value), 1), -offset)
                    render()
                },
            ),
        )

        // easepick's AmpPlugin offered 1990 to the current year, which cannot
        // express a birthday before 1990 or a booking next year. The window is
        // the field's `min`/`max` when it has them, and a century back to a
        // decade forward when it does not.
        const lowYear = options.min ? options.min.getFullYear() : year - 100
        const highYear = options.max ? options.max.getFullYear() : year + 10
        const years: Array<{ value: string; label: string }> = []
        for (let y = highYear; y >= lowYear; y--) years.push({ value: String(y), label: String(y) })

        const yearButton = button('ffp-cal-select', String(year))
        yearButton.setAttribute('aria-label', 'Year')
        yearButton.addEventListener('click', () =>
            openDropdown(yearButton, years, String(year), (value) => {
                view = addMonths(new Date(Number(value), month, 1), -offset)
                render()
            }),
        )

        title.appendChild(monthButton)
        title.appendChild(yearButton)
        head.appendChild(previous)
        head.appendChild(title)
        head.appendChild(next)
        panel.appendChild(head)

        const week = document.createElement('div')
        week.className = 'ffp-cal-week'
        for (const name of weekdayNames(locale, 'narrow', firstDay)) {
            const cell = document.createElement('span')
            cell.textContent = name
            week.appendChild(cell)
        }
        panel.appendChild(week)

        const body = document.createElement('div')
        body.className = 'ffp-cal-grid'
        body.setAttribute('role', 'grid')

        for (const date of daysMatrix(year, month, firstDay)) {
            const cell = button('ffp-cal-day', String(date.getDate()))
            const other = !isSameMonth(date, shown)
            cell.setAttribute('role', 'gridcell')
            cell.setAttribute('data-date', format(date, 'YYYY-MM-DD'))
            cell.setAttribute('data-other', String(other))
            cell.setAttribute('data-today', String(isSameDay(date, today())))
            cell.setAttribute('data-selected', String(selected(date)))
            cell.setAttribute('data-in-range', String(within(date)))
            const edge = edgeOf(date)
            if (edge) cell.setAttribute('data-edge', edge)
            cell.setAttribute('aria-selected', String(selected(date)))
            cell.setAttribute('aria-label', format(date, 'dddd, MMMM D, YYYY', locale))
            if (disabled(date)) cell.disabled = true
            // Roving tabindex: one stop for the whole grid, then arrows.
            cell.setAttribute('tabindex', isSameDay(date, focused) ? '0' : '-1')

            cell.addEventListener('click', () => pick(date))
            if (range) {
                cell.addEventListener('mouseenter', () => {
                    if (!start || end) return
                    preview = date
                    paint()
                })
            }
            body.appendChild(cell)
        }

        panel.appendChild(body)
        return panel
    }

    /** Repaint range state without rebuilding the DOM - this runs on hover. */
    function paint(): void {
        for (const cell of Array.from(root.querySelectorAll('.ffp-cal-day'))) {
            const raw = cell.getAttribute('data-date')
            if (!raw) continue
            const parts = raw.split('-')
            const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
            cell.setAttribute('data-selected', String(selected(date)))
            cell.setAttribute('data-in-range', String(within(date)))
            const edge = edgeOf(date)
            if (edge) cell.setAttribute('data-edge', edge)
            else cell.removeAttribute('data-edge')
        }
    }

    function render(): void {
        if (closeDropdown) closeDropdown()
        grid.textContent = ''
        for (let offset = 0; offset < months; offset++) grid.appendChild(monthPanel(offset))
    }

    function moveFocus(next: Date): void {
        focused = next
        const first = new Date(view.getFullYear(), view.getMonth(), 1)
        const last = addMonths(first, months - 1)
        // Page the view when focus walks off either end.
        if (next < first) view = addMonths(view, -1)
        else if (next > new Date(last.getFullYear(), last.getMonth(), daysInMonth(last.getFullYear(), last.getMonth()))) {
            view = addMonths(view, 1)
        }
        render()
        const cell = root.querySelector(`.ffp-cal-day[data-date="${format(next, 'YYYY-MM-DD')}"]`)
        if (cell) (cell as HTMLElement).focus()
    }

    function onKeyDown(event: Event): void {
        const key = (event as KeyboardEvent).key
        if (key in KEY_STEP) {
            event.preventDefault()
            moveFocus(addDays(focused, KEY_STEP[key]))
            return
        }
        if (key === 'PageUp' || key === 'PageDown') {
            event.preventDefault()
            moveFocus(addMonths(focused, key === 'PageUp' ? -1 : 1))
            return
        }
        if (key === 'Home' || key === 'End') {
            event.preventDefault()
            const weekday = (focused.getDay() - firstDay + 7) % 7
            moveFocus(addDays(focused, key === 'Home' ? -weekday : 6 - weekday))
            return
        }
        if (key === 'Enter' || key === ' ') {
            const target = event.target as HTMLElement | null
            if (!target || !target.classList.contains('ffp-cal-day')) return
            event.preventDefault()
            pick(focused)
        }
    }

    root.addEventListener('keydown', onKeyDown)

    render()

    return {
        element: root,
        focus() {
            const cell = root.querySelector('.ffp-cal-day[tabindex="0"]') as HTMLElement | null
            if (cell) cell.focus()
        },
        setValue(nextStart, nextEnd) {
            start = nextStart ? startOfDay(nextStart) : null
            end = nextEnd ? startOfDay(nextEnd) : null
            preview = null
            if (start) {
                focused = new Date(start)
                view = new Date(start.getFullYear(), start.getMonth(), 1)
            }
            render()
        },
        destroy() {
            if (closeDropdown) closeDropdown()
            root.removeEventListener('keydown', onKeyDown)
            root.remove()
        },
    }
}
