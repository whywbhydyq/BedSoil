#!/usr/bin/env python3
"""Deterministic SEO performance audit for BedSoil.

This script intentionally avoids `next build` and test execution. It performs a
static performance risk scan that can run in constrained CI / audit containers.
If PageSpeed credentials and a deployed URL are available, the script can be
extended to fetch PSI data, but by default it labels all CWV values as static
heuristics rather than field or lab measurements.
"""
from __future__ import annotations

import json
import os
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path.cwd()
SITE_URL = os.environ.get("BEDSOIL_AUDIT_URL", "https://bedsoil.ymirtool.com")
NOW = datetime.now(timezone.utc).isoformat()

TEXT_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".txt", ".xml", ".md"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"}

@dataclass
class Budget:
    name: str
    value: int
    budget: int
    unit: str
    status: str


def file_size(path: Path) -> int:
    return path.stat().st_size if path.exists() else 0


def count_pattern(path: Path, pattern: str) -> int:
    if not path.exists():
        return 0
    return len(re.findall(pattern, path.read_text(encoding="utf-8", errors="ignore")))


def runtime_source_files() -> list[Path]:
    files: list[Path] = []
    for base in [ROOT / "src", ROOT / "public"]:
        if not base.exists():
            continue
        for path in base.rglob("*"):
            if path.is_file() and path.suffix in TEXT_EXTENSIONS:
                files.append(path)
    return files


def public_images() -> list[dict[str, Any]]:
    base = ROOT / "public"
    result = []
    if not base.exists():
        return result
    for path in sorted(base.rglob("*")):
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
            result.append({
                "path": str(path.relative_to(ROOT)),
                "bytes": file_size(path),
                "kb": round(file_size(path) / 1024, 1),
                "extension": path.suffix.lower(),
            })
    return result


def status(value: int, budget: int) -> str:
    if value <= budget:
        return "pass"
    if value <= budget * 1.25:
        return "warn"
    return "fail"


def budgets() -> list[Budget]:
    css = file_size(ROOT / "src/app/globals.css")
    calculator = file_size(ROOT / "src/components/Calculator.tsx")
    client_components = sum(file_size(path) for path in (ROOT / "src/components").glob("*.tsx") if "'use client'" in path.read_text(encoding="utf-8", errors="ignore"))
    largest_image = max([img["bytes"] for img in public_images()] or [0])
    total_public_images = sum(img["bytes"] for img in public_images())
    return [
        Budget("global_css", css, 30_000, "bytes", status(css, 30_000)),
        Budget("calculator_client_component_source", calculator, 90_000, "bytes", status(calculator, 90_000)),
        Budget("client_component_source_total", client_components, 80_000, "bytes", status(client_components, 80_000)),
        Budget("largest_public_image", largest_image, 160_000, "bytes", status(largest_image, 160_000)),
        Budget("total_public_images", total_public_images, 260_000, "bytes", status(total_public_images, 260_000)),
    ]


def collect_issues() -> list[dict[str, str]]:
    issues: list[dict[str, str]] = []
    source_text = "\n".join(path.read_text(encoding="utf-8", errors="ignore") for path in runtime_source_files())

    if 'strategy="afterInteractive"' in source_text and "adsbygoogle" in source_text:
        issues.append({"priority": "high", "area": "third_party_js", "message": "AdSense script loads afterInteractive; prefer lazyOnload for non-critical ads."})
    if '<SoilPlanningDiagram title="Raised Bed Soil Calculator" priority' in source_text:
        issues.append({"priority": "medium", "area": "lcp", "message": "Homepage planning diagram is priority-loaded even though it sits below the calculator."})
    if "IntersectionObserver" not in (ROOT / "src/components/AdSlot.tsx").read_text(encoding="utf-8", errors="ignore"):
        issues.append({"priority": "medium", "area": "ads", "message": "Manual ad slots are initialized without viewport gating."})
    if "content-visibility: auto" not in (ROOT / "src/app/globals.css").read_text(encoding="utf-8", errors="ignore"):
        issues.append({"priority": "medium", "area": "rendering", "message": "Below-the-fold support sections are not eligible for content-visibility deferral."})

    for item in budgets():
        if item.status == "fail":
            issues.append({"priority": "high", "area": "budget", "message": f"{item.name} exceeds budget: {item.value} {item.unit} > {item.budget} {item.unit}."})
        elif item.status == "warn":
            issues.append({"priority": "medium", "area": "budget", "message": f"{item.name} is close to budget: {item.value} {item.unit} / {item.budget} {item.unit}."})

    if not issues:
        issues.append({"priority": "low", "area": "data_source", "message": "No blocking static performance issues found. Field CWV still requires CrUX/PageSpeed/GSC after deployment."})
    return issues


def score_from_issues(issues: list[dict[str, str]]) -> int:
    score = 95
    for issue in issues:
        if issue["priority"] == "high":
            score -= 12
        elif issue["priority"] == "medium":
            score -= 6
        else:
            score -= 1
    return max(0, min(100, score))


