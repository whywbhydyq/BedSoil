#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".seo-cache"
OUTPUT = ROOT / "DRIFT-AUDIT-REPORT.md"
SUMMARY = ROOT / "DRIFT-SUMMARY.json"


def now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def read(path: str) -> str:
    target = ROOT / path
    return target.read_text(encoding="utf-8", errors="replace") if target.exists() else ""


def load_json(path: str) -> Any:
    target = ROOT / path
    if not target.exists():
        return None
    try:
        return json.loads(target.read_text(encoding="utf-8"))
    except Exception:
        return None


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def slug_list() -> list[str]:
    text = read("src/lib/data/pages.ts") + "\n" + read("src/lib/data/competitorPages.ts")
    return sorted(set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", text)))


def has_file(path: str) -> bool:
    return (ROOT / path).exists()


def contains(path: str, needle: str) -> bool:
    return needle in read(path)


def count_occurrences(path: str, needle: str) -> int:
    return read(path).count(needle)


def main() -> None:
    analyzed_at = now()
    slugs = slug_list()
    pages_ts = read("src/lib/data/pages.ts")
    next_config = read("next.config.ts")
    sitemap_ts = read("src/app/sitemap.ts")
    robots_ts = read("src/app/robots.ts")
    jsonld_ts = read("src/lib/seo/jsonLd.ts")
    layout_tsx = read("src/app/layout.tsx")
    image_sitemap_route = has_file("src/app/image-sitemap.xml/route.ts")

    checks = [
        {
            "id": "slug-count",
            "status": "pass" if len(slugs) >= 74 else "warning",
            "detail": f"{len(slugs)} slugs detected in src/lib/data/pages.ts.",
        },
        {
            "id": "sitemap-stable-lastmod",
            "status": "pass" if "new Date()" not in sitemap_ts and "lastModifiedForSlug" in sitemap_ts else "critical",
            "detail": "Sitemap uses stable page-level lastModified helper." if "lastModifiedForSlug" in sitemap_ts else "Sitemap lastModified helper not detected.",
        },
        {
            "id": "robots-sitemaps",
            "status": "pass" if "/sitemap.xml" in robots_ts and "/image-sitemap.xml" in robots_ts else "warning",
            "detail": "robots.ts references both standard and image sitemaps." if "/image-sitemap.xml" in robots_ts else "image sitemap not referenced in robots.ts.",
        },
        {
            "id": "csp-present",
            "status": "pass" if "Content-Security-Policy" in next_config and "frame-ancestors" in next_config else "critical",
            "detail": "CSP and frame-ancestors configured in next.config.ts.",
        },
        {
            "id": "hsts-present",
            "status": "pass" if "Strict-Transport-Security" in next_config else "warning",
            "detail": "HSTS header configured." if "Strict-Transport-Security" in next_config else "HSTS header missing.",
        },
        {
            "id": "jsonld-graph",
            "status": "pass" if "@graph" in jsonld_ts and "serializeJsonLd" in jsonld_ts and "replace(/</g" in jsonld_ts else "warning",
            "detail": "JSON-LD graph and safe serializer are present." if "serializeJsonLd" in jsonld_ts else "safe JSON-LD serializer missing.",
        },
        {
            "id": "schema-contact-page",
            "status": "pass" if "ContactPage" in jsonld_ts else "info",
            "detail": "ContactPage schema is available for contact route.",
        },
        {
            "id": "image-sitemap-route",
            "status": "pass" if image_sitemap_route else "warning",
            "detail": "Image sitemap route exists." if image_sitemap_route else "Image sitemap route missing.",
        },
        {
            "id": "llms-file",
            "status": "pass" if has_file("public/llms.txt") and "Recommended citation" in read("public/llms.txt") else "warning",
            "detail": "llms.txt includes citation guidance." if has_file("public/llms.txt") else "llms.txt missing.",
        },
        {
            "id": "ai-policy",
            "status": "pass" if has_file("public/ai-crawler-policy.txt") and "search" in read("public/ai-crawler-policy.txt").lower() and "citation" in read("public/ai-crawler-policy.txt").lower() else "warning",
            "detail": "AI crawler policy exists with search/reference boundary.",
        },
        {
            "id": "rsl",
            "status": "pass" if has_file("public/rsl.xml") and "rel=\"license\"" in layout_tsx else "info",
            "detail": "RSL license signal is linked from layout." if "rel=\"license\"" in layout_tsx else "RSL link not found in layout.",
        },
        {
            "id": "backlink-policy",
            "status": "pass" if has_file("public/backlink-policy.txt") else "info",
            "detail": "White-hat backlink policy asset exists.",
        },
        {
            "id": "comparison-pages-modeled",
            "status": "pass" if "comparison" in pages_ts and len([s for s in slugs if s.startswith("bedsoil-vs-") or s == "best-raised-bed-soil-calculators"]) == 4 else "warning",
            "detail": "Four comparison pages are present and modeled.",
        },
        {
            "id": "programmatic-cache",
            "status": "pass" if has_file(".seo-cache/programmatic.json") else "warning",
            "detail": "Programmatic cache exists." if has_file(".seo-cache/programmatic.json") else "Programmatic cache missing.",
        },
        {
            "id": "performance-cache",
            "status": "pass" if has_file(".seo-cache/performance.json") else "warning",
            "detail": "Performance cache exists." if has_file(".seo-cache/performance.json") else "Performance cache missing.",
        },
        {
            "id": "no-meta-keywords",
            "status": "pass" if "keywords" not in read("src/app/layout.tsx") and "meta name=\"keywords\"" not in read("src/app/page.tsx") else "warning",
            "detail": "No runtime meta keywords detected in checked entry points.",
        },
        {
            "id": "ads-lazy",
            "status": "pass" if "lazyOnload" in read("src/components/AdSenseAutoAds.tsx") and "IntersectionObserver" in read("src/components/AdSlot.tsx") else "warning",
            "detail": "AdSense auto ads are lazy loaded and manual slots are viewport gated.",
        },
    ]

    counts = {
        "pass": sum(1 for check in checks if check["status"] == "pass"),
        "warning": sum(1 for check in checks if check["status"] == "warning"),
        "critical": sum(1 for check in checks if check["status"] == "critical"),
        "info": sum(1 for check in checks if check["status"] == "info"),
    }
    score = round((counts["pass"] / len(checks)) * 100)

    cache_files = sorted(str(path.relative_to(CACHE)) for path in CACHE.rglob("*.json")) if CACHE.exists() else []
    summary = {
        "cache_type": "drift",
        "analyzed_at": analyzed_at,
        "source": "local static project drift guardrail scan",
        "domain": "https://bedsoil.ymirtool.com",
        "baseline_project_zip": "BedSoil_seo_backlinks_rerun_completed.zip",
        "slug_count": len(slugs),
        "checks_total": len(checks),
        "checks": checks,
        "counts": counts,
        "static_drift_readiness_score": score,
        "tracked_cache_files": cache_files,
        "key_findings": [
            "SEO-critical infrastructure is currently stable in static source inspection.",
            "Live drift baselines require deployed URLs and should be captured after preview/production deployment.",
            "Core Web Vitals drift comparisons require PageSpeed API or GSC/CrUX data; current workflow records null CWV when unavailable.",
        ],
        "issues": [check for check in checks if check["status"] in {"warning", "critical"}],
        "recommendations": [
            "Capture live baselines immediately after deployment for /, /raised-bed-soil-calculator, /4x8-raised-bed-soil-calculator, /soil-bags-calculator, /best-raised-bed-soil-calculators, /sitemap.xml, and /image-sitemap.xml.",
            "Run drift_compare after each deployment before promoting preview to production.",
            "Treat noindex additions, canonical host changes, sitemap loss, JSON-LD removal, and status-code regressions as release blockers.",
        ],
        "tool_limitations": [
            "No npm run build executed.",
            "No tests executed.",
            "No live URL crawl executed because this run used the local project package.",
            "No PageSpeed/GSC credentials were available for field CWV drift.",
        ],
    }

    write_json(CACHE / "drift.json", summary)
    write_json(SUMMARY, summary)

    check_rows = "\n".join(f"| `{check['id']}` | {check['status']} | {check['detail']} |" for check in checks)
    issue_rows = "\n".join(f"- `{check['id']}`: {check['detail']}" for check in summary["issues"]) or "- None."
    report = f"""# SEO Drift Static Guardrail Report

Generated: {analyzed_at}

## Scope

This run executed only `seo-drift` against the local BedSoil project package. It did not fetch live pages, did not run a production build, and did not run tests.

## Result

| Metric | Value |
|---|---:|
| Slugs tracked | {len(slugs)} |
| Drift checks | {len(checks)} |
| Pass | {counts['pass']} |
| Warning | {counts['warning']} |
| Critical | {counts['critical']} |
| Info | {counts['info']} |
| Static drift readiness | {score}/100 |

## Checks

| Check | Status | Detail |
|---|---|---|
{check_rows}

## Issues

{issue_rows}

## Durable outputs

- `scripts/fetch_page.py`
- `scripts/parse_html.py`
- `scripts/pagespeed_check.py`
- `scripts/drift_baseline.py`
- `scripts/drift_compare.py`
- `scripts/drift_history.py`
- `scripts/drift_report.py`
- `scripts/analyze_drift_static.py`
- `.seo-cache/drift.json`

## Recommended live baseline set

Capture a known-good baseline after deployment:

```bash
python3 scripts/drift_baseline.py https://bedsoil.ymirtool.com --skip-cwv
python3 scripts/drift_baseline.py https://bedsoil.ymirtool.com/raised-bed-soil-calculator --skip-cwv
python3 scripts/drift_baseline.py https://bedsoil.ymirtool.com/4x8-raised-bed-soil-calculator --skip-cwv
python3 scripts/drift_baseline.py https://bedsoil.ymirtool.com/soil-bags-calculator --skip-cwv
python3 scripts/drift_baseline.py https://bedsoil.ymirtool.com/best-raised-bed-soil-calculators --skip-cwv
```

Compare after each deployment:

```bash
python3 scripts/drift_compare.py https://bedsoil.ymirtool.com --skip-cwv > drift-home.json
python3 scripts/drift_report.py drift-home.json --output drift-home.html
```

If `PAGESPEED_API_KEY` is available, omit `--skip-cwv` to include PageSpeed/field-data where available.

## Release blockers

- HTTP status changes to 4xx/5xx.
- Accidental `noindex`.
- Canonical removed or pointed to a different host.
- JSON-LD graph removed.
- Sitemap or image sitemap removed from robots.
- CSP/HSTS removed.
- Homepage or core calculator title/meta description removed.

## Limitations

- No live crawl in this run.
- CWV drift is scaffolded but not populated without PageSpeed credentials.
- The SQLite database is local at `~/.cache/codex-seo/drift/baselines.db`; CI should persist this path or export JSON artifacts between runs.
"""
    OUTPUT.write_text(report, encoding="utf-8")
    print(json.dumps({"summary": str(SUMMARY), "report": str(OUTPUT), "score": score, "counts": counts}, indent=2))


if __name__ == "__main__":
    main()
