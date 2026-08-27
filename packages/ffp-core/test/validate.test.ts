import { describe, expect, it, vi } from 'vitest'
import {
    addValidationMessageNodes,
    getEmptyErrorMessage,
    countPlainTextLetters,
    installValidationEvents,
    isFieldVisiblyHidden,
    setValidationMessage,
    validateFieldData,
    validatePlainTextField,
    validateRequiredFields,
    validateTypedFields,
    EMAIL_PATTERN_REGEX,
    URL_PATTERN_REGEX,
} from '../src/validate'
import { registerDialCodes, resetDialCodes } from '../src/phone-value'
import { resetDom } from './setup'

function page(inner: string): HTMLFormElement {
    resetDom(`<body><div fa-form="true"><form name="ours">${inner}</form></div></body>`)
    const form = document.querySelector('form') as HTMLFormElement
    for (const input of Array.from(form.querySelectorAll('[checked]'))) {
        // linkedom does not reflect the `checked` attribute into the property.
        ;(input as HTMLInputElement).checked = true
    }
    addValidationMessageNodes(form)
    return form
}

const wrap = (inner: string) => `<div form-fields-wrapper="true">${inner}</div>`

const messages = () =>
    Array.from(document.querySelectorAll('.form-fields-data-validation-message'))
        .map((n) => n.textContent)
        .filter(Boolean)

function fire(el: Element, type: string): void {
    const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
    el.dispatchEvent(new w.window.Event(type, { bubbles: true }))
}

describe('message nodes', () => {
    it('adds one slot per wrapper and never a second', () => {
        const form = page(wrap('<input name="a">') + wrap('<input name="b">'))
        addValidationMessageNodes(form)
        expect(form.querySelectorAll('.form-fields-data-validation-message').length).toBe(2)
    })

    it('writes messages as text, not markup', () => {
        // The message comes from a page attribute that the builder round-trips
        // through the backend. A validation message is never markup.
        const form = page(wrap('<input name="a" data-empty-error-msg="<img src=x>">'))
        const input = form.querySelector('input') as HTMLInputElement
        setValidationMessage(input, '<b>bad</b>')
        const node = form.querySelector('.form-fields-data-validation-message') as HTMLElement
        expect(node.textContent).toBe('<b>bad</b>')
        expect(node.querySelector('b')).toBeNull()
    })
})

describe('validateRequiredFields', () => {
    it('reports every empty required field at once', () => {
        const form = page(
            wrap('<input name="a" required>') +
                wrap('<input name="b" required data-empty-error-msg="Need b">'),
        )
        expect(validateRequiredFields(form)).toBe(false)
        expect(messages()).toEqual(['This field is required', 'Need b'])
    })

    it('clears the message once the field is filled', () => {
        const form = page(wrap('<input name="a" required>'))
        const input = form.querySelector('input') as HTMLInputElement
        expect(validateRequiredFields(form)).toBe(false)
        input.value = 'x'
        expect(validateRequiredFields(form)).toBe(true)
        expect(messages()).toEqual([])
    })

    it('skips a field conditional logic has hidden', () => {
        // The only link between the two systems. Without it, a hidden required
        // field blocks a submission the visitor cannot unblock.
        const form = page(wrap('<input name="a" required>'))
        const wrapper = form.querySelector('[form-fields-wrapper]') as HTMLElement
        wrapper.style.display = 'none'
        expect(isFieldVisiblyHidden(form.querySelector('input') as Element)).toBe(true)
        expect(validateRequiredFields(form)).toBe(true)
    })

    it('accepts a radio group where any one option is checked', () => {
        const form = page(
            wrap('<input type="radio" name="r" value="1" required>') +
                wrap('<input type="radio" name="r" value="2" required checked>'),
        )
        expect(validateRequiredFields(form)).toBe(true)
    })

    it('fails a radio group with nothing checked', () => {
        const form = page(wrap('<input type="radio" name="r" value="1" required>'))
        expect(validateRequiredFields(form)).toBe(false)
    })

    it('treats an unchecked required checkbox as empty', () => {
        const form = page(wrap('<input type="checkbox" name="c" value="yes" required>'))
        expect(validateRequiredFields(form)).toBe(false)
        const checked = page(wrap('<input type="checkbox" name="c" value="yes" required checked>'))
        expect(validateRequiredFields(checked)).toBe(true)
    })

    it('knows all three spellings of an empty file field', () => {
        // The file field writes a JSON array into a hidden input. `[]` and
        // `null` are both what "no file" looks like there, and reading either as
        // filled is how an upload gets silently dropped.
        for (const value of ['', '[]', 'null']) {
            const form = page(wrap(`<input name="f" form-fields-file-upload required value="${value}">`))
            expect(validateRequiredFields(form)).toBe(false)
        }
        const ok = page(wrap('<input name="f" form-fields-file-upload required value=\'[{"n":1}]\'>'))
        expect(validateRequiredFields(ok)).toBe(true)
    })

    it('treats a phone showing only its dial code as empty', () => {
        resetDialCodes()
        registerDialCodes({ BD: 880 })
        const form = page(wrap('<input type="tel" name="p" required value="+880 ">'))
        expect(validateRequiredFields(form)).toBe(false)
    })
})

