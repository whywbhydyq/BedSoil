#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import urllib.parse
import urllib.request


def main() -> None:
    parser = argparse.ArgumentParser(description="Optional PageSpeed Insights CWV fetcher for SEO drift monitoring.")
    parser.add_argument("url")
    parser.add_argument("--strategy", choices=["mobile", "desktop"], default="mobile")
    args = parser.parse_args()

    api_key = os.environ.get("PAGESPEED_API_KEY")
    if not api_key:
        print(json.dumps({
            "lcp": None,
            "inp": None,
            "cls": None,
            "source": "skipped",
            "limitation": "PAGESPEED_API_KEY is not set; CWV comparison rules are skipped.",
        }, indent=2))
        return

    params = urllib.parse.urlencode({
        "url": args.url,
        "strategy": args.strategy,
        "category": "performance",
        "key": api_key,
    })
    endpoint = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?{params}"
    with urllib.request.urlopen(endpoint, timeout=30) as response:
        data = json.loads(response.read().decode("utf-8"))
    loading = data.get("loadingExperience", {}).get("metrics", {})
    lighthouse = data.get("lighthouseResult", {}).get("audits", {})
    result = {
        "lcp": loading.get("LARGEST_CONTENTFUL_PAINT_MS", {}).get("percentile") or lighthouse.get("largest-contentful-paint", {}).get("numericValue"),
        "inp": loading.get("INTERACTION_TO_NEXT_PAINT", {}).get("percentile"),
        "cls": loading.get("CUMULATIVE_LAYOUT_SHIFT_SCORE", {}).get("percentile", None),
        "source": "pagespeed-insights",
        "strategy": args.strategy,
    }
    if result["cls"] is not None and result["cls"] > 1:
        result["cls"] = result["cls"] / 100
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
