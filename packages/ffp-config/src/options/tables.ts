import { boolAttr, clamp, num, posIntOr, str, strOrNull, toFirstDay, toLang } from './coerce'

/**
 * The only place raw attribute names appear.
 *
 * Runtime 5.1.5 spreads these across ~30 inline `getAttribute` calls and
 * `pick(key, attrName, fallback)` chains. Centralising them means the Designer
 * Extension can import the same table to write what the runtime reads, which is
 * what stops the two drifting again.
 */
export type OptionSpec = {
    key: string
    attr: string
    read: (raw: unknown, el: Element) => unknown
}

export const DATE_OPTIONS: OptionSpec[] = [
    { key: 'months', attr: 'data-months', read: (r) => clamp(r, 1, 12, 1) },
    { key: 'columns', attr: 'data-columns', read: (r) => clamp(r, 1, 12, 1) },
    { key: 'firstDay', attr: 'data-firstDay', read: (r) => toFirstDay(r) },
    { key: 'language', attr: 'data-language', read: (r) => toLang(r) },
    { key: 'format', attr: 'data-format', read: (r) => str(r, 'MM/DD/YYYY') },
    { key: 'zIndex', attr: 'data-zIndex', read: (r) => clamp(r, 1, 2147483647, 999) },
]

export const SELECT_OPTIONS: OptionSpec[] = [
    { key: 'searchable', attr: 'data-searchable', read: (r) => boolAttr(r) },
]

export const SLIDER_OPTIONS: OptionSpec[] = [
    { key: 'min', attr: 'data-min', read: (r) => num(r, 0) },
    { key: 'max', attr: 'data-max', read: (r) => num(r, 100) },
    { key: 'default', attr: 'data-default', read: (r) => num(r, NaN) },
    { key: 'minDefault', attr: 'data-min-default', read: (r) => num(r, NaN) },
    { key: 'maxDefault', attr: 'data-max-default', read: (r) => num(r, NaN) },
]

export const PHONE_OPTIONS: OptionSpec[] = [
    { key: 'defaultCountry', attr: 'data-selected-country', read: (r) => strOrNull(r) },
    { key: 'countryCode', attr: 'data-country-code', read: (r) => strOrNull(r) },
]

export const COLOR_OPTIONS: OptionSpec[] = [
    { key: 'defaultColor', attr: 'data-default-color', read: (r) => strOrNull(r) },
]

/**
 * File upload is the one field that reads snake_case: 5.1.5 lowercases every
 * attribute name and replaces `-` with `_` before lookup, so the DOM attributes
 * are `data-max-files` etc. but the internal keys are `data_max_files`.
 */
export const FILE_OPTIONS: OptionSpec[] = [
    { key: 'maxFiles', attr: 'data-max-files', read: (r) => posIntOr(r, 1) },
    { key: 'maxFileSizeMb', attr: 'data-max-file-size', read: (r) => posIntOr(r, 5) },
    { key: 'acceptedFiles', attr: 'data-accepted-files', read: (r) => strOrNull(r) },
]

export const NPS_OPTIONS: OptionSpec[] = [
    { key: 'layout', attr: 'data-nps-layout', read: (r) => str(r, 'connected') },
    {
        key: 'extraFeedback',
        attr: 'data-extra-feedback-collection',
        read: (r) => str(r, 'never'),
    },
]

export const MESSAGE_OPTIONS: OptionSpec[] = [
    { key: 'empty', attr: 'data-empty-error-msg', read: (r) => strOrNull(r) },
    { key: 'invalid', attr: 'data-invalid-error-msg', read: (r) => strOrNull(r) },
]

export const OPTION_TABLES = {
    date: DATE_OPTIONS,
    daterange: DATE_OPTIONS,
    select: SELECT_OPTIONS,
    slider: SLIDER_OPTIONS,
    rangeslider: SLIDER_OPTIONS,
    phone: PHONE_OPTIONS,
    color: COLOR_OPTIONS,
    file: FILE_OPTIONS,
    nps: NPS_OPTIONS,
    likert: [] as OptionSpec[],
    userip: [] as OptionSpec[],
} as const

export function readOptions(el: Element, specs: OptionSpec[]): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    for (const spec of specs) {
        out[spec.key] = spec.read(el.getAttribute(spec.attr), el)
    }
    return out
}
