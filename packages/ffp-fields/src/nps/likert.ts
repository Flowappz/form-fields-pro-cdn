/**
 * Likert scale. The whole field, in 5.1.5, was one `injectStyle` call.
 *
 * There is no behaviour: the markup is native radio inputs with sibling labels,
 * and the stylesheet hides the input and turns the label into a circle. Which is
 * why it is here rather than in a chunk of its own - it rides along with NPS.
 *
 * One customer-visible fix. 5.1.5's selector list was:
 *
 *     [data-field="likert-scale-field-radio"]:checked,
 *     [data-field="likert-scale-field-radio"]:not(:checked) + label { width: 20px; height: 20px; ... }
 *
 * The first selector is missing its `+ label`, so those sizes landed on the
 * checked **input** as well - an input the rule above sets to `width: 0` and
 * `height: 0`. Selecting an option therefore grew a hidden 0x0 input to 20x20
 * and shifted the row sideways as the visitor clicked. The intent is plainly
 * that both states style the label, and that is what this does.
 */

const RADIO = '[data-field="likert-scale-field-radio"]'

const CHECK_ICON =
    "url('data:image/svg+xml,<svg width=\"14\" height=\"10\" viewBox=\"0 0 14 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.3333 1L4.54167 8.79167L1 5.25\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')"

export const LIKERT_CSS = `
${RADIO}{opacity:0;visibility:hidden;height:0!important;margin:0;width:0!important}
${RADIO}:checked + label,
${RADIO}:not(:checked) + label{width:20px;height:20px;display:inline-block;border:1px solid #000;border-radius:50%;margin-bottom:0!important}
${RADIO}:checked + label{background-image:${CHECK_ICON};background-repeat:no-repeat;background-position:center}
`
