# Introduction

**Flash Terminal** is a deterministic command line interface for the [Flash Trade](https://www.flash.trade/) perpetual futures protocol on Solana.

It provides a transparent, protocol-aligned trading terminal where every calculation — fees, leverage, liquidation prices, margins — is derived from on-chain state or official SDK helpers.

## What Flash Terminal Does

- Execute leveraged trades on Flash Trade (open, close, add/remove collateral)
- Inspect protocol state (pools, markets, fees, open interest)
- Monitor positions with real-time risk alerts
- Analyze markets using live data from Pyth Hermes and fstats
- Verify protocol alignment with built-in audit tools

## What Flash Terminal Does Not Do

- Generate trading signals or predictions
- Fabricate analytics or synthetic data
- Reimplement protocol logic when an SDK helper exists
- Modify or extend protocol behavior

## Design Principles

**Deterministic** — Trade commands are parsed with structured regex. Same input, same action.

**Protocol-aligned** — Fee rates from `CustodyAccount`, liquidation prices from `getLiquidationPriceContractHelper()`, leverage from `PoolConfig`.

**Observable** — All protocol state is queryable from the CLI. Nothing is hidden.

**Auditable** — Every trade attempt is logged. State reconciliation verifies positions on-chain.

## Data Sources

| Source | Data | Usage |
|:-------|:-----|:------|
| Flash SDK | Positions, pool config, liquidation math, leverage limits | Trade execution, position queries |
| Pyth Hermes | Oracle prices (same feeds as Flash protocol on-chain) | Mark prices, PnL calculations |
| CustodyAccount | Fee rates, max leverage, maintenance margin | Fee calculation, risk preview |
| Solana RPC | Transaction broadcast, wallet balances, on-chain state | Trade execution, balance queries |
| fstats API | Open interest, volume, leaderboards, whale positions | Market analytics |

## Operating Modes

| Mode | Description |
|:-----|:------------|
| **Simulation** | Paper trading with real oracle prices. No transactions signed. |
| **Live** | Real transactions on Solana mainnet. Requires connected wallet. |

Mode is selected at startup and locked for the session.

## Quick Demo

```bash
flash                           # start the terminal (select mode)
markets                         # list all supported markets
inspect protocol                # protocol-wide statistics
protocol verify                 # run protocol alignment audit
dryrun open 2x long SOL $10    # preview a trade
open 2x long SOL $10           # execute the trade
positions                       # view open positions
close SOL long                  # close the position
exit                            # clean shutdown
```

## Next Steps

- [Installation](/guide/getting-started) — Set up Flash Terminal
- [Architecture](/guide/architecture) — Understand the system design
- [Trading Guide](/guide/trading-commands) — Learn trading commands
- [Protocol Alignment](/guide/protocol-alignment) — How the CLI mirrors the protocol
