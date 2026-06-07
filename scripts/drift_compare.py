#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys

from seo_drift_common import capture_html_state, compare_states, fetch_url, load_baseline, normalize_url, store_comparison, summarize_findings


def get_cwv(url: str, skip_cwv: bool) -> dict | None:
    if skip_cwv:
        return None
    result = subprocess.run([sys.executable, "scripts/pagespeed_check.py", url], text=True, capture_output=True, check=False)
    if result.returncode != 0:
        return {"lcp": None, "inp": None, "cls": None, "source": "error", "limitation": result.stderr.strip()}
    return json.loads(result.stdout)


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare current URL state against the latest SEO drift baseline.")
    parser.add_argument("url")
    parser.add_argument("--baseline-id", type=int)
    parser.add_argument("--skip-cwv", action="store_true")
    args = parser.parse_args()

    url = normalize_url(args.url)
    baseline = load_baseline(url, args.baseline_id)
    if not baseline:
        print(json.dumps({"error": "No baseline exists for URL", "url": url, "next_step": "Run python scripts/drift_baseline.py <url> --skip-cwv first."}, indent=2))
        raise SystemExit(2)

    fetched = fetch_url(url)
    current = capture_html_state(fetched["final_url"], fetched["html"], fetched["status_code"], get_cwv(fetched["final_url"], args.skip_cwv))
    findings = compare_states(baseline, current)
    comparison_id = store_comparison(url, int(baseline["baseline_id"]), findings, current)
    print(json.dumps({
        "comparison_id": comparison_id,
        "baseline_id": baseline["baseline_id"],
        "url": url,
        "summary": summarize_findings(findings),
        "findings": findings,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
