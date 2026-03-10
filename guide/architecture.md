# Architecture

## System Overview

Flash Terminal is a 5-layer system. Each layer has a single responsibility and a strict boundary. Data flows down through parsing, validation, safety enforcement, and protocol interaction before reaching the blockchain.

```
┌─────────────────────────────────────────────────────┐
│  Layer 1 — Interface                                │
│  CLI REPL · readline · autocomplete · status bar    │
└──────────────────────┬──────────────────────────────┘
                       │ raw input string
┌──────────────────────▼──────────────────────────────┐
│  Layer 2 — Interpretation                           │
│  Regex parser (trades) · NLP + LLM (read-only)     │
│  Zod schema validation · market resolution          │
└──────────────────────┬──────────────────────────────┘
                       │ ParsedIntent (typed, validated)
┌──────────────────────▼──────────────────────────────┐
│  Layer 3 — Execution                                │
│  Tool dispatch · middleware pipeline                 │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │flash-tools │  │agent-tools │  │plugin-tools│    │
│  │ open/close │  │ scan/analyze│  │ extensions │    │
│  │ add/remove │  │ dashboard  │  │            │    │
│  └────────────┘  └────────────┘  └────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │ trade parameters
┌──────────────────────▼──────────────────────────────┐
│  Layer 4 — Safety Pipeline                          │
│  Trade limits · rate limiter · confirmation gate     │
│  Signing audit · program ID whitelist                │
│  Instruction freeze · pre-send simulation            │
└──────────────────────┬──────────────────────────────┘
                       │ frozen, validated transaction
┌──────────────────────▼──────────────────────────────┐
│  Layer 5 — Protocol                                 │
│  IFlashClient · Flash SDK · Solana RPC              │
│  Failover · retry · confirm · reconcile             │
└──────────────────────┬──────────────────────────────┘
                       │
                  [ Blockchain ]
```

### Layer Boundaries

| Layer | Input | Output | AI Involved? |
|:------|:------|:-------|:-------------|
| Interface | Keystrokes | Raw string | No |
| Interpretation | Raw string | `ParsedIntent` | Read-only queries only |
| Execution | `ParsedIntent` | Trade parameters | Analysis tools only |
| Safety Pipeline | Trade parameters | Frozen transaction | Never |
| Protocol | Transaction | On-chain state change | Never |

Trade commands **never** pass through AI. The regex parser produces a deterministic `ParsedIntent` — same input always produces the same action.

## Trading Pipeline

Every trade passes through an 11-stage pipeline before reaching the blockchain. Each stage can reject the trade.

```
Input ──► Regex Parse ──► Zod Validate ──► Market Resolve
                                                │
          ┌─────────────────────────────────────┘
          ▼
    Trade Builder ──► Trade Limits ──► Rate Limiter
                                           │
          ┌────────────────────────────────┘
          ▼
    Confirmation Gate ──► Signing Audit ──► Program ID Whitelist
                                                │
          ┌─────────────────────────────────────┘
          ▼
    Instruction Freeze ──► Pre-Send Simulation ──► Broadcast
                                                       │
          ┌────────────────────────────────────────────┘
          ▼
    Confirm + Reconcile
```

### Stage 1 — Regex Parser

Extracts structured intent from user input using deterministic regex patterns.

```bash
open 5x long SOL $100
# → { action: OpenPosition, market: SOL, side: Long, leverage: 5, collateral: 100 }
```

No AI model is involved. The parser is deterministic and auditable.

### Stage 2 — Zod Validation

Validates all parameters against typed schemas:

- Leverage: 1–100x (integer)
- Collateral: $10–$10,000,000
- Market: must exist in `PoolConfig`
- Side: `long` or `short`

Invalid parameters are rejected with a clear error before any further processing.

### Stage 3 — Market Resolution

Resolves the market symbol to a Flash Trade pool using `getPoolForMarket()`. Checks trading hours for virtual markets (commodities, forex). Rejects if the market is closed or unknown.

### Stage 4 — Trade Builder

