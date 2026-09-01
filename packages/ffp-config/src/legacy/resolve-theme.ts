import { attrReader } from '../dom'
import type { ThemeTokens } from '../types'
import {
    DATE_THEME_ATTRS,
    NPS_THEME_ATTRS,
    SLIDER_THEME_ATTRS,
    THEME_ATTRS,
    THEME_BLOB_ATTR,
    type ThemeFamily,
} from './attrs'
import { DATE_STYLE_DEFAULTS, NPS_STYLE_DEFAULTS, SLIDER_STYLE_DEFAULTS } from './defaults'
import {
    followHoverIfStockBlue,
    isWhite,
    normalizeRadius,
    parseCompactTheme,
    pick,
    contrastSliderTrack,
} from './themes'
import { readWrapperStyle } from './wrapper'

/** The rungs below the attributes, gathered once so each resolver stays flat. */
export type ThemeSources = {
    /** Rung 2: the compact `data-*-theme` blob, tilde or JSON. */
    blob: ThemeTokens
    /** Rung 4: `JSON.parse(data-field-config).style` on the nearest wrapper. */
    wrapper: ThemeTokens
    /** Rung 5: the matching field's `style` inside `fa-form-config`. */
    faForm: ThemeTokens
}

function gather(el: Element, family: ThemeFamily, faForm: ThemeTokens): ThemeSources {
    const attr = attrReader(el)
    const blobAttr = THEME_BLOB_ATTR[family]

    let raw: string | null = null
    if (blobAttr) {
        // NPS writes its blob onto the scale, not the field root. Descendant first,
        // exactly as 5.1.5's `readTheme` does, then the field root.
        const scale = family === 'nps' ? el.querySelector('[data-nps-scale]') : null
        raw = (scale && scale.getAttribute(blobAttr)) || attr(blobAttr)
    }

    const kind = family === 'date' || family === 'slider' || family === 'nps' ? family : null
    return {
        blob: (kind && parseCompactTheme(raw, kind)) || {},
        wrapper: readWrapperStyle(el),
        faForm: faForm || {},
    }
}

/** blob -> attribute -> wrapper config -> fa-form -> default, first non-blank wins. */
function ladder(
    src: ThemeSources,
    attr: (name: string) => string | null,
    attrs: Record<string, string>,
    key: string,
    fallback?: string,
): string | undefined {
    const attrName = attrs[key]
    const fromAttr = attrName ? attr(attrName) : null
    return pick(
        src.blob[key],
        pick(fromAttr, pick(src.wrapper[key], pick(src.faForm[key], fallback))),
    ) as string | undefined
}

function resolveDate(el: Element, src: ThemeSources): ThemeTokens {
    const attr = attrReader(el)
    const out: ThemeTokens = {}

    for (const key of Object.keys(DATE_THEME_ATTRS)) {
        if (key === 'calendarTheme') continue
        const value = ladder(src, attr, DATE_THEME_ATTRS, key, DATE_STYLE_DEFAULTS[key])
        if (value !== undefined) out[key] = value
    }

    // Radius is stored bare or px-suffixed and clamped to 0-48 on the way out.
    // 5.1.5 emits a bare number string here; the `px` is added by the CSS.
    // The default belongs in the candidate list, not after the coercion: an
    // empty string coerces to a finite 0, so a bare field would clamp to "0"
    // instead of falling back to the default radius.
    const rawRadius = [
        src.blob.borderRadius,
        src.wrapper.borderRadius,
        src.faForm.borderRadius,
        DATE_STYLE_DEFAULTS.borderRadius,
    ].find((v) => v !== undefined && v !== null && String(v).trim() !== '')
    const radius = Number(String(rawRadius ?? '').replace(/px$/i, '').trim())
    out.borderRadius = Number.isFinite(radius)
        ? String(Math.max(0, Math.min(48, radius)))
        : DATE_STYLE_DEFAULTS.borderRadius

    out.calendarTheme = String(
        ladder(src, attr, DATE_THEME_ATTRS, 'calendarTheme', DATE_STYLE_DEFAULTS.calendarTheme),
    ).toLowerCase()

    return out
}

