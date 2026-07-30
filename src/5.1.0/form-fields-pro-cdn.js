/**
 * FORM FIELDS PRO CDN SCRIPT - v5.1.0
 * Vendors (Select2, noUiSlider, moment, daterangepicker, etc.) load on demand.
 */

const EMAIL_PATTERN_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const URL_PATTERN_REGEX =
    /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/

/** @type {Record<string, Promise<void>>} */
const __ffpAssetCache = {}

/**
 * Load an external script once (browser-cached via normal script tags).
 * @param {string} src
 * @returns {Promise<void>}
 */
function loadScript(src) {
    if (__ffpAssetCache[src]) return __ffpAssetCache[src]
    __ffpAssetCache[src] = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`)
        if (existing) {
            if (existing.dataset.ffpLoaded === '1') return resolve()
            existing.addEventListener('load', () => resolve())
            existing.addEventListener('error', () => reject(new Error('Failed to load ' + src)))
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

/**
 * Load an external stylesheet once.
 * @param {string} href
 * @returns {Promise<void>}
 */
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

/**
 * Inject a style tag once (keyed by id).
 * @param {string} id
 * @param {string} css
 */
function injectStyle(id, css) {
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = css
    document.head.appendChild(style)
}

const sleep = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(true), 5)
    })

/**
 * INITIALIZE DATE PICKERS
 */
const formFieldsDateInput = async () => {
    const selectors = {
        DATE_PICKER: '[form-fields-pro-date-picker]',
        DATE_RANGE_PICKER: '[form-fields-pro-date-range-picker]',
    }

    const hasDateFields =
        document.querySelector(selectors.DATE_PICKER) ||
        document.querySelector(selectors.DATE_RANGE_PICKER)
    if (!hasDateFields) return

    // daterangepicker depends on moment + jQuery (jQuery is provided by Webflow)
    await loadScript('https://cdn.jsdelivr.net/npm/moment@2.29.4/min/moment.min.js')
    await loadScript('https://cdn.jsdelivr.net/npm/daterangepicker@3.1.0/daterangepicker.min.js')
    await loadStylesheet('https://cdn.jsdelivr.net/npm/daterangepicker@3.1.0/daterangepicker.css')

    let datePickerPackageCss = ''
    const datePickerState = {}

    /**
     *
     * @param {Element} element
     */
    const getCommonConfig = (element) => {
        const grid = Number(element.getAttribute('data-columns'))
        const calendars = Number(element.getAttribute('data-months'))
        const firstDay = Number(element.getAttribute('data-firstDay'))
        const format = element.getAttribute('data-format')
        const lang = element.getAttribute('data-language')
        const zIndex = element.getAttribute('data-zIndex')

        return {
            element,
            // css: ["https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css"],
            grid,
            calendars,
            firstDay,
            format,
            lang,
            zIndex,
            readonly: false,
        }
    }

    /**
     *
     * @param {Element} element
     */
    const getCustomCSS = (element) => {
        const { backgroundColor: parentBackgroundColor, color: parentTextColor } = getComputedStyle(element.parentElement)

        const lightTheme = {
            selectedDateTextColor: element.getAttribute('data-light-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-light-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-light-theme-today-color') || parentTextColor,
        }

        const darkTheme = {
            selectedDateTextColor: element.getAttribute('data-dark-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-dark-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-dark-theme-today-color') || parentTextColor,
        }

        // const sheet = new CSSStyleSheet();
        // sheet.replaceSync(`
        const sheet = `
      .container {
        font-family: inherit;
      }
  
      .calendar>.days-grid>.day.today {
        color: ${lightTheme.todayColor}
      }
  
      .calendar>.days-grid>.day.selected, 
      .container.range-plugin .calendar>.days-grid>.day.end, 
      .container.range-plugin .calendar>.days-grid>.day.start {
        color: ${lightTheme.selectedDateTextColor};
        background-color: ${lightTheme.selectedDateBackgroundColor};
      }
  
      .container.range-plugin .calendar>.days-grid>.day.start:after {
        border-left-color: ${lightTheme.selectedDateBackgroundColor}; 
      }
  
      .container.range-plugin .calendar>.days-grid>.day.end:after {
        border-right-color: ${lightTheme.selectedDateBackgroundColor}; 
      }
  
      .calendar>.days-grid>.day:hover {
        border-color: ${lightTheme.selectedDateBackgroundColor}
      }
  
      .container.range-plugin .calendar>.days-grid>.day.in-range {
        color: ${lightTheme.selectedDateTextColor};
        background-color: ${lightTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
      }
  
  
  
      @media (prefers-color-scheme: dark) {
        .calendar>.days-grid>.day.today {
          color: ${darkTheme.todayColor}
        }
  
        .calendar>.days-grid>.day.selected,
        .container.range-plugin .calendar>.days-grid>.day.end, 
        .container.range-plugin .calendar>.days-grid>.day.start {
          color: ${darkTheme.selectedDateTextColor};
          background-color: ${darkTheme.selectedDateBackgroundColor};
        }
  
        .calendar>.days-grid>.day:hover {
          border-color: ${darkTheme.selectedDateBackgroundColor}
        }
  
        .container.range-plugin .calendar>.days-grid>.day.start:after {
          border-left-color: ${darkTheme.selectedDateBackgroundColor}; 
        }
  
        .container.range-plugin .calendar>.days-grid>.day.end:after {
          border-right-color: ${darkTheme.selectedDateBackgroundColor}; 
        }
  
        .container.range-plugin .calendar>.days-grid>.day.in-range {
          color: ${darkTheme.selectedDateTextColor};
          background-color: ${darkTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
        }
      }`
        // `);
        // datePicker.shadowRoot.adoptedStyleSheets = [sheet];

        return `
      ${datePickerPackageCss}
  
      ${sheet}
      `
    }

    /**
     *
     * @param {Element} element
     */
    const overrideCss = (element) => {
        const inputName = element.getAttribute('name')

        const formFieldsId = `${inputName}-${Date.now()}`
        element.setAttribute('form-fields-id', formFieldsId)

        const { backgroundColor: parentBackgroundColor, color: parentTextColor } = getComputedStyle(element.parentElement)

        const lightTheme = {
            selectedDateTextColor: element.getAttribute('data-light-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-light-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-light-theme-today-color') || parentTextColor,
        }

        const darkTheme = {
            selectedDateTextColor: element.getAttribute('data-dark-theme-selected-date-text-color') || parentTextColor,
            selectedDateBackgroundColor: element.getAttribute('data-dark-theme-selected-date-background-color') || parentBackgroundColor,
            todayColor: element.getAttribute('data-dark-theme-today-color') || parentTextColor,
        }

        const sheet = new CSSStyleSheet()
        sheet.replaceSync(`
    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.available:hover {
      color: ${lightTheme.selectedDateTextColor};
      background-color: ${lightTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
    }

    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.in-range {
      color: ${lightTheme.selectedDateTextColor};
      background-color: ${lightTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.45)')};
    }

    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active, 
    [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active:hover {
      color: ${lightTheme.selectedDateTextColor};
      background-color: ${lightTheme.selectedDateBackgroundColor};
    }
  
    @media (prefers-color-scheme: dark) {
      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.available:hover {
        color: ${darkTheme.selectedDateTextColor};
        background-color: ${darkTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.65)')}; 
      }

      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.in-range {
        color: ${darkTheme.selectedDateTextColor};
        background-color: ${darkTheme.selectedDateBackgroundColor.replace('rgb', 'rgba').replace(')', ', 0.45)')};
      }

      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active, 
      [form-fields-id="${formFieldsId}"]  + div + div .daterangepicker td.active:hover {
        color: ${darkTheme.selectedDateTextColor};
        background-color: ${darkTheme.selectedDateBackgroundColor};
      }
    }
    `)

        const sheets = document.adoptedStyleSheets || []
        document.adoptedStyleSheets = [...sheets, sheet]
    }

    /**
     *
     * @param {HTMLInputElement} datePickerInput
     */
    const showDatePickerOnIconClick = (datePickerInput) => {
        const name = datePickerInput.getAttribute('name')
        const icon = document.querySelector(`[name="${name}"] + .date-input-icon`)

        if (icon) icon.style.cursor = 'pointer'

        icon?.addEventListener('click', () => {
            datePickerInput.click()
        })
    }

    const createPickerDropdownWrapperElement = () => {
        const div = document.createElement('div')
        div.style.position = 'absolute'
        div.style.left = '0'
        div.style.width = '100%'

        return div
    }

    /**
     *
     * @param {HTMLInputElement} inputElement
     */
    const preventFormSubmitOnFirstEnterToHideDatePicker = (inputElement) => {
        const inputName = inputElement.getAttribute('name')

        $(inputElement).on('show.daterangepicker', () => {
            datePickerState[inputName] = true
        })

        $(inputElement).on('hide.daterangepicker', (e) => {
            datePickerState[inputName] = false
        })

        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !datePickerState[inputName]) {
                e.preventDefault()
                datePickerState[inputName] = true
            }
        })
    }

    const initializeDatePickers = () => {
        const datePickerInputs = document.querySelectorAll(selectors.DATE_PICKER)

        for (let inputElement of datePickerInputs) {
            const pickerDropdownWrapperEl = createPickerDropdownWrapperElement()
            inputElement.parentElement.appendChild(pickerDropdownWrapperEl)

            $(inputElement).daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                startDate: new Date(),
                parentEl: pickerDropdownWrapperEl,
            })
            overrideCss(inputElement)
            showDatePickerOnIconClick(inputElement)
            preventFormSubmitOnFirstEnterToHideDatePicker(inputElement)
        }
    }

    const initializeDateRangePickers = () => {
        const datePickerInputs = document.querySelectorAll(selectors.DATE_RANGE_PICKER)

        for (let inputElement of datePickerInputs) {
            const pickerDropdownWrapperEl = createPickerDropdownWrapperElement()
            inputElement.parentElement.appendChild(pickerDropdownWrapperEl)

            $(inputElement).daterangepicker({
                startDate: new Date(),
                endDate: new Date(),
                showDropdowns: true,
                parentEl: pickerDropdownWrapperEl,
            })
            overrideCss(inputElement)
            showDatePickerOnIconClick(inputElement)
            preventFormSubmitOnFirstEnterToHideDatePicker(inputElement)
        }
    }

    const loadDatePickerPackageCSS = () => {
        injectStyle('ffp-daterangepicker-overrides', `
    .daterangepicker {
      font-family: inherit;
      border-radius: 0;
    }

    .daterangepicker select.yearselect,
    .daterangepicker select.monthselect {
      border-radius: 0;
      border-color: #ccc;
    }

    input.form-fields-dropdown-wrapper:focus-visible {
      outline: 0;
      border-color: #3898ec;
    }

    .cancelBtn, .applyBtn {
      width: fit-content;
      background: rgb(239, 239, 239);
      border-color: rgb(239, 239, 239);
      padding: 8px 12px !important;
    }

    .applyBtn {
      background: black;
      color: white;
      border-color: black;
    }

    @media (max-width: 485px) {
      .daterangepicker .drp-selected {
        width: 100%;
        margin-bottom: 8px;
      }
    }
    `)
    }

    loadDatePickerPackageCSS()
    initializeDatePickers()
    initializeDateRangePickers()
}