describe('validateTypedFields', () => {
    it('rejects a bad email and keeps the custom message', () => {
        const form = page(wrap('<input type="email" name="e" data-invalid-error-msg="Nope" value="a@b">'))
        expect(validateTypedFields(form)).toBe(false)
        expect(messages()).toEqual(['Nope'])
    })

    it('leaves an empty optional field alone', () => {
        // Emptiness is the required check's business. Running both would show
        // two messages for one field.
        const form = page(wrap('<input type="email" name="e" value="">'))
        expect(validateTypedFields(form)).toBe(true)
        expect(messages()).toEqual([])
    })

    it('accepts a bare hostname as a url', () => {
        expect(URL_PATTERN_REGEX.test('example.com')).toBe(true)
        expect(URL_PATTERN_REGEX.test('https://example.com/a?b=1')).toBe(true)
        expect(URL_PATTERN_REGEX.test('not a url')).toBe(false)
    })

    it('matches the email pattern 5.1.5 shipped', () => {
        expect(EMAIL_PATTERN_REGEX.test('a.b+c@example.co.uk')).toBe(true)
        expect(EMAIL_PATTERN_REGEX.test('a@b')).toBe(false)
    })

    it('needs two letters in a plain-text field', () => {
        expect(countPlainTextLetters('123')).toBe(0)
        expect(countPlainTextLetters('Jo')).toBe(2)
        const form = page(wrap('<input data-plain-text="form-field-pro-plain-text" name="n" value="123">'))
        expect(validateTypedFields(form)).toBe(false)
        expect(messages()).toEqual(['Please enter a valid name'])
    })

    it('accepts non-Latin letters', () => {
        expect(countPlainTextLetters('আমি')).toBeGreaterThanOrEqual(2)
        const field = document.createElement('input')
        expect(validatePlainTextField(field, 'Ünal')).toBe(true)
    })

    it('normalises a phone value back into the input', () => {
        resetDialCodes()
        registerDialCodes({ GB: 44 })
        const form = page(
            wrap(
                '<div data-form-field-pro="number-input-with-country-code" data-selected-country="GB">' +
                    '<input type="tel" name="p" value="07700 900123"></div>',
            ),
        )
        expect(validateTypedFields(form)).toBe(true)
        // E.164 in the payload, not whatever autofill produced.
        expect((form.querySelector('input') as HTMLInputElement).value).toBe('+44 7700900123')
    })

    it('rejects a phone number that is too short to be real', () => {
        resetDialCodes()
        registerDialCodes({ GB: 44 })
        const form = page(
            wrap(
                '<div data-form-field-pro="number-input-with-country-code" data-selected-country="GB">' +
                    '<input type="tel" name="p" value="12"></div>',
            ),
        )
        expect(validateTypedFields(form)).toBe(false)
        expect(messages()).toEqual(['Invalid phone number'])
    })
})

describe('installValidationEvents', () => {
    it('validates a field that was added after boot', () => {
        // 5.1.5 bound one listener per field at boot, so every multi-step page
        // past the first had no live validation at all.
        const form = page('')
        const unbind = installValidationEvents(document)

        form.innerHTML = wrap('<input type="email" name="e">')
        addValidationMessageNodes(form)
        const input = form.querySelector('input') as HTMLInputElement
        input.value = 'nope'
        fire(input, 'input')

        expect(messages()).toEqual(['Enter a valid email'])
        unbind()
    })

    it('unbinds', () => {
        const form = page(wrap('<input type="email" name="e">'))
        const unbind = installValidationEvents(document)
        unbind()
        const input = form.querySelector('input') as HTMLInputElement
        input.value = 'nope'
        fire(input, 'input')
        expect(messages()).toEqual([])
    })
})

describe('getEmptyErrorMessage', () => {
    it('falls back to the string live pages already show', () => {
        const el = document.createElement('input')
        expect(getEmptyErrorMessage(el)).toBe('This field is required')
    })
})

describe('validateFieldData', () => {
    it('returns true and clears when the value matches', () => {
        const spy = vi.fn()
        const el = document.createElement('input')
        el.addEventListener('input', spy)
        expect(validateFieldData(el, 'a@b.com', EMAIL_PATTERN_REGEX, 'bad')).toBe(true)
    })
})
