# Configuration (.env)

All settings live in a `.env` file. No config files, no YAML — just environment variables.

Create a `.env` file in the directory where you run `flash`:

```bash
touch .env
```

## Full Example

Here's a complete `.env` file with all available options:

```bash
# ─── Required ─────────────────────────────────────
RPC_URL=https://api.mainnet-beta.solana.com

# ─── Wallet (required for live trading) ───────────
WALLET_PATH=~/.config/solana/id.json

# ─── Mode ─────────────────────────────────────────
SIMULATION_MODE=true

# ─── AI (optional, for natural language queries) ──
ANTHROPIC_API_KEY=sk-ant-...
# GROQ_API_KEY=gsk_...

# ─── Backup RPC (optional) ────────────────────────
# BACKUP_RPC_1=https://backup-one.com
# BACKUP_RPC_2=https://backup-two.com

# ─── Trade Limits (optional) ──────────────────────
# MAX_COLLATERAL_PER_TRADE=1000
# MAX_POSITION_SIZE=50000
# MAX_LEVERAGE=100
# MAX_TRADES_PER_MINUTE=10
# MIN_DELAY_BETWEEN_TRADES_MS=3000

# ─── Risk Controls (optional) ─────────────────────
# MAX_SESSION_LOSS_USD=500
# MAX_DAILY_LOSS_USD=1000
# MAX_PORTFOLIO_EXPOSURE=0.8

# ─── Compute Units (optional) ─────────────────────
# FLASH_DYNAMIC_CU=true
# FLASH_CU_BUFFER_PCT=20
# COMPUTE_UNIT_LIMIT=400000
# COMPUTE_UNIT_PRICE=50000

# ─── Alerts (optional) ────────────────────────────
# ALERT_WEBHOOK_URL=https://your-webhook.com/alerts
# SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
# ALERT_MIN_SEVERITY=warning

# ─── Logging (optional) ───────────────────────────
# LOG_FILE=~/.flash/logs/flash.log
# FLASH_LOG_LEVEL=info
# FLASH_LOG_FORMAT=text

# ─── Advanced (optional) ──────────────────────────
# FLASH_STRICT_PROTOCOL=true
# SHADOW_TRADING=true
# SESSION_TIMEOUT_MS=900000
# TRADING_ENABLED=true
# NO_DNA=1
```

## Variable Reference

### Required

| Variable | Description | Example |
|:---------|:------------|:--------|
| `RPC_URL` | Solana RPC endpoint (HTTPS required) | `https://api.mainnet-beta.solana.com` |

### Wallet

| Variable | Description | Default |
|:---------|:------------|:--------|
| `WALLET_PATH` | Path to Solana keypair JSON file. Supports `~` expansion. | None |
| `SIMULATION_MODE` | `true` for paper trading, `false` for live | `true` |

### AI (Natural Language)

| Variable | Description | Default |
|:---------|:------------|:--------|
| `ANTHROPIC_API_KEY` | Enables AI-powered natural language queries | None |
| `GROQ_API_KEY` | Alternative AI provider | None |

::: tip
AI is only used for read-only queries ("how is SOL doing?"). It never executes trades. All trade commands use a deterministic parser.
:::

### Backup RPC

| Variable | Description |
|:---------|:------------|
| `BACKUP_RPC_1` | First backup endpoint (used on primary failure) |
| `BACKUP_RPC_2` | Second backup endpoint |

Flash Terminal checks health every 30s and automatically fails over.

### Trade Limits

| Variable | Description | Default |
|:---------|:------------|:--------|
| `MAX_COLLATERAL_PER_TRADE` | Maximum collateral per single trade (USD) | Unlimited |
| `MAX_POSITION_SIZE` | Maximum position size (USD) | Unlimited |
| `MAX_LEVERAGE` | Maximum leverage multiplier | Protocol max |
| `MAX_TRADES_PER_MINUTE` | Rate limit on trades | `10` |
| `MIN_DELAY_BETWEEN_TRADES_MS` | Minimum time between trades (ms) | `3000` |

### Risk Controls

| Variable | Description | Default |
|:---------|:------------|:--------|
| `MAX_SESSION_LOSS_USD` | Halt trading when session losses exceed this | None |
| `MAX_DAILY_LOSS_USD` | Halt trading when daily losses exceed this (resets midnight UTC) | None |
| `MAX_PORTFOLIO_EXPOSURE` | Max portfolio exposure as fraction of account value | `0.8` |

When the circuit breaker trips, you must restart the terminal to resume trading.

### Compute Units

| Variable | Description | Default |
|:---------|:------------|:--------|
| `FLASH_DYNAMIC_CU` | Simulate each TX to measure actual CU usage | `false` |
| `FLASH_CU_BUFFER_PCT` | Buffer % added to simulated CU | `20` |
| `COMPUTE_UNIT_LIMIT` | Static CU limit (when dynamic is off) | `400000` |
| `COMPUTE_UNIT_PRICE` | Priority fee in micro-lamports | `50000` |

::: tip
Enable `FLASH_DYNAMIC_CU=true` to avoid overpaying for compute. If transactions fail with "exceeded CU limit", increase `FLASH_CU_BUFFER_PCT` to 30-40%.
:::

### Alerts & Webhooks

| Variable | Description | Default |
|:---------|:------------|:--------|
| `ALERT_WEBHOOK_URL` | URL for JSON POST alerts | None |
| `SLACK_WEBHOOK_URL` | Slack-specific webhook | None |
| `ALERT_MIN_SEVERITY` | Minimum severity: `info`, `warning`, `critical` | `warning` |

Alerts fire on: trade execution, trade failure, risk level change, circuit breaker trip, RPC failover, kill switch activation.

### Logging

| Variable | Description | Default |
|:---------|:------------|:--------|
| `LOG_FILE` | Application log file path | `~/.flash/logs/flash.log` |
| `FLASH_LOG_LEVEL` | Log level: `debug`, `info`, `warn`, `error` | `info` |
| `FLASH_LOG_FORMAT` | Format: `text` or `json` | `text` |

Logs rotate at 10MB. API keys are automatically scrubbed from log files.

### Advanced

| Variable | Description | Default |
|:---------|:------------|:--------|
| `FLASH_STRICT_PROTOCOL` | Reject trades if local/on-chain liquidation price diverge | `false` |
| `SHADOW_TRADING` | Mirror trades to shadow risk engine (no execution) | `false` |
| `SESSION_TIMEOUT_MS` | Auto-disconnect after inactivity (ms) | `900000` (15 min) |
| `TRADING_ENABLED` | Master kill switch (`false` disables all trades) | `true` |
| `NO_DNA` | Agent mode: JSON output, no prompts, auto-confirm | `false` |

## Viewing Active Config

Inside Flash Terminal:

```bash
config
```

This shows all currently loaded settings and their values.

## Next Steps

- [Wallet Setup](/guide/wallet-setup) — Set up your trading wallet
- [RPC Setup](/guide/rpc-setup) — Optimize your connection
- [Troubleshooting](/guide/troubleshooting) — Fix common issues
