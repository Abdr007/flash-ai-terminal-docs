---
layout: home
hero:
  name: Flash Terminal
  text: Deterministic CLI Trading Interface
  tagline: Execute leveraged trades on Flash Trade from the command line with deterministic execution, automated risk controls, and real-time monitoring.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: Command Reference
      link: /reference/trading-commands
    - theme: alt
      text: GitHub
      link: https://github.com/Abdr007/flash-terminal

features:
  - icon: "\u26A1"
    title: Protocol-Aligned Trading
    details: All fees, leverage limits, and liquidation math derived from on-chain CustodyAccount state and Flash SDK helpers.
    link: /guide/protocol-alignment
    linkText: Protocol alignment
  - icon: "\uD83D\uDD12"
    title: Deterministic Execution
    details: Every trade passes through validation, simulation, signing guards, and protocol verification before submission.
    link: /guide/architecture
    linkText: Architecture
  - icon: "\uD83D\uDEE1\uFE0F"
    title: Risk Preview & Liquidation
    details: Full trade preview with entry price, liquidation distance, fee estimate, and exposure impact before signing.
    link: /guide/risk-preview
    linkText: Risk & liquidation
  - icon: "\uD83E\uDDEA"
    title: Simulation Mode
    details: Paper trade with real Pyth Hermes oracle prices and protocol-accurate fee models. No on-chain transactions.
    link: /guide/simulation
    linkText: Simulation docs
  - icon: "\uD83D\uDCCA"
    title: Market Analytics
    details: Open interest, whale positions, volume data, and protocol health sourced from fstats analytics and on-chain state.
    link: /guide/market-analytics
    linkText: Analytics docs
  - icon: "\uD83D\uDD0D"
    title: Protocol Inspection
    details: Query pool state, fee rates, leverage limits, and protocol parameters directly from CustodyAccount and PoolConfig.
    link: /guide/protocol-inspection
    linkText: Inspector docs
  - icon: "\uD83D\uDD04"
    title: Infrastructure Reliability
    details: Multi-endpoint RPC failover, slot lag detection, leader-aware routing, crash recovery, and state reconciliation.
    link: /guide/infrastructure
    linkText: Infrastructure docs
---

## Why Flash Terminal

