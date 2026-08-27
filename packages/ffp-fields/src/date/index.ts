/**
 * `date` chunk - phase 2. easepick is gone.
 *
 * What the vendor cost: 17 kB of JS and 3 kB of CSS from jsdelivr, plus a
 * blocking `fetch` of that stylesheet as *text* on the critical path of every
 * date field - with a 4 s abort, so a slow jsdelivr delayed the whole field by
 * up to four seconds and then rendered it unstyled. What replaces it is
 * `dateengine` + `calendar` from @flowappz/ffp-primitives, bundled into this
 * chunk, plus a share of `ui-popover` for the month and year dropdowns.
 *
 * The theming apparatus goes with it. easepick rendered into a shadow root, so
 * 5.1.5 needed `pickerThemeCss`, `applyPickerTheme`, `applyHostVars`, a private
 * `toRgba`, and walls of `setProperty(..., 'important')` re-run on every `show`
 * and every `render` - roughly 180 lines whose only job was to reach inside a
 * shadow boundary. The calendar renders into the light DOM, so the theme is
 * eleven custom properties on one element and the customer's own CSS can reach
 * it too.
 *
 * Two things change for the customer, both deliberate:
 *
 * 1. The year dropdown covers a century back and a decade forward, instead of
 *    easepick's AmpPlugin default of 1990 to the current year - which could not
 *    express a birthday before 1990 or a booking next year.
 * 2. The calendar is positioned and portalled, so it is no longer clipped by a
 *    Webflow parent with `overflow: hidden`.
 *
 * The input stays the submitted control, stays `readonly` as easepick left it,
 * and its value is still written in the customer's `data-format`.
 */
import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi, FieldInstance, MountContext, Unbind } from '@flowappz/ffp-core'
// Deep imports, not the barrel: the barrel re-exports the listbox, and this
// chunk must not carry its own copy of what `ui-popover` already ships.
import { CALENDAR_CSS, createCalendar, type CalendarHandle } from '@flowappz/ffp-primitives/src/calendar'
import { format, parse, startOfDay } from '@flowappz/ffp-primitives/src/dateengine'
import type { PopoverApi } from '@flowappz/ffp-primitives'

/** Theme tokens the date field paints with. Names come from @flowappz/ffp-config. */
const THEME_TOKENS = [
    'selectedDateTextColorLight',
    'selectedDateTextColorDark',
    'selectedDateBackgroundColorLight',
    'selectedDateBackgroundColorDark',
    'todayDateColorLight',
    'todayDateColorDark',
    'calendarBackgroundColorLight',
    'calendarBackgroundColorDark',
    'calendarBorderColorLight',
    'calendarBorderColorDark',
    'dateTextColorLight',
    'dateTextColorDark',
    'weekdayTextColorLight',
    'weekdayTextColorDark',
    'headerTextColorLight',
    'headerTextColorDark',
    'dropdownBackgroundColorLight',
    'dropdownBackgroundColorDark',
    'hoverBackgroundColorLight',
    'hoverBackgroundColorDark',
]

/** Lifted from 5.1.5's `ffp-date-picker-host` block, unchanged. */
const HOST_CSS = `
[form-fields-pro-date-picker],[form-fields-pro-date-range-picker]{cursor:pointer;padding-right:44px}
.date-input-icon,[data-date-input-icon]{cursor:pointer;display:flex;align-items:center}
.date-input-icon svg,[data-date-input-icon] svg{width:18px;height:18px}
.date-input-icon svg path,[data-date-input-icon] svg path{stroke:#6b7280}
`

const RANGE_DELIMITER = ' - '

