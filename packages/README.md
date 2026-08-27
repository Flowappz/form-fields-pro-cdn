# Runtime packages

The published-page runtime, split so a visitor downloads only the fields their
page actually uses.

| Package | Published | What it owns |
|---|---|---|
| `@flowappz/ffp-config` | yes | The config schema and the legacy attribute normalizer. Imported by both the runtime and the Designer Extension. |
| `@flowappz/ffp-core` | no | Registry, chunk loader, theming, license/kill switch, beacon, **and the whole submission half**: forms, validation, conditional logic, multi-step, submit. This is the script Webflow registers. |
| `@flowappz/ffp-primitives` | no | Floating, layer and listbox, shipped as the shared `ui-popover` chunk; `dateengine`/`calendar`, `slider`, `colorpicker`, `dropzone` and the `drag` core, each bundled into the one chunk that uses it. |
| `@flowappz/ffp-fields` | no | One lazily-loaded chunk per field type. |

## Migration status

| Field | State | Vendor |
|---|---|---|
| select | rewritten (phase 1) | none — Select2 retired |
| nps | rewritten (phase 1) | none — was jQuery only |
| likert | rewritten (phase 5) | none — it is a stylesheet |
| date, daterange | rewritten (phase 2) | none — easepick retired |
| slider, rangeslider | rewritten (phase 3) | none — noUiSlider retired |
| color | rewritten (phase 3) | none — spectrum retired |
| file | rewritten (phase 3) | none — Dropzone retired |
| phone | rewritten (phase 4) | none — Iconify and ipinfo retired |
| userip | rewritten (phase 5) | none — it calls our own data client |

After phase 4 there are **no third-party origins left in the bundle at all**.
`grep -ho 'https://[a-zA-Z0-9.-]*' build/*/chunks/*.js build/*/*.js | sort -u`
returns exactly one line, `https://webflow.com`, which is the form submission
endpoint. No `loadScript`, no `loadStylesheet`, and `grep '$('` over `packages/`
matches only prose in comments describing what was removed.

Likert is the last 5.1.5 extract with a widget in it, riding in the `nps` chunk.

Measured after phase 2: a date page is core 11,597 + `ui-popover` 2,890 + `date`
5,323 = **19,810 B gz and one origin**, against 21,471 B gz of monolith plus
~20 kB of easepick over jsdelivr — and one fewer blocking fetch, because 5.1.5
downloaded easepick's stylesheet as text before it would draw anything.

A field leaves `scripts/extract-legacy.mjs`'s `CHUNKS` list when it is rewritten,
and its `legacy.js` is deleted rather than kept as a fallback: a fallback nobody
exercises is a fallback that does not work.

## The submission pipeline lives in core, on purpose

`submit.ts`, `validate.ts`, `conditional.ts`, `multistep.ts` and `phone-value.ts`
are ported from 5.1.5 with the wire format unchanged: the same two posts, in the
same order, with the same bodies, and success still resolved from the backend
when the site is licensed and from Webflow when it is not.

None of it is lazy-loaded. A chunk that fails to arrive leaves a widget missing
and a working native input behind, which is survivable. A submission path that
fails to arrive loses the lead. That is also why core's gz budget moved from
9 kB to 12 kB in the same change - the number was set while core meant delivery
only, and A1 always assigned forms and submission to core. Measured cost of the
port: **+4,124 B gz** (7,243 -> 11,367), against a 5.1.5 monolith of 21,471 B gz
that carried this same code plus all nine widgets on every page.

Three behaviours changed, all deliberate:

- **Conditional logic no longer polls.** 5.1.5 re-evaluated every rule every
  450 ms, forever, on every published page. It is now two capture-phase
  listeners plus a `refresh()` the registry's observer calls. This is why every
  rewritten field dispatches `input`/`change` rather than only setting `.value`:
  the poll used to paper over fields that announced nothing.
- **Live validation is delegated**, so a field that appears after load - every
  multi-step page past the first - is covered. 5.1.5 bound one listener per
  field at boot and those pages had no live validation at all.
- **Validation messages are written as text, not `innerHTML`.**

The 252-country table stays out of core. Core needs dial codes to validate and
normalise phone values, so `phone-value.ts` holds a registry and the phone chunk
fills it through `api.registerDialCodes` when core runs its factory - long
before anyone can press submit. With no registry, `isDialCodeOnlyPhoneValue`
answers `false` rather than guessing, because a wrong guess discards a real
number.

`FORM_SUBMISSION_SECRET` is substituted into a bundle served publicly from R2, so
the HMAC in `buildSubmissionHeaders` is readable and `X-FFP-Signature` is
forgeable by construction. It is carried for byte-parity with 5.1.5. Do not build
new trust on it.

## Entitlement: what the licence withholds, and how it fails

5.1.5 gated the entire runtime on `isAppAllowedToRun` (staging domain *or* valid
licence), so an unlicensed production site got no interactive fields at all. An
earlier draft of this port dropped that and applied the licence only to the
backend post, which handed the paid widgets to every unlicensed production site.
The gate is back, with one deliberate change: **an unanswered licence check is
not an unlicensed site.**

