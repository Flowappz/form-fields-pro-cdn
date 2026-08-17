/**
 * FORM FIELDS PRO CDN SCRIPT - v5.1.3
 * pnpm release:staging -- --version 5.1.3
 * Vendors (Select2, noUiSlider, easepick, etc.) load on demand.
 *
 * Release-time placeholders (replaced by scripts/upload.mjs):
 *   __FFP_DATA_CLIENT_URL__
 *   __FFP_EMAIL_NOTIFIER_URL__
 */

const FFP_DATA_CLIENT_URL = (() => {
    const injected = '__FFP_DATA_CLIENT_URL__'
    return injected.includes('__FFP_')
        ? 'https://flowapps-data-client-staging.up.railway.app'
        : injected
})()
const FFP_EMAIL_NOTIFIER_URL = (() => {
    const injected = '__FFP_EMAIL_NOTIFIER_URL__'
    return injected.includes('__FFP_')
        ? 'https://form-fields-pro-email-notifier-staging.up.railway.app'
        : injected
})()
const FFP_SUBMISSION_SECRET = (() => {
    const injected = '__FFP_SUBMISSION_SECRET__'
    return injected.includes('__FFP_') ? '' : injected
})()

async function buildSubmissionHeaders(siteId, formId) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    if (!FFP_SUBMISSION_SECRET || !window.crypto?.subtle) return headers

    const timestamp = String(Date.now())
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(FFP_SUBMISSION_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    )
    const sigBuf = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(`${siteId}:${formId}:${timestamp}`),
    )
    headers['X-FFP-Timestamp'] = timestamp
    headers['X-FFP-Signature'] = [...new Uint8Array(sigBuf)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    return headers
}

const EMAIL_PATTERN_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const URL_PATTERN_REGEX =
    /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/
/** Plain text / Name: at least 2 Unicode letters (rejects "123", allows "Eve/Ed/Jo"). */
const PLAIN_TEXT_MIN_LETTERS = 2

/** @type {Record<string, Promise<void>>} */
const __ffpAssetCache = {}

