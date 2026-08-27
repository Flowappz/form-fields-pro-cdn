import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSlider, type SliderHandle } from '../src/slider'
import { fire } from './setup'

let slider: SliderHandle | null = null

/**
 * linkedom has no layout, so `getBoundingClientRect` is all zeroes and the drag
 * core would divide by a zero width. A fixed rect is the whole of the layout
 * these tests need.
 */
function withRect(el: HTMLElement, left = 0, width = 200): void {
    el.getBoundingClientRect = () =>
        ({ left, top: 0, width, height: 12, right: left + width, bottom: 12, x: left, y: 0 }) as DOMRect
}

function build(over: Partial<Parameters<typeof createSlider>[0]> = {}) {
    const onUpdate = vi.fn()
    slider = createSlider({
        min: 0,
        max: 100,
        step: 1,
        values: [40],
        connect: 'lower',
        tooltips: true,
        onUpdate,
        ...over,
    })
    document.body.appendChild(slider.element)
    withRect(slider.element)
    return { onUpdate, element: slider.element }
}

const handles = () => Array.from(document.querySelectorAll('.ffp-slider-handle')) as unknown as HTMLElement[]
const connect = () => document.querySelector('.ffp-slider-connect') as HTMLElement
const tooltips = () =>
    Array.from(document.querySelectorAll('.ffp-slider-tooltip')).map((n) => n.textContent)

/** A pointer event the drag core will accept. */
function drag(el: HTMLElement, clientX: number, type = 'pointerdown'): void {
    fire(el, type, { clientX, clientY: 6, button: 0, pointerId: 1 })
}

afterEach(() => {
    if (slider) slider.destroy()
    slider = null
})

describe('rendering', () => {
    it('places the handle and fills the track up to it', () => {
        build({ values: [25] })
        expect(handles()[0].style.left).toBe('25%')
        expect(connect().style.width).toBe('25%')
        expect(connect().style.left).toBe('0%')
    })

    it('fills between the handles for a range', () => {
        build({ values: [20, 80], connect: 'range' })
        expect(connect().style.left).toBe('20%')
        expect(connect().style.width).toBe('60%')
    })

    it('shows a rounded tooltip per handle', () => {
        build({ values: [20, 80], connect: 'range' })
        expect(tooltips()).toEqual(['20', '80'])
    })

    it('exposes each handle to assistive tech', () => {
        build({ values: [40] })
        const handle = handles()[0]
        expect(handle.getAttribute('role')).toBe('slider')
        expect(handle.getAttribute('aria-valuemin')).toBe('0')
        expect(handle.getAttribute('aria-valuemax')).toBe('100')
        expect(handle.getAttribute('aria-valuenow')).toBe('40')
    })

    it('never submits the form it lives in', () => {
        build({ values: [20, 80], connect: 'range' })
        expect(handles().every((h) => (h as HTMLButtonElement).type === 'button')).toBe(true)
    })
})

