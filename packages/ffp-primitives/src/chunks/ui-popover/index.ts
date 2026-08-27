/**
 * `ui-popover` shared chunk: floating + layer + listbox.
 *
 * Loaded once and reused by select, phone and date. Declared as a dependency in
 * each of their `deps.json`, so the loader fetches it first and fails the
 * dependant if it does not arrive - a listbox-less select is worse than a native
 * select, and core leaves the native one alone when a chunk fails.
 */
import { positionFloating } from '../../floating'
import { layerZIndex, openLayer } from '../../layer'
import { createListbox, LISTBOX_CSS } from '../../listbox'
import type { PopoverApi } from '../../shared-types'

const api: PopoverApi = { positionFloating, openLayer, layerZIndex, createListbox, LISTBOX_CSS }

window.__ffpShared = window.__ffpShared || {}
window.__ffpShared.popover = api

// Register with core so the loader's promise resolves on the code having
// actually run, rather than on the script tag firing `load`.
const define = (window as unknown as { __ffpDefine?: (key: string, factory: () => void) => void })
    .__ffpDefine
if (define) define('ui-popover', () => {})
