import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Flash Terminal',
  titleTemplate: ':title — Flash Terminal',
  description: 'Deterministic CLI trading interface for Flash Trade on Solana.',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#26d97f' }],
    ['meta', { name: 'og:title', content: 'Flash Terminal — Documentation' }],
    ['meta', { name: 'og:description', content: 'Deterministic CLI trading interface for Flash Trade on Solana.' }],
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
    siteTitle: 'Flash Terminal',

    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'Reference', link: '/reference/trading-commands', activeMatch: '/reference/' },
      {
        text: 'Protocol',
        items: [
          { text: 'Flash Trade', link: 'https://www.flash.trade/' },
          { text: 'Flash Trade Docs', link: 'https://docs.flash.trade/' },
          { text: 'Pyth Network', link: 'https://pyth.network/' },
          { text: 'Solana', link: 'https://solana.com/' },
        ],
      },
      {
        text: 'GitHub',
        link: 'https://github.com/Abdr007/flash-terminal',
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
            { text: 'Trading Guide', link: '/guide/trading-commands' },
            { text: 'Risk & Liquidation', link: '/guide/risk-preview' },
            { text: 'Simulation Mode', link: '/guide/simulation' },
          ],
        },
        {
          text: 'Protocol',
          collapsed: false,
          items: [
            { text: 'Protocol Alignment', link: '/guide/protocol-alignment' },
            { text: 'Protocol Inspection', link: '/guide/protocol-inspection' },
            { text: 'Data Sources', link: '/guide/data-sources' },
          ],
        },
        {
          text: 'Analytics & Monitoring',
          collapsed: false,
          items: [
            { text: 'Market Analytics', link: '/guide/market-analytics' },
            { text: 'Terminal Features', link: '/guide/terminal-features' },
          ],
        },
        {
          text: 'Infrastructure',
          collapsed: false,
          items: [
            { text: 'RPC & Networking', link: '/guide/infrastructure' },
            { text: 'Security Model', link: '/guide/security' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Command Reference',
          collapsed: false,
          items: [
            { text: 'Trading', link: '/reference/trading-commands' },
            { text: 'Market Data', link: '/reference/market-data' },
            { text: 'Portfolio & Risk', link: '/reference/portfolio-risk' },
            { text: 'Protocol', link: '/reference/protocol-inspector' },
            { text: 'Wallet', link: '/reference/wallet' },
            { text: 'System', link: '/reference/system' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Abdr007/flash-terminal' },
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    footer: {
      message: 'Flash Terminal — Deterministic CLI Trading Interface',
      copyright: 'MIT License · Built for the Flash Trade protocol',
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
