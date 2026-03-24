# Advanced Configuration

All configuration is via environment variables in `.env`. No config files, no YAML, no JSON. If a variable is unset, the default applies.

## Trade Limits

```bash
# Maximum collateral per single trade (USD)
MAX_COLLATERAL_PER_TRADE=1000

# Maximum position size (USD notional)
MAX_POSITION_SIZE=50000

# Maximum leverage multiplier
MAX_LEVERAGE=100

# Rate limiting
MAX_TRADES_PER_MINUTE=10
MIN_DELAY_BETWEEN_TRADES_MS=3000
```

The signing guard enforces these before every trade. If a trade exceeds any limit, it is rejected before simulation. The agent respects these limits identically to manual trades.

## Risk Controls

```bash
# Session loss threshold — halts trading for the session
MAX_SESSION_LOSS_USD=500

# Daily loss threshold — resets at midnight UTC
MAX_DAILY_LOSS_USD=1000

# Portfolio exposure cap (fraction of account value)
MAX_PORTFOLIO_EXPOSURE=0.8
```

The circuit breaker is not recoverable within a session. Restart the terminal to reset. See [Risk & Safety Systems](./risk-safety.md) for full detail on how these interact.

## RPC Configuration

```bash
# Primary RPC endpoint (required)
RPC_URL=https://your-rpc-endpoint.com

# Backup endpoints (optional, used for failover)
BACKUP_RPC_1=https://backup-one.com
BACKUP_RPC_2=https://backup-two.com
```

**Failover triggers:** connection failure, latency >5s, slot lag >50 behind the highest-known slot. The RPC manager runs health checks every 30s and automatically switches to the healthiest endpoint. When only one endpoint is configured, slot lag is always 0 (no comparison baseline).

Helius is recommended for mainnet. Their Solana RPC nodes have low latency, high reliability, and support `sendTransaction` with preflight checks.

## Dynamic Compute Units

```bash
# Enable dynamic CU estimation (simulates TX to measure actual usage)
FLASH_DYNAMIC_CU=true

# Buffer percentage added to simulated CU (default: 20%)
FLASH_CU_BUFFER_PCT=20

# Static fallbacks (used when dynamic CU is disabled)
COMPUTE_UNIT_LIMIT=400000
COMPUTE_UNIT_PRICE=50000
```

When `FLASH_DYNAMIC_CU=true`, the terminal simulates each transaction to measure actual compute unit consumption, then adds the buffer percentage. This avoids overpaying for compute while ensuring transactions land.

When disabled, the static `COMPUTE_UNIT_LIMIT` and `COMPUTE_UNIT_PRICE` values are used for all transactions.

## Alerts & Webhooks

```bash
# Webhook URL for trade/risk/system alerts (JSON POST)
ALERT_WEBHOOK_URL=https://your-webhook.com/alerts

# Slack-specific webhook (if different from general alerts)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...

# Minimum severity to trigger alerts: info | warning | critical
ALERT_MIN_SEVERITY=warning
```

Alert payloads are JSON:

```json
{
  "timestamp": "2026-03-24T12:00:00.000Z",
  "severity": "warning",
  "type": "risk",
  "message": "Position SOL-LONG liquidation distance at 28%",
  "data": {
    "market": "SOL",
    "side": "long",
    "liquidationDistance": 0.28
  }
}
```

Events that fire alerts: trade execution, trade failure, risk level change, circuit breaker trip, RPC failover, kill switch activation.

## Shadow Trading

```bash
# Mirror all trades to a parallel risk engine (no execution)
SHADOW_TRADING=true
```

When enabled, every trade signal is duplicated to a shadow risk engine that tracks what would have happened without execution. Useful for validating strategy changes against live market conditions without capital at risk.

## Session & Logging

```bash
# Session timeout — auto-disconnect after inactivity (default: 15 minutes)
SESSION_TIMEOUT_MS=900000

# Application log file path
LOG_FILE=~/.flash/logs/flash.log

# Log level: debug | info | warn | error
FLASH_LOG_LEVEL=info

# Log format: text | json
FLASH_LOG_FORMAT=text
```

Log files rotate at 10MB (`.old`, `.old.2`). API keys are automatically scrubbed from file logs (`sk-ant-***`, `gsk_***`, `api_key=***`). Console output is never logged to file.

## Protocol Strictness

```bash
# Throw on liquidation price divergence between local calc and protocol
FLASH_STRICT_PROTOCOL=true
```

When enabled, the terminal compares its locally calculated liquidation price against the protocol's on-chain value. If they diverge beyond tolerance, the trade is rejected. Useful for catching edge cases in margin math.

## Agent Mode

```bash
# Structured JSON output, no interactive prompts, auto-confirms trades
NO_DNA=1
```

Designed for programmatic integration. The agent outputs structured JSON instead of formatted tables. Trade confirmations are auto-approved (the signing guard still enforces limits). Use this when piping Flash Terminal output to another system.

## Performance Tuning

**RPC selection.** Latency to your RPC endpoint is the single biggest factor in execution speed. Use a geographically close, dedicated RPC node. Shared public endpoints have unpredictable latency and rate limits. Helius and Triton are solid choices for Solana mainnet.

**Compute unit optimization.** Enable `FLASH_DYNAMIC_CU=true` to pay only for what you use. If you see transactions failing with "exceeded CU limit", increase `FLASH_CU_BUFFER_PCT` to 30-40%.

**Cache behavior.** Oracle prices cache for 5s, market snapshots for 15s, wallet balances for 30s. Post-trade, balance caches are invalidated immediately. These values are not configurable — they are tuned for the balance between freshness and RPC load.

**Agent tick rate.** The agent's tick interval is adaptive (2-30s). In volatile conditions it ticks faster. There is no manual override — the agent manages its own frequency based on market conditions and recent signal quality.

## Docker

```bash
docker build -t flash-terminal .
docker run -it --env-file .env flash-terminal
```

The Docker image includes all dependencies and the compiled TypeScript. Pass your `.env` file at runtime. Do not bake secrets into the image.

For persistent state (wallet store, logs, audit trail), mount the Flash data directory:

```bash
docker run -it \
  --env-file .env \
  -v ~/.flash:/root/.flash \
  flash-terminal
```
