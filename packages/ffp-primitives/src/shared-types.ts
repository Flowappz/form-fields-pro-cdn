import type { createListbox } from './listbox'
import type { layerZIndex, openLayer } from './layer'
import type { positionFloating } from './floating'

/**
 * The surface the `ui-popover` chunk publishes for field chunks to consume.
 *
 * Field chunks must NOT import the primitives directly: esbuild would inline
 * them into every chunk that uses them, and the select, phone and date chunks
 * would each carry their own copy of the listbox. The whole point of a shared
 * chunk is that those three pay for it once.
 *
 * This module is types only, so importing it costs zero bytes.
 */
export type PopoverApi = {
    positionFloating: typeof positionFloating
    openLayer: typeof openLayer
    layerZIndex: typeof layerZIndex
    createListbox: typeof createListbox
    // `string`, not `typeof LISTBOX_CSS`: that const has a literal type, and
    // pinning the whole stylesheet into the contract makes any edit to it a
    // type error at every consumer.
    LISTBOX_CSS: string
}

declare global {
    interface Window {
        __ffpShared?: { popover?: PopoverApi }
    }
}
