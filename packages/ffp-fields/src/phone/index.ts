/**
 * `phone` chunk - phase 4. Iconify, ipinfo and the last of jQuery are gone.
 *
 * This field went last because it needed no new primitive: its country picker
 * *is* a filtered listbox, the same one select uses and the same one the date
 * field's month and year dropdowns use. Three call sites, one primitive.
 *
 * What leaves with it:
 *
 * - **Iconify.** 252 `<span class="iconify" data-icon="flag:xx-4x3">` elements
 *   built eagerly, plus the library from a third origin, to draw flags that are
 *   two Unicode characters. See `flags.ts`.
 * - **ipinfo.** A JSONP `<script>` on every page view that disclosed the
 *   visitor's IP to a third party, to choose which flag showed before anyone
 *   touched the field. See `geo.ts`.
 * - **jQuery.** The last 13 `$(` call sites in the runtime. `grep '\$('` over
 *   `packages/` returns nothing after this.
 * - **The document click handler.** `$(document).on('click.ffpPhoneDropdown')`
 *   is the layer stack's job now, which is also what makes Escape close the
 *   picker rather than whatever bound last.
 *
 * The customer's markup is untouched and still drives everything: the wrapper,
 * `.number-input-field`, `.number-input-icon-wrapper` and `data-selected-country`
 * all keep their meanings, because core reads that attribute to resolve a dial
 * code when it validates and when it builds the payload.
 */
import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi, FieldInstance, MountContext, Unbind } from '@flowappz/ffp-core'
import type { ListboxHandle, PopoverApi } from '@flowappz/ffp-primitives'
import { COUNTRIES, dialCodeMap, findByCode, type Country } from './countries'
import { FLAG_CSS, flagEmoji, flagNode, supportsFlagEmoji } from './flags'
import { detectRegion, regionFromLookup } from './geo'

const THEME_TOKENS = [
    'hoverTextColorLight',
    'hoverTextColorDark',
    'hoverBackgroundColorLight',
    'hoverBackgroundColorDark',
]

const PHONE_CSS = `
.number-input-icon-wrapper{display:inline-flex;align-items:center;gap:2px;cursor:pointer}
.ffp-phone-arrow{flex:none;width:10px;height:6px;background:currentColor;opacity:.6;clip-path:polygon(0 0,100% 0,50% 100%);transition:transform .12s ease}
.number-input-icon-wrapper[aria-expanded="true"] .ffp-phone-arrow{transform:rotate(180deg)}
.ffp-phone-dial{margin-left:auto;padding-left:12px;opacity:.7;font-variant-numeric:tabular-nums}
`

const DEFAULT_CODE = 'GB'

