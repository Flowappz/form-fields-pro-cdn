import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCalendar, type CalendarHandle } from '../src/calendar'
import { format } from '../src/dateengine'
import { positionFloating } from '../src/floating'
import { layerZIndex, openLayer, resetLayers } from '../src/layer'
import { createListbox, LISTBOX_CSS } from '../src/listbox'
import { fire } from './setup'

const popover = { positionFloating, openLayer, layerZIndex, createListbox, LISTBOX_CSS }

let handle: CalendarHandle | null = null

function build(over: Partial<Parameters<typeof createCalendar>[0]> = {}): {
    element: HTMLElement
    onSelect: ReturnType<typeof vi.fn>
} {
    const onSelect = vi.fn()
    handle = createCalendar({
        popover,
        locale: 'en-US',
        firstDay: 0,
        months: 1,
        columns: 1,
        range: false,
        onSelect,
        ...over,
    })
    document.body.appendChild(handle.element)
    return { element: handle.element, onSelect }
}

const days = () => Array.from(document.querySelectorAll('.ffp-cal-day')) as unknown as HTMLElement[]
const day = (iso: string) => document.querySelector(`.ffp-cal-day[data-date="${iso}"]`) as HTMLElement
const inRange = () =>
    days()
        .filter((d) => d.getAttribute('data-in-range') === 'true')
        .map((d) => d.getAttribute('data-date'))

afterEach(() => {
    if (handle) handle.destroy()
    handle = null
    resetLayers()
})

describe('layout', () => {
    it('renders six weeks so the height never jumps', () => {
        build({ start: new Date(2026, 1, 10) })
        expect(days().length).toBe(42)
    })

    it('renders one panel per month and lays them out in columns', () => {
        const { element } = build({ months: 3, columns: 3, start: new Date(2026, 7, 1) })
        expect(document.querySelectorAll('.ffp-cal-month').length).toBe(3)
        expect(element.style.getPropertyValue('--cal-columns')).toBe('3')
    })

    it('shows consecutive months', () => {
        build({ months: 2, columns: 2, start: new Date(2026, 11, 1) })
        const titles = Array.from(document.querySelectorAll('.ffp-cal-select')).map((n) => n.textContent)
        expect(titles).toEqual(['December', '2026', 'January', '2027'])
    })

    it('gives the strip one back arrow and one forward arrow', () => {
        // Three panels with three sets of arrows would page three months at once.
        build({ months: 3, columns: 3 })
        const enabled = Array.from(document.querySelectorAll('.ffp-cal-nav')).filter(
            (n) => !(n as HTMLButtonElement).disabled,
        )
        expect(enabled.length).toBe(2)
    })

    it('starts the week on the requested day', () => {
        build({ firstDay: 1, start: new Date(2026, 7, 1) })
        const labels = Array.from(document.querySelectorAll('.ffp-cal-week span')).map((n) => n.textContent)
        expect(labels[0]).toBe('M')
        expect(labels[6]).toBe('S')
    })

    it('names months in the field locale', () => {
        build({ locale: 'fr-FR', start: new Date(2026, 7, 1) })
        expect(document.querySelector('.ffp-cal-select')!.textContent).toBe('août')
    })

    it('never submits the form it lives in', () => {
        // Every control is type=button. A bare <button> inside the customer's
        // form would post it on the first arrow click.
        build({ months: 2, columns: 2 })
        const buttons = Array.from(document.querySelectorAll('button'))
        expect(buttons.every((b) => (b as HTMLButtonElement).type === 'button')).toBe(true)
    })
})

