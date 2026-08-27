/**
 * `color` chunk - phase 3. spectrum is gone.
 *
 * spectrum was loaded **unpinned** (`spectrum-colorpicker2`, no version), so any
 * upstream publish could change or break every customer site with no deploy
 * from us. Retiring it removes a live supply-chain risk, 17 kB gz, and the last
 * two jQuery call sites in this field.
 *
 * The submitted value is unchanged: a lowercase `#rrggbb` string, written on
 * Choose and on dismiss - both, because 5.1.5 bound `change` and `hide` to the
 * same write and a visitor who clicks away expects to keep the colour they
 * dragged to.
 */
import type { FfpFieldConfigV2 } from '@flowappz/ffp-config'
import type { ChunkApi, FieldInstance, MountContext, Unbind } from '@flowappz/ffp-core'
import type { PopoverApi } from '@flowappz/ffp-primitives'
import {
    COLORPICKER_CSS,
    createColorPicker,
    type ColorPickerHandle,
} from '@flowappz/ffp-primitives/src/colorpicker'

/** The four tokens the DX has ever written for this field. */
const THEME_TOKENS = [
    'hoverTextColorLight',
    'hoverTextColorDark',
    'hoverBackgroundColorLight',
    'hoverBackgroundColorDark',
]

const TRIGGER_CSS = `
.ffp-color-trigger{display:inline-block;width:30px;height:30px;padding:0;border:1px solid rgba(0,0,0,.2);border-radius:6px;cursor:pointer;vertical-align:middle}
.ffp-color-trigger:focus-visible{outline:2px solid var(--ffp-hover-background-color,#111);outline-offset:2px}
.ffp-color-native{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
`

function mountColor(el: Element, config: FfpFieldConfigV2, api: ChunkApi): FieldInstance {
    const popover = window.__ffpShared && window.__ffpShared.popover
    if (!popover) return { destroy() {} }
    if (!(el instanceof HTMLInputElement)) return { destroy() {} }

    const input = el
    const { positionFloating, openLayer, layerZIndex } = popover as PopoverApi

    api.dom.injectStyle(
        'ffp-colorpicker',
        TRIGGER_CSS + COLORPICKER_CSS + api.theme.schemeResolverCss('.ffp-cp,.ffp-color-trigger', THEME_TOKENS),
    )

    const options = config.options as { defaultColor?: string | null }
    if (!input.value && options.defaultColor) input.value = options.defaultColor

    // spectrum replaced the input with a 30x30 swatch (`.sp-replacer`). Same
    // shape here, but the input stays in the DOM as the submitted control
    // rather than being hidden behind a vendor's own hidden field.
    const trigger = api.dom.h('button', {
        type: 'button',
        class: 'ffp-color-trigger',
        'aria-haspopup': 'dialog',
        'aria-expanded': 'false',
        'aria-label': input.getAttribute('aria-label') || 'Choose a colour',
    }) as HTMLButtonElement

    input.classList.add('ffp-color-native')
    input.setAttribute('tabindex', '-1')
    input.insertAdjacentElement('afterend', trigger)

    let picker: ColorPickerHandle | null = null
    let close: (() => void) | null = null

    function paintTrigger(value: string): void {
        trigger.style.background = value || '#000000'
    }

    function commit(hex: string): void {
        if (input.value === hex) return
        input.value = hex
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    function open(): void {
        if (close || input.disabled) return

        picker = createColorPicker({
            value: input.value,
            onPreview: paintTrigger,
            onCommit: commit,
            onDismiss: () => close && close(),
        })
        api.theme.applyTheme(picker.element, config.theme)

        const unlayer = openLayer({
            element: picker.element,
            anchors: [trigger],
            onClose: () => close && close(),
        })
        const floating = positionFloating(trigger, picker.element, {
            placement: 'bottom-start',
            zIndex: layerZIndex(),
        })

        trigger.setAttribute('aria-expanded', 'true')
        picker.focus()

        close = () => {
            close = null
            // Dismissing commits, as spectrum's `hide` did.
            if (picker) commit(picker.value())
            const restore = picker ? picker.element.contains(document.activeElement) : false
            floating.destroy()
            if (picker) picker.destroy()
            picker = null
            unlayer()
            trigger.setAttribute('aria-expanded', 'false')
            if (restore) trigger.focus()
        }
    }

    const unbinds: Unbind[] = [
        api.dom.on(trigger, 'click', (event) => {
            event.preventDefault()
            if (close) close()
            else open()
        }),
        api.dom.on(input, 'change', () => {
            if (!picker) paintTrigger(input.value)
        }),
    ]

    paintTrigger(input.value)

    return {
        destroy() {
            if (close) close()
            for (const unbind of unbinds) unbind()
            trigger.remove()
            input.classList.remove('ffp-color-native')
            input.removeAttribute('tabindex')
        },
        value: () => input.value,
        setValue(next) {
            commit(String(next))
            paintTrigger(input.value)
            if (picker) picker.setValue(input.value)
        },
    }
}

const define = (window as unknown as { __ffpDefine?: (k: string, f: (api: ChunkApi) => void) => void })
    .__ffpDefine

if (define) {
    define('color', (api: ChunkApi) => {
        api.defineField({
            name: 'color',
            parse: (element) => api.readFieldConfig(element, 'color'),
            mount: (element: Element, config: FfpFieldConfigV2, _ctx: MountContext) =>
                mountColor(element, config, api),
        })
    })
} else {
    console.warn('Form Fields Pro: chunk color loaded without core')
}