describe('dragging', () => {
    it('moves the handle to the pointer', () => {
        const { onUpdate, element } = build({ values: [0] })
        drag(element, 100)
        expect(onUpdate).toHaveBeenCalledWith([50])
    })

    it('clamps outside the track', () => {
        const { onUpdate, element } = build({ values: [50] })
        drag(element, -40)
        expect(onUpdate).toHaveBeenLastCalledWith([0])
        drag(element, 400)
        expect(onUpdate).toHaveBeenLastCalledWith([100])
    })

    it('grabs the nearer handle when the bare track is pressed', () => {
        const { onUpdate, element } = build({ values: [20, 80], connect: 'range' })
        drag(element, 140) // 70% - nearer the upper handle
        expect(onUpdate).toHaveBeenLastCalledWith([20, 70])
    })

    it('keeps the handles from crossing', () => {
        const { onUpdate, element } = build({ values: [20, 80], connect: 'range' })
        const lower = handles()[0]
        fire(lower, 'pointerdown', { clientX: 40, clientY: 6, button: 0, pointerId: 1 })
        fire(element, 'pointermove', { clientX: 190, clientY: 6, pointerId: 1 })
        expect(onUpdate).toHaveBeenLastCalledWith([80, 80])
    })

    it('ignores a non-primary button', () => {
        const { onUpdate, element } = build({ values: [40] })
        fire(element, 'pointerdown', { clientX: 100, clientY: 6, button: 2, pointerId: 1 })
        expect(onUpdate).not.toHaveBeenCalled()
    })

    it('stops moving after the pointer is released', () => {
        const { onUpdate, element } = build({ values: [0] })
        drag(element, 20)
        fire(element, 'pointerup', { clientX: 20, clientY: 6, pointerId: 1 })
        onUpdate.mockClear()
        fire(element, 'pointermove', { clientX: 180, clientY: 6, pointerId: 1 })
        expect(onUpdate).not.toHaveBeenCalled()
    })

    it('treats a cancelled pointer as a finished drag', () => {
        const { onUpdate, element } = build({ values: [0] })
        drag(element, 20)
        fire(element, 'pointercancel', { clientX: 20, clientY: 6, pointerId: 1 })
        onUpdate.mockClear()
        fire(element, 'pointermove', { clientX: 180, clientY: 6, pointerId: 1 })
        expect(onUpdate).not.toHaveBeenCalled()
    })
})

describe('keyboard', () => {
    it('steps with the arrows', () => {
        // noUiSlider's handles were divs with no keyboard support at all, so
        // this field could not be filled in without a pointer.
        const { onUpdate } = build({ values: [40] })
        fire(handles()[0], 'keydown', { key: 'ArrowRight' })
        expect(onUpdate).toHaveBeenLastCalledWith([41])
        fire(handles()[0], 'keydown', { key: 'ArrowLeft' })
        expect(onUpdate).toHaveBeenLastCalledWith([40])
    })

    it('jumps by ten steps with PageUp and PageDown', () => {
        const { onUpdate } = build({ values: [40] })
        fire(handles()[0], 'keydown', { key: 'PageUp' })
        expect(onUpdate).toHaveBeenLastCalledWith([50])
    })

    it('goes to the ends with Home and End', () => {
        const { onUpdate } = build({ values: [40] })
        fire(handles()[0], 'keydown', { key: 'End' })
        expect(onUpdate).toHaveBeenLastCalledWith([100])
        fire(handles()[0], 'keydown', { key: 'Home' })
        expect(onUpdate).toHaveBeenLastCalledWith([0])
    })

    it('moves only its own handle', () => {
        const { onUpdate } = build({ values: [20, 80], connect: 'range' })
        fire(handles()[1], 'keydown', { key: 'ArrowRight' })
        expect(onUpdate).toHaveBeenLastCalledWith([20, 81])
    })
})

describe('steps', () => {
    it('snaps to the step grid measured from min', () => {
        const { onUpdate, element } = build({ min: 5, max: 105, step: 10, values: [5] })
        drag(element, 100) // half way = 55
        expect(onUpdate).toHaveBeenLastCalledWith([55])
    })

    it('does not produce floating point noise', () => {
        const { onUpdate } = build({ min: 0, max: 1, step: 0.1, values: [0] })
        fire(handles()[0], 'keydown', { key: 'ArrowRight' })
        fire(handles()[0], 'keydown', { key: 'ArrowRight' })
        fire(handles()[0], 'keydown', { key: 'ArrowRight' })
        expect(onUpdate).toHaveBeenLastCalledWith([0.3])
    })
})

describe('setValues', () => {
    it('repaints and reports', () => {
        const { onUpdate } = build({ values: [40] })
        slider!.setValues([90])
        expect(handles()[0].style.left).toBe('90%')
        expect(onUpdate).toHaveBeenLastCalledWith([90])
        expect(slider!.values()).toEqual([90])
    })
})
