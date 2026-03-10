# Data Sources

Flash Terminal sources all data from the Flash Trade protocol, Pyth Hermes oracle, and the fstats analytics API. No data is fabricated or synthetically generated.

## Source Map

| Data | Source | Cache TTL | Validation |
|:-----|:-------|:----------|:-----------|
| **Oracle prices** | Pyth Hermes API | 5 seconds | Staleness <30s, confidence <2%, deviation <50% |
| **Fee rates** | `CustodyAccount` (on-chain) | ~60s (slot-based) | `ProtocolParameterError` on corruption |
| **Max leverage** | `CustodyAccount.pricing` (on-chain) | ~60s (slot-based) | Invariant validation |
| **Positions** | Flash SDK `getUserPositions()` | Real-time | `Number.isFinite()` on all fields |
| **Liquidation prices** | Flash SDK `getLiquidationPriceContractHelper()` | Real-time | Divergence detection (0.5%) |
| **Open interest** | fstats API | 15 seconds | Response size <2MB |
| **Volume** | fstats API | Per-request | Response size <2MB |
| **Wallet balances** | Solana RPC | 30 seconds | Numeric guards |
| **Pool config** | Flash SDK `PoolConfig` | Static | Loaded from SDK |

## Pyth Hermes Oracle

Flash Terminal uses the same Pyth Hermes oracle feeds that the Flash Trade protocol uses on-chain. Prices are fetched from `hermes.pyth.network`.

Each price includes three components:

- **Price** — The aggregated oracle price
- **Confidence** — Uncertainty range (e.g., ±$0.03)
- **Timestamp** — When the price was published

### Safety Checks

Three validation gates before any price is accepted:

| Check | Threshold | Purpose |
|:------|:----------|:--------|
| **Staleness** | >30 seconds | Reject old prices |
| **Confidence** | >2% of price | Reject uncertain prices |
| **Deviation** | >50% from cached | Reject suspicious jumps |

## CustodyAccount

Protocol parameters (fees, leverage, margin) come from `CustodyAccount` — a per-asset Solana account. Fetched via:

```typescript
const rawData = await perpClient.program.account.custody.fetch(custodyAddress);
const custodyAcct = CustodyAccount.from(custodyAddress, rawData);
```

### Cache Invalidation

Cache uses Solana slot tracking, not wall-clock time:

```
Slot-based: stale after ~150 slots (~60 seconds)
Fallback: 60-second TTL if slot unavailable
Cache size: bounded at 50 entries
```

If the RPC fails, conservative SDK defaults are used (0.08% fees, 100x max leverage) with `source: 'sdk-default'` annotation. If `CustodyAccount` returns corrupted data, a `ProtocolParameterError` is thrown — the CLI never silently falls back on bad data.

## fstats API

Protocol-wide analytics come from the fstats API:

| Endpoint | Data |
|:---------|:-----|
| `/overview/stats` | Protocol overview metrics |
| `/positions/open-interest` | Per-market OI breakdown |
| `/volume/daily` | Daily volume data |
| `/fees/daily` | Fee revenue and distribution |
| `/leaderboards/*` | Top trader rankings |
| `/traders/*` | Individual trader profiles |

Responses are validated:
- Maximum 2MB response size with streaming abort
- 10-second timeout
- Content-type validation

## Deterministic Guarantee

Flash Terminal guarantees deterministic protocol interaction:

1. **No synthetic analytics** — If data is unavailable, the command returns empty or an error. Never fabricated.
2. **Protocol is authoritative** — On-chain state always overrides local state (state reconciliation).
3. **SDK is the interface** — All protocol interactions go through Flash SDK. No custom instruction building.
4. **Fallback is visible** — When using SDK defaults instead of on-chain data, the `source` field reports `'sdk-default'`.
