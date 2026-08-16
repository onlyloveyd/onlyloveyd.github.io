import { createContentLoader } from 'vitepress'

export default createContentLoader('articles/*.md', {
  transform(raw) {
    return raw
      .filter((p) => !p.url.endsWith('/articles/') && !p.frontmatter.draft)
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map((p) => ({
        title: p.frontmatter.title as string,
        url: p.url,
        date: p.frontmatter.date as string,
        description: p.frontmatter.description as string,
      }))
  },
})
