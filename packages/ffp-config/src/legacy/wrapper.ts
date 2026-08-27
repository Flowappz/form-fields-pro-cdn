import type { ConditionalRuleset, ThemeTokens } from '../types'

/**
 * Rung 4: the per-field JSON blob on the nearest FFP wrapper.
 *
 * Collapses the four duplicated implementations in runtime 5.1.5 - the verbatim
 * `styleFromConfig` copies for date (L245) and slider (L860), the jQuery variant
 * `npsStyleFromConfig` (L1572), and the inline parse in the color picker (L1300).
 */
export function readWrapperStyle(element: Element): ThemeTokens {
    try {
        const wrapper = element.closest('[data-field-config], [form-fields-wrapper]')
        if (!wrapper) return {}
        const raw =
            wrapper.getAttribute('data-field-config') || wrapper.getAttribute('field-config')
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        return (parsed && parsed.style) || {}
    } catch {
        return {}
    }
}

export type FaFormField = {
    id?: string
    name?: string
    type?: string
    general?: Record<string, unknown>
    style?: ThemeTokens
    conditionalLogic?: unknown
}

/**
 * Rung 5: the whole form definition, written onto the `[fa-form]` wrapper by the
 * Designer Extension (`generateForm.ts:104`) and read back by it on open.
 *
 * Nothing in the runtime has ever read this, which is why it is the richest and
 * least-degraded source available: it survives when per-field attributes were
 * truncated by Webflow's attribute limits or edited by hand.
 */
export function readFaFormField(element: Element, fieldName: string): FaFormField | null {
    try {
        const form = element.closest('[fa-form]')
        if (!form) return null
        const raw = form.getAttribute('fa-form-config')
        if (!raw) return null
        const parsed = JSON.parse(raw)
        const pages = (parsed && parsed.pages) || []
        for (const page of pages) {
            for (const field of page.fields || []) {
                const candidate = (field.general && field.general.fieldName) || field.name
                if (candidate && String(candidate) === fieldName) return field as FaFormField
            }
        }
        return null
    } catch {
        return null
    }
}

/**
 * Conditional logic ships as a JSON array-of-arrays: outer OR, inner AND.
 * Absent or malformed means "no rules", never "block the field".
 */
export function readConditional(element: Element): ConditionalRuleset | undefined {
    const raw = element.getAttribute('conditional-logic')
    if (!raw) return undefined
    try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) && parsed.length ? (parsed as ConditionalRuleset) : undefined
    } catch {
        return undefined
    }
}
