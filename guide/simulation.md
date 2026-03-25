# Simulation Mode

Practice trading with real market prices and zero risk.

## How It Works

Simulation mode gives you a virtual USDC balance. Every trade uses the same commands and interface as live mode — but no real money is involved.

| Feature | Simulation | Live |
|:--------|:-----------|:-----|
| **Wallet needed** | No | Yes |
| **Transactions signed** | No | Yes |
| **Funds at risk** | No | Yes |
| **Oracle prices** | Real (Pyth) | Real (Pyth) |
| **Fee model** | ~0.08% approximation | Exact on-chain rates |
| **Position tracking** | In-memory | On-chain |

## Starting in Simulation

When you launch `flash`, choose **Simulation** at the mode selection screen. The prompt shows `[sim]`:

```
flash [sim] >
```

No setup required. No `.env` needed. Just install and go.

## Example Session

```bash
# Open a position
flash [sim] > open 2x long SOL $100

# Check positions
flash [sim] > positions

# Check portfolio
flash [sim] > portfolio

# Close the position
flash [sim] > close SOL long

# View trade history
flash [sim] > history
```

Everything works the same as live mode except nothing touches the blockchain.

## Dry Run

Preview any trade without executing — available in both modes:

```bash
dryrun open 5x long SOL $100
```

Shows estimated entry price, fees, liquidation price, and compute units. Useful for checking if a trade will work before committing.

## Switching to Live

1. Set up your [wallet](/guide/wallet-setup) and [RPC](/guide/rpc-setup)
2. Set `SIMULATION_MODE=false` in `.env`
3. Restart `flash`
4. Choose **Live** at the mode selection screen

The prompt changes to `[live]`:

```
flash [live] >
```

::: warning
You cannot switch modes mid-session. This is a safety feature to prevent accidentally trading with real funds.
:::

## Next Steps

- [Trading Guide](/guide/trading-guide) — Understand how trades work
- [Wallet Setup](/guide/wallet-setup) — Connect a real wallet
- [Basic Commands](/guide/basic-commands) — All available commands
