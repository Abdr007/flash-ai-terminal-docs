# RPC Setup

## What is RPC?

RPC (Remote Procedure Call) is how Flash Terminal talks to the Solana blockchain. It's a URL pointing to a Solana node that processes your requests — fetching prices, checking balances, and sending transactions.

## Method 1 — Default (No Setup)

Flash Terminal connects to Solana's public RPC automatically:

```
https://api.mainnet-beta.solana.com
```

This works for simulation and light use. No configuration needed.

## Method 2 — Custom RPC

Set your own endpoint in `.env`:

```bash
RPC_URL=https://api.mainnet-beta.solana.com
```

Any Solana mainnet RPC endpoint works. Must use HTTPS (except localhost).

## Method 3 — Paid RPC (Recommended for Live Trading)

Public RPC has rate limits and variable latency. For reliable live trading, use a dedicated provider:

| Provider | Link | Notes |
|:---------|:-----|:------|
| **Helius** | [helius.dev](https://helius.dev/) | Free tier available |
| **Triton** | [triton.one](https://triton.one/) | High performance |
| **QuickNode** | [quicknode.com](https://quicknode.com/) | Enterprise option |

Sign up, get your endpoint, add to `.env`:

```bash
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

### Why Paid RPC Matters

| | Public | Paid |
|:--|:-------|:-----|
| **Rate limits** | Strict | High/unlimited |
| **Latency** | Variable (100-500ms) | Consistent (20-80ms) |
| **Transaction landing** | Unreliable under load | Reliable |
| **Best for** | Simulation | Live trading |

## Backup RPC (Failover)

Add backup endpoints for automatic failover:

```bash
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
BACKUP_RPC_1=https://your-backup.com
BACKUP_RPC_2=https://api.mainnet-beta.solana.com
```

Flash Terminal monitors health every 30 seconds and switches to a backup when:

- Primary stops responding
- Latency exceeds threshold
- Slot lag exceeds 50 slots

When primary recovers, it switches back automatically.

## Checking RPC Health

```bash
rpc status        # Current endpoint health + latency
rpc test          # Test all configured endpoints
rpc list          # List all configured endpoints
doctor            # Full system diagnostics including RPC
```

## Managing Endpoints at Runtime

```bash
rpc set <url>       # Change primary endpoint
rpc add <url>       # Add a backup endpoint
rpc remove <url>    # Remove an endpoint
```

## Next Steps

- [Configuration](/guide/configuration) — Full `.env` reference
- [Wallet Setup](/guide/wallet-setup) — Set up your wallet
- [Troubleshooting](/guide/troubleshooting) — Fix connection issues