`canMountFields` in `ffp-core/src/license.ts` is the whole decision:

| page | licence answer | fields | backend post |
|---|---|---|---|
| `*.webflow.io` | any | mount | skipped |
| custom domain | `active: true` | mount | sent |
| custom domain | definitive no | **withheld** | skipped |
| custom domain | no answer (outage, timeout, 5xx, blocked) | mount | skipped |

Row 3 is 5.1.5's behaviour restored. Row 4 is why it is not `isAppAllowedToRun`
back verbatim: `hasValidLicenseKey` scored a network failure, a 5xx and a
timeout all as "unlicensed", so a licence-service outage would have stripped the
fields from every paying customer's published page at once. `fetchLicense` now
separates *no* from *no answer* — a 4xx (unknown site, revoked key) is an answer
about that site; a 5xx, a 408/425/429 throttle, a thrown fetch and the 1500 ms
boot timeout are the service failing to answer, and they resolve to
`{ active: false, stale: true }`, which mounts. **The failure mode of an
entitlement check is a missed sale, not an incident on a customer's page.**

Withholding means the elements stay the native inputs Webflow generated. The
submission half is still installed, so the form validates and still posts to
Webflow: 5.1.5 returned before installing any of it and leaned on Webflow's own
handler for that, and the visible outcome is the same.

The gate is enforced in `registry.ts` (`setMountAllowed`), not around the single
`mountAll` call in `boot()`, because there are three ways into a mount — boot,
the MutationObserver rescan, and the public `window.FormFieldsPro.mount()` — and
a gate on one of them is not a gate.

**None of this is a security boundary.** Core is served publicly and a site owner
can publish a patched copy; the enforceable check is the backend's own on
`handleFormSubmission`. This gate stops a site that never bought a licence from
getting the product for free, and nothing stronger.

The backend post keeps 5.1.5's harder posture: an unknown answer skips it, so a
licence outage costs licensed sites their backend submissions for the duration
while the lead still reaches Webflow. Loosening that — posting optimistically
and letting the backend decide — is tracked separately.


## What phase 3 must not change

`slider`, `color` and `file` all write a value some other system already reads,
so the rewrites are judged on those strings rather than on the widgets:

- **`"20,80"`.** A range slider writes both handles rounded and comma-joined,
  with no space; a single slider writes `"40"`. That is what the backend has
  stored for every submission since the field shipped.
- **`#rrggbb`.** The colour field writes lowercase hex on Choose *and* on
  dismiss, because 5.1.5 bound both spectrum's `change` and its `hide` to the
  same write.
- **The file field's whole hidden-input protocol**: the input's `name`
  resolution (`name` → `data-name` → element id), its `form-fields-data-input`
  marker, `data-ffp-upload-for`, the relocation of `required` off the dropzone
  and onto it, the `{name, type, size, dataUrl}` array shape, the collapse of
  `'[]'` to `''`, and `_ffpAwaitUploads`. `validateRequiredFields`,
  `getFormFieldsInputData` and `waitForPendingFileUploads` in core each depend on
  one of those, and every one of them is covered by a test that names the caller.

Three deliberate differences, all fixes:

1. A `.dropzone` **with no `id`** now works. 5.1.5 mapped over element ids and
   skipped `undefined`, so such a field silently uploaded nothing.
2. A missing numeric attribute is no longer `0`. `Number(null)` is `0`, so
   5.1.5's `Number(el.getAttribute('data-max'))` gave a slider a maximum of zero
   when the attribute was absent, and pinned a range slider to `0,0`.
3. Oversized files are rejected before they are added rather than added and
   removed a tick later, so no preview flashes up and vanishes.


## Phase 4: what replaced Iconify and ipinfo

**Flags are two characters.** `GB` is U+1F1EC U+1F1E7 and the platform's own
emoji font draws it. 5.1.5 built 252 `<span class="iconify" data-icon="flag:xx-4x3">`
elements eagerly and loaded Iconify from a third origin to swap each one for an
SVG — up to 252 icon lookups on a page where nobody may ever open the picker.
Windows ships no flag glyphs in Segoe UI Emoji, so there it renders an explicit
two-letter chip rather than letting the indicator letters look like a bug. The
rows themselves are not built until the picker is opened.

**The country guess costs nothing and tells nobody.** 5.1.5 ran
`$.get('https://ipinfo.io', …, 'jsonp')` on every page view of every page with a
phone field: a third-party `<script>` with no SRI, and the visitor's IP address
disclosed to ipinfo on every one of those views — a disclosure the customer never
agreed to and could not see. It is now
`Intl.DateTimeFormat().resolvedOptions().timeZone` against a compact primary-zone
table, falling back to `new Intl.Locale(navigator.language).maximize().region`.
Zero requests.

Deviation from the plan worth naming: the plan said this table would be 0 kB.
It is about 800 B gzipped, because a zone name carries no country and the
browser will not map one to the other. Locale alone *is* free, but it answers
with the language's region — a Bangladeshi visitor whose phone is set to English
gets `US` — so the zone table is what keeps the guess useful outside the
English-speaking world. Anyone who wants IP accuracy back can opt in per field
with `data-geo-lookup="https://ipinfo.io/json"`, and then the disclosure is the
customer's to make rather than ours to make on their behalf.