/**
 * INITIALIZE USER IP INPUTS
 */

const formFieldsUserIp = async () => {
    if (!document.querySelector('[form-fields-pro-user-ip-input], [form-fields-pro-user-ip-admin-alert]')) return

    const hideAdminAlert = () => {
        /**
         * @type {HTMLElement[]}
         */
        const alertElements = document.querySelectorAll('[form-fields-pro-user-ip-admin-alert]')

        for (let element of alertElements) element.style.display = 'none'
    }

    const getUserIp = async () => {
        const BASE_URL = 'https://flowapps-data-client-staging.up.railway.app'
        const res = await fetch(`${BASE_URL}/api/user-ip`)

        if (res.ok) {
            const { ip } = await res.json()
            return ip
        } else return ''
    }

    const collectUserIp = async () => {
        const ip = await getUserIp()

        /**
         * @type {HTMLInputElement[]}
         */
        const inputElements = document.querySelectorAll('[form-fields-pro-user-ip-input]')

        for (let input of inputElements) {
            input.value = ip
        }
    }

    hideAdminAlert()
    collectUserIp()
}

/**
 * INITIALIZE RANGE SLIDERS
 */
const formFieldsNumberSlider = async () => {
    if (!document.querySelector('[form-fields-pro-number-slider]')) return

    await loadStylesheet('https://cdn.jsdelivr.net/npm/nouislider@15.7.1/dist/nouislider.min.css')
    await loadScript('https://cdn.jsdelivr.net/npm/nouislider@15.7.1/dist/nouislider.min.js')

    const additionalCss = `
    .noUi-horizontal {
      height: 12px;
    }
    
    .noUi-target {
      border: 1px solid #ededed;
      border-radius: 11.5px;
      box-shadow: none;
    }

    .noUi-horizontal .noUi-handle {
      width: 22px;
      height: 22px;
      right: -17px;
      top: -6px;
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }

    .noUi-handle:after, .noUi-handle:before {
      display: none;
    }

    .noUi-tooltip {
      border: none;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    }
    `

    const addNumberSliderCss = () => {
        injectStyle('ffp-nouislider-overrides', additionalCss)
    }

    /**
     *
     * @param {Element} element
     */
    const overrideCss = (element) => {
        const inputName = element.getAttribute('name')

        const formFieldsId = `${inputName}-${Date.now()}`
        element.setAttribute('form-fields-id', formFieldsId)

        const { backgroundColor: parentBackgroundColor, color: parentTextColor } = getComputedStyle(element.parentElement)

        const lightTheme = {
            maxMinValueTextColor: element.getAttribute('data-light-theme-max-min-text-color') || parentTextColor,
            tooltipTextColor: element.getAttribute('data-light-theme-tooltip-text-color') || parentTextColor,
            sliderColor: element.getAttribute('data-light-theme-slider-color') || parentBackgroundColor,
        }

        const darkTheme = {
            maxMinValueTextColor: element.getAttribute('data-dark-theme-max-min-text-color') || parentTextColor,
            tooltipTextColor: element.getAttribute('data-dark-theme-tooltip-text-color') || parentTextColor,
            sliderColor: element.getAttribute('data-dark-theme-slider-color') || parentBackgroundColor,
        }

        const sheet = new CSSStyleSheet()
        sheet.replaceSync(`
      [form-fields-id="${formFieldsId}"] ~ .noUi-target .noUi-connect {
        background: ${lightTheme.sliderColor}
      }
      [form-fields-id="${formFieldsId}"] ~ .noUi-horizontal .noUi-tooltip {
        color: ${lightTheme.tooltipTextColor};
        background: ${lightTheme.sliderColor};
      }
  
      [form-fields-id="${formFieldsId}"] ~ .rs-container .rs-scale span ins {
        color: ${lightTheme.maxMinValueTextColor};
      }
  
      @media (prefers-color-scheme: dark) {
        [form-fields-id="${formFieldsId}"] ~ .noUi-target .noUi-connect {
          background: ${darkTheme.sliderColor}
        }
        [form-fields-id="${formFieldsId}"] ~ .noUi-horizontal .noUi-tooltip {
          color: ${darkTheme.tooltipTextColor};
          background: ${darkTheme.sliderColor};
        }
  
        [form-fields-id="${formFieldsId}"] ~ .rs-container .rs-scale span ins {
          color: ${darkTheme.maxMinValueTextColor}
        }
      }
      `)

        const sheets = document.adoptedStyleSheets || []
        document.adoptedStyleSheets = [...sheets, sheet]
    }

    /**
     *
     * @param {Element} sliderInput
     */
    const initializeRegularSlider = (sliderInput) => {
        const min = Number(sliderInput.getAttribute('data-min'))
        const max = Number(sliderInput.getAttribute('data-max'))
        const defaultValue = Number(sliderInput.getAttribute('data-default'))

        const container = document.createElement('div')
        sliderInput.parentElement.appendChild(container)

        const slider = noUiSlider.create(container, {
            start: defaultValue,
            step: 1,
            connect: 'lower',
            tooltips: { to: (val) => Math.round(val) },
            range: {
                min,
                max,
            },
        })

        slider.on('update', (values) => {
            values = values.map((v) => Math.round(v)).join(',')
            sliderInput.value = values
        })
    }

    /**
     *
     * @param {Element} sliderInput
     */
    const initializeRangeSlider = (sliderInput) => {
        const min = Number(sliderInput.getAttribute('data-min'))
        const max = Number(sliderInput.getAttribute('data-max'))
        const defaultmin = Number(sliderInput.getAttribute('data-min-default'))
        const defaultmax = Number(sliderInput.getAttribute('data-max-default'))

        const container = document.createElement('div')
        sliderInput.parentElement.appendChild(container)

        const slider = noUiSlider.create(container, {
            start: [defaultmin, defaultmax],
            step: 1,
            connect: [false, true, false],
            tooltips: { to: (val) => Math.round(val) },
            range: {
                min,
                max,
            },
        })

        slider.on('update', (values) => {
            values = values.map((v) => Math.round(v)).join(',')
            sliderInput.value = values
        })
    }

    const initializeTheSliders = async () => {
        const sliders = document.querySelectorAll(`[form-fields-pro-number-slider]`)

        for (let slider of sliders) {
            const rangeSlider = slider.getAttribute('allow-range')
            if (rangeSlider) initializeRangeSlider(slider)
            else initializeRegularSlider(slider)

            overrideCss(slider)
            await sleep()
        }
    }

    addNumberSliderCss()
    initializeTheSliders()
}

