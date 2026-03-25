---
layout: home
hero:
  name: Flash Terminal
  text: Trade Solana Futures from Your Terminal
  tagline: A command-line tool for trading perpetual futures on Flash Trade. Real prices, real execution, real control.
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/Abdr007/flash-terminal

features:
  - icon: "\u26A1"
    title: Fast Setup
    details: Install with one command. Start paper trading in under 2 minutes. No account required for simulation mode.
    link: /guide/quick-start
    linkText: Get started
  - icon: "\uD83D\uDEE1\uFE0F"
    title: Safe by Default
    details: Starts in simulation mode with virtual funds. 10 independent safety layers protect every live trade. You confirm before anything is signed.
    link: /guide/risk-safety
    linkText: Safety systems
  - icon: "\uD83D\uDCCA"
    title: 32+ Markets
    details: Trade crypto, commodities, forex, equities, and meme tokens. All powered by real-time Pyth oracle prices.
    link: /guide/trading-guide
    linkText: Trading guide
  - icon: "\uD83E\uDDEA"
    title: Paper Trading
    details: Practice with real market prices and zero risk. Same commands, same interface — just no real money involved.
    link: /guide/simulation
    linkText: Simulation mode
  - icon: "\uD83D\uDD27"
    title: Production Ready
    details: RPC failover, transaction retry, log rotation, state reconciliation, crash recovery. Built for serious use.
    link: /guide/architecture
    linkText: Architecture
---

<div class="vp-doc" style="padding: 0 24px;">

## Get Started in 30 Seconds

```bash
npm install -g flash-terminal
flash
```

That's it. You'll be prompted to choose simulation or live mode. Pick simulation to practice risk-free.

```
flash [sim] > open 2x long SOL $100
```

[![npm](https://img.shields.io/npm/v/flash-terminal?style=flat-square&label=flash-terminal&color=26d97f)](https://www.npmjs.com/package/flash-terminal)

### Next Steps

- [Quick Start](/guide/quick-start) -- your first trade in 2 minutes
- [Basic Commands](/guide/basic-commands) -- all the commands you need
- [Trading Guide](/guide/trading-guide) -- understand how trading works
- [Wallet Setup](/guide/wallet-setup) -- connect a real wallet for live trading
- [FAQ](/guide/faq) -- common questions answered

</div>
