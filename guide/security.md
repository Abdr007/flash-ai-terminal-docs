# Security & Safety

FAT implements defense-in-depth for trading operations. Every trade passes through multiple safety layers before reaching the blockchain.

## Why Deterministic Execution Matters

In trading infrastructure, ambiguity is risk. If a user types `open 5x long SOL $100`, the system must execute exactly that trade — not a different interpretation of the same words.

FAT uses structured regex parsing for all trade commands. The AI interpreter is used only for natural language queries (e.g., "how is SOL doing?"), never for trade execution.

This means:
- Same input always produces the same action
- No model hallucination can alter trade parameters
- Execution is auditable and reproducible

## Transaction Confirmation

Every trade displays a full summary before execution:

```
CONFIRM TRANSACTION
─────────────────────────────────
  Market:      SOL LONG
  Pool:        Crypto.1
  Leverage:    5x
  Collateral:  $100.00 USDC
  Size:        $500.00
  Est. Fee:    $0.40
  Wallet:      ABDR...7x4f

  Risk Preview:
    Est. Entry:   $148.52
    Est. Liq:     $121.79
    Distance:     18.0%
    Risk:         HIGH
    Exposure:     $0.00 → $500.00

  ! High leverage (5x) — liquidation risk is significant

  This will execute a REAL on-chain transaction.

Type "yes" to sign or "no" to cancel
```

In live mode, the header is displayed in red and the real-transaction warning is prominent. The user must explicitly type `yes` to proceed.

## Signing Guard

The signing guard enforces configurable limits on all trades:

| Limit | Environment Variable | Default |
|-------|---------------------|---------|
| Max collateral per trade | `MAX_COLLATERAL_PER_TRADE` | Unlimited |
| Max position size | `MAX_POSITION_SIZE` | Unlimited |
| Max leverage | `MAX_LEVERAGE` | Market default |
| Max trades per minute | `MAX_TRADES_PER_MINUTE` | 10 |
| Min delay between trades | `MIN_DELAY_BETWEEN_TRADES_MS` | 3000ms |

Trades exceeding limits are rejected before reaching the confirmation step.

## Signing Audit Log

Every trade attempt is recorded in `~/.flash/signing-audit.log`:

```
[2026-03-09T12:00:00Z] open SOL long 5x $100 → confirmed
[2026-03-09T12:01:00Z] close SOL long → rejected (rate_limited)
[2026-03-09T12:02:00Z] open ETH short 10x $500 → failed (insufficient_balance)
```

Fields: timestamp, action, market, side, amounts, wallet address, result. Private keys are never logged.

## Simulation Guard

Simulation mode is determined at startup and locked for the session:

| Setting | Behavior |
|---------|----------|
| `SIMULATION_MODE=true` | Paper trading only. No transactions signed. |
| `SIMULATION_MODE=false` | Live trading enabled. Real on-chain execution. |

There is no command or API to switch modes during a session.

## RPC Health Validation

Before live trades, the terminal checks RPC health:

- Latency must be below 3 seconds
- Slot lag must be below 50
- Endpoint must be reachable

If health is degraded, a warning is displayed before proceeding.

## Position Verification

Before close, add-collateral, and remove-collateral operations:

1. Query current positions from the blockchain
2. Verify the target position exists
3. If missing, retry via the reconciliation engine
4. Display current position details (size, entry, PnL, liquidation) in the confirmation

## Wallet Security

| Protection | Implementation |
|------------|---------------|
| File permissions | Keypair files stored with `0600` (owner-only) |
| Key logging | Private keys never written to logs or console |
| Import security | Terminal input hidden during wallet import |
| Path validation | File paths restricted to home directory, symlinks resolved |
| API key scrubbing | `sk-ant-***`, `gsk_***` in all log output |

## Pre-Send Simulation

On the first transaction attempt, FAT simulates the transaction using Solana's runtime before broadcasting:

- Catches program errors (invalid instruction, insufficient balance)
- Reports compute unit usage
- Prevents wasted transaction fees on known failures

Program errors abort immediately. Network errors trigger retry with failover.

## Summary

| Layer | Protection |
|-------|-----------|
| Regex parsing | Deterministic intent extraction |
| Zod validation | Parameter type and range enforcement |
| Trade limits | Configurable caps on size, leverage, collateral |
| Rate limiter | Prevents rapid-fire submissions |
| Confirmation gate | Full summary with risk preview |
| Signing audit | Complete trade attempt history |
| Pre-send simulation | Catch errors before broadcast |
| RPC health check | Verify endpoint before signing |
| Position verification | Confirm target exists before modify |
| State reconciliation | Post-trade on-chain verification |
