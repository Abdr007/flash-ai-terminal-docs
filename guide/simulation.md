# Simulation Mode

Practice trading with real market prices and zero risk. Enabled by default.

## How It Works

| | Simulation | Live |
|:--|:-----------|:-----|
| **Wallet** | Not needed | Required |
| **Transactions signed** | No | Yes |
| **Funds at risk** | No | Yes |
| **Oracle prices** | Real (Pyth) | Real (Pyth) |
| **Fee model** | ~0.08% estimate | Exact on-chain |
| **Position storage** | In-memory | On-chain |

## Getting Started

Launch Flash Terminal and choose **Simulation**:

```bash
flash
```

The prompt shows `[sim]`:

```
flash [sim] >
```

No `.env` file needed. No wallet. No setup.

## Example Session

```bash
open 2x long SOL $100       # Open a position
positions                    # Check PnL
portfolio                    # Full portfolio view
add $50 to SOL long         # Add collateral
close SOL long              # Close and realize PnL
history                      # Review trade history
```

## Dry Run

Preview any trade without executing — works in both modes:

```bash
dryrun open 5x long SOL $500
```

Shows entry price, fees, liquidation price, and compute units.

## Switching to Live

1. Set up your [wallet](/guide/wallet-setup) and [RPC](/guide/rpc-setup)
2. In `.env`, set `SIMULATION_MODE=false`
3. Restart `flash`

```
flash [live] >
```

::: warning
Mode is locked per session. You cannot switch mid-session. This prevents accidentally trading real funds.
:::

## Limitations

- Simulation state is stored in memory. If the terminal crashes, state is lost.
- Fees are approximated (~0.08% of position size). Live mode reads exact on-chain rates.
- No on-chain interactions. Limit orders and TP/SL are simulated locally.

## Next Steps

- [Commands](/guide/commands) — All available commands
- [Trading Guide](/guide/trading-guide) — How trades work
- [Wallet Setup](/guide/wallet-setup) — Go live
