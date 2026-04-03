#!/usr/bin/env python3
"""
add-permalinks.py
=================
为 Obsidian Publish 的笔记自动添加英文 permalink（拼音）。

使用方法：
  python3 add-permalinks.py

效果：
  - 扫描本 vault 中所有 .md 文件
  - 对没有 permalink 的文件，自动在 frontmatter 中加上英文拼音 permalink
  - 对已有 permalink 的文件跳过（不会覆盖手动设置的 permalink）
  - 中文字符 → 拼音（带连字符），英文/数字保留

依赖：
  pip install pypinyin --break-system-packages

建议用法：
  每次新建笔记后运行一次，或者在发布前运行。
"""

import os
import re
import sys

try:
    from pypinyin import lazy_pinyin, Style
except ImportError:
    print("❌ 缺少依赖：pypinyin")
    print("请先运行：pip install pypinyin --break-system-packages")
    sys.exit(1)

# ── 配置：vault 根目录（默认为脚本所在目录）──────────────────────────
VAULT = os.path.dirname(os.path.abspath(__file__))

# 跳过这些文件夹（Obsidian 系统文件夹）
SKIP_DIRS = {'.obsidian', '.trash', '.git', 'Attachments', '.skills'}

# 如果只想处理新文件（没有 permalink 的），设为 True
# 设为 False 则会强制覆盖所有 permalink
SKIP_EXISTING = True
# ─────────────────────────────────────────────────────────────────────


def to_slug(text: str) -> str:
    """将文本转换为 URL 友好的 slug，中文转拼音。"""
    result = []
    for c in text:
        if '\u4e00' <= c <= '\u9fff':
            pinyin = lazy_pinyin(c, style=Style.NORMAL)
            result.append('\x00' + pinyin[0] + '\x00')
        else:
            result.append(c)
    slug = ''.join(result)
    # 在拼音音节间插入连字符
    slug = re.sub(r'\x00([^\x00]+)\x00', r'-\1-', slug)
    slug = slug.lower()
    slug = re.sub(r'[\s_\.]+', '-', slug)
    slug = re.sub(r'[^a-z0-9\-]', '', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def compute_permalink(vault_root: str, filepath: str) -> str:
    """根据文件路径计算 permalink：父文件夹名/文件名（均转为 slug）。"""
    rel = os.path.relpath(filepath, vault_root)
    parts = rel.split(os.sep)
    file_slug = to_slug(os.path.splitext(parts[-1])[0])
    if len(parts) == 1:
        return file_slug
    folder_slug = to_slug(parts[-2])
    return f"{folder_slug}/{file_slug}"


def add_or_update_permalink(filepath: str, permalink: str, skip_existing: bool) -> str:
    """
    向文件添加/更新 permalink frontmatter。
    返回 'added' | 'updated' | 'skipped'
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if content.startswith('---'):
        end = content.find('\n---', 3)
        if end != -1:
            frontmatter = content[3:end]
            rest = content[end + 4:]
            if 'permalink:' in frontmatter:
                if skip_existing:
                    return 'skipped'
                new_fm = re.sub(r'permalink:.*', f'permalink: {permalink}', frontmatter)
                action = 'updated'
            else:
                new_fm = frontmatter.rstrip('\n') + f'\npermalink: {permalink}\n'
                action = 'added'
            new_content = '---' + new_fm + '---' + rest
        else:
            # 没有闭合的 --- ，在开头插入新 frontmatter
            new_content = f'---\npermalink: {permalink}\n---\n' + content
            action = 'added'
    else:
        new_content = f'---\npermalink: {permalink}\n---\n' + content
        action = 'added'

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return action


def main():
    added = updated = skipped = total = 0

    for root, dirs, files in os.walk(VAULT):
        # 过滤隐藏/系统文件夹
        dirs[:] = [d for d in sorted(dirs) if d not in SKIP_DIRS and not d.startswith('.')]

        for fname in sorted(files):
            if not fname.endswith('.md'):
                continue

            filepath = os.path.join(root, fname)
            permalink = compute_permalink(VAULT, filepath)
            result = add_or_update_permalink(filepath, permalink, SKIP_EXISTING)
            rel = os.path.relpath(filepath, VAULT)
            total += 1

            if result == 'added':
                added += 1
                print(f"  ✓ 新增  {rel}")
                print(f"         → {permalink}")
            elif result == 'updated':
                updated += 1
                print(f"  ↻ 更新  {rel}")
                print(f"         → {permalink}")
            else:
                skipped += 1
                # 静默跳过已有 permalink 的文件

    print(f"\n{'─'*55}")
    print(f"  共处理 {total} 个文件")
    print(f"  新增 permalink: {added} 个")
    print(f"  更新 permalink: {updated} 个")
    print(f"  已有 permalink（跳过）: {skipped} 个")
    print(f"{'─'*55}")
    if added + updated > 0:
        print("  ✅ 完成！在 Obsidian Publish 后链接将变为英文。")
    else:
        print("  ✅ 所有文件已有 permalink，无需更改。")


if __name__ == '__main__':
    main()
