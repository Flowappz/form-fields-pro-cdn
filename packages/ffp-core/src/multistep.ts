/**
 * Multi-step forms: one `[fa-webflow-form]` holding `[fa-form-step]` indicators
 * and `[fa-form-page]` panels.
 *
 * Ported from 5.1.5 with the behaviour intact. The one thing that goes is the
 * alias at the bottom of that file:
 *
 *     const validateCurrentPage = initMultiStepForms
 *
 * `validateCurrentPage` was the name in the initializers array, so the list read
 * as though the runtime validated the current page on boot. It does not - it
 * initialises multi-step forms, once, and validates nothing. The name is gone.
 */
import { injectStyle, on, type Unbind } from './dom'
import { validateRequiredFields } from './validate'

/**
 * The rail is generated as a nowrap flex row of labelled steps. Three of those
 * fit a 640px card. Nineteen do not: they spill out of the card and stretch the
 * page. Containment has to live here, not only on the generated class - a form
 * already published will not pick up a Designer style change until it is
 * re-synced.
 *
 * `overflow-x: auto` is the page-level fix: a scrollport does not contribute
 * its overflowing descendants to ancestor scroll overflow. Compact mode is
 * the rest of it - hide idle labels and let the connectors collapse so the
 * numbered circles fit without a scrollbar. Measured, not counted, because six
 * short names can fit the same column that four long ones cannot.
 */
export const STEPS_RAIL_CSS = [
    '[fa-form-steps]{max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain;scrollbar-width:none;-ms-overflow-style:none}',
    '[fa-form-steps]::-webkit-scrollbar{height:0}',
    '[fa-form-steps].ffp-steps-compact{column-gap:0!important}',
    '[fa-form-steps].ffp-steps-compact [fa-form-step]:not(.active-step) [fa-form-step-label]{display:none!important}',
    '[fa-form-steps].ffp-steps-compact [fa-form-spacer]{min-width:2px!important;flex:1 1 0%!important;width:auto!important}',
    '[fa-form-steps].ffp-steps-compact .active-step [fa-form-step-label]{max-width:8em;overflow:hidden;text-overflow:ellipsis}',
].join('')

const COMPACT = 'ffp-steps-compact'

export function initMultiStepForms(root: ParentNode = document): Unbind {
    const unbinds: Unbind[] = []
    for (const form of Array.from(root.querySelectorAll('[fa-webflow-form]'))) {
        unbinds.push(initSingleMultiStepForm(form as HTMLElement))
    }
    return () => {
        for (const unbind of unbinds) unbind()
    }
}

export function fitStepsRail(formElement: HTMLElement): void {
    const rail = formElement.querySelector('[fa-form-steps]') as HTMLElement | null
    if (!rail) return

    rail.classList.remove(COMPACT)
    if (rail.scrollWidth > rail.clientWidth + 1) rail.classList.add(COMPACT)

    const active = rail.querySelector('.active-step') as HTMLElement | null
    if (active && typeof active.scrollIntoView === 'function') {
        active.scrollIntoView({ block: 'nearest', inline: 'center' })
    }
}

export function initSingleMultiStepForm(formElement: HTMLElement): Unbind {
    if (!formElement || formElement.getAttribute('data-ffp-multi-step-init') === '1') return () => {}

    const steps = Array.from(formElement.querySelectorAll('[fa-form-step]'))
    const pages = Array.from(formElement.querySelectorAll('[fa-form-page]'))
    if (!steps.length || !pages.length) return () => {}

    formElement.setAttribute('data-ffp-multi-step-init', '1')
    injectStyle('ffp-steps-rail', STEPS_RAIL_CSS)

    const previousButton = formElement.querySelector('[fa-form-previous-button]') as HTMLElement | null
    const nextButton = formElement.querySelector('[fa-form-next-button]') as HTMLElement | null
    const submitButton = formElement.querySelector('[fa-form-submit-button]') as HTMLElement | null

    const unbinds: Unbind[] = []
    let currentStepIndex = 0

    function updateButtonVisibility(): void {
        if (previousButton) previousButton.style.display = currentStepIndex === 0 ? 'none' : ''
        if (nextButton) nextButton.style.display = currentStepIndex === steps.length - 1 ? 'none' : ''
        if (submitButton) submitButton.style.display = currentStepIndex !== steps.length - 1 ? 'none' : ''
    }

    function showPageByIndex(index: number): void {
        if (index < 0 || index >= steps.length) return

        pages.forEach((page, i) => page.classList.toggle('hidden', i !== index))

        steps.forEach((step, i) => {
            const counter = step.querySelector('[fa-form-step-counter]')
            const successIcon = step.querySelector('[fa-form-step-success-icon]')
            const label = step.querySelector('[fa-form-step-label]')
            const done = i < index
            const active = i === index
            if (counter) counter.classList.toggle('hidden', done)
            if (successIcon) successIcon.classList.toggle('hidden', !done)
            step.classList.toggle('active-step', active)
            if (counter) counter.classList.toggle('active-counter', active)
            if (label) label.classList.toggle('active-label', done || active)
        })

        currentStepIndex = index
        updateButtonVisibility()
        fitStepsRail(formElement)
    }

    function validatePageAt(index: number): boolean {
        const page = pages[index]
        return page ? validateRequiredFields(page as HTMLElement) : false
    }

    /**
     * Jumping forward over several steps has to validate each one it skips, or
     * a visitor clicking the last indicator lands on the final page with three
     * pages of required fields unanswered and only discovers it at submit.
     */
    function validateThrough(targetIndex: number): boolean {
        for (let i = currentStepIndex; i < targetIndex; i++) {
            if (!validatePageAt(i)) {
                showPageByIndex(i)
                return false
            }
        }
        return true
    }

    steps.forEach((step, index) => {
        unbinds.push(
            on(step, 'click', () => {
                if (currentStepIndex < index) {
                    if (validateThrough(index)) showPageByIndex(index)
                } else {
                    // Going back is always allowed; the answers are already there.
                    showPageByIndex(index)
                }
            }),
        )
    })

    if (nextButton) {
        unbinds.push(
            on(nextButton, 'click', () => {
                if (validatePageAt(currentStepIndex) && currentStepIndex < steps.length - 1) {
                    showPageByIndex(currentStepIndex + 1)
                }
            }),
        )
    }

    if (previousButton) {
        unbinds.push(
            on(previousButton, 'click', () => {
                if (currentStepIndex > 0) showPageByIndex(currentStepIndex - 1)
            }),
        )
    }

    const rail = formElement.querySelector('[fa-form-steps]')
    if (rail && typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => fitStepsRail(formElement))
        observer.observe(rail)
        unbinds.push(() => observer.disconnect())
    } else {
        unbinds.push(on(window, 'resize', () => fitStepsRail(formElement)))
    }

    showPageByIndex(0)

    return () => {
        for (const unbind of unbinds) unbind()
        formElement.removeAttribute('data-ffp-multi-step-init')
    }
}
