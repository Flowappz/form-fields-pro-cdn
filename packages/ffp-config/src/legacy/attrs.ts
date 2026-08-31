import type { FieldType } from '../types'

/**
 * Theme token -> legacy attribute name, per theme family.
 *
 * Rung 3 of the compatibility ladder. Every name here was read out of runtime
 * 5.1.5 rather than guessed; a wrong name silently drops a customer's colour and
 * falls through to a default, which is invisible in code review and obvious on
 * their published site.
 *
 * A token with no entry has no attribute form and resolves from the compact blob,
 * the wrapper config or a default only.
 */
export type ThemeAttrMap = Record<string, string>

export const DATE_THEME_ATTRS: ThemeAttrMap = {
    selectedDateTextColorLight: 'data-light-theme-selected-date-text-color',
    selectedDateTextColorDark: 'data-dark-theme-selected-date-text-color',
    selectedDateBackgroundColorLight: 'data-light-theme-selected-date-background-color',
    selectedDateBackgroundColorDark: 'data-dark-theme-selected-date-background-color',
    todayDateColorLight: 'data-light-theme-today-color',
    todayDateColorDark: 'data-dark-theme-today-color',
    calendarBackgroundColorLight: 'data-light-theme-calendar-background-color',
    calendarBackgroundColorDark: 'data-dark-theme-calendar-background-color',
    calendarBorderColorLight: 'data-light-theme-calendar-border-color',
    calendarBorderColorDark: 'data-dark-theme-calendar-border-color',
    dateTextColorLight: 'data-light-theme-date-text-color',
    dateTextColorDark: 'data-dark-theme-date-text-color',
    weekdayTextColorLight: 'data-light-theme-weekday-text-color',
    weekdayTextColorDark: 'data-dark-theme-weekday-text-color',
    headerTextColorLight: 'data-light-theme-header-text-color',
    headerTextColorDark: 'data-dark-theme-header-text-color',
    dropdownBackgroundColorLight: 'data-light-theme-dropdown-background-color',
    dropdownBackgroundColorDark: 'data-dark-theme-dropdown-background-color',
    hoverBackgroundColorLight: 'data-light-theme-hover-background-color',
    hoverBackgroundColorDark: 'data-dark-theme-hover-background-color',
    // borderRadius has no attribute form on date - blob or wrapper config only.
    calendarTheme: 'data-date-scheme',
}

export const SLIDER_THEME_ATTRS: ThemeAttrMap = {
    maxMinTextColorLight: 'data-light-theme-max-min-text-color',
    maxMinTextColorDark: 'data-dark-theme-max-min-text-color',
    tooltipTextColorLight: 'data-light-theme-tooltip-text-color',
    tooltipTextColorDark: 'data-dark-theme-tooltip-text-color',
    sliderColorLight: 'data-light-theme-slider-color',
    sliderColorDark: 'data-dark-theme-slider-color',
    trackColorLight: 'data-light-theme-track-color',
    trackColorDark: 'data-dark-theme-track-color',
}

/**
 * NPS calls its idle state "idle" and its hover state "score" in the attribute
 * names, but "text/background" and "hover*" in the token names. The mismatch is
 * historical and load-bearing: renaming either side breaks published pages.
 */
export const NPS_THEME_ATTRS: ThemeAttrMap = {
    textColorLight: 'data-light-theme-idle-text-color',
    textColorDark: 'data-dark-theme-idle-text-color',
    backgroundColorLight: 'data-light-theme-idle-background-color',
    backgroundColorDark: 'data-dark-theme-idle-background-color',
    hoverTextColorLight: 'data-light-theme-score-text-color',
    hoverTextColorDark: 'data-dark-theme-score-text-color',
    hoverBackgroundColorLight: 'data-light-theme-score-background-color',
    hoverBackgroundColorDark: 'data-dark-theme-score-background-color',
    selectedTextColorLight: 'data-light-theme-selected-text-color',
    selectedTextColorDark: 'data-dark-theme-selected-text-color',
    selectedBackgroundColorLight: 'data-light-theme-selected-background-color',
    selectedBackgroundColorDark: 'data-dark-theme-selected-background-color',
    borderColorLight: 'data-light-theme-border-color',
    borderColorDark: 'data-dark-theme-border-color',
    borderRadius: 'data-border-radius',
    layout: 'data-nps-layout',
}

/**
 * Select's four published attributes are idle vs highlighted, not light vs dark.
 *
 * The Designer writes option colours onto the "dark theme hover" names and
 * highlighted colours onto the "light theme hover" names - a leftover from the
 * Style panel labelling a dimension the data does not have. `resolveSelect`
 * remaps them; this table is the published attribute set, not the token names
 * the listbox consumes.
 */
export const SELECT_THEME_ATTRS: ThemeAttrMap = {
    hoverTextColorLight: 'data-light-theme-hover-text-color',
    hoverTextColorDark: 'data-dark-theme-hover-text-color',
    hoverBackgroundColorLight: 'data-light-theme-hover-background-color',
    hoverBackgroundColorDark: 'data-dark-theme-hover-background-color',
}

/** Phone's country dropdown is themed under the "number input" name. */
export const PHONE_THEME_ATTRS: ThemeAttrMap = {
    hoverTextColorLight: 'data-light-theme-number-input-text-color',
    hoverTextColorDark: 'data-dark-theme-number-input-text-color',
    hoverBackgroundColorLight: 'data-light-theme-number-input-background-color',
    hoverBackgroundColorDark: 'data-dark-theme-number-input-background-color',
}

export const COLOR_THEME_ATTRS: ThemeAttrMap = {
    hoverTextColorLight: 'data-light-theme-color-picker-text-color',
    hoverTextColorDark: 'data-dark-theme-color-picker-text-color',
    hoverBackgroundColorLight: 'data-light-theme-color-picker-background-color',
    hoverBackgroundColorDark: 'data-dark-theme-color-picker-background-color',
}

/**
 * Which resolution algorithm a field type uses. Types absent from this map have
 * no theming at all in 5.1.5 - file is styled entirely by the customer's own
 * Webflow classes.
 */
export type ThemeFamily = 'date' | 'slider' | 'nps' | 'phone' | 'color' | 'select'

export const THEME_FAMILY: Partial<Record<FieldType, ThemeFamily>> = {
    date: 'date',
    daterange: 'date',
    slider: 'slider',
    rangeslider: 'slider',
    nps: 'nps',
    likert: 'nps',
    phone: 'phone',
    color: 'color',
    select: 'select',
}

export const THEME_ATTRS: Record<ThemeFamily, ThemeAttrMap> = {
    date: DATE_THEME_ATTRS,
    slider: SLIDER_THEME_ATTRS,
    nps: NPS_THEME_ATTRS,
    phone: PHONE_THEME_ATTRS,
    color: COLOR_THEME_ATTRS,
    select: SELECT_THEME_ATTRS,
}

/** Which compact blob attribute carries the tilde/JSON theme, per family. */
export const THEME_BLOB_ATTR: Partial<Record<ThemeFamily, string>> = {
    date: 'data-date-theme',
    slider: 'data-slider-theme',
    nps: 'data-nps-theme',
}
