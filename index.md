---
layout: home
hero:
  name: Flash Terminal
  text: On-Chain Trading Infrastructure
  tagline: Deterministic execution pipeline for Solana perpetual futures. Protocol-aligned math, 10-layer safety stack, autonomous agent — all from the command line.
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/Abdr007/flash-terminal

features:
  - icon: "\u2699\uFE0F"
    title: Deterministic Execution
    details: Every trade follows a fixed pipeline — Zod schema validation, protocol parameter fetch, transaction simulation, program ID whitelist, signing guard, leader-aware broadcast. Same input, same output, every time.
    link: /guide/architecture
    linkText: Architecture
  - icon: "\uD83E\uDD16"
    title: Autonomous Agent
    details: AI-powered market scanner, portfolio rebalancer, and autopilot. The agent reads live oracle prices and on-chain state — it never fabricates data. Trade commands always use deterministic regex parsing, never LLM output.
    link: /guide/terminal-features
    linkText: Agent docs
  - icon: "\uD83D\uDEE1\uFE0F"
    title: 10-Layer Safety Stack
    details: Signing guard, circuit breaker, kill switch, TP/SL automation, transaction simulation, program ID whitelist, rate limiter, crash recovery, state reconciliation, and RPC failover. Defense in depth from intent to confirmation.
    link: /guide/security
    linkText: Security model
  - icon: "\uD83D\uDCE1"
    title: Protocol-Aligned Data
    details: Fees, leverage limits, maintenance margins, and liquidation thresholds derived from on-chain CustodyAccount state via Flash SDK helpers. Oracle prices from Pyth Hermes with staleness and confidence validation.
    link: /guide/protocol-alignment
    linkText: Protocol alignment
  - icon: "\uD83E\uDDEA"
    title: Simulation Mode
    details: Paper trade against real Pyth oracle prices with protocol-accurate fee models. No keypair required, no on-chain transactions. Identical execution logic to live mode — switch with one environment variable.
    link: /guide/simulation
    linkText: Simulation docs
  - icon: "\uD83D\uDD27"
    title: Production Infrastructure
    details: Multi-endpoint RPC failover with slot lag detection, transaction rebroadcast with leader-aware routing, 10MB log rotation with secret scrubbing, state reconciliation on startup and after every trade.
    link: /guide/infrastructure
    linkText: Infrastructure docs
---

<div class="vp-doc" style="padding: 0 24px;">

## What is Flash Terminal?

Flash Terminal is a command-line interface for trading perpetual futures on [Flash Trade](https://www.flash.trade/), a Solana-native derivatives protocol. It connects directly to the protocol through the official Flash SDK and exposes on-chain state through a structured, auditable execution pipeline.

It is not a wrapper around a web UI. It is a trading system — with its own safety stack, execution engine, and observability layer — that uses Flash Trade as its settlement layer.

```bash
npm install -g flash-terminal
flash
```

[![npm](https://img.shields.io/npm/v/flash-terminal?style=flat-square&label=flash-terminal&color=26d97f)](https://www.npmjs.com/package/flash-terminal)

### Key Capabilities

| Capability | Detail |
|:-----------|:-------|
| **Markets** | 32+ assets across 8 pools — crypto, commodities, forex, equities, governance tokens, memecoins |
| **Execution modes** | Live trading (signed transactions) and simulation (real prices, no signing) |
| **Autonomous agent** | Market scanner, portfolio analyzer, strategy autopilot with configurable risk parameters |
| **Earn positions** | Add/remove liquidity to Flash Trade pools directly from the CLI |
| **Order types** | Market orders, limit orders, FAF (fire-and-forget) orders, TP/SL automation |
| **Protocol inspection** | Query pool state, fee rates, leverage limits, open interest, and whale positions |
| **Test coverage** | 1926 assertions across unit, integration, and chaos tests |

### Why Flash Terminal

**Transparent.** Every calculation is traceable to an on-chain source. No approximations, no cached-and-forgotten values, no black boxes. When you see a fee estimate, it comes from `CustodyAccount`. When you see a price, it comes from Pyth Hermes with staleness validation.

**Deterministic.** The execution pipeline produces the same result for the same input. Trade commands are parsed with regex, validated with Zod schemas, and executed through a fixed sequence of checks. LLM parsing is only used for read-only natural language queries and never touches the trade path.

**Controlled.** Ten independent safety systems operate before, during, and after trade execution. Rate limits, collateral caps, circuit breakers, transaction simulation, program ID whitelisting, and crash recovery all run without manual intervention.

**Engineer-first.** Configuration lives in environment variables. Logs are structured and scrubbed. Every trade attempt is recorded in an append-only audit log. The system is designed to be operated, debugged, and extended by engineers.

### Quick Links

- [Quick Start](/guide/getting-started) -- first trade in 5 minutes
- [Core Concepts](/guide/core-concepts) -- markets, positions, leverage, liquidation
- [Trading Commands](/guide/trading-commands) -- full command reference
- [Architecture](/guide/architecture) -- system design and execution pipeline
- [Security Model](/guide/security) -- the complete safety stack
- [Protocol Alignment](/guide/protocol-alignment) -- how calculations match the protocol

</div>