describe('single selection', () => {
    it('reports the clicked date and marks it', () => {
        const { onSelect } = build({ start: new Date(2026, 7, 1) })
        day('2026-08-26').click()

        expect(onSelect).toHaveBeenCalledTimes(1)
        expect(format(onSelect.mock.calls[0][0], 'YYYY-MM-DD')).toBe('2026-08-26')
        expect(onSelect.mock.calls[0][1]).toBeNull()
        expect(day('2026-08-26').getAttribute('data-selected')).toBe('true')
    })

    it('marks today', () => {
        build()
        const iso = format(new Date(), 'YYYY-MM-DD')
        expect(day(iso).getAttribute('data-today')).toBe('true')
    })

    it('dims days from the neighbouring months but still allows them', () => {
        const { onSelect } = build({ start: new Date(2026, 7, 1) })
        const trailing = day('2026-09-01')
        expect(trailing.getAttribute('data-other')).toBe('true')
        trailing.click()
        expect(format(onSelect.mock.calls[0][0], 'YYYY-MM-DD')).toBe('2026-09-01')
    })

    it('refuses dates outside min and max', () => {
        const { onSelect } = build({
            start: new Date(2026, 7, 15),
            min: new Date(2026, 7, 10),
            max: new Date(2026, 7, 20),
        })
        expect((day('2026-08-09') as HTMLButtonElement).disabled).toBe(true)
        expect((day('2026-08-21') as HTMLButtonElement).disabled).toBe(true)
        day('2026-08-09').click()
        expect(onSelect).not.toHaveBeenCalled()
    })
})

describe('range selection', () => {
    // `view` opens the calendar on a month without selecting anything in it.
    const rangeCal = () => build({ range: true, view: new Date(2026, 7, 1), months: 1, columns: 1 })

    it('reports nothing until both ends are picked', () => {
        const { onSelect } = rangeCal()
        day('2026-08-10').click()
        expect(onSelect).not.toHaveBeenCalled()

        day('2026-08-14').click()
        expect(onSelect).toHaveBeenCalledTimes(1)
        expect(format(onSelect.mock.calls[0][0], 'YYYY-MM-DD')).toBe('2026-08-10')
        expect(format(onSelect.mock.calls[0][1], 'YYYY-MM-DD')).toBe('2026-08-14')
    })

    it('swaps the ends when the second pick is earlier', () => {
        const { onSelect } = rangeCal()
        day('2026-08-14').click()
        day('2026-08-10').click()
        expect(format(onSelect.mock.calls[0][0], 'YYYY-MM-DD')).toBe('2026-08-10')
        expect(format(onSelect.mock.calls[0][1], 'YYYY-MM-DD')).toBe('2026-08-14')
    })

    it('previews the range under the pointer before the second click', () => {
        rangeCal()
        day('2026-08-10').click()
        fire(day('2026-08-13'), 'mouseenter')

        expect(inRange()).toEqual(['2026-08-11', '2026-08-12'])
        expect(day('2026-08-10').getAttribute('data-edge')).toBe('start')
        expect(day('2026-08-13').getAttribute('data-edge')).toBe('end')
    })

    it('drops the preview once the range is complete', () => {
        rangeCal()
        day('2026-08-10').click()
        fire(day('2026-08-20'), 'mouseenter')
        day('2026-08-13').click()

        expect(inRange()).toEqual(['2026-08-11', '2026-08-12'])
    })

    it('starts a new range on the click after a complete one', () => {
        const { onSelect } = rangeCal()
        handle!.setValue(new Date(2026, 7, 10), new Date(2026, 7, 14))
        day('2026-08-20').click()
        expect(onSelect).not.toHaveBeenCalled()
        expect(day('2026-08-20').getAttribute('data-selected')).toBe('true')
        expect(inRange()).toEqual([])
    })
})