Computes position size and estimates fees from on-chain data:

```
Position Size = Collateral × Leverage
Open Fee      = Position Size × CustodyAccount.fees.openPosition / RATE_POWER
Close Fee     = Position Size × CustodyAccount.fees.closePosition / RATE_POWER
```

In live mode, fee rates come from `CustodyAccount` on-chain. In simulation mode, a 0.08% (8 bps) approximation is used.

### Stage 5 — Trade Limits

Enforces configurable caps before the user sees the confirmation:

| Limit | Source | Default |
|:------|:-------|:--------|
| Max collateral per trade | `MAX_COLLATERAL_PER_TRADE` | Unlimited |
| Max position size | `MAX_POSITION_SIZE` | Unlimited |
| Max leverage | `MAX_LEVERAGE` | 100x |

Trades exceeding limits are rejected immediately.

### Stage 6 — Rate Limiter

Prevents rapid-fire trade submissions:

| Control | Source | Default |
|:--------|:-------|:--------|
| Max trades per minute | `MAX_TRADES_PER_MINUTE` | 10 |
| Min delay between trades | `MIN_DELAY_BETWEEN_TRADES_MS` | 3000ms |

### Stage 7 — Confirmation Gate

Displays a full trade summary with risk preview. The user must type `yes` to proceed.

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

### Stage 8 — Signing Audit

Every trade attempt is logged to `~/.flash/signing-audit.log` with timestamp, action, market, side, leverage, amounts, wallet address, and result. Private keys are never logged.

### Stage 9 — Program ID Whitelist

All transaction instructions are validated against an approved program list:

| Approved Programs | Source |
|:------------------|:-------|
| System, Token, ATA, ComputeBudget, Sysvars | Solana system programs |
| Flash Trade programs | Loaded dynamically from `PoolConfig` per pool |

Any instruction targeting an unknown program is **immediately rejected**. After validation, the instruction array is frozen with `Object.freeze()` to prevent mutation between validation and signing.

### Stage 10 — Pre-Send Simulation

On the first attempt, the transaction is simulated against the Solana runtime (~200ms):

- **Program errors** (invalid instruction, insufficient balance) → abort immediately, no retry
- **Network errors** (timeout, 429, 503) → retry with RPC failover

### Stage 11 — Broadcast + Reconciliation

The signed transaction is broadcast and confirmed:

1. Fetch fresh blockhash
2. `sendRawTransaction` with `maxRetries: 3`
3. Poll `getSignatureStatuses` for 45 seconds with periodic resends
4. On network failure: switch RPC endpoint, retry with fresh blockhash (up to 2 retries)

After confirmation, the [state reconciler](/guide/infrastructure) verifies the position exists on-chain. If the local state doesn't match blockchain state after 2 consecutive cycles, the blockchain state is accepted as authoritative.

## Dual Client Architecture

Flash Terminal uses an `IFlashClient` interface that abstracts the underlying implementation:

| Client | Mode | Transactions | State | Fee Source |
|:-------|:-----|:-------------|:------|:-----------|
| `FlashClient` | Live | Real on-chain | Blockchain | `CustodyAccount` |
| `SimulatedFlashClient` | Simulation | Paper trades | In-memory | 0.08% approximation |

All tools interact through `IFlashClient`. This ensures simulation and live trading share identical validation, confirmation, and display logic. The safety pipeline (stages 1–6) runs in both modes.

## Data Flow

```
                  ┌──────────────┐
                  │  Pyth Hermes │ ─── Oracle prices (5s cache)
                  └──────┬───────┘
                         │
┌──────────┐    ┌────────▼────────┐    ┌──────────────┐
│ Flash SDK│────│  Flash Terminal │────│  fstats API  │
│          │    │                  │    │              │
│PoolConfig│    │  IFlashClient   │    │ OI, volume   │
│Custody   │    │  RPC Manager    │    │ whales, fees │
│Position  │    │  Risk Monitor   │    │ leaderboard  │
└──────────┘    └────────┬────────┘    └──────────────┘
                         │
                ┌────────▼────────┐
                │   Solana RPC    │
                │  (multi-endpoint│
                │   with failover)│
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │  Flash Trade    │
                │  Program        │
                └─────────────────┘
```

