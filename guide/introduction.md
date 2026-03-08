# Introduction

**Flash AI Terminal** (FAT) is a professional command-line trading terminal for interacting with the [Flash Trade](https://www.flash.trade/) perpetual futures protocol on Solana.

It enables traders and developers to execute leveraged trades, inspect protocol state, analyze markets, and monitor portfolio risk — directly from the terminal using real on-chain data.

## Why FAT Exists

Trading on DeFi protocols typically requires a browser, a wallet extension, and a web UI. Flash AI Terminal removes that dependency.

It gives developers and traders direct command-line access to Flash Trade — the same way professional trading desks operate through terminal interfaces.

FAT is built for people who:

- Prefer working in the terminal
- Want programmatic access to protocol state
- Need a lightweight tool that runs anywhere Node.js runs

## Design Philosophy

FAT stands for **Fast, Auditable, Trading** — three principles that define every design decision in the system.

### Fast

- Cached market data with bounded TTLs
- Instant trade preview using cached oracle prices
- Static site documentation builds in under 2 seconds
- Commands execute in under 200ms typical

### Auditable

- Every trade attempt logged to `~/.flash/signing-audit.log`
- State reconciliation verifies on-chain positions
- All data comes from verifiable sources (Pyth, Flash SDK, fstats)
- No fabricated data — empty results on source failure

### Trading

- Deterministic command parsing for trade execution
- Multi-stage confirmation pipeline before signing
- Simulation mode for strategy validation
- Real-time risk monitoring with liquidation alerts

## How FAT Connects to Flash Trade

The terminal connects directly to the Flash Trade program on Solana mainnet using the Flash SDK.

```
FAT CLI
  │
  ├── Flash SDK ──── Flash Trade Program (on-chain)
  ├── Pyth Network ── Oracle price feeds
  ├── Solana RPC ──── Transaction submission
  └── fstats API ──── Protocol analytics
```

| Source | Data |
|--------|------|
| Flash SDK | Position state, pool config, instruction building |
| Pyth Network | Real-time oracle prices |
| Solana RPC | Transaction submission and confirmation |
| fstats API | Volume, open interest, leaderboards, whale activity |
| CoinGecko | Market prices with 24h change |

## Operating Modes

FAT operates in two modes, locked at startup:

| Mode | Wallet | Transactions | Risk |
|------|--------|-------------|------|
| **Simulation** | Not required | Never signed | None |
| **Live** | Required | Signed and broadcast | Real funds |

Mode cannot change mid-session. This prevents accidental transitions from paper trading to live execution.

## Quick Demo

```bash
flash                           # start the terminal
markets                         # list all 24 supported markets
inspect protocol                # protocol-wide statistics
dryrun open 2x long SOL $10    # simulate a trade
open 2x long SOL $10           # execute the trade
positions                       # view open positions
close SOL long                  # close the position
exit                            # clean shutdown
```

## Next Steps

- [Installation](/guide/getting-started) — Set up and run FAT
- [Architecture](/guide/architecture) — Understand the system design
- [Trading Commands](/guide/trading-commands) — Start trading
