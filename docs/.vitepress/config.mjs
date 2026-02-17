import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

export default defineConfig({
  title: 'Talon Hunt Framework',
  description: 'Standardized CrowdStrike Falcon saved searches for threat hunting.',
  base: '/talon_hunt_framework_documentation/',
  
  // Fixes the build crash caused by dead links in markdown files
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=Oxanium:wght@400;500;600;700&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],

  markdown: {
    config(md) {
      md.use(container, 'query', {
        render(tokens, idx) {
          const token = tokens[idx]

          if (token.nesting === 1) {
            // Supports: ::: query Optional Title
            const title = token.info.trim().slice('query'.length).trim() || 'Query Explanation'
            return `<div class="custom-block query"><p class="custom-block-title">${title}</p>\n`
          }

          return `</div>\n`
        },
      })
    },
  },

  themeConfig: {
    logo: '/dc-long-white.png',
    siteTitle: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'FAQs', link: '/faqs' },
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'FAQs', link: '/faqs' },
        ],
      },
      {
        text: 'THF Basics',
        items: [
          { text: 'Specification', link: '/specification' },
          { text: 'Cradles', link: 'cradles' },
          { text: 'Lookups', link: 'lookups' },
          { text: 'Transforms', link: 'transforms' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DominionCyber/talon_hunt_framework' },
    ],
  },
})
