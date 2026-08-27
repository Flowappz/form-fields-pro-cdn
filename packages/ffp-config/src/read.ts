import { attrFrom, attrReader } from './dom'
import { THEME_FAMILY } from './legacy/attrs'
import { resolveTheme } from './legacy/resolve-theme'
import { readConditional, readFaFormField } from './legacy/wrapper'
import { MESSAGE_OPTIONS, OPTION_TABLES, readOptions } from './options/tables'
import { CONFIG_VERSION, type FfpFieldConfigV2, type FieldType, type ThemeTokens } from './types'

/** Rung 1: a v2 config already on the element, written by a current Designer. */
function readV2(el: Element, type: FieldType): FfpFieldConfigV2 | null {
    const raw = attrFrom(el, 'data-ffp')
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        if (!parsed || parsed.v !== CONFIG_VERSION) return null
        return {
            ...parsed,
            // Never trust the blob's own type over the caller's: the caller knows
            // which selector matched, the blob could be stale after a retype.
            type,
            options: parsed.options || {},
            theme: parsed.theme || {},
            messages: parsed.messages || {},
        } as FfpFieldConfigV2
    } catch {
        return null
    }
}

function readName(el: Element): string {
    const attr = attrReader(el)
    return attr('name') || attr('data-name') || attr('data-field-name') || ''
}

function readRequired(el: Element): boolean {
    if (el.hasAttribute('required')) return true
    // The file field moves `required` off the native input onto its hidden twin,
    // so also honour the explicit attribute the Designer writes.
    const explicit = attrFrom(el, 'data-required')
    return explicit !== null && String(explicit).trim().toLowerCase() !== 'false'
}

function readMessages(el: Element): FfpFieldConfigV2['messages'] {
    const out: FfpFieldConfigV2['messages'] = {}
    for (const spec of MESSAGE_OPTIONS) {
        const value = spec.read(attrFrom(el, spec.attr), el)
        if (value) out[spec.key as 'empty' | 'invalid'] = String(value)
    }
    return out
}

/**
 * Normalize one field element into config v2, whichever legacy representation
 * the published page happens to carry.
 *
 * Ladder, highest priority first:
 *   1. `data-ffp` with `v === 2`
 *   2. the compact `data-{date,slider,nps}-theme` blob (tilde or JSON)
 *   3. individual `data-{light,dark}-theme-*` attributes
 *   4. `JSON.parse(data-field-config).style` on the nearest wrapper
 *   5. the matching field inside `fa-form-config` on the enclosing `[fa-form]`
 *   6. hardcoded per-type defaults
 *
 * Rungs 2-6 are compatibility only, but they are permanent: customer HTML in the
 * wild cannot be rewritten, so this reader outlives every writer.
 */
export function readFieldConfig(el: Element, type: FieldType): FfpFieldConfigV2 {
    const v2 = readV2(el, type)
    if (v2) return v2

    const name = readName(el)
    const faField = name ? readFaFormField(el, name) : null
    const faGeneral = (faField && faField.general) || {}
    const faStyle: ThemeTokens = (faField && faField.style) || {}

    const options = readOptions(el, OPTION_TABLES[type] as never)
    // `fa-form-config` fills only what the attributes did not carry - it is the
    // most complete source but also the most likely to be stale, since it is
    // written once per form generation rather than per field edit.
    for (const key of Object.keys(faGeneral)) {
        if (options[key] === undefined || options[key] === null) options[key] = faGeneral[key]
    }

    const family = THEME_FAMILY[type]

    return {
        v: CONFIG_VERSION,
        type,
        name,
        required: readRequired(el),
        messages: readMessages(el),
        options,
        theme: family ? resolveTheme(el, family, faStyle) : {},
        conditional: readConditional(el),
    }
}
