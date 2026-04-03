#!/bin/bash
# 一键同步 Obsidian 笔记到 Quartz 并部署到 Vercel
# 用法: ./sync.sh

OBSIDIAN_DIR="/Users/lin/Library/Mobile Documents/iCloud~md~obsidian/Documents/投资笔记"
QUARTZ_DIR="/Users/lin/Projects/quartz"
CONTENT_DIR="$QUARTZ_DIR/content"

echo "🔄 开始同步..."

# 1. 清空旧的 content 目录（保留 .gitkeep），然后复制最新笔记
rm -rf "$CONTENT_DIR"
mkdir -p "$CONTENT_DIR"

# 复制笔记，排除 Obsidian 配置和不需要的文件
rsync -av --delete \
  --exclude='.obsidian/' \
  --exclude='.trash/' \
  --exclude='.DS_Store' \
  "$OBSIDIAN_DIR/" "$CONTENT_DIR/"

echo "✅ 笔记已复制到 content/"

# 2. 提交到 git
cd "$QUARTZ_DIR"
git add content/
git add -A

# 检查是否有变更
if git diff --cached --quiet; then
  echo "ℹ️  没有新的变更，无需推送"
  exit 0
fi

git commit -m "同步笔记 $(date '+%Y-%m-%d %H:%M')"

# 3. 推送到 GitHub（Vercel 会自动部署）
git push origin v4

echo "🎉 同步完成！Vercel 将在 1-2 分钟内自动部署"
echo "🌐 访问: https://quartz-hazel.vercel.app"
