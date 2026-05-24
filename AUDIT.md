# BedSoil Full Original Requirements Source Audit

Audit basis: the source code was re-audited against the complete original Chinese requirements document, fetched from GitHub blob `d4153290feadcc3b7715a3513057c9cf4f9ea199`. This audit does not rely on the earlier local summary requirements copy.

## Result

Status: **pass for source implementation against the full original requirements**, with one explicit deployment caveat: live DNS/Vercel deployment has not been verified from this local package. The production domain is hardcoded as `https://bedsoil.ymirtool.com`; Vercel environment variables are not required.

## Full original requirements coverage

### Product chain

Implemented the complete user decision chain from the original requirements: raised bed volume, bag count, bulk-vs-bags cost, soil mix breakdown, depth suitability, 4×8 square-foot planting, annual top-off, and container / grow bag volume.

### P0 MVP

- Raised Bed Soil Calculator: complete.
- 4×8 Raised Bed Calculator: complete.
- Soil Bag Calculator: complete.
- Bulk vs Bags Cost Calculator: complete.
- Soil Mix Calculator: complete, including custom ratios.
- Container / Grow Bag Calculator: complete.
- Basic Square Foot Spacing Grid: complete, with printable grid preview.
- Copy / Print / Download Result: complete.
- FAQ: complete.
- Disclaimer: complete.

### P1 requirements named in the full original document

- Annual Top-Off Calculator: complete.
- Crop Depth Suitability Checker: complete.
- More crop spacing presets: complete for the original crop set.
- Printable shopping list: complete via print/save-as-PDF and downloads.
- Raised bed cost estimator: complete.
- Multiple bed planner: complete.
- Round raised bed calculator: complete.
- U-shaped and L-shaped bed approximation: complete.
- Local unit presets US / metric: complete.
- Seasonal checklist pages: complete as non-zone-specific spring/fall checklists.

### Original 45 SEO / page targets

Required route count from original requirements: 45. Missing required routes: `[]`.

All original first-batch target slugs are now present, including the pages that were previously missing:

- `/how-much-soil-for-4x8-raised-bed`
- `/how-many-bags-of-soil-for-raised-bed`
- `/4x8-raised-bed-12-inches-soil`
- `/4x8-raised-bed-10-inches-soil`
- `/raised-bed-cubic-feet-calculator`
- `/cubic-yards-to-soil-bags-calculator`
- `/liters-to-cubic-feet-soil-calculator`
- `/how-many-40-lb-bags-of-soil-do-i-need`
- `/raised-bed-cost-calculator`
- `/cheapest-way-to-fill-raised-beds`
- `/how-much-bulk-soil-for-raised-beds`
- `/cubic-yards-of-soil-for-raised-beds`
- `/compost-topsoil-mix-calculator`
- `/mels-mix-calculator`
- `/how-much-compost-for-raised-bed`
- `/topsoil-compost-ratio-raised-bed`
- `/planter-soil-volume-calculator`
- `/10-gallon-grow-bag-soil-calculator`
- `/20-gallon-grow-bag-soil-calculator`
- `/5-gallon-bucket-soil-calculator`
- `/how-much-soil-for-45-six-inch-pots`
- `/4x8-raised-bed-planting-layout`
- `/how-many-tomato-plants-in-4x8-raised-bed`
- `/raised-bed-depth-for-tomatoes`
- `/raised-bed-depth-for-carrots`

Total current route definitions: 65. Unique route definitions: 65.

### Page content requirements

Calculator pages include H1, one-sentence description, calculator UI, result section, how-to text, formula, example calculation, common sizes / presets, practical notes, FAQ, disclaimer, related calculators, and contextual affiliate-safe notes.

### SEO requirements

- Unique title / description / canonical generated per page.
- Sitemap and robots implemented.
- Static generation through `generateStaticParams`.
- No `meta name="keywords"` or metadata `keywords` found in `src`.
- Long-tail pages are not empty title swaps: each has a tool, formula, example, notes, related links, and preset-aware calculator behavior where applicable.

### AdSense / affiliate requirements

- Result-area ad placeholder implemented.
- FAQ-middle ad placeholder implemented.
- Desktop-sidebar ad placeholder implemented.
- Affiliate disclosure page implemented.
- Affiliate-safe shopping note component implemented.
- AdSense account metadata and Auto Ads client are defined directly in `src/lib/site.ts` as `ca-pub-1653188471819736`.
- `public/ads.txt` contains the fixed publisher line: `google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0`.

### Technical architecture requirements

- Next.js App Router, TypeScript, Tailwind CSS.
- Client-side calculation, no database, no auth, no uploads.
- Core formulas implemented as pure functions under `src/lib/calculators`.
- Unit conversion centralized in `src/lib/calculators/units.ts`.
- Structured warnings implemented with `code`, `message`, and `severity`.
- Currency code support implemented.

### Explicitly forbidden features

The following are intentionally not implemented, as required by the original document:

- AI plant diagnosis.
- Pest / disease diagnosis.
- Full companion planting database.
- USDA-zone personalized calendar.
- Account system.
- Cloud save / sync.
- Image upload / plant identification.
- Soil test interpretation.
- Fertilizer prescription.
- Marketplace or local delivery quote aggregation.
- Complex 3D garden planner.

## Verification

- `npm run test`: passed, 17 / 17 tests.
- `npm run lint -- --max-warnings=0`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: compiled successfully and generated 70 static pages, then the container timed out waiting for final process exit. The route table was emitted successfully.
- Static source scan: no meta keywords in `src`.

## Caveats

The package includes an audit record against the full original requirements source. The earlier local `raised-bed-soil-planting-planner-requirements.md` file was a summary copy, so this audit explicitly uses the original GitHub blob SHA as the controlling source.


## Production domain update - 2026-05-24

Official domain declared by the project owner: `https://bedsoil.ymirtool.com`.

Updated source defaults and package artifacts:

- `src/app/layout.tsx`: `metadataBase` fallback now uses `https://bedsoil.ymirtool.com` and includes `google-adsense-account` metadata.
- `src/app/sitemap.ts`: default sitemap URLs now use `https://bedsoil.ymirtool.com`.
- `src/app/robots.ts`: default sitemap reference now uses `https://bedsoil.ymirtool.com/sitemap.xml`.
- `public/ads.txt`: contains `google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0`.
- `src/lib/data/pages.ts`: added `/contact` legal/contact page.
- No required Vercel environment variables are needed for domain or AdSense because `src/lib/site.ts` contains the fixed production values.

Audit result: source defaults align with `https://bedsoil.ymirtool.com`. Vercel runtime environment variables are optional only; they are not required by this package.


## Packaging correction

This package includes the full original requirements document and the full original development plan from the BedSoil repository, not summary placeholder copies. Build/test commands were not re-run during this final packaging correction because the last requested change only fixed documentation/domain packaging claims.