function mountDate(el: Element, config: FfpFieldConfigV2, api: ChunkApi, range: boolean): FieldInstance {
    const popover = window.__ffpShared && window.__ffpShared.popover
    // The loader resolves `deps` before the dependant, so this only happens if
    // something loaded the chunk by hand. A readonly input with no calendar is
    // worse than a plain one, so hand the input back to the visitor.
    if (!popover) return { destroy() {} }
    if (!(el instanceof HTMLInputElement)) return { destroy() {} }

    const input = el
    const options = config.options as {
        months: number
        columns: number
        firstDay: number
        language: string
        format: string
        zIndex: number
    }

    api.dom.injectStyle('ffp-listbox', (popover as PopoverApi).LISTBOX_CSS)
    api.dom.injectStyle(
        'ffp-calendar',
        HOST_CSS + CALENDAR_CSS + api.theme.schemeResolverCss('.ffp-cal', THEME_TOKENS),
    )

    const pattern = options.format
    const locale = options.language

    // easepick set `readonly` through its own option; keep it. The value has to
    // match `data-format` exactly for the payload, and a free-text date field is
    // the single most common source of unparseable submissions.
    input.readOnly = true

    let start: Date | null = null
    let end: Date | null = null
    let calendar: CalendarHandle | null = null
    let close: (() => void) | null = null

    function readInput(): void {
        const raw = String(input.value || '')
        if (!raw) {
            start = null
            end = null
            return
        }
        if (range) {
            const parts = raw.split(RANGE_DELIMITER)
            start = parse(parts[0], pattern, locale)
            end = parts.length > 1 ? parse(parts[1], pattern, locale) : null
            return
        }
        start = parse(raw, pattern, locale)
        end = null
    }

    function writeInput(): void {
        const text = !start
            ? ''
            : range && end
              ? format(start, pattern, locale) + RANGE_DELIMITER + format(end, pattern, locale)
              : format(start, pattern, locale)
        if (input.value === text) return
        input.value = text
        // 5.1.5 relied on the 450 ms conditional-logic poll to notice this.
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    function open(): void {
        if (close || input.disabled) return
        readInput()

        calendar = createCalendar({
            popover: popover as PopoverApi,
            locale,
            firstDay: options.firstDay,
            months: options.months,
            columns: options.columns,
            range,
            start,
            end,
            onSelect: (nextStart, nextEnd) => {
                start = nextStart
                end = nextEnd
                writeInput()
                // A single date is a complete answer; a range is only complete
                // with both ends, and the calendar only reports it then.
                if (close) close()
            },
        })

        api.theme.applyTheme(calendar.element, config.theme)

        const unlayer = (popover as PopoverApi).openLayer({
            element: calendar.element,
            anchors: [input],
            onClose: () => close && close(),
        })
        const floating = (popover as PopoverApi).positionFloating(input, calendar.element, {
            placement: 'bottom-start',
            zIndex: options.zIndex,
        })

        input.setAttribute('aria-expanded', 'true')
        calendar.focus()

        close = () => {
            close = null
            const restore = calendar ? calendar.element.contains(document.activeElement) : false
            floating.destroy()
            if (calendar) calendar.destroy()
            calendar = null
            unlayer()
            input.setAttribute('aria-expanded', 'false')
            if (restore) input.focus()
        }
    }

    const unbinds: Unbind[] = [
        api.dom.on(input, 'click', (event) => {
            event.preventDefault()
            if (close) close()
            else open()
        }),
        api.dom.on(input, 'keydown', (event) => {
            const key = (event as KeyboardEvent).key
            if (key === 'Enter') {
                // Never let Enter on a date field submit the form: with the
                // calendar open the visitor is answering it, not finishing.
                event.preventDefault()
                if (!close) open()
                return
            }
            if (key === 'ArrowDown' || key === ' ') {
                event.preventDefault()
                open()
            }
        }),
    ]

    // The icon Webflow renders beside the input. 5.1.5 fell back to whatever
    // element happened to be next, which is why an unrelated sibling could end
    // up opening the calendar; the explicit markers come first for that reason.
    const parent = input.parentElement
    const icon =
        (parent && parent.querySelector('.date-input-icon, [data-date-input-icon]')) ||
        input.nextElementSibling
    if (icon) {
        ;(icon as HTMLElement).style.cursor = 'pointer'
        unbinds.push(
            api.dom.on(icon, 'click', (event) => {
                event.preventDefault()
                event.stopPropagation()
                if (close) close()
                else open()
            }),
        )
    }

    input.setAttribute('aria-haspopup', 'dialog')
    input.setAttribute('aria-expanded', 'false')
    readInput()

    return {
        destroy() {
            if (close) close()
            for (const unbind of unbinds) unbind()
            input.removeAttribute('aria-haspopup')
            input.removeAttribute('aria-expanded')
        },
        value: () => input.value,
        setValue(next) {
            input.value = String(next)
            readInput()
            writeInput()
            if (calendar) calendar.setValue(start, end)
        },
    }
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('date', (api: ChunkApi) => {
        for (const name of ['date', 'daterange'] as const) {
            api.defineField({
                name,
                parse: (element) => api.readFieldConfig(element, name),
                mount: (element: Element, config: FfpFieldConfigV2, _ctx: MountContext) =>
                    mountDate(element, config, api, name === 'daterange'),
            })
        }
    })
} else {
    console.warn('Form Fields Pro: chunk date loaded without core')
}