/** Load an external script once. */
function loadScript(src) {
    if (__ffpAssetCache[src]) return __ffpAssetCache[src]
    __ffpAssetCache[src] = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`)
        if (existing) {
            if (existing.dataset.ffpLoaded === '1' || existing.getAttribute('data-ffp-loaded') === '1') {
                return resolve()
            }
            // Script tag already present and likely finished loading before we attached listeners
            if (existing.readyState === 'complete' || existing.readyState === 'loaded') {
                existing.dataset.ffpLoaded = '1'
                return resolve()
            }
            existing.addEventListener('load', () => {
                existing.dataset.ffpLoaded = '1'
                resolve()
            })
            existing.addEventListener('error', () => reject(new Error('Failed to load ' + src)))
            // Safety timeout — avoid hanging forever if load already fired
            setTimeout(() => {
                existing.dataset.ffpLoaded = '1'
                resolve()
            }, 3000)
            return
        }
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => {
            script.dataset.ffpLoaded = '1'
            resolve()
        }
        script.onerror = () => reject(new Error('Failed to load ' + src))
        document.head.appendChild(script)
    })
    return __ffpAssetCache[src]
}

/** Load an external stylesheet once. */
function loadStylesheet(href) {
    if (__ffpAssetCache[href]) return __ffpAssetCache[href]
    __ffpAssetCache[href] = new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) return resolve()
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = () => resolve()
        link.onerror = () => reject(new Error('Failed to load ' + href))
        document.head.appendChild(link)
    })
    return __ffpAssetCache[href]
}

/** Inject a style tag once (keyed by id). */
function injectStyle(id, css) {
    let style = document.getElementById(id)
    if (!style) {
        style = document.createElement('style')
        style.id = id
        document.head.appendChild(style)
    }
    style.textContent = css
}

const sleep = (ms = 5) => new Promise((resolve) => setTimeout(resolve, ms))

/** Date pickers (easepick — honors months, columns, language, format, first day) */
const formFieldsDateInput = async () => {
    const selectors = {
        DATE_PICKER: '[form-fields-pro-date-picker]',
        DATE_RANGE_PICKER: '[form-fields-pro-date-range-picker]',
    }

    const hasDateFields =
        document.querySelector(selectors.DATE_PICKER) ||
        document.querySelector(selectors.DATE_RANGE_PICKER)
    if (!hasDateFields) return

    await loadScript('https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.umd.min.js')
    if (typeof window.easepick?.create !== 'function') {
        console.warn('Form Fields Pro: easepick.create is not available')
        return
    }

    const datePickerState = {}
    const EASEPICK_CSS = 'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css'

    const clamp = (value, min, max, fallback) => {
        const n = Number(value)
        if (!Number.isFinite(n)) return fallback
        return Math.min(max, Math.max(min, n))
    }

    const toFirstDay = (raw) => {
        const day = Number(raw)
        if (!Number.isFinite(day)) return 0
        if (day === 7) return 0
        if (day < 0 || day > 6) return 0
        return day
    }

    const toLang = (raw) => {
        if (!raw || raw === 'en') return 'en-US'
        return raw
    }

    const toRgba = (color, alpha) => {
        const value = String(color || '').trim()
        if (!value) return `rgba(20, 110, 245, ${alpha})`
        if (value.startsWith('rgba(')) return value
        if (value.startsWith('rgb(')) return value.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
        if (value[0] === '#' && (value.length === 4 || value.length === 7)) {
            let hex = value.slice(1)
            if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
            const n = parseInt(hex, 16)
            return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
        }
        return value
    }

    const pickerThemeCss = (element) => {
        const lightBg =
            element.getAttribute('data-light-theme-selected-date-background-color') || 'rgb(20, 110, 245)'
        const lightText = element.getAttribute('data-light-theme-selected-date-text-color') || '#ffffff'
        const lightToday = element.getAttribute('data-light-theme-today-color') || lightBg
        const darkBg =
            element.getAttribute('data-dark-theme-selected-date-background-color') || lightBg
        const darkText = element.getAttribute('data-dark-theme-selected-date-text-color') || '#ffffff'
        const darkToday = element.getAttribute('data-dark-theme-today-color') || 'rgb(147, 197, 253)'

        return `
      :host {
        font-family: inherit;
        font-size: 13px;
        color: #111827;
      }
      .container {
        padding: 10px;
        max-width: calc(100vw - 24px);
      }
      .container.show {
        display: inline-block;
        height: auto !important;
        overflow: visible;
        transform: scale(1) !important;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.14);
      }
      .calendar {
        padding: 4px 6px 8px;
      }
      .header {
        margin-bottom: 6px;
      }
      .header button {
        border-radius: 8px;
      }
      .dayname {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #6b7280;
      }
      .days-grid > .day {
        border-radius: 8px;
        font-weight: 500;
      }
      .days-grid > .day:hover {
        background-color: ${toRgba(lightBg, 0.12)};
      }
      .days-grid > .day.today {
        color: ${lightToday};
        font-weight: 600;
        box-shadow: inset 0 0 0 1.5px ${lightToday};
      }
      .days-grid > .day.selected,
      .container.range-plugin .days-grid > .day.start,
      .container.range-plugin .days-grid > .day.end {
        color: ${lightText} !important;
        background-color: ${lightBg} !important;
        box-shadow: none;
      }
      .container.range-plugin .days-grid > .day.in-range {
        color: #111827;
        background-color: ${toRgba(lightBg, 0.14)};
        border-radius: 0;
      }
      .amp-plugin-unit select {
        border-radius: 8px;
        border-color: #e5e7eb;
        font: inherit;
        padding: 4px 8px;
      }
      @media (prefers-color-scheme: dark) {
        :host, .container { color: #f3f4f6; background: #111827; border-color: #374151; }
        .dayname { color: #9ca3af; }
        .days-grid > .day:hover { background-color: ${toRgba(darkBg, 0.28)}; }
        .days-grid > .day.today { color: ${darkToday}; box-shadow: inset 0 0 0 1.5px ${darkToday}; }
        .days-grid > .day.selected,
        .container.range-plugin .days-grid > .day.start,
        .container.range-plugin .days-grid > .day.end {
          color: ${darkText} !important;
          background-color: ${darkBg} !important;
        }
        .container.range-plugin .days-grid > .day.in-range {
          color: ${darkText};
          background-color: ${toRgba(darkBg, 0.22)};
        }
      }
    `
    }

    const applyPickerTheme = (picker, element) => {
        const root = picker?.ui?.shadowRoot
        if (!root || root.querySelector('style[data-ffp-date-theme]')) return
        const style = document.createElement('style')
        style.setAttribute('data-ffp-date-theme', '1')
        style.textContent = pickerThemeCss(element)
        root.appendChild(style)
    }

    let easepickCssText = ''
    try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 4000)
        const cssRes = await fetch(EASEPICK_CSS, { signal: controller.signal })
        clearTimeout(timer)
        if (cssRes.ok) easepickCssText = await cssRes.text()
    } catch (err) {
        console.warn('Form Fields Pro: Failed to fetch easepick CSS', err)
    }

    const bindDatePicker = (inputElement, { range = false } = {}) => {
        if (inputElement.dataset.ffpDateInit === '1') return
        inputElement.dataset.ffpDateInit = '1'

        const formFieldsId = `${inputElement.getAttribute('name') || inputElement.id || 'date'}-${Date.now()}`
        inputElement.setAttribute('form-fields-id', formFieldsId)

        const calendars = clamp(inputElement.getAttribute('data-months'), 1, 12, 1)
        const grid = Math.min(clamp(inputElement.getAttribute('data-columns'), 1, 12, 1), calendars)
        const firstDay = toFirstDay(inputElement.getAttribute('data-firstDay'))
        const lang = toLang(inputElement.getAttribute('data-language'))
        const format = inputElement.getAttribute('data-format') || 'MM/DD/YYYY'
        const zIndex = clamp(inputElement.getAttribute('data-zIndex'), 1, 2147483647, 999)

        const plugins = ['AmpPlugin']
        const AmpPlugin = {
            dropdown: { months: true, years: true },
            resetButton: true,
        }
        const RangePlugin = range ? { delimiter: ' - ', tooltip: true } : null
        if (range) plugins.unshift('RangePlugin')

        const revealWrapper = (picker) => {
            const wrap = picker?.ui?.wrapper
            if (!wrap) return
            wrap.style.display = ''
            wrap.style.pointerEvents = 'auto'
            wrap.style.zIndex = String(zIndex)
        }

        let picker
        try {
            // easepick.create is a class — calling it without `new` throws and the
            // calendar never binds, so clicks appear to do nothing.
            picker = new window.easepick.create({
                element: inputElement,
                css: easepickCssText ? `${easepickCssText}\n${pickerThemeCss(inputElement)}` : [EASEPICK_CSS],
                lang,
                format,
                firstDay,
                grid,
                calendars,
                zIndex,
                readonly: true,
                autoApply: true,
                plugins,
                AmpPlugin,
                ...(RangePlugin ? { RangePlugin } : {}),
            })
        } catch (err) {
            console.warn('Form Fields Pro: Date picker failed to initialize', err)
            inputElement.dataset.ffpDateInit = '0'
            return
        }

        revealWrapper(picker)
        applyPickerTheme(picker, inputElement)

        const openPicker = (event) => {
            event.preventDefault()
            revealWrapper(picker)
            picker.show(event)
        }

        picker.on('show', () => {
            datePickerState[formFieldsId] = true
            revealWrapper(picker)
            applyPickerTheme(picker, inputElement)
        })
        picker.on('render', () => applyPickerTheme(picker, inputElement))
        picker.on('hide', () => {
            datePickerState[formFieldsId] = false
        })

        inputElement.addEventListener('click', openPicker)

        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && datePickerState[formFieldsId]) {
                e.preventDefault()
            }
        })

        const parent = inputElement.parentElement
        const icon =
            parent?.querySelector('.date-input-icon, [data-date-input-icon]') ||
            inputElement.nextElementSibling
        if (icon) {
            icon.style.cursor = 'pointer'
            icon.addEventListener('click', (e) => {
                e.preventDefault()
                e.stopPropagation()
                revealWrapper(picker)
                picker.show(e)
            })
        }
    }

    injectStyle(
        'ffp-date-picker-host',
        `
    [form-fields-pro-date-picker],
    [form-fields-pro-date-range-picker] {
      cursor: pointer;
      padding-right: 44px;
    }
    .date-input-icon,
    [data-date-input-icon] {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .date-input-icon svg,
    [data-date-input-icon] svg {
      width: 18px;
      height: 18px;
    }
    .date-input-icon svg path,
    [data-date-input-icon] svg path {
      stroke: #6b7280;
    }
    `,
    )

    document.querySelectorAll(selectors.DATE_PICKER).forEach((el) => bindDatePicker(el))
    document.querySelectorAll(selectors.DATE_RANGE_PICKER).forEach((el) => bindDatePicker(el, { range: true }))
}

/** User IP inputs */
const formFieldsUserIp = async () => {
    if (!document.querySelector('[form-fields-pro-user-ip-input], [form-fields-pro-user-ip-admin-alert]')) return

    const hideAdminAlert = () => {

        const alertElements = document.querySelectorAll('[form-fields-pro-user-ip-admin-alert]')

        for (let element of alertElements) element.style.display = 'none'
    }

    const getUserIp = async () => {
        const BASE_URL = FFP_DATA_CLIENT_URL
        const res = await fetch(`${BASE_URL}/api/user-ip`)

        if (res.ok) {
            const { ip } = await res.json()
            return ip
        } else return ''
    }

    const collectUserIp = async () => {
        try {
            const ip = await getUserIp()
            const inputElements = document.querySelectorAll('[form-fields-pro-user-ip-input]')
            for (const input of inputElements) {
                input.value = ip
            }
        } catch (err) {
            console.warn('Form Fields Pro: Failed to collect user IP', err)
        }
    }

    hideAdminAlert()
    void collectUserIp()
}

/** Range sliders */
const formFieldsNumberSlider = async () => {
    if (!document.querySelector('[form-fields-pro-number-slider]')) return

    await loadStylesheet('https://cdn.jsdelivr.net/npm/nouislider@15.7.1/dist/nouislider.min.css')
    await loadScript('https://cdn.jsdelivr.net/npm/nouislider@15.7.1/dist/nouislider.min.js')

    const SLIDER_STYLE_DEFAULTS = {
        maxMinTextColorLight: 'rgb(26, 26, 26)',
        maxMinTextColorDark: 'rgb(245, 245, 245)',
        tooltipTextColorLight: 'rgb(255, 255, 255)',
        tooltipTextColorDark: 'rgb(255, 255, 255)',
        sliderColorLight: 'rgb(20, 110, 245)',
        sliderColorDark: 'rgb(20, 110, 245)',
        trackColorLight: 'rgb(237, 237, 237)',
        trackColorDark: 'rgb(80, 80, 80)',
    }

    injectStyle(
        'ffp-nouislider-overrides-v2',
        `
    .ffp-number-slider-wrap {
      --ffp-slider-color: var(--ffp-slider-color-light);
      --ffp-track-color: var(--ffp-track-color-light);
      --ffp-tooltip-text: var(--ffp-tooltip-text-light);
      --ffp-minmax-text: var(--ffp-minmax-text-light);
      margin-top: 28px;
    }
    @media (prefers-color-scheme: dark) {
      .ffp-number-slider-wrap {
        --ffp-slider-color: var(--ffp-slider-color-dark);
        --ffp-track-color: var(--ffp-track-color-dark);
        --ffp-tooltip-text: var(--ffp-tooltip-text-dark);
        --ffp-minmax-text: var(--ffp-minmax-text-dark);
      }
    }
    .ffp-number-slider-wrap .noUi-horizontal {
      height: 12px;
    }
    .ffp-number-slider-wrap .noUi-target {
      border: 1px solid var(--ffp-track-color);
      background: var(--ffp-track-color);
      border-radius: 11.5px;
      box-shadow: none;
    }
    .ffp-number-slider-wrap .noUi-connect {
      background: var(--ffp-slider-color);
    }
    .ffp-number-slider-wrap .noUi-horizontal .noUi-handle {
      width: 22px;
      height: 22px;
      right: -11px;
      top: -6px;
      border: none;
      border-radius: 50%;
      background: var(--ffp-slider-color);
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }
    .ffp-number-slider-wrap .noUi-handle:after,
    .ffp-number-slider-wrap .noUi-handle:before {
      display: none;
    }
    .ffp-number-slider-wrap .noUi-tooltip {
      border: none;
      color: var(--ffp-tooltip-text);
      background: var(--ffp-slider-color);
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }
    .ffp-slider-minmax {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      line-height: 16px;
      color: var(--ffp-minmax-text);
    }
    `,
    )

    const pick = (value, fallback) => (value && String(value).trim() ? value : fallback)
    const isWhite = (value) => {
        const normalized = String(value || '')
            .replace(/\s/g, '')
            .toLowerCase()
        return !normalized || normalized === 'rgb(255,255,255)' || normalized === '#ffffff' || normalized === '#fff' || normalized === 'white'
    }

    const parseSliderTheme = (raw) => {
        if (!raw) return null
        const parts = String(raw).split('~')
        if (parts.length < 8) return null
        return {
            maxMinTextColorLight: parts[0],
            tooltipTextColorLight: parts[1],
            sliderColorLight: parts[2],
            trackColorLight: parts[3],
            maxMinTextColorDark: parts[4],
            tooltipTextColorDark: parts[5],
            sliderColorDark: parts[6],
            trackColorDark: parts[7],
        }
    }

    const styleFromConfig = (element) => {
        try {
            const wrapper = element.closest('[data-field-config], [form-fields-wrapper]')
            const raw = wrapper && (wrapper.getAttribute('data-field-config') || wrapper.getAttribute('field-config'))
            return raw ? JSON.parse(raw).style || {} : {}
        } catch (err) {
            return {}
        }
    }

    const readTheme = (element) => {
        const fromTheme = parseSliderTheme(element.getAttribute('data-slider-theme')) || {}
        const fromConfig = styleFromConfig(element)
        const attr = (name) => element.getAttribute(name)
        const merged = {
            maxMinTextColorLight: pick(fromTheme.maxMinTextColorLight, pick(attr('data-light-theme-max-min-text-color'), fromConfig.maxMinTextColorLight)),
            maxMinTextColorDark: pick(fromTheme.maxMinTextColorDark, pick(attr('data-dark-theme-max-min-text-color'), fromConfig.maxMinTextColorDark)),
            tooltipTextColorLight: pick(fromTheme.tooltipTextColorLight, pick(attr('data-light-theme-tooltip-text-color'), fromConfig.tooltipTextColorLight)),
            tooltipTextColorDark: pick(fromTheme.tooltipTextColorDark, pick(attr('data-dark-theme-tooltip-text-color'), fromConfig.tooltipTextColorDark)),
            sliderColorLight: pick(fromTheme.sliderColorLight, pick(attr('data-light-theme-slider-color'), fromConfig.sliderColorLight)),
            sliderColorDark: pick(fromTheme.sliderColorDark, pick(attr('data-dark-theme-slider-color'), fromConfig.sliderColorDark)),
            trackColorLight: pick(fromTheme.trackColorLight, pick(attr('data-light-theme-track-color'), fromConfig.trackColorLight)),
            trackColorDark: pick(fromTheme.trackColorDark, pick(attr('data-dark-theme-track-color'), fromConfig.trackColorDark)),
        }
        const coreColors = [
            merged.maxMinTextColorLight,
            merged.maxMinTextColorDark,
            merged.tooltipTextColorLight,
            merged.tooltipTextColorDark,
            merged.sliderColorLight,
            merged.sliderColorDark,
        ]
        if (coreColors.every(isWhite)) return { ...SLIDER_STYLE_DEFAULTS }

        return {
            maxMinTextColorLight: pick(merged.maxMinTextColorLight, SLIDER_STYLE_DEFAULTS.maxMinTextColorLight),
            maxMinTextColorDark: pick(merged.maxMinTextColorDark, SLIDER_STYLE_DEFAULTS.maxMinTextColorDark),
            tooltipTextColorLight: pick(merged.tooltipTextColorLight, SLIDER_STYLE_DEFAULTS.tooltipTextColorLight),
            tooltipTextColorDark: pick(merged.tooltipTextColorDark, SLIDER_STYLE_DEFAULTS.tooltipTextColorDark),
            sliderColorLight: pick(merged.sliderColorLight, SLIDER_STYLE_DEFAULTS.sliderColorLight),
            sliderColorDark: pick(merged.sliderColorDark, SLIDER_STYLE_DEFAULTS.sliderColorDark),
            trackColorLight: pick(merged.trackColorLight, SLIDER_STYLE_DEFAULTS.trackColorLight),
            trackColorDark: pick(merged.trackColorDark, SLIDER_STYLE_DEFAULTS.trackColorDark),
        }
    }

    const applyTheme = (wrap, theme) => {
        const vars = {
            '--ffp-slider-color-light': theme.sliderColorLight,
            '--ffp-slider-color-dark': theme.sliderColorDark,
            '--ffp-track-color-light': theme.trackColorLight,
            '--ffp-track-color-dark': theme.trackColorDark,
            '--ffp-tooltip-text-light': theme.tooltipTextColorLight,
            '--ffp-tooltip-text-dark': theme.tooltipTextColorDark,
            '--ffp-minmax-text-light': theme.maxMinTextColorLight,
            '--ffp-minmax-text-dark': theme.maxMinTextColorDark,
        }
        Object.keys(vars).forEach((key) => wrap.style.setProperty(key, vars[key]))
    }

    const tooltipFormat = { to: (val) => Math.round(val), from: (val) => Number(val) }

    const createSliderWrap = (sliderInput, min, max) => {
        const existing = sliderInput.parentElement && sliderInput.parentElement.querySelector('.ffp-number-slider-wrap')
        if (existing) return null

        const wrap = document.createElement('div')
        wrap.className = 'ffp-number-slider-wrap'
        sliderInput.parentElement.appendChild(wrap)

        const container = document.createElement('div')
        wrap.appendChild(container)

        const labels = document.createElement('div')
        labels.className = 'ffp-slider-minmax'
        labels.innerHTML = `<span>${min}</span><span>${max}</span>`
        wrap.appendChild(labels)

        applyTheme(wrap, readTheme(sliderInput))
        return container
    }

    const initializeRegularSlider = (sliderInput) => {
        const min = Number(sliderInput.getAttribute('data-min'))
        const max = Number(sliderInput.getAttribute('data-max'))
        const defaultValue = Number(sliderInput.getAttribute('data-default'))
        const container = createSliderWrap(sliderInput, min, max)
        if (!container) return

        const slider = noUiSlider.create(container, {
            start: defaultValue,
            step: 1,
            connect: 'lower',
            tooltips: tooltipFormat,
            range: { min, max },
        })

        slider.on('update', (values) => {
            sliderInput.value = values.map((v) => Math.round(v)).join(',')
        })
    }

    const initializeRangeSlider = (sliderInput) => {
        const min = Number(sliderInput.getAttribute('data-min'))
        const max = Number(sliderInput.getAttribute('data-max'))
        const defaultmin = Number(sliderInput.getAttribute('data-min-default'))
        const defaultmax = Number(sliderInput.getAttribute('data-max-default'))
        const container = createSliderWrap(sliderInput, min, max)
        if (!container) return

        const slider = noUiSlider.create(container, {
            start: [defaultmin, defaultmax],
            step: 1,
            connect: [false, true, false],
            tooltips: [tooltipFormat, tooltipFormat],
            range: { min, max },
        })

        slider.on('update', (values) => {
            sliderInput.value = values.map((v) => Math.round(v)).join(',')
        })
    }

    const sliders = document.querySelectorAll('[form-fields-pro-number-slider]')
    for (const slider of sliders) {
        if (slider.getAttribute('allow-range')) initializeRangeSlider(slider)
        else initializeRegularSlider(slider)
        await sleep()
    }
}

/** Select inputs */
const formFieldsSelect = async () => {
    if (!document.querySelector('[form-fields-type="select"]')) return

    await loadStylesheet('https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css')
    await loadScript('https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js')

    const additionalCss = `
  .select2-container {
    height: 38px;
  }

  .selection {
    height: 100%;
    display: block;
  }

  .select2-container--default .select2-selection--single {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
  }

  .select2-container .select2-selection--single .select2-selection__rendered {
    padding: 0;
  }

  .select2-container--default .select2-selection--single .select2-selection__arrow {
    position: relative;
    top: 0;
    right: 0;
  }

  .select2-container--default .select2-selection--single .select2-selection__arrow b,
  .select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {
    border-color: transparent;
    border-width: 0;
    margin-top: -3px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDE0IDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNyA3TDEzIDEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=);
    height: 10px;
    width: 20px;
    background-repeat: no-repeat;
  }

  .select2-container--default .select2-selection--single {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0;
  }

  .select2-dropdown {
    border: 1px solid #ccc;
    border-radius: 0;
  }
 
  .select2-results__option--selectable {
    padding: 8px 12px;
    height: 38px;
  }

  .select2-search--dropdown .select2-search__field {
    padding: 8px 8px;
  }

  .select2-container--default .select2-selection--single:focus-visible,
  .select2-container--default .select2-search--dropdown .select2-search__field:focus-visible {
    outline: 0;
    border-color: #3898ec;
  }
  `

    const addSelect2Css = () => {
        injectStyle('ffp-select2-overrides', additionalCss)
    }

    const overrideCss = (element) => {
        const inputName = element.getAttribute('name')
        element.id = `${inputName.replace(' ', '')}-${Date.now()}`

        const lightTheme = {
            hoverTextColor: element.getAttribute('data-light-theme-hover-text-color'),
            hoverBackground: element.getAttribute('data-light-theme-hover-background-color'),
        }

        const darkTheme = {
            hoverTextColor: element.getAttribute('data-dark-theme-hover-text-color'),
            hoverBackground: element.getAttribute('data-dark-theme-hover-background-color'),
        }

        const sheet = new CSSStyleSheet()
        sheet.replaceSync(`
        #select2-${element.id}-results li.select2-results__option--highlighted {
          color: ${lightTheme.hoverTextColor};
          background: ${lightTheme.hoverBackground}
        }
    
        @media (prefers-color-scheme: dark) {
          #select2-${element.id}-results li.select2-results__option--highlighted {
            color: ${darkTheme.hoverTextColor};
            background: ${darkTheme.hoverBackground}
          }
        }
        `)

        const sheets = document.adoptedStyleSheets || []
        document.adoptedStyleSheets = [...sheets, sheet]
    }

    addSelect2Css()

    const selectInputs = document.querySelectorAll(`[form-fields-type="select"]`)
    for (let select of selectInputs) {
        overrideCss(select)
        const isSearchable = select.getAttribute('data-searchable')
        $(select).select2({
            minimumResultsForSearch: isSearchable ? 0 : Infinity,
        })
    }
}

/** Phone number inputs */
/** Compact country list: [name, ISO code, dial code] */
const countries = [["Afghanistan","AF",93],["Aland Islands","AX",358],["Albania","AL",355],["Algeria","DZ",213],["American Samoa","AS",1684],["Andorra","AD",376],["Angola","AO",244],["Anguilla","AI",1264],["Antarctica","AQ",672],["Antigua and Barbuda","AG",1268],["Argentina","AR",54],["Armenia","AM",374],["Aruba","AW",297],["Australia","AU",61],["Austria","AT",43],["Azerbaijan","AZ",994],["Bahamas","BS",1242],["Bahrain","BH",973],["Bangladesh","BD",880],["Barbados","BB",1246],["Belarus","BY",375],["Belgium","BE",32],["Belize","BZ",501],["Benin","BJ",229],["Bermuda","BM",1441],["Bhutan","BT",975],["Bolivia","BO",591],["Bonaire, Sint Eustatius and Saba","BQ",599],["Bosnia and Herzegovina","BA",387],["Botswana","BW",267],["Bouvet Island","BV",55],["Brazil","BR",55],["British Indian Ocean Territory","IO",246],["Brunei Darussalam","BN",673],["Bulgaria","BG",359],["Burkina Faso","BF",226],["Burundi","BI",257],["Cambodia","KH",855],["Cameroon","CM",237],["Canada","CA",1],["Cape Verde","CV",238],["Cayman Islands","KY",1345],["Central African Republic","CF",236],["Chad","TD",235],["Chile","CL",56],["China","CN",86],["Christmas Island","CX",61],["Cocos (Keeling) Islands","CC",672],["Colombia","CO",57],["Comoros","KM",269],["Congo","CG",242],["Congo, Democratic Republic of the Congo","CD",242],["Cook Islands","CK",682],["Costa Rica","CR",506],["Cote D'Ivoire","CI",225],["Croatia","HR",385],["Cuba","CU",53],["Curacao","CW",599],["Cyprus","CY",357],["Czech Republic","CZ",420],["Denmark","DK",45],["Djibouti","DJ",253],["Dominica","DM",1767],["Dominican Republic","DO",1809],["Ecuador","EC",593],["Egypt","EG",20],["El Salvador","SV",503],["Equatorial Guinea","GQ",240],["Eritrea","ER",291],["Estonia","EE",372],["Ethiopia","ET",251],["Falkland Islands (Malvinas)","FK",500],["Faroe Islands","FO",298],["Fiji","FJ",679],["Finland","FI",358],["France","FR",33],["French Guiana","GF",594],["French Polynesia","PF",689],["French Southern Territories","TF",262],["Gabon","GA",241],["Gambia","GM",220],["Georgia","GE",995],["Germany","DE",49],["Ghana","GH",233],["Gibraltar","GI",350],["Greece","GR",30],["Greenland","GL",299],["Grenada","GD",1473],["Guadeloupe","GP",590],["Guam","GU",1671],["Guatemala","GT",502],["Guernsey","GG",44],["Guinea","GN",224],["Guinea-Bissau","GW",245],["Guyana","GY",592],["Haiti","HT",509],["Heard Island and McDonald Islands","HM",0],["Holy See (Vatican City State)","VA",39],["Honduras","HN",504],["Hong Kong","HK",852],["Hungary","HU",36],["Iceland","IS",354],["India","IN",91],["Indonesia","ID",62],["Iran, Islamic Republic of","IR",98],["Iraq","IQ",964],["Ireland","IE",353],["Isle of Man","IM",44],["Israel","IL",972],["Italy","IT",39],["Jamaica","JM",1876],["Japan","JP",81],["Jersey","JE",44],["Jordan","JO",962],["Kazakhstan","KZ",7],["Kenya","KE",254],["Kiribati","KI",686],["Korea, Democratic People's Republic of","KP",850],["Korea, Republic of","KR",82],["Kosovo","XK",383],["Kuwait","KW",965],["Kyrgyzstan","KG",996],["Lao People's Democratic Republic","LA",856],["Latvia","LV",371],["Lebanon","LB",961],["Lesotho","LS",266],["Liberia","LR",231],["Libyan Arab Jamahiriya","LY",218],["Liechtenstein","LI",423],["Lithuania","LT",370],["Luxembourg","LU",352],["Macao","MO",853],["Macedonia, the Former Yugoslav Republic of","MK",389],["Madagascar","MG",261],["Malawi","MW",265],["Malaysia","MY",60],["Maldives","MV",960],["Mali","ML",223],["Malta","MT",356],["Marshall Islands","MH",692],["Martinique","MQ",596],["Mauritania","MR",222],["Mauritius","MU",230],["Mayotte","YT",262],["Mexico","MX",52],["Micronesia, Federated States of","FM",691],["Moldova, Republic of","MD",373],["Monaco","MC",377],["Mongolia","MN",976],["Montenegro","ME",382],["Montserrat","MS",1664],["Morocco","MA",212],["Mozambique","MZ",258],["Myanmar","MM",95],["Namibia","NA",264],["Nauru","NR",674],["Nepal","NP",977],["Netherlands","NL",31],["Netherlands Antilles","AN",599],["New Caledonia","NC",687],["New Zealand","NZ",64],["Nicaragua","NI",505],["Niger","NE",227],["Nigeria","NG",234],["Niue","NU",683],["Norfolk Island","NF",672],["Northern Mariana Islands","MP",1670],["Norway","NO",47],["Oman","OM",968],["Pakistan","PK",92],["Palau","PW",680],["Palestinian Territory, Occupied","PS",970],["Panama","PA",507],["Papua New Guinea","PG",675],["Paraguay","PY",595],["Peru","PE",51],["Philippines","PH",63],["Pitcairn","PN",64],["Poland","PL",48],["Portugal","PT",351],["Puerto Rico","PR",1787],["Qatar","QA",974],["Reunion","RE",262],["Romania","RO",40],["Russian Federation","RU",7],["Rwanda","RW",250],["Saint Barthelemy","BL",590],["Saint Helena","SH",290],["Saint Kitts and Nevis","KN",1869],["Saint Lucia","LC",1758],["Saint Martin","MF",590],["Saint Pierre and Miquelon","PM",508],["Saint Vincent and the Grenadines","VC",1784],["Samoa","WS",684],["San Marino","SM",378],["Sao Tome and Principe","ST",239],["Saudi Arabia","SA",966],["Senegal","SN",221],["Serbia","RS",381],["Serbia and Montenegro","CS",381],["Seychelles","SC",248],["Sierra Leone","SL",232],["Singapore","SG",65],["St Martin","SX",721],["Slovakia","SK",421],["Slovenia","SI",386],["Solomon Islands","SB",677],["Somalia","SO",252],["South Africa","ZA",27],["South Georgia and the South Sandwich Islands","GS",500],["South Sudan","SS",211],["Spain","ES",34],["Sri Lanka","LK",94],["Sudan","SD",249],["Suriname","SR",597],["Svalbard and Jan Mayen","SJ",47],["Swaziland","SZ",268],["Sweden","SE",46],["Switzerland","CH",41],["Syrian Arab Republic","SY",963],["Taiwan, Province of China","TW",886],["Tajikistan","TJ",992],["Tanzania, United Republic of","TZ",255],["Thailand","TH",66],["Timor-Leste","TL",670],["Togo","TG",228],["Tokelau","TK",690],["Tonga","TO",676],["Trinidad and Tobago","TT",1868],["Tunisia","TN",216],["Turkey","TR",90],["Turkmenistan","TM",7370],["Turks and Caicos Islands","TC",1649],["Tuvalu","TV",688],["Uganda","UG",256],["Ukraine","UA",380],["United Arab Emirates","AE",971],["United Kingdom","GB",44],["United States","US",1],["United States Minor Outlying Islands","UM",1],["Uruguay","UY",598],["Uzbekistan","UZ",998],["Vanuatu","VU",678],["Venezuela","VE",58],["Viet Nam","VN",84],["Virgin Islands, British","VG",1284],["Virgin Islands, U.s.","VI",1340],["Wallis and Futuna","WF",681],["Western Sahara","EH",212],["Yemen","YE",967],["Zambia","ZM",260],["Zimbabwe","ZW",263]].map(([name,code,phone])=>({name,code,phone}))
async function formFieldsPhoneNumberInput() {
    const wrapperDiv = $('[data-form-field-pro="number-input-with-country-code"]');

    // No phone field on this page — skip quietly
    if (!wrapperDiv || wrapperDiv.length === 0) {
        return;
    }

    const lightTheme = {
        lightThemeHoverTextColor: wrapperDiv.attr('data-light-theme-number-input-text-color'),
        lightThemeHoverBackgroundColor: wrapperDiv.attr('data-light-theme-number-input-background-color'),
    };

    const darkTheme = {
        darkThemeHoverTextColor: wrapperDiv.attr('data-dark-theme-number-input-text-color'),
        darkThemeHoverBackgroundColor: wrapperDiv.attr('data-dark-theme-number-input-background-color'),
    };

    loadScript('https://code.iconify.design/3/3.1.0/iconify.min.js').catch(() => {});

    injectStyle('ffp-phone-overrides', `
