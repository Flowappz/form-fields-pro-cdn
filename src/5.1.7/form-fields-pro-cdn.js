/**
 * FORM FIELDS PRO CDN SCRIPT - v5.1.7
 * https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/form-fields-pro-cdn.bb0860f57101.js
 * sha384-UD28ylqNmMHcm/ckgXLg5HH5Unz1dIKSV2be8bdkgCCUhAJpvl4OHaMmLlH5K6Qs
 * pnpm release:staging -- --version 5.1.7 --register
 * Built from packages/ (core + lazy field chunks). Zero vendor CDNs.
 */

"use strict";
(() => {
  // packages/ffp-core/src/manifest.generated.ts
  var MANIFEST = {
    "color": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-color.d3629f8dcdee.js", "integrity": "sha384-IzeCdK/VkrZqRI5H+mkvLdyKpCkDmYjIX5unVLV6jH5J6Of+w+SWmCu7ZegTpRjQ", "deps": ["ui-popover"], "bytes": 8411 },
    "date": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-date.be51a0ce90b5.js", "integrity": "sha384-4KI2lPWEQYKSfN21wwiNklQN7v2DxiQ0ODbTpCiYUYZHBfuAmSNzjyTM+kzUend8", "deps": ["ui-popover"], "bytes": 14868 },
    "file": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-file.b8cad3e7765e.js", "integrity": "sha384-2lv/E+e+1v9gBUUIndfopJZ+Vwcnwgps8t6uxjWDV1/CDpe07hP0hjPQY8zUaQdM", "deps": [], "bytes": 7575 },
    "nps": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-nps.6597c0f7afe9.js", "integrity": "sha384-bCRBXHH+8JO28Y2vM8ofXfRRWsG+iSctm6ieeqhVNIMF9bkyLEJbcHd4tXOC107y", "deps": [], "bytes": 9899 },
    "phone": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-phone.8ec2e05aa679.js", "integrity": "sha384-PH56/tX8Ghl34GWiRZsE1amOwi9zhJX1iopKllFwxV5mPxjcdYZdAzUSDd2lVWe0", "deps": ["ui-popover"], "bytes": 14919 },
    "select": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-select.89cb1ac71fad.js", "integrity": "sha384-yKfr2jUc6TNf41+fgrd6Y2VOfvfkJrDbLeQTC0+FAlf98PfbC8SgJaTUNLLNe/fQ", "deps": ["ui-popover"], "bytes": 4797 },
    "slider": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-slider.3f4ccfcbb037.js", "integrity": "sha384-K1WFQt5xtfR5L9vSULgRu+LMqQY8W7eAbgYp/jrrySBsftOAbYUWI9tV1xRI5pma", "deps": [], "bytes": 8765 },
    "ui-popover": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/ui-popover.f03c59f41d4a.js", "integrity": "sha384-Fo5jQ5qBPQw2wkOq0Q1nu62/rxuuAx49oS6TVK8YwCZH5KvccGEy8vAKtGhxTx4Z", "deps": [], "bytes": 7495 },
    "userip": { "url": "https://cdn.flowappz.cloud/form-fields-pro/staging/5.1.7/chunks/field-userip.4572c36abc1b.js", "integrity": "sha384-VeaU20mJjq4cooZ+BgMGDJ2L2eLoC77gLZqvVn/4mL2vQDiPIU7y5BYhhGwQuaIw", "deps": [], "bytes": 799 }
  };
  var VERSION = "5.1.7";

  // packages/ffp-core/src/loader.ts
  var DEFAULT_TIMEOUT_MS = 8e3;
  var pending = {};
  var defined = {};
  var settle = {};
  var results = [];
  function define(key, factory) {
    defined[key] = factory;
    const resolve = settle[key];
    if (resolve) resolve(factory);
  }
  function loadChunk(key, manifest = MANIFEST, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const existing = pending[key];
    if (existing) return existing;
    const started = Date.now();
    const record = (ok, reason) => {
      const result = { key, ok, ms: Date.now() - started };
      if (reason) result.reason = reason;
      results.push(result);
      return result;
    };
    const entry = manifest[key];
    if (!entry) {
      const missing = Promise.resolve(record(false, "manifest"));
      pending[key] = missing;
      return missing;
    }
    const loading = (async () => {
      for (const dep of entry.deps || []) {
        const depResult = await loadChunk(dep, manifest, timeoutMs);
        if (!depResult.ok) return record(false, `dep:${dep}`);
      }
      if (defined[key]) return record(true);
      return new Promise((resolve) => {
        let done = false;
        const finish = (ok, reason) => {
          if (done) return;
          done = true;
          delete settle[key];
          resolve(record(ok, reason));
        };
        settle[key] = () => finish(true);
        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("integrity", entry.integrity);
        script.setAttribute("data-ffp-chunk", key);
        script.setAttribute("src", entry.url);
        script.onerror = () => finish(false, "network");
        document.head.appendChild(script);
        setTimeout(() => finish(false, "timeout"), timeoutMs);
      });
    })();
    pending[key] = loading;
    return loading;
  }
  function getFactory(key) {
    return defined[key];
  }

  // packages/ffp-config/src/types.ts
  var CONFIG_VERSION = 2;

  // packages/ffp-config/src/dom.ts
  function attrFrom(el, name) {
    const own = el.getAttribute(name);
    if (own !== null) return own;
    const owner = el.closest(`[${name}]`);
    return owner ? owner.getAttribute(name) : null;
  }
  function attrReader(el) {
    return (name) => attrFrom(el, name);
  }

  // packages/ffp-config/src/legacy/attrs.ts
  var DATE_THEME_ATTRS = {
    selectedDateTextColorLight: "data-light-theme-selected-date-text-color",
    selectedDateTextColorDark: "data-dark-theme-selected-date-text-color",
    selectedDateBackgroundColorLight: "data-light-theme-selected-date-background-color",
    selectedDateBackgroundColorDark: "data-dark-theme-selected-date-background-color",
    todayDateColorLight: "data-light-theme-today-color",
    todayDateColorDark: "data-dark-theme-today-color",
    calendarBackgroundColorLight: "data-light-theme-calendar-background-color",
    calendarBackgroundColorDark: "data-dark-theme-calendar-background-color",
    calendarBorderColorLight: "data-light-theme-calendar-border-color",
    calendarBorderColorDark: "data-dark-theme-calendar-border-color",
    dateTextColorLight: "data-light-theme-date-text-color",
    dateTextColorDark: "data-dark-theme-date-text-color",
    weekdayTextColorLight: "data-light-theme-weekday-text-color",
    weekdayTextColorDark: "data-dark-theme-weekday-text-color",
    headerTextColorLight: "data-light-theme-header-text-color",
    headerTextColorDark: "data-dark-theme-header-text-color",
    dropdownBackgroundColorLight: "data-light-theme-dropdown-background-color",
    dropdownBackgroundColorDark: "data-dark-theme-dropdown-background-color",
    hoverBackgroundColorLight: "data-light-theme-hover-background-color",
    hoverBackgroundColorDark: "data-dark-theme-hover-background-color",
    // borderRadius has no attribute form on date - blob or wrapper config only.
    calendarTheme: "data-date-scheme"
  };
  var SLIDER_THEME_ATTRS = {
    maxMinTextColorLight: "data-light-theme-max-min-text-color",
    maxMinTextColorDark: "data-dark-theme-max-min-text-color",
    tooltipTextColorLight: "data-light-theme-tooltip-text-color",
    tooltipTextColorDark: "data-dark-theme-tooltip-text-color",
    sliderColorLight: "data-light-theme-slider-color",
    sliderColorDark: "data-dark-theme-slider-color",
    trackColorLight: "data-light-theme-track-color",
    trackColorDark: "data-dark-theme-track-color"
  };
  var NPS_THEME_ATTRS = {
    textColorLight: "data-light-theme-idle-text-color",
    textColorDark: "data-dark-theme-idle-text-color",
    backgroundColorLight: "data-light-theme-idle-background-color",
    backgroundColorDark: "data-dark-theme-idle-background-color",
    hoverTextColorLight: "data-light-theme-score-text-color",
    hoverTextColorDark: "data-dark-theme-score-text-color",
    hoverBackgroundColorLight: "data-light-theme-score-background-color",
    hoverBackgroundColorDark: "data-dark-theme-score-background-color",
    selectedTextColorLight: "data-light-theme-selected-text-color",
    selectedTextColorDark: "data-dark-theme-selected-text-color",
    selectedBackgroundColorLight: "data-light-theme-selected-background-color",
    selectedBackgroundColorDark: "data-dark-theme-selected-background-color",
    borderColorLight: "data-light-theme-border-color",
    borderColorDark: "data-dark-theme-border-color",
    borderRadius: "data-border-radius",
    layout: "data-nps-layout"
  };
  var SELECT_THEME_ATTRS = {
    hoverTextColorLight: "data-light-theme-hover-text-color",
    hoverTextColorDark: "data-dark-theme-hover-text-color",
    hoverBackgroundColorLight: "data-light-theme-hover-background-color",
    hoverBackgroundColorDark: "data-dark-theme-hover-background-color"
  };
  var PHONE_THEME_ATTRS = {
    hoverTextColorLight: "data-light-theme-number-input-text-color",
    hoverTextColorDark: "data-dark-theme-number-input-text-color",
    hoverBackgroundColorLight: "data-light-theme-number-input-background-color",
    hoverBackgroundColorDark: "data-dark-theme-number-input-background-color"
  };
  var COLOR_THEME_ATTRS = {
    hoverTextColorLight: "data-light-theme-color-picker-text-color",
    hoverTextColorDark: "data-dark-theme-color-picker-text-color",
    hoverBackgroundColorLight: "data-light-theme-color-picker-background-color",
    hoverBackgroundColorDark: "data-dark-theme-color-picker-background-color"
  };
  var THEME_FAMILY = {
    date: "date",
    daterange: "date",
    slider: "slider",
    rangeslider: "slider",
    nps: "nps",
    likert: "nps",
    phone: "phone",
    color: "color",
    select: "select"
  };
  var THEME_ATTRS = {
    date: DATE_THEME_ATTRS,
    slider: SLIDER_THEME_ATTRS,
    nps: NPS_THEME_ATTRS,
    phone: PHONE_THEME_ATTRS,
    color: COLOR_THEME_ATTRS,
    select: SELECT_THEME_ATTRS
  };
  var THEME_BLOB_ATTR = {
    date: "data-date-theme",
    slider: "data-slider-theme",
    nps: "data-nps-theme"
  };

  // packages/ffp-config/src/legacy/defaults.ts
  var DATE_STYLE_DEFAULTS = {
    calendarTheme: "light",
    selectedDateTextColorLight: "rgb(255, 255, 255)",
    selectedDateTextColorDark: "rgb(255, 255, 255)",
    selectedDateBackgroundColorLight: "rgb(20, 110, 245)",
    selectedDateBackgroundColorDark: "rgb(20, 110, 245)",
    todayDateColorLight: "rgb(20, 110, 245)",
    todayDateColorDark: "rgb(147, 197, 253)",
    calendarBackgroundColorLight: "rgb(255, 255, 255)",
    calendarBackgroundColorDark: "rgb(17, 24, 39)",
    calendarBorderColorLight: "rgb(229, 231, 235)",
    calendarBorderColorDark: "rgb(55, 65, 81)",
    dateTextColorLight: "rgb(17, 24, 39)",
    dateTextColorDark: "rgb(243, 244, 246)",
    weekdayTextColorLight: "rgb(107, 114, 128)",
    weekdayTextColorDark: "rgb(156, 163, 175)",
    headerTextColorLight: "rgb(17, 24, 39)",
    headerTextColorDark: "rgb(243, 244, 246)",
    dropdownBackgroundColorLight: "rgb(255, 255, 255)",
    dropdownBackgroundColorDark: "rgb(31, 41, 55)",
    hoverBackgroundColorLight: "rgb(243, 244, 246)",
    hoverBackgroundColorDark: "rgb(55, 65, 81)",
    borderRadius: "12"
  };
  var SLIDER_STYLE_DEFAULTS = {
    maxMinTextColorLight: "rgb(26, 26, 26)",
    maxMinTextColorDark: "rgb(245, 245, 245)",
    tooltipTextColorLight: "rgb(255, 255, 255)",
    tooltipTextColorDark: "rgb(255, 255, 255)",
    sliderColorLight: "rgb(20, 110, 245)",
    sliderColorDark: "rgb(20, 110, 245)",
    trackColorLight: "rgb(237, 237, 237)",
    trackColorDark: "rgb(80, 80, 80)"
  };
  var NPS_STYLE_DEFAULTS = {
    textColorLight: "inherit",
    textColorDark: "inherit",
    backgroundColorLight: "transparent",
    backgroundColorDark: "transparent",
    hoverTextColorLight: "#ffffff",
    hoverTextColorDark: "#ffffff",
    hoverBackgroundColorLight: "#146ef5",
    hoverBackgroundColorDark: "#146ef5",
    borderColorLight: "#d4d4d4",
    borderColorDark: "#505050",
    borderRadius: "8px",
    layout: "connected"
  };

  // packages/ffp-config/src/legacy/themes.ts
  var DATE_POSITIONS = [
    "selectedDateTextColorLight",
    "selectedDateBackgroundColorLight",
    "todayDateColorLight",
    "calendarBackgroundColorLight",
    "calendarBorderColorLight",
    "dateTextColorLight",
    "weekdayTextColorLight",
    "headerTextColorLight",
    "dropdownBackgroundColorLight",
    "hoverBackgroundColorLight",
    "selectedDateTextColorDark",
    "selectedDateBackgroundColorDark",
    "todayDateColorDark",
    "calendarBackgroundColorDark",
    "calendarBorderColorDark",
    "dateTextColorDark",
    "weekdayTextColorDark",
    "headerTextColorDark",
    "dropdownBackgroundColorDark",
    "hoverBackgroundColorDark",
    "borderRadius",
    "calendarTheme"
  ];
  var SLIDER_POSITIONS = [
    "maxMinTextColorLight",
    "tooltipTextColorLight",
    "sliderColorLight",
    "trackColorLight",
    "maxMinTextColorDark",
    "tooltipTextColorDark",
    "sliderColorDark",
    "trackColorDark"
  ];
  var NPS_POSITIONS = [
    "textColorLight",
    "backgroundColorLight",
    "hoverTextColorLight",
    "hoverBackgroundColorLight",
    "selectedTextColorLight",
    "selectedBackgroundColorLight",
    "borderColorLight",
    "borderRadius",
    "layout",
    "textColorDark",
    "backgroundColorDark",
    "hoverTextColorDark",
    "hoverBackgroundColorDark",
    "selectedTextColorDark",
    "selectedBackgroundColorDark",
    "borderColorDark"
  ];
  var MIN_PARTS = { date: 21, slider: 8, nps: 9 };
  function fromPositions(parts, positions) {
    const out = {};
    for (let i = 0; i < positions.length; i++) {
      const value = parts[i];
      if (value !== void 0) out[positions[i]] = value;
    }
    return out;
  }
  function tryJson(value) {
    if (value.charAt(0) !== "{") return null;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }
  function parseCompactTheme(raw, kind) {
    if (!raw) return null;
    const value = String(raw);
    const json = tryJson(value);
    if (json) return json;
    const parts = value.split("~");
    if (parts.length < MIN_PARTS[kind]) return null;
    if (kind === "date") return fromPositions(parts, DATE_POSITIONS);
    if (kind === "slider") return fromPositions(parts, SLIDER_POSITIONS);
    return fromPositions(parts, NPS_POSITIONS);
  }
  function pick(value, fallback) {
    return value && String(value).trim() ? value : fallback;
  }
  function isWhite(value) {
    const normalized = String(value || "").replace(/\s/g, "").toLowerCase();
    return !normalized || normalized === "rgb(255,255,255)" || normalized === "#ffffff" || normalized === "#fff" || normalized === "white";
  }
  var colorKey = (value) => String(value || "").replace(/\s/g, "").toLowerCase();
  function contrastSliderTrack(fill, track) {
    const next = track && String(track).trim() ? String(track) : "";
    if (!fill || !next || colorKey(fill) !== colorKey(next)) return next;
    return isWhite(fill) ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
  }
  function isStockBlue(value) {
    const normalized = String(value || "").replace(/\s/g, "").toLowerCase();
    return !normalized || normalized === "rgb(20,110,245)" || normalized === "#146ef5";
  }
  function followHoverIfStockBlue(selected, hover) {
    if (isStockBlue(selected) && hover && !isStockBlue(hover)) return hover;
    return selected;
  }
  function normalizeRadius(value) {
    if (value === void 0 || value === null || String(value).trim() === "") return null;
    return `${String(value).replace(/px$/i, "")}px`;
  }

  // packages/ffp-config/src/legacy/wrapper.ts
  function readWrapperStyle(element) {
    try {
      const wrapper = element.closest("[data-field-config], [form-fields-wrapper]");
      if (!wrapper) return {};
      const raw = wrapper.getAttribute("data-field-config") || wrapper.getAttribute("field-config");
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && parsed.style || {};
    } catch {
      return {};
    }
  }
  function readFaFormField(element, fieldName) {
    try {
      const form = element.closest("[fa-form]");
      if (!form) return null;
      const raw = form.getAttribute("fa-form-config");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const pages = parsed && parsed.pages || [];
      for (const page of pages) {
        for (const field of page.fields || []) {
          const candidate = field.general && field.general.fieldName || field.name;
          if (candidate && String(candidate) === fieldName) return field;
        }
      }
      return null;
    } catch {
      return null;
    }
  }
  function readConditional(element) {
    const raw = element.getAttribute("conditional-logic");
    if (!raw) return void 0;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : void 0;
    } catch {
      return void 0;
    }
  }

  // packages/ffp-config/src/legacy/resolve-theme.ts
  function gather(el, family, faForm) {
    const attr = attrReader(el);
    const blobAttr = THEME_BLOB_ATTR[family];
    let raw = null;
    if (blobAttr) {
      const scale = family === "nps" ? el.querySelector("[data-nps-scale]") : null;
      raw = scale && scale.getAttribute(blobAttr) || attr(blobAttr);
    }
    const kind = family === "date" || family === "slider" || family === "nps" ? family : null;
    return {
      blob: kind && parseCompactTheme(raw, kind) || {},
      wrapper: readWrapperStyle(el),
      faForm: faForm || {}
    };
  }
  function ladder(src, attr, attrs, key, fallback) {
    const attrName = attrs[key];
    const fromAttr = attrName ? attr(attrName) : null;
    return pick(
      src.blob[key],
      pick(fromAttr, pick(src.wrapper[key], pick(src.faForm[key], fallback)))
    );
  }
  function resolveDate(el, src) {
    const attr = attrReader(el);
    const out = {};
    for (const key of Object.keys(DATE_THEME_ATTRS)) {
      if (key === "calendarTheme") continue;
      const value = ladder(src, attr, DATE_THEME_ATTRS, key, DATE_STYLE_DEFAULTS[key]);
      if (value !== void 0) out[key] = value;
    }
    const rawRadius = [
      src.blob.borderRadius,
      src.wrapper.borderRadius,
      src.faForm.borderRadius,
      DATE_STYLE_DEFAULTS.borderRadius
    ].find((v) => v !== void 0 && v !== null && String(v).trim() !== "");
    const radius = Number(String(rawRadius != null ? rawRadius : "").replace(/px$/i, "").trim());
    out.borderRadius = Number.isFinite(radius) ? String(Math.max(0, Math.min(48, radius))) : DATE_STYLE_DEFAULTS.borderRadius;
    out.calendarTheme = String(
      ladder(src, attr, DATE_THEME_ATTRS, "calendarTheme", DATE_STYLE_DEFAULTS.calendarTheme)
    ).toLowerCase();
    return out;
  }
  function resolveSlider(el, src) {
    const attr = attrReader(el);
    const merged = {};
    for (const key of Object.keys(SLIDER_THEME_ATTRS)) {
      const value = ladder(src, attr, SLIDER_THEME_ATTRS, key);
      if (value !== void 0) merged[key] = value;
    }
    const core = [
      merged.maxMinTextColorLight,
      merged.maxMinTextColorDark,
      merged.tooltipTextColorLight,
      merged.tooltipTextColorDark,
      merged.sliderColorLight,
      merged.sliderColorDark
    ];
    if (core.every(isWhite)) return { ...SLIDER_STYLE_DEFAULTS };
    const out = {};
    for (const key of Object.keys(SLIDER_THEME_ATTRS)) {
      out[key] = pick(merged[key], SLIDER_STYLE_DEFAULTS[key]);
    }
    out.trackColorLight = contrastSliderTrack(out.sliderColorLight, out.trackColorLight);
    out.trackColorDark = contrastSliderTrack(out.sliderColorDark, out.trackColorDark);
    return out;
  }
  function resolveNps(el, src) {
    const attr = attrReader(el);
    const at = (key, fallback) => ladder(src, attr, NPS_THEME_ATTRS, key, fallback);
    const hoverTextLight = at("hoverTextColorLight", NPS_STYLE_DEFAULTS.hoverTextColorLight);
    const hoverTextDark = at("hoverTextColorDark", NPS_STYLE_DEFAULTS.hoverTextColorDark);
    const hoverBgLight = at(
      "hoverBackgroundColorLight",
      NPS_STYLE_DEFAULTS.hoverBackgroundColorLight
    );
    const hoverBgDark = at("hoverBackgroundColorDark", NPS_STYLE_DEFAULTS.hoverBackgroundColorDark);
    return {
      layout: at("layout", NPS_STYLE_DEFAULTS.layout),
      textColorLight: at("textColorLight", NPS_STYLE_DEFAULTS.textColorLight),
      textColorDark: at("textColorDark", NPS_STYLE_DEFAULTS.textColorDark),
      backgroundColorLight: at("backgroundColorLight", NPS_STYLE_DEFAULTS.backgroundColorLight),
      backgroundColorDark: at("backgroundColorDark", NPS_STYLE_DEFAULTS.backgroundColorDark),
      hoverTextColorLight: hoverTextLight,
      hoverTextColorDark: hoverTextDark,
      hoverBackgroundColorLight: hoverBgLight,
      hoverBackgroundColorDark: hoverBgDark,
      selectedTextColorLight: at("selectedTextColorLight", hoverTextLight),
      selectedTextColorDark: at("selectedTextColorDark", hoverTextDark),
      selectedBackgroundColorLight: followHoverIfStockBlue(
        at("selectedBackgroundColorLight", hoverBgLight),
        hoverBgLight
      ),
      selectedBackgroundColorDark: followHoverIfStockBlue(
        at("selectedBackgroundColorDark", hoverBgDark),
        hoverBgDark
      ),
      borderColorLight: at("borderColorLight", NPS_STYLE_DEFAULTS.borderColorLight),
      borderColorDark: at("borderColorDark", NPS_STYLE_DEFAULTS.borderColorDark),
      borderRadius: normalizeRadius(at("borderRadius")) || NPS_STYLE_DEFAULTS.borderRadius
    };
  }
  var nonBlank = (value) => {
    if (value === void 0 || value === null) return void 0;
    const text = String(value).trim();
    return text ? text : void 0;
  };
  function emitSelectTheme(idleText, idleBg, hoverText, hoverBg) {
    const out = {};
    const pair = (base, value) => {
      if (!value) return;
      out[`${base}Light`] = value;
      out[`${base}Dark`] = value;
    };
    pair("hoverTextColor", hoverText);
    pair("hoverBackgroundColor", hoverBg);
    if (idleText) out.textColor = idleText;
    if (idleBg) {
      out.backgroundColor = idleBg;
      out.dropdownBackgroundColor = idleBg;
    }
    return out;
  }
  function resolveSelect(el, src) {
    const attr = attrReader(el);
    const hoverText = nonBlank(attr("data-light-theme-hover-text-color"));
    const hoverBg = nonBlank(attr("data-light-theme-hover-background-color"));
    const idleText = nonBlank(attr("data-dark-theme-hover-text-color"));
    const idleBg = nonBlank(attr("data-dark-theme-hover-background-color"));
    if (hoverText || hoverBg || idleText || idleBg) {
      return emitSelectTheme(idleText, idleBg, hoverText, hoverBg);
    }
    const wrap = src.wrapper;
    const fa = src.faForm;
    return emitSelectTheme(
      nonBlank(pick(wrap.textColor, fa.textColor)),
      nonBlank(pick(wrap.backgroundColor, fa.backgroundColor)),
      nonBlank(pick(wrap.hoverTextColor, fa.hoverTextColor)),
      nonBlank(pick(wrap.hoverBackgroundColor, fa.hoverBackgroundColor))
    );
  }
  function resolveHoverPair(el, family, src) {
    const attr = attrReader(el);
    const attrs = THEME_ATTRS[family];
    const fromAttrs = {};
    let anyAttr = false;
    for (const key of Object.keys(attrs)) {
      const value = attr(attrs[key]);
      if (value !== null && String(value).trim() !== "") {
        fromAttrs[key] = value;
        anyAttr = true;
      }
    }
    if (anyAttr) return fromAttrs;
    const out = {};
    for (const key of Object.keys(attrs)) {
      const value = pick(src.blob[key], pick(src.wrapper[key], src.faForm[key]));
      if (value !== void 0 && value !== null) out[key] = value;
    }
    return out;
  }
  function resolveTheme(el, family, faForm = {}) {
    const src = gather(el, family, faForm);
    if (family === "date") return resolveDate(el, src);
    if (family === "slider") return resolveSlider(el, src);
    if (family === "nps") return resolveNps(el, src);
    if (family === "select") return resolveSelect(el, src);
    return resolveHoverPair(el, family, src);
  }

  // packages/ffp-config/src/options/coerce.ts
  function clamp(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }
  function toFirstDay(raw) {
    const day = Number(raw);
    if (!Number.isFinite(day)) return 0;
    if (day === 7) return 0;
    if (day < 0 || day > 6) return 0;
    return day;
  }
  function toLang(raw) {
    if (!raw || raw === "en") return "en-US";
    return String(raw);
  }
  function str(raw, fallback) {
    return raw === null || raw === void 0 || String(raw) === "" ? fallback : String(raw);
  }
  function strOrNull(raw) {
    return raw === null || raw === void 0 || String(raw) === "" ? null : String(raw);
  }
  function num(raw, fallback) {
    if (raw === null || raw === void 0 || raw === "") return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }
  function posIntOr(raw, fallback) {
    const n = parseInt(String(raw), 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
  function boolAttr(raw) {
    if (raw === null || raw === void 0) return false;
    const normalized = String(raw).trim().toLowerCase();
    if (normalized === "" || normalized === "false" || normalized === "0") return false;
    return true;
  }

  // packages/ffp-config/src/options/tables.ts
  var DATE_OPTIONS = [
    { key: "months", attr: "data-months", read: (r) => clamp(r, 1, 12, 1) },
    { key: "columns", attr: "data-columns", read: (r) => clamp(r, 1, 12, 1) },
    { key: "firstDay", attr: "data-firstDay", read: (r) => toFirstDay(r) },
    { key: "language", attr: "data-language", read: (r) => toLang(r) },
    { key: "format", attr: "data-format", read: (r) => str(r, "MM/DD/YYYY") },
    { key: "zIndex", attr: "data-zIndex", read: (r) => clamp(r, 1, 2147483647, 999) }
  ];
  var SELECT_OPTIONS = [
    { key: "searchable", attr: "data-searchable", read: (r) => boolAttr(r) }
  ];
  var SLIDER_OPTIONS = [
    { key: "min", attr: "data-min", read: (r) => num(r, 0) },
    { key: "max", attr: "data-max", read: (r) => num(r, 100) },
    { key: "default", attr: "data-default", read: (r) => num(r, NaN) },
    { key: "minDefault", attr: "data-min-default", read: (r) => num(r, NaN) },
    { key: "maxDefault", attr: "data-max-default", read: (r) => num(r, NaN) }
  ];
  var PHONE_OPTIONS = [
    { key: "defaultCountry", attr: "data-selected-country", read: (r) => strOrNull(r) },
    { key: "countryCode", attr: "data-country-code", read: (r) => strOrNull(r) }
  ];
  var COLOR_OPTIONS = [
    { key: "defaultColor", attr: "data-default-color", read: (r) => strOrNull(r) }
  ];
  var FILE_OPTIONS = [
    { key: "maxFiles", attr: "data-max-files", read: (r) => posIntOr(r, 1) },
    { key: "maxFileSizeMb", attr: "data-max-file-size", read: (r) => posIntOr(r, 5) },
    { key: "acceptedFiles", attr: "data-accepted-files", read: (r) => strOrNull(r) }
  ];
  var NPS_OPTIONS = [
    { key: "layout", attr: "data-nps-layout", read: (r) => str(r, "connected") },
    {
      key: "extraFeedback",
      attr: "data-extra-feedback-collection",
      read: (r) => str(r, "never")
    }
  ];
  var MESSAGE_OPTIONS = [
    { key: "empty", attr: "data-empty-error-msg", read: (r) => strOrNull(r) },
    { key: "invalid", attr: "data-invalid-error-msg", read: (r) => strOrNull(r) }
  ];
  var OPTION_TABLES = {
    date: DATE_OPTIONS,
    daterange: DATE_OPTIONS,
    select: SELECT_OPTIONS,
    slider: SLIDER_OPTIONS,
    rangeslider: SLIDER_OPTIONS,
    phone: PHONE_OPTIONS,
    color: COLOR_OPTIONS,
    file: FILE_OPTIONS,
    nps: NPS_OPTIONS,
    likert: [],
    userip: []
  };
  function readOptions(el, specs) {
    const out = {};
    for (const spec of specs) {
      out[spec.key] = spec.read(el.getAttribute(spec.attr), el);
    }
    return out;
  }

  // packages/ffp-config/src/read.ts
  function readV2(el, type) {
    const raw = attrFrom(el, "data-ffp");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== CONFIG_VERSION) return null;
      return {
        ...parsed,
        // Never trust the blob's own type over the caller's: the caller knows
        // which selector matched, the blob could be stale after a retype.
        type,
        options: parsed.options || {},
        theme: parsed.theme || {},
        messages: parsed.messages || {}
      };
    } catch {
      return null;
    }
  }
  function readName(el) {
    const attr = attrReader(el);
    return attr("name") || attr("data-name") || attr("data-field-name") || "";
  }
  function readRequired(el) {
    if (el.hasAttribute("required")) return true;
    const explicit = attrFrom(el, "data-required");
    return explicit !== null && String(explicit).trim().toLowerCase() !== "false";
  }
  function readMessages(el) {
    const out = {};
    for (const spec of MESSAGE_OPTIONS) {
      const value = spec.read(attrFrom(el, spec.attr), el);
      if (value) out[spec.key] = String(value);
    }
    return out;
  }
  function readFieldConfig(el, type) {
    const v2 = readV2(el, type);
    if (v2) return v2;
    const name = readName(el);
    const faField = name ? readFaFormField(el, name) : null;
    const faGeneral = faField && faField.general || {};
    const faStyle = faField && faField.style || {};
    const options = readOptions(el, OPTION_TABLES[type]);
    for (const key of Object.keys(faGeneral)) {
      if (options[key] === void 0 || options[key] === null) options[key] = faGeneral[key];
    }
    const family = THEME_FAMILY[type];
    return {
      v: CONFIG_VERSION,
      type,
      name,
      required: readRequired(el),
      messages: readMessages(el),
      options,
      theme: family ? resolveTheme(el, family, faStyle) : {},
      conditional: readConditional(el)
    };
  }

  // packages/ffp-core/src/dom.ts
  function h(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const name of Object.keys(attrs)) {
        const value = attrs[name];
        if (value === null || value === void 0 || value === false) continue;
        node.setAttribute(name, value === true ? "" : String(value));
      }
    }
    if (children) {
      for (const child of children) {
        if (child === null || child === void 0) continue;
        node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
      }
    }
    return node;
  }
  function on(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    return () => target.removeEventListener(type, handler, options);
  }
  function delegate(root, type, selector, handler, options) {
    return on(
      root,
      type,
      (event) => {
        const target = event.target;
        if (!target || !target.closest) return;
        const match = target.closest(selector);
        if (match && root.contains(match)) handler(event, match);
      },
      options
    );
  }
  function injectStyle(id, css) {
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  }
  function rafDebounce(fn) {
    let scheduled = 0;
    return () => {
      if (scheduled) return;
      const run = () => {
        scheduled = 0;
        fn();
      };
      scheduled = document.hidden ? setTimeout(run, 16) : requestAnimationFrame(run);
    };
  }

  // packages/ffp-core/src/selectors.ts
  var FIELD_SELECTORS = {
    date: "[form-fields-pro-date-picker]",
    daterange: "[form-fields-pro-date-range-picker]",
    slider: "[form-fields-pro-number-slider]",
    rangeslider: "[form-fields-pro-number-slider][allow-range]",
    select: '[form-fields-type="select"]',
    phone: '[data-form-field-pro="number-input-with-country-code"]',
    color: ".color-input",
    file: ".dropzone",
    nps: '[data-field-name="net-promoter-score"]',
    likert: '[data-field="likert-scale-field-radio"]',
    userip: "[form-fields-pro-user-ip-input], [form-fields-pro-user-ip-admin-alert]"
  };
  var CHUNK_FOR_TYPE = {
    date: "date",
    daterange: "date",
    slider: "slider",
    rangeslider: "slider",
    select: "select",
    phone: "phone",
    color: "color",
    file: "file",
    nps: "nps",
    likert: "nps",
    userip: "userip"
  };
  var FIELD_TYPES = Object.keys(FIELD_SELECTORS);
  function detectTypes(root = document) {
    const found = [];
    for (const type of FIELD_TYPES) {
      if (type === "rangeslider") continue;
      if (root.querySelector(FIELD_SELECTORS[type])) found.push(type);
    }
    return found;
  }

  // packages/ffp-core/src/registry.ts
  var definitions = /* @__PURE__ */ new Map();
  var instances = /* @__PURE__ */ new WeakMap();
  var mountErrors = [];
  var mountAllowed = true;
  function setMountAllowed(allowed) {
    mountAllowed = allowed;
  }
  function isMountAllowed() {
    return mountAllowed;
  }
  function defineField(definition) {
    definitions.set(definition.name, definition);
  }
  var chunkApi = null;
  var ranFactories = /* @__PURE__ */ new Set();
  function setChunkApi(api) {
    chunkApi = api;
  }
  function runFactory(key) {
    if (ranFactories.has(key) || !chunkApi) return;
    const factory = getFactory(key);
    if (!factory) return;
    ranFactories.add(key);
    try {
      factory(chunkApi);
    } catch (err) {
      console.warn(`Form Fields Pro: chunk ${key} failed to initialise`, err);
    }
  }
  function getInstance(el) {
    return instances.get(el);
  }
  function elementsFor(type, root) {
    const definition = definitions.get(type);
    if (definition && definition.select) return definition.select(root);
    return Array.from(root.querySelectorAll(FIELD_SELECTORS[type]));
  }
  function mountOne(type, el, version) {
    if (instances.has(el)) return;
    if (el.getAttribute("data-ffp-mounted")) return;
    const definition = definitions.get(type);
    if (!definition) return;
    try {
      const config = definition.parse ? definition.parse(el) : readFieldConfig(el, type);
      const ctx = { form: el.closest("form"), version };
      const instance = definition.mount(el, config, ctx);
      instances.set(el, instance);
      el.setAttribute("data-ffp-mounted", type);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      mountErrors.push({ type, message });
      console.warn(`Form Fields Pro: ${type} failed to mount`, err);
    }
  }
  async function mountAll(root = document, version = "dev", options = {}) {
    if (!mountAllowed) return;
    const work = [];
    for (const type of FIELD_TYPES) {
      const elements = elementsFor(type, root).filter((el) => !instances.has(el));
      if (elements.length) work.push({ type, elements });
    }
    if (!work.length) return;
    const chunks = Array.from(new Set(work.map((item) => CHUNK_FOR_TYPE[item.type])));
    await Promise.all(chunks.map((key) => loadChunk(key, options.manifest, options.timeoutMs)));
    for (const key of chunks) runFactory(key);
    for (const { type, elements } of work) {
      for (const el of elements) mountOne(type, el, version);
    }
  }
  function destroy(el) {
    const instance = instances.get(el);
    if (!instance) return false;
    try {
      instance.destroy();
    } catch (err) {
      console.warn("Form Fields Pro: destroy failed", err);
    }
    instances.delete(el);
    el.removeAttribute("data-ffp-mounted");
    return true;
  }
  function observe(version, afterRescan) {
    const rescan = rafDebounce(() => {
      void mountAll(document, version).then(() => {
        if (afterRescan) afterRescan();
      });
    });
    const observer = new MutationObserver(rescan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }
  function definedTypes() {
    return Array.from(definitions.keys());
  }

  // packages/ffp-core/src/beacon.ts
  function buildPayload(version, siteId, fields) {
    return {
      version,
      siteId,
      fields,
      chunkLoadMs: results.reduce((total, r) => Math.max(total, r.ms), 0),
      chunkFailures: results.filter((r) => !r.ok).map((r) => `${r.key}:${r.reason || "unknown"}`),
      mountErrors: mountErrors.map((e) => `${e.type}:${e.message}`)
    };
  }
  function send(url, payload, sampleRate = 0.05) {
    if (!url || url.indexOf("__FFP_") === 0) return false;
    const interesting = payload.chunkFailures.length > 0 || payload.mountErrors.length > 0;
    if (!interesting && Math.random() >= sampleRate) return false;
    try {
      const body = new Blob([JSON.stringify(payload)], { type: "application/json" });
      return navigator.sendBeacon(url, body);
    } catch {
      return false;
    }
  }

  // packages/ffp-core/src/theme.ts
  var SUFFIX = /(Light|Dark)$/;
  function tokenToVar(token) {
    return `--ffp-${token.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
  }
  function applyTheme(root, theme) {
    for (const token of Object.keys(theme)) {
      const value = theme[token];
      if (value === void 0 || value === null || String(value) === "") continue;
      root.style.setProperty(tokenToVar(token), String(value));
    }
  }
  function schemeResolverCss(scope, tokens) {
    const bases = Array.from(new Set(tokens.filter((t) => SUFFIX.test(t)).map((t) => t.replace(SUFFIX, ""))));
    if (!bases.length) return "";
    const assign = (half) => bases.map((base) => `${tokenToVar(base)}: var(${tokenToVar(base)}-${half});`).join("");
    return `${scope}{${assign("light")}}@media (prefers-color-scheme: dark){${scope}{${assign("dark")}}}[data-ffp-scheme="light"] ${scope}{${assign("light")}}[data-ffp-scheme="dark"] ${scope}{${assign("dark")}}`;
  }

  // packages/ffp-core/src/license.ts
  var SUCCESS_TTL_MS = 60 * 60 * 1e3;
  var FAILURE_TTL_MS = 60 * 1e3;
  var TRANSIENT_STATUSES = [408, 425, 429];
  var cached = null;
  var cachedAt = 0;
  var inFlight = null;
  function unknown() {
    return { active: false, disabledFields: [], forceLegacy: false, stale: true };
  }
  function fetchLicense(url, siteId) {
    if (!siteId) return Promise.resolve({ active: false, stale: false });
    const ttl = cached && cached.active ? cached.ttlMs || SUCCESS_TTL_MS : FAILURE_TTL_MS;
    if (inFlight && Date.now() - cachedAt < ttl) return inFlight;
    cachedAt = Date.now();
    inFlight = (async () => {
      try {
        const res = await fetch(`${url}?siteId=${encodeURIComponent(siteId)}&appName=form-fields-pro`);
        if (!res.ok) {
          if (res.status >= 400 && res.status < 500 && TRANSIENT_STATUSES.indexOf(res.status) === -1) {
            return cached = { active: false, disabledFields: [], forceLegacy: false, stale: false };
          }
          console.warn(`Form Fields Pro: License check failed (HTTP ${res.status})`);
          return unknown();
        }
        const data = await res.json();
        return cached = {
          active: data.active === true,
          disabledFields: Array.isArray(data.disabledFields) ? data.disabledFields : [],
          forceLegacy: data.forceLegacy === true,
          ttlMs: typeof data.ttlMs === "number" ? data.ttlMs : void 0,
          stale: false
        };
      } catch (err) {
        console.warn("Form Fields Pro: License check failed", err);
        return unknown();
      }
    })();
    return inFlight;
  }
  function isFieldDisabled(state, type) {
    if (!state || state.stale) return false;
    return (state.disabledFields || []).indexOf(type) !== -1;
  }
  var UNLICENSED_WARNING = "Form Fields Pro: No valid license. Without a license you can publish to Staging (*.webflow.io) only. A valid license is required to use Form Fields Pro on Production (custom domain).";
  function canMountFields(state, staging = isUsingWebflowDomain()) {
    if (staging) return true;
    if (!state) return true;
    return state.active || state.stale === true;
  }
  function isUsingWebflowDomain(url = window.location.href) {
    let hostname;
    try {
      hostname = new URL(url).hostname;
    } catch {
      hostname = String(url);
    }
    hostname = hostname.toLowerCase().replace(/\.$/, "");
    return hostname === "webflow.io" || hostname.slice(-11) === ".webflow.io";
  }

  // packages/ffp-core/src/conditional.ts
  var FORM_STATE = {};
  var INPUT_SELECTOR = 'input.w-input, textarea.w-input, select.w-select, [form-fields-data-input],.w-checkbox input[type="checkbox"], .w-radio input[type="radio"],input.w-checkbox-input, input.w-radio-input, input.w-checkbox, input.w-radio';
  function typeOf(el) {
    const own = el.type;
    return String(own || el.getAttribute("type") || "").toLowerCase();
  }
  function syncFormState(root = document) {
    const inputs = Array.from(root.querySelectorAll(INPUT_SELECTOR));
    for (const input of inputs) {
      if (typeOf(input) !== "checkbox") continue;
      const name = input.getAttribute("name");
      if (name) FORM_STATE[name] = "";
    }
    for (const input of inputs) {
      const name = input.getAttribute("name");
      if (!name) continue;
      const type = typeOf(input);
      const value = input.value;
      if (type === "checkbox" || type === "radio") {
        if (!input.checked) {
          if (type === "radio" && FORM_STATE[name] === void 0) FORM_STATE[name] = "";
          continue;
        }
        if (type === "checkbox" && FORM_STATE[name]) {
          FORM_STATE[name] = FORM_STATE[name] + "," + (value || "true");
        } else {
          FORM_STATE[name] = value || "true";
        }
        continue;
      }
      FORM_STATE[name] = value == null ? "" : String(value);
    }
  }
  function toggleDisplay(element, show = false) {
    ;
    element.style.display = show ? "" : "none";
  }
  function resolveConditionalLogicRuleset(rule) {
    const inputValue = FORM_STATE[rule.inputName] || "";
    const compareValue = rule.compareValue;
    switch (rule.compareLogic) {
      case "HAS_ANY_VALUE":
        return inputValue.length > 0;
      case "HAS_NO_VALUE":
        return inputValue.length === 0;
      case "CONTAINS":
        return String(inputValue).toLowerCase().indexOf(String(compareValue == null ? "" : compareValue).toLowerCase()) !== -1;
      case "IS_EQUAL":
        return inputValue == compareValue;
      case "NOT_EQUAL":
        return inputValue != compareValue;
      case "IS_GREATER_THAN": {
        const left = Number(inputValue);
        const right = Number(compareValue);
        if (!isNaN(left) && !isNaN(right)) return left > right;
        return inputValue > String(compareValue);
      }
      case "IS_LESS_THAN": {
        const left = Number(inputValue);
        const right = Number(compareValue);
        if (!isNaN(left) && !isNaN(right)) return left < right;
        return inputValue < String(compareValue);
      }
      default:
        return false;
    }
  }
  function reactToCurrentFormState(element) {
    let ruleGroups;
    try {
      ruleGroups = JSON.parse(element.getAttribute("conditional-logic") || "[]");
    } catch {
      return;
    }
    if (!Array.isArray(ruleGroups)) return;
    const result = ruleGroups.some(
      (group) => Array.isArray(group) && group.every((rule) => resolveConditionalLogicRuleset(rule))
    );
    toggleDisplay(element, result);
  }
  function evaluateConditionalLogic(root = document) {
    const fields = Array.from(root.querySelectorAll("[conditional-logic]"));
    if (!fields.length) return;
    syncFormState(root);
    for (const field of fields) {
      try {
        reactToCurrentFormState(field);
      } catch (error) {
        console.warn("Form Fields Pro: Conditional logic evaluation failed", error);
      }
    }
  }
  function installConditionalLogic(root = document) {
    const run = () => evaluateConditionalLogic(root);
    const scheduled = rafDebounce(run);
    const unbinds = [
      on(root, "input", scheduled, { capture: true }),
      on(root, "change", scheduled, { capture: true })
    ];
    run();
    const handle = (() => {
      for (const unbind of unbinds) unbind();
    });
    handle.refresh = run;
    return handle;
  }

  // packages/ffp-core/src/phone-value.ts
  var dialByIso = {};
  var knownDialCodes = {};
  function registerDialCodes(map) {
    dialByIso = {};
    knownDialCodes = {};
    for (const iso of Object.keys(map)) {
      const dial = String(map[iso]);
      dialByIso[iso] = dial;
      knownDialCodes[dial] = true;
    }
  }
  function dialCodeForIso(iso) {
    if (!iso) return null;
    return dialByIso[iso] || null;
  }
  function isDialCodeOnlyPhoneValue(value) {
    const trimmed = String(value == null ? "" : value).trim();
    const match = trimmed.match(/^\+(\d+)\s*$/);
    if (!match) return false;
    return knownDialCodes[match[1]] === true;
  }
  function normalizePhoneToE164(value, dialCode) {
    const raw = String(value == null ? "" : value).trim();
    if (!raw) return "";
    if (isDialCodeOnlyPhoneValue(raw)) return "+" + raw.replace(/\D/g, "");
    const hasPlus = raw.charAt(0) === "+";
    const nums = raw.replace(/\D/g, "");
    if (!nums) return "";
    if (hasPlus) return "+" + nums;
    if (dialCode && nums.indexOf(dialCode) === 0 && nums.length > dialCode.length + 3) {
      return "+" + nums;
    }
    if (dialCode) {
      const national = nums.replace(/^0+/, "");
      if (!national) return "+" + dialCode;
      if (national.indexOf(dialCode) === 0 && national.length > dialCode.length + 3) {
        return "+" + national;
      }
      return "+" + dialCode + national;
    }
    return nums;
  }
  function formatPhoneDisplay(e164, dialCode) {
    const cleaned = String(e164 == null ? "" : e164).replace(/[^\d+]/g, "");
    if (cleaned.charAt(0) !== "+") return cleaned;
    const nums = cleaned.slice(1);
    if (dialCode && nums.indexOf(dialCode) === 0 && nums.length > dialCode.length) {
      return "+" + dialCode + " " + nums.slice(dialCode.length);
    }
    return cleaned;
  }

  // packages/ffp-core/src/validate.ts
  var EMAIL_PATTERN_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var URL_PATTERN_REGEX = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
  var PLAIN_TEXT_MIN_LETTERS = 2;
  var WRAPPER = '[form-fields-wrapper="true"] ';
  var MESSAGE_CLASS = "form-fields-data-validation-message";
  var PHONE_SELECTOR = '[data-form-field-pro="number-input-with-country-code"] input[type="tel"]';
  function typeOf2(el) {
    const own = el.type;
    if (own) return String(own).toLowerCase();
    return String(el.getAttribute("type") || "").toLowerCase();
  }
  function valueOf(el) {
    const value = el.value;
    return value == null ? "" : String(value);
  }
  function getParentFormFieldsWrapperDiv(element) {
    const parent = element && element.parentElement;
    if (!parent) return null;
    return parent.hasAttribute("form-fields-wrapper") ? parent : getParentFormFieldsWrapperDiv(parent);
  }
  function isFieldVisiblyHidden(el) {
    let node = getParentFormFieldsWrapperDiv(el) || el;
    while (node && node !== document.body) {
      const style = node.style;
      if (style && style.display === "none") return true;
      node = node.parentElement;
    }
    return false;
  }
  function setValidationMessage(field, message) {
    const wrapper = getParentFormFieldsWrapperDiv(field);
    const node = wrapper && wrapper.querySelector("." + MESSAGE_CLASS);
    if (node) node.textContent = message || "";
  }
  function addValidationMessageNodes(form) {
    for (const wrapper of Array.from(form.querySelectorAll('[form-fields-wrapper="true"]'))) {
      if (wrapper.querySelector("." + MESSAGE_CLASS)) continue;
      const node = document.createElement("span");
      node.className = MESSAGE_CLASS;
      wrapper.appendChild(node);
    }
  }
  var VALIDATION_CSS = `.${MESSAGE_CLASS}{color:#FF2626;font-size:11px}`;
  function validateFieldData(field, value, pattern, errorMessage) {
    const ok = !(value.length > 0 && !pattern.test(value));
    setValidationMessage(field, ok ? "" : errorMessage);
    return ok;
  }
  function countPlainTextLetters(value) {
    return (String(value == null ? "" : value).match(/\p{L}/gu) || []).length;
  }
  function isValidPlainTextValue(value) {
    return countPlainTextLetters(value) >= PLAIN_TEXT_MIN_LETTERS;
  }
  function getEmptyErrorMessage(input) {
    return input.getAttribute("data-empty-error-msg") || "This field is required";
  }
  function validatePlainTextField(field, value) {
    const raw = String(value == null ? "" : value).trim();
    if (!raw) {
      setValidationMessage(field, "");
      return true;
    }
    const message = field.getAttribute("data-invalid-error-msg") || "Please enter a valid name";
    const ok = isValidPlainTextValue(raw);
    setValidationMessage(field, ok ? "" : message);
    return ok;
  }
  function getSelectedDialCodeForPhoneInput(input) {
    const wrapper = input.closest && input.closest('[data-form-field-pro="number-input-with-country-code"]') || getParentFormFieldsWrapperDiv(input);
    if (!wrapper) return null;
    return dialCodeForIso(wrapper.getAttribute("data-selected-country"));
  }
  function validateTypedFields(root = document, options = {}) {
    const prefix = options.scoped ? "" : WRAPPER;
    for (const f of Array.from(root.querySelectorAll(prefix + 'input[type="url"]'))) {
      if (isFieldVisiblyHidden(f)) continue;
      if (!validateFieldData(f, valueOf(f), URL_PATTERN_REGEX, "Please enter a valid url")) return false;
    }
    for (const f of Array.from(root.querySelectorAll(prefix + 'input[type="email"]'))) {
      if (isFieldVisiblyHidden(f)) continue;
      const message = f.getAttribute("data-invalid-error-msg") || "Please enter a valid email";
      if (!validateFieldData(f, valueOf(f), EMAIL_PATTERN_REGEX, message)) return false;
    }
    for (const f of Array.from(
      root.querySelectorAll(prefix + 'input[data-plain-text="form-field-pro-plain-text"]')
    )) {
      if (isFieldVisiblyHidden(f)) continue;
      if (!validatePlainTextField(f, valueOf(f))) return false;
    }
    for (const f of Array.from(
      root.querySelectorAll(
        prefix + PHONE_SELECTOR + ", " + prefix + 'input.number-input-field[type="tel"]'
      )
    )) {
      if (isFieldVisiblyHidden(f)) continue;
      const raw = valueOf(f).trim();
      if (!raw || isDialCodeOnlyPhoneValue(raw)) continue;
      const dial = getSelectedDialCodeForPhoneInput(f);
      const e164 = normalizePhoneToE164(raw, dial);
      if (!/^\+\d{8,}$/.test(e164)) {
        setValidationMessage(f, f.getAttribute("data-invalid-error-msg") || "Invalid phone number");
        return false;
      }
      const formatted = formatPhoneDisplay(e164, dial);
      if (formatted && formatted !== raw) f.value = formatted;
    }
    return true;
  }
  function validateRequiredFields(root) {
    const scoped = root !== document && root.tagName !== "FORM";
    let ok = validateTypedFields(root, { scoped });
    const checkedRadioNames = {};
    for (const input of Array.from(
      root.querySelectorAll(WRAPPER + 'input[type="radio"]:checked, form input[type="radio"]:checked')
    )) {
      const name = input.getAttribute("name");
      if (name) checkedRadioNames[name] = true;
    }
    for (const input of Array.from(root.querySelectorAll(WRAPPER + "[required]"))) {
      if (isFieldVisiblyHidden(input)) continue;
      const type = typeOf2(input);
      if (type === "radio") {
        const name = input.getAttribute("name");
        if (name && checkedRadioNames[name]) {
          if (ok) setValidationMessage(input, "");
          continue;
        }
        ok = false;
        setValidationMessage(input, getEmptyErrorMessage(input));
        continue;
      }
      const value = valueOf(input);
      const emptyFile = type === "file" || input.hasAttribute("form-fields-file-upload") ? !value || value === "[]" || value === "null" : false;
      const empty = emptyFile || !value || type === "tel" && isDialCodeOnlyPhoneValue(value) || type === "checkbox" && !input.checked;
      if (empty) {
        ok = false;
        setValidationMessage(input, getEmptyErrorMessage(input));
      } else if (ok) {
        setValidationMessage(input, "");
      }
    }
    return ok;
  }
  function installValidationEvents(root = document) {
    const unbinds = [
      delegate(root, "input", WRAPPER + 'input[type="url"]', (_event, field) => {
        validateFieldData(field, valueOf(field), URL_PATTERN_REGEX, "Enter a valid URL");
      }),
      delegate(root, "input", WRAPPER + 'input[type="email"]', (_event, field) => {
        const message = field.getAttribute("data-invalid-error-msg") || "Enter a valid email";
        validateFieldData(field, valueOf(field), EMAIL_PATTERN_REGEX, message);
      }),
      delegate(
        root,
        "input",
        WRAPPER + 'input[data-plain-text="form-field-pro-plain-text"]',
        (_event, field) => validatePlainTextField(field, valueOf(field))
      )
    ];
    return () => {
      for (const unbind of unbinds) unbind();
    };
  }

  // packages/ffp-core/src/multistep.ts
  var STEPS_RAIL_CSS = "[fa-form-steps]{max-width:100%!important;min-width:0!important;overflow-x:auto!important}[fa-form-steps].ffp-c{column-gap:0!important}[fa-form-steps].ffp-c [fa-form-step]:not(.active-step) [fa-form-step-label]{display:none!important}[fa-form-steps].ffp-c [fa-form-spacer]{min-width:2px!important;flex:1 1 0%!important}";
  var COMPACT = "ffp-c";
  function initMultiStepForms(root = document) {
    injectStyle("ffp-steps-rail", STEPS_RAIL_CSS);
    const unbinds = [];
    for (const form of Array.from(root.querySelectorAll("[fa-webflow-form]"))) {
      unbinds.push(initSingleMultiStepForm(form));
    }
    return () => {
      for (const unbind of unbinds) unbind();
    };
  }
  function fitStepsRail(formElement) {
    const rail = formElement.querySelector("[fa-form-steps]");
    if (!rail) return;
    rail.classList.remove(COMPACT);
    if (rail.scrollWidth > rail.clientWidth + 1) rail.classList.add(COMPACT);
  }
  function initSingleMultiStepForm(formElement) {
    if (!formElement || formElement.getAttribute("data-ffp-multi-step-init") === "1") return () => {
    };
    const steps = Array.from(formElement.querySelectorAll("[fa-form-step]"));
    const pages = Array.from(formElement.querySelectorAll("[fa-form-page]"));
    if (!steps.length || !pages.length) return () => {
    };
    formElement.setAttribute("data-ffp-multi-step-init", "1");
    const previousButton = formElement.querySelector("[fa-form-previous-button]");
    const nextButton = formElement.querySelector("[fa-form-next-button]");
    const submitButton = formElement.querySelector("[fa-form-submit-button]");
    const unbinds = [];
    let currentStepIndex = 0;
    function updateButtonVisibility() {
      if (previousButton) previousButton.style.display = currentStepIndex === 0 ? "none" : "";
      if (nextButton) nextButton.style.display = currentStepIndex === steps.length - 1 ? "none" : "";
      if (submitButton) submitButton.style.display = currentStepIndex !== steps.length - 1 ? "none" : "";
    }
    function showPageByIndex(index) {
      if (index < 0 || index >= steps.length) return;
      pages.forEach((page, i) => page.classList.toggle("hidden", i !== index));
      steps.forEach((step, i) => {
        const counter = step.querySelector("[fa-form-step-counter]");
        const successIcon = step.querySelector("[fa-form-step-success-icon]");
        const label = step.querySelector("[fa-form-step-label]");
        const done = i < index;
        const active = i === index;
        if (counter) counter.classList.toggle("hidden", done);
        if (successIcon) successIcon.classList.toggle("hidden", !done);
        step.classList.toggle("active-step", active);
        if (counter) counter.classList.toggle("active-counter", active);
        if (label) label.classList.toggle("active-label", done || active);
      });
      currentStepIndex = index;
      updateButtonVisibility();
      fitStepsRail(formElement);
    }
    function validatePageAt(index) {
      const page = pages[index];
      return page ? validateRequiredFields(page) : false;
    }
    function validateThrough(targetIndex) {
      for (let i = currentStepIndex; i < targetIndex; i++) {
        if (!validatePageAt(i)) {
          showPageByIndex(i);
          return false;
        }
      }
      return true;
    }
    steps.forEach((step, index) => {
      unbinds.push(
        on(step, "click", () => {
          if (currentStepIndex < index) {
            if (validateThrough(index)) showPageByIndex(index);
          } else {
            showPageByIndex(index);
          }
        })
      );
    });
    if (nextButton) {
      unbinds.push(
        on(nextButton, "click", () => {
          if (validatePageAt(currentStepIndex) && currentStepIndex < steps.length - 1) {
            showPageByIndex(currentStepIndex + 1);
          }
        })
      );
    }
    if (previousButton) {
      unbinds.push(
        on(previousButton, "click", () => {
          if (currentStepIndex > 0) showPageByIndex(currentStepIndex - 1);
        })
      );
    }
    unbinds.push(on(window, "resize", () => fitStepsRail(formElement)));
    showPageByIndex(0);
    return () => {
      for (const unbind of unbinds) unbind();
      formElement.removeAttribute("data-ffp-multi-step-init");
    };
  }

  // packages/ffp-core/src/forms.ts
  function getFfpNativeForms(root = document) {
    const roots = root.querySelectorAll('[fa-form="true"], [fa-webflow-form]');
    const forms = /* @__PURE__ */ new Set();
    roots.forEach((shell) => {
      if (shell.tagName === "FORM") {
        forms.add(shell);
        return;
      }
      const direct = shell.querySelectorAll(":scope > form");
      if (direct.length) {
        direct.forEach((f) => forms.add(f));
        return;
      }
      const nested = shell.querySelectorAll("form");
      if (nested.length) {
        nested.forEach((f) => forms.add(f));
        return;
      }
      const enclosing = shell.closest("form");
      if (enclosing) forms.add(enclosing);
    });
    return Array.from(forms);
  }

  // packages/ffp-core/src/submit.ts
  async function buildSubmissionHeaders(secret, siteId, formId) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    const subtle = window.crypto && window.crypto.subtle;
    if (!secret || !subtle) return headers;
    const timestamp = String(Date.now());
    const encoder = new TextEncoder();
    const key = await subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
      "sign"
    ]);
    const signature = await subtle.sign("HMAC", key, encoder.encode(`${siteId}:${formId}:${timestamp}`));
    headers["X-FFP-Timestamp"] = timestamp;
    headers["X-FFP-Signature"] = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return headers;
  }
  function getFormMetaData(form) {
    return {
      name: form.getAttribute("data-name") || "",
      pageId: form.getAttribute("data-wf-page-id") || "",
      elementId: form.getAttribute("data-wf-element-id") || "",
      source: window.location.href,
      test: "false",
      dolphin: "false"
    };
  }
  var WEBFLOW_INPUTS = 'input.w-input, textarea.w-input, select.w-select, input.w-checkbox, input.w-radio,input.w-checkbox-input, input.w-radio-input,.w-checkbox input[type="checkbox"], .w-radio input[type="radio"]';
  function typeOf3(el) {
    const own = el.type;
    return String(own || el.getAttribute("type") || "").toLowerCase();
  }
  function isCredentialInput(input, name) {
    if (typeOf3(input) === "password") return true;
    if (/(^|[\s-])password$/i.test(input.getAttribute("autocomplete") || "")) return true;
    return /(^|[\[\]_.-])(passw(or)?d|secret)($|[\[\]_.-])/i.test(name);
  }
  function collect(data, input, name) {
    if (isCredentialInput(input, name)) return;
    const type = typeOf3(input);
    const value = input.value;
    if (type === "checkbox" || type === "radio") {
      if (!input.checked) return;
      const key = `fields[${name}]`;
      if (type === "checkbox" && data[key]) {
        data[key] = `${data[key]},${value || "true"}`;
      } else {
        data[key] = value || "true";
      }
      return;
    }
    data[`fields[${name}]`] = value == null ? "" : String(value);
  }
  function getWebflowInputFieldsData(form) {
    const data = {};
    for (const input of Array.from(form.querySelectorAll(WEBFLOW_INPUTS))) {
      const name = input.getAttribute("data-name") || input.getAttribute("name");
      if (!name) continue;
      collect(data, input, name);
    }
    const turnstile = form.querySelector('input[name="cf-turnstile-response"]');
    if (turnstile) data["fields[cf-turnstile-response]"] = turnstile.value;
    return data;
  }
  function getFormFieldsInputData(form) {
    const data = {};
    for (const input of Array.from(form.querySelectorAll("[form-fields-data-input]"))) {
      const name = input.getAttribute("name");
      if (!name) continue;
      collect(data, input, name);
    }
    return data;
  }
  async function waitForPendingFileUploads(form) {
    const zones = Array.from(form.querySelectorAll(".dropzone"));
    if (!zones.length) return;
    await Promise.all(
      zones.map(
        (zone) => typeof zone._ffpAwaitUploads === "function" ? zone._ffpAwaitUploads() : Promise.resolve()
      )
    );
  }
  function showFormResult(form, success) {
    form.style.display = "none";
    const wrapper = form.closest(".w-form") || form.parentElement;
    const selector = `.w-form-${success ? "done" : "fail"}`;
    const byId = form.id ? document.getElementById(form.id) : null;
    const el = byId && byId.parentElement && byId.parentElement.querySelector(selector) || (wrapper && wrapper.querySelector ? wrapper.querySelector(selector) : null);
    if (el) el.style.display = "block";
  }
  function findSubmitButton(form) {
    return form.querySelector('input[type="submit"]') || form.querySelector("[fa-form-submit-button]") || form.querySelector('button[type="submit"]');
  }
  function setButtonLabel(button, label) {
    if ("value" in button) button.value = label;
    else button.textContent = label;
  }
  async function handleFormSubmit(form, config) {
    const submitButton = findSubmitButton(form);
    const originalLabel = submitButton ? submitButton.value || submitButton.textContent || "Submit" : "Submit";
    const loadingLabel = submitButton && submitButton.getAttribute("data-wait") || "Please wait...";
    const unlockSubmit = () => {
      form.setAttribute("data-ffp-submitting", "0");
      if (submitButton) {
        submitButton.removeAttribute("disabled");
        setButtonLabel(submitButton, originalLabel);
      }
    };
    const faForm = form.closest('[fa-form="true"]') || form.querySelector('[fa-form="true"]') || form.parentElement && form.parentElement.closest('[fa-form="true"]');
    if (!faForm) {
      console.warn("Form Fields Pro: Submit ignored \u2014 form is not inside an [fa-form] wrapper");
      unlockSubmit();
      return;
    }
    const formElementId = faForm.getAttribute("fa-form-id");
    const formName = faForm.getAttribute("fa-form-name");
    form.setAttribute("data-ffp-submitting", "1");
    if (submitButton) {
      submitButton.setAttribute("disabled", "true");
      setButtonLabel(submitButton, loadingLabel);
    }
    try {
      await waitForPendingFileUploads(form);
      const payload = new URLSearchParams({
        ...getFormMetaData(form),
        ...getWebflowInputFieldsData(form),
        ...getFormFieldsInputData(form)
      });
      const siteId = document.documentElement.getAttribute("data-wf-site");
      const submissionPayload = new URLSearchParams({
        ...getWebflowInputFieldsData(form),
        ...getFormFieldsInputData(form)
      });
      const parsed = {};
      submissionPayload.forEach((value, key) => {
        parsed[key.replace(/^fields\[(.*)\]$/, "$1")] = value;
      });
      delete parsed["cf-turnstile-response"];
      let webflowSuccess = false;
      let backendSuccess = false;
      try {
        const response = await fetch(`https://webflow.com/api/v1/form/${siteId}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "*/*" },
          body: payload.toString()
        });
        webflowSuccess = response.ok;
      } catch (error) {
        console.warn("Webflow submission failed:", error);
      }
      const hasLicense = await config.isLicensed(siteId);
      if (hasLicense) {
        try {
          const response = await fetch(`${config.dataClientUrl}/api/sites/handleFormSubmission`, {
            method: "POST",
            headers: await buildSubmissionHeaders(config.submissionSecret, siteId, formElementId),
            body: JSON.stringify({
              siteId,
              formId: formElementId,
              formName,
              formData: parsed,
              webflowPayload: payload.toString()
            })
          });
          backendSuccess = response.ok;
        } catch (error) {
          console.warn("Backend submission failed:", error);
        }
      } else if (!config.isStaging()) {
        console.warn(
          "Form Fields Pro: No valid license on a Production domain \u2014 skipping backend & notification submission."
        );
      }
      const success = hasLicense ? backendSuccess : webflowSuccess;
      const redirectUrl = form.getAttribute("redirect");
      if (success && redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      showFormResult(form, success);
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      showFormResult(form, false);
    } finally {
      unlockSubmit();
    }
  }
  function installFormSubmission(config) {
    const root = config.root || document;
    injectStyle("ffp-validation-message", VALIDATION_CSS);
    const unbinds = [];
    for (const form of getFfpNativeForms(root)) {
      if (form.getAttribute("data-ffp-submit-bound") === "1") continue;
      form.setAttribute("data-ffp-submit-bound", "1");
      form.setAttribute("novalidate", "true");
      addValidationMessageNodes(form);
      unbinds.push(
        on(form, "submit", (event) => {
          event.preventDefault();
          void submitForm(form, config);
        })
      );
    }
    return () => {
      for (const unbind of unbinds) unbind();
    };
  }
  async function submitForm(form, config) {
    if (form.getAttribute("data-ffp-submitting") === "1") return;
    form.setAttribute("data-ffp-submitting", "1");
    try {
      await waitForPendingFileUploads(form);
      if (!validateRequiredFields(form)) {
        form.setAttribute("data-ffp-submitting", "0");
        return;
      }
      await handleFormSubmit(form, config);
    } catch (error) {
      console.error("Form Fields Pro: Submit failed", error);
      form.setAttribute("data-ffp-submitting", "0");
    }
  }

  // packages/ffp-core/src/focus.ts
  var TABBABLE = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  // packages/ffp-core/src/index.ts
  var LICENSE_URL = "__FFP_LICENSE_URL__";
  var BEACON_URL = "__FFP_BEACON_URL__";
  var DATA_CLIENT_URL = "__FFP_DATA_CLIENT_URL__";
  var SUBMISSION_SECRET = "__FFP_SUBMISSION_SECRET__";
  var substituted = (value) => value.indexOf("__FFP_") !== 0;
  function readSiteId() {
    return document.documentElement.getAttribute("data-wf-site");
  }
  var license = null;
  function buildChunkApi() {
    return {
      version: VERSION,
      config: {
        dataClientUrl: DATA_CLIENT_URL,
        licenseUrl: LICENSE_URL
      },
      defineField,
      readFieldConfig,
      dom: { h, on, delegate, injectStyle },
      registerDialCodes,
      theme: { applyTheme, schemeResolverCss, tokenToVar }
    };
  }
  function isPreviewMode() {
    return window.__ffpPreview === true;
  }
  async function boot() {
    injectStyle(
      "ffp-designer-standins",
      "[data-ffp-slider-placeholder],.fa-slider-placeholder{display:none!important;width:0!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;visibility:hidden!important;position:absolute!important;clip:rect(0,0,0,0)!important;pointer-events:none!important}"
    );
    injectStyle("ffp-steps-rail", STEPS_RAIL_CSS);
    document.querySelectorAll("[data-ffp-slider-placeholder]").forEach((node) => node.remove());
    const siteId = readSiteId();
    if (isPreviewMode()) {
      setChunkApi(buildChunkApi());
      setMountAllowed(true);
      await mountAll(document, VERSION);
      observe(VERSION);
      return;
    }
    const licensePromise = substituted(LICENSE_URL) ? fetchLicense(LICENSE_URL, siteId) : (
      // An unsubstituted build is a local one: there is no licence service
      // to ask, so the answer is unknown and the fields mount.
      Promise.resolve({ active: false, stale: true })
    );
    setChunkApi(buildChunkApi());
    const staging = isUsingWebflowDomain();
    const present = detectTypes(document);
    license = await Promise.race([
      licensePromise,
      new Promise(
        (resolve) => setTimeout(() => resolve({ active: false, disabledFields: [], forceLegacy: false, stale: true }), 1500)
      )
    ]);
    if (license.forceLegacy) return;
    setMountAllowed(canMountFields(license, staging));
    if (!isMountAllowed()) console.warn(UNLICENSED_WARNING);
    await mountAll(document, VERSION);
    installValidationEvents(document);
    const submission = {
      dataClientUrl: DATA_CLIENT_URL,
      submissionSecret: substituted(SUBMISSION_SECRET) ? SUBMISSION_SECRET : "",
      // The full licence answer, not the 1500 ms race above: the mount accepts a
      // timeout as "unknown, go ahead", but the backend post is a billing
      // decision and must wait for a real answer. By submit time it has long
      // resolved. This one stays fail-closed on an outage, unchanged from
      // 5.1.5 - an unknown answer skips the post, and the lead still reaches
      // Webflow. Loosening that is tracked separately.
      // An unsubstituted build is a local one, where posting to a placeholder
      // URL is not something to attempt.
      isLicensed: () => substituted(LICENSE_URL) ? licensePromise.then((state) => state.active) : Promise.resolve(false),
      isStaging: () => isUsingWebflowDomain()
    };
    installFormSubmission(submission);
    const conditional = installConditionalLogic(document);
    initMultiStepForms(document);
    observe(VERSION, () => {
      installFormSubmission(submission);
      initMultiStepForms(document);
      conditional.refresh();
    });
    if (substituted(BEACON_URL)) {
      send(BEACON_URL, buildPayload(VERSION, siteId, present));
    }
  }
  var FormFieldsPro = {
    version: VERSION,
    mount: (root = document) => mountAll(root, VERSION),
    destroy,
    get: getInstance,
    fields: () => definedTypes(),
    __debug: {
      /** Everything needed to diagnose a page, in one object. */
      report() {
        const mounted = Array.from(document.querySelectorAll("[data-ffp-mounted]")).map((el) => ({
          type: el.getAttribute("data-ffp-mounted"),
          config: safeConfig(el),
          hasInstance: Boolean(getInstance(el))
        }));
        return {
          version: VERSION,
          siteId: readSiteId(),
          detected: detectTypes(document),
          registered: definedTypes(),
          mounted,
          chunks: results.slice(),
          manifest: Object.keys(MANIFEST),
          mountErrors: mountErrors.slice(),
          license,
          mountAllowed: isMountAllowed()
        };
      },
      selectors: FIELD_SELECTORS,
      formState: () => ({ ...FORM_STATE }),
      readFieldConfig,
      isFieldDisabled: (type) => isFieldDisabled(license, type)
    }
  };
  function safeConfig(el) {
    const type = el.getAttribute("data-ffp-mounted");
    if (!type) return null;
    try {
      return readFieldConfig(el, type);
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }
  function start() {
    window.FormFieldsPro = FormFieldsPro;
    ready(() => {
      void boot().catch((err) => console.warn("Form Fields Pro: boot failed", err));
    });
  }

  // packages/ffp-core/src/entry.ts
  window.__ffpDefine = define;
  start();
})();
