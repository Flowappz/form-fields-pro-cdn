import type { FieldType } from '@flowappz/ffp-config'

/**
 * The selector that identifies each field type on a published page.
 *
 * Lifted verbatim from the early-return guards in runtime 5.1.5 - these are the
 * markers the Designer Extension has written for years, so they are frozen. The
 * inconsistency (three attribute conventions and two class names) is historical
 * and must be preserved; new markers get added alongside, never instead.
 *
 * Core runs one scan over this map to decide which chunks to request, so the
 * selectors must stay cheap: attribute and class matches only, no `:has()`.
 */
export const FIELD_SELECTORS: Record<FieldType, string> = {
    date: '[form-fields-pro-date-picker]',
    daterange: '[form-fields-pro-date-range-picker]',
    slider: '[form-fields-pro-number-slider]',
    rangeslider: '[form-fields-pro-number-slider][allow-range]',
    select: '[form-fields-type="select"]',
    phone: '[data-form-field-pro="number-input-with-country-code"]',
    color: '.color-input',
    file: '.dropzone',
    nps: '[data-field-name="net-promoter-score"]',
    likert: '[data-field="likert-scale-field-radio"]',
    userip: '[form-fields-pro-user-ip-input], [form-fields-pro-user-ip-admin-alert]',
}

/**
 * Range variants share a chunk with their base type: a range slider is the same
 * widget with two handles, and shipping them separately would double-load the
 * drag core for a form that has both.
 */
export const CHUNK_FOR_TYPE: Record<FieldType, string> = {
    date: 'date',
    daterange: 'date',
    slider: 'slider',
    rangeslider: 'slider',
    select: 'select',
    phone: 'phone',
    color: 'color',
    file: 'file',
    nps: 'nps',
    likert: 'nps',
    userip: 'userip',
}

export const FIELD_TYPES = Object.keys(FIELD_SELECTORS) as FieldType[]

/**
 * Which field types are present in a subtree.
 *
 * `rangeslider` is deliberately not reported separately: its selector is a
 * subset of `slider`, and the chunk decides which variant to mount from the
 * element's own attributes.
 */
export function detectTypes(root: ParentNode = document): FieldType[] {
    const found: FieldType[] = []
    for (const type of FIELD_TYPES) {
        if (type === 'rangeslider') continue
        if (root.querySelector(FIELD_SELECTORS[type])) found.push(type)
    }
    return found
}