/**
 * INITIALIZE SELECT INPUTS
 */
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

    /**
     *
     * @param {Element} element select list element
     */
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

/**
 * INITIALIZE PHONE NUMBER INPUTS
 */
//All script -> created by sakil ahmed

// Number input field with country code
// 253 countries
const countries = [
    { name: 'Afghanistan', code: 'AF', phone: 93 },
    { name: 'Aland Islands', code: 'AX', phone: 358 },
    { name: 'Albania', code: 'AL', phone: 355 },
    { name: 'Algeria', code: 'DZ', phone: 213 },
    { name: 'American Samoa', code: 'AS', phone: 1684 },
    { name: 'Andorra', code: 'AD', phone: 376 },
    { name: 'Angola', code: 'AO', phone: 244 },
    { name: 'Anguilla', code: 'AI', phone: 1264 },
    { name: 'Antarctica', code: 'AQ', phone: 672 },
    { name: 'Antigua and Barbuda', code: 'AG', phone: 1268 },
    { name: 'Argentina', code: 'AR', phone: 54 },
    { name: 'Armenia', code: 'AM', phone: 374 },
    { name: 'Aruba', code: 'AW', phone: 297 },
    { name: 'Australia', code: 'AU', phone: 61 },
    { name: 'Austria', code: 'AT', phone: 43 },
    { name: 'Azerbaijan', code: 'AZ', phone: 994 },
    { name: 'Bahamas', code: 'BS', phone: 1242 },
    { name: 'Bahrain', code: 'BH', phone: 973 },
    { name: 'Bangladesh', code: 'BD', phone: 880 },
    { name: 'Barbados', code: 'BB', phone: 1246 },
    { name: 'Belarus', code: 'BY', phone: 375 },
    { name: 'Belgium', code: 'BE', phone: 32 },
    { name: 'Belize', code: 'BZ', phone: 501 },
    { name: 'Benin', code: 'BJ', phone: 229 },
    { name: 'Bermuda', code: 'BM', phone: 1441 },
    { name: 'Bhutan', code: 'BT', phone: 975 },
    { name: 'Bolivia', code: 'BO', phone: 591 },
    { name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ', phone: 599 },
    { name: 'Bosnia and Herzegovina', code: 'BA', phone: 387 },
    { name: 'Botswana', code: 'BW', phone: 267 },
    { name: 'Bouvet Island', code: 'BV', phone: 55 },
    { name: 'Brazil', code: 'BR', phone: 55 },
    { name: 'British Indian Ocean Territory', code: 'IO', phone: 246 },
    { name: 'Brunei Darussalam', code: 'BN', phone: 673 },
    { name: 'Bulgaria', code: 'BG', phone: 359 },
    { name: 'Burkina Faso', code: 'BF', phone: 226 },
    { name: 'Burundi', code: 'BI', phone: 257 },
    { name: 'Cambodia', code: 'KH', phone: 855 },
    { name: 'Cameroon', code: 'CM', phone: 237 },
    { name: 'Canada', code: 'CA', phone: 1 },
    { name: 'Cape Verde', code: 'CV', phone: 238 },
    { name: 'Cayman Islands', code: 'KY', phone: 1345 },
    { name: 'Central African Republic', code: 'CF', phone: 236 },
    { name: 'Chad', code: 'TD', phone: 235 },
    { name: 'Chile', code: 'CL', phone: 56 },
    { name: 'China', code: 'CN', phone: 86 },
    { name: 'Christmas Island', code: 'CX', phone: 61 },
    { name: 'Cocos (Keeling) Islands', code: 'CC', phone: 672 },
    { name: 'Colombia', code: 'CO', phone: 57 },
    { name: 'Comoros', code: 'KM', phone: 269 },
    { name: 'Congo', code: 'CG', phone: 242 },
    { name: 'Congo, Democratic Republic of the Congo', code: 'CD', phone: 242 },
    { name: 'Cook Islands', code: 'CK', phone: 682 },
    { name: 'Costa Rica', code: 'CR', phone: 506 },
    { name: "Cote D'Ivoire", code: 'CI', phone: 225 },
    { name: 'Croatia', code: 'HR', phone: 385 },
    { name: 'Cuba', code: 'CU', phone: 53 },
    { name: 'Curacao', code: 'CW', phone: 599 },
    { name: 'Cyprus', code: 'CY', phone: 357 },
    { name: 'Czech Republic', code: 'CZ', phone: 420 },
    { name: 'Denmark', code: 'DK', phone: 45 },
    { name: 'Djibouti', code: 'DJ', phone: 253 },
    { name: 'Dominica', code: 'DM', phone: 1767 },
    { name: 'Dominican Republic', code: 'DO', phone: 1809 },
    { name: 'Ecuador', code: 'EC', phone: 593 },
    { name: 'Egypt', code: 'EG', phone: 20 },
    { name: 'El Salvador', code: 'SV', phone: 503 },
    { name: 'Equatorial Guinea', code: 'GQ', phone: 240 },
    { name: 'Eritrea', code: 'ER', phone: 291 },
    { name: 'Estonia', code: 'EE', phone: 372 },
    { name: 'Ethiopia', code: 'ET', phone: 251 },
    { name: 'Falkland Islands (Malvinas)', code: 'FK', phone: 500 },
    { name: 'Faroe Islands', code: 'FO', phone: 298 },
    { name: 'Fiji', code: 'FJ', phone: 679 },
    { name: 'Finland', code: 'FI', phone: 358 },
    { name: 'France', code: 'FR', phone: 33 },
    { name: 'French Guiana', code: 'GF', phone: 594 },
    { name: 'French Polynesia', code: 'PF', phone: 689 },
    { name: 'French Southern Territories', code: 'TF', phone: 262 },
    { name: 'Gabon', code: 'GA', phone: 241 },
    { name: 'Gambia', code: 'GM', phone: 220 },
    { name: 'Georgia', code: 'GE', phone: 995 },
    { name: 'Germany', code: 'DE', phone: 49 },
    { name: 'Ghana', code: 'GH', phone: 233 },
    { name: 'Gibraltar', code: 'GI', phone: 350 },
    { name: 'Greece', code: 'GR', phone: 30 },
    { name: 'Greenland', code: 'GL', phone: 299 },
    { name: 'Grenada', code: 'GD', phone: 1473 },
    { name: 'Guadeloupe', code: 'GP', phone: 590 },
    { name: 'Guam', code: 'GU', phone: 1671 },
    { name: 'Guatemala', code: 'GT', phone: 502 },
    { name: 'Guernsey', code: 'GG', phone: 44 },
    { name: 'Guinea', code: 'GN', phone: 224 },
    { name: 'Guinea-Bissau', code: 'GW', phone: 245 },
    { name: 'Guyana', code: 'GY', phone: 592 },
    { name: 'Haiti', code: 'HT', phone: 509 },
    { name: 'Heard Island and McDonald Islands', code: 'HM', phone: 0 },
    { name: 'Holy See (Vatican City State)', code: 'VA', phone: 39 },
    { name: 'Honduras', code: 'HN', phone: 504 },
    { name: 'Hong Kong', code: 'HK', phone: 852 },
    { name: 'Hungary', code: 'HU', phone: 36 },
    { name: 'Iceland', code: 'IS', phone: 354 },
    { name: 'India', code: 'IN', phone: 91 },
    { name: 'Indonesia', code: 'ID', phone: 62 },
    { name: 'Iran, Islamic Republic of', code: 'IR', phone: 98 },
    { name: 'Iraq', code: 'IQ', phone: 964 },
    { name: 'Ireland', code: 'IE', phone: 353 },
    { name: 'Isle of Man', code: 'IM', phone: 44 },
    { name: 'Israel', code: 'IL', phone: 972 },
    { name: 'Italy', code: 'IT', phone: 39 },
    { name: 'Jamaica', code: 'JM', phone: 1876 },
    { name: 'Japan', code: 'JP', phone: 81 },
    { name: 'Jersey', code: 'JE', phone: 44 },
    { name: 'Jordan', code: 'JO', phone: 962 },
    { name: 'Kazakhstan', code: 'KZ', phone: 7 },
    { name: 'Kenya', code: 'KE', phone: 254 },
    { name: 'Kiribati', code: 'KI', phone: 686 },
    { name: "Korea, Democratic People's Republic of", code: 'KP', phone: 850 },
    { name: 'Korea, Republic of', code: 'KR', phone: 82 },
    { name: 'Kosovo', code: 'XK', phone: 383 },
    { name: 'Kuwait', code: 'KW', phone: 965 },
    { name: 'Kyrgyzstan', code: 'KG', phone: 996 },
    { name: "Lao People's Democratic Republic", code: 'LA', phone: 856 },
    { name: 'Latvia', code: 'LV', phone: 371 },
    { name: 'Lebanon', code: 'LB', phone: 961 },
    { name: 'Lesotho', code: 'LS', phone: 266 },
    { name: 'Liberia', code: 'LR', phone: 231 },
    { name: 'Libyan Arab Jamahiriya', code: 'LY', phone: 218 },
    { name: 'Liechtenstein', code: 'LI', phone: 423 },
    { name: 'Lithuania', code: 'LT', phone: 370 },
    { name: 'Luxembourg', code: 'LU', phone: 352 },
    { name: 'Macao', code: 'MO', phone: 853 },
    {
        name: 'Macedonia, the Former Yugoslav Republic of',
        code: 'MK',
        phone: 389,
    },
    { name: 'Madagascar', code: 'MG', phone: 261 },
    { name: 'Malawi', code: 'MW', phone: 265 },
    { name: 'Malaysia', code: 'MY', phone: 60 },
    { name: 'Maldives', code: 'MV', phone: 960 },
    { name: 'Mali', code: 'ML', phone: 223 },
    { name: 'Malta', code: 'MT', phone: 356 },
    { name: 'Marshall Islands', code: 'MH', phone: 692 },
    { name: 'Martinique', code: 'MQ', phone: 596 },
    { name: 'Mauritania', code: 'MR', phone: 222 },
    { name: 'Mauritius', code: 'MU', phone: 230 },
    { name: 'Mayotte', code: 'YT', phone: 262 },
    { name: 'Mexico', code: 'MX', phone: 52 },
    { name: 'Micronesia, Federated States of', code: 'FM', phone: 691 },
    { name: 'Moldova, Republic of', code: 'MD', phone: 373 },
    { name: 'Monaco', code: 'MC', phone: 377 },
    { name: 'Mongolia', code: 'MN', phone: 976 },
    { name: 'Montenegro', code: 'ME', phone: 382 },
    { name: 'Montserrat', code: 'MS', phone: 1664 },
    { name: 'Morocco', code: 'MA', phone: 212 },
    { name: 'Mozambique', code: 'MZ', phone: 258 },
    { name: 'Myanmar', code: 'MM', phone: 95 },
    { name: 'Namibia', code: 'NA', phone: 264 },
    { name: 'Nauru', code: 'NR', phone: 674 },
    { name: 'Nepal', code: 'NP', phone: 977 },
    { name: 'Netherlands', code: 'NL', phone: 31 },
    { name: 'Netherlands Antilles', code: 'AN', phone: 599 },
    { name: 'New Caledonia', code: 'NC', phone: 687 },
    { name: 'New Zealand', code: 'NZ', phone: 64 },
    { name: 'Nicaragua', code: 'NI', phone: 505 },
    { name: 'Niger', code: 'NE', phone: 227 },
    { name: 'Nigeria', code: 'NG', phone: 234 },
    { name: 'Niue', code: 'NU', phone: 683 },
    { name: 'Norfolk Island', code: 'NF', phone: 672 },
    { name: 'Northern Mariana Islands', code: 'MP', phone: 1670 },
    { name: 'Norway', code: 'NO', phone: 47 },
    { name: 'Oman', code: 'OM', phone: 968 },
    { name: 'Pakistan', code: 'PK', phone: 92 },
    { name: 'Palau', code: 'PW', phone: 680 },
    { name: 'Palestinian Territory, Occupied', code: 'PS', phone: 970 },
    { name: 'Panama', code: 'PA', phone: 507 },
    { name: 'Papua New Guinea', code: 'PG', phone: 675 },
    { name: 'Paraguay', code: 'PY', phone: 595 },
    { name: 'Peru', code: 'PE', phone: 51 },
    { name: 'Philippines', code: 'PH', phone: 63 },
    { name: 'Pitcairn', code: 'PN', phone: 64 },
    { name: 'Poland', code: 'PL', phone: 48 },
    { name: 'Portugal', code: 'PT', phone: 351 },
    { name: 'Puerto Rico', code: 'PR', phone: 1787 },
    { name: 'Qatar', code: 'QA', phone: 974 },
    { name: 'Reunion', code: 'RE', phone: 262 },
    { name: 'Romania', code: 'RO', phone: 40 },
    { name: 'Russian Federation', code: 'RU', phone: 7 },
    { name: 'Rwanda', code: 'RW', phone: 250 },
    { name: 'Saint Barthelemy', code: 'BL', phone: 590 },
    { name: 'Saint Helena', code: 'SH', phone: 290 },
    { name: 'Saint Kitts and Nevis', code: 'KN', phone: 1869 },
    { name: 'Saint Lucia', code: 'LC', phone: 1758 },
    { name: 'Saint Martin', code: 'MF', phone: 590 },
    { name: 'Saint Pierre and Miquelon', code: 'PM', phone: 508 },
    { name: 'Saint Vincent and the Grenadines', code: 'VC', phone: 1784 },
    { name: 'Samoa', code: 'WS', phone: 684 },
    { name: 'San Marino', code: 'SM', phone: 378 },
    { name: 'Sao Tome and Principe', code: 'ST', phone: 239 },
    { name: 'Saudi Arabia', code: 'SA', phone: 966 },
    { name: 'Senegal', code: 'SN', phone: 221 },
    { name: 'Serbia', code: 'RS', phone: 381 },
    { name: 'Serbia and Montenegro', code: 'CS', phone: 381 },
    { name: 'Seychelles', code: 'SC', phone: 248 },
    { name: 'Sierra Leone', code: 'SL', phone: 232 },
    { name: 'Singapore', code: 'SG', phone: 65 },
    { name: 'St Martin', code: 'SX', phone: 721 },
    { name: 'Slovakia', code: 'SK', phone: 421 },
    { name: 'Slovenia', code: 'SI', phone: 386 },
    { name: 'Solomon Islands', code: 'SB', phone: 677 },
    { name: 'Somalia', code: 'SO', phone: 252 },
    { name: 'South Africa', code: 'ZA', phone: 27 },
    {
        name: 'South Georgia and the South Sandwich Islands',
        code: 'GS',
        phone: 500,
    },
    { name: 'South Sudan', code: 'SS', phone: 211 },
    { name: 'Spain', code: 'ES', phone: 34 },
    { name: 'Sri Lanka', code: 'LK', phone: 94 },
    { name: 'Sudan', code: 'SD', phone: 249 },
    { name: 'Suriname', code: 'SR', phone: 597 },
    { name: 'Svalbard and Jan Mayen', code: 'SJ', phone: 47 },
    { name: 'Swaziland', code: 'SZ', phone: 268 },
    { name: 'Sweden', code: 'SE', phone: 46 },
    { name: 'Switzerland', code: 'CH', phone: 41 },
    { name: 'Syrian Arab Republic', code: 'SY', phone: 963 },
    { name: 'Taiwan, Province of China', code: 'TW', phone: 886 },
    { name: 'Tajikistan', code: 'TJ', phone: 992 },
    { name: 'Tanzania, United Republic of', code: 'TZ', phone: 255 },
    { name: 'Thailand', code: 'TH', phone: 66 },
    { name: 'Timor-Leste', code: 'TL', phone: 670 },
    { name: 'Togo', code: 'TG', phone: 228 },
    { name: 'Tokelau', code: 'TK', phone: 690 },
    { name: 'Tonga', code: 'TO', phone: 676 },
    { name: 'Trinidad and Tobago', code: 'TT', phone: 1868 },
    { name: 'Tunisia', code: 'TN', phone: 216 },
    { name: 'Turkey', code: 'TR', phone: 90 },
    { name: 'Turkmenistan', code: 'TM', phone: 7370 },
    { name: 'Turks and Caicos Islands', code: 'TC', phone: 1649 },
    { name: 'Tuvalu', code: 'TV', phone: 688 },
    { name: 'Uganda', code: 'UG', phone: 256 },
    { name: 'Ukraine', code: 'UA', phone: 380 },
    { name: 'United Arab Emirates', code: 'AE', phone: 971 },
    { name: 'United Kingdom', code: 'GB', phone: 44 },
    { name: 'United States', code: 'US', phone: 1 },
    { name: 'United States Minor Outlying Islands', code: 'UM', phone: 1 },
    { name: 'Uruguay', code: 'UY', phone: 598 },
    { name: 'Uzbekistan', code: 'UZ', phone: 998 },
    { name: 'Vanuatu', code: 'VU', phone: 678 },
    { name: 'Venezuela', code: 'VE', phone: 58 },
    { name: 'Viet Nam', code: 'VN', phone: 84 },
    { name: 'Virgin Islands, British', code: 'VG', phone: 1284 },
    { name: 'Virgin Islands, U.s.', code: 'VI', phone: 1340 },
    { name: 'Wallis and Futuna', code: 'WF', phone: 681 },
    { name: 'Western Sahara', code: 'EH', phone: 212 },
    { name: 'Yemen', code: 'YE', phone: 967 },
    { name: 'Zambia', code: 'ZM', phone: 260 },
    { name: 'Zimbabwe', code: 'ZW', phone: 263 },
]
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

    const additionalStyle = `
.number-input-dropdown ol::-webkit-scrollbar {
    width: 0.6rem;
}

.number-input-dropdown ol::-webkit-scrollbar-thumb {
    width: 0.4rem;
    height: 3rem;
    background-color: #ccc;
    border-radius: .4rem;
}

.number-input-dropdown ol li {
    padding: 8px;
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    cursor: pointer;
}

.number-input-dropdown ol li.hide {
    display: none;
}

.number-input-dropdown ol li:not(:last-child) {
    border-bottom: .1rem solid #eee;
}

.number-input-dropdown ol li:hover {
    background-color:${lightTheme.lightThemeHoverBackgroundColor || '#000000'};
    color:${lightTheme.lightThemeHoverTextColor || '#ffffff'};
}

.number-input-dropdown ol li .country-name {
    margin-left: .4rem;
}

@media (prefers-color-scheme: dark){
    .number-input-dropdown ol li:hover {
        background-color: ${darkTheme.darkThemeHoverBackgroundColor || '#000000'};
        color: ${darkTheme.darkThemeHoverTextColor || '#ffffff'};
    }
}
    `;

    const style = document.createElement('style');
    style.innerHTML = additionalStyle;
    document.getElementsByTagName('head')[0].appendChild(style);

    const selectBox = $('.number-input-dropdown');

    // Check if selectBox exists
    if (!selectBox || selectBox.length === 0) {
        console.warn('Form Fields Pro: No select box found for phone number input');
        return;
    }

    const downArrow = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

    let searchBox = $('.number-input-search-field');
    let inputBox = $('.number-input-field');
    let selectedOption = $('.number-input-icon-wrapper');

    // Check if required elements exist
    if (!searchBox || searchBox.length === 0 ||
        !inputBox || inputBox.length === 0 ||
        !selectedOption || selectedOption.length === 0) {
        console.warn('Form Fields Pro: Required elements not found for phone number input');
        return;
    }

    let options = null;

    const flagIcon = document.createElement('span');
    flagIcon.setAttribute('class', 'iconify');
    flagIcon.setAttribute('data-icon', 'flag:gb-4x3');

    // Check if selectedOption element exists before prepending
    if (selectedOption.length > 0) {
        selectedOption.prepend(flagIcon);
    }

    // Check if countries array exists
    if (typeof countries === 'undefined' || !Array.isArray(countries)) {
        console.warn('Form Fields Pro: Countries data not available');
        return;
    }

    $.each(countries, function (index, country) {
        const option = `<li class="option"><div><span class="iconify" data-icon="flag:${country.code.toLowerCase()}-4x3"></span><span class="country-name">${country.name}</span></div><span class='country-code'>+${country.phone}</span></li>`;
        const olElement = selectBox.find('ol');
        if (olElement.length > 0) {
            olElement.append(option);
        }
        options = $('.option');
    });

    if (countries.length > 0) {
        inputBox.val('+' + countries[0].phone + ' ');
    }

    function selectOption() {
        const icon = $(this).find('.iconify').clone();
        const phoneCode = $(this).find('.country-code').clone().text();

        selectedOption.html('').append(icon, downArrow);
        inputBox.val(phoneCode + ' ').focus();
        selectBox.hide();
        if (searchBox.length > 0) {
            searchBox.val('');
        }
        selectBox.find('.hide').removeClass('hide');
    }

    function searchCountry() {
        const searchQuery = searchBox.val().toLowerCase();

        options.each(function () {
            const countryNameElement = $(this).find('.country-name');
            if (countryNameElement.length > 0) {
                const isMatched = countryNameElement.text().toLowerCase().includes(searchQuery);
                $(this).toggleClass('hide', !isMatched);
            }
        });
    }

    selectedOption.on('click', function (e) {
        inputBox = $(this).siblings().eq(0);
        selectedOption = $(this);
        searchBox = $(this).siblings().eq(1).find('.number-input-search-field');

        $('.number-input-dropdown').not($(this).siblings().eq(1)).hide();

        $(this).siblings().eq(1).toggle();
    });

    $(document).on('click', function (e) {
        // Check if e.target exists before accessing getAttribute
        if (e.target && !(e.target.getAttribute && e.target.getAttribute('class') === searchBox.attr('class'))) {
            if ($(e.target).closest(selectedOption).length === 0) {
                selectBox.hide();
                selectBox.attr('input-number-dropdown', 'hide');
            }
        }
    });

    // Only attach event listeners if options exist
    if (options && options.length > 0) {
        options.on('click', selectOption);
    }

    if (searchBox.length > 0) {
        searchBox.on('input', searchCountry);
    }

    await addThirdPartyScriptForPhoneNumberInput();
}

