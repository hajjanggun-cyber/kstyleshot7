import os
import re
import sys

ROOT = os.path.join("content", "hub")
PATTERNS = [
    # mid CTA: single-line inner
    re.compile(
        r'\n?\n<div className="ha-mid-cta">\s*\n\s*<a [^>]*className="ha-mid-cta-link"[^>]*>[^<]*</a>\s*\n</div>\n',
        re.DOTALL,
    ),
    # bottom banner: multi-line with <a><img/></a>
    re.compile(
        r'\n?\n<div className="ha-bottom-banner">\s*\n\s*<a [^>]*>\s*\n\s*<img [^>]*/>\s*\n\s*</a>\s*\n</div>\n',
        re.DOTALL,
    ),
]

changed = 0
skipped = 0
errors = []

for lang in ("ko", "en"):
    d = os.path.join(ROOT, lang)
    if not os.path.isdir(d):
        continue
    for name in sorted(os.listdir(d)):
        if not name.endswith(".mdx"):
            continue
        p = os.path.join(d, name)
        with open(p, "rb") as f:
            raw = f.read()
        # detect BOM + line ending
        has_bom = raw.startswith(b"\xef\xbb\xbf")
        body = raw[3:] if has_bom else raw
        try:
            text = body.decode("utf-8")
        except UnicodeDecodeError as e:
            errors.append((p, str(e)))
            continue
        uses_crlf = "\r\n" in text
        if uses_crlf:
            text_lf = text.replace("\r\n", "\n")
        else:
            text_lf = text
        original = text_lf
        for pat in PATTERNS:
            text_lf = pat.sub("\n", text_lf)
        if text_lf == original:
            skipped += 1
            continue
        out = text_lf.replace("\n", "\r\n") if uses_crlf else text_lf
        out_bytes = out.encode("utf-8")
        if has_bom:
            out_bytes = b"\xef\xbb\xbf" + out_bytes
        with open(p, "wb") as f:
            f.write(out_bytes)
        changed += 1
        print(f"CLEAN {lang}/{name}")

print()
print(f"changed={changed} skipped={skipped} errors={len(errors)}")
for p, e in errors:
    print(f"ERR {p}: {e}")

# Sanity check: grep remaining occurrences
remain = 0
for lang in ("ko", "en"):
    d = os.path.join(ROOT, lang)
    if not os.path.isdir(d):
        continue
    for name in sorted(os.listdir(d)):
        if not name.endswith(".mdx"):
            continue
        p = os.path.join(d, name)
        with open(p, "rb") as f:
            raw = f.read()
        if b"ha-mid-cta" in raw or b"ha-bottom-banner" in raw:
            remain += 1
            print(f"STILL HAS: {lang}/{name}")
print(f"remaining_files={remain}")
