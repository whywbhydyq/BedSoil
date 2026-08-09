> [!IMPORTANT]
> **项目已退役 / Archived**
>
> 此工具已于 2026-08-08 停止维护和服务。原生产域名现返回 HTTP 410。请访问 https://ymirtool.com/。

# BedSoil

BedSoil is a Next.js MVP for a **Raised Bed Soil & Planting Calculator** tool site.

It includes:

- Raised Bed Soil Calculator
- 4×8 presets
- Soil Bag Calculator
- Bulk vs Bags Calculator
- Soil Mix Calculator
- Container / Grow Bag Calculator
- Annual Top-Off Calculator
- Basic Square Foot Grid
- Depth Checker
- Copy shopping list
- Print result
- About / Privacy / Terms / Disclaimer / Affiliate Disclosure
- sitemap and robots routes
- centralized unit conversion and pure calculation functions
- Vitest tests for the required acceptance cases

## Commands

```bash
npm install
npm run lint
npm run test
npm run build
```

No account system, cloud save, AI plant diagnosis, pest or disease diagnosis, companion planting full database, USDA zone calendar, or 3D garden planner is included.


## Final completion notes

This package includes the MVP and currently actionable development-plan items: calculators, long-tail pages, shaped beds, multiple areas, cost estimator, seasonal checklists, US/metric presets, copy/print/download/share controls, a 4×8 planting layout preview, common sizes table, affiliate-safe shopping notes, sitemap, robots, and Vercel old-build skip configuration.


## Production domain

The production domain is `https://bedsoil.ymirtool.com`. The domain, AdSense account ID, and ads.txt publisher line are defined directly in source files, so Vercel environment variables are not required for this fixed-domain project.

AdSense publisher configuration for the YmirTool network uses `ca-pub-1653188471819736`; `public/ads.txt` contains the matching seller line.