async function addThirdPartyScriptForPhoneNumberInput() {
    await loadStylesheet('https://cdn.jsdelivr.net/npm/intl-tel-input@21.2.7/build/css/intlTelInput.css');
    await loadScript('https://cdn.jsdelivr.net/npm/intl-tel-input@21.2.7/build/js/intlTelInput.min.js');

    // Check if the phone input element exists before trying to use it
    const input = document.querySelector('#phone');
    if (input) {
        let iti = window.intlTelInput(input, {
            countrySearch: false,
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
        });

        $.get('https://ipinfo.io', function (response) {
            let countryCode = response.country;
            iti.setCountry(countryCode);
        }, 'jsonp');

        input.addEventListener('change', formatPhoneNumber);
        input.addEventListener('keyup', formatPhoneNumber);

        function formatPhoneNumber() {
            input.value = iti.getNumber(window.intlTelInputUtils.numberFormat.INTERNATIONAL);
        }

        $('.itl').css('display', 'block');
    } else {
        console.warn('Form Fields Pro: Phone input element with id "phone" not found');
    }
}


/**
 * INITIALIZE COLOR PICKER INPUTS
 */
async function formFieldsColorPickerInput() {
    if (!document.querySelector('.color-input')) return

    await loadStylesheet('https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.css')
    await loadScript('https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.js')

    injectStyle('ffp-spectrum-overrides', `
        .sp-choose {
            background-color: #111111 !important;
        }
        .sp-dd {
            display: none;
        }
        .sp-replacer {
            width: 30px;
            height: 30px;
        }
    `)

    $('.color-input').spectrum({
        type: 'color',
        showPalette: false,
        showInput: true,
        allowEmpty: false,
    })
    let selectedInput

    $('.sp-replacer').on('click', function (e) {
        selectedInput = $(this)
    })

    $('.sp-choose').on('click', function () {
        const color = selectedInput.find('.sp-preview-inner').css('background-color')

        selectedInput.siblings().attr('value', color)
    })
}