def make_payload() -> dict[str, Any]:
    issues = collect_issues()
    score = score_from_issues(issues)
    budget_payload = [asdict(item) for item in budgets()]
    return {
        "audit_type": "seo-performance",
        "source": "static local scan; no next build, no tests, no PageSpeed API key",
        "generated_at": NOW,
        "url": SITE_URL,
        "score": score,
        "core_web_vitals": {
            "data_source": "static heuristic only",
            "field_data_available": False,
            "lab_data_available": False,
            "lcp": {"value_ms": None, "threshold_ms": 2500, "status": "unmeasured"},
            "inp": {"value_ms": None, "threshold_ms": 200, "status": "unmeasured"},
            "cls": {"value": None, "threshold": 0.1, "status": "unmeasured"},
            "tbt": {"value_ms": None, "status": "unmeasured", "note": "Do not infer INP from TBT."},
        },
        "budgets": budget_payload,
        "assets": {
            "images": public_images(),
            "scripts": {
                "next_script_count": count_pattern(ROOT / "src/components/AdSenseAutoAds.tsx", r"<Script"),
                "adsense_strategy_lazy_onload": 'strategy="lazyOnload"' in (ROOT / "src/components/AdSenseAutoAds.tsx").read_text(encoding="utf-8", errors="ignore"),
                "manual_ads_viewport_gated": "IntersectionObserver" in (ROOT / "src/components/AdSlot.tsx").read_text(encoding="utf-8", errors="ignore"),
            },
            "rendering": {
                "below_fold_content_visibility": "content-visibility: auto" in (ROOT / "src/app/globals.css").read_text(encoding="utf-8", errors="ignore"),
                "homepage_priority_diagram": '<SoilPlanningDiagram title="Raised Bed Soil Calculator" priority' in (ROOT / "src/app/page.tsx").read_text(encoding="utf-8", errors="ignore"),
            },
        },
        "issues": issues,
        "recommendations": [
            "Run PageSpeed Insights on the deployed preview for mobile and desktop field/lab data.",
            "Watch INP after AdSense is enabled because ad scripts can increase main-thread work.",
            "Keep the calculator above the fold but avoid preloading below-fold diagrams or social preview images.",
            "Review CSS growth if future prompt runs add more panels.",
            "Monitor the calculator client chunk in a production bundle analyzer because source bytes are only a static proxy.",
        ],
    }


def write_cache(payload: dict[str, Any]) -> None:
    for slug in ["home", "4x8-raised-bed-soil-calculator", "calculator-template"]:
        cache_dir = ROOT / ".seo-cache" / "pages" / slug
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_payload = {
            "url": "/" if slug == "home" else f"/{slug}" if slug != "calculator-template" else "template",
            "analyzed_at": NOW,
            "core_web_vitals": payload["core_web_vitals"],
            "issues": payload["issues"],
            "score": payload["score"],
            "budgets": payload["budgets"],
            "source": payload["source"],
        }
        (cache_dir / "performance.json").write_text(json.dumps(cache_payload, indent=2) + "\n", encoding="utf-8")

    (ROOT / ".seo-cache" / "performance.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def write_report(payload: dict[str, Any], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "SUMMARY.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    rows = "\n".join(f"| {item['name']} | {item['value']} {item['unit']} | {item['budget']} {item['unit']} | {item['status']} |" for item in payload["budgets"])
    image_rows = "\n".join(f"| `{img['path']}` | {img['kb']} KB | {img['extension']} |" for img in payload["assets"]["images"])
    issue_rows = "\n".join(f"| {issue['priority']} | {issue['area']} | {issue['message']} |" for issue in payload["issues"])
    report = f"""# PERFORMANCE-AUDIT-REPORT.md\n\n## Scope\n\n- Prompt: `seo-performance`\n- Source: {payload['source']}\n- URL target: {payload['url']}\n- Generated: {payload['generated_at']}\n- Build/test policy: no `npm run build`, no tests\n\n## Score\n\nStatic performance score: **{payload['score']} / 100**\n\nThis score is a deterministic local heuristic. It is not field CrUX data and not Lighthouse lab data.\n\n## Core Web Vitals\n\n| Metric | Value | Threshold | Status |\n|---|---:|---:|---|\n| LCP | unmeasured | 2500 ms | unmeasured |\n| INP | unmeasured | 200 ms | unmeasured |\n| CLS | unmeasured | 0.1 | unmeasured |\n\nINP is not inferred from TBT. PageSpeed Insights / CrUX / GSC are required for field data.\n\n## Static Budgets\n\n| Budget | Value | Budget | Status |\n|---|---:|---:|---|\n{rows}\n\n## Public Image Assets\n\n| Asset | Size | Type |\n|---|---:|---|\n{image_rows}\n\n## Issues\n\n| Priority | Area | Message |\n|---|---|---|\n{issue_rows}\n\n## Completed Optimizations\n\n- Changed AdSense Auto Ads from `afterInteractive` to `lazyOnload`.\n- Added viewport-gated manual ad slot initialization with `IntersectionObserver`.\n- Removed homepage priority loading from the below-fold planning diagram.\n- Added `content-visibility: auto` and containment to below-fold support sections.\n- Added `prefers-reduced-motion` guard to reduce animation work for users who request it.\n- Wrote performance cache entries under `.seo-cache/pages/*/performance.json`.\n\n## Limitations\n\n- No production build was run.\n- No Lighthouse trace was produced.\n- No PageSpeed API key was available.\n- Current environment uses Node 22 while the project declares Node 20.x.\n\n## Deployment Validation Checklist\n\n1. Deploy a Vercel Preview.\n2. Run PageSpeed Insights mobile and desktop against `/`, `/4x8-raised-bed-soil-calculator`, and `/soil-bags-calculator`.\n3. Check GSC Core Web Vitals URL groups after data accumulates.\n4. Watch AdSense-enabled INP/TBT and ad layout reservation.\n5. Confirm LCP candidate remains text/hero content, not below-fold imagery.\n"""
    (output_dir / "PERFORMANCE-AUDIT-REPORT.md").write_text(report, encoding="utf-8")


def main() -> None:
    output_dir = Path(os.environ.get("PERFORMANCE_OUTPUT_DIR", "/mnt/data/bedsoil_phase2_performance_output"))
    payload = make_payload()
    write_cache(payload)
    write_report(payload, output_dir)
    print(json.dumps({"score": payload["score"], "issues": len(payload["issues"]), "output_dir": str(output_dir)}, indent=2))


if __name__ == "__main__":
    main()
