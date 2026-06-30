import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  summary: string
  tags: string[]
  order: number
}

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title ?? 'Untitled',
        url,
        date: normalizeDate(frontmatter.date),
        summary: frontmatter.description ?? excerpt ?? '',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        order: normalizeOrder(frontmatter.order)
      }))
      .sort((a, b) => {
        const orderCompare = b.order - a.order

        if (orderCompare !== 0) return orderCompare

        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  }
})

function normalizeDate(date: unknown) {
  if (date instanceof Date) return date.toISOString().slice(0, 10)
  if (typeof date === 'string') return date

  return ''
}

function normalizeOrder(order: unknown) {
  if (typeof order === 'number') return order
  if (typeof order === 'string') {
    const parsed = Number(order)

    return Number.isNaN(parsed) ? 0 : parsed
  }

  return 0
}
