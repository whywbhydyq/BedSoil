# BedSoil Local Repair + Homepage Task-Fit Optimization Audit

Audit basis: local source repair and homepage task-fit optimization pass on the uploaded BedSoil package. No feature was removed and no promised feature was intentionally downgraded.

## Result

Status: **source repaired, homepage task path optimized, and fifth-pass code audit fixes applied**. The package has a normal POSIX project directory structure, full sitemap coverage, result-area ad placement, safer numeric input handling, explicit homepage canonical metadata, clearer first-screen task promise, prioritized Raised/Bags/Bulk modes, preserved advanced planners, stronger long-tail preset sections, page-specific planning-source context, concrete 4×8 depth output summaries, safer source routing, clipboard fallback behavior, CSV export hardening, and complete share URL state persistence, active-volume bulk/cost consistency, and combined multi-mode volume handling.

## Homepage task-fit status

- Homepage title and description now explicitly promise the concrete workflow: enter raised bed dimensions and bag size, then estimate cubic feet, cubic yards, liters, bags, bulk cost, and a copyable shopping list.
- Homepage structured data now includes `url: SITE_URL` and a `potentialAction` target for `/#calculator`.
- Hero copy was compressed from a broad feature list into the core task path: bed size + bag size → volume, bags, cost, shopping list.
- Primary calculator tabs now prioritize `raised`, `bags`, and `bulk`; mix, containers, spacing, top-off, depth, cost, multi-bed, and shapes remain available under More planners.
- Raised-bed freeboard and settling controls are now collapsed under Advanced assumptions instead of blocking the core input path.
- Copy shopping list, print/save, and share URL actions now appear immediately below the focused result summary, while full TXT/CSV/PNG/PDF export actions remain in the detailed shopping-list section.

## Route and SEO status

- Total page definitions: 70.
- Unique page definitions: 70.
- Original 45 SEO target pages: complete; missing list is `[]`.
- `src/app/sitemap.ts` maps over `allPages`, so all 70 page definitions are included in the generated sitemap plus the homepage.
- Calculator JSON-LD uses absolute `SITE_URL` URLs rather than relative `/${slug}` URLs.
- Homepage and key calculator metadata were sharpened for task intent without removing existing pages.
- Title / description uniqueness checks remain in `scripts/audit.mjs`.
- Runtime meta keywords remain forbidden by the audit script.

## Long-tail preset page status

- Non-legal slug pages now include a "Preset loaded" section before the calculator, making clear that results come from editable calculator inputs rather than static article text.
- Long-tail pages now include formula, example, next-step guidance, practical notes, and common mistakes by calculator mode.
- 4×8 depth pages now include concrete output summaries for 6, 8, 10, 12, 18, and 24 inches: ft³ before settling, ft³/yd³ with 10% settling, and estimated 2 ft³ bag counts.
- Existing embedded calculator behavior and `presetSlug` loading remain intact.
- Related links, FAQ, disclaimer, affiliate slot, and sidebar ad placement remain present.

## Planning-source and assumption status

- Added a 35-reference `SOURCE_LIBRARY` and page-specific source routing so raised bed, 4×8 depth, bags, bulk, mix, container, spacing, tomato, carrot, depth, and top-off pages show more relevant sources instead of one uniform list. Follow-up audits fixed homepage `PlanningSources` usage by allowing an empty slug, prioritized page-specific source IDs before generic context sources, and replaced broad `pot` substring matching with explicit pot/container route terms to avoid future source misclassification.
- Crop spacing data now exposes `basis` and `sourceNote` fields instead of presenting plant counts as authoritative.
- Result panel now shows crop-assumption and source-boundary text for spacing and depth modes, including tomato/carrot-specific cautions.
- Depth, spacing, mix, and container pages still frame outputs as planning estimates and require users to check product labels, seed packets, local extension guidance, soil tests, and site conditions.

## AdSense / affiliate status

- FAQ-middle ad placeholder: implemented.
- Desktop-sidebar ad placeholder: implemented.
- Result-area ad placeholder: implemented inside the calculator result panel, below the focused result summary and separated from calculator controls.
- Affiliate disclosure page and affiliate-safe note component remain present.
- AdSense client remains `ca-pub-1653188471819736`.
- `public/ads.txt` remains `google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0`.

## Calculator and input-safety status

- UI number inputs clamp non-finite or negative values to `0` before writing state.
- Shared URL numeric parameters clamp non-finite or negative values before applying setters.
- Core unit and volume helpers clamp negative / non-finite volume outputs.
- Square-foot spacing clamps each dimension before multiplication, preventing negative × negative values from producing a positive garden grid.
- Bag price, bulk required volume, and soil mix total volume handling remain hardened against negative values.
- Existing calculator modes, presets, result downloads, print flow, copy flow, share URL, mix breakdown, bulk comparison, spacing preview, top-off, shape calculators, and cost estimator remain present. Copy and share actions now use a Clipboard API fallback for restricted browser contexts, and CSV exports use raw numeric values with cell escaping instead of locale-formatted comma numbers.

