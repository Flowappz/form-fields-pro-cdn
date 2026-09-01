import { readFieldConfig, type FieldType } from '@flowappz/ffp-config'
import { buildPayload, send } from './beacon'
import type { ChunkApi } from './chunk-api'
import { delegate, h, injectStyle, on, ready } from './dom'
import { applyTheme, schemeResolverCss, tokenToVar } from './theme'
import {
    canMountFields,
    fetchLicense,
    isFieldDisabled,
    isUsingWebflowDomain,
    UNLICENSED_WARNING,
    type LicenseState,
} from './license'
import { installConditionalLogic, FORM_STATE } from './conditional'
import { initMultiStepForms, STEPS_RAIL_CSS } from './multistep'
import { installFormSubmission } from './submit'
import { installValidationEvents } from './validate'
import { registerDialCodes } from './phone-value'
import { MANIFEST, VERSION } from './manifest.generated'
import { results as chunkResults } from './loader'
import {
    definedTypes,
    defineField,
    destroy,
    getInstance,
    isMountAllowed,
    mountAll,
    mountErrors,
    observe,
    setChunkApi,
    setMountAllowed,
} from './registry'
import { detectTypes, FIELD_SELECTORS } from './selectors'

export type { ChunkApi } from './chunk-api'
export * from './dom'
export * from './color'
export * from './focus'
export * from './forms'
export * from './conditional'
export * from './multistep'
export * from './phone-value'
export * from './submit'
export * from './validate'
export * from './theme'
export * from './loader'
export * from './registry'
export * from './selectors'
export * from './license'
export type { ChunkEntry, ChunkManifest } from './manifest'

/** Substituted by `scripts/upload.mjs`. Core only - chunks never see these. */
const LICENSE_URL = '__FFP_LICENSE_URL__'
const BEACON_URL = '__FFP_BEACON_URL__'
const DATA_CLIENT_URL = '__FFP_DATA_CLIENT_URL__'
const SUBMISSION_SECRET = '__FFP_SUBMISSION_SECRET__'

const substituted = (value: string) => value.indexOf('__FFP_') !== 0

/**
 * Webflow exposes the site id on the html element of every published page. It is
 * the only stable identifier available client-side.
 */
function readSiteId(): string | null {
    return document.documentElement.getAttribute('data-wf-site')
}

let license: LicenseState | null = null

/**
 * Placeholders resolve in core and are forwarded, never read by a chunk.
 *
 * Chunks are environment-independent by contract: the same bytes serve staging
 * and production, which is what lets them be content-addressed and cached
 * immutably. `scripts/build.mjs` fails the build if a chunk contains a token.
 */
function buildChunkApi(): ChunkApi {
    return {
        version: VERSION,
        config: {
            dataClientUrl: DATA_CLIENT_URL,
            licenseUrl: LICENSE_URL,
        },
        defineField,
        readFieldConfig,
        dom: { h, on, delegate, injectStyle },
        registerDialCodes,
        theme: { applyTheme, schemeResolverCss, tokenToVar },
    }
}

/**
 * Designer preview mode.
 *
 * The builder's field rows mount the real published widget instead of drawing a
 * React imitation of one, which means core runs inside the Designer extension's
 * iframe - a page that is not a published site and has no business asking the
 * licence service anything or binding a submit handler.
 *
 * Set `window.__ffpPreview = true` before the script tag. Everything below the
 * mount - validation, the submit guard, the submission post, conditional logic,
 * multi-step - is skipped, because there is no form here and a preview that can
 * post a submission is a bug waiting for its first customer.
 */
function isPreviewMode(): boolean {
    return (window as unknown as { __ffpPreview?: boolean }).__ffpPreview === true
}