function mountPhone(el: Element, config: FfpFieldConfigV2, api: ChunkApi): FieldInstance {
    const popover = window.__ffpShared && window.__ffpShared.popover
    if (!popover) return { destroy() {} }

    const field = el as HTMLElement
    const input = field.querySelector('.number-input-field') as HTMLInputElement | null
    const iconWrapper = field.querySelector('.number-input-icon-wrapper') as HTMLElement | null
    // The legacy dropdown shell the Designer emits. It is replaced by the
    // portalled listbox, so it must not also be sitting in the layout.
    const legacyDropdown = field.querySelector('.number-input-dropdown') as HTMLElement | null

    if (!input || !iconWrapper) {
        console.warn('Form Fields Pro: Required phone number elements not found')
        return { destroy() {} }
    }

    // Re-bound non-null, so every closure below reads as what it is instead of
    // carrying a `!` on each line.
    const control: HTMLInputElement = input
    const trigger: HTMLElement = iconWrapper

    const { positionFloating, openLayer, layerZIndex, createListbox, LISTBOX_CSS } = popover as PopoverApi

    api.dom.injectStyle('ffp-listbox', LISTBOX_CSS)
    api.dom.injectStyle(
        'ffp-phone',
        PHONE_CSS + FLAG_CSS + api.theme.schemeResolverCss('.ffp-listbox', THEME_TOKENS),
    )

    if (legacyDropdown) legacyDropdown.style.display = 'none'

    const options = config.options as { defaultCountry?: string | null; countryCode?: string | null }
    const emoji = supportsFlagEmoji()

    // Every row carries its dial code and ISO code as search keywords, so typing
    // "880", "bd" or "bangladesh" all find Bangladesh. 5.1.5 matched on the
    // country name alone.
    const dialNode = (phone: string): HTMLElement => {
        const node = document.createElement('span')
        node.className = 'ffp-phone-dial'
        node.textContent = '+' + phone
        return node
    }

    const rows = COUNTRIES.map((country) => ({
        value: country.code,
        label: country.name,
        keywords: `${country.code} ${country.phone} +${country.phone}`,
        prefix: flagNode(country.code, emoji),
        suffix: dialNode(country.phone),
    }))

    let selected: Country =
        findByCode(field.getAttribute('data-selected-country')) ||
        findByCode(options.defaultCountry) ||
        findByCode(DEFAULT_CODE) ||
        COUNTRIES[0]
    /** True once the visitor has chosen, so a late geo guess cannot overrule them. */
    let chosen = Boolean(findByCode(field.getAttribute('data-selected-country')))
    let close: (() => void) | null = null

    const arrow = api.dom.h('span', { class: 'ffp-phone-arrow', 'aria-hidden': 'true' })

    function paintTrigger(): void {
        trigger.textContent = ''
        trigger.appendChild(flagNode(selected.code, emoji))
        trigger.appendChild(arrow)
        trigger.setAttribute('aria-label', `Country: ${selected.name}`)
    }

    /** Seed `+dial ` only when the field is empty or still showing a dial code. */
    function seedDial(force: boolean): void {
        const current = String(control.value || '').trim()
        if (!force && current && !/^\+\d+$/.test(current)) return
        const next = '+' + selected.phone + ' '
        if (control.value === next) return
        control.value = next
        control.dispatchEvent(new Event('input', { bubbles: true }))
        control.dispatchEvent(new Event('change', { bubbles: true }))
    }

    function applyCountry(country: Country, force: boolean): void {
        selected = country
        field.setAttribute('data-selected-country', country.code)
        paintTrigger()
        seedDial(force)
    }

    function open(): void {
        if (close) return

        const listbox: ListboxHandle = createListbox({
            id: `ffp-phone-${Math.random().toString(36).slice(2, 8)}`,
            // The listbox clones prefix and suffix per row, so the same nodes
            // can be handed to every open.
            options: rows,
            value: selected.code,
            searchable: true,
            searchPlaceholder: 'Search countries',
            emptyText: 'No countries found',
            onSelect: (option) => {
                const country = findByCode(option.value)
                if (!country) return
                chosen = true
                // Picking a country replaces the dial code outright, which is
                // what 5.1.5 did: the old number belonged to the old country.
                applyCountry(country, true)
                control.focus()
            },
            onDismiss: () => close && close(),
        })

        api.theme.applyTheme(listbox.element, config.theme)

        const unlayer = openLayer({
            element: listbox.element,
            anchors: [trigger],
            onClose: () => close && close(),
        })
        const floating = positionFloating(trigger, listbox.element, {
            placement: 'bottom-start',
            zIndex: layerZIndex(),
        })

        trigger.setAttribute('aria-expanded', 'true')
        listbox.focus()

        close = () => {
            close = null
            const restore = listbox.element.contains(document.activeElement)
            floating.destroy()
            listbox.destroy()
            unlayer()
            trigger.setAttribute('aria-expanded', 'false')
            if (restore) trigger.focus()
        }
    }

    /**
     * Normalise on blur, so validation and the payload see E.164.
     *
     * Autofill and paste hand back national numbers - `01686…` - and the visitor
     * never sees a problem until the lead arrives unusable.
     */
    function syncPhoneValue(): void {
        const raw = String(control.value || '').trim()
        if (!raw) return
        const dial = selected.phone
        if (raw === '+' + dial || raw === '+' + dial + ' ') return
        const digits = raw.replace(/\D/g, '')
        if (!digits) return
        const e164 = raw.charAt(0) === '+' ? '+' + digits : '+' + dial + digits.replace(/^0+/, '')
        if (!/^\+\d{8,}$/.test(e164)) return
        const rest = e164.slice(1)
        const formatted =
            rest.indexOf(dial) === 0 && rest.length > dial.length
                ? '+' + dial + ' ' + rest.slice(dial.length)
                : e164
        if (formatted !== raw) control.value = formatted
    }

    trigger.setAttribute('role', 'button')
    trigger.setAttribute('aria-haspopup', 'listbox')
    trigger.setAttribute('aria-expanded', 'false')
    if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0')

    const unbinds: Unbind[] = [
        api.dom.on(trigger, 'pointerdown', (event) => {
            event.preventDefault()
            if (close) close()
            else open()
        }),
        api.dom.on(trigger, 'keydown', (event) => {
            const key = (event as KeyboardEvent).key
            if (key !== 'Enter' && key !== ' ' && key !== 'ArrowDown') return
            event.preventDefault()
            open()
        }),
        api.dom.on(control, 'blur', syncPhoneValue),
        api.dom.on(control, 'change', syncPhoneValue),
    ]

    applyCountry(selected, false)

    // Soft geo default. Never overrules a country already on the element, a
    // country the visitor has picked, or a number they have started typing.
    const lookup = field.getAttribute('data-geo-lookup')
    const guess = lookup ? regionFromLookup(lookup) : Promise.resolve(detectRegion())
    void guess.then((region) => {
        if (chosen || !region) return
        const current = String(control.value || '').trim()
        if (current && !/^\+\d+\s*$/.test(current)) return
        const country = findByCode(region)
        if (country) applyCountry(country, true)
    })

    return {
        destroy() {
            if (close) close()
            for (const unbind of unbinds) unbind()
            trigger.removeAttribute('aria-expanded')
            trigger.removeAttribute('aria-haspopup')
            if (legacyDropdown) legacyDropdown.style.display = ''
        },
        value: () => control.value,
        setValue(next) {
            control.value = String(next)
            syncPhoneValue()
        },
    }
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('phone', (api: ChunkApi) => {
        // Core validates and builds the payload for phone values, and needs the
        // dial codes to do it. This is the only copy of the table on the page.
        api.registerDialCodes(dialCodeMap())

        api.defineField({
            name: 'phone',
            parse: (element) => api.readFieldConfig(element, 'phone'),
            mount: (element: Element, config: FfpFieldConfigV2, _ctx: MountContext) =>
                mountPhone(element, config, api),
        })
    })
} else {
    console.warn('Form Fields Pro: chunk phone loaded without core')
}

export { flagEmoji }
