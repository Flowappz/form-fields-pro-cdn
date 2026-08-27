import { describe, expect, it } from 'vitest'
import { NPS_STYLE_DEFAULTS, SLIDER_STYLE_DEFAULTS, readFieldConfig } from '../src/index'
import { el } from './dom'

/**
 * Behaviours that look like bugs and are not, plus the two that are.
 *
 * Each of these is a place where the obvious implementation silently changes
 * what a published page renders or submits.
 */

describe('slider - the all-white escape hatch', () => {
    it('discards every resolved colour when the core palette is all white', () => {
        // A white-on-white slider is invisible, so 5.1.5 reads an all-white core
        // as "never themed" and falls back wholesale - including the track
        // colours, which are not part of the whiteness test.
        const blob = ['#fff', 'white', '#ffffff', '#010101', 'rgb(255, 255, 255)', '#FFF', '#ffffff', '#020202'].join('~')
        const cfg = readFieldConfig(el(`<input data-test-target name="s" data-slider-theme="${blob}">`), 'slider')
        expect(cfg.theme).toEqual(SLIDER_STYLE_DEFAULTS)
    })

    it('keeps the palette when one core colour is not white', () => {
        const blob = ['#fff', '#fff', '#123456', '#010101', '#fff', '#fff', '#fff', '#020202'].join('~')
        const cfg = readFieldConfig(el(`<input data-test-target name="s" data-slider-theme="${blob}">`), 'slider')
        expect(cfg.theme.sliderColorLight).toBe('#123456')
        expect(cfg.theme.trackColorLight).toBe('#010101')
    })

    it('treats an absent theme as all-white and returns defaults', () => {
        expect(readFieldConfig(el(`<input data-test-target name="s">`), 'slider').theme).toEqual(
            SLIDER_STYLE_DEFAULTS,
        )
    })
})

describe('nps - selected follows hover', () => {
    it('repoints a stock-blue selected background at a customised hover', () => {
        const cfg = readFieldConfig(
            el(`<div data-test-target data-field-name="nps" data-light-theme-score-background-color="#ff0000"></div>`),
            'nps',
        )
        expect(cfg.theme.hoverBackgroundColorLight).toBe('#ff0000')
        expect(cfg.theme.selectedBackgroundColorLight).toBe('#ff0000')
    })

    it('leaves a deliberately chosen selected background alone', () => {
        const cfg = readFieldConfig(
            el(`<div data-test-target data-field-name="nps"
                 data-light-theme-score-background-color="#ff0000"
                 data-light-theme-selected-background-color="#00ff00"></div>`),
            'nps',
        )
        expect(cfg.theme.selectedBackgroundColorLight).toBe('#00ff00')
    })

    it('defaults selected text to the resolved hover text, not to a literal', () => {
        const cfg = readFieldConfig(
            el(`<div data-test-target data-field-name="nps" data-light-theme-score-text-color="#eeeeee"></div>`),
            'nps',
        )
        expect(cfg.theme.selectedTextColorLight).toBe('#eeeeee')
    })

    it('always emits a px-suffixed radius whichever spelling was stored', () => {
        const bare = readFieldConfig(
            el(`<div data-test-target data-field-name="nps" data-border-radius="4"></div>`),
            'nps',
        )
        const suffixed = readFieldConfig(
            el(`<div data-test-target data-field-name="nps" data-border-radius="4px"></div>`),
            'nps',
        )
        expect(bare.theme.borderRadius).toBe('4px')
        expect(suffixed.theme.borderRadius).toBe('4px')
        expect(readFieldConfig(el(`<div data-test-target data-field-name="nps"></div>`), 'nps').theme.borderRadius)
            .toBe(NPS_STYLE_DEFAULTS.borderRadius)
    })
})