.number-input-dropdown ol::-webkit-scrollbar { width: 0.6rem; }
.number-input-dropdown ol::-webkit-scrollbar-thumb { width: 0.4rem; height: 3rem; background-color: #ccc; border-radius: .4rem; }
.number-input-dropdown ol li { padding: 8px; display: flex; font-size: 14px; justify-content: space-between; cursor: pointer; }
.number-input-dropdown ol li.hide { display: none; }
.number-input-dropdown ol li:not(:last-child) { border-bottom: .1rem solid #eee; }
.number-input-dropdown ol li:hover {
  background-color:${lightTheme.lightThemeHoverBackgroundColor || '#000000'};
  color:${lightTheme.lightThemeHoverTextColor || '#ffffff'};
}
.number-input-dropdown ol li .country-name { margin-left: .4rem; }
@media (prefers-color-scheme: dark){
  .number-input-dropdown ol li:hover {
    background-color: ${darkTheme.darkThemeHoverBackgroundColor || '#000000'};
    color: ${darkTheme.darkThemeHoverTextColor || '#ffffff'};
  }
}
`)

    const downArrow = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
    const defaultCountry = countries.find((c) => c.code === 'GB') || countries[0]

    const countryOptionHtml = countries
        .map(
            (country) =>
                `<li class="option" data-country-code="${country.code}"><div><span class="iconify" data-icon="flag:${country.code.toLowerCase()}-4x3"></span><span class="country-name">${country.name}</span></div><span class="country-code">+${country.phone}</span></li>`,
        )
        .join('')

    const applyCountry = ($iconWrapper, $input, country) => {
        if (!country) return
        const icon = `<span class="iconify" data-icon="flag:${country.code.toLowerCase()}-4x3"></span>`
        $iconWrapper.html('').append(icon, downArrow)
        // Only seed dial code when the field is empty / still on a dial-code-only value
        const current = String($input.val() || '').trim()
        if (!current || /^\+\d+$/.test(current)) {
            $input.val('+' + country.phone + ' ')
        }
    }

    wrapperDiv.each(function () {
        const $field = $(this)
        const $selectBox = $field.find('.number-input-dropdown')
        const $searchBox = $field.find('.number-input-search-field')
        const $inputBox = $field.find('.number-input-field')
        const $selectedOption = $field.find('.number-input-icon-wrapper')

        if (!$selectBox.length || !$inputBox.length || !$selectedOption.length) {
            console.warn('Form Fields Pro: Required phone number elements not found')
            return
        }

        const $ol = $selectBox.find('ol')
        $ol.html(countryOptionHtml)
        applyCountry($selectedOption, $inputBox, defaultCountry)
        $field.attr('data-selected-country', defaultCountry.code)

        const $options = $ol.find('.option')

        $options.on('click', function () {
            const code = $(this).attr('data-country-code')
            const country = countries.find((c) => c.code === code)
            const phoneCode = $(this).find('.country-code').text()
            const icon = $(this).find('.iconify').clone()

            $selectedOption.html('').append(icon, downArrow)
            $inputBox.val(phoneCode + ' ').focus()
            $selectBox.hide()
            if ($searchBox.length) $searchBox.val('')
            $selectBox.find('.hide').removeClass('hide')
            if (country) $field.attr('data-selected-country', country.code)
        })

        if ($searchBox.length) {
            $searchBox.on('input', function () {
                const searchQuery = String($(this).val() || '').toLowerCase()
                $options.each(function () {
                    const name = $(this).find('.country-name').text().toLowerCase()
                    $(this).toggleClass('hide', !name.includes(searchQuery))
                })
            })
        }

        $selectedOption.on('click', function (e) {
            e.stopPropagation()
            $('.number-input-dropdown').not($selectBox).hide()
            $selectBox.toggle()
            // Focus search so typing filters countries immediately after open
            if ($selectBox.is(':visible') && $searchBox.length) {
                $searchBox.trigger('focus')
            }
        })

        // Autofill / paste often yields a local national number (e.g. 01686…).
        // Normalize to +{dial}{national} on blur/change so validation & submit see E.164.
        const syncPhoneValue = function () {
            const input = $inputBox.get(0)
            if (!input) return
            const dial = getSelectedDialCodeForPhoneInput(input)
            const raw = String(input.value || '').trim()
            if (!raw || isDialCodeOnlyPhoneValue(raw)) return
            const e164 = normalizePhoneToE164(raw, dial)
            if (!/^\+\d{8,}$/.test(e164)) return
            const formatted = formatPhoneDisplay(e164, dial)
            if (formatted !== raw) input.value = formatted
            setValidationMessage(input, '')
        }
        $inputBox.on('blur.ffpPhoneNormalize change.ffpPhoneNormalize', syncPhoneValue)
    })

    $(document).on('click.ffpPhoneDropdown', function (e) {
        if ($(e.target).closest('.number-input-icon-wrapper, .number-input-dropdown').length === 0) {
            $('.number-input-dropdown').hide()
        }
    })

    // Soft geo-default: update flag + dial code when the visitor's country is known
    $.get(
        'https://ipinfo.io',
        function (response) {
            const country = countries.find((c) => c.code === response.country)
            if (!country) return
            const defaultDial = '+' + defaultCountry.phone
            wrapperDiv.each(function () {
                const $field = $(this)
                // Don't clobber a manual country pick or typed number
                if ($field.attr('data-selected-country') && $field.attr('data-selected-country') !== defaultCountry.code) {
                    return
                }
                const $input = $field.find('.number-input-field')
                const current = String($input.val() || '').trim()
                // Treat dial-code-only (with optional trailing space) as still default
                if (current && current !== defaultDial && current !== defaultDial + ' ') return

                applyCountry($field.find('.number-input-icon-wrapper'), $input, country)
                $field.attr('data-selected-country', country.code)
            })
        },
        'jsonp',
    )
}


/** Color picker */
function resolveColorPickerStyle($wrapper) {
    if (!$wrapper || !$wrapper.length) return {}

    const fromAttrs = {
        hoverTextColorLight: $wrapper.attr('data-light-theme-color-picker-text-color'),
        hoverTextColorDark: $wrapper.attr('data-dark-theme-color-picker-text-color'),
        hoverBackgroundColorLight: $wrapper.attr('data-light-theme-color-picker-background-color'),
        hoverBackgroundColorDark: $wrapper.attr('data-dark-theme-color-picker-background-color'),
    }

    if (
        fromAttrs.hoverTextColorLight ||
        fromAttrs.hoverTextColorDark ||
        fromAttrs.hoverBackgroundColorLight ||
        fromAttrs.hoverBackgroundColorDark
    ) {
        return fromAttrs
    }

    try {
        const config = JSON.parse($wrapper.attr('data-field-config') || '{}')
        return config.style || {}
    } catch {
        return {}
    }
}

/** Apply Style menu colors to the Spectrum "Choose" button (not hover-only). */
function applyColorPickerChooseStyles(style) {
    const lightText = style.hoverTextColorLight || '#ffffff'
    const lightBg = style.hoverBackgroundColorLight || '#111111'
    const darkText = style.hoverTextColorDark || '#ffffff'
    const darkBg = style.hoverBackgroundColorDark || '#111111'
    const css = `
.sp-container:not(.sp-hidden) .sp-choose,
.sp-container:not(.sp-hidden) .sp-choose:hover,
.sp-container:not(.sp-hidden) .sp-choose:focus,
.sp-container:not(.sp-hidden) .sp-choose:active {
  background-color: ${lightBg} !important;
  color: ${lightText} !important;
  border-color: ${lightBg} !important;
  filter: none !important;
}
@media (prefers-color-scheme: dark) {
  .sp-container:not(.sp-hidden) .sp-choose,
  .sp-container:not(.sp-hidden) .sp-choose:hover,
  .sp-container:not(.sp-hidden) .sp-choose:focus,
  .sp-container:not(.sp-hidden) .sp-choose:active {
    background-color: ${darkBg} !important;
    color: ${darkText} !important;
    border-color: ${darkBg} !important;
    filter: none !important;
  }
}
`
    let el = document.getElementById('ffp-spectrum-choose-colors')
    if (!el) {
        el = document.createElement('style')
        el.id = 'ffp-spectrum-choose-colors'
        document.head.appendChild(el)
    }
    el.textContent = css
}

async function formFieldsColorPickerInput() {
    if (!document.querySelector('.color-input')) return

    await loadStylesheet('https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.css')
    await loadScript('https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.js')

    injectStyle('ffp-spectrum-overrides', `
        .sp-choose {
            background-color: #111111 !important;
            color: #ffffff !important;
        }
        .sp-dd {
            display: none;
        }
        .sp-replacer {
            width: 30px;
            height: 30px;
        }
    `)

    $('.color-input').each(function () {
        const $input = $(this)
        if ($input.data('ffpSpectrumInit')) return
        $input.data('ffpSpectrumInit', true)

        const $wrapper = $input.closest('[form-fields-wrapper="true"]')
        const style = resolveColorPickerStyle($wrapper)

        $input.spectrum({
            type: 'color',
            showPalette: false,
            showInput: true,
            allowEmpty: false,
            show: function () {
                applyColorPickerChooseStyles(style)
            },
            change: function (color) {
                if (!color) return
                $input.val(color.toHexString()).trigger('change')
            },
            hide: function (color) {
                if (!color) return
                $input.val(color.toHexString()).trigger('change')
            },
        })
    })
}

/** File upload */
async function formFieldsFileUploadInput() {
    if (!document.querySelector('.dropzone')) return

    await loadStylesheet('https://unpkg.com/dropzone@5.9.3/dist/min/dropzone.min.css')
    await loadScript('https://unpkg.com/dropzone@5/dist/min/dropzone.min.js')

    injectStyle('ffp-dropzone-overrides', `
  .dropzone{
  background-color:transparent !important;
  }
  .dropzone .dz-message{
          margin: 0;
      }
      .dz-message-content{
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
      }
      .dz-message-link{
          text-decoration: underline;
      }
      
         .dropzone .dz-preview.dz-image-preview{
          background-color: transparent;
      }

      .dropzone .dz-preview .dz-remove{
          color: #000000;
          text-decoration: none;
      }
  `)

    Dropzone.autoDiscover = false

    const dropzoneList = $('.dropzone')

    const dropzoneIds = Object.values(dropzoneList).map((value) => value.id)

    dropzoneIds.map(async function (i) {
        if (i !== undefined) {
            const element = document.getElementById(i)
            const $element = $(`#${i}`)

            const attrs = element.getAttributeNames().reduce((acc, name) => {
                return {
                    ...acc,
                    [name.replace(/-/g, '_')]: element.getAttribute(name),
                }
            }, {})

            const parsedMaxFiles = parseInt(attrs.data_max_files, 10)
            const parsedMaxFilesize = parseInt(attrs.data_max_file_size, 10)
            // Dropzone treats NaN as "unlimited" — fall back to safe defaults.
            const maxFiles = Number.isFinite(parsedMaxFiles) && parsedMaxFiles > 0 ? parsedMaxFiles : 1
            const maxFilesizeMb =
                Number.isFinite(parsedMaxFilesize) && parsedMaxFilesize > 0 ? parsedMaxFilesize : 5
            // Raw file cap before FileReader (data URLs are ~33% larger).
            const maxDataUrlSourceBytes = Math.min(maxFilesizeMb, 5) * 1024 * 1024

            const dropzone = new Dropzone(`#${i}`, {
                url: '#',
                method: 'post',
                paramName: 'file',
                autoProcessQueue: false,
                addRemoveLinks: true,
                maxFiles,
                maxFilesize: maxFilesizeMb,
                acceptedFiles: attrs.data_accepted_files,
            })

            // Persist selected files into a hidden input so submit payloads include them
            const fieldName = element.getAttribute('name') || element.getAttribute('data-name') || i
            let hidden = element.parentElement?.querySelector(`input[data-ffp-upload-for="${i}"]`)
            if (!hidden) {
                hidden = document.createElement('input')
                hidden.type = 'hidden'
                hidden.name = fieldName
                hidden.setAttribute('form-fields-data-input', 'true')
                hidden.setAttribute('data-ffp-upload-for', i)
                // Move required onto the value-bearing hidden so validation sees encoded files
                if (element.hasAttribute('required')) {
                    hidden.setAttribute('required', 'required')
                    element.removeAttribute('required')
                }
                element.parentElement?.appendChild(hidden)
            } else if (element.hasAttribute('required') && !hidden.hasAttribute('required')) {
                hidden.setAttribute('required', 'required')
                element.removeAttribute('required')
            }

            let pendingUploadSync = Promise.resolve()

            const syncFilesToHidden = async () => {
                const files = dropzone.files || []
                if (!files.length) {
                    hidden.value = ''
                    return
                }
                const encoded = await Promise.all(
                    files.map(
                        (file) =>
                            new Promise((resolve) => {
                                if (file.size > maxDataUrlSourceBytes) {
                                    console.warn(
                                        `Form Fields Pro: File "${file.name}" exceeds ${maxDataUrlSourceBytes} bytes — skipped.`,
                                    )
                                    resolve({ name: file.name, error: 'file_too_large', size: file.size })
                                    return
                                }
                                const reader = new FileReader()
                                reader.onload = () =>
                                    resolve({
                                        name: file.name,
                                        type: file.type,
                                        size: file.size,
                                        dataUrl: reader.result,
                                    })
                                reader.onerror = () => resolve({ name: file.name, error: 'read_failed' })
                                reader.readAsDataURL(file)
                            }),
                    ),
                )
                hidden.value = JSON.stringify(encoded.filter((item) => item && !item.error && item.dataUrl))
                if (!hidden.value || hidden.value === '[]') {
                    hidden.value = ''
                }
            }

            const queueUploadSync = () => {
                pendingUploadSync = pendingUploadSync.then(syncFilesToHidden, syncFilesToHidden)
                return pendingUploadSync
            }

            // Submit waits on this so FileReader cannot race form payload collection.
            element._ffpAwaitUploads = () => pendingUploadSync

            dropzone.on('addedfile', (file) => {
                if (file.size > maxDataUrlSourceBytes) {
                    console.warn(
                        `Form Fields Pro: File "${file.name}" exceeds size limit — removed before encoding.`,
                    )
                    dropzone.removeFile(file)
                    return
                }
                void queueUploadSync()
            })
            dropzone.on('removedfile', () => {
                void queueUploadSync()
            })
            dropzone.on('success', function () {
                const borderRadius = $element.css('border-radius')
                $element.find('.dz-image').css('border-radius', borderRadius || 0)
            })

            await $('.dz-message').each(function () {
                $(this).html(
                    `<p class="dz-message-content"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"></path><path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"></path></svg>  Drag and Drop or <span class="dz-message-link">Browse file</span> </p>`,
                )
            })

            $element.find('.dz-message-content svg, .dz-message-link').css('color', attrs.data_default_color)
        }
    })
}

