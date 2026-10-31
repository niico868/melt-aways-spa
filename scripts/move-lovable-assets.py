#!/usr/bin/env python3
"""Copy every image/audio file the site keeps on Lovable's servers into this repo.

Each src/assets/**/*.media.json points at a file served from Lovable at
/__l5e/assets-v1/<id>/<name>. That path only exists on Lovable hosting, so on
Cloudflare those images break. This script downloads each file from the live
Lovable site into public/media/<id>/<name> (served by Cloudflare as a static
file) and rewrites the "url" in the .asset.json to the new path. No page code
changes are needed because the pages only read `.url`.

Usage: python3 scripts/move-lovable-assets.py [https://meltawaysspa.com]
Safe to re-run: files already moved are skipped.
"""
import glob
import json
import os
import sys
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://meltawaysspa.com").rstrip("/")
MAX_BYTES = 25 * 1024 * 1024  # Cloudflare's per-file limit for static assets
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

moved, skipped, failed = [], [], []

for path in sorted(glob.glob(os.path.join(ROOT, "src/assets/**/*.media.json"), recursive=True)):
    with open(path) as f:
        meta = json.load(f)
    url = meta["url"]
    rel = os.path.relpath(path, ROOT)
    if not url.startswith("/__l5e/"):
        continue  # already moved
    if meta.get("size", 0) > MAX_BYTES:
        skipped.append(f"{rel} ({meta['size'] // 1_000_000} MB, over Cloudflare's 25 MB limit)")
        continue

    asset_id, name = meta["asset_id"], url.rsplit("/", 1)[1]
    new_url = f"/media/{asset_id}/{name}"
    dest = os.path.join(ROOT, "public", new_url.lstrip("/"))
    os.makedirs(os.path.dirname(dest), exist_ok=True)

    try:
        req = urllib.request.Request(BASE + url, headers={"User-Agent": "melt-aways-asset-move"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
            ctype = resp.headers.get("content-type", "")
        if "text/html" in ctype or len(data) < 200:
            raise ValueError(f"got {ctype or 'unknown type'}, {len(data)} bytes instead of the file")
    except Exception as e:  # noqa: BLE001
        failed.append(f"{rel}: {e}")
        continue

    with open(dest, "wb") as f:
        f.write(data)
    meta["url"] = new_url
    with open(path, "w") as f:
        json.dump(meta, f, indent=2)
        f.write("\n")
    moved.append(f"{rel} -> {new_url} ({len(data) // 1000} KB)")

print(f"Moved {len(moved)} files")
for line in moved:
    print("  ", line)
if skipped:
    print(f"Skipped {len(skipped)} (too big):")
    for line in skipped:
        print("  ", line)
if failed:
    print(f"FAILED {len(failed)}:")
    for line in failed:
        print("  ", line)
    sys.exit(1)
