# Risk Preview System

Before executing any trade, Flash Terminal displays a structured risk preview panel. This gives traders full visibility into the trade's risk profile before confirmation.

## Example Output

```
TRADE PREVIEW
─────────────────────────────────
  Market:          SOL LONG
  Side:            LONG
  Leverage:        5x
  Collateral:      $100.00 USDC
  Position Size:   $500.00
  Entry Price:     $148.52
  Est. Liq:        $121.79
  Distance:        18.0%
  Risk:            HIGH
  Exposure:        $0.00 → $500.00
```

## How It Works

### Liquidation Distance

The liquidation estimate uses the approximation:

```
liqDist = (1 / leverage) × 0.9
```

The 0.9 factor accounts for the 10% maintenance margin buffer used by Flash Trade.

### Liquidation Price

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
| 3x | ~30.0% |
| 5x | ~18.0% |
| 10x | ~9.0% |
| 20x | ~4.5% |
| 50x | ~1.8% |
| 100x | ~0.9% |

### Risk Classification

| Level | Distance | Description |
|-------|----------|-------------|
| **LOW** | > 60% | Wide margin to liquidation |
| **MEDIUM** | 30% - 60% | Moderate liquidation risk |
| **HIGH** | < 30% | Significant liquidation risk |

### Exposure Change

The preview shows total portfolio exposure before and after the trade:

```
Exposure: $500.00 → $1,000.00
```

This is calculated by summing `sizeUsd` across all open positions, including the proposed trade.

## Design Constraints

- **Instant rendering** -- Uses cached market data. No additional RPC calls are made for the preview.
- **Never blocks trading** -- If data is unavailable, the preview is silently omitted. It does not gate trade execution.
- **Handles missing data** -- All calculations include `Number.isFinite()` guards. Invalid inputs return safely without crashing.
- **Best-effort** -- The preview is informational. Actual entry price may differ slightly due to slippage and oracle update timing.