/** Net Promoter Score */
async function formFieldsNetPromoterScoreInput() {
    if (!document.querySelector('[data-field-name="net-promoter-score"]')) return

    const SELECTED_CLASS = 'ffp-nps-selected'
    const netPromoterElement = $('[data-field-name="net-promoter-score"]')

    function npsAttr($element, name, fallback) {
        const value = $element.attr(name)
        return value && String(value).trim() ? value : fallback
    }

    function npsStyleFromConfig($element) {
        try {
            const raw = $element.attr('data-field-config') || $element.attr('field-config')
            return raw ? JSON.parse(raw).style || {} : {}
        } catch (err) {
            return {}
        }
    }

    function parseNpsTheme(raw) {
        if (!raw) return null
        const value = String(raw)
        if (value.charAt(0) === '{') {
            try {
                return JSON.parse(value)
            } catch (err) {
                return null
            }
        }
        const parts = value.split('~')
        if (parts.length < 9) return null
        return {
            textColorLight: parts[0],
            backgroundColorLight: parts[1],
            hoverTextColorLight: parts[2],
            hoverBackgroundColorLight: parts[3],
            selectedTextColorLight: parts[4],
            selectedBackgroundColorLight: parts[5],
            borderColorLight: parts[6],
            borderRadius: parts[7],
            layout: parts[8],
            textColorDark: parts[9],
            backgroundColorDark: parts[10],
            hoverTextColorDark: parts[11],
            hoverBackgroundColorDark: parts[12],
            selectedTextColorDark: parts[13],
            selectedBackgroundColorDark: parts[14],
            borderColorDark: parts[15],
        }
    }

    function pick(value, fallback) {
        return value && String(value).trim() ? value : fallback
    }

    function isStockBlue(value) {
        const normalized = String(value || '').replace(/\s/g, '').toLowerCase()
        return !normalized || normalized === 'rgb(20,110,245)' || normalized === '#146ef5'
    }

    function followHoverIfStockBlue(selected, hover) {
        if (isStockBlue(selected) && hover && !isStockBlue(hover)) return hover
        return selected
    }

    function readTheme($element) {
        const $scale = $element.find('[data-nps-scale]').first()
        const fromTheme =
            parseNpsTheme($scale.attr('data-nps-theme')) ||
            parseNpsTheme($element.attr('data-nps-theme')) ||
            {}
        const fromConfig = npsStyleFromConfig($element)
        const hoverTextLight = pick(
            fromTheme.hoverTextColorLight,
            npsAttr($element, 'data-light-theme-score-text-color', fromConfig.hoverTextColorLight || '#ffffff'),
        )
        const hoverBgLight = pick(
            fromTheme.hoverBackgroundColorLight,
            npsAttr($element, 'data-light-theme-score-background-color', fromConfig.hoverBackgroundColorLight || '#146ef5'),
        )
        const hoverTextDark = pick(
            fromTheme.hoverTextColorDark,
            npsAttr($element, 'data-dark-theme-score-text-color', fromConfig.hoverTextColorDark || '#ffffff'),
        )
        const hoverBgDark = pick(
            fromTheme.hoverBackgroundColorDark,
            npsAttr($element, 'data-dark-theme-score-background-color', fromConfig.hoverBackgroundColorDark || '#146ef5'),
        )

        return {
            layout: pick(
                fromTheme.layout,
                npsAttr($element, 'data-nps-layout', $scale.attr('data-nps-layout') || fromConfig.layout || 'connected'),
            ),
            textColorLight: pick(fromTheme.textColorLight, npsAttr($element, 'data-light-theme-idle-text-color', fromConfig.textColorLight || 'inherit')),
            backgroundColorLight: pick(fromTheme.backgroundColorLight, npsAttr($element, 'data-light-theme-idle-background-color', fromConfig.backgroundColorLight || 'transparent')),
            hoverTextColorLight: pick(fromTheme.hoverTextColorLight, hoverTextLight),
            hoverBackgroundColorLight: pick(fromTheme.hoverBackgroundColorLight, hoverBgLight),
            selectedTextColorLight: pick(fromTheme.selectedTextColorLight, npsAttr($element, 'data-light-theme-selected-text-color', fromConfig.selectedTextColorLight || hoverTextLight)),
            selectedBackgroundColorLight: followHoverIfStockBlue(
                pick(fromTheme.selectedBackgroundColorLight, npsAttr($element, 'data-light-theme-selected-background-color', fromConfig.selectedBackgroundColorLight || hoverBgLight)),
                hoverBgLight,
            ),
            borderColorLight: pick(fromTheme.borderColorLight, npsAttr($element, 'data-light-theme-border-color', fromConfig.borderColorLight || '#d4d4d4')),
            textColorDark: pick(fromTheme.textColorDark, npsAttr($element, 'data-dark-theme-idle-text-color', fromConfig.textColorDark || 'inherit')),
            backgroundColorDark: pick(fromTheme.backgroundColorDark, npsAttr($element, 'data-dark-theme-idle-background-color', fromConfig.backgroundColorDark || 'transparent')),
            hoverTextColorDark: pick(fromTheme.hoverTextColorDark, hoverTextDark),
            hoverBackgroundColorDark: pick(fromTheme.hoverBackgroundColorDark, hoverBgDark),
            selectedTextColorDark: pick(fromTheme.selectedTextColorDark, npsAttr($element, 'data-dark-theme-selected-text-color', fromConfig.selectedTextColorDark || hoverTextDark)),
            selectedBackgroundColorDark: followHoverIfStockBlue(
                pick(fromTheme.selectedBackgroundColorDark, npsAttr($element, 'data-dark-theme-selected-background-color', fromConfig.selectedBackgroundColorDark || hoverBgDark)),
                hoverBgDark,
            ),
            borderColorDark: pick(fromTheme.borderColorDark, npsAttr($element, 'data-dark-theme-border-color', fromConfig.borderColorDark || '#505050')),
            borderRadius: pick(
                fromTheme.borderRadius && `${String(fromTheme.borderRadius).replace(/px$/i, '')}px`,
                npsAttr($element, 'data-border-radius', fromConfig.borderRadius ? `${String(fromConfig.borderRadius).replace(/px$/i, '')}px` : '8px'),
            ),
        }
    }

    function isDarkScheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    function activeColors(theme) {
        const dark = isDarkScheme()
        return {
            idleText: dark ? theme.textColorDark : theme.textColorLight,
            idleBg: dark ? theme.backgroundColorDark : theme.backgroundColorLight,
            hoverText: dark ? theme.hoverTextColorDark : theme.hoverTextColorLight,
            hoverBg: dark ? theme.hoverBackgroundColorDark : theme.hoverBackgroundColorLight,
            selectedText: dark ? theme.selectedTextColorDark : theme.selectedTextColorLight,
            selectedBg: dark ? theme.selectedBackgroundColorDark : theme.selectedBackgroundColorLight,
            border: dark ? theme.borderColorDark : theme.borderColorLight,
        }
    }

    function applyThemeVars($element, theme) {
        const nodes = [$element[0], $element.find('[data-nps-scale]')[0]].filter(Boolean)
        const vars = {
            '--nps-text-light': theme.textColorLight,
            '--nps-bg-light': theme.backgroundColorLight,
            '--nps-hover-text-light': theme.hoverTextColorLight,
            '--nps-hover-bg-light': theme.hoverBackgroundColorLight,
            '--nps-selected-text-light': theme.selectedTextColorLight,
            '--nps-selected-bg-light': theme.selectedBackgroundColorLight,
            '--nps-border-light': theme.borderColorLight,
            '--nps-text-dark': theme.textColorDark,
            '--nps-bg-dark': theme.backgroundColorDark,
            '--nps-hover-text-dark': theme.hoverTextColorDark,
            '--nps-hover-bg-dark': theme.hoverBackgroundColorDark,
            '--nps-selected-text-dark': theme.selectedTextColorDark,
            '--nps-selected-bg-dark': theme.selectedBackgroundColorDark,
            '--nps-border-dark': theme.borderColorDark,
            '--nps-radius-value': theme.borderRadius,
        }
        nodes.forEach((node) => {
            if (!node.style || !node.style.setProperty) return
            Object.keys(vars).forEach((key) => node.style.setProperty(key, vars[key]))
        })
        $element.attr('data-nps-layout', theme.layout)
        $element.find('[data-nps-scale]').attr('data-nps-layout', theme.layout)
    }

    function applyLayoutAndBorder($element, $cells, theme) {
        const $scale = $cells.parent()
        const scaleNode = $scale[0]
        const colors = activeColors(theme)
        $scale.attr('data-nps-scale', 'true')
        $scale.attr('data-nps-layout', theme.layout)

        if (theme.layout === 'separated') {
            if (scaleNode && scaleNode.style && scaleNode.style.setProperty) {
                scaleNode.style.setProperty('display', 'flex', 'important')
                scaleNode.style.setProperty('align-items', 'stretch', 'important')
                scaleNode.style.setProperty('column-gap', '6px', 'important')
                scaleNode.style.setProperty('gap', '6px', 'important')
                scaleNode.style.setProperty('overflow', 'visible', 'important')
                scaleNode.style.setProperty('background', 'transparent', 'important')
                scaleNode.style.setProperty('border', 'none', 'important')
                scaleNode.style.setProperty('border-width', '0px', 'important')
                scaleNode.style.setProperty('border-radius', '0px', 'important')
            }
            $cells.each(function () {
                if (!this.style || !this.style.setProperty) return
                this.style.setProperty('border', `1px solid ${colors.border}`, 'important')
                this.style.setProperty('border-radius', theme.borderRadius, 'important')
            })
            return
        }

        if (scaleNode && scaleNode.style && scaleNode.style.setProperty) {
            scaleNode.style.setProperty('border-style', 'solid', 'important')
            scaleNode.style.setProperty('border-width', '1px', 'important')
            scaleNode.style.setProperty('border-color', colors.border, 'important')
            scaleNode.style.setProperty('border-radius', theme.borderRadius, 'important')
        }
        $cells.each(function () {
            if (!this.style || !this.style.setProperty) return
            this.style.setProperty('border-right-color', colors.border, 'important')
        })
    }

    function bindCellStates($element, $cells, theme) {
        const paintCell = (node, state) => {
            if (!node || !node.style || !node.style.setProperty) return
            const colors = activeColors(theme)
            const layout = theme.layout
            if (state === 'hover') {
                node.style.setProperty('background-color', colors.hoverBg, 'important')
                node.style.setProperty('color', colors.hoverText, 'important')
                if (layout === 'separated') node.style.setProperty('border-color', colors.hoverBg, 'important')
                return
            }
            if (state === 'selected') {
                node.style.setProperty('background-color', colors.selectedBg, 'important')
                node.style.setProperty('color', colors.selectedText, 'important')
                if (layout === 'separated') node.style.setProperty('border-color', colors.selectedBg, 'important')
                return
            }
            node.style.setProperty('background-color', colors.idleBg, 'important')
            node.style.setProperty('color', colors.idleText, 'important')
            if (layout === 'separated') node.style.setProperty('border-color', colors.border, 'important')
        }

        $cells.each(function () {
            paintCell(this, 'idle')
        })

        $cells.on('mouseenter.ffpNps', function () {
            if ($(this).hasClass(SELECTED_CLASS)) {
                paintCell(this, 'selected')
                return
            }
            paintCell(this, 'hover')
        })
        $cells.on('mouseleave.ffpNps', function () {
            if ($(this).hasClass(SELECTED_CLASS)) {
                paintCell(this, 'selected')
                return
            }
            paintCell(this, 'idle')
        })

        $element.data('ffp-nps-paint-cell', paintCell)
        $element.data('ffp-nps-theme', theme)
    }

    netPromoterElement.each(function () {
        const element = $(this)
        if (element.attr('data-ffp-nps-bound') === '1') return
        element.attr('data-ffp-nps-bound', '1')

        const theme = readTheme(element)
        applyThemeVars(element, theme)

        const inputElement = element.find('[data-input="net-promoter-score"]')
        const extraFeedbackCollection = element.find('[data-field="extra-feedback-collection"]')
        const $cells = element.find('[data-name="net-promoter-score-value"]')
        applyLayoutAndBorder(element, $cells, theme)
        bindCellStates(element, $cells, theme)

        const extraFeedbackSetting = String(element.attr('data-extra-feedback-collection') || '')
        if (!extraFeedbackSetting.includes('always')) {
            extraFeedbackCollection.hide()
        }

        const selectScore = ($cell) => {
            const value = $cell.text().trim()
            inputElement.val(value)
            const paintCell = element.data('ffp-nps-paint-cell')
            $cells
                .removeClass(`${SELECTED_CLASS} net-promoter-active`)
                .attr('aria-pressed', 'false')
            if (typeof paintCell === 'function') {
                $cells.each(function () {
                    paintCell(this, 'idle')
                })
            }
            $cell.addClass(SELECTED_CLASS).attr('aria-pressed', 'true')
            if (typeof paintCell === 'function') paintCell($cell[0], 'selected')

            if (!extraFeedbackSetting.includes('always')) {
                if (!extraFeedbackSetting.includes('never') || !extraFeedbackSetting.includes('always')) {
                    if (parseInt(value, 10) < parseInt(extraFeedbackSetting, 10)) {
                        extraFeedbackCollection.show()
                    } else {
                        extraFeedbackCollection.hide()
                    }
                } else {
                    extraFeedbackCollection.show()
                }
            }
        }

        $cells.on('click.ffpNps', function () {
            selectScore($(this))
        })

        $cells.on('keydown.ffpNps', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                selectScore($(this))
            }
        })
    })

    injectStyle('ffp-nps-states-v3', `
[data-field-name="net-promoter-score"] {
  --nps-text: var(--nps-text-light, inherit);
  --nps-bg: var(--nps-bg-light, transparent);
  --nps-hover-text: var(--nps-hover-text-light, #ffffff);
  --nps-hover-bg: var(--nps-hover-bg-light, #146ef5);
  --nps-selected-text: var(--nps-selected-text-light, var(--nps-hover-text));
  --nps-selected-bg: var(--nps-selected-bg-light, var(--nps-hover-bg));
  --nps-border: var(--nps-border-light, #d4d4d4);
  --nps-radius: var(--nps-radius-value, 8px);
}
@media (prefers-color-scheme: dark) {
  [data-field-name="net-promoter-score"] {
    --nps-text: var(--nps-text-dark, inherit);
    --nps-bg: var(--nps-bg-dark, transparent);
    --nps-hover-text: var(--nps-hover-text-dark, #ffffff);
    --nps-hover-bg: var(--nps-hover-bg-dark, #146ef5);
    --nps-selected-text: var(--nps-selected-text-dark, var(--nps-hover-text));
    --nps-selected-bg: var(--nps-selected-bg-dark, var(--nps-hover-bg));
    --nps-border: var(--nps-border-dark, #505050);
  }
}
[data-field-name="net-promoter-score"] [data-nps-scale="true"] {
  display: flex !important;
  align-items: stretch !important;
  flex-wrap: nowrap !important;
  width: 100% !important;
  overflow: hidden;
  background: var(--nps-bg);
  border: 1px solid var(--nps-border) !important;
  border-radius: var(--nps-radius) !important;
}
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-nps-scale="true"],
[data-nps-scale="true"][data-nps-layout="separated"] {
  gap: 6px !important;
  column-gap: 6px !important;
  overflow: visible !important;
  background: transparent !important;
  border: none !important;
  border-width: 0 !important;
  border-radius: 0 !important;
}
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"] {
  flex: 1 1 0;
  min-width: 0;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  cursor: pointer;
  user-select: none;
  color: var(--nps-text) !important;
  background-color: var(--nps-bg) !important;
  border-right: 1px solid var(--nps-border) !important;
  transition: background-color .15s ease, color .15s ease, border-color .15s ease;
}
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"]:last-child {
  border-right-width: 0 !important;
}
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"]:not(.ffp-nps-selected):not(.net-promoter-active):hover {
  color: var(--nps-hover-text) !important;
  background-color: var(--nps-hover-bg) !important;
  z-index: 1;
}
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"].ffp-nps-selected,
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"].ffp-nps-selected:hover,
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"].net-promoter-active,
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"].net-promoter-active:hover {
  color: var(--nps-selected-text) !important;
  background-color: var(--nps-selected-bg) !important;
}
[data-nps-active-style-keeper] {
  display: none !important;
}
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-name="net-promoter-score-value"],
[data-nps-scale="true"][data-nps-layout="separated"] [data-name="net-promoter-score-value"],
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-name="net-promoter-score-value"]:last-child,
[data-nps-scale="true"][data-nps-layout="separated"] [data-name="net-promoter-score-value"]:last-child {
  border: 1px solid var(--nps-border) !important;
  border-right-width: 1px !important;
  border-radius: var(--nps-radius) !important;
}
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-name="net-promoter-score-value"]:not(.ffp-nps-selected):not(.net-promoter-active):hover,
[data-nps-scale="true"][data-nps-layout="separated"] [data-name="net-promoter-score-value"]:not(.ffp-nps-selected):not(.net-promoter-active):hover {
  color: var(--nps-hover-text) !important;
  background-color: var(--nps-hover-bg) !important;
  border-color: var(--nps-hover-bg) !important;
}
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].ffp-nps-selected,
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].ffp-nps-selected:hover,
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].net-promoter-active,
[data-field-name="net-promoter-score"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].net-promoter-active:hover,
[data-nps-scale="true"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].ffp-nps-selected,
[data-nps-scale="true"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].ffp-nps-selected:hover,
[data-nps-scale="true"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].net-promoter-active,
[data-nps-scale="true"][data-nps-layout="separated"] [data-name="net-promoter-score-value"].net-promoter-active:hover {
  color: var(--nps-selected-text) !important;
  background-color: var(--nps-selected-bg) !important;
  border-color: var(--nps-selected-bg) !important;
}
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"]:focus {
  outline: none;
}
[data-field-name="net-promoter-score"] [data-name="net-promoter-score-value"]:focus-visible {
  outline: 2px solid var(--nps-selected-bg);
  outline-offset: -2px;
  z-index: 2;
}
[data-field-name="net-promoter-score"] [data-field="extra-feedback-collection"] {
  margin-top: 12px;
}
[data-field-name="net-promoter-score"] [data-field="extra-feedback-collection"] textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px 12px;
  border: 1px solid var(--nps-border);
  border-radius: var(--nps-radius);
  background: var(--nps-bg);
  color: var(--nps-text);
  font-size: 14px;
  line-height: 1.4;
  resize: vertical;
  box-sizing: border-box;
}
[data-field-name="net-promoter-score"] [data-field="extra-feedback-collection"] textarea:focus {
  outline: none;
  border-color: var(--nps-selected-bg);
  box-shadow: 0 0 0 3px rgba(20, 110, 245, 0.2);
}
`)
}