/**
 * INITIALIZE FILE UPLOADER INPUTS
 */
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

            const dropzone = new Dropzone(`#${i}`, {
                url: '#',
                method: 'post',
                paramName: 'file',
                autoProcessQueue: true,
                addRemoveLinks: true,
                maxFiles: parseInt(attrs.data_max_files),
                maxFilesize: parseInt(attrs.data_max_file_size),
                acceptedFiles: attrs.data_accepted_files,
            })

            dropzone.on('addedfile', function (file) { })
            dropzone.on('success', function (file) {
                const borderRadius = $element.css('border-radius')
                $element.find('.dz-image').css('border-radius', borderRadius || 0)
            })
            dropzone.on('removedfile', function (file) { })

            await $('.dz-message').each(function () {
                $(this).html(
                    `<p class="dz-message-content"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"></path><path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"></path></svg>  Drag and Drop or <span class="dz-message-link">Browse file</span> </p>`,
                )
            })

            $element.find('.dz-message-content svg, .dz-message-link').css('color', attrs.data_default_color)
        }
    })
}

/**
 * INITIALIZE NET PROMOTER INPUTS
 */
async function formFieldsNetPromoterScoreInput() {
    if (!document.querySelector('[data-field-name="net-promoter-score"]')) return

    const netPromoterElement = $('[data-field-name="net-promoter-score"]')

    let lightTheme = {}
    let darkTheme = {}

    function getAttributes($element) {
        let attributes = {}
        $.each($element[0].attributes, function (index, attr) {
            attributes[attr.name.replace(/-/g, '_')] = attr.value
        })
        return attributes
    }

    netPromoterElement.each(function () {
        const element = $(this)
        const elementAttributes = getAttributes(element)

        lightTheme = {
            lightThemeHoverTextColor: element.attr('data-light-theme-score-text-color'),
            lightThemeHoverBackgroundColor: element.attr('data-light-theme-score-background-color'),
        }

        darkTheme = {
            darkThemeHoverTextColor: element.attr('data-dark-theme-score-text-color'),
            darkThemeHoverBackgroundColor: element.attr('data-dark-theme-score-background-color'),
        }

        const inputElement = element.find('[data-input="net-promoter-score"]')
        const extraFeedbackCollection = element.find('[data-field="extra-feedback-collection"]')

        if (!elementAttributes.data_extra_feedback_collection.includes('always')) {
            extraFeedbackCollection.hide()
        }

        $(this)
            .find('[data-name="net-promoter-score-value"]')
            .on('click', function () {
                const value = $(this).text()
                inputElement.val(value)

                if (value === inputElement.val()) {
                    element.find('[data-name="net-promoter-score-value"]').removeClass('net-promoter-active')
                    $(this).addClass('net-promoter-active')

                    const extraFeedback = elementAttributes.data_extra_feedback_collection || ''
                    if (!extraFeedback.includes('always')) {
                        if (!extraFeedback.includes('never') || !extraFeedback.includes('always')) {
                            if (parseInt(value) < parseInt(extraFeedback)) {
                                extraFeedbackCollection.show()
                            } else {
                                extraFeedbackCollection.hide()
                            }
                        } else {
                            extraFeedbackCollection.show()
                        }
                    }
                }
            })
    })

    const customStyle = `
          .net-promoter-active {
            background-color: ${lightTheme.lightThemeHoverBackgroundColor};
            color: ${lightTheme.lightThemeHoverTextColor};
        }
        
        @media (prefers-color-scheme: dark){
              .net-promoter-active {
                background-color: ${darkTheme.darkThemeHoverBackgroundColor};
                color: ${darkTheme.darkThemeHoverTextColor};
            }
        }
    
    `
    const style = document.createElement('style')
    style.innerHTML = customStyle

    document.getElementsByTagName('head')[0].appendChild(style)
}

