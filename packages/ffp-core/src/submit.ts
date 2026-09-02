/**
 * Form submission. Ported from runtime 5.1.5 with the wire format unchanged.
 *
 * Both posts still happen, in the same order, with the same bodies:
 *
 *   1. `https://webflow.com/api/v1/form/{siteId}`, url-encoded, always.
 *   2. `{dataClientUrl}/api/sites/handleFormSubmission`, JSON, only when the
 *      site is licensed. The backend enforces the licence too.
 *
 * Success is the backend's answer when licensed and Webflow's when not, because
 * an unlicensed staging site has no backend submission to succeed. Get that
 * inverted and a licensed customer sees a success screen for a lead that was
 * never recorded.
 *
 * SECURITY, pre-existing, do not build on it: `__FFP_SUBMISSION_SECRET__` is
 * substituted into a bundle that is served publicly from R2, so the HMAC below
 * is readable by anyone who opens the file and `X-FFP-Signature` is forgeable by
 * construction. It is carried here to keep byte-parity with 5.1.5, not because
 * it authenticates anything. The fix is server-side and is tracked separately.
 */
import { on, injectStyle, type Unbind } from './dom'
import { getFfpNativeForms } from './forms'
import { addValidationMessageNodes, VALIDATION_CSS, validateRequiredFields } from './validate'

export type SubmissionConfig = {
    dataClientUrl: string
    /** See the security note above. Empty means no signature headers at all. */
    submissionSecret?: string
    /** Gate for the backend post. Resolved per submission, cached by the caller. */
    isLicensed: (siteId: string | null) => Promise<boolean>
    /** True on `*.webflow.io`, where an unlicensed submission is expected. */
    isStaging: () => boolean
    root?: Document
}

export async function buildSubmissionHeaders(
    secret: string | undefined,
    siteId: string | null,
    formId: string | null,
): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    const subtle = window.crypto && window.crypto.subtle
    if (!secret || !subtle) return headers

    const timestamp = String(Date.now())
    const encoder = new TextEncoder()
    const key = await subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
        'sign',
    ])
    const signature = await subtle.sign('HMAC', key, encoder.encode(`${siteId}:${formId}:${timestamp}`))
    headers['X-FFP-Timestamp'] = timestamp
    headers['X-FFP-Signature'] = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    return headers
}

export function getFormMetaData(form: HTMLFormElement): Record<string, string> {
    return {
        name: form.getAttribute('data-name') || '',
        pageId: form.getAttribute('data-wf-page-id') || '',
        elementId: form.getAttribute('data-wf-element-id') || '',
        source: window.location.href,
        test: 'false',
        dolphin: 'false',
    }
}

const WEBFLOW_INPUTS =
    'input.w-input, textarea.w-input, select.w-select, input.w-checkbox, input.w-radio,' +
    'input.w-checkbox-input, input.w-radio-input,' +
    '.w-checkbox input[type="checkbox"], .w-radio input[type="radio"]'

function typeOf(el: Element): string {
    const own = (el as HTMLInputElement).type
    return String(own || el.getAttribute('type') || '').toLowerCase()
}

/**
 * Collect one input into the `fields[name]` shape Webflow's endpoint expects.
 *
 * Multi-checkbox joins with a comma; radios overwrite, so the checked one wins.
 * An unchecked box contributes nothing at all rather than an empty string -
 * Webflow's own form handler behaves the same way and the backend's exports
 * depend on it.
 */
function isCredentialInput(input: Element, name: string): boolean {
    const type = typeOf(input)
    const autocomplete = String(input.getAttribute('autocomplete') || '').toLowerCase()
    if (type === 'password') return true
    if (autocomplete === 'password' || autocomplete === 'current-password' || autocomplete === 'new-password') {
        return true
    }
    return /(^|[\[\]_.-])(password|passwd|secret)($|[\[\]_.-])/i.test(name)
}

function collect(data: Record<string, string>, input: Element, name: string): void {
    if (isCredentialInput(input, name)) return
    const type = typeOf(input)
    const value = (input as HTMLInputElement).value

    if (type === 'checkbox' || type === 'radio') {
        if (!(input as HTMLInputElement).checked) return
        const key = `fields[${name}]`
        if (type === 'checkbox' && data[key]) {
            data[key] = `${data[key]},${value || 'true'}`
        } else {
            data[key] = value || 'true'
        }
        return
    }

    data[`fields[${name}]`] = value == null ? '' : String(value)
}

