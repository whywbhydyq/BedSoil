#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json

from seo_drift_common import history_for_url


def main() -> None:
    parser = argparse.ArgumentParser(description="Show SEO drift baseline history for a URL.")
    parser.add_argument("url")
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()
    print(json.dumps(history_for_url(args.url, args.limit), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
