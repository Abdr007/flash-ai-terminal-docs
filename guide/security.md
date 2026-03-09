# Security & Safety

FT implements defense-in-depth for trading operations. Every trade passes through multiple safety layers before reaching the blockchain.

## Deterministic Execution

FT uses structured regex parsing for all trade commands. The AI interpreter handles natural language queries (e.g., "how is SOL doing?") but is never involved in trade execution.

- Same input always produces the same action
- No model inference can alter trade parameters
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

Type "yes" to sign or "no" to cancel
```

The user must explicitly type `yes` to proceed.

## Signing Guard

The signing guard enforces configurable limits on all trades:

| Limit | Environment Variable | Default |
|-------|---------------------|---------|
| Max collateral per trade | `MAX_COLLATERAL_PER_TRADE` | Unlimited |
| Max position size | `MAX_POSITION_SIZE` | Unlimited |
| Max leverage | `MAX_LEVERAGE` | 100x |
| Max trades per minute | `MAX_TRADES_PER_MINUTE` | 10 |
| Min delay between trades | `MIN_DELAY_BETWEEN_TRADES_MS` | 3000ms |

Trades exceeding these limits are rejected before reaching the confirmation step.

## Signing Audit Log

Every trade attempt is recorded in `~/.flash/signing-audit.log`:

```
[2026-03-09T12:00:00Z] open SOL long 5x $100 wallet:ABDR → confirmed
[2026-03-09T12:01:00Z] close SOL long wallet:ABDR → rejected (rate_limited)
[2026-03-09T12:02:00Z] open ETH short 10x $500 wallet:ABDR → failed (insufficient_balance)
```

Fields logged: timestamp, action, market, side, leverage, amounts, wallet address, result. Private keys are never logged.

## Mode Lock

Flash Terminal prompts users to select Simulation or Live mode at startup. The selected mode is locked for the entire session. There is no command or API to switch modes mid-session.

| Mode | Behavior |
|------|----------|
| Simulation | Paper trading only. No transactions signed. |
| Live | Real on-chain execution. Transactions signed and broadcast. |

## RPC Health Validation

Before live trades, the terminal validates RPC health:

- Latency must be below 3 seconds
- Slot lag must be below 50
- Endpoint must be reachable

If health is degraded, a warning is displayed before proceeding.

## Position Verification

Before close, add-collateral, and remove-collateral operations, the terminal queries the blockchain to verify the target position exists. If missing, the reconciliation engine retries before reporting an error.

## Wallet Security

| Protection | Implementation |
|------------|---------------|
| File permissions | Keypair files stored with `0600` (owner-only read/write) |
| Key logging | Private keys never written to logs or console |
| Import security | Terminal input hidden during wallet import |
| Path validation | File paths restricted to home directory, symlinks resolved |
| API key scrubbing | Keys masked in all log output (`sk-ant-***`, `gsk_***`, `api_key=***`) |

## Pre-Send Simulation

On the first transaction attempt, FT simulates the transaction using Solana's runtime before broadcasting:

- Catches program errors (invalid instruction, insufficient balance) before spending fees
- Reports compute unit usage
- Program errors abort immediately; network errors trigger retry with failover

## Safety Layers

Every trade passes through the following layers in order:

```
Input
  │
  ▼
Regex Parsing ─── deterministic intent extraction
  │
  ▼
Zod Validation ─── parameter type and range enforcement
  │
  ▼
Trade Limits ─── configurable caps on size, leverage, collateral
  │
  ▼
Rate Limiter ─── prevents rapid-fire submissions
  │
  ▼
Confirmation Gate ─── full summary with risk preview
  │
  ▼
Signing Audit ─── trade attempt recorded to disk
  │
  ▼
Pre-Send Simulation ─── catch errors before broadcast
  │
  ▼
RPC Health Check ─── verify endpoint before signing
  │
  ▼
Position Verification ─── confirm target exists before modify
  │
  ▼
State Reconciliation ─── post-trade on-chain verification
  │
  ▼
Blockchain
```
