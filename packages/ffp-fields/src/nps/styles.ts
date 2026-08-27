/**
 * The NPS stylesheet, lifted verbatim from runtime 5.1.5 (`ffp-nps-states-v3`,
 * L1870-2001). Not hand-transcribed - copied out of the source file.
 *
 * It is worth reading before changing anything in `index.ts`: this sheet already
 * expresses every idle, hover, selected, connected and separated state in terms
 * of `--nps-*` custom properties, including a `prefers-color-scheme` block. The
 * JS that used to paint the same states inline with `!important` was pure
 * duplication of what is here.
 */
export const NPS_CSS = `
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
`