## Packaging and configuration status

- Uploaded ZIP path separators were normalized into a real project directory before repair.
- `tsconfig.tsbuildinfo` remains removed from the package.
- `.gitignore` includes `*.tsbuildinfo`.
- `package-lock.json` registry URLs remain `registry.npmjs.org` rather than `registry.npmmirror.com`.
- `vercel.json` still includes `ignoreCommand: node scripts/skip-old-vercel-builds.mjs`.
- `next.config.ts` keeps basic response headers: `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.

## Verification performed in this pass

- `node scripts/audit.mjs`: passed with added checks for related-link integrity, source ID integrity, safe source routing, explicit `ReactNode` import, clipboard fallback, CSV hardening, and share URL state persistence.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- Static optimization presence checks: passed.
- 4×8 depth summary and page-specific source-library checks: passed.
- `npm run build`: not run by request.
- Tests: not run by request.
- `tsc --noEmit --incremental false`: run as a diagnostic only. A complete pass is blocked by missing local `node_modules` for Next/React/Vitest/Tailwind/Node types. After the second pass, the only filtered non-environment diagnostic left is the expected `node:url` type resolution in `vitest.config.ts` caused by absent local `@types/node`; runtime/source diagnostics introduced by the BedSoil code changes were cleared.


## Follow-up code audit fixes

- Fixed a real homepage runtime risk: `src/app/page.tsx` called `<PlanningSources />` without a slug, while `sourceIdsForPage` previously assumed `slug.includes(...)` was always safe. `PlanningSources`, `sourceIdsForPage`, and `pageSourceSummary` now default to an empty slug and provide a dedicated homepage source path.
- Reordered page-specific source selection so tomato, carrot, spacing, depth, container, mix, bag, and bulk sources are not hidden behind generic sources when the visible list is capped.
- Added an explicit post-`notFound()` throw in `src/app/[slug]/page.tsx` so static analysis can narrow `page` before rendering.
- Added lightweight event and mix-result typings in `Calculator.tsx` to remove filtered TypeScript diagnostics unrelated to missing package dependencies.
- Extended `scripts/audit.mjs` to guard the homepage `PlanningSources` crash case and slug-page narrowing fix.

## Second-pass code audit fixes

- Replaced broad source-routing substring matching for pots with explicit `six-inch-pots` / `potting` route terms, so future compost/topsoil or unrelated slugs cannot accidentally receive container-source priority.
- Added explicit `ReactNode` type import in `src/app/layout.tsx` instead of relying on the global `React` namespace.
- Hardened copy/share actions with a textarea fallback when `navigator.clipboard.writeText` is unavailable or blocked by browser permissions.
- Hardened CSV export so numeric cells are raw machine-readable numbers rather than locale-formatted values that can contain thousands separators. CSV cells are escaped when needed.
- Extended `scripts/audit.mjs` to check related-link slugs, source ID references, broad source-route hazards, clipboard fallback, CSV export hardening, and explicit layout typing.


## Third-pass code audit fixes

- Fixed a real share-link reliability gap: `Copy share URL` now serializes and restores mix template/custom ratios, container mode and grow-bag dimensions, rectangular/round/tapered container inputs, cost fields, tax, multi-bed rows, multi-container rows, unit preset, and the existing raised/bags/bulk/spacing/shape state.
- Kept non-negative clamping for all numeric URL parameters when restoring shared links.
- Extended `scripts/audit.mjs` with share-state regression checks so mode-specific inputs cannot silently drop out of generated share URLs again.

## Current caveats

Live DNS, Vercel deployment, real browser screenshots, and post-deploy GSC data were not verified from this local package. The fixed production domain remains `https://bedsoil.ymirtool.com`.

## Fourth-pass code audit fixes

- Fixed a real zero-quantity calculation bug: container quantities, raised-bed row quantities, shape quantities, and top-off bed counts now allow `0` to mean zero volume instead of silently counting as one hidden row/item.
- Added a result validation message for zero-volume inputs so users understand when a quantity or dimension produces no material estimate.
- Added regression coverage in `scripts/audit.mjs` for zero-quantity handling across containers, raised beds, shapes, and top-off calculations.
- Strengthened 4×8 long-tail internal linking: the 4×8 hub now links to the 6, 8, 10, 12, 18, and 24 inch preset pages; each depth page links back to the hub and adjacent/relevant preset pages.
- Added clickable links inside the 4×8 depth output summary table so users can move between exact depth presets without relying only on generic related links.
- Extended `scripts/audit.mjs` to check homepage related links and 4×8 depth preset link integrity.

## Fourth-pass verification

