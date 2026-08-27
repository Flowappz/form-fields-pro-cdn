import { describe, expect, it } from 'vitest'
import { DATE_STYLE_DEFAULTS, readFieldConfig } from '../src/index'
import { el } from './dom'

/**
 * The rung-by-rung contract.
 *
 * Every case below is a shape that exists on published customer pages today. A
 * regression here is invisible in review and visible on someone's live site, so
 * these assert resolved values, not just that resolution happened.
 */

/** 22 tilde-separated values, in DATE_POSITIONS order. */
const DATE_TILDE = [
    '#fff', '#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888', '#999',
    '#aaa', '#bbb', '#ccc', '#ddd', '#eee', '#f00', '#0f0', '#00f', '#0ff', '#f0f',
    '20', 'dark',
].join('~')

describe('rung 1 - data-ffp v2', () => {
    it('wins outright and ignores every legacy attribute', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d"
                 data-ffp='{"v":2,"type":"date","name":"d","required":true,"options":{"format":"YYYY-MM-DD"},"theme":{"calendarTheme":"dark"},"messages":{}}'
                 data-date-theme="${DATE_TILDE}"
                 data-format="MM/DD/YYYY">`),
            'date',
        )
        expect(cfg.options.format).toBe('YYYY-MM-DD')
        expect(cfg.theme.calendarTheme).toBe('dark')
        expect(cfg.required).toBe(true)
    })

    it('falls through when the version key is missing or stale', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d" data-ffp='{"v":1,"theme":{"calendarTheme":"dark"}}'>`),
            'date',
        )
        expect(cfg.theme.calendarTheme).toBe(DATE_STYLE_DEFAULTS.calendarTheme)
    })

    it('falls through rather than throwing on malformed JSON', () => {
        const cfg = readFieldConfig(el(`<input data-test-target name="d" data-ffp='{not json'>`), 'date')
        expect(cfg.v).toBe(2)
        expect(cfg.theme.calendarTheme).toBe('light')
    })
})

describe('rung 2 - compact theme blob', () => {
    it('reads the tilde form positionally', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d" data-date-theme="${DATE_TILDE}">`),
            'date',
        )
        expect(cfg.theme.selectedDateTextColorLight).toBe('#fff')
        expect(cfg.theme.hoverBackgroundColorDark).toBe('#f0f')
        expect(cfg.theme.borderRadius).toBe('20')
        expect(cfg.theme.calendarTheme).toBe('dark')
    })

    it('rejects a blob shorter than the minimum arity', () => {
        const cfg = readFieldConfig(el(`<input data-test-target name="d" data-date-theme="#fff~#111">`), 'date')
        expect(cfg.theme.selectedDateTextColorLight).toBe(
            DATE_STYLE_DEFAULTS.selectedDateTextColorLight,
        )
    })

    it('accepts a JSON blob on date, which 5.1.5 silently dropped', () => {
        // parseDateTheme was tilde-only: a JSON blob split to one element, failed
        // the arity gate and fell through to defaults. This is the fix.
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d" data-date-theme='{"calendarTheme":"dark","todayDateColorLight":"#abc"}'>`),
            'date',
        )
        expect(cfg.theme.calendarTheme).toBe('dark')
        expect(cfg.theme.todayDateColorLight).toBe('#abc')
    })

    it('reads the NPS blob off the scale descendant, not just the root', () => {
        const cfg = readFieldConfig(
            el(`<div data-test-target data-field-name="nps">
                  <div data-nps-scale data-nps-theme='{"borderColorLight":"#123456"}'></div>
                </div>`),
            'nps',
        )
        expect(cfg.theme.borderColorLight).toBe('#123456')
    })
})

describe('rung 3 - individual theme attributes', () => {
    it('applies when no blob is present', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d" data-light-theme-today-color="#123">`),
            'date',
        )
        expect(cfg.theme.todayDateColorLight).toBe('#123')
        expect(cfg.theme.todayDateColorDark).toBe(DATE_STYLE_DEFAULTS.todayDateColorDark)
    })

    it('loses to the blob for the same token', () => {
        const cfg = readFieldConfig(
            el(`<input data-test-target name="d" data-date-theme="${DATE_TILDE}" data-light-theme-today-color="#123">`),
            'date',
        )
        expect(cfg.theme.todayDateColorLight).toBe('#222')
    })

    it('resolves from an ancestor when the attribute sits on the wrapper', () => {
        const cfg = readFieldConfig(
            el(`<div data-light-theme-today-color="#abc"><input data-test-target name="d"></div>`),
            'date',
        )
        expect(cfg.theme.todayDateColorLight).toBe('#abc')
    })
})

describe('rung 4 - wrapper data-field-config', () => {
    it('fills tokens the attributes did not carry', () => {
        const cfg = readFieldConfig(
            el(`<div data-field-config='{"style":{"todayDateColorLight":"#cfg","headerTextColorLight":"#hdr"}}'>
                  <input data-test-target name="d" data-light-theme-today-color="#attr">
                </div>`),
            'date',
        )
        expect(cfg.theme.todayDateColorLight).toBe('#attr')
        expect(cfg.theme.headerTextColorLight).toBe('#hdr')
    })

    it('reads the unprefixed field-config spelling too', () => {
        const cfg = readFieldConfig(
            el(`<div data-field-config field-config='{"style":{"headerTextColorLight":"#hdr"}}'>
                  <input data-test-target name="d">
                </div>`),
            'date',
        )
        expect(cfg.theme.headerTextColorLight).toBe('#hdr')
    })
})

describe('rung 5 - fa-form-config', () => {
    it('recovers style and general for a field matched by name', () => {
        const form = JSON.stringify({
            pages: [
                {
                    fields: [
                        { general: { fieldName: 'other' }, style: { headerTextColorLight: '#no' } },
                        { general: { fieldName: 'birthday' }, style: { headerTextColorLight: '#yes' } },
                    ],
                },
            ],
        }).replace(/"/g, '&quot;')
        const cfg = readFieldConfig(
            el(`<div fa-form fa-form-config="${form}"><input data-test-target name="birthday"></div>`),
            'date',
        )
        expect(cfg.theme.headerTextColorLight).toBe('#yes')
    })

    it('loses to the wrapper config', () => {
        const form = JSON.stringify({
            pages: [{ fields: [{ name: 'birthday', style: { headerTextColorLight: '#fa' } }] }],
        }).replace(/"/g, '&quot;')
        const cfg = readFieldConfig(
            el(`<div fa-form fa-form-config="${form}">
                  <div data-field-config='{"style":{"headerTextColorLight":"#wrap"}}'>
                    <input data-test-target name="birthday">
                  </div>
                </div>`),
            'date',
        )
        expect(cfg.theme.headerTextColorLight).toBe('#wrap')
    })
})

describe('rung 6 - defaults', () => {
    it('produces the full default theme for a bare element', () => {
        const cfg = readFieldConfig(el(`<input data-test-target name="d">`), 'date')
        expect(cfg.theme).toEqual(DATE_STYLE_DEFAULTS)
    })

    it('leaves select and file untouched - they have no theme in 5.1.5', () => {
        expect(readFieldConfig(el(`<select data-test-target name="s"></select>`), 'select').theme).toEqual({})
        expect(readFieldConfig(el(`<input data-test-target type="file" name="f">`), 'file').theme).toEqual({})
    })
})