export function getWebflowInputFieldsData(form: HTMLFormElement): Record<string, string> {
    const data: Record<string, string> = {}
    for (const input of Array.from(form.querySelectorAll(WEBFLOW_INPUTS))) {
        const name = input.getAttribute('data-name') || input.getAttribute('name')
        if (!name) continue
        collect(data, input, name)
    }

    const turnstile = form.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null
    if (turnstile) data['fields[cf-turnstile-response]'] = turnstile.value

    return data
}

export function getFormFieldsInputData(form: HTMLFormElement): Record<string, string> {
    const data: Record<string, string> = {}
    for (const input of Array.from(form.querySelectorAll('[form-fields-data-input]'))) {
        const name = input.getAttribute('name')
        if (!name) continue
        collect(data, input, name)
    }
    return data
}

/**
 * Let file fields finish encoding before the payload is read.
 *
 * The contract is the dropzone element carrying `_ffpAwaitUploads`. It is kept
 * exactly as 5.1.5 spelled it so the in-house dropzone in phase 3 is a drop-in:
 * the moment this stops being awaited, a form submits with an empty hidden input
 * and the customer loses the attachment with no error anywhere.
 */
export async function waitForPendingFileUploads(form: HTMLFormElement): Promise<void> {
    const zones = Array.from(form.querySelectorAll('.dropzone')) as Array<
        Element & { _ffpAwaitUploads?: () => Promise<void> }
    >
    if (!zones.length) return
    await Promise.all(
        zones.map((zone) =>
            typeof zone._ffpAwaitUploads === 'function' ? zone._ffpAwaitUploads() : Promise.resolve(),
        ),
    )
}

/** Swap the form for Webflow's own `.w-form-done` / `.w-form-fail` block. */
export function showFormResult(form: HTMLFormElement, success: boolean): void {
    form.style.display = 'none'
    const wrapper = form.closest('.w-form') || form.parentElement
    const selector = `.w-form-${success ? 'done' : 'fail'}`
    const byId = form.id ? document.getElementById(form.id) : null
    const el =
        (byId && byId.parentElement && byId.parentElement.querySelector(selector)) ||
        (wrapper && wrapper.querySelector ? wrapper.querySelector(selector) : null)
    if (el) (el as HTMLElement).style.display = 'block'
}

function findSubmitButton(form: HTMLFormElement): HTMLElement | null {
    return (form.querySelector('input[type="submit"]') ||
        form.querySelector('[fa-form-submit-button]') ||
        form.querySelector('button[type="submit"]')) as HTMLElement | null
}

function setButtonLabel(button: HTMLElement, label: string): void {
    if ('value' in button) (button as HTMLInputElement).value = label
    else button.textContent = label
}

