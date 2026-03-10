# Security Model

Flash Terminal implements defense-in-depth for all trading operations. Every trade passes through multiple safety layers before reaching the blockchain.

## Safety Pipeline

```
Input
  │
  ▼
Regex Parsing ─── Deterministic intent extraction
  │
  ▼
Zod Validation ─── Parameter type and range enforcement
  │
  ▼
Program ID Whitelist ─── Only approved Solana programs
  │
  ▼
Trade Limits ─── Configurable caps on size, leverage, collateral
  │
  ▼
Rate Limiter ─── Prevents rapid-fire submissions
  │
  ▼
Confirmation Gate ─── Full summary with risk preview
  │
  ▼
Signing Audit ─── Trade attempt recorded to disk
  │
  ▼
Instruction Freeze ─── Object.freeze() prevents mutation before signing
  │
  ▼
Pre-Send Simulation ─── Catch program errors before broadcast
  │
  ▼
RPC Health Check ─── Verify endpoint before signing
  │
  ▼
State Reconciliation ─── Post-trade on-chain verification
  │
  ▼
Blockchain
```

## Deterministic Execution

Trade commands are parsed with structured regex. The NLP interpreter handles read-only queries (e.g., "how is SOL doing?") but is never involved in trade execution.

- Same input always produces the same action
- No model inference can alter trade parameters
- Execution is auditable and reproducible

## Program ID Whitelist

Before any transaction is signed, all instructions are validated against an approved program whitelist:

| Program | Source |
|:--------|:-------|
| Solana system programs | System, Token, ATA, ComputeBudget, Sysvars |
| Flash Trade programs | Loaded dynamically from `PoolConfig` per pool |

Any instruction targeting an unknown program is **immediately rejected**. After validation, the instruction array is frozen with `Object.freeze()` to prevent mutation between validation and signing.

## Protocol Parameter Validation

Before any trade, protocol parameters fetched from `CustodyAccount` are validated:

| Check | Condition | Action on failure |
|:------|:----------|:------------------|
| Fee rates | Must be `Number.isFinite()`, non-negative | `ProtocolParameterError` |
| Fee rate sanity | Must be below 10% | `ProtocolParameterError` |
| Max leverage | Must be finite and positive | `ProtocolParameterError` |
| Maintenance margin | Must be below 100% | `ProtocolParameterError` |

`ProtocolParameterError` is never silently swallowed. Corrupted `CustodyAccount` data aborts the trade with a clear error message.

## Numeric Guardrails

122 `Number.isFinite()` checks across the codebase prevent NaN/Infinity propagation:

- All position fields validated before use
- All fee calculations guarded
- Balance floored at zero (`Math.max(returnAmount, 0)`)
- Bad positions skipped with logging — never used in calculations

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
  Est. Fee:    $0.40  (0.08%)
  Wallet:      ABDR...7x4f

  Est. Entry:  $148.52
  Est. Liq:    $121.79
  Distance:    18.0%
  Risk:        HIGH

Type "yes" to sign or "no" to cancel
```

The user must explicitly type `yes` to proceed.

## Signing Guard

Configurable trade limits enforced before confirmation:

| Limit | Environment Variable | Default |
|:------|:---------------------|:--------|
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
```

Fields: timestamp, action, market, side, leverage, amounts, wallet address, result. Private keys are **never** logged.

## Pre-Send Simulation

On the first transaction attempt, the CLI simulates the transaction using Solana's runtime before broadcasting:

- Catches program errors (invalid instruction, insufficient balance) in ~200ms
- Program errors abort immediately — no retry
- Network errors trigger retry with RPC failover

## RPC Corruption Detection

- Slot lag detection: endpoints >50 slots behind trigger failover
- Latency threshold: >3 seconds triggers warning
- Health monitoring: background checks every 30 seconds
- Connection pinning: same RPC used for entire transaction lifecycle
- 60-second cooldown prevents failover oscillation

## Mode Lock

Mode is selected at startup and locked for the session. No mid-session switching.

| Mode | Behavior |
|:-----|:---------|
| Simulation | Paper trading. No transactions signed. |
| Live | Real on-chain execution. Transactions signed and broadcast. |

## Wallet Security

| Protection | Implementation |
|:-----------|:---------------|
| File permissions | Keypair files stored with `0600` (owner-only read/write) |
| Key logging | Private keys never written to logs or console |
| Import security | Terminal input hidden during wallet import |
| Path validation | File paths restricted to home directory, symlinks resolved |
| API key scrubbing | Keys masked in all log output (`sk-ant-***`, `gsk_***`) |
| Disconnect | `wallet disconnect` zeros secret key bytes in memory |

## Duplicate Trade Prevention

- **Signature cache**: Recent transaction signatures cached for 60 seconds. Prevents resubmission of a trade that already landed.
- **Trade mutex**: One trade at a time per market/side. Prevents concurrent state corruption.
- **Duplicate position check**: Queries on-chain before opening — rejects if position already exists on same market/side.

## State Reconciliation

After every trade and every 60 seconds in live mode:

1. Fetch authoritative positions from blockchain
2. Validate numeric integrity (reject NaN/Infinity/zero)
3. Compare with locally tracked positions
4. If mismatch persists across 2 consecutive cycles, accept blockchain state
5. Log all events to `~/.flash/logs/reconcile.log`

Blockchain state is always authoritative.
