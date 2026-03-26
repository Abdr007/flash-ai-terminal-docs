# Market Data Commands

## markets

List all supported markets and their pool assignments.

**Aliases:** `market`

## price

Current price from Pyth oracle with confidence interval.

```bash
price <asset>
```

## prices

All supported asset prices.

## monitor

Live-updating price table. Refreshes every 5 seconds. Press any key to exit.

**Aliases:** `market monitor`

## analyze

Deep market analysis for a specific asset.

```bash
analyze <asset>
```

## funding

Current funding rate for an asset.

```bash
funding <asset>
```

## stats

24h trading stats: volume, open interest, fees.

```bash
stats <asset>
```

## depth

Liquidity depth around current price.

```bash
depth <asset>
```

## volume

Protocol-wide trading volume (7d/30d/all-time).

## open interest

Open interest breakdown by market.

**Aliases:** `oi`

## leaderboard

Top traders ranked by PnL and volume.

**Aliases:** `rankings`

## whale activity

Recent large position opens/closes.

**Aliases:** `whales`

## fees

Protocol fee data across all markets.

**Aliases:** `fee`

## liquidations

Recent liquidation events for a specific asset.

```bash
liquidations <asset>
```

## protocol health

Overall protocol health metrics.
