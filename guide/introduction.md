# Introduction

**Flash Terminal** (FT) is a professional command-line trading terminal for the Flash Trade perpetual futures protocol on Solana. It provides deterministic trade execution, protocol inspection, market observability, and portfolio risk management — directly from the terminal using live on-chain data.

## Why Flash Terminal Exists

Trading on DeFi protocols typically requires a browser, wallet extension, and web UI. Flash Terminal provides direct command-line access to Flash Trade — the same way professional trading desks operate through terminal interfaces.

FT is built for people who:

- Prefer working in the terminal
- Want programmatic access to protocol state
- Need lightweight tooling that runs anywhere Node.js runs

## Design Principles

Three principles define every design decision in the system.

### Deterministic

Trade commands are parsed with structured regex patterns. The same input always produces the same action. No AI inference is applied on trade execution paths.

### Auditable

Every trade attempt is logged to the signing audit log. State reconciliation verifies on-chain positions match local state. All data comes from verifiable sources — never fabricated or synthetic.

### Observable

Liquidation clusters, funding rates, liquidity depth, and protocol health metrics are all computed from live protocol data. Every number displayed in the terminal traces back to an on-chain or oracle source.

## Data Sources

| Source | Data |
|--------|------|
| Flash SDK | Position state, pool config, instruction building |
| Pyth Network | Real-time oracle prices |
| Solana RPC | Transaction submission and confirmation |
| fstats API | Volume, open interest, leaderboards, whale activity |
| CoinGecko | Market prices with 24h change |

## Operating Modes

Flash Terminal prompts users to select Simulation or Live mode when starting the CLI. The selected mode is locked for the entire session — no mid-session switching is possible.

| Mode | Wallet | Transactions | Risk |
|------|--------|-------------|------|
| **Simulation** | Not required | Never signed | None |
| **Live** | Required | Signed and broadcast | Real funds |

Simulation mode is recommended for testing trades safely. It uses real oracle prices and validates strategies without committing capital.

## Quick Demo

```bash
flash                           # start the terminal (select mode)
markets                         # list all supported markets
inspect protocol                # protocol-wide statistics
dryrun open 2x long SOL $10    # simulate a trade
open 2x long SOL $10           # execute the trade
positions                       # view open positions
close SOL long                  # close the position
exit                            # clean shutdown
```

## Next Steps

- [Installation](/guide/getting-started) — Set up and run FT
- [Architecture](/guide/architecture) — Understand the system design
- [Trading Commands](/guide/trading-commands) — Start trading
