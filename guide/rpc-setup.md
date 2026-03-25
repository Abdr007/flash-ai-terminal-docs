# RPC Setup

## What is RPC?

RPC (Remote Procedure Call) is how Flash Terminal talks to the Solana blockchain. It's a URL that connects you to a Solana node.

Think of it like a phone number for the blockchain. You need one to:

- Get current prices and positions
- Send trade transactions
- Check your wallet balance

## Default RPC

Flash Terminal uses Solana's public RPC by default:

```bash
RPC_URL=https://api.mainnet-beta.solana.com
```

This works for getting started, but has limitations:

| Feature | Public RPC | Paid RPC |
|:--------|:-----------|:---------|
| **Cost** | Free | $20-100+/month |
| **Rate limits** | Strict (may get blocked) | High or unlimited |
| **Speed** | Variable | Consistently fast |
| **Reliability** | May drop transactions | High uptime guarantee |
| **Best for** | Simulation, testing | Live trading |

## Setting Your RPC

Add the URL to your `.env` file:

```bash
RPC_URL=https://api.mainnet-beta.solana.com
```

## When to Use a Paid RPC

Use a paid RPC if you:

- **Trade live** — Your transactions need to land reliably
- **Trade frequently** — Public RPC rate limits will block you
- **Need speed** — Lower latency = faster execution

### Recommended Providers

| Provider | Link |
|:---------|:-----|
| **Helius** | [helius.dev](https://helius.dev/) |
| **Triton** | [triton.one](https://triton.one/) |
| **QuickNode** | [quicknode.com](https://quicknode.com/) |

Sign up, get your endpoint URL, and paste it in your `.env`:

```bash
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

## Backup RPC (Optional)

For extra reliability, add backup endpoints. Flash Terminal will automatically switch to a backup if your primary goes down:

```bash
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
BACKUP_RPC_1=https://your-backup-endpoint.com
BACKUP_RPC_2=https://api.mainnet-beta.solana.com
```

### How Failover Works

Flash Terminal checks RPC health every 30 seconds. It switches to a backup when:

- The primary endpoint stops responding
- Latency exceeds 5 seconds
- Slot lag exceeds 50 slots behind

When the primary recovers, it switches back automatically.

## Checking RPC Status

Inside Flash Terminal:

```bash
# See current RPC health
flash > rpc status

# Test all configured endpoints
flash > rpc test

# Run full system diagnostics
flash > doctor
```

Example output from `rpc status`:

```
RPC Status
──────────────────────────
  Primary:   https://mainnet.helius-rpc.com/...
  Status:    Connected
  Latency:   45ms
  Slot:      298,451,234
  Lag:       0 slots
```

## Important Notes

- RPC URLs must use **HTTPS** (HTTP is only allowed for `localhost`)
- Keep your API key private — don't share your RPC URL publicly
- For simulation mode, the public RPC is usually fine

## Next Steps

- [Configuration](/guide/configuration) — All `.env` variables explained
- [Wallet Setup](/guide/wallet-setup) — Set up your wallet
- [Quick Start](/guide/quick-start) — Start trading
