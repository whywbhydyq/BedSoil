#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys

from seo_drift_common import capture_html_state, fetch_url, insert_baseline


def get_cwv(url: str, skip_cwv: bool) -> dict | None:
    if skip_cwv:
        return None
    result = subprocess.run([sys.executable, "scripts/pagespeed_check.py", url], text=True, capture_output=True, check=False)
    if result.returncode != 0:
        return {"lcp": None, "inp": None, "cls": None, "source": "error", "limitation": result.stderr.strip()}
    return json.loads(result.stdout)


def main() -> None:
    parser = argparse.ArgumentParser(description="Capture a known-good SEO baseline for a URL.")
    parser.add_argument("url")
    parser.add_argument("--skip-cwv", action="store_true")
    args = parser.parse_args()

    fetched = fetch_url(args.url)
    cwv = get_cwv(fetched["final_url"], args.skip_cwv)
    state = capture_html_state(fetched["final_url"], fetched["html"], fetched["status_code"], cwv)
    baseline_id = insert_baseline(state)
    print(json.dumps({
        "baseline_id": baseline_id,
        "url": state["url"],
        "captured_at": state["captured_at"],
        "summary": {
            "status_code": state["status_code"],
            "title": state["title"],
            "meta_description_length": len(state.get("meta_description") or ""),
            "canonical": state["canonical"],
            "h1_count": len(state.get("h1") or []),
            "schema_types": state.get("schema_types", []),
            "open_graph_keys": sorted((state.get("open_graph") or {}).keys()),
            "cwv_source": (state.get("cwv") or {}).get("source") if state.get("cwv") else "skipped",
        },
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