**The country picker is the shared listbox**, the same one select uses and the
same one the calendar's month and year dropdowns use — three call sites, one
primitive, which is why phone went last. It searches by name, ISO code and dial
code; 5.1.5 matched on the name alone. `$(document).on('click.ffpPhoneDropdown')`
is gone, so Escape closes the topmost layer instead of whichever handler bound
last.

The country table is generated by `scripts/extract-countries.mjs`, not retyped:
a wrong dial code is a phone number that fails validation for a whole country,
and a reordered list is a dropdown that moves under returning visitors.

## The submit guard is off by default

`packages/ffp-core/src/forms.ts` replaces 5.1.5's `$(form).submit(() => false)`
with one capture-phase listener on `document`. It refuses to install unless
`enabled: true` is passed *and* the page has not set
`data-ffp-submit-guard="off"`, because a guard with no submission path behind it
silently swallows every lead on the page. The property that matters — that a
handler Webflow bound on the form does not also run — cannot be asserted under
linkedom, which does not implement the capture phase; it needs Playwright against
a real published site before this is switched on anywhere.

## Why `ffp-config` is the published one

The five overlapping legacy config representations exist because the writer (the
Designer Extension) and the reader (the runtime) were developed separately, in
different repositories, with no shared type. Attribute names live in exactly one
table now, and both sides import it. That is the mechanism that stops the drift
recurring, and it is the reason this package is published rather than vendored.

## Build order

`scripts/build.mjs` builds chunks first, hashes them, writes their URLs and
sha384 digests into `ffp-core/src/manifest.generated.ts`, and only then builds
core. The result is one chain of trust with no manifest fetch:

```
Webflow <script integrity>  ->  core bytes  ->  manifest literals  ->  chunk bytes
```

Webflow's registered-script API pins core's sha384. Core pins every chunk. There
is no unverified hop and no extra round trip.

Three alternatives were ruled out. **Multiple registered scripts:**
`registerAndAddCustomCode` deletes every prior entry matching our displayName.
**Native `import()`:** dynamic imports cannot carry an integrity attribute, and
import-map `integrity` is Chrome-only. **Per-site tree-shaken bundles:** the
backend cannot know which fields a site uses.

## Chunks are environment-independent

A chunk must produce identical bytes in staging and production, or its
content-addressed key stops being a safe cache key. Release-time placeholders are
substituted into **core only** and forwarded to chunks through the `ChunkApi`
object. `scripts/build.mjs` fails the build if a chunk still contains a `__FFP_`
token — which also stops `FORM_SUBMISSION_SECRET` spreading across more public
objects than it already does.

## Phase 5: nothing in the build reads `src/` any more

The last two extracts became real code. **likert** is now
`packages/ffp-fields/src/nps/likert.ts` — the whole field is one stylesheet, so
it rides in the `nps` chunk rather than paying its own round trip, and it fixes a
layout bug on the way: in 5.1.5 the first selector of the pair was
`[data-field="likert-scale-field-radio"]:checked` with no `+ label`, so the 20×20
circle also landed on the checked **input** — which the rule above sets to 0×0 —
and the row shifted sideways as the visitor clicked. Both states style the label
now. **userip** became a per-element field that shares one IP
request across every instance on the page instead of one request each.

**The version moved out of the directory tree.** The build used to discover the
runtime version by scanning `src/` for the highest semver directory, which is
what tied it to a frozen file. `runtimeVersion` in `package.json` is the source
of truth now, read by both `scripts/build.mjs` and `scripts/upload.mjs`.
`src/<version>/` stays checked in as the historical record and as the input to
`scripts/extract-countries.mjs`, but `pnpm build` and `pnpm test` both pass with
the whole directory moved aside — verified, not assumed.

Two items in the phase-5 plan are **not** done, and neither is a matter of
effort:

- *Delete the legacy DX writers.* The Designer Extension does not import
  `@flowappz/ffp-config` and writes no `data-ffp` v2 yet, so the dual-write
  window has not opened. Deleting the legacy writes now would leave published
  sites with no config at all.
- *Drop `data-ffp-mounted`.* It exists so that an old immutably-cached bundle and
  a new one can coexist on one page during a canary. No canary has run.

## Generated files

- `packages/ffp-fields/src/phone/countries.ts` — the 252-row table, produced by
  `scripts/extract-countries.mjs`. The last generated file; every `legacy.js` and
  `scripts/extract-legacy.mjs` are gone. CI regenerates it and fails on a diff,
  so edit the extractor, not the table.
- `packages/ffp-core/src/manifest.generated.ts` — written by the build. The
  checked-in version is an empty stub, which makes core degrade every field to
  its native input. That is the correct behaviour for a failed release. Never
  commit a built copy: its URLs carry the environment they were built for.

## Commands

```bash
pnpm build        # bundle chunks, then core, into build/<runtimeVersion>/
pnpm typecheck
pnpm test
pnpm extract:countries   # re-derive the country table from src/5.1.5/
node scripts/check-bundle-budget.mjs
```