export async function handleFormSubmit(form: HTMLFormElement, config: SubmissionConfig): Promise<void> {
    const submitButton = findSubmitButton(form)
    const originalLabel = submitButton
        ? (submitButton as HTMLInputElement).value || submitButton.textContent || 'Submit'
        : 'Submit'
    const loadingLabel = (submitButton && submitButton.getAttribute('data-wait')) || 'Please wait...'

    const unlockSubmit = () => {
        form.setAttribute('data-ffp-submitting', '0')
        if (submitButton) {
            submitButton.removeAttribute('disabled')
            setButtonLabel(submitButton, originalLabel)
        }
    }

    const faForm =
        form.closest('[fa-form="true"]') ||
        form.querySelector('[fa-form="true"]') ||
        (form.parentElement && form.parentElement.closest('[fa-form="true"]'))
    if (!faForm) {
        console.warn('Form Fields Pro: Submit ignored — form is not inside an [fa-form] wrapper')
        unlockSubmit()
        return
    }
    const formElementId = faForm.getAttribute('fa-form-id')
    const formName = faForm.getAttribute('fa-form-name')

    // Asserted again: the listener sets it synchronously, but the guard path and
    // a programmatic call both arrive here without having passed through it.
    form.setAttribute('data-ffp-submitting', '1')

    if (submitButton) {
        submitButton.setAttribute('disabled', 'true')
        setButtonLabel(submitButton, loadingLabel)
    }

    try {
        await waitForPendingFileUploads(form)

        const payload = new URLSearchParams({
            ...getFormMetaData(form),
            ...getWebflowInputFieldsData(form),
            ...getFormFieldsInputData(form),
        })

        const siteId = document.documentElement.getAttribute('data-wf-site')
        const submissionPayload = new URLSearchParams({
            ...getWebflowInputFieldsData(form),
            ...getFormFieldsInputData(form),
        })

        const parsed: Record<string, string> = {}
        submissionPayload.forEach((value, key) => {
            parsed[key.replace(/^fields\[(.*)\]$/, '$1')] = value
        })
        // The Turnstile token goes to Webflow but not to our backend, which
        // deletes it on arrival without verifying it. (Tracked separately: it
        // should be verified, not dropped.)
        delete parsed['cf-turnstile-response']

        let webflowSuccess = false
        let backendSuccess = false

        try {
            const response = await fetch(`https://webflow.com/api/v1/form/${siteId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*' },
                body: payload.toString(),
            })
            webflowSuccess = response.ok
        } catch (error) {
            console.warn('Webflow submission failed:', error)
        }

        const hasLicense = await config.isLicensed(siteId)

        if (hasLicense) {
            try {
                const response = await fetch(`${config.dataClientUrl}/api/sites/handleFormSubmission`, {
                    method: 'POST',
                    headers: await buildSubmissionHeaders(config.submissionSecret, siteId, formElementId),
                    body: JSON.stringify({
                        siteId,
                        formId: formElementId,
                        formName,
                        formData: parsed,
                        webflowPayload: payload.toString(),
                    }),
                })
                backendSuccess = response.ok
                // The notification email is queued by the backend as part of this
                // call. The browser used to make a second call for it, so the
                // visitor waited on it and a submission could be recorded with no
                // email sent when that second call was the one that failed.
            } catch (error) {
                console.warn('Backend submission failed:', error)
            }
        } else if (!config.isStaging()) {
            console.warn(
                'Form Fields Pro: No valid license on a Production domain — skipping backend & notification submission.',
            )
        }

        const success = hasLicense ? backendSuccess : webflowSuccess

        const redirectUrl = form.getAttribute('redirect')
        if (success && redirectUrl) {
            window.location.href = redirectUrl
            return
        }

        showFormResult(form, success)
    } catch (error) {
        console.error('Unexpected error during form submission:', error)
        showFormResult(form, false)
    } finally {
        unlockSubmit()
    }
}

/**
 * Bind submission on every form this app owns.
 *
 * `novalidate` goes on because the fields carry their own messages and the
 * browser's bubbles would fire first on a control we have visually replaced.
 */
export function installFormSubmission(config: SubmissionConfig): Unbind {
    const root = config.root || document
    injectStyle('ffp-validation-message', VALIDATION_CSS)

    const unbinds: Unbind[] = []
    for (const form of getFfpNativeForms(root)) {
        if (form.getAttribute('data-ffp-submit-bound') === '1') continue
        form.setAttribute('data-ffp-submit-bound', '1')
        form.setAttribute('novalidate', 'true')
        addValidationMessageNodes(form)

        unbinds.push(
            on(form, 'submit', (event) => {
                event.preventDefault()
                void submitForm(form, config)
            }),
        )
    }

    return () => {
        for (const unbind of unbinds) unbind()
    }
}

/**
 * Validate, then submit. The lock is taken synchronously, before the first
 * `await`, so a double-click cannot start two submissions - by the time the
 * first `await` yields, the second click has already been turned away.
 */
export async function submitForm(form: HTMLFormElement, config: SubmissionConfig): Promise<void> {
    if (form.getAttribute('data-ffp-submitting') === '1') return
    form.setAttribute('data-ffp-submitting', '1')
    try {
        // File encodes first: required validation reads the hidden inputs they
        // populate, so validating before them fails a form that has a file.
        await waitForPendingFileUploads(form)
        if (!validateRequiredFields(form)) {
            form.setAttribute('data-ffp-submitting', '0')
            return
        }
        await handleFormSubmit(form, config)
    } catch (error) {
        console.error('Form Fields Pro: Submit failed', error)
        form.setAttribute('data-ffp-submitting', '0')
    }
}
