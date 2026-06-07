#!/usr/bin/env python3
"""Shared helpers for BedSoil SEO drift monitoring.

The scripts in this module intentionally use only Python's standard library so
that drift monitoring can run in CI without adding project dependencies.
"""
from __future__ import annotations

import argparse
import hashlib
import html.parser
import ipaddress
import json
import os
import re
import socket
import sqlite3
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen

DB_PATH = Path(os.environ.get("SEO_DRIFT_DB", "~/.cache/codex-seo/drift/baselines.db")).expanduser()
USER_AGENT = "BedSoil SEO Drift Monitor/1.0 (+https://bedsoil.ymirtool.com)"
BLOCKED_HOSTS = {"metadata.google.internal"}

CWV_THRESHOLDS = {
    "lcp": 2500,
    "inp": 200,
    "cls": 0.1,
}


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def stable_json(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8", errors="ignore")).hexdigest()


def normalize_url(url: str) -> str:
    parsed = urlsplit(url.strip())
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http and https URLs are supported")
    if not parsed.hostname:
        raise ValueError("URL must include a host")

    scheme = parsed.scheme.lower()
    host = parsed.hostname.lower()
    port = parsed.port
    netloc = host
    if port and not ((scheme == "http" and port == 80) or (scheme == "https" and port == 443)):
        netloc = f"{host}:{port}"

    filtered_query = [
        (key, value)
        for key, value in parse_qsl(parsed.query, keep_blank_values=True)
        if not key.lower().startswith("utm_") and key.lower() not in {"gclid", "fbclid"}
    ]
    query = urlencode(sorted(filtered_query), doseq=True)
    path = parsed.path or "/"
    if path != "/":
        path = path.rstrip("/")
    return urlunsplit((scheme, netloc, path, query, ""))


def _ip_is_blocked(ip: str) -> bool:
    address = ipaddress.ip_address(ip)
    return bool(
        address.is_private
        or address.is_loopback
        or address.is_link_local
        or address.is_multicast
        or address.is_reserved
        or address.is_unspecified
    )


def validate_url(url: str) -> str:
    normalized = normalize_url(url)
    parsed = urlsplit(normalized)
    host = parsed.hostname or ""
    if host in BLOCKED_HOSTS:
        raise ValueError(f"Blocked host: {host}")

    try:
        infos = socket.getaddrinfo(host, parsed.port or (443 if parsed.scheme == "https" else 80), type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise ValueError(f"Could not resolve host {host}: {exc}") from exc

    blocked = []
    for info in infos:
        ip = info[4][0]
        if _ip_is_blocked(ip):
            blocked.append(ip)
    if blocked:
        raise ValueError(f"SSRF protection blocked private/reserved IP(s) for {host}: {', '.join(sorted(set(blocked)))}")
    return normalized


def fetch_url(url: str, timeout: int = 20) -> dict[str, Any]:
    normalized = validate_url(url)
    request = Request(normalized, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"})
    with urlopen(request, timeout=timeout) as response:
        raw = response.read(2_000_000)
        charset = response.headers.get_content_charset() or "utf-8"
        html = raw.decode(charset, errors="replace")
        return {
            "url": normalized,
            "final_url": normalize_url(response.geturl()),
            "status_code": response.getcode(),
            "headers": dict(response.headers.items()),
            "html": html,
            "fetched_at": utc_now(),
        }


class SeoHtmlParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.meta_description = ""
        self.meta_robots = ""
        self.canonical = ""
        self.open_graph: dict[str, str] = {}
        self.twitter: dict[str, str] = {}
        self.schema: list[Any] = []
        self.h1: list[str] = []
        self.h2: list[str] = []
        self.h3: list[str] = []
        self._tag_stack: list[str] = []
        self._buffer: list[str] = []
        self._in_json_ld = False
        self._json_ld_buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = {key.lower(): (value or "") for key, value in attrs}
        tag = tag.lower()
        self._tag_stack.append(tag)
        if tag in {"title", "h1", "h2", "h3"}:
            self._buffer = []
        if tag == "meta":
            name = attrs_dict.get("name", "").lower()
            prop = attrs_dict.get("property", "").lower()
            content = attrs_dict.get("content", "").strip()
            if name == "description":
                self.meta_description = content
            elif name == "robots":
                self.meta_robots = content
            elif prop.startswith("og:"):
                self.open_graph[prop] = content
            elif name.startswith("twitter:"):
                self.twitter[name] = content
        elif tag == "link":
            if attrs_dict.get("rel", "").lower() == "canonical":
                self.canonical = attrs_dict.get("href", "").strip()
        elif tag == "script" and attrs_dict.get("type", "").lower() == "application/ld+json":
            self._in_json_ld = True
            self._json_ld_buffer = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        text = " ".join("".join(self._buffer).split())
        if tag == "title" and text:
            self.title = text
        elif tag == "h1" and text:
            self.h1.append(text)
        elif tag == "h2" and text:
            self.h2.append(text)
        elif tag == "h3" and text:
            self.h3.append(text)
        elif tag == "script" and self._in_json_ld:
            raw = "".join(self._json_ld_buffer).strip()
            if raw:
                try:
                    parsed = json.loads(raw)
                    if isinstance(parsed, list):
                        self.schema.extend(parsed)
                    else:
                        self.schema.append(parsed)
                except json.JSONDecodeError:
                    self.schema.append({"parse_error": True, "raw_hash": sha256_text(raw)})
            self._in_json_ld = False
            self._json_ld_buffer = []
        if self._tag_stack:
            self._tag_stack.pop()
        self._buffer = []

    def handle_data(self, data: str) -> None:
        if self._in_json_ld:
            self._json_ld_buffer.append(data)
        elif self._tag_stack and self._tag_stack[-1] in {"title", "h1", "h2", "h3"}:
            self._buffer.append(data)


def parse_html(html: str) -> dict[str, Any]:
    parser = SeoHtmlParser()
    parser.feed(html)
    schema_types: list[str] = []
    for item in parser.schema:
        if isinstance(item, dict):
            if "@graph" in item and isinstance(item["@graph"], list):
                for graph_item in item["@graph"]:
                    if isinstance(graph_item, dict) and graph_item.get("@type"):
                        schema_types.append(str(graph_item["@type"]))
            elif item.get("@type"):
                schema_types.append(str(item["@type"]))
    return {
        "title": parser.title,
        "meta_description": parser.meta_description,
        "canonical": parser.canonical,
        "meta_robots": parser.meta_robots,
        "h1": parser.h1,
        "h2": parser.h2,
        "h3": parser.h3,
        "schema": parser.schema,
        "schema_types": sorted(set(schema_types)),
        "open_graph": parser.open_graph,
        "twitter": parser.twitter,
        "schema_hash": sha256_text(stable_json(parser.schema)),
    }


def capture_html_state(url: str, html: str, status_code: int | None = None, cwv: dict[str, Any] | None = None) -> dict[str, Any]:
    parsed = parse_html(html)
    parsed.update(
        {
            "url": normalize_url(url),
            "captured_at": utc_now(),
            "status_code": status_code,
            "html_hash": sha256_text(re.sub(r"\s+", " ", html).strip()),
            "cwv": cwv,
        }
    )
    return parsed


def ensure_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS baselines (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT NOT NULL,
          captured_at TEXT NOT NULL,
          title TEXT,
          meta_description TEXT,
          canonical TEXT,
          meta_robots TEXT,
          h1_json TEXT,
          h2_json TEXT,
          h3_json TEXT,
          schema_json TEXT,
          schema_hash TEXT,
          open_graph_json TEXT,
          twitter_json TEXT,
          cwv_json TEXT,
          status_code INTEGER,
          html_hash TEXT,
          state_json TEXT NOT NULL
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS comparisons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT NOT NULL,
          compared_at TEXT NOT NULL,
          baseline_id INTEGER NOT NULL,
          critical_count INTEGER NOT NULL,
          warning_count INTEGER NOT NULL,
          info_count INTEGER NOT NULL,
          findings_json TEXT NOT NULL,
          current_state_json TEXT NOT NULL,
          FOREIGN KEY(baseline_id) REFERENCES baselines(id)
        )
        """
    )
    connection.commit()
    return connection


def insert_baseline(state: dict[str, Any]) -> int:
    connection = ensure_db()
    cursor = connection.execute(
        """
        INSERT INTO baselines (
          url, captured_at, title, meta_description, canonical, meta_robots,
          h1_json, h2_json, h3_json, schema_json, schema_hash, open_graph_json,
          twitter_json, cwv_json, status_code, html_hash, state_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            state["url"],
            state["captured_at"],
            state.get("title"),
            state.get("meta_description"),
            state.get("canonical"),
            state.get("meta_robots"),
            stable_json(state.get("h1", [])),
            stable_json(state.get("h2", [])),
            stable_json(state.get("h3", [])),
            stable_json(state.get("schema", [])),
            state.get("schema_hash"),
            stable_json(state.get("open_graph", {})),
            stable_json(state.get("twitter", {})),
            stable_json(state.get("cwv")),
            state.get("status_code"),
            state.get("html_hash"),
            stable_json(state),
        ),
    )
    connection.commit()
    return int(cursor.lastrowid)


def load_baseline(url: str, baseline_id: int | None = None) -> dict[str, Any] | None:
    connection = ensure_db()
    if baseline_id is not None:
        row = connection.execute("SELECT id, state_json FROM baselines WHERE id = ?", (baseline_id,)).fetchone()
    else:
        row = connection.execute(
            "SELECT id, state_json FROM baselines WHERE url = ? ORDER BY captured_at DESC, id DESC LIMIT 1",
            (normalize_url(url),),
        ).fetchone()
    if not row:
        return None
    state = json.loads(row[1])
    state["baseline_id"] = row[0]
    return state


def store_comparison(url: str, baseline_id: int, findings: list[dict[str, Any]], current_state: dict[str, Any]) -> int:
    connection = ensure_db()
    counts = {
        "CRITICAL": sum(1 for f in findings if f["severity"] == "CRITICAL"),
        "WARNING": sum(1 for f in findings if f["severity"] == "WARNING"),
        "INFO": sum(1 for f in findings if f["severity"] == "INFO"),
    }
    cursor = connection.execute(
        """
        INSERT INTO comparisons (
          url, compared_at, baseline_id, critical_count, warning_count, info_count,
          findings_json, current_state_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            normalize_url(url),
            utc_now(),
            baseline_id,
            counts["CRITICAL"],
            counts["WARNING"],
            counts["INFO"],
            stable_json(findings),
            stable_json(current_state),
        ),
    )
    connection.commit()
    return int(cursor.lastrowid)


def ratio_delta(old: str, new: str) -> float:
    old_words = set(re.findall(r"[a-z0-9]+", (old or "").lower()))
    new_words = set(re.findall(r"[a-z0-9]+", (new or "").lower()))
    if not old_words and not new_words:
        return 0.0
    if not old_words or not new_words:
        return 1.0
    return 1.0 - (len(old_words & new_words) / len(old_words | new_words))


def add_finding(findings: list[dict[str, Any]], rule: str, severity: str, message: str, old: Any = None, new: Any = None, action: str = "") -> None:
    findings.append({
        "rule": rule,
        "severity": severity,
        "message": message,
        "old": old,
        "new": new,
        "recommended_action": action,
    })


def compare_states(old: dict[str, Any], new: dict[str, Any]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []

    old_status = old.get("status_code")
    new_status = new.get("status_code")
    if old_status != new_status:
        severity = "CRITICAL" if new_status and int(new_status) >= 400 else "WARNING"
        add_finding(findings, "status-code-changed", severity, "HTTP status changed.", old_status, new_status, "Run seo-technical and verify routing/deployment.")

    old_robots = (old.get("meta_robots") or "").lower()
    new_robots = (new.get("meta_robots") or "").lower()
    if "noindex" not in old_robots and "noindex" in new_robots:
        add_finding(findings, "noindex-added", "CRITICAL", "Meta robots gained noindex.", old.get("meta_robots"), new.get("meta_robots"), "Remove accidental noindex or run seo-technical.")
    elif old.get("meta_robots") != new.get("meta_robots"):
        add_finding(findings, "robots-changed", "WARNING", "Meta robots directives changed.", old.get("meta_robots"), new.get("meta_robots"), "Confirm the indexing change is intentional.")

    if old.get("canonical") and not new.get("canonical"):
        add_finding(findings, "canonical-removed", "CRITICAL", "Canonical URL was removed.", old.get("canonical"), new.get("canonical"), "Restore canonical or run seo-technical.")
    elif old.get("canonical") != new.get("canonical"):
        old_host = urlsplit(old.get("canonical") or "").hostname
        new_host = urlsplit(new.get("canonical") or "").hostname
        severity = "CRITICAL" if old_host and new_host and old_host != new_host else "WARNING"
        add_finding(findings, "canonical-changed", severity, "Canonical URL changed.", old.get("canonical"), new.get("canonical"), "Verify canonical target and sitemap consistency.")

    if not new.get("title"):
        add_finding(findings, "title-missing", "CRITICAL", "Title tag is missing.", old.get("title"), new.get("title"), "Run seo-page and restore a unique title.")
    elif old.get("title") != new.get("title"):
        severity = "WARNING" if ratio_delta(old.get("title", ""), new.get("title", "")) > 0.35 else "INFO"
        add_finding(findings, "title-changed", severity, "Title tag changed.", old.get("title"), new.get("title"), "Confirm SERP title intent and CTR target.")
    if new.get("title") and not 35 <= len(new["title"]) <= 65:
        add_finding(findings, "title-length-out-of-range", "WARNING", "Title length is outside the recommended guardrail.", None, len(new["title"]), "Run seo-page.")

    if old.get("meta_description") and not new.get("meta_description"):
        add_finding(findings, "meta-description-removed", "WARNING", "Meta description was removed.", old.get("meta_description"), new.get("meta_description"), "Run seo-page.")
    elif old.get("meta_description") != new.get("meta_description"):
        severity = "WARNING" if ratio_delta(old.get("meta_description", ""), new.get("meta_description", "")) > 0.45 else "INFO"
        add_finding(findings, "meta-description-changed", severity, "Meta description changed.", old.get("meta_description"), new.get("meta_description"), "Confirm the snippet still matches user intent.")
    if new.get("meta_description") and not 120 <= len(new["meta_description"]) <= 170:
        add_finding(findings, "meta-description-length-out-of-range", "INFO", "Meta description length moved outside the guardrail.", None, len(new["meta_description"]), "Review with seo-page.")

    if old.get("h1") and not new.get("h1"):
        add_finding(findings, "h1-removed", "WARNING", "All H1 headings were removed.", old.get("h1"), new.get("h1"), "Run seo-content.")
    elif old.get("h1") != new.get("h1"):
        add_finding(findings, "h1-changed", "WARNING", "H1 headings changed.", old.get("h1"), new.get("h1"), "Confirm page intent did not drift.")
    if len(new.get("h1") or []) > 1:
        add_finding(findings, "multiple-h1", "INFO", "Multiple H1 headings detected.", None, new.get("h1"), "Review heading hierarchy.")

    if old.get("schema") and not new.get("schema"):
        add_finding(findings, "schema-removed", "CRITICAL", "All JSON-LD schema was removed.", old.get("schema_types"), new.get("schema_types"), "Run seo-schema.")
    elif old.get("schema_hash") != new.get("schema_hash"):
        severity = "WARNING" if set(old.get("schema_types", [])) != set(new.get("schema_types", [])) else "INFO"
        add_finding(findings, "schema-changed", severity, "JSON-LD schema changed.", old.get("schema_types"), new.get("schema_types"), "Validate in Rich Results Test after deployment.")

    old_og = old.get("open_graph") or {}
    new_og = new.get("open_graph") or {}
    for key in ["og:title", "og:description", "og:image"]:
        if old_og.get(key) and not new_og.get(key):
            add_finding(findings, f"{key}-removed", "WARNING", f"Open Graph {key} was removed.", old_og.get(key), new_og.get(key), "Run seo-page/images.")
        elif old_og.get(key) != new_og.get(key):
            add_finding(findings, f"{key}-changed", "INFO", f"Open Graph {key} changed.", old_og.get(key), new_og.get(key), "Verify social preview intent.")

    old_hash = old.get("html_hash")
    new_hash = new.get("html_hash")
    if old_hash and new_hash and old_hash != new_hash:
        add_finding(findings, "html-content-hash-changed", "INFO", "HTML body hash changed.", old_hash, new_hash, "Review if this was an expected deployment.")

    old_cwv = old.get("cwv") or {}
    new_cwv = new.get("cwv") or {}
    for metric, threshold in CWV_THRESHOLDS.items():
        old_value = old_cwv.get(metric)
        new_value = new_cwv.get(metric)
        if old_value is None or new_value is None:
            continue
        if metric == "cls":
            regressed = float(new_value) > threshold and float(new_value) > float(old_value)
        else:
            regressed = float(new_value) > threshold and float(new_value) > float(old_value)
        if regressed:
            add_finding(findings, f"cwv-{metric}-regressed", "WARNING", f"Core Web Vital {metric.upper()} regressed past the good threshold.", old_value, new_value, "Run seo-performance with field data.")

    return findings


def summarize_findings(findings: list[dict[str, Any]]) -> dict[str, int]:
    return {
        "critical": sum(1 for item in findings if item["severity"] == "CRITICAL"),
        "warning": sum(1 for item in findings if item["severity"] == "WARNING"),
        "info": sum(1 for item in findings if item["severity"] == "INFO"),
    }


def history_for_url(url: str, limit: int = 10) -> list[dict[str, Any]]:
    connection = ensure_db()
    rows = connection.execute(
        "SELECT id, captured_at, title, canonical, status_code, html_hash FROM baselines WHERE url = ? ORDER BY captured_at DESC, id DESC LIMIT ?",
        (normalize_url(url), limit),
    ).fetchall()
    return [
        {
            "baseline_id": row[0],
            "captured_at": row[1],
            "title": row[2],
            "canonical": row[3],
            "status_code": row[4],
            "html_hash": row[5],
        }
        for row in rows
    ]


def load_json_file(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