describe('colour and phone - all-or-nothing attribute set', () => {
    it('takes the attribute set whole when any one of the four is present', () => {
        // Matches resolveColorPickerStyle: the wrapper config is not mixed in,
        // so the three absent tokens stay undefined rather than falling back.
        const cfg = readFieldConfig(
            el(`<div data-field-config='{"style":{"hoverTextColorDark":"#cfg"}}'>
                  <input data-test-target name="c" data-light-theme-color-picker-text-color="#attr">
                </div>`),
            'color',
        )
        expect(cfg.theme.hoverTextColorLight).toBe('#attr')
        expect(cfg.theme.hoverTextColorDark).toBeUndefined()
    })

    it('falls back to the wrapper config only when no attribute is present', () => {
        const cfg = readFieldConfig(
            el(`<div data-field-config='{"style":{"hoverTextColorDark":"#cfg"}}'>
                  <input data-test-target name="c">
                </div>`),
            'color',
        )
        expect(cfg.theme.hoverTextColorDark).toBe('#cfg')
    })

    it('themes the phone country dropdown under the number-input names', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="p" data-dark-theme-number-input-background-color="#222">`),
            'phone',
        )
        expect(cfg.theme.hoverBackgroundColorDark).toBe('#222')
    })
})

describe('options', () => {
    it('reads data-searchable="false" as false', () => {
        // Live bug in 5.1.5 L1106: the raw string "false" is truthy, so every
        // select whose searchable toggle is off is searchable on customer sites.
        expect(readFieldConfig(el(`<select data-test-target name="s" data-searchable="false"></select>`), 'select').options.searchable).toBe(false)
        expect(readFieldConfig(el(`<select data-test-target name="s" data-searchable="true"></select>`), 'select').options.searchable).toBe(true)
        expect(readFieldConfig(el(`<select data-test-target name="s" data-searchable=""></select>`), 'select').options.searchable).toBe(false)
        expect(readFieldConfig(el(`<select data-test-target name="s"></select>`), 'select').options.searchable).toBe(false)
    })

    it('maps Webflow day 7 onto index 0 and clamps the rest', () => {
        const first = (v: string) =>
            readFieldConfig(el(`<input data-test-target name="d" data-firstDay="${v}">`), 'date').options.firstDay
        expect(first('7')).toBe(0)
        expect(first('1')).toBe(1)
        expect(first('9')).toBe(0)
        expect(first('nonsense')).toBe(0)
    })

    it('expands a bare language code to a BCP-47 tag', () => {
        const lang = (v: string) =>
            readFieldConfig(el(`<input data-test-target name="d" data-language="${v}">`), 'date').options.language
        expect(lang('en')).toBe('en-US')
        expect(lang('fr')).toBe('fr')
        expect(readFieldConfig(el(`<input data-test-target name="d">`), 'date').options.language).toBe('en-US')
    })

    it('clamps months and columns into easepick range', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d" data-months="99" data-columns="0">`),
            'date',
        )
        expect(cfg.options.months).toBe(12)
        expect(cfg.options.columns).toBe(1)
    })

    it('reads the file limits off the kebab-case DOM names', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target type="file" name="f" data-max-files="3" data-max-file-size="20" data-accepted-files="image/*">`),
            'file',
        )
        expect(cfg.options).toMatchObject({ maxFiles: 3, maxFileSizeMb: 20, acceptedFiles: 'image/*' })
    })

    it('backfills from fa-form-config general without overriding an attribute', () => {
        const form = JSON.stringify({
            pages: [{ fields: [{ general: { fieldName: 'd', format: 'DD.MM.YYYY', months: 4 } }] }],
        }).replace(/"/g, '&quot;')
        const cfg = readFieldConfig(
            el(`<div fa-form fa-form-config="${form}"><input data-test-target name="d" data-months="2"></div>`),
            'date',
        )
        expect(cfg.options.months).toBe(2)
        expect(cfg.options.format).toBe('MM/DD/YYYY')
    })
})

describe('name, required and conditional logic', () => {
    it('prefers the submitted name over the designer label', () => {
        expect(readFieldConfig(el(`<input data-test-target name="real" data-field-name="label">`), 'date').name).toBe('real')
        expect(readFieldConfig(el(`<div data-test-target data-field-name="label"></div>`), 'nps').name).toBe('label')
    })

    it('honours both the native attribute and the designer flag', () => {
        expect(readFieldConfig(el(`<input data-test-target name="d" required>`), 'date').required).toBe(true)
        expect(readFieldConfig(el(`<input data-test-target name="d" data-required="true">`), 'date').required).toBe(true)
        expect(readFieldConfig(el(`<input data-test-target name="d" data-required="false">`), 'date').required).toBe(false)
        expect(readFieldConfig(el(`<input data-test-target name="d">`), 'date').required).toBe(false)
    })

    it('keeps the outer-OR inner-AND ruleset shape verbatim', () => {
        const rules = JSON.stringify([
            [{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'x' }],
        ]).replace(/"/g, '&quot;')
        const cfg = readFieldConfig(el(`<input data-test-target name="d" conditional-logic="${rules}">`), 'date')
        expect(cfg.conditional).toEqual([[{ inputName: 'a', compareLogic: 'IS_EQUAL', compareValue: 'x' }]])
    })

    it('treats absent, empty and malformed rules alike as no rules', () => {
        expect(readFieldConfig(el(`<input data-test-target name="d">`), 'date').conditional).toBeUndefined()
        expect(readFieldConfig(el(`<input data-test-target name="d" conditional-logic="[]">`), 'date').conditional).toBeUndefined()
        expect(readFieldConfig(el(`<input data-test-target name="d" conditional-logic="{oops">`), 'date').conditional).toBeUndefined()
    })

    it('carries the custom validation messages through', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d" data-empty-error-msg="Pick a date" data-invalid-error-msg="Bad date">`),
            'date',
        )
        expect(cfg.messages).toEqual({ empty: 'Pick a date', invalid: 'Bad date' })
    })
})

describe('a missing numeric attribute is not zero', () => {
    it('gives the declared fallback, not Number(null)', () => {
        // 5.1.5 read these with `Number(el.getAttribute(...))`, so a slider with
        // no `data-max` had a maximum of 0 and a range slider with no defaults
        // was pinned to `0,0`.
        const node = el('<input data-test-target form-fields-pro-number-slider>')
        const config = readFieldConfig(node, 'slider')
        expect(config.options.max).toBe(100)
        expect(config.options.min).toBe(0)
        expect(Number.isNaN(config.options.default as number)).toBe(true)
    })

    it('still reads a real zero', () => {
        const node = el('<input data-test-target form-fields-pro-number-slider data-min="0" data-max="0">')
        expect(readFieldConfig(node, 'slider').options.max).toBe(0)
    })
})