- `node scripts/audit.mjs`: passed with zero-quantity and 4×8 internal-link checks.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- `python -m json.tool AUDIT_STRUCTURAL.json`: passed.
- Fresh unzip verification: passed.
- `npm run build`: not run by request.
- Tests: not run by request.

## Fifth-pass code audit fixes

- Fixed active-volume consistency in the result panel and exports: bulk order, bulk savings, CSV `bulk_cost`, and the shopping-list bulk estimate now use the current focused calculator volume instead of the older raised/manual source volume.
- Updated project cost estimation to use the active bag result, so container, top-off, shape, and multi-mode exports do not report a project soil cost from an unrelated raised/manual volume.
- Fixed multi-mode result semantics: the focused result, bag count, bulk comparison, CSV export, and shopping-list volume now combine raised-bed rows and multi-container rows instead of using only the bed rows while showing containers separately.
- Hardened cost-per-bed behavior for a zero bed count. The cost calculator now warns when bed count is zero and reports `0` cost per bed instead of silently dividing by one.
- Extended `scripts/audit.mjs` with regression checks for active-volume bulk/cost consistency, combined multi-mode volume, and zero-bed cost-per-bed handling.

## Fifth-pass verification

- `node scripts/audit.mjs`: passed with active-volume, multi-combined, zero-quantity, share-state, source-routing, related-link, sitemap, and long-tail checks.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- `python -m json.tool AUDIT_STRUCTURAL.json`: passed.
- Fresh unzip verification: passed.
- `npm run build`: not run by request.
- Tests: not run by request.

## Sixth-pass code audit fixes

- Fixed bulk comparison semantics for zero required volume. A zero-volume result now reports 0 yd³ bulk order, 0 service cost, 0 savings, and a critical `bulk-zero-volume` warning instead of suggesting the default minimum order.
- Fixed misleading bag-vs-bulk recommendations when the bag label is weight-only. lb/kg bag labels now produce a `notComparable` recommendation and UI copy that asks for a package volume label, rather than implying bags are cheaper.
- Hardened bulk comparison inputs against non-finite values for price per cubic yard, delivery fee, pickup trip cost, minimum order, and bag price.
- Hardened `calculateSoilBags()` so non-finite required volume, bag size, or bag price cannot produce NaN bag counts or costs.
- Hardened `calculateSoilMix()` so non-finite custom ratios trigger a critical warning and cannot leak NaN component volumes into results.
- Hardened grow-bag gallons and square-foot custom plant density handling so non-finite direct function inputs are sanitized even outside the UI clamp path.
- Aligned container-source summary routing with the explicit source route terms for planter, grow-bag, six-inch-pot, and potting pages without reintroducing broad `pot` substring matching.
- Extended `scripts/audit.mjs` with regression checks for zero-volume bulk behavior, weight-only bag comparison semantics, non-finite bag/mix/container/spacing/bulk input hardening, and container source-summary routing.

## Sixth-pass verification

- `node scripts/audit.mjs`: passed with bulk-comparison, bag, mix, container, spacing, active-volume, zero-quantity, share-state, source-routing, related-link, sitemap, and long-tail checks.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- `python -m json.tool AUDIT_STRUCTURAL.json`: passed.
- TypeScript syntax transpile check with the globally available TypeScript compiler API: 38 TS/TSX files checked, 0 syntax failures.
- `npm run build`: not run by request.
- Tests: not run by request.

## Seventh-pass code audit fixes

- Fixed mix-breakdown consistency in the result panel and exports. The mix breakdown now follows the current active result volume outside the mix tab, so container, top-off, shape, and multi-project estimates no longer display a mix split from a stale raised/manual source volume.
- Scoped warnings to the current calculator mode. Container, shape, top-off, multi, bags, bulk, and mix modes now use mode-relevant volume warnings instead of always including raised-bed warnings from inactive inputs.
- Scoped validation messages by mode. Manual-volume modes validate manual volume, top-off validates top-off dimensions, depth validates bed depth, spacing validates grid dimensions, and container mode validates container/grow-bag inputs.
- Fixed square-foot grid preview for zero dimensions. A 0×N or N×0 grid now shows an empty-state message instead of rendering a misleading 1×1 preview cell.
- Added capped-preview disclosure for large square-foot grids. The visual grid can stay capped at 12×12 for layout safety while the calculation still uses the full input grid.
- Extended `scripts/audit.mjs` with regression checks for active-volume mix breakdown, mode-scoped warnings/validation, and square-foot preview empty/capped states.

## Seventh-pass verification

- `node scripts/audit.mjs`: passed with mode-scoped warning/validation and square-foot preview checks.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- `python -m json.tool AUDIT_STRUCTURAL.json`: passed after metadata update.
- TypeScript syntax transpile check with the globally available TypeScript compiler API: 35 TS/TSX files checked, 0 syntax failures.
- `npm run build`: not run by request.
- Tests: not run by request.

