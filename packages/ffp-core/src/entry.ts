/**
 * Bundle entry point for the core script Webflow registers.
 *
 * Publishing `__ffpDefine` before anything else matters: a chunk can arrive from
 * cache before core has finished executing, and it must find the hook already
 * there rather than throwing and losing its factory.
 */
import { define } from './loader'
import { start } from './index'

window.__ffpDefine = define
start()
