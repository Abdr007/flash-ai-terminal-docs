import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Flash Terminal',
  titleTemplate: ':title — Flash Terminal',
  description: 'Professional CLI for trading Solana perpetual futures on Flash Trade. Fast, deterministic, production-grade.',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#26d97f' }],
    ['meta', { name: 'og:title', content: 'Flash Terminal — Professional Trading CLI' }],
    ['meta', { name: 'og:description', content: 'Trade Solana perpetual futures from the command line. Fast, deterministic, built for real traders.' }],
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
        text: 'Links',
        items: [
          { text: 'Flash Trade', link: 'https://www.flash.trade/' },
          { text: 'Flash Trade Docs', link: 'https://docs.flash.trade/' },
          { text: 'Pyth Network', link: 'https://pyth.network/' },
          { text: 'Solana', link: 'https://solana.com/' },
        ],
      },
      {
        text: 'GitHub',
        link: 'https://github.com/AustinJ712/flash-terminal',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Get Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' },
          ],
        },
        {
          text: 'Setup',
          collapsed: false,
          items: [
            { text: 'Wallet Setup', link: '/guide/wallet-setup' },
            { text: 'RPC Setup', link: '/guide/rpc-setup' },
            { text: 'Configuration (.env)', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Usage',
          collapsed: false,
          items: [
            { text: 'Commands', link: '/guide/commands' },
            { text: 'Trading Guide', link: '/guide/trading-guide' },
            { text: 'Simulation Mode', link: '/guide/simulation' },
          ],
        },
        {
          text: 'Advanced',
          collapsed: false,
          items: [
            { text: 'Earn & Liquidity', link: '/guide/earn' },
            { text: 'Risk & Safety', link: '/guide/risk-safety' },
            { text: 'Architecture', link: '/guide/architecture' },
          ],
        },
        {
          text: 'Help',
          collapsed: false,
          items: [
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
            { text: 'FAQ', link: '/guide/faq' },
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
            { text: 'Earn & Liquidity', link: '/reference/earn' },
            { text: 'FAF Token', link: '/reference/faf' },
            { text: 'Wallet', link: '/reference/wallet' },
            { text: 'System', link: '/reference/system' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AustinJ712/flash-terminal' },
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    footer: {
      message: 'Flash Terminal \u2014 Professional Trading CLI for Flash Trade on Solana',
      copyright: 'MIT License',
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
