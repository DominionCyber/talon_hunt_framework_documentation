import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Talon Hunt Framework",
  description: "Standardized CrowdStrike Falcon saved searches for threat hunting.",
  base: '/talon_hunt_framework_documentation//',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=Oxanium:wght@400;500;600;700&display=swap', rel: 'stylesheet' }]
  ],
  themeConfig: {
    logo: '', 
    // Top Navigation Bar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'FAQs', link: '/faqs' }
    ],
    // Sidebar Navigation
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'About', link: '/about' }
        ]
      },
      {
        text: 'Usage',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'FAQs', link: '/faqs' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DominionCyber/talon_hunt_framework_documentation/' }
    ]
  }
})
