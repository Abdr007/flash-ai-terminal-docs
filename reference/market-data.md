# Market Data Commands

## markets

List all supported markets and pools.

```bash
markets
```

Shows each pool with its supported market symbols and maximum leverage.

---

## volume

Protocol trading volume.

```bash
volume
```

Shows daily volume over the last 7 days including: date, total volume, trade count, long/short split, and liquidation volume.

---

## open interest

Open interest by market.

```bash
open interest
```

Shows per-market: long OI, short OI, long positions count, short positions count.

---

## leaderboard

Top traders on Flash Trade.

```bash
leaderboard
```

Options: ranked by PnL (default) or volume. Shows address, PnL, volume, trades, and win rate.

---

## fees

Protocol fee data.

```bash
fees
```

Shows daily fee breakdown.

---

## whale activity

Recent large trades and open positions above $10,000.

```bash
whale activity
```

Shows market, side, size, and entry details for whale positions.

---

## monitor

Full-screen live market table.

```bash
monitor
```

Refreshes every 5 seconds. Shows price, 24h change, OI, and long/short ratio. Press any key to exit.

---

## watch

Auto-refresh any read-only command.

```bash
watch positions
watch volume
watch open interest
```

Refreshes every 5 seconds. Press `q` to exit.
