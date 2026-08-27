import type { ThemeTokens } from '@flowappz/ffp-config'

/**
 * Theme tokens become paired CSS custom properties, resolved in CSS.
 *
 * Standardises on the pattern `formFieldsNumberSlider` already uses: emit
 * `--ffp-x-light` and `--ffp-x-dark` on the widget root and let one
 * `prefers-color-scheme` block choose between them. No `matchMedia` listener, no
 * JS on scheme change, and the customer can override either half from Webflow.
 *
 * The alternative - resolving light/dark in JS - is what NPS does today, and it
 * is why NPS fields do not follow a visitor switching their OS to dark mode
 * mid-session.
 */

const SUFFIX = /(Light|Dark)$/

/** `hoverBackgroundColorLight` -> `--ffp-hover-background-color-light` */
export function tokenToVar(token: string): string {
    return `--ffp-${token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`
}

/**
 * Write every token as a custom property on the widget root.
 *
 * Tokens without a Light/Dark suffix (layout, borderRadius, calendarTheme) are
 * written too - they are scheme-independent but still belong in one place.
 */
export function applyTheme(root: HTMLElement, theme: ThemeTokens): void {
    for (const token of Object.keys(theme)) {
        const value = theme[token]
        if (value === undefined || value === null || String(value) === '') continue
        root.style.setProperty(tokenToVar(token), String(value))
    }
}

/**
 * Emit the CSS that resolves a light/dark pair to a single working variable.
 *
 * Called once per widget stylesheet with the token names that widget uses, so a
 * page with only a select field never ships the date field's 22 declarations.
 */
export function schemeResolverCss(scope: string, tokens: string[]): string {
    const bases = Array.from(new Set(tokens.filter((t) => SUFFIX.test(t)).map((t) => t.replace(SUFFIX, ''))))
    if (!bases.length) return ''

    const assign = (half: 'light' | 'dark') =>
        bases.map((base) => `${tokenToVar(base)}: var(${tokenToVar(base)}-${half});`).join('')

    return (
        `${scope}{${assign('light')}}` +
        `@media (prefers-color-scheme: dark){${scope}{${assign('dark')}}}` +
        // An explicit page-level opt-out, for sites that force one scheme.
        `[data-ffp-scheme="light"] ${scope}{${assign('light')}}` +
        `[data-ffp-scheme="dark"] ${scope}{${assign('dark')}}`
    )
}
