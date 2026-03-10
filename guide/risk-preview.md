# Risk & Liquidation

Before executing any trade, Flash Terminal displays a structured risk preview. This page explains the risk model, liquidation mechanics, and how fees affect your position.

## Risk Preview

Every trade shows a confirmation panel before execution:

```
CONFIRM TRANSACTION
─────────────────────────────────
  Market:      SOL LONG
  Pool:        Crypto.1
  Leverage:    5x
  Collateral:  $100.00 USDC
  Size:        $500.00
  Est. Fee:    $0.40  (0.08%)
  Wallet:      7xK2...

  Est. Entry:  $148.52
  Est. Liq:    $121.79
  Distance:    18.0%
  Risk:        HIGH
  Exposure:    $0.00 → $500.00
```

## Liquidation Formula

Flash Terminal uses the same liquidation formula as the Flash Trade protocol.

Three liabilities are subtracted from your collateral buffer:

```
maintenanceMargin = positionSize × maintenanceMarginRate
exitFee           = positionSize × closeFeeRate
borrowFees        = unsettledFeesUsd (accumulated while open)

availableCollateral = collateral - maintenanceMargin - exitFee - borrowFees
priceMove = (availableCollateral / positionSize) × entryPrice
```

**Long position:**
```
liqPrice = entryPrice - priceMove
```

**Short position:**
```
liqPrice = entryPrice + priceMove
```

Where:
- `maintenanceMarginRate = 1 / maxLeverage` (from `CustodyAccount.pricing`)
- `closeFeeRate` from `CustodyAccount.fees.closePosition / RATE_POWER`
- `unsettledFeesUsd` from on-chain `PositionAccount` (borrow/lock fees)

In live mode, the SDK's `getLiquidationPriceContractHelper()` is used directly.

### Worked Example

```
Long SOL at $150, $100 collateral, 10x leverage ($1,000 size):

maintenanceMargin = $1,000 × 0.01       = $10.00
exitFee           = $1,000 × 0.0008     = $0.80
borrowFees        = $0 (just opened)
availableCollateral = $100 - $10 - $0.80 = $89.20
priceMove         = ($89.20 / $1,000) × $150 = $13.38
liqPrice          = $150 - $13.38        = $136.62
```

### What Eats Your Collateral Buffer

| Liability | Source | Effect |
|:----------|:-------|:-------|
| **Maintenance margin** | `1 / maxLeverage` from CustodyAccount | Always reserved |
| **Exit fee** | `closeFeeRate` from CustodyAccount | Pre-reserved for close |
| **Borrow fees** | Accumulates in `unsettledFeesUsd` on-chain | Grows over time — moves liq price closer |

Higher leverage = less collateral = closer liquidation. Longer hold time = more borrow fees = closer liquidation.

## Liquidation Distance by Leverage

| Leverage | Approximate Distance |
|:---------|:--------------------|
| 2x | ~45% |
| 3x | ~30% |
| 5x | ~18% |
| 10x | ~9% |
| 20x | ~4.5% |
| 50x | ~1.8% |
| 100x | ~0.9% |

These are approximations. Actual distance depends on maintenance margin rate and accumulated fees.

## Risk Classification

| Level | Distance | Description |
|:------|:---------|:------------|
| **LOW** | > 60% | Wide margin to liquidation |
| **MEDIUM** | 30% – 60% | Moderate liquidation risk |
| **HIGH** | < 30% | Significant liquidation risk |

## Fee Impact on Trades

Fees are charged on **position size** (leveraged amount), not collateral:

```
fee = positionSize × feeRate
positionSize = collateral × leverage
```

| Event | Formula | Deducted from |
|:------|:--------|:--------------|
| **Open** | `size × openFeeRate` | Balance (on top of collateral) |
| **Close** | `size × closeFeeRate` | Return amount |
| **Holding** | Borrow/lock fees accumulate | Effective collateral (on-chain) |

### Fee Example

```
Open: $100 collateral at 5x = $500 size
  Open fee: $500 × 0.0008 = $0.40
  Balance deducted: $100 + $0.40 = $100.40

Close after 10% gain:
  PnL: $500 × 10% = +$50
  Close fee: $500 × 0.0008 = $0.40
  Return: $100 + $50 - $0.40 = $149.60
  Total fees: $0.80
  Net profit: $49.20
```

## Liquidation Mechanics

When the market moves against your position enough that your collateral buffer is exhausted:

1. **Keeper bots** detect the position has crossed its liquidation threshold
2. The keeper calls the protocol's `liquidate` instruction on-chain
3. The position is closed at market price
4. Close fee is deducted from remaining collateral
5. Any remainder is returned to the trader (often near $0)

Flash Terminal does not execute liquidations. It monitors and warns.

### Preventing Liquidation

Add collateral to push the liquidation price further away:

```bash
add $50 to SOL long
```

This increases your collateral, reduces your effective leverage, and moves the liquidation price away from the current market price.

## Risk Monitor

Flash Terminal includes a background risk monitor for open positions:

```bash
risk monitor on     # Enable monitoring
risk monitor off    # Disable monitoring
```

| Level | Trigger | Recovery |
|:------|:--------|:---------|
| **SAFE** | — | >35% distance |
| **WARNING** | <30% distance | >35% distance |
| **CRITICAL** | <15% distance | >18% distance |

Hysteresis thresholds prevent alert spam when price oscillates near a boundary. The monitor suggests the exact collateral amount needed to restore a 35% safe distance.

## Design Constraints

- **Instant rendering** — Uses cached Pyth Hermes oracle prices. No additional RPC calls for the preview.
- **Never blocks trading** — If preview data is unavailable, it is omitted. It does not gate execution.
- **Numeric safety** — All calculations include `Number.isFinite()` guards. Invalid inputs return safely.
- **Best-effort** — The preview is informational. Actual entry price may differ due to slippage.