/**
 * INITIALIZE LIKERT SCALE INPUTS
 */
async function formFieldsLikertScaleInput() {
    if (!document.querySelector('[data-field="likert-scale-field-radio"]')) return

    const customStyle = `
  [data-field="likert-scale-field-radio"] {
   opacity: 0;
   visibility: hidden;
   height: 0 !important;
   margin: 0;
   width: 0 !important;
}

[data-field="likert-scale-field-radio"]:checked,
[data-field="likert-scale-field-radio"]:not(:checked) + label{
  width: 20px;
   height: 20px;
   display: inline-block;
   border: 1px solid #000;
   border-radius: 50%;
   margin-bottom:0 !important;
}

[data-field="likert-scale-field-radio"]:checked + label{
   width: 20px;
   height: 20px;
   display: inline-block;
   border: 1px solid #000;
   border-radius: 50%;
   background-image: url('data:image/svg+xml,<svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.3333 1L4.54167 8.79167L1 5.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
   background-repeat:no-repeat;
   background-position: center;
   margin-bottom:0 !important;
}

`
    const style = document.createElement('style')
    style.innerHTML = customStyle

    document.getElementsByTagName('head')[0].appendChild(style)
}

// Validate field
function validateFieldData(field, pattern, errorMessage) {
    const formFieldsWrapper = getParentFormFieldsWrapperDiv(field)
    const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')

    field.addEventListener('input', (e) => {
        validationMessageNode.innerHTML = pattern.test(e.target.value) ? '' : errorMessage
    })
}

/**
 * ----
 * PREVENT DEFAULT FORM SUBMISSION
 * ----
 */
function preventWebflowDefaultFormSubmission() {
    const forms = $('form')

    for (let form of forms) {
        $(form).submit(() => {
            return false
        })
    }
}

/**
 * Custom form submisson handler
 */
function addCustomFormSubmissionLogic() {
    const forms = document.querySelectorAll('form')

    for (let form of forms) {
        form.setAttribute('novalidate', true)
        addValidationMessageNodes(form)

        form.addEventListener('submit', (e) => {
            e.preventDefault()

            if (validateData(form)) handleFormSubmit(form)
        })
    }
}

function addDefaultStylesForValidationMessageNodes() {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(`
    .form-fields-data-validation-message {
      color: #FF2626;
      font-size: 11px;
    }
  `)
    const sheets = document.adoptedStyleSheets || []
    document.adoptedStyleSheets = [...sheets, sheet]
}

/**
 *
 * @param {HTMLFormElement} form
 */
function addValidationMessageNodes(form) {
    addDefaultStylesForValidationMessageNodes()

    const formFieldsInputWrappers = form.querySelectorAll('[form-fields-wrapper="true"]')

    for (let wrapperDiv of formFieldsInputWrappers) {
        const node = document.createElement('span')
        node.innerText = ''
        node.classList.add('form-fields-data-validation-message')

        wrapperDiv.appendChild(node)
    }
}

/**
 *
 * @param {HTMLElement} element
 */
function getParentFormFieldsWrapperDiv(element) {
    const parent = element.parentElement
    if (!parent) return null
    if (parent.hasAttribute('form-fields-wrapper')) return parent;
    else return getParentFormFieldsWrapperDiv(parent)
}

/**
 *
 * @param {HTMLFormElement} form
 */
function validateData(form) {
    const requiredFormFieldsInputFields = form.querySelectorAll(`[form-fields-wrapper="true"] [required]`)

    let allChecksPassed = validateAllFields()

    for (let input of requiredFormFieldsInputFields) {
        const formFieldsWrapper = getParentFormFieldsWrapperDiv(input)
        const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')

        if (!input.value) {
            allChecksPassed = false
            validationMessageNode.innerText = 'This field is required'
        } else if (!allChecksPassed) {
            validateAllFields()
        } else validationMessageNode.innerText = ''
    }

    return allChecksPassed
}

/**
 *
 * @param {HTMLFormElement} form
 */
async function handleFormSubmit(form) {
    const BASE_URL = 'https://flowapps-data-client-staging.up.railway.app';
    const submitButton = document.querySelector('input[type="submit"]');
    const submitButtonOriginalLabel = submitButton.value;
    const submitButtonLoadingLabel = submitButton.getAttribute('data-wait');

    const faForm = document.querySelector('[fa-form="true"]');
    if (!faForm) {
        return;
    }
    const formElementId = faForm.getAttribute('fa-form-id');
    const formName = faForm.getAttribute('fa-form-name');

    submitButton.value = submitButtonLoadingLabel;

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

    try {
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

        const hasValidLicense = await hasValidLicenseKey(siteId);

        if (hasValidLicense) {
            // 🔐 Try backend submission only if license is valid
            try {
                const formSubmissionResponse = await fetch(`${BASE_URL}/api/sites/handleFormSubmission`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        siteId,
                        formId: formElementId,
                        formName,
                        formData: cleanFormData,
                        webflowPayload: payload,
                    }),
                });

                backendSuccess = formSubmissionResponse.ok;

                if (backendSuccess) {
                    // Send notification
                    try {
                        await fetch(`https://form-fields-pro-email-notifier-staging.up.railway.app/api/send-email`, {
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
                    } catch (notificationError) {
                        console.warn('Notification email failed:', notificationError);
                        // Don't fail on notification error
                    }
                }
            } catch (backendError) {
                console.warn('Backend submission failed:', backendError);
                backendSuccess = false;
            }
        } else {
            console.warn("License invalid - Skipping backend & notification submission");
        }

        // Reset button
        submitButton.value = submitButtonOriginalLabel;
        const formId = form.id;

        // Redirect or show success/fail
        const redirectUrl = form.getAttribute('redirect');
        if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
        }

        // Success if either Webflow OR Backend succeeded (for licensed user)
        // For unlicensed, only Webflow matters
        if (hasValidLicense) {
            if (webflowSuccess || backendSuccess) {
                document.querySelector(`#${formId} ~ .w-form-done`).style.display = 'block';
                form.style.display = 'none';
            } else {
                document.querySelector(`#${formId} ~ .w-form-fail`).style.display = 'block';
                form.style.display = 'none';
            }
        } else {
            // Unlicensed: only care about Webflow
            if (webflowSuccess) {
                document.querySelector(`#${formId} ~ .w-form-done`).style.display = 'block';
                form.style.display = 'none';
            } else {
                document.querySelector(`#${formId} ~ .w-form-fail`).style.display = 'block';
                form.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Unexpected error during form submission:', error);
        submitButton.value = submitButtonOriginalLabel;

        const formId = form.id;
        document.querySelector(`#${formId} ~ .w-form-fail`).style.display = 'block';
        form.style.display = 'none';
    }
}

