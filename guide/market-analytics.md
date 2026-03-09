# Market Analytics & Observability

The terminal includes built-in analytics and observability tools powered exclusively by real data sources. If a data source is unavailable, the terminal returns empty results. It never fabricates data.

## Analytics Commands

### scan

Multi-strategy market scanner that identifies trading opportunities across all markets.

```bash
scan
```

Runs three strategies:

| Strategy | Signal Source | Logic |
|----------|-------------|-------|
| **Momentum** | Volume history | Identifies markets with increasing volume trends |
| **Mean Reversion** | OI skew | Detects extreme long/short imbalances likely to revert |
| **Whale Follow** | Large positions | Tracks whale positioning for directional signals |

Each opportunity shows: market, direction, confidence score, and supporting data.

### analyze \<asset\>

Deep analysis of a specific market.

```bash
analyze SOL
```

Includes current price, 24h change, market regime classification, strategy signals with confidence, open interest breakdown, and volume trends.

### volume

Daily volume breakdown across the protocol.

```bash
volume
```

Shows total volume, trade count, long/short split, and liquidation volume.

### open interest

Current open interest by market.

```bash
open interest
```

Shows long and short OI, position counts, and skew ratio for each market.

### leaderboard

Top traders on Flash Trade, ranked by PnL or volume.

```bash
leaderboard
```

Shows address, PnL, volume, trade count, and win rate.

### whale activity

Recent large trades and positions above $10,000 USD.

```bash
whale activity
```

Shows market, side, size, and entry details for whale positions.

## Observability Commands

### liquidations \<market\>

Liquidation clusters by price zone, derived from open interest distribution.

```bash
liquidations SOL
```

### funding \<market\>

Funding rate with projected accumulation and OI imbalance.

```bash
funding SOL
```

### depth \<market\>

Liquidity depth around current price using an exponential decay model.

```bash
depth SOL
```

### protocol health

Protocol-wide health metrics including RPC latency and block height.

```bash
protocol health
```

## Data Sources

| Source | Cache TTL | Max Entries / Size |
|--------|-----------|-------------------|
| CoinGecko prices | 15 seconds | 100 entries |
| Pyth oracle prices | 5 seconds | 50 entries |
| fstats API | Per-request | 2MB response limit |
| Protocol Inspector | 15 seconds | Stale fallback on failure |

## Data Integrity

All analytics commands follow a strict data integrity policy:

- Data is never fabricated or filled with hardcoded fallback values
- If a source is unavailable, the command returns empty results or displays "Data unavailable"
- All numeric values include `Number.isFinite()` guards
- Response body sizes are capped to prevent out-of-memory conditions