Flash Terminal is a production-grade command line interface for the [Flash Trade](https://www.flash.trade/) perpetual futures protocol on Solana. It connects directly to the protocol through the official SDK and provides transparent access to on-chain state.

**Protocol alignment** is the core design principle. All calculations — fees, leverage limits, maintenance margins, and liquidation thresholds — are derived from on-chain `CustodyAccount` state using Flash SDK helpers. Nothing is approximated or re-implemented. What the terminal displays matches the protocol's execution logic.

**Deterministic execution** ensures every trade follows a predictable pipeline: parameter validation, Zod schema enforcement, transaction simulation, signing guard checks, program ID whitelisting, and leader-aware RPC routing. Transactions behave the same way every time.

**Layered safety systems** protect against operational and trading risk. A signing guard enforces rate limits, a circuit breaker halts trading on loss thresholds, and a kill switch provides emergency stop capability. Crash recovery and state reconciliation ensure consistency even after unexpected interruptions.

---

## Quick Start

```bash
git clone https://github.com/Abdr007/flash-terminal.git
cd flash-terminal
npm install
npm run build
cp .env.example .env
npm start
```

Once the terminal starts, select a mode and begin trading:

```
flash [sim] > monitor
flash [sim] > open 2x long SOL $10
flash [sim] > positions
flash [sim] > close SOL long
```

See the [Getting Started guide](/guide/getting-started) for full installation and configuration instructions.

---

## Architecture

Flash Terminal uses a layered architecture where each component has a single responsibility.

```
CLI Interface → AI Interpreter → Tool Engine → Flash Client → Solana
```

**CLI Interface** parses user input into structured intent objects using deterministic regex. An AI-powered natural language parser is available as a fallback when configured.

**Tool Engine** routes validated intents through signing guards, rate limiting, and confirmation gates before execution.

**Flash Client** delegates trade execution to the Flash SDK `PerpetualsClient`. All protocol math — fees, leverage, liquidation — flows through official SDK helpers.

**Solana** is the final execution layer. Transactions are simulated before broadcast, rebroadcast with leader-aware routing, and verified on-chain after confirmation.

Read the full [Architecture guide](/guide/architecture) for details on the trading pipeline.

---

## Safety Systems

Flash Terminal integrates multiple safety layers that operate before, during, and after trade execution.

| System | Description |
|:-------|:------------|
| **Signing Guard** | Enforces configurable trade limits, rate limiting, and confirmation gates. Logs every trade attempt to an audit file. |
| **Circuit Breaker** | Halts all trading when cumulative session or daily losses exceed configurable thresholds. Requires manual reset. |
| **Trading Gate** | Master kill switch that instantly blocks all trade operations. Can be toggled at runtime. |
| **TP/SL Automation** | Automatically closes positions at predefined take-profit or stop-loss levels with spike protection. Set inline (`open 2x long SOL $100 tp $95 sl $80`) or separately. |
| **Limit Orders** | Session-scoped limit orders that automatically open positions when price reaches a target level. Spike protection and full safety pipeline. |
| **Transaction Simulation** | Simulates transactions on-chain before broadcast to catch program errors before funds are at risk. |
| **Crash Recovery** | Trade journal records pending transactions. On restart, the recovery engine verifies on-chain status and reconciles state. |
| **RPC Failover** | Monitors endpoint health, detects slot lag, and switches to backup endpoints automatically. |

Read the full [Security Model](/guide/security) for details on the safety pipeline.

---

## Data Sources

Flash Terminal retrieves all data from authoritative external sources. No values are fabricated or estimated.

| Source | Data | Validation |
|:-------|:-----|:-----------|
| **Pyth Hermes** | Oracle prices | Staleness rejection (<30s), confidence checks (<2%), deviation limits (<50%) |
| **Flash SDK** | Positions, liquidation math | On-chain `PositionAccount` fetch, `Number.isFinite()` on all fields |
| **Solana RPC** | Wallet balances, transactions | Direct RPC calls with failover and retry |
| **fstats API** | Open interest, volume, whales | Response size limits (2MB), parameter sanitization |
| **CustodyAccount** | Fees, leverage, margins | On-chain state with protocol parameter validation |

Read the full [Data Sources guide](/guide/data-sources) for caching behavior and fallback logic.

---

## Navigating the Docs

The documentation is organized into two sections.

**Guide** covers concepts, workflows, and system design:

- [Introduction](/guide/introduction) — what Flash Terminal is and how it works
- [Installation](/guide/getting-started) — setup, configuration, and first session
- [Trading Guide](/guide/trading-commands) — opening, closing, and managing positions
- [Risk & Liquidation](/guide/risk-preview) — trade previews, liquidation math, and risk monitoring
- [Simulation Mode](/guide/simulation) — paper trading with real oracle prices
- [Protocol Alignment](/guide/protocol-alignment) — how calculations match the protocol
- [Market Analytics](/guide/market-analytics) — monitoring and analytics tools
- [Security Model](/guide/security) — the full safety pipeline

**Reference** provides complete command documentation:

- [Trading Commands](/reference/trading-commands) — open, close, add, remove collateral
- [Market Data](/reference/market-data) — monitor, scan, analyze, volume, OI
- [Portfolio & Risk](/reference/portfolio-risk) — dashboard, risk report, exposure
- [Protocol Inspector](/reference/protocol-inspector) — inspect, verify, fees
- [Wallet](/reference/wallet) — wallet management and balances
- [System](/reference/system) — diagnostics, RPC status, health checks

Start with the [Introduction](/guide/introduction) to understand the system, then follow the [Getting Started guide](/guide/getting-started) to install and configure the terminal.
