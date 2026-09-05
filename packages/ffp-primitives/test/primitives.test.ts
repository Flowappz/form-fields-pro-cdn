import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computePosition, type FloatingOptions, type Placement } from '../src/floating'
import { layerZIndex, openLayer, openLayerCount, resetLayers } from '../src/layer'
import { createListbox, filterOptions, type ListboxOption } from '../src/listbox'
import { fire } from './setup'

const opts = (over: Partial<FloatingOptions> = {}): Required<Omit<FloatingOptions, 'zIndex'>> => ({
    placement: 'bottom-start',
    offset: 4,
    flip: true,
    shift: true,
    matchWidth: true,
    portal: true,
    ...over,
})

const rect = (top: number, left: number, width: number, height: number): DOMRect =>
    ({ top, left, width, height, bottom: top + height, right: left + width } as DOMRect)

describe('computePosition', () => {
    it('sits below the anchor when there is room', () => {
        const result = computePosition(rect(100, 20, 200, 40), { width: 200, height: 150 }, { width: 1000, height: 800 }, opts())
        expect(result.placement).toBe('bottom-start')
        expect(result.top).toBe(144)
        expect(result.left).toBe(20)
    })

    it('flips above when below cannot fit and above is roomier', () => {
        const result = computePosition(rect(600, 20, 200, 40), { width: 200, height: 300 }, { width: 1000, height: 700 }, opts())
        expect(result.placement).toBe('top-start')
        expect(result.top).toBe(600 - 300 - 4)
    })

    it('does not flip into an equally cramped space', () => {
        // 40 px above, 40 px below, a 300 px dropdown. Flipping would move the
        // problem and make the widget jump as the visitor scrolls past.
        const result = computePosition(rect(44, 20, 200, 40), { width: 200, height: 300 }, { width: 1000, height: 128 }, opts())
        expect(result.placement).toBe('bottom-start')
    })

    it('aligns the right edge for an -end placement', () => {
        const result = computePosition(
            rect(100, 500, 200, 40),
            { width: 320, height: 100 },
            { width: 1000, height: 800 },
            opts({ placement: 'bottom-end' as Placement, shift: false }),
        )
        expect(result.left).toBe(700 - 320)
    })

    it('shifts a dropdown that would overflow the viewport back inside', () => {
        const result = computePosition(rect(100, 900, 120, 40), { width: 300, height: 100 }, { width: 1000, height: 800 }, opts())
        expect(result.left).toBe(1000 - 300 - 8)
    })

    it('never shifts past the left margin', () => {
        const result = computePosition(rect(100, -50, 120, 40), { width: 300, height: 100 }, { width: 200, height: 800 }, opts())
        expect(result.left).toBe(8)
    })
})

describe('filterOptions', () => {
    const options: ListboxOption[] = [
        { value: 'tn', label: 'Tunisia', keywords: 'TN 216' },
        { value: 'us', label: 'United States', keywords: 'US 1' },
        { value: 'gb', label: 'United Kingdom', keywords: 'GB 44' },
    ]

    it('returns everything for an empty query', () => {
        expect(filterOptions(options, '   ')).toHaveLength(3)
    })

    it('ranks prefix matches above substring matches', () => {
        // The Select2 bug this primitive exists to fix: typing "uni" offered
        // Tunisia first, because it only ever did a substring match.
        expect(filterOptions(options, 'uni').map((o) => o.value)).toEqual(['us', 'gb', 'tn'])
    })

    it('matches keywords as well as labels', () => {
        expect(filterOptions(options, '216').map((o) => o.value)).toEqual(['tn'])
    })
})

describe('layer stack', () => {
    beforeEach(() => resetLayers())

    const layer = (onClose: () => void) => {
        const element = document.createElement('div')
        document.body.appendChild(element)
        return { element, close: openLayer({ element, onClose }) }
    }

    it('closes only the topmost layer on an outside pointerdown', () => {
        const outerClosed = vi.fn()
        const innerClosed = vi.fn()
        const outer = layer(outerClosed)
        layer(innerClosed)

        fire(outer.element, 'pointerdown')

        expect(innerClosed).toHaveBeenCalledTimes(1)
        expect(outerClosed).not.toHaveBeenCalled()
        expect(openLayerCount()).toBe(1)
    })

    it('keeps a layer open when the click is on its anchor', () => {
        const closed = vi.fn()
        const anchor = document.createElement('button')
        document.body.appendChild(anchor)
        const element = document.createElement('div')
        document.body.appendChild(element)
        openLayer({ element, anchors: [anchor], onClose: closed })

        fire(anchor, 'pointerdown')

        expect(closed).not.toHaveBeenCalled()
    })

    it('closes the topmost layer on Escape and stops the page seeing it', () => {
        const closed = vi.fn()
        layer(closed)
        let prevented = false
        const event = fire(document.body, 'keydown', {
            key: 'Escape',
            preventDefault: () => {
                prevented = true
            },
            stopPropagation: () => {},
        })

        expect(closed).toHaveBeenCalledTimes(1)
        expect(prevented).toBe(true)
        expect(event.type).toBe('keydown')
    })

    it('ignores a second call to the same closer', () => {
        const closed = vi.fn()
        const first = layer(closed)
        first.close()
        first.close()
        expect(closed).toHaveBeenCalledTimes(1)
    })

    it('stacks z-indexes so a nested layer renders over its parent', () => {
        const base = layerZIndex()
        layer(() => {})
        expect(layerZIndex()).toBe(base + 1)
    })
})

