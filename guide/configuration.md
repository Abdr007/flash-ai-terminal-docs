# Configuration (.env)

All settings are environment variables. Create a `.env` file in the directory where you run `flash`:

```bash
touch .env
```

Flash Terminal loads `.env` files in this order (later overrides earlier):

1. `~/.flash/.env` (global defaults)
2. `./.env` (project-level)
3. Shell environment variables (highest priority)

You can also use `~/.flash/config.json` for persistent configuration.

## Minimal Setup

For simulation mode, you need nothing. For live trading:

```bash
# Where your wallet file is
WALLET_PATH=~/.config/solana/id.json

# How the CLI connects to Solana
RPC_URL=https://api.mainnet-beta.solana.com

# false = live trading
SIMULATION_MODE=false
```

## Full Reference

### Core

| Variable | Default | Description |
|:---------|:--------|:------------|
| `RPC_URL` | `https://api.mainnet-beta.solana.com` | Solana RPC endpoint (HTTPS required) |
| `WALLET_PATH` | `~/.config/solana/id.json` | Path to Solana keypair JSON file |
| `SIMULATION_MODE` | `true` | `true` = paper trading, `false` = live |
| `NETWORK` | `mainnet-beta` | Solana network (mainnet-beta only) |

### Backup RPC

| Variable | Default | Description |
|:---------|:--------|:------------|
| `BACKUP_RPC_1` | — | First backup RPC endpoint |
| `BACKUP_RPC_2` | — | Second backup endpoint |

### Trading Defaults

| Variable | Default | Description |
|:---------|:--------|:------------|
| `DEFAULT_POOL` | `Crypto.1` | Default trading pool |
| `DEFAULT_LEVERAGE` | `2` | Default leverage (1-100) |
| `DEFAULT_SLIPPAGE_BPS` | `150` | Slippage tolerance in basis points (150 = 1.5%) |

### Trade Limits (Signing Guard)

| Variable | Default | Description |
|:---------|:--------|:------------|
| `MAX_COLLATERAL_PER_TRADE` | `0` (unlimited) | Max collateral per trade in USD |
| `MAX_POSITION_SIZE` | `0` (unlimited) | Max position size in USD |
| `MAX_LEVERAGE` | `0` (unlimited) | Max leverage multiplier |
| `MAX_TRADES_PER_MINUTE` | `10` | Rate limit: trades per minute |
| `MIN_DELAY_BETWEEN_TRADES_MS` | `3000` | Minimum milliseconds between trades |

### Compute Units

| Variable | Default | Description |
|:---------|:--------|:------------|
| `FLASH_DYNAMIC_CU` | `true` | Simulate each TX to measure actual CU usage |
| `FLASH_CU_BUFFER_PCT` | `20` | Buffer % added to measured CU |
| `COMPUTE_UNIT_LIMIT` | `220000` | Static CU limit (when dynamic is off) |
| `COMPUTE_UNIT_PRICE` | `100000` | Priority fee in micro-lamports |
| `FLASH_LEADER_ROUTING` | `true` | Use leader scheduling for faster landing |
| `FLASH_REBROADCAST_MS` | `800` | Rebroadcast interval in milliseconds |

::: tip DYNAMIC CU
`FLASH_DYNAMIC_CU=true` (the default) simulates your transaction first to measure actual compute usage, then adds a buffer. This prevents overpaying while avoiding "exceeded CU limit" failures.
:::

### Logging

| Variable | Default | Description |
|:---------|:--------|:------------|
| `LOG_FILE` | — | Log file path (optional) |
| `SESSION_TIMEOUT_MS` | `900000` | Keypair inactivity timeout (15 min) |

### Referral

| Variable | Default | Description |
|:---------|:--------|:------------|
| `REFERRER_ADDRESS` | Flash Terminal default | Referrer wallet for trade rebates |

## Viewing Active Config

Inside Flash Terminal:

```bash
config
```

Shows all currently loaded settings and their resolved values.

## Config File (~/.flash/config.json)

For persistent settings that apply across all projects:

```json
{
  "rpc_url": "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
  "backup_rpc_urls": ["https://api.mainnet-beta.solana.com"],
  "default_leverage": 2,
  "default_slippage_bps": 150,
  "max_collateral_per_trade": 1000,
  "max_leverage": 50
}
```

Priority: shell env > `.env` > `config.json` > built-in defaults.

## Next Steps

- [Wallet Setup](/guide/wallet-setup) — Configure your wallet
- [RPC Setup](/guide/rpc-setup) — Optimize your connection
- [Commands](/guide/commands) — Start using the terminal
