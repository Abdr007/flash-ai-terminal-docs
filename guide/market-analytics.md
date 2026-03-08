# Market Analytics

The terminal includes built-in analytics powered exclusively by real data sources.

## Commands

### Scan

Multi-strategy market scanner that identifies trading opportunities.

```bash
scan
```

Runs three strategies across all markets:

| Strategy | Signal Source | Logic |
|----------|-------------|-------|
| **Momentum** | Volume history | Identifies markets with increasing volume trends |
| **Mean Reversion** | OI skew | Detects extreme long/short imbalances likely to revert |
| **Whale Follow** | Large positions | Tracks whale positioning for directional signals |

Each opportunity shows: market, direction, confidence score, and supporting data.

### Analyze

Deep analysis of a specific market.

```bash
analyze SOL
```

Includes:

- Current price and 24h change
- Market regime classification (trending, ranging, volatile)
- Strategy signals with confidence
- Open interest breakdown
- Volume trends

### Volume

Protocol trading volume over time.

```bash
volume
```

Shows daily volume breakdown including total volume, trade count, long/short split, and liquidation volume.

### Open Interest

Current open interest by market.

```bash
open interest
```

Shows long and short OI, position counts, and the skew ratio for each market.

### Leaderboard

Top traders on Flash Trade.

```bash
leaderboard
```

Ranked by PnL or volume. Shows address, PnL, volume, trade count, and win rate.

### Whale Activity

Recent large trades and positions.

```bash
whale activity
```

Shows positions above $10,000 USD with market, side, size, and entry details.

## Data Sources

All analytics rely on real data:

| Command | Primary Source | Fallback |
|---------|---------------|----------|
| `scan` | CoinGecko + fstats | Empty results |
| `analyze` | CoinGecko + fstats + Pyth | Empty analysis |
| `volume` | fstats API | "Data unavailable" |
| `open interest` | fstats API | Empty markets |
| `leaderboard` | fstats API | Empty leaderboard |
| `whale activity` | fstats API | "No activity detected" |

::: info
If a data source is unavailable, the terminal returns empty results. It never fabricates data or uses hardcoded fallback values.
:::

## Data Freshness

| Source | Cache TTL | Bound |
|--------|-----------|-------|
| CoinGecko prices | 15 seconds | 100 entries |
| Pyth oracle prices | 5 seconds | 50 entries |
| fstats API | Per-request | 2MB response limit |
| Protocol inspector | 15 seconds | Single snapshot |