| Data | Source | Cache | Validation |
|:-----|:-------|:------|:-----------|
| Oracle prices | Pyth Hermes | 5s TTL | Staleness <30s, confidence <2% |
| Fee rates, leverage | `CustodyAccount` (on-chain) | ~60s slot-based | `ProtocolParameterError` on corruption |
| Positions | Flash SDK `getUserPositions()` | Real-time | `Number.isFinite()` on all fields |
| Liquidation prices | Flash SDK `getLiquidationPriceContractHelper()` | Real-time | 0.5% divergence detection |
| OI, volume, whales | fstats API | 15s TTL | Response size <2MB |
| Pool/market config | Flash SDK `PoolConfig` | Static | Loaded from SDK at startup |

## Protocol Alignment

Flash Terminal does not reimplement protocol logic. All critical calculations delegate to Flash SDK or on-chain state:

| Calculation | Source | Not Used |
|:------------|:-------|:---------|
| Fee rates | `CustodyAccount.fees` / `RATE_POWER` | Hardcoded rates |
| Max leverage | `CustodyAccount.pricing.maxLeverage` / `BPS_POWER` | Assumed values |
| Liquidation price | `getLiquidationPriceContractHelper()` | Custom formula |
| Maintenance margin | `1 / maxLeverage` (derived from on-chain) | Fixed percentage |
| Position state | `getUserPositions()` | Local tracking alone |

The `protocol verify` command runs 6 real-time checks to confirm CLI calculations match on-chain state. See [Protocol Alignment](/guide/protocol-alignment) for details.

## Project Structure

```
src/
  cli/            Terminal REPL, autocomplete, status bar, theme
  ai/             Intent parsing (regex + NLP + LLM fallback)
  tools/          Tool definitions, registry, dispatch engine
  client/         Flash SDK client (live) + paper trading client (sim)
  agent/          AI-powered analysis, scanner, dashboard, autopilot
  strategies/     Momentum, mean reversion, whale follow
  scanner/        Multi-market opportunity scanner
  portfolio/      Allocation, exposure, rebalance calculations
  risk/           Liquidation risk, exposure computation
  monitor/        Real-time background risk monitoring engine
  protocol/       Flash Trade protocol inspector
  core/           Execution middleware, state reconciliation
  network/        RPC endpoint management with failover
  security/       Signing guard, rate limiter, audit logging
  wallet/         Keypair management, wallet store
  data/           CoinGecko, fstats.io API clients
  config/         Environment config, pool/market mapping
  types/          All types, enums, interfaces, Zod schemas
  utils/          Logger, retry, formatting, safe math
  plugins/        Plugin loader and dynamic tool registration
```

## Key Design Decisions

| Decision | Rationale |
|:---------|:----------|
| Regex parsing for trades | Deterministic execution — same input always produces same action |
| AI never touches trades | NLP/LLM handles read-only queries only. Trade execution is fully deterministic |
| Protocol parameters from on-chain | Fee rates, leverage limits, margins all read from `CustodyAccount` |
| Blockchain state is authoritative | Reconciler overwrites local state from on-chain data after 2 mismatches |
| No fabricated data | Missing data returns empty results — never synthetic values |
| SDK delegation | Liquidation price, position management, pool config all use Flash SDK helpers |
| Program ID whitelist | Only approved Solana + Flash Trade programs can be targeted |
| Instruction freeze | `Object.freeze()` after validation prevents mutation before signing |
| Bounded caches everywhere | Every cache has max size + TTL eviction. No unbounded growth |
| All timers use `.unref()` | Background tasks never prevent Node.js from exiting |
| Separate signing audit log | Every trade attempt recorded with outcome and wallet address |
| 11-stage safety pipeline | Defense-in-depth: each stage can independently reject a trade |
