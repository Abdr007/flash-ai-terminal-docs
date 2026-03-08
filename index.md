---
layout: home
hero:
  name: Flash AI Terminal
  text: Professional Trading CLI
  tagline: Execute leveraged trades, inspect protocol state, and analyze markets on Flash Trade — directly from your terminal.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Command Reference
      link: /reference/trading-commands
    - theme: alt
      text: GitHub
      link: https://github.com/Abdr007/flash-ai-terminal

features:
  - icon: "\u26A1"
    title: Deterministic Trading CLI
    details: Trade commands are parsed with structured regex patterns. Every command maps to exactly one action. No ambiguity, no AI inference on critical paths.
    link: /guide/trading-commands
    linkText: Trading docs
  - icon: "\uD83D\uDEE1\uFE0F"
    title: Trade Risk Preview
    details: See estimated entry price, liquidation distance, risk classification, and portfolio exposure impact before signing any transaction.
    link: /guide/risk-preview
    linkText: Risk preview docs
  - icon: "\uD83E\uDDEA"
    title: Simulation Guard
    details: Paper trade with real oracle prices. Compile and simulate transactions on-chain without signing. Validate strategies before risking capital.
    link: /guide/simulation
    linkText: Simulation docs
  - icon: "\uD83D\uDD04"
    title: RPC Failover Infrastructure
    details: Automatic endpoint switching on failure, slot lag, or high latency. Background health monitoring with 60-second cooldown prevents oscillation.
    link: /guide/infrastructure
    linkText: Infrastructure docs
  - icon: "\uD83D\uDD0D"
    title: Protocol Inspection
    details: Query Flash protocol state, pool utilization, open interest distribution, and whale positions directly from the command line.
    link: /guide/protocol-inspection
    linkText: Inspector docs
  - icon: "\uD83D\uDCCA"
    title: Market Analytics Engine
    details: Multi-strategy scanner, volume analysis, OI tracking, leaderboards, and whale activity — all powered by real protocol data from Flash Trade and Pyth.
    link: /guide/market-analytics
    linkText: Analytics docs
---
