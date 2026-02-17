import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid({
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
          { text: 'Naming', link: 'naming' },
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
