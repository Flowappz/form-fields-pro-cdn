import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    buildSubmissionHeaders,
    getFormMetaData,
    getFormFieldsInputData,
    getWebflowInputFieldsData,
    handleFormSubmit,
    installFormSubmission,
    showFormResult,
    submitForm,
    waitForPendingFileUploads,
    type SubmissionConfig,
} from '../src/submit'
import { resetDom } from './setup'

type Call = { url: string; init: RequestInit }

let calls: Call[] = []
let webflowOk = true
let backendOk = true

function stubFetch(): void {
    calls = []
    vi.stubGlobal(
        'fetch',
        vi.fn((url: string, init: RequestInit) => {
            calls.push({ url, init })
            const ok = url.indexOf('webflow.com') !== -1 ? webflowOk : backendOk
            return Promise.resolve({ ok } as Response)
        }),
    )
}

function config(over: Partial<SubmissionConfig> = {}): SubmissionConfig {
    return {
        dataClientUrl: 'https://data.test',
        submissionSecret: '',
        isLicensed: () => Promise.resolve(true),
        isStaging: () => false,
        ...over,
    }
}

const wrap = (inner: string) => `<div form-fields-wrapper="true">${inner}</div>`

function page(inner: string, attrs = ''): HTMLFormElement {
    resetDom(`<body><div class="w-form">
        <div fa-form="true" fa-form-id="form_1" fa-form-name="Contact" ${attrs}>
            <form name="ours" data-name="Contact" data-wf-page-id="p1" data-wf-element-id="e1">
                ${inner}
                <input type="submit" value="Send" data-wait="Sending...">
            </form>
        </div>
        <div class="w-form-done"></div>
        <div class="w-form-fail"></div>
    </div></body>`)
    const w = globalThis.window as unknown as { location?: { href: string } }
    if (!w.location) w.location = { href: 'https://site.test/contact' }
    for (const input of Array.from(document.querySelectorAll('[checked]'))) {
        // linkedom does not reflect the `checked` attribute into the property.
        ;(input as HTMLInputElement).checked = true
    }
    return document.querySelector('form') as HTMLFormElement
}

function submitEvent(form: Element): void {
    const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
    form.dispatchEvent(new w.window.Event('submit', { bubbles: true, cancelable: true }))
}

const body = (call: Call) => String(call.init.body)
const webflowCall = () => calls.filter((c) => c.url.indexOf('webflow.com') !== -1)[0]
const backendCall = () => calls.filter((c) => c.url.indexOf('data.test') !== -1)[0]

beforeEach(() => {
    webflowOk = true
    backendOk = true
    stubFetch()
})

afterEach(() => vi.unstubAllGlobals())

describe('payload collection', () => {
    it('names Webflow inputs as fields[name] and prefers data-name', () => {
        const form = page(
            '<input class="w-input" name="field-1" data-name="Full Name" value="Ada">' +
                '<textarea class="w-input" name="msg">hi</textarea>' +
                '<select class="w-select" name="topic"><option value="sales" selected>Sales</option></select>',
        )
        const data = getWebflowInputFieldsData(form)
        expect(data['fields[Full Name]']).toBe('Ada')
        expect(data['fields[msg]']).toBe('hi')
        expect(data['fields[topic]']).toBe('sales')
    })

    it('joins checked boxes, skips unchecked, and lets a radio overwrite', () => {
        const form = page(
            '<div class="w-checkbox"><input type="checkbox" name="c" value="one" checked></div>' +
                '<div class="w-checkbox"><input type="checkbox" name="c" value="two" checked></div>' +
                '<div class="w-checkbox"><input type="checkbox" name="c" value="three"></div>' +
                '<div class="w-radio"><input type="radio" name="r" value="yes" checked></div>',
        )
        const data = getWebflowInputFieldsData(form)
        expect(data['fields[c]']).toBe('one,two')
        expect(data['fields[r]']).toBe('yes')
    })

    it('gives a checked box with no value the string true', () => {
        const form = page('<div class="w-checkbox"><input type="checkbox" name="agree" checked></div>')
        expect(getWebflowInputFieldsData(form)['fields[agree]']).toBe('true')
    })

    it('collects our own fields from form-fields-data-input', () => {
        const form = page('<input form-fields-data-input name="Date" value="2026-08-26">')
        expect(getFormFieldsInputData(form)['fields[Date]']).toBe('2026-08-26')
    })

    it('carries the Webflow form metadata', () => {
        const form = page('')
        const meta = getFormMetaData(form)
        expect(meta.name).toBe('Contact')
        expect(meta.pageId).toBe('p1')
        expect(meta.elementId).toBe('e1')
        expect(meta.test).toBe('false')
    })
})