function resolveSlider(el: Element, src: ThemeSources): ThemeTokens {
    const attr = attrReader(el)
    const merged: ThemeTokens = {}
    for (const key of Object.keys(SLIDER_THEME_ATTRS)) {
        const value = ladder(src, attr, SLIDER_THEME_ATTRS, key)
        if (value !== undefined) merged[key] = value
    }

    // An all-white core palette means the author never themed the slider - a
    // white-on-white slider is invisible, so 5.1.5 reads it as "unset" and
    // discards every resolved value, including the track colours.
    const core = [
        merged.maxMinTextColorLight,
        merged.maxMinTextColorDark,
        merged.tooltipTextColorLight,
        merged.tooltipTextColorDark,
        merged.sliderColorLight,
        merged.sliderColorDark,
    ]
    if (core.every(isWhite)) return { ...SLIDER_STYLE_DEFAULTS }

    const out: ThemeTokens = {}
    for (const key of Object.keys(SLIDER_THEME_ATTRS)) {
        out[key] = pick(merged[key], SLIDER_STYLE_DEFAULTS[key]) as string
    }
    out.trackColorLight = contrastSliderTrack(out.sliderColorLight, out.trackColorLight)
    out.trackColorDark = contrastSliderTrack(out.sliderColorDark, out.trackColorDark)
    return out
}

function resolveNps(el: Element, src: ThemeSources): ThemeTokens {
    const attr = attrReader(el)
    const at = (key: string, fallback?: string) =>
        ladder(src, attr, NPS_THEME_ATTRS, key, fallback)

    // Hover resolves first: selected falls back to it, so it must be settled
    // before the selected tokens are read.
    const hoverTextLight = at('hoverTextColorLight', NPS_STYLE_DEFAULTS.hoverTextColorLight)!
    const hoverTextDark = at('hoverTextColorDark', NPS_STYLE_DEFAULTS.hoverTextColorDark)!
    const hoverBgLight = at(
        'hoverBackgroundColorLight',
        NPS_STYLE_DEFAULTS.hoverBackgroundColorLight,
    )!
    const hoverBgDark = at('hoverBackgroundColorDark', NPS_STYLE_DEFAULTS.hoverBackgroundColorDark)!

    return {
        layout: at('layout', NPS_STYLE_DEFAULTS.layout)!,
        textColorLight: at('textColorLight', NPS_STYLE_DEFAULTS.textColorLight)!,
        textColorDark: at('textColorDark', NPS_STYLE_DEFAULTS.textColorDark)!,
        backgroundColorLight: at('backgroundColorLight', NPS_STYLE_DEFAULTS.backgroundColorLight)!,
        backgroundColorDark: at('backgroundColorDark', NPS_STYLE_DEFAULTS.backgroundColorDark)!,
        hoverTextColorLight: hoverTextLight,
        hoverTextColorDark: hoverTextDark,
        hoverBackgroundColorLight: hoverBgLight,
        hoverBackgroundColorDark: hoverBgDark,
        selectedTextColorLight: at('selectedTextColorLight', hoverTextLight)!,
        selectedTextColorDark: at('selectedTextColorDark', hoverTextDark)!,
        selectedBackgroundColorLight: followHoverIfStockBlue(
            at('selectedBackgroundColorLight', hoverBgLight),
            hoverBgLight,
        ) as string,
        selectedBackgroundColorDark: followHoverIfStockBlue(
            at('selectedBackgroundColorDark', hoverBgDark),
            hoverBgDark,
        ) as string,
        borderColorLight: at('borderColorLight', NPS_STYLE_DEFAULTS.borderColorLight)!,
        borderColorDark: at('borderColorDark', NPS_STYLE_DEFAULTS.borderColorDark)!,
        borderRadius:
            normalizeRadius(at('borderRadius')) || NPS_STYLE_DEFAULTS.borderRadius!,
    }
}

const nonBlank = (value: unknown): string | undefined => {
    if (value === undefined || value === null) return undefined
    const text = String(value).trim()
    return text ? text : undefined
}

