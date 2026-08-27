/**
 * Taking submission away from Webflow, without jQuery.
 *
 * Runtime 5.1.5 does this in one line (L2052):
 *
 *     $(form).submit(() => false)
 *
 * Returning false from a jQuery handler calls both `preventDefault` and
 * `stopPropagation`, and - because Webflow's own form handling is bound through
 * the same jQuery instance - it lands in the same handler queue and wins by
 * being registered later. A plain `addEventListener('submit', ...)` on the form
 * is **not** equivalent: for a listener on the event's own target, capture and
 * bubble listeners run in registration order, so a handler Webflow bound first
 * still runs. Get this wrong and Webflow posts the form as well as we do, which
 * the visitor sees as a duplicate submission and the customer sees as duplicate
 * leads.
 *
 * The mechanism here is one capture-phase listener on `document`. Capture at an
 * ancestor genuinely precedes every listener on the form, whoever bound it and
 * whenever. `stopPropagation()` during capture stops the event before it ever
 * reaches the target, so Webflow's handler never runs - at the form or at the
 * document - and `preventDefault()` stops the browser's native post.
 *
 * Because the event stops there, this listener has to *be* the submission path
 * rather than sit in front of one. That is deliberate: a guard installed with
 * nothing behind it would silently swallow every submission. `installSubmitGuard`
 * therefore refuses to install without a handler, and is off unless switched on.
 */
import { on, type Unbind } from './dom'

/**
 * The forms this app owns. Ported from 5.1.5 `getFfpNativeForms`, unchanged.
 *
 * The ordering matters and is not arbitrary: a `parent.querySelector('form')`
 * would hijack a sibling search or newsletter form on the same page, which is
 * why each rung is scoped and `:scope > form` comes before a descendant search.
 */
export function getFfpNativeForms(root: ParentNode = document): HTMLFormElement[] {
    const roots = root.querySelectorAll('[fa-form="true"], [fa-webflow-form]')
    const forms = new Set<HTMLFormElement>()

    roots.forEach((shell) => {
        if (shell.tagName === 'FORM') {
            forms.add(shell as HTMLFormElement)
            return
        }
        const direct = shell.querySelectorAll(':scope > form')
        if (direct.length) {
            direct.forEach((f) => forms.add(f as HTMLFormElement))
            return
        }
        const nested = shell.querySelectorAll('form')
        if (nested.length) {
            nested.forEach((f) => forms.add(f as HTMLFormElement))
            return
        }
        const enclosing = shell.closest('form')
        if (enclosing) forms.add(enclosing as HTMLFormElement)
    })

    return Array.from(forms)
}

export function isFfpNativeForm(form: HTMLFormElement): boolean {
    return getFfpNativeForms(form.ownerDocument).indexOf(form) !== -1
}

export type SubmitGuardOptions = {
    /**
     * Off unless explicitly true. The plan calls this the highest-risk single
     * line in the migration, so it does not ride along with a field release and
     * it does not default on.
     */
    enabled?: boolean
    /** Defaults to `document`. */
    root?: Document
}

/**
 * Read the page-level opt-out.
 *
 * A customer or support can switch the guard off on one page without waiting
 * for a release, and the licence response can switch it off for a whole site
 * without a re-publish. Both are checked by the caller, which is why this only
 * reports what the page says.
 */
export function submitGuardAttribute(root: Document = document): 'on' | 'off' | null {
    const value =
        root.documentElement.getAttribute('data-ffp-submit-guard') ||
        (root.body && root.body.getAttribute('data-ffp-submit-guard'))
    if (value === 'on' || value === 'off') return value
    return null
}

/**
 * Install the guard. Returns an unbind, or a no-op when it declines to install.
 *
 * `handle` is the submission path. It is called synchronously with the form and
 * the original event, after the event has been stopped.
 */
export function installSubmitGuard(
    handle: (form: HTMLFormElement, event: Event) => void,
    options: SubmitGuardOptions = {},
): Unbind {
    const root = options.root || document
    const attribute = submitGuardAttribute(root)
    // The page's `off` beats an enable from anywhere else; `on` cannot enable a
    // guard the release has not enabled, or a stale published page could turn on
    // behaviour we have since rolled back.
    if (attribute === 'off' || options.enabled !== true) return () => {}

    return on(
        root,
        'submit',
        (event) => {
            const form = event.target as HTMLFormElement | null
            if (!form || form.tagName !== 'FORM') return
            if (!isFfpNativeForm(form)) return

            event.preventDefault()
            // Not `stopImmediatePropagation`: the event is at `document` in the
            // capture phase, so nothing of ours is queued behind it, and the
            // immediate variant would also silence any later capture listener
            // core itself adds.
            event.stopPropagation()

            handle(form, event)
        },
        { capture: true },
    )
}