/**
 *
 * @param {HTMLFormElement} form
 */
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

/**
 *
 * @param {HTMLFormElement} form
 */
function getWebflowInputFieldsData(form) {
    const webflowInputElements = form.querySelectorAll(`input.w-input`);
    const data = {};

    for (let input of webflowInputElements) {
        const name = input.getAttribute("data-name");
        const value = input.value;

        if (name) {
            data[`fields[${name}]`] = value;
        }
    }

    // ✅ Get cf-turnstile-response input (even though it's hidden)
    const turnstileInput = form.querySelector(`input[name="cf-turnstile-response"]`);
    if (turnstileInput) {
        data["fields[cf-turnstile-response]"] = turnstileInput.value;
    }

    return data;
}

/**
 *
 * @param {HTMLFormElement} form
 */
function getFormFieldsInputData(form) {
    const webflowInputElements = form.querySelectorAll(`[form-fields-data-input]`)

    const data = {}
    for (let input of webflowInputElements) {
        const name = input.getAttribute('name')
        const value = input.value

        data[`fields[${name}]`] = value
    }

    return data
}

// Validate field
function validateFieldData(field, value, pattern, errorMessage) {
    const formFieldsWrapper = getParentFormFieldsWrapperDiv(field)
    const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')

    if (!pattern.test(value) && value.length > 0) {
        validationMessageNode.innerHTML = errorMessage
        return false
    }

    validationMessageNode.innerHTML = ''
    return true
}

// URL validation

const urlFields = document.querySelectorAll('[form-fields-wrapper="true"] input[type="url"]')
urlFields.forEach((field) => {
    field.addEventListener('input', (e) => {
        validateFieldData(field, e.target.value, URL_PATTERN_REGEX, 'Enter a valid URL')
    })
})

// Email validation
const emailFields = document.querySelectorAll('[form-fields-wrapper="true"] input[type="email"]')
emailFields.forEach((field) => {
    const message = field ? field.getAttribute('data-invalid-error-msg') : ''
    field.addEventListener('input', (e) => {
        validateFieldData(field, e.target.value, EMAIL_PATTERN_REGEX, message)
    })
})

function validateAllFields() {
    const urlFields = document.querySelectorAll('[form-fields-wrapper="true"] input[type="url"]')
    const emailFields = document.querySelectorAll('[form-fields-wrapper="true"] input[type="email"]')
    const phoneNumberFields = document.querySelectorAll('[form-fields-wrapper="true"] input[type="number"]')

    for (let f of urlFields) {
        const valid = validateFieldData(f, f.value, URL_PATTERN_REGEX, 'Please enter a valid url')
        if (!valid) return false
    }

    for (let f of emailFields) {
        const message = f.getAttribute('data-invalid-error-msg') || 'Please enter a valid email'
        const valid = validateFieldData(f, f.value, EMAIL_PATTERN_REGEX, message)
        if (!valid) return false
    }

    for (let f of phoneNumberFields) {
        if (f.required && f.value.length < 6) {
            const formFieldsWrapper = getParentFormFieldsWrapperDiv(f)
            const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')
            validationMessageNode.innerText = 'Invalid phone number'
            return false
        }
    }

    return true
}

/**
 * ----
 * CONDITIONAL LOGIC - START
 * ----
 */

/** */
const FORM_STATE = {}
const conditionalLogicFields = document.querySelectorAll('[conditional-logic]')

function initializeConditionalLogic() {
    conditionalLogicFields.forEach((field) => toggleDisplay(field))

    observeInputChangesAndFireConditionalLogic()
}

/**
 *
 * @param {HTMLElement} element
 * @param {boolean} show
 */
function toggleDisplay(element, show = false) {
    if (show) element.style.display = 'initial'
    else element.style.display = 'none'
}

async function observeInputChangesAndFireConditionalLogic() {
    syncFormState()

    conditionalLogicFields.forEach((field) => reactToCurrentFormStateBasedOnConditionalLogic(field))

    await sleep(450)
    return observeInputChangesAndFireConditionalLogic()
}

function syncFormState() {
    const allInputFields = [...document.querySelectorAll(`input.w-input`), ...document.querySelectorAll('[form-fields-data-input]')]

    allInputFields.forEach((input) => {
        const name = input.getAttribute('name')
        const value = input.value

        FORM_STATE[name] = value
    })
}

/**
 *
 * @param {HTMLElement} element
 */
function reactToCurrentFormStateBasedOnConditionalLogic(element) {
    /** @type {TRuleset[][]} */
    const ruleGroups = JSON.parse(element.getAttribute('conditional-logic'))

    const result = ruleGroups.some((ruleGroup) => ruleGroup.every((rule) => resolveConditionalLogicRuleset(rule)))

    toggleDisplay(element, result)
}

/**
 * @typedef {object} TRuleset
 *
 * @property {string} inputName
 * @property {'HAS_ANY_VALUE' | 'HAS_NO_VALUE' | 'IS_EQUAL' | 'NOT_EQUAL' | 'CONTAINS' | 'IS_GREATER_THAN' | 'IS_LESS_THAN'} compareLogic
 * @property {string} compareValue
 */

/**
 *
 * @param {TRuleset} ruleset
 * @returns {boolean}
 */
function resolveConditionalLogicRuleset(ruleset) {
    const { inputName, compareLogic, compareValue } = ruleset
    const inputValue = FORM_STATE[inputName] || ''

    switch (compareLogic) {
        case 'HAS_ANY_VALUE':
            return inputValue.length > 0
        case 'HAS_NO_VALUE':
            return inputValue.length === 0
        case 'CONTAINS':
            return inputValue.toLowerCase().includes(compareValue.toLowerCase())
        case 'IS_EQUAL':
            return inputValue == compareValue
        case 'NOT_EQUAL':
            return inputValue != compareValue
        case 'IS_GREATER_THAN':
            return inputValue > compareValue
        case 'IS_LESS_THAN':
            return inputValue < compareValue
        default:
            return false
    }
}

/**
 * ----
 * CONDITIONAL LOGIC - END
 * ----
 */

/**
 * ----
 * MULTISTEP fORM AND FIELD VALIDATION - START
 * ----
 */

// const validateCurrentPage = () => {
//     const formElement = document.querySelector('[fa-webflow-form]')
//     if (!formElement) return
//
//     const steps = formElement.querySelectorAll('[fa-form-step]')
//     const pages = formElement.querySelectorAll('[fa-form-page]')
//     const previousButton = formElement.querySelector('[fa-form-previous-button]')
//     const nextButton = formElement.querySelector('[fa-form-next-button]')
//
//     let currentStepIndex = 0
//
//     function showPageByIndex(index) {
//         if (index < 0 || index >= steps.length) return
//
//         pages.forEach((page, i) => {
//             page.classList.toggle('hidden', i !== index)
//         })
//
//         steps.forEach((step, i) => {
//             const counter = step.querySelector('[fa-form-step-counter]')
//             const successIcon = step.querySelector('[fa-form-step-success-icon]')
//             const label = step.querySelector('[fa-form-step-label]')
//
//             if (i < index) {
//                 counter?.classList.add('hidden')
//                 successIcon?.classList.remove('hidden')
//                 step.classList.remove('active-step')
//                 counter?.classList.remove('active-counter')
//                 label?.classList.add('active-label')
//             } else if (i === index) {
//                 counter?.classList.remove('hidden')
//                 successIcon?.classList.add('hidden')
//                 step.classList.add('active-step')
//                 counter?.classList.add('active-counter')
//                 label?.classList.add('active-label')
//             } else {
//                 counter?.classList.remove('hidden')
//                 successIcon?.classList.add('hidden')
//                 step.classList.remove('active-step')
//                 counter?.classList.remove('active-counter')
//                 label?.classList.remove('active-label')
//             }
//         })
//
//         currentStepIndex = index
//     }
//
//     function validateCurrentPageFields() {
//         const currentPage = pages[currentStepIndex]
//         if (!currentPage) return false
//
//         // Validate only URL, Email, and Number fields inside current page
//         const urlFields = currentPage.querySelectorAll('input[type="url"]')
//         const emailFields = currentPage.querySelectorAll('input[type="email"]')
//         const phoneNumberFields = currentPage.querySelectorAll('input[type="number"]')
//
//         for (let f of urlFields) {
//             const valid = validateFieldData(f, f.value, URL_PATTERN_REGEX, 'Please enter a valid url')
//             if (!valid) return false
//         }
//
//         for (let f of emailFields) {
//             const message = f.getAttribute('data-invalid-error-msg') || 'Please enter a valid email'
//             const valid = validateFieldData(f, f.value, EMAIL_PATTERN_REGEX, message)
//             if (!valid) return false
//         }
//
//         for (let f of phoneNumberFields) {
//             if (f.required && f.value.length < 6) {
//                 const formFieldsWrapper = getParentFormFieldsWrapperDiv(f)
//                 const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')
//                 if (validationMessageNode) {
//                     validationMessageNode.innerText = 'Invalid phone number'
//                 }
//                 return false
//             }
//         }
//
//         return true
//     }
//
//     function validateCurrentPageData(form) {
//         const currentPage = pages[currentStepIndex]
//         if (!currentPage) return false
//
//         const requiredFormFieldsInputFields = currentPage.querySelectorAll(`.form-fields-wrapper [required]`)
//
//         let allChecksPassed = validateCurrentPageFields()
//
//         for (let input of requiredFormFieldsInputFields) {
//             const formFieldsWrapper = getParentFormFieldsWrapperDiv(input)
//             const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')
//
//             if (!input.value) {
//                 allChecksPassed = false
//                 validationMessageNode.innerText = 'This field is required'
//             } else if (!allChecksPassed) {
//                 validateAllFields()
//             } else validationMessageNode.innerText = ''
//         }
//
//         return allChecksPassed
//     }
//
//     steps.forEach((step, index) => {
//         step.addEventListener('click', () => {
//             showPageByIndex(index)
//         })
//     })
//
//     if (nextButton) {
//         nextButton.addEventListener('click', () => {
//             const validated = validateCurrentPageData(formElement)
//
//             if (validated && currentStepIndex < steps.length - 1) {
//                 showPageByIndex(currentStepIndex + 1)
//             }
//         })
//     }
//
//     if (previousButton) {
//         previousButton.addEventListener('click', () => {
//             if (currentStepIndex > 0) {
//                 showPageByIndex(currentStepIndex - 1)
//             }
//         })
//     }
//
//     showPageByIndex(0)
// }

