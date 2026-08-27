import { describe, expect, it } from 'vitest'
import { initMultiStepForms } from '../src/multistep'
import { addValidationMessageNodes } from '../src/validate'
import { resetDom } from './setup'

const STEP = (i: number) =>
    `<div fa-form-step data-i="${i}">
        <span fa-form-step-counter></span>
        <span fa-form-step-success-icon></span>
        <span fa-form-step-label></span>
    </div>`

const PAGE = (i: number, inner = '') => `<div fa-form-page data-i="${i}">${inner}</div>`

const required = (name: string) =>
    `<div form-fields-wrapper="true"><input name="${name}" required></div>`

function build(pages: string[]): HTMLElement {
    resetDom(`<body><div fa-webflow-form>
        ${pages.map((_, i) => STEP(i)).join('')}
        ${pages.map((inner, i) => PAGE(i, inner)).join('')}
        <button fa-form-previous-button>back</button>
        <button fa-form-next-button>next</button>
        <button fa-form-submit-button>send</button>
    </div></body>`)
    const root = document.querySelector('[fa-webflow-form]') as HTMLElement
    addValidationMessageNodes(root)
    return root
}

function click(el: Element | null): void {
    const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
    el!.dispatchEvent(new w.window.Event('click', { bubbles: true }))
}

const visible = () =>
    Array.from(document.querySelectorAll('[fa-form-page]'))
        .filter((p) => !p.classList.contains('hidden'))
        .map((p) => p.getAttribute('data-i'))

const step = (i: number) => document.querySelectorAll('[fa-form-step]')[i]
const next = () => document.querySelector('[fa-form-next-button]')
const back = () => document.querySelector('[fa-form-previous-button]')

describe('initMultiStepForms', () => {
    it('shows only the first page', () => {
        build(['', '', ''])
        initMultiStepForms()
        expect(visible()).toEqual(['0'])
    })

    it('hides back on the first page and submit until the last', () => {
        build(['', ''])
        initMultiStepForms()
        expect((back() as HTMLElement).style.display).toBe('none')
        expect((document.querySelector('[fa-form-submit-button]') as HTMLElement).style.display).toBe('none')

        click(next())
        expect((back() as HTMLElement).style.display).toBe('')
        expect((next() as HTMLElement).style.display).toBe('none')
        expect((document.querySelector('[fa-form-submit-button]') as HTMLElement).style.display).toBe('')
    })

    it('refuses to advance past an unanswered required field', () => {
        build([required('a'), ''])
        initMultiStepForms()
        click(next())
        expect(visible()).toEqual(['0'])
        expect(document.querySelector('.form-fields-data-validation-message')!.textContent).toBe(
            'This field is required',
        )
    })

    it('advances once the field is answered', () => {
        build([required('a'), ''])
        initMultiStepForms()
        ;(document.querySelector('input') as HTMLInputElement).value = 'x'
        click(next())
        expect(visible()).toEqual(['1'])
    })

    it('validates every page it is asked to skip over', () => {
        // Clicking the last indicator must not land the visitor on the final page
        // with two pages of unanswered questions behind them.
        build(['', required('b'), ''])
        initMultiStepForms()
        click(step(2))
        expect(visible()).toEqual(['1'])
    })

    it('always allows going back', () => {
        build([required('a'), ''])
        initMultiStepForms()
        ;(document.querySelector('input') as HTMLInputElement).value = 'x'
        click(next())
        ;(document.querySelector('input') as HTMLInputElement).value = ''
        click(back())
        expect(visible()).toEqual(['0'])
    })

    it('marks completed, active and pending steps', () => {
        build(['', ''])
        initMultiStepForms()
        click(next())

        const done = step(0)
        const active = step(1)
        expect(done.querySelector('[fa-form-step-counter]')!.classList.contains('hidden')).toBe(true)
        expect(done.querySelector('[fa-form-step-success-icon]')!.classList.contains('hidden')).toBe(false)
        expect(done.querySelector('[fa-form-step-label]')!.classList.contains('active-label')).toBe(true)
        expect(active.classList.contains('active-step')).toBe(true)
        expect(active.querySelector('[fa-form-step-counter]')!.classList.contains('active-counter')).toBe(true)
    })

    it('binds once, however many times it runs', () => {
        // The observer calls it again on every DOM change.
        build(['', ''])
        initMultiStepForms()
        initMultiStepForms()
        click(next())
        expect(visible()).toEqual(['1'])
    })

    it('ignores a wrapper with no steps or pages', () => {
        resetDom('<body><div fa-webflow-form></div></body>')
        expect(() => initMultiStepForms()).not.toThrow()
        expect(document.querySelector('[fa-webflow-form]')!.getAttribute('data-ffp-multi-step-init')).toBeNull()
    })
})