async function boot(): Promise<void> {
    // Designer leaves a grey Number Slider stand-in on the canvas. Published
    // pages load this script; hide it before the slider chunk arrives so it
    // cannot sit above the live track and read as a shadow.
    injectStyle(
        'ffp-designer-standins',
        '[data-ffp-slider-placeholder],.fa-slider-placeholder{display:none!important;width:0!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;visibility:hidden!important;position:absolute!important;clip:rect(0,0,0,0)!important;pointer-events:none!important}',
    )
    // Before the licence wait: a 19-step rail otherwise paints across the page
    // for up to 1500 ms while we ask whether this site may mount widgets.
    injectStyle('ffp-steps-rail', STEPS_RAIL_CSS)
    document.querySelectorAll('[data-ffp-slider-placeholder]').forEach((node) => node.remove())

    const siteId = readSiteId()

    if (isPreviewMode()) {
        setChunkApi(buildChunkApi())
        // Not an entitlement decision: nothing here is published and nothing is
        // submitted. Withholding the widgets would only hide the thing the
        // preview exists to show.
        setMountAllowed(true)
        await mountAll(document, VERSION)
        observe(VERSION)
        return
    }

    // Kick the license request off in parallel with the DOM scan, then wait for
    // it - but not forever. The mount is gated on the answer (see
    // `canMountFields`), so this is the one thing on the critical path; the
    // 1500 ms bound is what stops a hung licence request from holding a
    // customer's fields hostage. Timing out resolves to *unknown*, not to
    // licensed, and unknown mounts.
    const licensePromise = substituted(LICENSE_URL)
        ? fetchLicense(LICENSE_URL, siteId)
        : // An unsubstituted build is a local one: there is no licence service
          // to ask, so the answer is unknown and the fields mount.
          Promise.resolve<LicenseState>({ active: false, stale: true })

    setChunkApi(buildChunkApi())

    const staging = isUsingWebflowDomain()
    const present = detectTypes(document)
    license = await Promise.race([
        licensePromise,
        new Promise<LicenseState>((resolve) =>
            setTimeout(() => resolve({ active: false, disabledFields: [], forceLegacy: false, stale: true }), 1500),
        ),
    ])

    if (license.forceLegacy) return

    // Withholding the widgets is an entitlement decision and it is the only
    // thing the licence decides here. The submission half below is installed
    // either way.
    setMountAllowed(canMountFields(license, staging))
    if (!isMountAllowed()) console.warn(UNLICENSED_WARNING)

    await mountAll(document, VERSION)

    // Everything below is the submission half of the runtime, and it is bound
    // whether or not a single widget mounted - including on an unlicensed
    // production site, where every widget was withheld on purpose. A field that
    // did not mount leaves a native input behind that still has to validate and
    // still has to submit; the one thing a form must never do is silently stop
    // working. 5.1.5 returned before installing any of this and leaned on
    // Webflow's own handler to catch the lead; binding it ourselves keeps the
    // same outcome without depending on that.
    installValidationEvents(document)

    const submission = {
        dataClientUrl: DATA_CLIENT_URL,
        submissionSecret: substituted(SUBMISSION_SECRET) ? SUBMISSION_SECRET : '',
        // The full licence answer, not the 1500 ms race above: the mount accepts a
        // timeout as "unknown, go ahead", but the backend post is a billing
        // decision and must wait for a real answer. By submit time it has long
        // resolved. This one stays fail-closed on an outage, unchanged from
        // 5.1.5 - an unknown answer skips the post, and the lead still reaches
        // Webflow. Loosening that is tracked separately.
        // An unsubstituted build is a local one, where posting to a placeholder
        // URL is not something to attempt.
        isLicensed: () =>
            substituted(LICENSE_URL)
                ? licensePromise.then((state) => state.active)
                : Promise.resolve(false),
        isStaging: () => isUsingWebflowDomain(),
    }
    installFormSubmission(submission)

    const conditional = installConditionalLogic(document)
    initMultiStepForms(document)

    observe(VERSION, () => {
        installFormSubmission(submission)
        initMultiStepForms(document)
        conditional.refresh()
    })

    if (substituted(BEACON_URL)) {
        send(BEACON_URL, buildPayload(VERSION, siteId, present))
    }
}

/**
 * The single global. Support has no console handle at all today, which is why
 * every "the field just doesn't appear" ticket starts from zero.
 */
const FormFieldsPro = {
    version: VERSION,
    mount: (root: ParentNode = document) => mountAll(root, VERSION),
    destroy,
    get: getInstance,
    fields: () => definedTypes(),

    __debug: {
        /** Everything needed to diagnose a page, in one object. */
        report() {
            const mounted = Array.from(document.querySelectorAll('[data-ffp-mounted]')).map((el) => ({
                type: el.getAttribute('data-ffp-mounted') as FieldType,
                config: safeConfig(el),
                hasInstance: Boolean(getInstance(el)),
            }))
            return {
                version: VERSION,
                siteId: readSiteId(),
                detected: detectTypes(document),
                registered: definedTypes(),
                mounted,
                chunks: chunkResults.slice(),
                manifest: Object.keys(MANIFEST),
                mountErrors: mountErrors.slice(),
                license,
                mountAllowed: isMountAllowed(),
            }
        },
        selectors: FIELD_SELECTORS,
        formState: () => ({ ...FORM_STATE }),
        readFieldConfig,
        isFieldDisabled: (type: FieldType) => isFieldDisabled(license, type),
    },
}

function safeConfig(el: Element) {
    const type = el.getAttribute('data-ffp-mounted') as FieldType | null
    if (!type) return null
    try {
        return readFieldConfig(el, type)
    } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) }
    }
}

declare global {
    interface Window {
        FormFieldsPro: typeof FormFieldsPro
        __ffpDefine: typeof import('./loader').define
    }
}

export { FormFieldsPro }

export function start(): void {
    window.FormFieldsPro = FormFieldsPro
    ready(() => {
        void boot().catch((err) => console.warn('Form Fields Pro: boot failed', err))
    })
}
