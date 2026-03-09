---
layout: home
hero:
  name: Flash Terminal
  text: Deterministic Protocol Trading Terminal
  tagline: A professional CLI trading workstation for interacting with the Flash Trade protocol on Solana.
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
    title: Deterministic Trading CLI
    details: Trade commands are parsed with structured regex patterns. Every command maps to exactly one action. No ambiguity, no inference on critical execution paths.
    link: /guide/trading-commands
    linkText: Trading docs
  - icon: "\uD83D\uDEE1\uFE0F"
    title: Trade Risk Preview
    details: View estimated entry price, liquidation distance, risk classification, and portfolio exposure impact before signing any transaction.
    link: /guide/risk-preview
    linkText: Risk preview docs
  - icon: "\uD83E\uDDEA"
    title: Simulation Mode
    details: Paper trade with real oracle prices. Compile and simulate transactions on-chain without signing. Validate strategies before committing capital.
    link: /guide/simulation
    linkText: Simulation docs
  - icon: "\uD83D\uDD04"
    title: RPC Failover Infrastructure
    details: Automatic endpoint switching on failure, slot lag detection, and background health monitoring. Connection pinning with 60-second cooldown prevents oscillation.
    link: /guide/infrastructure
    linkText: Infrastructure docs
  - icon: "\uD83D\uDD0D"
    title: Protocol Inspection
    details: Query Flash Trade protocol state, pool utilization, open interest distribution, and whale positions directly from the command line.
    link: /guide/protocol-inspection
    linkText: Inspector docs
  - icon: "\uD83D\uDCCA"
    title: Market Observability
    details: Liquidation clusters, funding rates, liquidity depth, protocol health metrics — all sourced from live on-chain data and protocol analytics.
    link: /guide/market-analytics
    linkText: Analytics docs
---
