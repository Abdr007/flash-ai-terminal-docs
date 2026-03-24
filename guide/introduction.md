# Introduction

**Flash Terminal** is a deterministic command-line trading engine for [Flash Trade](https://www.flash.trade/) perpetual futures on Solana.

It connects directly to the Flash protocol through the official SDK, executes trades on-chain, and provides real-time position management with automated risk controls and an autonomous learning agent.

## What It Does

- Executes leveraged perpetual futures trades on Solana mainnet
- Provides paper trading with real oracle prices (simulation mode)
- Monitors positions with real-time risk alerts and automated TP/SL
- Runs an autonomous trading agent that learns from market conditions
- Inspects protocol state: pools, fees, open interest, liquidation math
- Manages liquidity positions (FLP/sFLP) and FAF governance staking

## What It Does Not Do

- **No price predictions.** The system does not forecast market direction.
- **No black-box AI in the trade path.** AI assists with command parsing only.
- **No fabricated data.** If a value can't be read from chain or oracle, it's absent.
- **No hidden logic.** The transaction you confirm is the transaction that's signed.

## Design Principles

| Principle | Implementation |
|:----------|:---------------|
| **Deterministic** | Regex parser handles all commands. NLP is a fallback, never in the execution path. |
| **Protocol-aligned** | Fees, margins, leverage limits, and liquidation math from on-chain `CustodyAccount` state. |
| **Safe by default** | 10-layer safety stack is always active. Circuit breakers, signing gates, and kill switches are infrastructure. |
| **Zero fabrication** | Prices from Pyth Hermes. Positions from Flash SDK. Unreachable sources degrade to stale cache, never to synthetic data. |

## Data Sources

| Data | Source |
|:-----|:-------|
| Prices | Pyth Hermes oracle (same feeds used by Flash on-chain) |
| Positions | Flash SDK — on-chain `PositionAccount` |
| Fees & Parameters | On-chain `CustodyAccount` |
| Open Interest | fstats analytics API |
| Wallet Balances | Solana RPC |

## Modes

Flash Terminal operates in two modes, selected at startup:

**Simulation** — Paper trading with real oracle prices. Virtual USDC balance. No transactions. Selected by default.

**Live** — Real on-chain execution. Requires a funded wallet (SOL for fees, USDC for collateral). Every trade passes through the full safety stack before signing.

The mode is locked for the duration of the session. You cannot switch mid-session.

## Next Steps

- [Quick Start](/guide/getting-started) — Install and run your first trade
- [Core Concepts](/guide/core-concepts) — Understand markets, leverage, and liquidation
- [Architecture](/guide/architecture) — How the system is built