/** Likert scale */
async function formFieldsLikertScaleInput() {
    if (!document.querySelector('[data-field="likert-scale-field-radio"]')) return

    injectStyle('ffp-likert-overrides', `
[data-field="likert-scale-field-radio"] {
  opacity: 0; visibility: hidden; height: 0 !important; margin: 0; width: 0 !important;
}
[data-field="likert-scale-field-radio"]:checked,
[data-field="likert-scale-field-radio"]:not(:checked) + label {
  width: 20px; height: 20px; display: inline-block; border: 1px solid #000; border-radius: 50%; margin-bottom: 0 !important;
}
[data-field="likert-scale-field-radio"]:checked + label {
  background-image: url('data:image/svg+xml,<svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.3333 1L4.54167 8.79167L1 5.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat; background-position: center;
}
`)
}

function getFfpNativeForms() {
    // Only Form Fields Pro / Webflow forms we own — never hijack search/newsletter/login forms.
    const roots = document.querySelectorAll('[fa-form="true"], [fa-webflow-form]')
    const forms = new Set()
    roots.forEach((root) => {
        // Shell is the <form> itself
        if (root.tagName === 'FORM') {
            forms.add(root)
            return
        }
        // Prefer direct child form(s) of this FFP shell — never parent.querySelector (sibling hijack)
        const directChildForms = root.querySelectorAll(':scope > form')
        if (directChildForms.length) {
            directChildForms.forEach((f) => forms.add(f))
            return
        }
        // Nested form inside the shell
        const nestedForms = root.querySelectorAll('form')
        if (nestedForms.length) {
            nestedForms.forEach((f) => forms.add(f))
            return
        }
        // Shell wrapped by a form belonging to this instance
        const enclosing = root.closest('form')
        if (enclosing) forms.add(enclosing)
    })
    return [...forms]
}

