import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Talon Hunt Framework",
  description: "Standardized CrowdStrike Falcon saved searches for threat hunting.",
  base: '/talon_hunt_framework_docs/',
  head: [
    // Load Oxanium and Heebo from Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=Oxanium:wght@400;500;600;700&display=swap', rel: 'stylesheet' }]
  ],
  themeConfig: {
    logo: '', // You can add a path to your logo file here later
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Framework Guide', link: '/guide/introduction' },
      { text: 'Falcon Queries', link: '/queries/' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Talon?', link: '/guide/introduction' },
          { text: 'Architecture', link: '/guide/architecture' }
        ]
      },
      {
        text: 'Operations',
        items: [
          { text: 'CI/CD Pipelines', link: '/guide/cicd' },
          { text: 'Detection Engineering', link: '/guide/detection-eng' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DominionCyber/talon_hunt_framework_docs' }
    ]
  }
})
