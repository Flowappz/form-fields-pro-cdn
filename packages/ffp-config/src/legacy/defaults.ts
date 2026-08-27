import type { ThemeTokens } from '../types'

/** Lifted verbatim from runtime 5.1.5 so normalized output is byte-comparable. */
export const DATE_STYLE_DEFAULTS: ThemeTokens = {
    calendarTheme: 'light',
    selectedDateTextColorLight: 'rgb(255, 255, 255)',
    selectedDateTextColorDark: 'rgb(255, 255, 255)',
    selectedDateBackgroundColorLight: 'rgb(20, 110, 245)',
    selectedDateBackgroundColorDark: 'rgb(20, 110, 245)',
    todayDateColorLight: 'rgb(20, 110, 245)',
    todayDateColorDark: 'rgb(147, 197, 253)',
    calendarBackgroundColorLight: 'rgb(255, 255, 255)',
    calendarBackgroundColorDark: 'rgb(17, 24, 39)',
    calendarBorderColorLight: 'rgb(229, 231, 235)',
    calendarBorderColorDark: 'rgb(55, 65, 81)',
    dateTextColorLight: 'rgb(17, 24, 39)',
    dateTextColorDark: 'rgb(243, 244, 246)',
    weekdayTextColorLight: 'rgb(107, 114, 128)',
    weekdayTextColorDark: 'rgb(156, 163, 175)',
    headerTextColorLight: 'rgb(17, 24, 39)',
    headerTextColorDark: 'rgb(243, 244, 246)',
    dropdownBackgroundColorLight: 'rgb(255, 255, 255)',
    dropdownBackgroundColorDark: 'rgb(31, 41, 55)',
    hoverBackgroundColorLight: 'rgb(243, 244, 246)',
    hoverBackgroundColorDark: 'rgb(55, 65, 81)',
    borderRadius: '12',
}

export const SLIDER_STYLE_DEFAULTS: ThemeTokens = {
    maxMinTextColorLight: 'rgb(26, 26, 26)',
    maxMinTextColorDark: 'rgb(245, 245, 245)',
    tooltipTextColorLight: 'rgb(255, 255, 255)',
    tooltipTextColorDark: 'rgb(255, 255, 255)',
    sliderColorLight: 'rgb(20, 110, 245)',
    sliderColorDark: 'rgb(20, 110, 245)',
    trackColorLight: 'rgb(237, 237, 237)',
    trackColorDark: 'rgb(80, 80, 80)',
}

export const NPS_STYLE_DEFAULTS: ThemeTokens = {
    textColorLight: 'inherit',
    textColorDark: 'inherit',
    backgroundColorLight: 'transparent',
    backgroundColorDark: 'transparent',
    hoverTextColorLight: '#ffffff',
    hoverTextColorDark: '#ffffff',
    hoverBackgroundColorLight: '#146ef5',
    hoverBackgroundColorDark: '#146ef5',
    borderColorLight: '#d4d4d4',
    borderColorDark: '#505050',
    borderRadius: '8px',
    layout: 'connected',
}

/**
 * NPS selected colors have no standalone default: they fall back to the resolved
 * hover colors. Kept as a marker so `readFieldConfig` documents the dependency
 * rather than hiding it in a literal.
 */
export const NPS_SELECTED_FOLLOWS_HOVER = true

/**
 * Select, phone and color picker carry no defaults in runtime 5.1.5 - they read
 * their attributes and leave anything absent undefined, so the widget inherits
 * from the page. Normalizing them to invented literals would be a visible
 * behaviour change on every existing site, so these types intentionally have no
 * defaults table.
 */