function preventWebflowDefaultFormSubmission() {
    for (const form of getFfpNativeForms()) {
        $(form).submit(() => false)
    }
}

function addCustomFormSubmissionLogic() {
    for (const form of getFfpNativeForms()) {
        if (form.dataset.ffpSubmitBound === '1') continue
        form.dataset.ffpSubmitBound = '1'

        form.setAttribute('novalidate', true)
        addValidationMessageNodes(form)

        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            // Lock synchronously before any await so rapid double-clicks cannot race.
            if (form.dataset.ffpSubmitting === '1') return
            form.dataset.ffpSubmitting = '1'
            try {
                // Await file encodes before required validation so hidden inputs are populated
                await waitForPendingFileUploads(form)
                if (!validateData(form)) {
                    form.dataset.ffpSubmitting = '0'
                    return
                }
                await handleFormSubmit(form)
            } catch (err) {
                console.error('Form Fields Pro: Submit failed', err)
                form.dataset.ffpSubmitting = '0'
            }
        })
    }
}

function addValidationMessageNodes(form) {
    injectStyle('ffp-validation-message', `
.form-fields-data-validation-message { color: #FF2626; font-size: 11px; }
`)
    for (const wrapperDiv of form.querySelectorAll('[form-fields-wrapper="true"]')) {
        const node = document.createElement('span')
        node.className = 'form-fields-data-validation-message'
        wrapperDiv.appendChild(node)
    }
}

function getParentFormFieldsWrapperDiv(element) {
    const parent = element?.parentElement
    if (!parent) return null
    return parent.hasAttribute('form-fields-wrapper') ? parent : getParentFormFieldsWrapperDiv(parent)
}

function validateData(form) {
    return validateRequiredFields(form)
}

