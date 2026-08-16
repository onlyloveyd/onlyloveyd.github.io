import { defineConfig } from 'vitepress'

const SITE = 'https://onlyloveyd.github.io/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'OhCode',
  description: '把想法做成作品：Focus 与更多开源项目、文章。',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { property: 'og:site_name', content: 'OhCode' }],
    ['meta', { property: 'og:title', content: 'OhCode · 作品集' }],
    ['meta', { property: 'og:description', content: '把想法做成作品：Focus 与更多开源项目、文章。' }],
    ['meta', { property: 'og:image', content: SITE + 'images/focus-fierce.png' }],
    ['meta', { property: 'og:url', content: SITE }],
  ],
  themeConfig: {
    nav: [
      { text: '作品', link: '/#作品' },
      { text: '文章', link: '/articles/' },
      { text: 'GitHub', link: 'https://github.com/onlyloveyd' },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/onlyloveyd' }],
    search: {
      provider: 'local',
      options: { translations: { button: { buttonText: '搜索文章', buttonAriaLabel: '搜索' } } },
    },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
  },
})