const validateCurrentPage = () => {
    const formElement = document.querySelector('[fa-webflow-form]')
    if (!formElement) return

    const steps = formElement.querySelectorAll('[fa-form-step]')
    const pages = formElement.querySelectorAll('[fa-form-page]')
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

            if (i < index) {
                counter?.classList.add('hidden')
                successIcon?.classList.remove('hidden')
                step.classList.remove('active-step')
                counter?.classList.remove('active-counter')
                label?.classList.add('active-label')
            } else if (i === index) {
                counter?.classList.remove('hidden')
                successIcon?.classList.add('hidden')
                step.classList.add('active-step')
                counter?.classList.add('active-counter')
                label?.classList.add('active-label')
            } else {
                counter?.classList.remove('hidden')
                successIcon?.classList.add('hidden')
                step.classList.remove('active-step')
                counter?.classList.remove('active-counter')
                label?.classList.remove('active-label')
            }
        })

        currentStepIndex = index
        updateButtonVisibility()
    }

    function validateCurrentPageFields() {
        const currentPage = pages[currentStepIndex]
        if (!currentPage) return false

        const urlFields = currentPage.querySelectorAll('input[type="url"]')
        const emailFields = currentPage.querySelectorAll('input[type="email"]')
        const phoneNumberFields = currentPage.querySelectorAll('input[type="number"]')

        for (let f of urlFields) {
            const valid = validateFieldData(f, f.value, URL_PATTERN_REGEX, 'Please enter a valid url')
            if (!valid) return false
        }

        for (let f of emailFields) {
            const message = f.getAttribute('data-invalid-error-msg') || 'Please enter a valid email'
            const valid = validateFieldData(f, f.value, EMAIL_PATTERN_REGEX, message)
            if (!valid) return false
        }

        for (let f of phoneNumberFields) {
            if (f.required && f.value.length < 6) {
                const formFieldsWrapper = getParentFormFieldsWrapperDiv(f)
                const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')
                if (validationMessageNode) {
                    validationMessageNode.innerText = 'Invalid phone number'
                }
                return false
            }
        }

        return true
    }

    function validateCurrentPageData(form) {
        const currentPage = pages[currentStepIndex]
        if (!currentPage) return false

        const requiredFormFieldsInputFields = currentPage.querySelectorAll(`[form-fields-wrapper="true"] [required]`)
        let allChecksPassed = validateCurrentPageFields()

        for (let input of requiredFormFieldsInputFields) {
            const formFieldsWrapper = getParentFormFieldsWrapperDiv(input)
            const validationMessageNode = formFieldsWrapper?.querySelector('.form-fields-data-validation-message')

            if (!input.value) {
                allChecksPassed = false
                validationMessageNode.innerText = 'This field is required'
            } else if (!allChecksPassed) {
                validateAllFields()
            } else validationMessageNode.innerText = ''
        }

        return allChecksPassed
    }

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (currentStepIndex < index) {
                if (validateCurrentPageData(formElement)) {
                    showPageByIndex(index)
                }
            } else {
                showPageByIndex(index)
            }
        })
    })

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const validated = validateCurrentPageData(formElement)

            if (validated && currentStepIndex < steps.length - 1) {
                showPageByIndex(currentStepIndex + 1)
            }
        })
    }

    if (previousButton) {
        previousButton.addEventListener('click', () => {
            if (currentStepIndex > 0) {
                showPageByIndex(currentStepIndex - 1)
            }
        })
    }

    showPageByIndex(0)
}

/**
 * ----
 * MULTISTEP fORM AND FIELD VALIDATION - END
 * ----
 */

/**
 * Bootstraps Form Fields Pro for the current page.
 *
 * Maps to Webflow "Choose a publish destination":
 * - Staging          → *.webflow.io / *.webflow.* subdomain
 * - Production       → custom domain
 *
 * License gating:
 * - hasValidLicense === true  → Staging + Production (custom domain) both allowed
 * - hasValidLicense === false → Staging only; Production (custom domain) blocked
 */
async function initializeFormFieldsPro() {
    const siteIdElement = document.querySelector('html');
    // Check if siteIdElement exists before accessing getAttribute
    if (!siteIdElement) {
        console.warn('Form Fields Pro: Could not find html element');
        return;
    }

    const siteId = siteIdElement.getAttribute('data-wf-site');
    const url = window.location.href;
    const faForm = document.querySelector('[fa-form="true"]');

    // Only proceed if an FA form marker exists on the page
    if (!faForm) {
        return;
    }

    // Staging publish destination (*.webflow.*) — always allowed, license not required
    const isStagingPublish = isUsingWebflowDomain(url);
    if (isStagingPublish) {
        makeTheFormInteractive();
        return;
    }

    // Production publish destination (custom domain) — only if license is valid
    const hasValidLicense = await hasValidLicenseKey(siteId);
    if (hasValidLicense) {
        // Licensed: Staging + Production both allowed
        makeTheFormInteractive();
        return;
    }

    // Unlicensed on Production (custom domain) → do not initialize
    console.warn(
        'Form Fields Pro: No valid license. Without a license you can publish to Staging (*.webflow.io) only. A valid license is required to use Form Fields Pro on Production (custom domain).',
    );
}

/**
 * Returns true when the page is on Webflow Staging
 * (publish destination "Staging" — e.g. https://example.webflow.io/),
 * not a Production custom domain.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isUsingWebflowDomain(url) {
    try {
        const { hostname } = new URL(url);
        // Staging destinations: *.webflow.io, *.webflow.com, etc.
        return /\.webflow\./i.test(hostname);
    } catch {
        return /\.webflow\./i.test(url);
    }
}

/**
 * Checks whether this Webflow site has an active Form Fields Pro license.
 * true  → Staging + Production (custom domain) allowed
 * false → Staging only
 *
 * @param {string} siteId - Webflow site id from html[data-wf-site]
 * @returns {Promise<boolean>}
 */
async function hasValidLicenseKey(siteId) {
    try {
        const res = await fetch(
            `https://cache-service-staging.up.railway.app/api/license?siteId=${siteId}&appName=form-fields-pro`,
        );
        if (!res.ok) {
            return false;
        }
        const data = await res.json();
        return Boolean(data.active);
    } catch (err) {
        console.warn('Form Fields Pro: License check failed', err);
        return false;
    }
}

async function makeTheFormInteractive() {
    formFieldsDateInput()
    formFieldsUserIp()
    formFieldsNumberSlider()
    formFieldsSelect()
    formFieldsPhoneNumberInput()
    formFieldsColorPickerInput()
    formFieldsFileUploadInput()
    formFieldsNetPromoterScoreInput()
    formFieldsLikertScaleInput()
    preventWebflowDefaultFormSubmission()
    addCustomFormSubmissionLogic()
    initializeConditionalLogic()
    validateCurrentPage()
}

initializeFormFieldsPro()
