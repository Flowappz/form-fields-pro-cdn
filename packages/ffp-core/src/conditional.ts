/**
 * Conditional logic: show or hide a field based on the current answers.
 *
 * The rules are unchanged from 5.1.5 - same attribute, same seven operators,
 * same `some(group => group.every(rule))` shape. What changes is when they run.
 *
 * 5.1.5 ran them in `observeInputChangesAndFireConditionalLogic`, an async
 * function that evaluated every rule, slept 450 ms and then called itself. That
 * is a permanent 2.2 Hz timer on every published page, running four
 * `querySelectorAll` sweeps and a full re-evaluation forever, whether or not
 * anything changed - and it still took up to 450 ms to react to a keystroke.
 *
 * Here it is two capture-phase listeners plus a `refresh()` the registry calls
 * when the DOM changes. Reaction is immediate, the idle cost is zero, and it is
 * why every rewritten field dispatches `input`/`change` rather than only setting
 * `.value`: the poll used to paper over fields that announced nothing.
 */
import { on, rafDebounce, type Unbind } from './dom'

export type ConditionalRule = {
    inputName: string
    compareLogic: string
    compareValue?: unknown
}

/** Name to current value, rebuilt on every refresh. Exposed for `__debug`. */
export const FORM_STATE: Record<string, string> = {}

const INPUT_SELECTOR =
    'input.w-input, textarea.w-input, select.w-select, [form-fields-data-input],' +
    '.w-checkbox input[type="checkbox"], .w-radio input[type="radio"],' +
    'input.w-checkbox-input, input.w-radio-input, input.w-checkbox, input.w-radio'

function typeOf(el: Element): string {
    const own = (el as HTMLInputElement).type
    return String(own || el.getAttribute('type') || '').toLowerCase()
}

export function syncFormState(root: ParentNode = document): void {
    const inputs = Array.from(root.querySelectorAll(INPUT_SELECTOR))

    // Checkbox groups join their checked values, so the previous join has to be
    // cleared first or unchecking a box would never remove it from the state.
    for (const input of inputs) {
        if (typeOf(input) !== 'checkbox') continue
        const name = input.getAttribute('name')
        if (name) FORM_STATE[name] = ''
    }

    for (const input of inputs) {
        const name = input.getAttribute('name')
        if (!name) continue
        const type = typeOf(input)
        const value = (input as HTMLInputElement).value

        if (type === 'checkbox' || type === 'radio') {
            if (!(input as HTMLInputElement).checked) {
                if (type === 'radio' && FORM_STATE[name] === undefined) FORM_STATE[name] = ''
                continue
            }
            if (type === 'checkbox' && FORM_STATE[name]) {
                FORM_STATE[name] = FORM_STATE[name] + ',' + (value || 'true')
            } else {
                FORM_STATE[name] = value || 'true'
            }
            continue
        }

        FORM_STATE[name] = value == null ? '' : String(value)
    }
}

/** Clear the inline display so the page's own layout CSS applies when shown. */
export function toggleDisplay(element: Element, show = false): void {
    ;(element as HTMLElement).style.display = show ? '' : 'none'
}

export function resolveConditionalLogicRuleset(rule: ConditionalRule): boolean {
    const inputValue = FORM_STATE[rule.inputName] || ''
    const compareValue = rule.compareValue

    switch (rule.compareLogic) {
        case 'HAS_ANY_VALUE':
            return inputValue.length > 0
        case 'HAS_NO_VALUE':
            return inputValue.length === 0
        case 'CONTAINS':
            return (
                String(inputValue)
                    .toLowerCase()
                    .indexOf(String(compareValue == null ? '' : compareValue).toLowerCase()) !== -1
            )
        case 'IS_EQUAL':
            // Loose on purpose: the compare value comes out of JSON, so a number
            // rule against a text input is `5 == "5"` and customers rely on it.
            // eslint-disable-next-line eqeqeq
            return (inputValue as unknown) == compareValue
        case 'NOT_EQUAL':
            // eslint-disable-next-line eqeqeq
            return (inputValue as unknown) != compareValue
        case 'IS_GREATER_THAN': {
            const left = Number(inputValue)
            const right = Number(compareValue)
            if (!isNaN(left) && !isNaN(right)) return left > right
            return inputValue > String(compareValue)
        }
        case 'IS_LESS_THAN': {
            const left = Number(inputValue)
            const right = Number(compareValue)
            if (!isNaN(left) && !isNaN(right)) return left < right
            return inputValue < String(compareValue)
        }
        default:
            return false
    }
}

export function reactToCurrentFormState(element: Element): void {
    let ruleGroups: unknown
    try {
        ruleGroups = JSON.parse(element.getAttribute('conditional-logic') || '[]')
    } catch {
        // Malformed JSON leaves the field exactly as the page shipped it. Hiding
        // it would be worse: an unparseable rule would delete a field from a
        // live form.
        return
    }
    if (!Array.isArray(ruleGroups)) return

    const result = ruleGroups.some(
        (group) =>
            Array.isArray(group) &&
            group.every((rule) => resolveConditionalLogicRuleset(rule as ConditionalRule)),
    )
    toggleDisplay(element, result)
}

/** Evaluate every rule on the page against the current answers. */
export function evaluateConditionalLogic(root: ParentNode = document): void {
    const fields = Array.from(root.querySelectorAll('[conditional-logic]'))
    if (!fields.length) return
    syncFormState(root)
    for (const field of fields) {
        try {
            reactToCurrentFormState(field)
        } catch (error) {
            console.warn('Form Fields Pro: Conditional logic evaluation failed', error)
        }
    }
}

export type ConditionalLogicHandle = Unbind & { refresh: () => void }

/**
 * Install conditional logic. Returns an unbind that also carries `refresh`, for
 * the registry to call after it mounts fields into a subtree.
 */
export function installConditionalLogic(root: Document = document): ConditionalLogicHandle {
    const run = () => evaluateConditionalLogic(root)
    // Coalesced: a paste into a text input fires `input` once, but a field that
    // re-emits both `input` and `change` would otherwise evaluate twice.
    const scheduled = rafDebounce(run)

    // Capture, so a customer script that stops propagation on its own handler
    // cannot leave the form's visibility stuck on a stale answer.
    const unbinds = [
        on(root, 'input', scheduled, { capture: true }),
        on(root, 'change', scheduled, { capture: true }),
    ]

    run()

    const handle = (() => {
        for (const unbind of unbinds) unbind()
    }) as ConditionalLogicHandle
    handle.refresh = run
    return handle
}
