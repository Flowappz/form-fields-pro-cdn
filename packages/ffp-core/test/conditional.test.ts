import { describe, expect, it, vi } from 'vitest'
import {
    evaluateConditionalLogic,
    FORM_STATE,
    installConditionalLogic,
    reactToCurrentFormState,
    resolveConditionalLogicRuleset,
    syncFormState,
} from '../src/conditional'
import { resetDom } from './setup'

function page(inner: string): void {
    resetDom(`<body><form>${inner}</form></body>`)
    applyChecked(document)
    for (const key of Object.keys(FORM_STATE)) delete FORM_STATE[key]
}

/**
 * linkedom does not reflect the `checked` content attribute into the `.checked`
 * property the way a browser does, so markup written with `checked` parses as
 * unchecked. Every code path here reads the property, exactly as it should, so
 * the gap is closed in the harness rather than worked around in the source.
 */
function applyChecked(root: ParentNode): void {
    for (const input of Array.from(root.querySelectorAll('[checked]'))) {
        ;(input as HTMLInputElement).checked = true
    }
}


function fire(el: Element, type: string): void {
    const w = globalThis as unknown as { window: { Event: new (t: string, i?: unknown) => Event } }
    el.dispatchEvent(new w.window.Event(type, { bubbles: true }))
}

/** The observer schedules on a frame; setup.ts backs that with a timeout. */
const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 5))

const rules = (json: unknown) => JSON.stringify(json)

describe('syncFormState', () => {
    it('reads text inputs by name', () => {
        page('<input class="w-input" name="a" value="hello">')
        syncFormState()
        expect(FORM_STATE.a).toBe('hello')
    })

    it('joins checked checkboxes and drops unchecked ones', () => {
        page(
            '<div class="w-checkbox"><input type="checkbox" name="c" value="one" checked></div>' +
                '<div class="w-checkbox"><input type="checkbox" name="c" value="two" checked></div>' +
                '<div class="w-checkbox"><input type="checkbox" name="c" value="three"></div>',
        )
        syncFormState()
        expect(FORM_STATE.c).toBe('one,two')
    })

    it('rebuilds the join instead of appending to the last one', () => {
        // The reset pass exists for exactly this: without it, unchecking a box
        // could never remove its value from the state.
        page('<div class="w-checkbox"><input type="checkbox" name="c" value="one" checked></div>')
        syncFormState()
        syncFormState()
        expect(FORM_STATE.c).toBe('one')
    })

    it('records an unanswered radio group as empty', () => {
        page('<div class="w-radio"><input type="radio" name="r" value="yes"></div>')
        syncFormState()
        expect(FORM_STATE.r).toBe('')
    })

    it('reads our own fields through form-fields-data-input', () => {
        page('<input form-fields-data-input name="nps" value="9">')
        syncFormState()
        expect(FORM_STATE.nps).toBe('9')
    })
})

describe('resolveConditionalLogicRuleset', () => {
    const withState = (name: string, value: string) => {
        for (const key of Object.keys(FORM_STATE)) delete FORM_STATE[key]
        FORM_STATE[name] = value
    }

    it('handles the presence operators', () => {
        withState('a', 'x')
        expect(resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'HAS_ANY_VALUE' })).toBe(true)
        expect(resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'HAS_NO_VALUE' })).toBe(false)
        withState('a', '')
        expect(resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'HAS_ANY_VALUE' })).toBe(false)
        expect(resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'HAS_NO_VALUE' })).toBe(true)
    })

    it('compares CONTAINS case-insensitively', () => {
        withState('a', 'Hello World')
        expect(
            resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'CONTAINS', compareValue: 'world' }),
        ).toBe(true)
    })

    it('compares equality loosely, so a numeric rule matches a text input', () => {
        withState('a', '5')
        expect(
            resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 5 }),
        ).toBe(true)
        expect(
            resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'NOT_EQUAL', compareValue: 6 }),
        ).toBe(true)
    })

    it('compares numerically when both sides are numbers', () => {
        withState('a', '10')
        expect(
            resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'IS_GREATER_THAN', compareValue: '9' }),
        ).toBe(true)
        expect(
            resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'IS_LESS_THAN', compareValue: '9' }),
        ).toBe(false)
    })

    it('falls through to string comparison when either side is not a number', () => {
        // "10" > "9" is false as a string. This fallthrough is the documented
        // behaviour of 5.1.5 and customer rules depend on it either way.
        withState('a', 'banana')
        expect(
            resolveConditionalLogicRuleset({
                inputName: 'a',
                compareLogic: 'IS_GREATER_THAN',
                compareValue: 'apple',
            }),
        ).toBe(true)
    })

    it('is false for an unknown operator and an unknown field', () => {
        withState('a', 'x')
        expect(resolveConditionalLogicRuleset({ inputName: 'a', compareLogic: 'WAT' })).toBe(false)
        expect(resolveConditionalLogicRuleset({ inputName: 'zz', compareLogic: 'HAS_ANY_VALUE' })).toBe(false)
    })
})

