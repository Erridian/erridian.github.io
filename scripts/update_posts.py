#!/usr/bin/env python3
"""
Автоматический генератор posts/index.json из Markdown-файлов в папке posts/.
Поддерживает YAML Frontmatter из Obsidian (без сторонних зависимостей).
"""

import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "posts"
INDEX_FILE = POSTS_DIR / "index.json"

IGNORE_FILES = {"404.md", "post1.md", "2022-03-11-my-post.md"}


def parse_frontmatter(text: str):
    """Извлекает YAML frontmatter и тело статьи."""
    match = re.match(r"^---\s*\r?\n(.*?)\r?\n---\s*\r?\n?(.*)$", text, re.S)
    if not match:
        return {}, text

    raw_yaml, body = match.group(1), match.group(2)
    meta = {}
    current_list_key = None

    for line in raw_yaml.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        # Элемент списка YAML: "  - tag"
        if stripped.startswith("- ") and current_list_key:
            val = stripped[2:].strip().strip('"').strip("'")
            if val:
                meta[current_list_key].append(val)
            continue

        current_list_key = None
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()

            # Пустое значение -> возможно дальше идёт список
            if val == "":
                meta[key] = []
                current_list_key = key
            elif val.startswith("[") and val.endswith("]"):
                items = [x.strip().strip('"').strip("'") for x in val[1:-1].split(",")]
                meta[key] = [x for x in items if x]
            elif val.lower() in ("true", "false"):
                meta[key] = val.lower() == "true"
            else:
                meta[key] = val.strip('"').strip("'")

    return meta, body


def extract_excerpt(body: str, max_len: int = 160) -> str:
    """Берёт первый содержательный абзац текста, если excerpt не задан."""
    for line in body.splitlines():
        clean = line.strip()
        if not clean or clean.startswith("#") or clean.startswith("```") or clean.startswith(">"):
            continue
        clean = re.sub(r"[*_`\[\]]", "", clean)
        if len(clean) > max_len:
            return clean[: max_len - 3].rstrip() + "..."
        return clean
    return ""


def main():
    posts = []
    for md_path in sorted(POSTS_DIR.glob("*.md")):
        if md_path.name.startswith("_") or md_path.name in IGNORE_FILES:
            continue

        content = md_path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(content)

        # Пропускаем черновики (publish: false)
        if meta.get("publish") is False:
            continue

        slug = meta.get("slug") or md_path.stem
        # Пропускаем старые Jekyll-посты без заголовка и даты, если это не наш формат
        title = meta.get("title")
        if not title:
            h1 = re.search(r"^#\s+(.+)$", body, re.M)
            title = h1.group(1).strip() if h1 else md_path.stem

        date_str = str(meta.get("date") or "2026-01-01")[:10]
        category = meta.get("category") or "diary"
        tags = meta.get("tags") if isinstance(meta.get("tags"), list) else []
        excerpt = meta.get("excerpt") or extract_excerpt(body)

        entry = {
            "slug": slug,
            "title": title,
            "date": date_str,
            "category": category,
            "tags": tags,
            "file": f"posts/{md_path.name}",
            "excerpt": excerpt,
        }

        if meta.get("rating"):
            entry["rating"] = str(meta["rating"])
        if meta.get("status"):
            entry["status"] = str(meta["status"])
        if meta.get("cover"):
            entry["cover"] = str(meta["cover"])

        posts.append(entry)

    # Сортируем от самых свежих к старым
    posts.sort(key=lambda p: p["date"], reverse=True)

    INDEX_FILE.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {INDEX_FILE} with {len(posts)} post(s).")


if __name__ == "__main__":
    main()
