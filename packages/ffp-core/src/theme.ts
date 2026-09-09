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

/** `rgba(15, 23, 42, 0.9)` and `rgb(15 23 42 / 90%)` both yield [r,g,b,a]. */
function parseColor(value: string): [number, number, number, number] | null {
    const nums = value.match(/[\d.]+/g)
    if (!nums || nums.length < 3) return null
    const a = nums.length > 3 ? Number(nums[3]) : 1
    return [Number(nums[0]), Number(nums[1]), Number(nums[2]), a]
}

/**
 * Perceived lightness of the first painted surface behind `el`, or null when
 * nothing up the tree paints one.
 *
 * Start from the field's parent, never the widget root: the root already
 * carries our own themed background, so measuring it would just report back
 * the scheme we are trying to decide.
 */
function surfaceLuminance(el: Element | null): number | null {
    for (let node = el; node; node = node.parentElement) {
        const rgba = parseColor(getComputedStyle(node).backgroundColor)
        // A near-transparent layer lets the surface behind it show through, so
        // keep walking rather than judging a colour the visitor cannot see.
        if (rgba && rgba[3] > 0.5) return 0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2]
    }
    return null
}

/**
 * Decide light or dark for a field from the page, not the visitor's OS.
 *
 * A Webflow site in light mode was rendering dark fields whenever the visitor's
 * OS was dark, because `prefers-color-scheme` is the only thing the CSS could
 * see. There is no portable Webflow theme signal to read - published pages
 * carry `data-wf-site` and `data-wf-page` but nothing about colour - and sites
 * theme themselves in several different ways, so the surface the field is
 * actually sitting on is the one thing that is true in all of them.
 */
export function resolveScheme(el: Element): 'light' | 'dark' {
    const lum = surfaceLuminance(el.parentElement)
    if (lum !== null) return lum < 128 ? 'dark' : 'light'

    // Nothing opaque behind the field - a form over an image or a gradient.
    // Ask what the page declares itself to be before falling back to the OS.
    const declared = getComputedStyle(document.documentElement).colorScheme || ''
    const light = declared.includes('light')
    const dark = declared.includes('dark')
    if (dark !== light) return dark ? 'dark' : 'light'

    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

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
        // An unsuffixed token alongside both halves would freeze the working
        // variable as an inline style and beat schemeResolverCss, so dark
        // mode would never flip. Older runtimes still consume the unsuffixed
        // idle colours; this skip is what lets a dual-write theme work on both.
        if (!SUFFIX.test(token) && theme[`${token}Light`] && theme[`${token}Dark`]) continue
        root.style.setProperty(tokenToVar(token), String(value))
    }

    if (!tracked.includes(root)) tracked.push(root)
    pinScheme(root)
    watchPageTheme()
}

/** Widget roots whose scheme we own, so a site theme toggle can re-resolve. */
const tracked: HTMLElement[] = []

/**
 * Pin one widget to the scheme of the surface it sits on.
 *
 * Skipped when an ancestor already declares one, so an explicit
 * `data-ffp-scheme` from the site owner keeps winning. Checked from the parent
 * up, never from the root, so a repaint re-resolves rather than reading back
 * the value we set last time.
 */
function pinScheme(root: HTMLElement): void {
    if (root.parentElement?.closest('[data-ffp-scheme]')) return
    root.setAttribute('data-ffp-scheme', resolveScheme(root))
}

let watching = false

/**
 * Re-resolve when the site flips its own theme.
 *
 * A Webflow dark-mode toggle almost always swaps a class on `<html>` or
 * `<body>`; without this the fields would keep the scheme they were mounted
 * with and stay wrong until reload.
 */
function watchPageTheme(): void {
    if (watching || typeof MutationObserver === 'undefined') return
    watching = true

    let queued = 0
    const observer = new MutationObserver(() => {
        cancelAnimationFrame(queued)
        queued = requestAnimationFrame(() => {
            for (let i = tracked.length - 1; i >= 0; i--) {
                const root = tracked[i]!
                if (root.isConnected) pinScheme(root)
                else tracked.splice(i, 1)
            }
        })
    })

    const options = { attributes: true, attributeFilter: ['class', 'style'] }
    observer.observe(document.documentElement, options)
    if (document.body) observer.observe(document.body, options)
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
        `[data-ffp-scheme="dark"] ${scope}{${assign('dark')}}` +
        // The widget itself, for fields that publish a scheme (date's
        // calendarTheme). The calendar is portalled to body, so an ancestor
        // selector never sees it.
        `${scope}[data-ffp-scheme="light"]{${assign('light')}}` +
        `${scope}[data-ffp-scheme="dark"]{${assign('dark')}}`
    )
}
