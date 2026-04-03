import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, SimpleSlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { Date, getDate } from "./Date"
import { classNames } from "../util/lang"

interface Options {
  limit: number
}

const defaultOptions: Options = {
  limit: 5,
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const FolderGallery: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    // Only show on the index page
    if (fileData.slug !== "index") {
      return null
    }

    // Group files by top-level folder
    const folderMap = new Map<string, QuartzPluginData[]>()

    for (const file of allFiles) {
      const slug = file.slug ?? ""
      // Skip the index page itself and tag pages
      if (slug === "index" || slug.startsWith("tags/")) continue

      const parts = slug.split("/")
      if (parts.length < 2) {
        // Root-level files (not in a folder) — skip or group separately
        continue
      }

      const topFolder = parts[0]
      if (!folderMap.has(topFolder)) {
        folderMap.set(topFolder, [])
      }
      folderMap.get(topFolder)!.push(file)
    }

    // Sort folders alphabetically by display name
    const sortFn = byDateAndAlphabetical(cfg)
    const folders = Array.from(folderMap.entries())
      .map(([folder, files]) => {
        // Sort files by date (most recent first)
        const sorted = files.sort(sortFn)
        // Get display name from folder index if available, otherwise use folder name
        const folderIndex = allFiles.find(
          (f) => f.slug === `${folder}/index` || f.slug === folder,
        )
        const displayName =
          folderIndex?.frontmatter?.title ?? folder.replace(/_/g, " ")
        return {
          folder,
          displayName,
          files: sorted.slice(0, opts.limit),
          totalCount: files.length,
        }
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName, "zh-CN"))

    return (
      <div class={classNames(displayClass, "folder-gallery")}>
        <div class="gallery-grid">
          {folders.map(({ folder, displayName, files, totalCount }) => (
            <div class="gallery-card">
              <div class="card-header">
                <h3>
                  <a
                    href={resolveRelative(fileData.slug!, `${folder}/` as SimpleSlug)}
                    class="internal"
                  >
                    {displayName}
                  </a>
                </h3>
                <span class="card-count">{totalCount} 篇</span>
              </div>
              <ul class="card-list">
                {files.map((file) => {
                  const title =
                    file.frontmatter?.title ?? file.slug?.split("/").pop() ?? ""
                  return (
                    <li>
                      <a
                        href={resolveRelative(fileData.slug!, file.slug!)}
                        class="internal"
                      >
                        {title}
                      </a>
                      {file.dates && (
                        <span class="item-date">
                          <Date date={getDate(cfg, file)!} locale={cfg.locale} />
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
              {totalCount > opts.limit && (
                <a
                  href={resolveRelative(fileData.slug!, `${folder}/` as SimpleSlug)}
                  class="internal see-more"
                >
                  查看全部 →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  FolderGallery.css = `
.folder-gallery {
  margin-top: 1.5rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 800px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}

.gallery-card {
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1.25rem;
  transition: box-shadow 0.2s ease;
}

.gallery-card:hover {
  box-shadow: 0 2px 12px rgba(31, 35, 41, 0.08);
}

.gallery-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--lightgray);
}

.gallery-card .card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.gallery-card .card-header h3 a {
  color: var(--dark);
  text-decoration: none;
}

.gallery-card .card-header h3 a:hover {
  color: var(--secondary);
}

.gallery-card .card-count {
  font-size: 0.75rem;
  color: var(--gray);
  white-space: nowrap;
}

.gallery-card .card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.gallery-card .card-list li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.3rem 0;
  gap: 0.5rem;
  font-size: 13px;
  line-height: 1.5;
}

.gallery-card .card-list li a {
  color: var(--darkgray);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.gallery-card .card-list li a:hover {
  color: var(--secondary);
}

.gallery-card .card-list .item-date {
  font-size: 0.7rem;
  color: var(--gray);
  white-space: nowrap;
  flex-shrink: 0;
}

.gallery-card .see-more {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--secondary);
  text-decoration: none;
}

.gallery-card .see-more:hover {
  opacity: 0.8;
}
`

  return FolderGallery
}) satisfies QuartzComponentConstructor