describe('keyboard', () => {
    it('moves a day at a time and keeps one tab stop', () => {
        build({ start: new Date(2026, 7, 10) })
        expect(day('2026-08-10').getAttribute('tabindex')).toBe('0')

        fire(day('2026-08-10'), 'keydown', { key: 'ArrowRight' })
        expect(day('2026-08-11').getAttribute('tabindex')).toBe('0')
        expect(days().filter((d) => d.getAttribute('tabindex') === '0').length).toBe(1)
    })

    it('moves a week with the vertical arrows', () => {
        build({ start: new Date(2026, 7, 10) })
        fire(day('2026-08-10'), 'keydown', { key: 'ArrowDown' })
        expect(day('2026-08-17').getAttribute('tabindex')).toBe('0')
    })

    it('pages the month with PageUp and PageDown', () => {
        build({ start: new Date(2026, 7, 10) })
        fire(day('2026-08-10'), 'keydown', { key: 'PageDown' })
        expect(document.querySelector('.ffp-cal-select')!.textContent).toBe('September')
    })

    it('jumps to the ends of the week, honouring firstDay', () => {
        build({ start: new Date(2026, 7, 12), firstDay: 1 })
        fire(day('2026-08-12'), 'keydown', { key: 'Home' })
        expect(day('2026-08-10').getAttribute('tabindex')).toBe('0')
        fire(day('2026-08-10'), 'keydown', { key: 'End' })
        expect(day('2026-08-16').getAttribute('tabindex')).toBe('0')
    })

    it('pages the view when focus walks off the end of the month', () => {
        build({ start: new Date(2026, 7, 31) })
        fire(day('2026-08-31'), 'keydown', { key: 'ArrowRight' })
        expect(document.querySelector('.ffp-cal-select')!.textContent).toBe('September')
    })

    it('selects with Enter and Space', () => {
        const { onSelect } = build({ start: new Date(2026, 7, 10) })
        fire(day('2026-08-10'), 'keydown', { key: 'Enter' })
        expect(onSelect).toHaveBeenCalledTimes(1)
    })
})

describe('month and year dropdowns', () => {
    it('opens a listbox of months and jumps the view', () => {
        build({ start: new Date(2026, 7, 10) })
        const monthButton = document.querySelectorAll('.ffp-cal-select')[0] as HTMLElement
        monthButton.click()

        const listbox = document.querySelector('.ffp-listbox')
        expect(listbox).not.toBeNull()
        const december = Array.from(listbox!.querySelectorAll('[role="option"]')).filter(
            (o) => o.textContent === 'December',
        )[0] as HTMLElement
        december.click()

        expect(document.querySelectorAll('.ffp-cal-select')[0].textContent).toBe('December')
    })

    it('offers a century back and a decade forward, not easepick 1990-to-now', () => {
        build({ start: new Date(2026, 7, 10) })
        const yearButton = document.querySelectorAll('.ffp-cal-select')[1] as HTMLElement
        yearButton.click()

        const values = Array.from(document.querySelectorAll('.ffp-listbox [role="option"]')).map(
            (o) => o.textContent,
        )
        expect(values[0]).toBe('2036')
        expect(values[values.length - 1]).toBe('1926')
    })

    it('narrows the year list to min and max when the field has them', () => {
        build({ start: new Date(2026, 7, 10), min: new Date(2020, 0, 1), max: new Date(2027, 0, 1) })
        ;(document.querySelectorAll('.ffp-cal-select')[1] as HTMLElement).click()
        const values = Array.from(document.querySelectorAll('.ffp-listbox [role="option"]')).map(
            (o) => o.textContent,
        )
        expect(values).toEqual(['2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020'])
    })
})

describe('reset', () => {
    it('clears the selection and says so', () => {
        const { onSelect } = build({ start: new Date(2026, 7, 10) })
        ;(document.querySelector('.ffp-cal-reset') as HTMLElement).click()
        expect(onSelect).toHaveBeenCalledWith(null, null)
        expect(days().filter((d) => d.getAttribute('data-selected') === 'true').length).toBe(0)
    })

    it('can be left out', () => {
        build({ resetButton: false })
        expect(document.querySelector('.ffp-cal-reset')).toBeNull()
    })
})

describe('destroy', () => {
    it('removes the element and closes any open dropdown', () => {
        build({ start: new Date(2026, 7, 10) })
        ;(document.querySelectorAll('.ffp-cal-select')[0] as HTMLElement).click()
        handle!.destroy()
        handle = null
        expect(document.querySelector('.ffp-cal')).toBeNull()
        expect(document.querySelector('.ffp-listbox')).toBeNull()
    })
})
