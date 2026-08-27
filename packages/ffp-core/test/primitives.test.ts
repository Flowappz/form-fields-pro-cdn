import { beforeEach, describe, expect, it } from 'vitest'
import { hsvToRgb, isDark, parseColor, rgbToHsv, toHex, toRgbaString } from '../src/color'
import { isFieldDisabled, resetLicense, type LicenseState } from '../src/license'
import { applyTheme, schemeResolverCss, tokenToVar } from '../src/theme'
import { resetDom } from './setup'

beforeEach(() => resetLicense())

describe('colour parsing', () => {
    it('accepts every spelling a Webflow field can hold', () => {
        expect(parseColor('#146ef5')).toEqual({ r: 20, g: 110, b: 245, a: 1 })
        expect(parseColor('146ef5')).toEqual({ r: 20, g: 110, b: 245, a: 1 })
        expect(parseColor('#abc')).toEqual({ r: 170, g: 187, b: 204, a: 1 })
        expect(parseColor('rgb(20, 110, 245)')).toEqual({ r: 20, g: 110, b: 245, a: 1 })
        expect(parseColor('rgba(20,110,245,0.5)')).toEqual({ r: 20, g: 110, b: 245, a: 0.5 })
        expect(parseColor('#00000080')?.a).toBeCloseTo(0.5, 2)
    })

    it('returns null for unset rather than a fallback colour', () => {
        // "unset" means fall through to the next rung of the config ladder;
        // "black" means the author chose black. Collapsing them silently
        // repaints fields that were meant to inherit from the page.
        expect(parseColor('')).toBeNull()
        expect(parseColor('   ')).toBeNull()
        expect(parseColor('transparent')).toBeNull()
        expect(parseColor('inherit')).toBeNull()
        expect(parseColor(null)).toBeNull()
        expect(parseColor('#12345')).toBeNull()
    })

    it('round-trips through hsv without drifting', () => {
        for (const hex of ['#146ef5', '#ff0000', '#00ff88', '#ffffff', '#000000', '#7f3fbf']) {
            const rgb = parseColor(hex)!
            expect(toHex(hsvToRgb(rgbToHsv(rgb), rgb.a))).toBe(hex)
        }
    })

    it('formats alpha only when it is actually transparent', () => {
        expect(toRgbaString({ r: 1, g: 2, b: 3, a: 1 })).toBe('rgb(1, 2, 3)')
        expect(toRgbaString({ r: 1, g: 2, b: 3, a: 0.4 })).toBe('rgba(1, 2, 3, 0.4)')
    })

    it('picks readable text over a swatch', () => {
        expect(isDark(parseColor('#111111')!)).toBe(true)
        expect(isDark(parseColor('#eeeeee')!)).toBe(false)
    })
})

describe('theme tokens', () => {
    it('maps camelCase tokens onto kebab-case custom properties', () => {
        expect(tokenToVar('hoverBackgroundColorLight')).toBe('--ffp-hover-background-color-light')
        expect(tokenToVar('borderRadius')).toBe('--ffp-border-radius')
    })

    it('writes every non-blank token onto the widget root', () => {
        resetDom('<body><div id="w"></div></body>')
        const root = document.getElementById('w') as unknown as HTMLElement
        applyTheme(root, { hoverBackgroundColorLight: '#146ef5', borderRadius: '8px', textColorDark: '' })
        expect(root.style.getPropertyValue('--ffp-hover-background-color-light')).toBe('#146ef5')
        expect(root.style.getPropertyValue('--ffp-border-radius')).toBe('8px')
        // A blank token is skipped, not written as an empty custom property -
        // an empty value would shadow the stylesheet's own fallback.
        expect(root.style.getPropertyValue('--ffp-text-color-dark')).toBe('')
    })

    it('resolves each light/dark pair in CSS, so no JS runs on a scheme change', () => {
        const css = schemeResolverCss('.ffp-x', ['hoverTextColorLight', 'hoverTextColorDark', 'borderRadius'])
        expect(css).toContain('.ffp-x{--ffp-hover-text-color: var(--ffp-hover-text-color-light);}')
        expect(css).toContain('@media (prefers-color-scheme: dark)')
        expect(css).toContain('[data-ffp-scheme="dark"] .ffp-x')
        // A scheme-independent token has no pair to resolve.
        expect(css).not.toContain('--ffp-border-radius:')
    })

    it('emits nothing when a widget has no paired tokens', () => {
        expect(schemeResolverCss('.ffp-x', ['borderRadius', 'layout'])).toBe('')
    })
})

describe('kill switch', () => {
    const state = (over: Partial<LicenseState> = {}): LicenseState => ({
        active: true,
        disabledFields: [],
        forceLegacy: false,
        stale: false,
        ...over,
    })

    it('disables only the named field types', () => {
        const s = state({ disabledFields: ['date'] })
        expect(isFieldDisabled(s, 'date')).toBe(true)
        expect(isFieldDisabled(s, 'select')).toBe(false)
    })

    it('fails open when the license service is unreachable', () => {
        // An outage must not disable every field on every site. That would turn
        // one service outage into a total outage - the opposite of a safety
        // mechanism. Entitlement still fails closed; only the switch is open.
        const s = state({ stale: true, disabledFields: ['date'] })
        expect(isFieldDisabled(s, 'date')).toBe(false)
        expect(isFieldDisabled(null, 'date')).toBe(false)
    })
})
