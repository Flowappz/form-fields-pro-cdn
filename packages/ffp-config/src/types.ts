/**
 * Config schema v2.
 *
 * One normalized shape, produced by `readFieldConfig` regardless of which of the
 * five legacy attribute representations a published page happens to carry. The
 * Designer Extension writes it; the runtime reads it. Both import this package so
 * writer and reader cannot drift.
 */

export const CONFIG_VERSION = 2 as const

export type FieldType =
    | 'date'
    | 'daterange'
    | 'select'
    | 'slider'
    | 'rangeslider'
    | 'phone'
    | 'color'
    | 'file'
    | 'nps'
    | 'likert'
    /** Not authored like the others: it fills a hidden input with the visitor's IP. */
    | 'userip'

export type CompareLogic =
    | 'HAS_ANY_VALUE'
    | 'HAS_NO_VALUE'
    | 'CONTAINS'
    | 'IS_EQUAL'
    | 'NOT_EQUAL'
    | 'IS_GREATER_THAN'
    | 'IS_LESS_THAN'

export type ConditionalRule = {
    inputName: string
    compareLogic: CompareLogic
    compareValue: string
}

/** Outer array is OR'd, inner array is AND'd. Matches the legacy wire format exactly. */
export type ConditionalRuleset = ConditionalRule[][]

export type FieldMessages = {
    empty?: string
    invalid?: string
}

export type ThemeTokens = Record<string, string>

export type FfpFieldConfigV2<O = Record<string, unknown>> = {
    v: typeof CONFIG_VERSION
    type: FieldType
    name: string
    required: boolean
    messages: FieldMessages
    options: O
    theme: ThemeTokens
    conditional?: ConditionalRuleset
}

export type DateOptions = {
    range: boolean
    months: number
    columns: number
    firstDay: number
    language: string
    format: string
    zIndex: number | null
}

export type SelectOptions = {
    searchable: boolean
}

export type SliderOptions = {
    range: boolean
    min: number
    max: number
    default: number
    minDefault: number
    maxDefault: number
}

export type PhoneOptions = {
    defaultCountry: string | null
}

export type ColorOptions = {
    defaultColor: string | null
}

export type FileOptions = {
    maxFiles: number
    maxFileSizeMb: number
    acceptedFiles: string | null
}

export type NpsOptions = {
    layout: 'connected' | 'separated'
    extraFeedback: string
}
