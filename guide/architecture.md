# Architecture

## System Overview

Flash Terminal is built around a layered architecture. Each layer has a single responsibility. Data flows down through parsing, validation, safety enforcement, and protocol interaction before reaching the blockchain.

```
CLI Interface → Interpreter → Tool Engine → Safety Pipeline → Flash Client → Solana
```

```
┌─────────────────────────────────────────────────────┐
│  Layer 1 — Interface                                │
│  CLI REPL · readline · autocomplete · status bar    │
└──────────────────────┬──────────────────────────────┘
                       │ raw input string
┌──────────────────────▼──────────────────────────────┐
│  Layer 2 — Interpretation                           │
│  Regex parser (trades) · NLP fallback (read-only)   │
│  Zod schema validation · market resolution          │
└──────────────────────┬──────────────────────────────┘
                       │ ParsedIntent (typed, validated)
┌──────────────────────▼──────────────────────────────┐
│  Layer 3 — Execution                                │
│  Tool dispatch · flash-tools · agent-tools · plugins│
└──────────────────────┬──────────────────────────────┘
                       │ trade parameters
┌──────────────────────▼──────────────────────────────┐
│  Layer 4 — Safety Pipeline                          │
│  Trade limits · rate limiter · confirmation gate     │
│  Signing audit · program whitelist · instruction     │
│  freeze · pre-send simulation                        │
└──────────────────────┬──────────────────────────────┘
                       │ frozen, validated transaction
┌──────────────────────▼──────────────────────────────┐
│  Layer 5 — Protocol                                 │
│  Flash SDK · Solana RPC · failover · reconciliation │
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

Every trade passes through an 11-stage pipeline before reaching the blockchain. Each stage can independently reject the trade.

| Stage | What It Does |
|:------|:-------------|
| **1. Regex Parse** | Extracts structured intent from user input using deterministic regex |
| **2. Zod Validate** | Enforces parameter types and ranges (leverage 1–100x, collateral $10–$10M) |
| **3. Market Resolve** | Maps symbol to Flash Trade pool via `getPoolForMarket()`, checks trading hours |
| **4. Trade Builder** | Computes position size and estimates fees from on-chain `CustodyAccount` data |
| **5. Trade Limits** | Enforces configurable caps (`MAX_COLLATERAL_PER_TRADE`, `MAX_POSITION_SIZE`, `MAX_LEVERAGE`) |
| **6. Rate Limiter** | Prevents rapid submissions (default: 10/min, 3s minimum delay) |
| **7. Confirmation Gate** | Displays full trade summary with risk preview, requires explicit `yes` |
| **8. Signing Audit** | Logs trade attempt to `~/.flash/signing-audit.log` (never logs keys) |
| **9. Program Whitelist** | Validates all instructions against approved programs, then freezes with `Object.freeze()` |
| **10. Pre-Send Simulation** | Simulates transaction on-chain (~200ms). Program errors abort immediately |
| **11. Broadcast + Reconcile** | Sends transaction, polls confirmation for 45s, verifies position on-chain |

### Confirmation Gate

Before signing, the user sees a full trade preview:

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

## Dual Client Architecture

Flash Terminal uses an `IFlashClient` interface that abstracts the underlying implementation:

| Client | Mode | Transactions | Fee Source |
|:-------|:-----|:-------------|:-----------|
| `FlashClient` | Live | Real on-chain | `CustodyAccount` |
| `SimulatedFlashClient` | Simulation | Paper trades (in-memory) | 0.08% approximation |

Both clients share identical validation, confirmation, and display logic. The safety pipeline (stages 1–9) runs in both modes.

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

See [Data Sources](/guide/data-sources) for full details on caching, validation, and fallback behavior.

## Protocol Alignment

Flash Terminal delegates all protocol math to the Flash SDK. No protocol logic is reimplemented.

| Calculation | Source |
|:------------|:-------|
| Fee rates | `CustodyAccount.fees` / `RATE_POWER` |
| Max leverage | `CustodyAccount.pricing.maxLeverage` / `BPS_POWER` |
| Liquidation price | `getLiquidationPriceContractHelper()` |
| Maintenance margin | `1 / maxLeverage` (derived from on-chain) |
| Position state | `getUserPositions()` |

The `protocol verify` command runs 6 real-time checks to confirm CLI calculations match on-chain state. See [Protocol Alignment](/guide/protocol-alignment) for details.

## Project Structure

```
src/
  cli/            Terminal REPL, autocomplete, status bar
  ai/             Intent parsing (regex + NLP fallback)
  tools/          Tool engine, trading tools, doctor diagnostics
  client/         Flash SDK client (live) + paper trading client (sim)
  agent/          Analysis, scanner, dashboard tools
  core/           Transaction engine, state reconciliation, middleware
  risk/           TP/SL engine, liquidation risk, exposure
  monitor/        Background risk monitoring, event tracking
  security/       Signing guard, circuit breaker, trading gate
  network/        RPC manager, multi-endpoint failover
  protocol/       Protocol inspector
  wallet/         Keypair management, wallet store
  journal/        Trade journal, crash recovery
  data/           Price service (Pyth), fstats client
  config/         Environment config, pool/market mapping
  observability/  Metrics, alert hooks
  plugins/        Dynamic plugin loader
  types/          Types, enums, Zod schemas
  utils/          Logger, formatting, safe math
```

## Key Design Decisions

| Decision | Rationale |
|:---------|:----------|
| Regex parsing for trades | Deterministic — same input always produces same action |
| AI never touches trades | NLP handles read-only queries only |
| Protocol parameters from on-chain | Fee rates, leverage, margins read from `CustodyAccount` |
| Blockchain state is authoritative | Reconciler overwrites local state after 2 consecutive mismatches |
| No fabricated data | Missing data returns empty results, never synthetic values |
| SDK delegation | All protocol math uses Flash SDK helpers |
| Program ID whitelist | Only approved programs can be targeted |
| Instruction freeze | `Object.freeze()` after validation prevents mutation before signing |
| Bounded caches | Every cache has max size + TTL eviction |
| Separate signing audit log | Every trade attempt recorded with outcome |