/**
 * Select's four attributes are idle vs highlighted, not light vs dark.
 *
 * Light-hover attrs are the highlighted row; dark-hover attrs are the idle
 * option colours. Copying the highlight onto both scheme halves means a
 * visitor in dark mode still sees the colour they picked, instead of the idle
 * palette that 5.1.5 painted as "dark hover".
 */
function emitSelectTheme(
    idleText: string | undefined,
    idleBg: string | undefined,
    hoverText: string | undefined,
    hoverBg: string | undefined,
): ThemeTokens {
    const out: ThemeTokens = {}
    const pair = (base: string, value: string | undefined) => {
        if (!value) return
        out[`${base}Light`] = value
        out[`${base}Dark`] = value
    }
    pair('hoverTextColor', hoverText)
    pair('hoverBackgroundColor', hoverBg)
    if (idleText) out.textColor = idleText
    if (idleBg) {
        out.backgroundColor = idleBg
        out.dropdownBackgroundColor = idleBg
    }
    return out
}

function resolveSelect(el: Element, src: ThemeSources): ThemeTokens {
    const attr = attrReader(el)
    const hoverText = nonBlank(attr('data-light-theme-hover-text-color'))
    const hoverBg = nonBlank(attr('data-light-theme-hover-background-color'))
    const idleText = nonBlank(attr('data-dark-theme-hover-text-color'))
    const idleBg = nonBlank(attr('data-dark-theme-hover-background-color'))

    if (hoverText || hoverBg || idleText || idleBg) {
        return emitSelectTheme(idleText, idleBg, hoverText, hoverBg)
    }

    const wrap = src.wrapper
    const fa = src.faForm
    return emitSelectTheme(
        nonBlank(pick(wrap.textColor, fa.textColor)),
        nonBlank(pick(wrap.backgroundColor, fa.backgroundColor)),
        nonBlank(pick(wrap.hoverTextColor, fa.hoverTextColor)),
        nonBlank(pick(wrap.hoverBackgroundColor, fa.hoverBackgroundColor)),
    )
}

/**
 * Select, phone and colour share one shape: four hover tokens, no defaults table.
 *
 * All-or-nothing on purpose. 5.1.5's `resolveColorPickerStyle` returns the
 * attribute set whole if *any* of the four is present, and only otherwise falls
 * back to the wrapper config - it never mixes the two sources. Resolving per
 * token would be more complete but would repaint pickers that today take all
 * four colours from the wrapper, so fidelity wins here and any improvement
 * belongs in v2 authoring, not in the compatibility reader.
 */
function resolveHoverPair(el: Element, family: ThemeFamily, src: ThemeSources): ThemeTokens {
    const attr = attrReader(el)
    const attrs = THEME_ATTRS[family]

    const fromAttrs: ThemeTokens = {}
    let anyAttr = false
    for (const key of Object.keys(attrs)) {
        const value = attr(attrs[key])
        if (value !== null && String(value).trim() !== '') {
            fromAttrs[key] = value
            anyAttr = true
        }
    }
    if (anyAttr) return fromAttrs

    const out: ThemeTokens = {}
    for (const key of Object.keys(attrs)) {
        const value = pick(src.blob[key], pick(src.wrapper[key], src.faForm[key]))
        if (value !== undefined && value !== null) out[key] = value as string
    }
    return out
}

/**
 * Resolve one field's theme down the whole compatibility ladder.
 *
 * `faForm` is the `style` block of the matching field inside `fa-form-config`.
 * Nothing in 5.1.5 reads it, so it is a new rung, inserted below the wrapper
 * config and above the defaults: it can only fill values that would otherwise
 * have come from a default.
 */
export function resolveTheme(
    el: Element,
    family: ThemeFamily,
    faForm: ThemeTokens = {},
): ThemeTokens {
    const src = gather(el, family, faForm)
    if (family === 'date') return resolveDate(el, src)
    if (family === 'slider') return resolveSlider(el, src)
    if (family === 'nps') return resolveNps(el, src)
    if (family === 'select') return resolveSelect(el, src)
    return resolveHoverPair(el, family, src)
}