describe('reactToCurrentFormState', () => {
    it('shows the field when any group matches', () => {
        page(
            '<input class="w-input" name="a" value="yes">' +
                `<div id="t" conditional-logic='${rules([[{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'yes' }]])}'></div>`,
        )
        evaluateConditionalLogic()
        expect((document.getElementById('t') as HTMLElement).style.display).toBe('')
    })

    it('hides the field when no group matches', () => {
        page(
            '<input class="w-input" name="a" value="no">' +
                `<div id="t" conditional-logic='${rules([[{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'yes' }]])}'></div>`,
        )
        evaluateConditionalLogic()
        expect((document.getElementById('t') as HTMLElement).style.display).toBe('none')
    })

    it('needs every rule in a group but only one group', () => {
        page(
            '<input class="w-input" name="a" value="yes"><input class="w-input" name="b" value="no">' +
                `<div id="t" conditional-logic='${rules([
                    [
                        { inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'yes' },
                        { inputName: 'b', compareLogic: 'IS_EQUAL', compareValue: 'yes' },
                    ],
                    [{ inputName: 'a', compareLogic: 'HAS_ANY_VALUE' }],
                ])}'></div>`,
        )
        evaluateConditionalLogic()
        expect((document.getElementById('t') as HTMLElement).style.display).toBe('')
    })

    it('leaves a field with malformed rules exactly as the page shipped it', () => {
        // Hiding it would delete a field from a live form over a JSON typo.
        page(`<div id="t" conditional-logic='{not json'></div>`)
        reactToCurrentFormState(document.getElementById('t') as Element)
        expect((document.getElementById('t') as HTMLElement).getAttribute('style')).toBeNull()
    })
})

describe('installConditionalLogic', () => {
    it('reacts to a change without waiting on a poll', async () => {
        // 5.1.5 took up to 450 ms to notice this, because noticing was a timer.
        page(
            '<input class="w-input" name="a" value="no">' +
                `<div id="t" conditional-logic='${rules([[{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'yes' }]])}'></div>`,
        )
        const handle = installConditionalLogic(document)
        expect((document.getElementById('t') as HTMLElement).style.display).toBe('none')

        const input = document.querySelector('input') as HTMLInputElement
        input.value = 'yes'
        fire(input, 'input')
        await nextFrame()

        expect((document.getElementById('t') as HTMLElement).style.display).toBe('')
        handle()
    })

    it('stops reacting once unbound', async () => {
        page(
            '<input class="w-input" name="a" value="no">' +
                `<div id="t" conditional-logic='${rules([[{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'yes' }]])}'></div>`,
        )
        const handle = installConditionalLogic(document)
        handle()

        const input = document.querySelector('input') as HTMLInputElement
        input.value = 'yes'
        fire(input, 'input')
        await nextFrame()

        expect((document.getElementById('t') as HTMLElement).style.display).toBe('none')
    })

    it('refreshes on demand, for fields inserted after load', async () => {
        page('<input class="w-input" name="a" value="yes">')
        const handle = installConditionalLogic(document)

        const form = document.querySelector('form') as HTMLFormElement
        form.innerHTML =
            form.innerHTML +
            `<div id="t" conditional-logic='${rules([[{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'yes' }]])}'></div>`
        handle.refresh()

        expect((document.getElementById('t') as HTMLElement).style.display).toBe('')
        handle()
    })
})

describe('a hidden tab', () => {
    it('still reacts, because rAF does not fire in one', async () => {
        // Opening a form in a background tab is ordinary - middle click, "open
        // in new tab", a restored session. Autofill runs there.
        page(
            '<input class="w-input" name="a" value="no">' +
                `<div id="t" conditional-logic='${rules([[{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'yes' }]])}'></div>`,
        )
        Object.defineProperty(document, 'hidden', { value: true, configurable: true })
        const raf = vi.fn()
        const g = globalThis as unknown as { requestAnimationFrame: unknown }
        const original = g.requestAnimationFrame
        g.requestAnimationFrame = raf

        const handle = installConditionalLogic(document)
        const input = document.querySelector('input') as HTMLInputElement
        input.value = 'yes'
        fire(input, 'input')
        await new Promise((resolve) => setTimeout(resolve, 30))

        expect(raf).not.toHaveBeenCalled()
        expect((document.getElementById('t') as HTMLElement).style.display).toBe('')

        g.requestAnimationFrame = original
        handle()
    })
})
