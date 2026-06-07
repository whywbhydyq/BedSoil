#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a simple HTML report from drift_compare JSON output.")
    parser.add_argument("comparison_json_file")
    parser.add_argument("--output", default="drift-report.html")
    args = parser.parse_args()
    data = json.loads(Path(args.comparison_json_file).read_text(encoding="utf-8"))
    findings = data.get("findings", [])
    rows = "\n".join(
        f"<tr><td>{html.escape(item.get('severity',''))}</td><td>{html.escape(item.get('rule',''))}</td><td>{html.escape(item.get('message',''))}</td><td>{html.escape(item.get('recommended_action',''))}</td></tr>"
        for item in findings
    ) or "<tr><td colspan='4'>No drift findings.</td></tr>"
    doc = f"""<!doctype html>
<html lang=\"en\"><meta charset=\"utf-8\"><title>SEO Drift Report</title>
<style>body{{font-family:system-ui,sans-serif;margin:2rem;line-height:1.5}}table{{border-collapse:collapse;width:100%}}td,th{{border:1px solid #ddd;padding:.5rem;vertical-align:top}}th{{background:#f5f5f5;text-align:left}}</style>
<h1>SEO Drift Report</h1>
<p><strong>URL:</strong> {html.escape(data.get('url',''))}</p>
<p><strong>Baseline:</strong> {html.escape(str(data.get('baseline_id','')))}</p>
<p><strong>Summary:</strong> {html.escape(json.dumps(data.get('summary', {})))}</p>
<table><thead><tr><th>Severity</th><th>Rule</th><th>Message</th><th>Action</th></tr></thead><tbody>{rows}</tbody></table>
</html>"""
    Path(args.output).write_text(doc, encoding="utf-8")
    print(json.dumps({"output": args.output, "findings": len(findings)}, indent=2))


if __name__ == "__main__":
    main()
