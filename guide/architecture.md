# Architecture

## System Overview

Flash Terminal follows a layered architecture where each component has a single responsibility. User input flows through parsing, validation, and safety checks before reaching the blockchain.

```
┌─────────────────────────────────────────────┐
│                 User Input                  │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│            Command Interpreter              │
│         regex + NLP + LLM fallback          │
└──────────────────────┬──────────────────────┘
                       │ ParsedIntent
┌──────────────────────▼──────────────────────┐
│            Execution Engine                 │
│          middleware + tool dispatch          │
└──────────────────────┬──────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
  ┌──────▼─────┐ ┌─────▼─────┐ ┌────▼──────┐
  │flash-tools │ │agent-tools│ │plugin     │
  │  trading   │ │ analysis  │ │  tools    │
  └──────┬─────┘ └─────┬─────┘ └────┬──────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              IFlashClient                   │
│   FlashClient (live) │ SimulatedClient (sim)│
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│               Solana RPC                    │
│          failover + retry + confirm         │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│          Flash Trade Program                │
│           on-chain execution                │
└─────────────────────────────────────────────┘
```

## Trading Pipeline

Every trade passes through an 8-stage deterministic pipeline. Each stage adds a layer of protection.

### Stage 1 — CLI Parser

Parses user input into a structured intent using regex patterns.

```bash
open 5x long SOL $100
# → { action: OpenPosition, market: SOL, side: Long, leverage: 5, collateral: 100 }
```

Trade commands **never** rely on AI parsing. The regex patterns ensure `open 5x long SOL $100` always produces the same result.

### Stage 2 — Command Interpreter

Resolves the market to a Flash Trade pool, validates parameters against Zod schemas, and checks market availability (trading hours for virtual markets).

### Stage 3 — Trade Builder

Computes position size, estimates fees, and builds the trade parameters:

```
Position Size = Collateral × Leverage
Estimated Fee = Position Size × Fee Rate
```

Fee rates are read from `CustodyAccount` on-chain data for each market. In simulation mode, the fee rate defaults to 0.08% (8 bps) to approximate typical protocol rates.

### Stage 4 — Simulation Guard

Routes the trade based on operating mode:

- **Simulation** — Executes against the paper trading engine
- **Live** — Continues through the signing pipeline

### Stage 5 — Confirmation Layer

Displays a full trade summary including the [risk preview](/guide/risk-preview):

```
CONFIRM TRANSACTION
─────────────────────────────────
  Market:      SOL LONG
  Leverage:    5x
  Collateral:  $100.00
  Size:        $500.00
  Est. Fee:    $0.40

  Risk Preview:
    Est. Entry:   $148.52
    Est. Liq:     $121.79
    Distance:     18.0%
    Risk:         HIGH
    Exposure:     $0.00 → $500.00
```

The user must type `yes` to proceed.

### Stage 6 — Signing Guard

Enforces configurable trade limits and rate limits:

- Maximum collateral per trade
- Maximum position size
- Maximum leverage
- Trades per minute
- Minimum delay between trades

Every attempt is logged to `~/.flash/signing-audit.log`.

### Stage 7 — RPC Execution

Compiles, signs, and broadcasts the transaction:

1. Fetch fresh blockhash
2. Simulate transaction (first attempt only)
3. Broadcast with `sendRawTransaction`
4. Poll for confirmation with periodic resends
5. Retry up to 3 times with fresh blockhash on failure

Network errors trigger automatic [RPC failover](/guide/infrastructure).

### Stage 8 — State Reconciliation

After confirmation, verifies the position exists on-chain:

1. Query blockchain positions
2. Compare with expected state
3. Update local state to match blockchain

The reconciler also runs every 60 seconds in the background.

## Dual Client Architecture

Flash Terminal uses an `IFlashClient` interface that abstracts the underlying implementation:

| Client | Mode | Transactions | State |
|--------|------|-------------|-------|
| `FlashClient` | Live | Real on-chain | Blockchain |
| `SimulatedFlashClient` | Simulation | Paper trades | In-memory |

All tools interact through `IFlashClient`. This ensures simulation and live trading share identical validation, confirmation, and display logic.

## Project Structure

```
src/
  cli/            Terminal REPL, autocomplete, status bar, theme
  ai/             Intent parsing (regex + NLP + LLM fallback)
  tools/          Tool definitions, registry, dispatch engine
  client/         Flash SDK client + paper trading client
  agent/          AI-powered analysis, scanner, dashboard
  strategies/     Momentum, mean reversion, whale follow
  scanner/        Multi-market opportunity scanner
  portfolio/      Allocation, exposure, rebalance
  risk/           Liquidation risk, exposure computation
  monitor/        Real-time risk monitoring engine
  protocol/       Flash Trade protocol inspector
  core/           Execution middleware, state reconciliation
  network/        RPC endpoint management with failover
  security/       Signing guard, rate limiter, audit logging
  wallet/         Keypair management, wallet store
  data/           CoinGecko, fstats.io API clients
  config/         Environment config, pool/market mapping
  types/          All types, enums, interfaces, Zod schemas
  utils/          Logger, retry, formatting, safe math
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Regex parsing for trades | Deterministic execution — same input always produces same action |
| Blockchain state is authoritative | Reconciler overwrites local state from on-chain data |
| No fabricated data | Missing data returns empty — never synthetic values |
| Bounded caches everywhere | Every cache has max size + TTL eviction. No unbounded growth |
| All timers use `.unref()` | Background tasks never prevent Node.js from exiting |
| Separate signing audit log | Every trade attempt recorded with outcome and wallet address |
