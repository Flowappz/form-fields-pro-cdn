/**
 * Client-side validation, ported from runtime 5.1.5.
 *
 * Two changes from the original, both deliberate:
 *
 * 1. `setValidationMessage` writes `textContent`, not `innerHTML`. The message
 *    comes from `data-empty-error-msg` / `data-invalid-error-msg`, which is
 *    page-author content, so this is not an escalation for the author - but the
 *    attribute is also one of the things `fa-form-config` round-trips through
 *    the builder and the backend, and a validation message is never markup.
 * 2. The live `input` listeners are delegated at the document instead of bound
 *    per field. 5.1.5 bound them once at boot, so a field added afterwards -
 *    every multi-step page past the first, anything a customer script inserts -
 *    silently had no live validation.
 *
 * Everything else, including the order fields are checked in and the exact
 * default message strings, is unchanged. Those strings appear on live pages.
 */
import { delegate, type Unbind } from './dom'
import { dialCodeForIso, formatPhoneDisplay, isDialCodeOnlyPhoneValue, normalizePhoneToE164 } from './phone-value'

export const EMAIL_PATTERN_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const URL_PATTERN_REGEX =
    /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/
/** Plain text / Name: at least 2 Unicode letters (rejects "123", allows "Eve"). */
export const PLAIN_TEXT_MIN_LETTERS = 2

const WRAPPER = '[form-fields-wrapper="true"] '
const MESSAGE_CLASS = 'form-fields-data-validation-message'
const PHONE_SELECTOR = '[data-form-field-pro="number-input-with-country-code"] input[type="tel"]'

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

/** `.type` is a property on an upgraded element; the attribute is what the HTML carries. */
function typeOf(el: Element): string {
    const own = (el as HTMLInputElement).type
    if (own) return String(own).toLowerCase()
    return String(el.getAttribute('type') || '').toLowerCase()
}

function valueOf(el: Element): string {
    const value = (el as HTMLInputElement).value
    return value == null ? '' : String(value)
}

export function getParentFormFieldsWrapperDiv(element: Element | null): Element | null {
    const parent = element && element.parentElement
    if (!parent) return null
    return parent.hasAttribute('form-fields-wrapper') ? parent : getParentFormFieldsWrapperDiv(parent)
}

/**
 * True when the field is inside something conditional logic has hidden.
 *
 * A hidden required field must not block submission - that is the whole point of
 * conditional logic - and this is the only thing that connects the two systems.
 */
export function isFieldVisiblyHidden(el: Element): boolean {
    let node: Element | null = getParentFormFieldsWrapperDiv(el) || el
    while (node && node !== document.body) {
        const style = (node as HTMLElement).style
        if (style && style.display === 'none') return true
        node = node.parentElement
    }
    return false
}

export function setValidationMessage(field: Element, message: string): void {
    const wrapper = getParentFormFieldsWrapperDiv(field)
    const node = wrapper && wrapper.querySelector('.' + MESSAGE_CLASS)
    if (node) node.textContent = message || ''
}

/** Add the message slot to every wrapper that has not got one. */
export function addValidationMessageNodes(form: ParentNode): void {
    for (const wrapper of Array.from(form.querySelectorAll('[form-fields-wrapper="true"]'))) {
        if (wrapper.querySelector('.' + MESSAGE_CLASS)) continue
        const node = document.createElement('span')
        node.className = MESSAGE_CLASS
        wrapper.appendChild(node)
    }
}

export const VALIDATION_CSS = `.${MESSAGE_CLASS}{color:#FF2626;font-size:11px}`

export function validateFieldData(
    field: Element,
    value: string,
    pattern: RegExp,
    errorMessage: string,
): boolean {
    // An empty value is not an *invalid* value. Emptiness is the required
    // check's business, and running both would show two messages for one field.
    const ok = !(value.length > 0 && !pattern.test(value))
    setValidationMessage(field, ok ? '' : errorMessage)
    return ok
}

export function countPlainTextLetters(value: unknown): number {
    return (String(value == null ? '' : value).match(/\p{L}/gu) || []).length
}

export function isValidPlainTextValue(value: unknown): boolean {
    return countPlainTextLetters(value) >= PLAIN_TEXT_MIN_LETTERS
}

export function getEmptyErrorMessage(input: Element): string {
    return input.getAttribute('data-empty-error-msg') || 'This field is required'
}

export function validatePlainTextField(field: Element, value: unknown): boolean {
    const raw = String(value == null ? '' : value).trim()
    if (!raw) {
        setValidationMessage(field, '')
        return true
    }
    const message = field.getAttribute('data-invalid-error-msg') || 'Please enter a valid name'
    const ok = isValidPlainTextValue(raw)
    setValidationMessage(field, ok ? '' : message)
    return ok
}

/** The dial code the phone widget currently shows, or null. */
export function getSelectedDialCodeForPhoneInput(input: Element): string | null {
    const wrapper =
        (input.closest && input.closest('[data-form-field-pro="number-input-with-country-code"]')) ||
        getParentFormFieldsWrapperDiv(input)
    if (!wrapper) return null
    return dialCodeForIso(wrapper.getAttribute('data-selected-country'))
}

/**
 * Type-specific checks. `scoped` drops the wrapper prefix, for when the root
 * already *is* one field's wrapper (a multi-step page calling in per page).
 *
 * Returns on the first failure, so the visitor is shown one message at a time -
 * matching 5.1.5, and matching what the message slots can display.
 */