describe('createListbox', () => {
    const options: ListboxOption[] = [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Bravo', disabled: true },
        { value: 'c', label: 'Charlie' },
    ]

    const nodes = (root: HTMLElement) =>
        Array.from(root.querySelectorAll('.ffp-listbox-option')) as HTMLElement[]

    it('renders a search box only when asked', () => {
        const plain = createListbox({ id: 'x', options, searchable: false, onSelect: () => {} })
        expect(plain.element.querySelector('.ffp-listbox-search')).toBeNull()

        const searching = createListbox({ id: 'y', options, searchable: true, onSelect: () => {} })
        expect(searching.element.querySelector('.ffp-listbox-search')).not.toBeNull()
    })

    it('starts active on the selected option', () => {
        const handle = createListbox({ id: 'x', options, value: 'c', onSelect: () => {} })
        expect(nodes(handle.element)[2].classList.contains('is-active')).toBe(true)
        expect(nodes(handle.element)[2].getAttribute('aria-selected')).toBe('true')
    })

    it('skips disabled options when arrowing', () => {
        const handle = createListbox({ id: 'x', options, value: 'a', onSelect: () => {} })
        const list = handle.element.querySelector('.ffp-listbox-list') as HTMLElement
        fire(list, 'keydown', { key: 'ArrowDown', preventDefault: () => {} })
        expect(nodes(handle.element)[2].classList.contains('is-active')).toBe(true)
    })

    it('commits on Enter and asks to be dismissed', () => {
        const onSelect = vi.fn()
        const onDismiss = vi.fn()
        const handle = createListbox({ id: 'x', options, value: 'a', onSelect, onDismiss })
        const list = handle.element.querySelector('.ffp-listbox-list') as HTMLElement
        fire(list, 'keydown', { key: 'Enter', preventDefault: () => {} })
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'a' }))
        expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('commits on Tab, the way a native select does', () => {
        const onSelect = vi.fn()
        const handle = createListbox({ id: 'x', options, value: 'c', onSelect })
        const list = handle.element.querySelector('.ffp-listbox-list') as HTMLElement
        fire(list, 'keydown', { key: 'Tab' })
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'c' }))
    })

    it('ignores a click on a disabled option', () => {
        const onSelect = vi.fn()
        const handle = createListbox({ id: 'x', options, onSelect })
        fire(nodes(handle.element)[1], 'click')
        expect(onSelect).not.toHaveBeenCalled()
    })

    it('selects on click', () => {
        const onSelect = vi.fn()
        const handle = createListbox({ id: 'x', options, onSelect })
        fire(nodes(handle.element)[2], 'click')
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'c' }))
    })

    it('selects on pointerup, because preventDefault on pointerdown suppresses click', () => {
        // A real mouse: canceled pointerdown → no click. The live select field
        // sat open over Submit and every option press did nothing.
        const onSelect = vi.fn()
        const onDismiss = vi.fn()
        const handle = createListbox({ id: 'x', options, onSelect, onDismiss })
        fire(nodes(handle.element)[2], 'pointerdown')
        fire(nodes(handle.element)[2], 'pointerup')
        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'c' }))
        expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('shows the empty state when a search matches nothing', () => {
        const handle = createListbox({ id: 'x', options, searchable: true, emptyText: 'Nope', onSelect: () => {} })
        const search = handle.element.querySelector('.ffp-listbox-search') as HTMLInputElement
        search.value = 'zzz'
        fire(search, 'input')
        expect(nodes(handle.element)).toHaveLength(0)
        const empty = handle.element.querySelector('.ffp-listbox-empty') as HTMLElement
        expect(empty.hidden).toBe(false)
        expect(empty.textContent).toBe('Nope')
    })
})
