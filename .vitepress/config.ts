import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Flash Terminal',
  titleTemplate: ':title — Flash Terminal',
  description: 'Deterministic on-chain trading infrastructure for Solana perpetual futures.',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#26d97f' }],
    ['meta', { name: 'og:title', content: 'Flash Terminal — Documentation' }],
    ['meta', { name: 'og:description', content: 'Deterministic on-chain trading infrastructure for Solana perpetual futures.' }],
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
            { text: 'Quick Start', link: '/guide/getting-started' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
          ],
        },
        {
          text: 'Trading',
          collapsed: false,
          items: [
            { text: 'CLI Guide', link: '/guide/cli-guide' },
            { text: 'Trading Guide', link: '/guide/trading-commands' },
            { text: 'Risk & Liquidation', link: '/guide/risk-preview' },
            { text: 'Simulation Mode', link: '/guide/simulation' },
          ],
        },
        {
          text: 'Autonomous Agent',
          collapsed: false,
          items: [
            { text: 'Agent System', link: '/guide/autonomous-agent' },
            { text: 'Strategies', link: '/guide/strategies' },
          ],
        },
        {
          text: 'Architecture & Safety',
          collapsed: false,
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Risk & Safety Systems', link: '/guide/risk-safety' },
            { text: 'Security Model', link: '/guide/security' },
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
          text: 'Infrastructure',
          collapsed: false,
          items: [
            { text: 'RPC & Networking', link: '/guide/infrastructure' },
            { text: 'Market Analytics', link: '/guide/market-analytics' },
            { text: 'Terminal Features', link: '/guide/terminal-features' },
          ],
        },
        {
          text: 'Advanced',
          collapsed: false,
          items: [
            { text: 'Configuration', link: '/guide/advanced' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
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
            { text: 'Agent', link: '/reference/agent' },
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
      message: 'Flash Terminal — Deterministic On-Chain Trading Infrastructure',
      copyright: 'MIT License · Built for the Flash Trade protocol on Solana',
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
