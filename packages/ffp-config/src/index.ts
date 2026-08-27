export * from './types'
export { attrFrom, attrReader } from './dom'
export { readFieldConfig } from './read'

export {
    DATE_STYLE_DEFAULTS,
    NPS_SELECTED_FOLLOWS_HOVER,
    NPS_STYLE_DEFAULTS,
    SLIDER_STYLE_DEFAULTS,
} from './legacy/defaults'
export {
    COLOR_THEME_ATTRS,
    DATE_THEME_ATTRS,
    NPS_THEME_ATTRS,
    PHONE_THEME_ATTRS,
    SELECT_THEME_ATTRS,
    SLIDER_THEME_ATTRS,
    THEME_ATTRS,
    THEME_BLOB_ATTR,
    THEME_FAMILY,
    type ThemeAttrMap,
    type ThemeFamily,
} from './legacy/attrs'
export { resolveTheme } from './legacy/resolve-theme'
export {
    followHoverIfStockBlue,
    isStockBlue,
    isWhite,
    normalizeRadius,
    parseCompactTheme,
    pick,
} from './legacy/themes'
export { readConditional, readFaFormField, readWrapperStyle, type FaFormField } from './legacy/wrapper'

export * from './options/coerce'
export * from './options/tables'
