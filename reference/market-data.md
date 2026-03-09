# Market Data Commands

## markets

List all supported markets and pools.

**Description:** Displays every available trading market grouped by pool, along with supported symbols and maximum leverage.

**Syntax:**

```bash
markets
```

---

## scan

Scan all markets for trading opportunities.

**Description:** Runs momentum, mean reversion, and whale-follow strategies across all markets. Returns ranked opportunities with confidence scores and suggested parameters.

**Syntax:**

```bash
scan
```

---

## analyze

Deep analysis of a single market.

**Description:** Provides a comprehensive breakdown of a specific market including current price, regime detection, trading signals, open interest, and volume data.

**Syntax:**

```bash
analyze <market>
```

**Example:**

```bash
analyze SOL
```

---

## volume

Daily trading volume breakdown.

**Description:** Shows protocol trading volume over the last 7 days including date, total volume, trade count, long/short split, and liquidation volume.

**Syntax:**

```bash
volume
```

---

## open interest

Per-market open interest with long/short split and position counts.

**Description:** Displays open interest for each market broken down by long OI, short OI, long position count, and short position count.

**Syntax:**

```bash
open interest
```

**Aliases:** `oi`

---

## leaderboard

Top traders by PnL or volume.

**Description:** Shows the top traders on Flash Trade ranked by the selected metric. Displays address, PnL, volume, trade count, and win rate.

**Syntax:**

```bash
leaderboard
```

**Options:**

| Option | Values | Description |
|--------|--------|-------------|
| `--metric` | `pnl`, `volume` | Ranking metric (default: pnl) |
| `--days` | number | Time window in days |
| `--limit` | number | Number of results |

---

## fees

Daily protocol fee breakdown.

**Description:** Shows protocol fees collected per day.

**Syntax:**

```bash
fees
```

---

## whale activity

Recent large positions above $10,000.

**Description:** Displays recent large trades and open positions exceeding the $10k threshold. Shows market, side, size, and entry details.

**Syntax:**

```bash
whale activity
```

**Aliases:** `whales`

---

## liquidations

Estimated liquidation clusters from OI distribution.

**Description:** Maps open interest across leverage bands (2x-50x) to estimate where liquidation clusters exist relative to the current price.

**Syntax:**

```bash
liquidations <market>
```

**Example:**

```bash
liquidations SOL
```

---

## funding

Funding rate and projected accumulation.

**Description:** Shows the current funding rate with projected 1h, 4h, and 24h accumulation. Detects OI imbalance between longs and shorts.

**Syntax:**

```bash
funding <market>
```

**Example:**

```bash
funding BTC
```

---

## depth

Estimated liquidity depth around current price.

**Description:** Models liquidity depth using an exponential decay function to estimate available liquidity at various price levels around the current mark price.

**Syntax:**

```bash
depth <market>
```

**Example:**

```bash
depth ETH
```

---

## protocol health

Protocol-wide health metrics.

**Description:** Displays aggregate protocol metrics including active markets, total open interest, long/short ratio, 30-day statistics, RPC latency, and current block height.

**Syntax:**

```bash
protocol health
```

---

## monitor

Full-screen live market table.

**Description:** Displays a full-screen, auto-updating table of all markets with price, 24h change, open interest, and long/short ratio. Sorted by OI (most active first). Refreshes every 5 seconds. Press any key to exit.

**Syntax:**

```bash
monitor
```

**Aliases:** `market monitor`

---

## watch

Auto-refresh any read-only command.

**Description:** Wraps any read-only command with automatic 5-second refresh. Press `q` to exit.

**Syntax:**

```bash
watch <command>
```

**Examples:**

```bash
watch positions
watch volume
watch open interest
```
