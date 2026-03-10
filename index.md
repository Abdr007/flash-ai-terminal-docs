---
layout: home
hero:
  name: Flash Terminal
  text: Deterministic CLI Trading Interface
  tagline: A protocol-aligned command line terminal for analyzing and executing trades on Flash Trade using live on-chain data.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Command Reference
      link: /reference/trading-commands
    - theme: alt
      text: GitHub
      link: https://github.com/Abdr007/flash-terminal

features:
  - icon: "\u26A1"
    title: Protocol-Aligned Trading
    details: All fees, leverage, margins, and liquidation math derived from on-chain CustodyAccount state and Flash SDK helpers. No reimplementation.
    link: /guide/protocol-alignment
    linkText: Protocol alignment
  - icon: "\uD83D\uDEE1\uFE0F"
    title: Risk Preview & Liquidation
    details: View entry price, liquidation distance, fee estimate, and portfolio exposure impact before signing. Uses SDK liquidation formula.
    link: /guide/risk-preview
    linkText: Risk & liquidation
  - icon: "\uD83E\uDDEA"
    title: Simulation Mode
    details: Paper trade with real Pyth Hermes oracle prices. Preview transactions without signing. Fee model matches protocol rates.
    link: /guide/simulation
    linkText: Simulation docs
  - icon: "\uD83D\uDD0D"
    title: Protocol Inspection
    details: Query pool state, open interest, fee rates, and protocol parameters directly from CustodyAccount and PoolConfig.
    link: /guide/protocol-inspection
    linkText: Inspector docs
  - icon: "\uD83D\uDCCA"
    title: Market Analytics
    details: Open interest distribution, whale positions, volume data, and protocol health — sourced from fstats analytics API.
    link: /guide/market-analytics
    linkText: Analytics docs
  - icon: "\uD83D\uDD04"
    title: Infrastructure
    details: Multi-endpoint RPC failover, slot lag detection, state reconciliation, and background health monitoring.
    link: /guide/infrastructure
    linkText: Infrastructure docs
---