async function handleFormSubmit(form) {
    const BASE_URL = FFP_DATA_CLIENT_URL;
    const submitButton =
        form.querySelector('input[type="submit"]') ||
        form.querySelector('[fa-form-submit-button]') ||
        form.querySelector('button[type="submit"]');
    const submitButtonOriginalLabel = submitButton?.value ?? submitButton?.textContent ?? 'Submit';
    const submitButtonLoadingLabel = submitButton?.getAttribute?.('data-wait') || 'Please wait...';

    const unlockSubmit = () => {
        form.dataset.ffpSubmitting = '0';
        if (submitButton) {
            submitButton.removeAttribute('disabled');
            if ('value' in submitButton) submitButton.value = submitButtonOriginalLabel;
            else submitButton.textContent = submitButtonOriginalLabel;
        }
    };

    const faForm =
        form.closest('[fa-form="true"]') ||
        form.querySelector('[fa-form="true"]') ||
        form.parentElement?.closest?.('[fa-form="true"]');
    if (!faForm) {
        console.warn('Form Fields Pro: Submit ignored — form is not inside an [fa-form] wrapper');
        unlockSubmit();
        return;
    }
    const formElementId = faForm.getAttribute('fa-form-id');
    const formName = faForm.getAttribute('fa-form-name');

    // Submitting flag is set synchronously in the submit listener; keep it asserted here.
    form.dataset.ffpSubmitting = '1';

    if (submitButton) {
        submitButton.setAttribute('disabled', 'true');
        if ('value' in submitButton) submitButton.value = submitButtonLoadingLabel;
        else submitButton.textContent = submitButtonLoadingLabel;
    }

    try {
        // Wait for Dropzone FileReader encoding so hidden inputs are ready.
        await waitForPendingFileUploads(form);

        const metaData = getFormMetaData(form);
        const webflowInputs = getWebflowInputFieldsData(form);
        const formFieldsInputs = getFormFieldsInputData(form);

        const payload = new URLSearchParams({
            ...metaData,
            ...webflowInputs,
            ...formFieldsInputs,
        });

        const siteId = document.querySelector('html').getAttribute('data-wf-site');
        const formSubmissionPayload = new URLSearchParams({
            ...webflowInputs,
            ...formFieldsInputs,
        });

        const parsedFormData = {};
        formSubmissionPayload.forEach((value, key) => {
            const formattedKey = key.replace(/^fields\[(.*)\]$/, '$1');
            parsedFormData[formattedKey] = value;
        });

        // Create clean form data (without cf-turnstile-response)
        const { "cf-turnstile-response": _, ...cleanFormData } = parsedFormData;

        let webflowSuccess = false;
        let backendSuccess = false;

        // ✅ Always try Webflow submission
        let webflowFormSubmissionResponse;
        try {
            webflowFormSubmissionResponse = await fetch(
                `https://webflow.com/api/v1/form/${siteId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: '*/*',
                    },
                    body: payload.toString(),
                }
            );
            webflowSuccess = webflowFormSubmissionResponse.ok;
        } catch (webflowError) {
            console.warn('Webflow submission failed:', webflowError);
            webflowSuccess = false;
        }

        // Integrations / notifications always need a valid license (backend enforces this too).
        // Staging still gets interactive fields without a license via isAppAllowedToRun().
        const hasLicense = await hasValidLicenseKey(siteId);

        if (hasLicense) {
            // 🔐 Try backend submission only when licensed
            try {
                const formSubmissionResponse = await fetch(`${BASE_URL}/api/sites/handleFormSubmission`, {
                    method: 'POST',
                    headers: await buildSubmissionHeaders(siteId, formElementId),
                    body: JSON.stringify({
                        siteId,
                        formId: formElementId,
                        formName,
                        formData: cleanFormData,
                        webflowPayload: payload.toString(),
                    }),
                });

                backendSuccess = formSubmissionResponse.ok;

                if (backendSuccess) {
                    // Send notification
                    try {
                        const notificationResponse = await fetch(`${FFP_EMAIL_NOTIFIER_URL}/api/send-email`, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                siteId,
                                formId: formElementId,
                                formData: cleanFormData,
                            }),
                        });
                        if (!notificationResponse.ok) {
                            console.warn('Notification email failed:', notificationResponse.status);
                        }
                    } catch (notificationError) {
                        console.warn('Notification email failed:', notificationError);
                        // Don't fail on notification error
                    }
                }
            } catch (backendError) {
                console.warn('Backend submission failed:', backendError);
                backendSuccess = false;
            }
        } else if (!isUsingWebflowDomain()) {
            console.warn(
                'Form Fields Pro: No valid license on a Production domain — skipping backend & notification submission.',
            );
        }

        // Licensed forms: success ONLY when backend succeeded (not Webflow-only).
        // Staging without a license relies on Webflow alone.
        const success = hasLicense ? backendSuccess : webflowSuccess;

        const redirectUrl = form.getAttribute('redirect');
        if (success && redirectUrl) {
            window.location.href = redirectUrl;
            return;
        }

        showFormResult(form, success);
    } catch (error) {
        console.error('Unexpected error during form submission:', error);
        showFormResult(form, false);
    } finally {
        unlockSubmit();
    }
}

async function waitForPendingFileUploads(form) {
    const zones = form.querySelectorAll('.dropzone');
    if (!zones.length) return;
    await Promise.all(
        [...zones].map((zone) =>
            typeof zone._ffpAwaitUploads === 'function' ? zone._ffpAwaitUploads() : Promise.resolve(),
        ),
    );
}

function showFormResult(form, success) {
    form.style.display = 'none';
    const wrapper = form.closest('.w-form') || form.parentElement;
    const sel = `.w-form-${success ? 'done' : 'fail'}`;
    const el =
        (form.id && document.getElementById(form.id)?.parentElement?.querySelector(sel)) ||
        wrapper?.querySelector?.(sel);
    if (el) el.style.display = 'block';
}

function getFormMetaData(form) {
    return {
        name: form.getAttribute('data-name'),
        pageId: form.getAttribute('data-wf-page-id'),
        elementId: form.getAttribute('data-wf-element-id'),
        source: window.location.href,

        test: false,
        dolphin: false,
    }
}

function getWebflowInputFieldsData(form) {
    const data = {};
    const nodes = form.querySelectorAll(
        'input.w-input, textarea.w-input, select.w-select, input.w-checkbox, input.w-radio, input.w-checkbox-input, input.w-radio-input, .w-checkbox input[type="checkbox"], .w-radio input[type="radio"]',
    );

    for (const input of nodes) {
        const name = input.getAttribute('data-name') || input.getAttribute('name');
        if (!name) continue;

        if (input.type === 'checkbox' || input.type === 'radio') {
            if (!input.checked) continue;
            const key = `fields[${name}]`;
            // Multi-checkbox: join values; radios overwrite with the checked option
            if (input.type === 'checkbox' && data[key]) {
                data[key] = `${data[key]},${input.value || 'true'}`;
            } else {
                data[key] = input.value || 'true';
            }
            continue;
        }

        data[`fields[${name}]`] = input.value;
    }

    const turnstileInput = form.querySelector('input[name="cf-turnstile-response"]');
    if (turnstileInput) {
        data['fields[cf-turnstile-response]'] = turnstileInput.value;
    }

    return data;
}

function getFormFieldsInputData(form) {
    const nodes = form.querySelectorAll('[form-fields-data-input]')
    const data = {}
    for (const input of nodes) {
        const name = input.getAttribute('name')
        if (!name) continue

        if (input.type === 'checkbox' || input.type === 'radio') {
            if (!input.checked) continue
            const key = `fields[${name}]`
            if (input.type === 'checkbox' && data[key]) {
                data[key] = `${data[key]},${input.value || 'true'}`
            } else {
                data[key] = input.value || 'true'
            }
            continue
        }

        data[`fields[${name}]`] = input.value
    }

    return data
}

function isFieldVisiblyHidden(el) {
    const wrapper = getParentFormFieldsWrapperDiv(el) || el
    let node = wrapper
    while (node && node !== document.body) {
        if (node.style && node.style.display === 'none') return true
        node = node.parentElement
    }
    return false
}

/** Known dial codes (e.g. "880", "1") — used so full E.164 is not treated as dial-only */
const PHONE_DIAL_CODE_SET = new Set(countries.map((c) => String(c.phone)))

function getSelectedDialCodeForPhoneInput(input) {
    const wrapper =
        (input && input.closest && input.closest('[data-form-field-pro="number-input-with-country-code"]')) ||
        getParentFormFieldsWrapperDiv(input)
    if (!wrapper) return null
    const iso = wrapper.getAttribute('data-selected-country')
    const country = iso ? countries.find((c) => c.code === iso) : null
    return country ? String(country.phone) : null
}

/**
 * True only when the value is exactly a known country dial code (optional trailing space).
 * Full numbers like +8801686407947 must NOT match (previous /^\+\d+\s*$/ false positive).
 */
function isDialCodeOnlyPhoneValue(value) {
    const trimmed = String(value || '').trim()
    const match = trimmed.match(/^\+(\d+)\s*$/)
    if (!match) return false
    return PHONE_DIAL_CODE_SET.has(match[1])
}

/** Build +{digits} from local, international, or messy autofill values */
function normalizePhoneToE164(value, dialCode) {
    const raw = String(value || '').trim()
    if (!raw) return ''
    if (isDialCodeOnlyPhoneValue(raw)) return '+' + raw.replace(/\D/g, '')

    const hasPlus = raw.startsWith('+')
    let nums = raw.replace(/\D/g, '')
    if (!nums) return ''

    if (hasPlus) return '+' + nums

    // Digits already include the selected dial code (user typed 8801… without +)
    if (dialCode && nums.startsWith(dialCode) && nums.length > dialCode.length + 3) {
        return '+' + nums
    }

    if (dialCode) {
        const national = nums.replace(/^0+/, '')
        if (!national) return '+' + dialCode
        if (national.startsWith(dialCode) && national.length > dialCode.length + 3) {
            return '+' + national
        }
        return '+' + dialCode + national
    }

    return nums
}

function formatPhoneDisplay(e164, dialCode) {
    const cleaned = String(e164 || '').replace(/[^\d+]/g, '')
    if (!cleaned.startsWith('+')) return cleaned
    const nums = cleaned.slice(1)
    if (dialCode && nums.startsWith(dialCode) && nums.length > dialCode.length) {
        return '+' + dialCode + ' ' + nums.slice(dialCode.length)
    }
    return cleaned
}

function setValidationMessage(field, message) {
    const node = getParentFormFieldsWrapperDiv(field)?.querySelector('.form-fields-data-validation-message')
    if (node) node.innerHTML = message || ''
}

function validateFieldData(field, value, pattern, errorMessage) {
    const ok = !(value.length > 0 && !pattern.test(value))
    setValidationMessage(field, ok ? '' : errorMessage)
    return ok
}

function countPlainTextLetters(value) {
    return (String(value || '').match(/\p{L}/gu) || []).length
}

function isValidPlainTextValue(value) {
    return countPlainTextLetters(value) >= PLAIN_TEXT_MIN_LETTERS
}

function getEmptyErrorMessage(input) {
    return input.getAttribute('data-empty-error-msg') || 'This field is required'
}

function validatePlainTextField(field, value) {
    const raw = String(value || '').trim()
    if (!raw) {
        setValidationMessage(field, '')
        return true
    }
    const message = field.getAttribute('data-invalid-error-msg') || 'Please enter a valid name'
    const ok = isValidPlainTextValue(raw)
    setValidationMessage(field, ok ? '' : message)
    return ok
}

function validateTypedFields(root = document, { scoped = false } = {}) {
    const prefix = scoped ? '' : '[form-fields-wrapper="true"] '
    for (const f of root.querySelectorAll(`${prefix}input[type="url"]`)) {
        if (isFieldVisiblyHidden(f)) continue
        if (!validateFieldData(f, f.value, URL_PATTERN_REGEX, 'Please enter a valid url')) return false
    }
    for (const f of root.querySelectorAll(`${prefix}input[type="email"]`)) {
        if (isFieldVisiblyHidden(f)) continue
        const message = f.getAttribute('data-invalid-error-msg') || 'Please enter a valid email'
        if (!validateFieldData(f, f.value, EMAIL_PATTERN_REGEX, message)) return false
    }
    // Plain Text / Name — require at least 3 letters
    for (const f of root.querySelectorAll(`${prefix}input[data-plain-text="form-field-pro-plain-text"]`)) {
        if (isFieldVisiblyHidden(f)) continue
        if (!validatePlainTextField(f, f.value)) return false
    }
    // Phone widgets use type="tel" inside number-input-with-country-code
    for (const f of root.querySelectorAll(
        `${prefix}[data-form-field-pro="number-input-with-country-code"] input[type="tel"], ${prefix}input.number-input-field[type="tel"]`,
    )) {
        if (isFieldVisiblyHidden(f)) continue
        const raw = String(f.value || '').trim()
        if (!raw || isDialCodeOnlyPhoneValue(raw)) continue
        const dial = getSelectedDialCodeForPhoneInput(f)
        const e164 = normalizePhoneToE164(raw, dial)
        if (!/^\+\d{8,}$/.test(e164)) {
            setValidationMessage(f, f.getAttribute('data-invalid-error-msg') || 'Invalid phone number')
            return false
        }
        // Persist normalized value so submit payload is E.164 (autofill/local → +dial…)
        const formatted = formatPhoneDisplay(e164, dial)
        if (formatted && formatted !== raw) f.value = formatted
    }
    return true
}

function validateRequiredFields(root) {
    const scoped = root !== document && root.tagName !== 'FORM'
    let ok = validateTypedFields(root, { scoped })
    const checkedRadioNames = new Set()
    for (const input of root.querySelectorAll(
        '[form-fields-wrapper="true"] input[type="radio"]:checked, form input[type="radio"]:checked',
    )) {
        const name = input.getAttribute('name')
        if (name) checkedRadioNames.add(name)
    }

    for (const input of root.querySelectorAll('[form-fields-wrapper="true"] [required]')) {
        if (isFieldVisiblyHidden(input)) continue

        // Radio groups: only one option needs to be checked (native HTML behavior)
        if (input.type === 'radio') {
            const name = input.getAttribute('name')
            if (name && checkedRadioNames.has(name)) {
                if (ok) setValidationMessage(input, '')
                continue
            }
            ok = false
            setValidationMessage(input, getEmptyErrorMessage(input))
            continue
        }

        const emptyFile =
            input.type === 'file' || input.hasAttribute('form-fields-file-upload')
                ? !input.value || input.value === '[]' || input.value === 'null'
                : false

        const empty =
            emptyFile ||
            !input.value ||
            (input.type === 'tel' && isDialCodeOnlyPhoneValue(input.value)) ||
            (input.type === 'checkbox' && !input.checked)

        if (empty) {
            ok = false
            setValidationMessage(input, getEmptyErrorMessage(input))
        } else if (ok) {
            setValidationMessage(input, '')
        }
    }
    return ok
}

function initializeInputValidationEvents() {
    document.querySelectorAll('[form-fields-wrapper="true"] input[type="url"]').forEach((field) => {
        field.addEventListener('input', (e) => validateFieldData(field, e.target.value, URL_PATTERN_REGEX, 'Enter a valid URL'))
    })
    document.querySelectorAll('[form-fields-wrapper="true"] input[type="email"]').forEach((field) => {
        const message = field.getAttribute('data-invalid-error-msg') || 'Enter a valid email'
        field.addEventListener('input', (e) => validateFieldData(field, e.target.value, EMAIL_PATTERN_REGEX, message))
    })
    document
        .querySelectorAll('[form-fields-wrapper="true"] input[data-plain-text="form-field-pro-plain-text"]')
        .forEach((field) => {
            field.addEventListener('input', (e) => validatePlainTextField(field, e.target.value))
        })
}

const validateAllFields = () => validateTypedFields(document)

/** Conditional logic */
const FORM_STATE = {}
let conditionalLogicFields = []

function initializeConditionalLogic() {
    conditionalLogicFields = document.querySelectorAll('[conditional-logic]')
    if (!conditionalLogicFields.length) return

    conditionalLogicFields.forEach((field) => toggleDisplay(field))

    observeInputChangesAndFireConditionalLogic()
}

function toggleDisplay(element, show = false) {
    // Clear inline display so layout CSS (block/flex/etc.) applies when shown.
    element.style.display = show ? '' : 'none'
}

async function observeInputChangesAndFireConditionalLogic() {
    syncFormState()

    conditionalLogicFields.forEach((field) => {
        try {
            reactToCurrentFormStateBasedOnConditionalLogic(field)
        } catch (error) {
            console.warn('[Form Fields Pro] Conditional logic evaluation failed', error)
        }
    })

    await sleep(450)
    return observeInputChangesAndFireConditionalLogic()
}

function syncFormState() {
    const allInputFields = [
        ...document.querySelectorAll('input.w-input, textarea.w-input, select.w-select'),
        ...document.querySelectorAll('[form-fields-data-input]'),
        // Webflow checkbox/radio wrappers (inputs often use w-checkbox-input / w-radio-input)
        ...document.querySelectorAll(
            '.w-checkbox input[type="checkbox"], .w-radio input[type="radio"], input.w-checkbox-input, input.w-radio-input, input.w-checkbox, input.w-radio',
        ),
    ]

    // Reset checkbox groups so joins rebuild from currently checked inputs only
    const checkboxNames = new Set()
    allInputFields.forEach((input) => {
        if (input.type === 'checkbox') {
            const name = input.getAttribute('name')
            if (name) checkboxNames.add(name)
        }
    })
    checkboxNames.forEach((name) => {
        FORM_STATE[name] = ''
    })

    allInputFields.forEach((input) => {
        const name = input.getAttribute('name')
        if (!name) return

        if (input.type === 'checkbox' || input.type === 'radio') {
            if (!input.checked) {
                if (input.type === 'radio' && FORM_STATE[name] === undefined) FORM_STATE[name] = ''
                return
            }
            if (input.type === 'checkbox' && FORM_STATE[name]) {
                FORM_STATE[name] = `${FORM_STATE[name]},${input.value || 'true'}`
            } else {
                FORM_STATE[name] = input.value || 'true'
            }
            return
        }

        FORM_STATE[name] = input.value
    })
}

function reactToCurrentFormStateBasedOnConditionalLogic(element) {
    let ruleGroups
    try {
        ruleGroups = JSON.parse(element.getAttribute('conditional-logic') || '[]')
    } catch {
        return
    }

    if (!Array.isArray(ruleGroups)) return

    const result = ruleGroups.some((ruleGroup) => Array.isArray(ruleGroup) && ruleGroup.every((rule) => resolveConditionalLogicRuleset(rule)))

    toggleDisplay(element, result)
}

function resolveConditionalLogicRuleset(ruleset) {
    const { inputName, compareLogic, compareValue } = ruleset
    const inputValue = FORM_STATE[inputName] || ''

    switch (compareLogic) {
        case 'HAS_ANY_VALUE':
            return inputValue.length > 0
        case 'HAS_NO_VALUE':
            return inputValue.length === 0
        case 'CONTAINS':
            return String(inputValue)
                .toLowerCase()
                .includes(String(compareValue ?? '').toLowerCase())
        case 'IS_EQUAL':
            return inputValue == compareValue
        case 'NOT_EQUAL':
            return inputValue != compareValue
        case 'IS_GREATER_THAN': {
            const left = Number(inputValue)
            const right = Number(compareValue)
            if (!Number.isNaN(left) && !Number.isNaN(right)) return left > right
            return inputValue > compareValue
        }
        case 'IS_LESS_THAN': {
            const left = Number(inputValue)
            const right = Number(compareValue)
            if (!Number.isNaN(left) && !Number.isNaN(right)) return left < right
            return inputValue < compareValue
        }
        default:
            return false
    }
}

const initMultiStepForms = () => {
    const formElements = document.querySelectorAll('[fa-webflow-form]')
    formElements.forEach((formElement) => initSingleMultiStepForm(formElement))
}

const initSingleMultiStepForm = (formElement) => {
    if (!formElement || formElement.dataset.ffpMultiStepInit === '1') return
    formElement.dataset.ffpMultiStepInit = '1'

    const steps = formElement.querySelectorAll('[fa-form-step]')
    const pages = formElement.querySelectorAll('[fa-form-page]')
    if (!steps.length || !pages.length) return

    const previousButton = formElement.querySelector('[fa-form-previous-button]')
    const nextButton = formElement.querySelector('[fa-form-next-button]')
    const submitButton = formElement.querySelector('[fa-form-submit-button]')

    let currentStepIndex = 0

    function updateButtonVisibility() {
        if (previousButton) previousButton.style.display = currentStepIndex === 0 ? 'none' : ''
        if (nextButton) nextButton.style.display = currentStepIndex === steps.length - 1 ? 'none' : ''
        if (submitButton) submitButton.style.display = currentStepIndex !== steps.length - 1 ? 'none' : ''
    }

    function showPageByIndex(index) {
        if (index < 0 || index >= steps.length) return

        pages.forEach((page, i) => {
            page.classList.toggle('hidden', i !== index)
        })

        steps.forEach((step, i) => {
            const counter = step.querySelector('[fa-form-step-counter]')
            const successIcon = step.querySelector('[fa-form-step-success-icon]')
            const label = step.querySelector('[fa-form-step-label]')
            const done = i < index
            const active = i === index
            counter?.classList.toggle('hidden', done)
            successIcon?.classList.toggle('hidden', !done)
            step.classList.toggle('active-step', active)
            counter?.classList.toggle('active-counter', active)
            label?.classList.toggle('active-label', done || active)
        })

        currentStepIndex = index
        updateButtonVisibility()
    }

    function validatePageAt(index) {
        const page = pages[index]
        return page ? validateRequiredFields(page) : false
    }

    function validateThrough(targetIndex) {
        for (let i = currentStepIndex; i < targetIndex; i++) {
            if (!validatePageAt(i)) {
                showPageByIndex(i)
                return false
            }
        }
        return true
    }

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (currentStepIndex < index) {
                if (validateThrough(index)) showPageByIndex(index)
            } else {
                showPageByIndex(index)
            }
        })
    })

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (validatePageAt(currentStepIndex) && currentStepIndex < steps.length - 1) {
                showPageByIndex(currentStepIndex + 1)
            }
        })
    }

    if (previousButton) {
        previousButton.addEventListener('click', () => {
            if (currentStepIndex > 0) showPageByIndex(currentStepIndex - 1)
        })
    }

    showPageByIndex(0)
}

const validateCurrentPage = initMultiStepForms

/** Bootstraps Form Fields Pro for the current page. */
async function initializeFormFieldsPro() {
    const siteIdElement = document.querySelector('html')
    if (!siteIdElement) {
        console.warn('Form Fields Pro: Could not find html element')
        return
    }
    if (!document.querySelector('[fa-form="true"]')) return

    const siteId = siteIdElement.getAttribute('data-wf-site')
    if (await isAppAllowedToRun(siteId)) {
        makeTheFormInteractive()
        return
    }

    console.warn(
        'Form Fields Pro: No valid license. Without a license you can publish to Staging (*.webflow.io) only. A valid license is required to use Form Fields Pro on Production (custom domain).',
    )
}

async function isAppAllowedToRun(siteId) {
    return isUsingWebflowDomain() || hasValidLicenseKey(siteId)
}

/** True when hosted on *.webflow.io (staging). */
function isUsingWebflowDomain(url = window.location.href) {
    let hostname;

    try {
        hostname = new URL(url).hostname;
    } catch {
        hostname = String(url);
    }

    // Normalise case and any trailing dot from a fully qualified hostname
    hostname = hostname.toLowerCase().replace(/\.$/, '');

    return hostname === 'webflow.io' || hostname.endsWith('.webflow.io');
}

const LICENSE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour for successful checks
const LICENSE_NEGATIVE_CACHE_TTL_MS = 60 * 1000; // 1 minute on failure — avoid long outages
let licenseCheckPromise = null;
let licenseCheckCachedAt = 0;
let licenseCheckWasNegative = false;

function hasValidLicenseKey(siteId) {
    // A Production page without a Webflow site ID cannot have a valid license.
    if (!siteId) {
        return Promise.resolve(false);
    }

    const now = Date.now();
    const ttl = licenseCheckWasNegative ? LICENSE_NEGATIVE_CACHE_TTL_MS : LICENSE_CACHE_TTL_MS;
    if (licenseCheckPromise && now - licenseCheckCachedAt < ttl) {
        return licenseCheckPromise;
    }

    licenseCheckCachedAt = now;
    licenseCheckPromise = (async () => {
        try {
            const res = await fetch(
                `https://license.flowappz.com/api/license?siteId=${siteId}&appName=form-fields-pro`,
            );
            if (!res.ok) {
                licenseCheckWasNegative = true;
                return false;
            }
            const data = await res.json();
            const active = data.active === true;
            licenseCheckWasNegative = !active;
            return active;
        } catch (err) {
            console.warn('Form Fields Pro: License check failed', err);
            licenseCheckWasNegative = true;
            return false;
        }
    })();

    return licenseCheckPromise;
}

async function makeTheFormInteractive() {
    const initializers = [
        formFieldsDateInput,
        formFieldsUserIp,
        formFieldsNumberSlider,
        formFieldsSelect,
        formFieldsPhoneNumberInput,
        formFieldsColorPickerInput,
        formFieldsFileUploadInput,
        formFieldsNetPromoterScoreInput,
        formFieldsLikertScaleInput,
        initializeInputValidationEvents,
        preventWebflowDefaultFormSubmission,
        addCustomFormSubmissionLogic,
        initializeConditionalLogic,
        validateCurrentPage,
    ]

    // A vendor CDN being blocked or a single field type throwing must not stop
    // the remaining features — especially the submission handlers.
    for (const initialize of initializers) {
        try {
            Promise.resolve(initialize()).catch((err) => {
                console.warn(`Form Fields Pro: ${initialize.name} failed`, err)
            })
        } catch (err) {
            console.warn(`Form Fields Pro: ${initialize.name} failed`, err)
        }
    }
}

initializeFormFieldsPro()