# Market Analytics

Flash Terminal includes analytics and observability tools powered by live data from Pyth Hermes, fstats API, and on-chain state. If a data source is unavailable, the terminal returns empty results — never fabricated data.

## Analytics Commands

### scan

Multi-strategy market scanner across all markets.

```bash
scan
```

Runs three strategies:

| Strategy | Signal Source | Logic |
|:---------|:-------------|:------|
| **Momentum** | Volume history | Identifies markets with increasing volume trends |
| **Mean Reversion** | OI skew | Detects extreme long/short imbalances |
| **Whale Follow** | Large positions | Tracks whale positioning |

### analyze \<asset\>

Deep analysis of a single market.

```bash
analyze SOL
```

Shows current price, 24h change, market regime, strategy signals, open interest breakdown, and volume trends.

### volume

Protocol-wide volume breakdown.

```bash
volume
```

Shows total volume, trade count, long/short split, and daily trend.

### open interest

Per-market open interest.

```bash
open interest
```

Shows long/short OI, position counts, and skew ratio for each market.

**Alias:** `oi`

### leaderboard

Top traders on Flash Trade.

```bash
leaderboard
```

Shows address, PnL, volume, trade count, and win rate.

**Alias:** `rankings`

### fees

Protocol fee data and distribution.

```bash
fees
```

Shows total fees, LP/token/team share split, and daily trend.

### whale activity

Recent large positions above $10,000 USD.

```bash
whale activity
```

**Alias:** `whales`

## Observability Commands

### liquidations \<market\>

Liquidation risk clusters by price zone. Derived from open interest distribution — shows where liquidations would concentrate if the price moves to specific levels.

```bash
liquidations SOL
```

### funding \<market\>

OI imbalance and borrow/lock fee data.

```bash
funding SOL
```

::: tip Flash Trade Fee Model
Flash Trade uses **borrow/lock fees**, not periodic funding rates like centralized exchanges. Fees accumulate continuously in `unsettledFeesUsd` on each position while it remains open.
:::

### depth \<market\>

Liquidity depth around the current price. Uses open interest distribution to model liquidity at various price levels.

```bash
depth SOL
```

### protocol health

Protocol-wide health metrics including OI totals, volume, fee revenue, and long/short ratio.

```bash
protocol health
```

## Data Sources

| Source | Data | Cache |
|:-------|:-----|:------|
| Pyth Hermes | Oracle prices | 5s TTL |
| fstats API | OI, volume, fees, leaderboards, whale positions | 15s TTL / per-request |
| CustodyAccount | Fee rates, leverage limits | ~60s (slot-based) |

## Data Integrity

- Data is never fabricated or filled with hardcoded fallback values
- If a source is unavailable, the command returns empty results or "Data unavailable"
- All numeric values include `Number.isFinite()` guards
- Response body sizes are capped (2MB for fstats, 1MB for other APIs)