## Eighth-pass code audit fixes

- Fixed shape-mode depth isolation. The non-rectangular shapes planner now uses its own `shapeDepth` inch value instead of sharing the global raised-bed/depth `depth` state, preventing metric depth values from being interpreted as inches in shape calculations.
- Fixed unit-preset conversion consistency. Switching between US and metric now converts `freeboard` and `topOffDepth` along with the main bed depth, so hidden or secondary depth-based controls do not silently change meaning.
- Updated top-off preset buttons so the 1/2/3 inch presets remain equivalent when the current depth unit is feet, centimeters, or meters.
- Kept 4×8 preset buttons and 4×8 preset pages consistent with their displayed unit preset by forcing those ft/in presets back to the US unit state.
- Moved the 4×8 depth output summary below the embedded calculator on slug pages so the long-tail pages keep the tool path ahead of supporting content, while preserving the concrete ft³ / yd³ / 2 ft³ bag summaries and internal depth links.
- Extended `scripts/audit.mjs` with regression checks for shape-depth isolation, freeboard/top-off unit conversion, top-off preset equivalence, 4×8 unit preset consistency, and calculator-before-summary long-tail layout.

## Eighth-pass verification

- `node scripts/audit.mjs`: passed with unit-consistency, shape-depth isolation, long-tail tool-path, active-volume, mode-scoped warning/validation, source-routing, share-state, and square-foot preview checks.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- `python -m json.tool AUDIT_STRUCTURAL.json`: passed after metadata update.
- TypeScript syntax transpile check with the globally available TypeScript compiler API: 35 TS/TSX files checked, 0 syntax failures.
- Fresh unzip verification: passed.
- `npm run build`: not run by request.
- Tests: not run by request.

## Ninth-pass code audit fixes

- Exposed the raised-bed dimension source inside every calculator mode that depends on it. Bags, bulk, and mix modes now show editable bed dimensions whenever `Use raised bed dimensions` is selected instead of relying on hidden state from the raised tab.
- Added the same visible raised-bed source controls to the project cost mode, so the soil-cost estimate is tied to editable dimensions within the active cost workflow.
- Added visible row-1 raised-bed controls to the multi-area planner. The multi result still combines raised-bed rows and container rows, but row 1 is no longer described as a hidden value from another tab.
- Preserved all existing modes, advanced assumptions, share URL state, copy/download/print actions, long-tail presets, and sources. This pass only made dependent inputs visible where results already used them.
- Extended `scripts/audit.mjs` with regression checks that raised-bed source modes expose editable controls and do not fall back to a static hidden-state note.

## Ninth-pass verification

- `node scripts/audit.mjs`: passed with visible raised-bed source controls, unit-consistency, active-volume, mode-scoped warning/validation, source-routing, share-state, export, sitemap, and long-tail checks.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- `python -m json.tool AUDIT_STRUCTURAL.json`: passed after metadata update.
- TypeScript syntax transpile check with the globally available TypeScript compiler API: 35 TS/TSX files checked, 0 syntax failures.
- `npm run build`: not run by request.
- Tests: not run by request.

## Tenth-pass online source refresh and code-audit fixes

- Collected additional current Extension/NAL/NIST-style references for soil testing, lead boundaries, container volume, container minimum sizes, and raised-bed material planning.
- Expanded `SOURCE_LIBRARY` from 35 to 39 curated references, adding updated UMD soil-test-report, UMD container-volume/minimum-container-size, and OSU raised-bed material-planning references.
- Updated source routing so container pages can surface current container volume / minimum-size references and raised-bed pages can surface raised-bed material-planning sources.
- Fixed a task-fit issue in spacing and depth modes: those modes no longer show bag count, bag cost, bulk order, mix breakdown, volume conversions, or cost warnings that depend on hidden raised-bed volume state.
- Added task-specific spacing/depth result cards, assumption strips, copied output, and CSV export rows so downloads match the current active task.
- Scoped inactive bag/bulk/mix/cost warnings away from spacing/depth modes while preserving all volume-mode warnings and validations.
- Extended `scripts/audit.mjs` with regression checks for task-specific spacing/depth exports, non-volume warning scoping, updated online-source entries, and page-specific source routing.

## Tenth-pass verification

- `node scripts/audit.mjs`: passed with updated source routing and task-specific spacing/depth export checks.
- `node --check scripts/audit.mjs`: passed.
- `node --check scripts/skip-old-vercel-builds.mjs`: passed.
- `python -m json.tool AUDIT_STRUCTURAL.json`: passed after metadata update.
- TypeScript syntax transpile check with the globally available TypeScript compiler API: 35 TS/TSX files checked, 0 syntax failures.
- `npm run build`: not run by request.
- Tests: not run by request.
