import { afterEach, describe, expect, it, vi } from 'vitest'
import { createColorPicker, type ColorPickerHandle } from '../src/colorpicker'
import { fire } from './setup'

let picker: ColorPickerHandle | null = null

function rect(el: HTMLElement, width: number, height: number): void {
    el.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width, height, right: width, bottom: height, x: 0, y: 0 }) as DOMRect
}

function build(over: Partial<Parameters<typeof createColorPicker>[0]> = {}) {
    const onCommit = vi.fn()
    const onPreview = vi.fn()
    const onDismiss = vi.fn()
    picker = createColorPicker({ value: '#146ef5', onCommit, onPreview, onDismiss, ...over })
    document.body.appendChild(picker.element)
    rect(area(), 200, 140)
    rect(hue(), 200, 12)
    return { onCommit, onPreview, onDismiss }
}

const area = () => document.querySelector('.ffp-cp-area') as HTMLElement
const hue = () => document.querySelector('.ffp-cp-hue') as HTMLElement
const thumb = () => document.querySelector('.ffp-cp-thumb') as HTMLElement
const text = () => document.querySelector('.ffp-cp-input') as HTMLInputElement
const swatch = () => document.querySelector('.ffp-cp-swatch') as HTMLElement
const choose = () => document.querySelector('.ffp-cp-choose') as HTMLElement

function press(el: HTMLElement, clientX: number, clientY: number): void {
    fire(el, 'pointerdown', { clientX, clientY, button: 0, pointerId: 1 })
}

afterEach(() => {
    if (picker) picker.destroy()
    picker = null
})

describe('initial state', () => {
    it('starts on the value it was given', () => {
        build({ value: '#146ef5' })
        expect(picker!.value()).toBe('#146ef5')
        expect(text().value).toBe('#146ef5')
    })

    it('accepts any spelling parseColor accepts', () => {
        build({ value: 'rgb(20, 110, 245)' })
        expect(picker!.value()).toBe('#146ef5')
    })

    it('falls back to black rather than nothing', () => {
        // spectrum ran with `allowEmpty: false`; the field always submits one.
        build({ value: 'not a colour' })
        expect(picker!.value()).toBe('#000000')
    })

    it('paints the square with the pure hue behind two static gradients', () => {
        // The reason this is not a canvas: changing hue is one property write.
        build({ value: '#146ef5' })
        // #146ef5 is hue 215; the square's base colour is that hue at full
        // saturation and value, with the white and black gradients over it.
        expect(area().style.backgroundColor).toBe('#0066ff')
    })
})

describe('dragging', () => {
    it('reads saturation across and value up the square', () => {
        const { onPreview } = build({ value: '#ff0000' })
        press(area(), 200, 0) // full saturation, full value
        expect(picker!.value()).toBe('#ff0000')

        press(area(), 0, 0) // no saturation, full value
        expect(picker!.value()).toBe('#ffffff')

        press(area(), 200, 140) // full saturation, no value
        expect(picker!.value()).toBe('#000000')
        expect(onPreview).toHaveBeenCalled()
    })

    it('moves the hue', () => {
        build({ value: '#ff0000' })
        press(hue(), 100, 6) // half way round = 180deg = cyan
        expect(picker!.value()).toBe('#00ffff')
    })

    it('keeps saturation and value when the hue changes', () => {
        build({ value: '#803333' }) // muted red
        const before = picker!.value()
        const position = thumb().style.left
        press(hue(), 66, 6)
        expect(picker!.value()).not.toBe(before)
        // Different hue, same saturation and value: the square thumb stays put.
        expect(thumb().style.left).toBe(position)
    })

    it('positions the thumb from saturation and value', () => {
        build({ value: '#ffffff' })
        expect(thumb().style.left).toBe('0%')
        expect(thumb().style.top).toBe('0%')
    })

    it('does not commit while dragging', () => {
        const { onCommit } = build({ value: '#ff0000' })
        press(area(), 100, 70)
        expect(onCommit).not.toHaveBeenCalled()
    })
})

describe('the text field', () => {
    it('accepts a typed colour', () => {
        build({ value: '#000000' })
        text().value = '#ff0000'
        fire(text(), 'input')
        expect(picker!.value()).toBe('#ff0000')
        expect(swatch().style.background).toBe('#ff0000')
    })

    it('leaves a half-typed value alone', () => {
        // Rewriting the field mid-keystroke fights the visitor.
        build({ value: '#000000' })
        text().value = '#f'
        fire(text(), 'input')
        expect(text().value).toBe('#f')
        expect(picker!.value()).toBe('#000000')
    })
})

describe('committing', () => {
    it('commits on Choose and asks to be dismissed', () => {
        const { onCommit, onDismiss } = build({ value: '#ff0000' })
        press(hue(), 100, 6)
        choose().click()
        expect(onCommit).toHaveBeenCalledWith('#00ffff')
        expect(onDismiss).toHaveBeenCalled()
    })

    it('treats Enter as Choose rather than as a form submit', () => {
        const { onCommit } = build({ value: '#ff0000' })
        const prevented = vi.fn()
        fire(text(), 'keydown', { key: 'Enter', preventDefault: prevented })
        expect(onCommit).toHaveBeenCalledWith('#ff0000')
        expect(prevented).toHaveBeenCalled()
    })
})

describe('setValue', () => {
    it('moves everything to the new colour', () => {
        build({ value: '#000000' })
        picker!.setValue('#00ff00')
        expect(picker!.value()).toBe('#00ff00')
        expect(text().value).toBe('#00ff00')
    })

    it('ignores a value it cannot parse', () => {
        build({ value: '#123456' })
        picker!.setValue('nonsense')
        expect(picker!.value()).toBe('#123456')
    })
})
