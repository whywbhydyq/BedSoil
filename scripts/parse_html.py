#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from seo_drift_common import parse_html


def main() -> None:
    parser = argparse.ArgumentParser(description="Parse SEO-critical elements from HTML.")
    parser.add_argument("html_file", help="Path to HTML file, or - for stdin")
    args = parser.parse_args()
    html = sys.stdin.read() if args.html_file == "-" else Path(args.html_file).read_text(encoding="utf-8", errors="replace")
    print(json.dumps(parse_html(html), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
