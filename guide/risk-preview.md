# Trade Risk Preview

Before executing any trade, the terminal displays a structured risk preview panel. This gives traders full visibility into the trade's risk profile before signing.

## What the Preview Shows

| Field | Description |
|-------|-------------|
| **Est. Entry** | Current market price from cached oracle data |
| **Est. Liq** | Estimated liquidation price based on leverage |
| **Distance** | Percentage distance from entry to liquidation |
| **Risk** | Classification: LOW, MEDIUM, or HIGH |
| **Exposure** | Portfolio exposure before and after the trade |

## Example Output

```
CONFIRM TRANSACTION
─────────────────────────────────
  Market:      SOL LONG
  Pool:        Crypto.1
  Leverage:    5x
  Collateral:  $100.00 USDC
  Size:        $500.00
  Est. Fee:    $0.40
  Wallet:      ABDR...7x4f

  Risk Preview:
    Est. Entry:   $148.52
    Est. Liq:     $121.79
    Distance:     18.0%
    Risk:         HIGH
    Exposure:     $0.00 → $500.00
```

## How Calculations Work

### Estimated Liquidation Price

The liquidation estimate uses the approximation:

```
liqDist = (1 / leverage) × 0.9
```

The 0.9 factor accounts for the 10% maintenance margin buffer used by Flash Trade.

For a **long** position:

```
liqPrice = entryPrice × (1 - liqDist)
```

For a **short** position:

```
liqPrice = entryPrice × (1 + liqDist)
```

### Liquidation Distance by Leverage

| Leverage | Distance to Liquidation |
|----------|------------------------|
| 1.1x | ~81.8% |
| 2x | ~45.0% |
| 5x | ~18.0% |
| 10x | ~9.0% |
| 20x | ~4.5% |
| 50x | ~1.8% |
| 100x | ~0.9% |

### Risk Classification

| Level | Distance | Color |
|-------|----------|-------|
| **LOW** | > 60% | Green |
| **MEDIUM** | 30% - 60% | Yellow |
| **HIGH** | < 30% | Red |

### Portfolio Exposure

The preview shows total portfolio exposure before and after the trade:

```
Exposure: $500.00 → $1,000.00
```

This is calculated by summing `sizeUsd` across all open positions.

## Design Constraints

The risk preview is designed to:

- **Render instantly** — Uses cached market data with a 5-second TTL. No additional RPC calls.
- **Never block trading** — Wrapped in a 3-second timeout. If data is unavailable, the preview is silently omitted.
- **Handle missing data** — All calculations include `Number.isFinite()` guards. Invalid inputs return safely.
- **Be best-effort** — The preview is informational. It does not gate trade execution.

::: tip
The preview uses the current oracle price as the entry estimate. Actual entry price may differ slightly due to slippage and oracle update timing.
:::
