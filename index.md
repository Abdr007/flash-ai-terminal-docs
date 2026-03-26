---
layout: home
hero:
  name: Flash Terminal
  text: Professional Trading CLI
  tagline: Trade Solana perpetual futures from the command line. Fast. Deterministic. Built for real traders.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View Commands
      link: /guide/commands

features:
  - icon: "\u26A1"
    title: Instant Execution
    details: Deterministic command parser with zero ambiguity. Every command maps to exactly one action. No AI in the execution path.
    link: /guide/commands
    linkText: All commands
  - icon: "\uD83D\uDEE1\uFE0F"
    title: 10-Layer Safety
    details: Signing guard, rate limiter, circuit breaker, kill switch, exposure control, pre-flight simulation, program whitelist, instruction freeze, duplicate detection, trade mutex.
    link: /guide/risk-safety
    linkText: Safety systems
  - icon: "\uD83D\uDCCA"
    title: 32+ Markets
    details: Crypto, equities, commodities, forex, governance, and memecoins. All powered by real-time Pyth oracle prices with staleness and confidence checks.
    link: /guide/trading-guide
    linkText: Trading guide
  - icon: "\uD83E\uDDEA"
    title: Paper Trading
    details: Simulation mode with real Pyth prices and zero risk. Same commands, same interface. No wallet required. Enabled by default.
    link: /guide/simulation
    linkText: Simulation mode
  - icon: "\uD83D\uDCB0"
    title: Earn & Liquidity
    details: Provide liquidity, stake FLP/FAF tokens, claim rewards, analyze yield. Full DeFi toolkit from your terminal.
    link: /guide/earn
    linkText: Earn guide
  - icon: "\uD83D\uDD27"
    title: Production Infrastructure
    details: Multi-RPC failover with slot lag detection, dynamic compute units, transaction retry, log rotation, state reconciliation.
    link: /guide/architecture
    linkText: Architecture
---

<div class="vp-doc" style="padding: 0 24px;">

<div class="terminal-preview">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
    </div>
    <span class="terminal-title">flash-terminal v1.2.2</span>
  </div>
  <div class="terminal-body">
    <div><span class="prompt">flash [sim] &gt;</span> <span class="command">open 5x long SOL $500</span></div>
    <div>&nbsp;</div>
    <div><span class="output">  Market:     </span><span class="command">SOL/USD LONG</span></div>
    <div><span class="output">  Leverage:   </span><span class="command">5x</span></div>
    <div><span class="output">  Collateral: </span><span class="price">$500.00</span></div>
    <div><span class="output">  Size:       </span><span class="price">$2,500.00</span></div>
    <div><span class="output">  Entry:      </span><span class="price">$148.52</span></div>
    <div><span class="output">  Est. Fee:   </span><span class="output">$2.00</span></div>
    <div><span class="output">  Liq Price:  </span><span class="output">$121.39</span></div>
    <div>&nbsp;</div>
    <div><span class="success">  ✓ Position opened successfully</span></div>
    <div>&nbsp;</div>
    <div><span class="prompt">flash [sim] &gt;</span> <span class="command">positions</span></div>
    <div>&nbsp;</div>
    <div><span class="output">  SOL  LONG  5x  $2,500  $148.52  </span><span class="success">+$12.40 (+2.48%)</span></div>
  </div>
</div>

## Quick Install

```bash
npm install -g flash-terminal
flash
```

Start paper trading immediately. No wallet. No config. No account.

### Next Steps

| Step | Link |
|:-----|:-----|
| First trade in 2 minutes | [Quick Start](/guide/quick-start) |
| Learn all commands | [Commands](/guide/commands) |
| Understand leverage & PnL | [Trading Guide](/guide/trading-guide) |
| Set up a real wallet | [Wallet Setup](/guide/wallet-setup) |
| Configure your environment | [Configuration](/guide/configuration) |
| Common questions | [FAQ](/guide/faq) |

</div>
