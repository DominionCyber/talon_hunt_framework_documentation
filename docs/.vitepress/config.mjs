import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid({
  title: 'Talon Hunt Framework',
  description: 'Standardized CrowdStrike Falcon saved searches for threat hunting.',
  base: '/talon_hunt_framework_documentation/',

  // Fixes the build crash caused by dead links in markdown files
  ignoreDeadLinks: true,
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: '/talon_hunt_framework_documentation/favicon.ico' }],
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
        text: 'Quick Start',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'FAQs', link: '/faqs' },
        ],
      },
      {
        text: 'Talon Query Manager',
        items: [
          { text: 'Overview', link: '/tqm-overview' },
          { text: 'Prerequisites', link: '/tqm-prerequisites' },
          { text: 'Specification', link: '/tqm-specification' },          
        ],
      },
      {
        text: 'Talon Hunt Framework',
        items: [
          { text: 'Overview', link: '/thf-overview' },
          { text: 'Specification', link: '/thf-specification' },
          { text: 'Naming', link: '/thf-naming' },
          { text: 'Usage', link: '/usage' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DominionCyber/talon_hunt_framework' },
    ],
  },
})
