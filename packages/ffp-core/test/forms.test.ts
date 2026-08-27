import { describe, expect, it, vi } from 'vitest'
import { getFfpNativeForms, installSubmitGuard, isFfpNativeForm, submitGuardAttribute } from '../src/forms'
import { resetDom } from './setup'

function submit(form: Element): Event {
    const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
    const event = new w.window.Event('submit', { bubbles: true, cancelable: true })
    form.dispatchEvent(event)
    return event
}

const names = (forms: HTMLFormElement[]) => forms.map((f) => f.getAttribute('name'))

describe('getFfpNativeForms', () => {
    it('takes the shell itself when the shell is the form', () => {
        resetDom(`<body><form fa-form="true" name="a"></form></body>`)
        expect(names(getFfpNativeForms(document))).toEqual(['a'])
    })

    it('prefers a direct child form over a deeper one', () => {
        resetDom(`<body><div fa-form="true">
            <form name="direct"><div><form name="deeper"></form></div></form>
        </div></body>`)
        // Only the direct child: `querySelectorAll('form')` on the shell would
        // also pull the nested one in, and a page that nests forms is already
        // malformed - we should not multiply the damage.
        expect(names(getFfpNativeForms(document))).toEqual(['direct'])
    })

    it('falls back to a nested form when there is no direct child', () => {
        resetDom(`<body><div fa-webflow-form><div><form name="nested"></form></div></div></body>`)
        expect(names(getFfpNativeForms(document))).toEqual(['nested'])
    })

    it('falls back to the enclosing form when the shell has none inside', () => {
        resetDom(`<body><form name="outer"><div fa-form="true"></div></form></body>`)
        expect(names(getFfpNativeForms(document))).toEqual(['outer'])
    })

    it('never picks up a sibling form we do not own', () => {
        // The reason each rung is scoped. A `parent.querySelector('form')` here
        // would hijack the site search box.
        resetDom(`<body><div>
            <form name="search"></form>
            <div fa-form="true"><form name="ours"></form></div>
        </div></body>`)
        expect(names(getFfpNativeForms(document))).toEqual(['ours'])
    })

    it('deduplicates a form reachable through two shells', () => {
        resetDom(`<body><div fa-form="true" fa-webflow-form><form name="a"></form></div></body>`)
        expect(names(getFfpNativeForms(document))).toEqual(['a'])
    })
})

describe('submitGuardAttribute', () => {
    it('reads the page opt-out from html or body', () => {
        resetDom(`<body data-ffp-submit-guard="off"></body>`)
        expect(submitGuardAttribute(document)).toBe('off')
    })

    it('reports nothing when the page says nothing', () => {
        resetDom()
        expect(submitGuardAttribute(document)).toBeNull()
    })
})

describe('installSubmitGuard', () => {
    const page = `<body><div fa-form="true"><form name="ours"></form></div><form name="theirs"></form></body>`

    it('does not install unless explicitly enabled', () => {
        // Off by default on purpose: a guard that swallows submissions with
        // nothing behind it loses every lead on the page.
        resetDom(page)
        const handle = vi.fn()
        installSubmitGuard(handle, { root: document })
        const event = submit(document.querySelector('[name="ours"]')!)
        expect(handle).not.toHaveBeenCalled()
        expect(event.defaultPrevented).toBe(false)
    })

    it('takes over submission for our own forms when enabled', () => {
        resetDom(page)
        const handle = vi.fn()
        installSubmitGuard(handle, { root: document, enabled: true })
        const form = document.querySelector('[name="ours"]')!
        const event = submit(form)
        expect(handle).toHaveBeenCalledTimes(1)
        expect(handle.mock.calls[0][0]).toBe(form)
        expect(event.defaultPrevented).toBe(true)
    })

    it('leaves other forms on the page alone', () => {
        resetDom(page)
        const handle = vi.fn()
        installSubmitGuard(handle, { root: document, enabled: true })
        const event = submit(document.querySelector('[name="theirs"]')!)
        expect(handle).not.toHaveBeenCalled()
        expect(event.defaultPrevented).toBe(false)
    })

    it('stops the event so no handler downstream of the document can run', () => {
        // What this can and cannot prove.
        //
        // linkedom does not implement the capture phase at all - it invokes
        // target listeners before ancestor ones regardless of the `capture`
        // flag - so the ordering that actually prevents the double submission
        // cannot be asserted here. What is assertable is that the guard calls
        // both `preventDefault` and `stopPropagation`, which is the whole of its
        // contract; whether a listener Webflow bound on the form still runs is a
        // question for Playwright against a real published site, and it is the
        // one check this line must not ship without.
        resetDom(page)
        const form = document.querySelector('[name="ours"]')!
        installSubmitGuard(vi.fn(), { root: document, enabled: true })

        const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
        const event = new w.window.Event('submit', { bubbles: true, cancelable: true })
        const stopped = vi.fn()
        event.stopPropagation = stopped
        form.dispatchEvent(event)

        expect(stopped).toHaveBeenCalledTimes(1)
        expect(event.defaultPrevented).toBe(true)
    })

    it('declines when the page opts out, even if the release enabled it', () => {
        resetDom(`<body data-ffp-submit-guard="off"><div fa-form="true"><form name="ours"></form></div></body>`)
        const handle = vi.fn()
        installSubmitGuard(handle, { root: document, enabled: true })
        submit(document.querySelector('[name="ours"]')!)
        expect(handle).not.toHaveBeenCalled()
    })

    it('unbinds cleanly', () => {
        resetDom(page)
        const handle = vi.fn()
        const unbind = installSubmitGuard(handle, { root: document, enabled: true })
        unbind()
        const event = submit(document.querySelector('[name="ours"]')!)
        expect(handle).not.toHaveBeenCalled()
        expect(event.defaultPrevented).toBe(false)
    })
})

describe('isFfpNativeForm', () => {
    it('answers for a single form', () => {
        resetDom(`<body><div fa-form="true"><form name="ours"></form></div><form name="theirs"></form></body>`)
        expect(isFfpNativeForm(document.querySelector('[name="ours"]') as HTMLFormElement)).toBe(true)
        expect(isFfpNativeForm(document.querySelector('[name="theirs"]') as HTMLFormElement)).toBe(false)
    })
})