describe('handleFormSubmit', () => {
    it('posts the same body to Webflow that 5.1.5 did', async () => {
        const form = page('<input class="w-input" name="Email" value="a@b.com">')
        await handleFormSubmit(form, config())

        const sent = new URLSearchParams(body(webflowCall()))
        expect(webflowCall().url).toBe('https://webflow.com/api/v1/form/site_123')
        expect(sent.get('fields[Email]')).toBe('a@b.com')
        expect(sent.get('name')).toBe('Contact')
        expect(sent.get('pageId')).toBe('p1')
        expect(webflowCall().init.method).toBe('POST')
    })

    it('sends the backend un-prefixed keys and keeps the raw Webflow payload', async () => {
        const form = page('<input class="w-input" name="Email" value="a@b.com">')
        await handleFormSubmit(form, config())

        const sent = JSON.parse(body(backendCall()))
        expect(backendCall().url).toBe('https://data.test/api/sites/handleFormSubmission')
        expect(sent.siteId).toBe('site_123')
        expect(sent.formId).toBe('form_1')
        expect(sent.formName).toBe('Contact')
        expect(sent.formData).toEqual({ Email: 'a@b.com' })
        expect(sent.webflowPayload).toContain('fields%5BEmail%5D=a%40b.com')
    })

    it('forwards the Turnstile token to Webflow but not to the backend', async () => {
        // The backend deletes it on arrival without verifying it, which is its
        // own ticket. Sending it anyway would only widen that.
        const form = page('<input name="cf-turnstile-response" value="tok_123">')
        await handleFormSubmit(form, config())

        expect(body(webflowCall())).toContain('cf-turnstile-response')
        expect(JSON.parse(body(backendCall())).formData['cf-turnstile-response']).toBeUndefined()
    })

    it('skips the backend entirely without a licence', async () => {
        const form = page('')
        await handleFormSubmit(form, config({ isLicensed: () => Promise.resolve(false), isStaging: () => true }))
        expect(backendCall()).toBeUndefined()
        expect(webflowCall()).toBeDefined()
    })

    it('succeeds on the backend answer when licensed, not on Webflow alone', async () => {
        // Getting this inverted shows a licensed customer a success screen for a
        // lead that was never recorded.
        backendOk = false
        const form = page('')
        await handleFormSubmit(form, config())
        expect((document.querySelector('.w-form-fail') as HTMLElement).style.display).toBe('block')
        expect((document.querySelector('.w-form-done') as HTMLElement).style.display).toBe('')
    })

    it('succeeds on the Webflow answer when unlicensed on staging', async () => {
        backendOk = false
        const form = page('')
        await handleFormSubmit(form, config({ isLicensed: () => Promise.resolve(false), isStaging: () => true }))
        expect((document.querySelector('.w-form-done') as HTMLElement).style.display).toBe('block')
    })

    it('still reports failure when Webflow is unreachable', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const form = page('')
        await handleFormSubmit(form, config({ isLicensed: () => Promise.resolve(false), isStaging: () => true }))
        expect((document.querySelector('.w-form-fail') as HTMLElement).style.display).toBe('block')
        warn.mockRestore()
    })

    it('shows the loading label while in flight and restores it after', async () => {
        const form = page('')
        const button = form.querySelector('input[type="submit"]') as HTMLInputElement
        let labelDuringFlight = ''
        vi.stubGlobal(
            'fetch',
            vi.fn(() => {
                labelDuringFlight = button.value
                return Promise.resolve({ ok: true } as Response)
            }),
        )

        await handleFormSubmit(form, config())
        expect(labelDuringFlight).toBe('Sending...')
        expect(button.value).toBe('Send')
        expect(button.getAttribute('disabled')).toBeNull()
    })

    it('does nothing outside an [fa-form] wrapper', async () => {
        resetDom('<body><form name="theirs"></form></body>')
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        await handleFormSubmit(document.querySelector('form') as HTMLFormElement, config())
        expect(calls.length).toBe(0)
        warn.mockRestore()
    })
})