export function validateTypedFields(root: ParentNode = document, options: { scoped?: boolean } = {}): boolean {
    const prefix = options.scoped ? '' : WRAPPER

    for (const f of Array.from(root.querySelectorAll(prefix + 'input[type="url"]'))) {
        if (isFieldVisiblyHidden(f)) continue
        if (!validateFieldData(f, valueOf(f), URL_PATTERN_REGEX, 'Please enter a valid url')) return false
    }
    for (const f of Array.from(root.querySelectorAll(prefix + 'input[type="email"]'))) {
        if (isFieldVisiblyHidden(f)) continue
        const message = f.getAttribute('data-invalid-error-msg') || 'Please enter a valid email'
        if (!validateFieldData(f, valueOf(f), EMAIL_PATTERN_REGEX, message)) return false
    }
    for (const f of Array.from(
        root.querySelectorAll(prefix + 'input[data-plain-text="form-field-pro-plain-text"]'),
    )) {
        if (isFieldVisiblyHidden(f)) continue
        if (!validatePlainTextField(f, valueOf(f))) return false
    }
    for (const f of Array.from(
        root.querySelectorAll(
            prefix + PHONE_SELECTOR + ', ' + prefix + 'input.number-input-field[type="tel"]',
        ),
    )) {
        if (isFieldVisiblyHidden(f)) continue
        const raw = valueOf(f).trim()
        if (!raw || isDialCodeOnlyPhoneValue(raw)) continue
        const dial = getSelectedDialCodeForPhoneInput(f)
        const e164 = normalizePhoneToE164(raw, dial)
        if (!/^\+\d{8,}$/.test(e164)) {
            setValidationMessage(f, f.getAttribute('data-invalid-error-msg') || 'Invalid phone number')
            return false
        }
        // Write the normalised value back, so the payload carries E.164 rather
        // than whatever autofill produced. This is a mutation during validation
        // and it is intentional: it is the only point where both the raw value
        // and the selected country are in hand.
        const formatted = formatPhoneDisplay(e164, dial)
        if (formatted && formatted !== raw) (f as HTMLInputElement).value = formatted
    }
    return true
}

/**
 * Required-field check over a form, or over one multi-step page.
 *
 * Unlike `validateTypedFields` this does **not** stop at the first failure: every
 * empty required field gets its message, because the visitor should see all of
 * them at once rather than one per submit attempt.
 */
export function validateRequiredFields(root: ParentNode & Element): boolean {
    const scoped = root !== (document as unknown as Element) && root.tagName !== 'FORM'
    let ok = validateTypedFields(root, { scoped })

    const checkedRadioNames: Record<string, true> = {}
    for (const input of Array.from(
        root.querySelectorAll(WRAPPER + 'input[type="radio"]:checked, form input[type="radio"]:checked'),
    )) {
        const name = input.getAttribute('name')
        if (name) checkedRadioNames[name] = true
    }

    for (const input of Array.from(root.querySelectorAll(WRAPPER + '[required]'))) {
        if (isFieldVisiblyHidden(input)) continue
        const type = typeOf(input)

        // Radio groups: one checked option satisfies the whole group, as native
        // HTML does it. Checking each input separately would fail every unchecked
        // sibling of a correctly answered question.
        if (type === 'radio') {
            const name = input.getAttribute('name')
            if (name && checkedRadioNames[name]) {
                if (ok) setValidationMessage(input, '')
                continue
            }
            ok = false
            setValidationMessage(input, getEmptyErrorMessage(input))
            continue
        }

        const value = valueOf(input)
        // The file field stores a JSON array in a hidden input, so "empty" has
        // three spellings. Getting this wrong drops uploads silently.
        const emptyFile =
            type === 'file' || input.hasAttribute('form-fields-file-upload')
                ? !value || value === '[]' || value === 'null'
                : false

        const empty =
            emptyFile ||
            !value ||
            (type === 'tel' && isDialCodeOnlyPhoneValue(value)) ||
            (type === 'checkbox' && !(input as HTMLInputElement).checked)

        if (empty) {
            ok = false
            setValidationMessage(input, getEmptyErrorMessage(input))
        } else if (ok) {
            setValidationMessage(input, '')
        }
    }
    return ok
}

/**
 * Live validation as the visitor types. One delegated listener, not one per
 * field, so fields that appear later are covered.
 */
export function installValidationEvents(root: Document = document): Unbind {
    const unbinds: Unbind[] = [
        delegate(root, 'input', WRAPPER + 'input[type="url"]', (_event, field) => {
            validateFieldData(field, valueOf(field), URL_PATTERN_REGEX, 'Enter a valid URL')
        }),
        delegate(root, 'input', WRAPPER + 'input[type="email"]', (_event, field) => {
            const message = field.getAttribute('data-invalid-error-msg') || 'Enter a valid email'
            validateFieldData(field, valueOf(field), EMAIL_PATTERN_REGEX, message)
        }),
        delegate(
            root,
            'input',
            WRAPPER + 'input[data-plain-text="form-field-pro-plain-text"]',
            (_event, field) => validatePlainTextField(field, valueOf(field)),
        ),
    ]
    return () => {
        for (const unbind of unbinds) unbind()
    }
}

export type { Field }
