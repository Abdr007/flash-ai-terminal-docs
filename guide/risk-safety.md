# Risk & Safety

Flash Terminal has 10 independent safety layers protecting every live trade. They cannot be bypassed by command input or by configuration.

## Safety Layers

### 1. Trade Confirmation Gate

Every live trade displays a full summary before signing:

```
  Market:      SOL/USD LONG
  Leverage:    5x
  Collateral:  $500.00
  Size:        $2,500.00
  Est. Fee:    $2.00
  Est. Liq:    $121.39
  Wallet:      ABDR...7x4f

  Proceed? [y/N]
```

You must type `yes`. There is no auto-confirm in live mode.

### 2. Signing Guard

Per-trade limits enforced before any transaction is signed:

```bash
MAX_COLLATERAL_PER_TRADE=1000    # Max collateral per trade
MAX_POSITION_SIZE=50000          # Max position size
MAX_LEVERAGE=50                  # Max leverage
```

### 3. Rate Limiter

Prevents rapid-fire trades:

```bash
MAX_TRADES_PER_MINUTE=10         # Default: 10
MIN_DELAY_BETWEEN_TRADES_MS=3000 # Default: 3 seconds
```

### 4. Circuit Breaker

Halts all trading when cumulative losses exceed thresholds:

```bash
MAX_SESSION_LOSS_USD=500         # Per-session loss limit
MAX_DAILY_LOSS_USD=1000          # Per-day loss limit (resets midnight UTC)
```

When tripped, all trade operations return an error immediately. Monitoring and position queries remain functional. Restart the terminal to reset.

### 5. Kill Switch

Master toggle that disables all trades:

```bash
TRADING_ENABLED=false
```

### 6. Exposure Control

Limits total portfolio exposure as a fraction of account value:

```bash
MAX_PORTFOLIO_EXPOSURE=0.8       # 80% max
```

### 7. Pre-Flight Simulation

Every transaction is simulated on-chain before broadcast. Program errors (insufficient margin, invalid leverage, etc.) abort before any funds are at risk.

### 8. Program Whitelist

Only approved programs can be targeted by transactions:
- Solana system programs (System, Token, ATA, ComputeBudget)
- Flash Trade programs (loaded dynamically from PoolConfig)

Any instruction targeting an unknown program is rejected.

### 9. Instruction Freeze

After validation, the instruction array is frozen with `Object.freeze()`. No code can mutate instructions between validation and signing.

### 10. Trade Mutex & Duplicate Detection

- A mutex prevents concurrent transaction submissions
- Recent transaction signatures are cached (60s TTL) to detect and block duplicate submissions
- Flash Trade rejects duplicate positions on the same market/side

## Signing Audit Log

Every trade attempt is logged to `~/.flash/signing-audit.log`:

```
2026-03-27T14:32:01Z | OPEN | SOL LONG | 5x | $500 | CONFIRMED
2026-03-27T14:35:12Z | CLOSE | SOL LONG | CONFIRMED
2026-03-27T14:40:00Z | OPEN | BTC SHORT | REJECTED:RATE_LIMIT
```

This log never contains private keys or sensitive data.

## Simulation Safety

Simulation mode adds another layer: **no transactions are ever signed or broadcast**. The blockchain is never touched. Mode is locked per session to prevent accidental live trading.

## Diagnostics

```bash
doctor              # Full system health check
risk report         # Position risk assessment
exposure            # Portfolio exposure breakdown
system audit        # Protocol data integrity verification
```

## Next Steps

- [Configuration](/guide/configuration) — Set your risk limits
- [Trading Guide](/guide/trading-guide) — Understand liquidation
- [Troubleshooting](/guide/troubleshooting) — Fix common issues