describe('submitForm', () => {
    it('will not start a second submission while one is running', async () => {
        const form = page('')
        const first = submitForm(form, config())
        const second = submitForm(form, config())
        await Promise.all([first, second])
        expect(calls.filter((c) => c.url.indexOf('webflow.com') !== -1).length).toBe(1)
    })

    it('validates before posting anything', async () => {
        const form = page(wrap('<input name="a" required>'))
        await submitForm(form, config())
        expect(calls.length).toBe(0)
        // And the lock is released, or the visitor could never retry.
        expect(form.getAttribute('data-ffp-submitting')).toBe('0')
    })

    it('waits for file encoding before it reads the values', async () => {
        // Validation reads the hidden input the dropzone populates. Reversing
        // this order fails a form that has a file on it.
        const form = page(wrap('<input name="f" form-fields-file-upload required value="[]">'))
        const zone = document.createElement('div')
        zone.className = 'dropzone'
        let resolved = false
        ;(zone as HTMLElement & { _ffpAwaitUploads?: () => Promise<void> })._ffpAwaitUploads = () =>
            new Promise<void>((resolve) =>
                setTimeout(() => {
                    ;(form.querySelector('[name="f"]') as HTMLInputElement).value = '[{"n":1}]'
                    resolved = true
                    resolve()
                }, 0),
            )
        form.appendChild(zone)

        await submitForm(form, config())
        expect(resolved).toBe(true)
        expect(calls.length).toBeGreaterThan(0)
    })
})

describe('installFormSubmission', () => {
    it('takes over submit on the forms this app owns', async () => {
        const form = page('<input class="w-input" name="Email" value="a@b.com">')
        installFormSubmission(config({ root: document }))
        submitEvent(form)
        await new Promise((resolve) => setTimeout(resolve, 5))
        expect(webflowCall()).toBeDefined()
        expect(form.getAttribute('novalidate')).toBe('true')
    })

    it('binds each form once however many times it runs', async () => {
        const form = page('')
        installFormSubmission(config({ root: document }))
        installFormSubmission(config({ root: document }))
        submitEvent(form)
        await new Promise((resolve) => setTimeout(resolve, 5))
        expect(calls.filter((c) => c.url.indexOf('webflow.com') !== -1).length).toBe(1)
    })

    it('adds the message slots the validators write into', () => {
        const form = page(wrap('<input name="a" required>'))
        installFormSubmission(config({ root: document }))
        expect(form.querySelectorAll('.form-fields-data-validation-message').length).toBe(1)
    })
})

describe('buildSubmissionHeaders', () => {
    it('sends no signature without a secret', async () => {
        const headers = await buildSubmissionHeaders('', 'site_123', 'form_1')
        expect(headers['X-FFP-Signature']).toBeUndefined()
        expect(headers['Content-Type']).toBe('application/json')
    })

    it('signs siteId:formId:timestamp when a secret is present', async () => {
        // The secret is public by construction - it is substituted into a bundle
        // served from R2 - so this asserts wire parity with 5.1.5, not security.
        // linkedom's window exposes `crypto` as a getter, so redefine it.
        Object.defineProperty(globalThis.window, 'crypto', {
            // Node's own WebCrypto, which is the same API a browser gives us.
            value: (globalThis as unknown as { crypto: Crypto }).crypto,
            configurable: true,
        })
        const headers = await buildSubmissionHeaders('shh', 'site_123', 'form_1')
        expect(headers['X-FFP-Signature']).toMatch(/^[0-9a-f]{64}$/)
        expect(Number(headers['X-FFP-Timestamp'])).toBeGreaterThan(0)
    })
})

describe('waitForPendingFileUploads', () => {
    it('resolves immediately with no dropzone', async () => {
        await expect(waitForPendingFileUploads(page(''))).resolves.toBeUndefined()
    })
})

describe('showFormResult', () => {
    it('hides the form and reveals the Webflow result block', () => {
        const form = page('')
        showFormResult(form, true)
        expect(form.style.display).toBe('none')
        expect((document.querySelector('.w-form-done') as HTMLElement).style.display).toBe('block')
    })
})
