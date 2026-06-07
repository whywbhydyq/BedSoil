#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from seo_drift_common import fetch_url


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch an HTML page with SSRF protection for SEO drift monitoring.")
    parser.add_argument("url")
    parser.add_argument("--output")
    args = parser.parse_args()
    result = fetch_url(args.url)
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(result["html"], encoding="utf-8")
        result = {key: value for key, value in result.items() if key != "html"}
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
