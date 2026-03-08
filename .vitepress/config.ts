import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'FAT Docs',
  titleTemplate: ':title — Flash AI Terminal',
  description: 'Professional CLI trading terminal for the Flash Trade protocol on Solana.',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#26d97f' }],
    ['meta', { name: 'og:title', content: 'Flash AI Terminal — FAT Docs' }],
    ['meta', { name: 'og:description', content: 'Professional CLI trading terminal for the Flash Trade protocol on Solana.' }],
    ['meta', { name: 'og:type', content: 'website' }],
  ],

  cleanUrls: true,
  lastUpdated: true,

  markdown: {
    theme: {
      dark: 'github-dark',
      light: 'github-light',
    },
    lineNumbers: false,
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'FAT Docs',

    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'Reference', link: '/reference/trading-commands', activeMatch: '/reference/' },
      {
        text: 'Ecosystem',
        items: [
          { text: 'Flash Trade', link: 'https://www.flash.trade/' },
          { text: 'Solana', link: 'https://solana.com/' },
          { text: 'Pyth Network', link: 'https://pyth.network/' },
        ],
      },
      {
        text: 'GitHub',
        link: 'https://github.com/Abdr007/flash-ai-terminal',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/getting-started' },
            { text: 'Architecture', link: '/guide/architecture' },
          ],
        },
        {
          text: 'Trading',
          collapsed: false,
          items: [
            { text: 'Trading Commands', link: '/guide/trading-commands' },
            { text: 'Risk Preview System', link: '/guide/risk-preview' },
            { text: 'Simulation Mode', link: '/guide/simulation' },
          ],
        },
        {
          text: 'Analytics & Protocol',
          collapsed: false,
          items: [
            { text: 'Protocol Inspection', link: '/guide/protocol-inspection' },
            { text: 'Market Analytics', link: '/guide/market-analytics' },
          ],
        },
        {
          text: 'Infrastructure',
          collapsed: false,
          items: [
            { text: 'RPC Reliability', link: '/guide/infrastructure' },
            { text: 'Terminal Features', link: '/guide/terminal-features' },
            { text: 'Security & Safety', link: '/guide/security' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Command Reference',
          collapsed: false,
          items: [
            { text: 'Trading Commands', link: '/reference/trading-commands' },
            { text: 'Market Data', link: '/reference/market-data' },
            { text: 'Portfolio & Risk', link: '/reference/portfolio-risk' },
            { text: 'Protocol Inspector', link: '/reference/protocol-inspector' },
            { text: 'Wallet', link: '/reference/wallet' },
            { text: 'System', link: '/reference/system' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Abdr007/flash-ai-terminal' },
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    footer: {
      message: 'FAT — Fast \u2022 Auditable \u2022 Trading',
      copyright: 'MIT License \u2022 Built for the Flash Trade ecosystem',
    },

    editLink: {
      pattern: 'https://github.com/Abdr007/flash-ai-terminal/edit/main/docs-site/:path',
      text: 'Edit this page on GitHub',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    lastUpdated: {
      text: 'Last updated',
    },
  },
})
