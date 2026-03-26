# Trading Guide

How trading works in Flash Terminal. No prior trading experience needed.

## The Basics

You're trading **perpetual futures** — contracts that track an asset's price. You don't buy the actual asset. You open a **position** that profits or loses as the price moves.

## Long vs Short

**Long** — You profit when the price goes **up**.

```bash
open 2x long SOL $100
# SOL at $140. If it rises to $154 (+10%), you profit.
```

**Short** — You profit when the price goes **down**.

```bash
open 2x short SOL $100
# SOL at $140. If it drops to $126 (-10%), you profit.
```

## Leverage

Leverage multiplies your exposure relative to your collateral.

```
Position Size = Collateral x Leverage
```

| Collateral | Leverage | Position Size | 10% price move = |
|:-----------|:---------|:--------------|:-----------------|
| $100 | 1x | $100 | $10 profit/loss |
| $100 | 2x | $200 | $20 profit/loss |
| $100 | 5x | $500 | $50 profit/loss |
| $100 | 10x | $1,000 | $100 profit/loss |

::: warning
At 10x leverage, a 10% move against you = 100% loss (liquidation). Start with 2-3x.
:::

Default leverage is **2x** (configurable via `DEFAULT_LEVERAGE` in `.env`).

## Collateral

Collateral is the USDC you put up as margin. It determines your maximum loss on that trade.

Adjust collateral on open positions:

```bash
add $50 to SOL long       # More collateral → lower leverage → safer
remove $20 from SOL long  # Less collateral → higher leverage → riskier
```

## PnL (Profit & Loss)

**Long:** `PnL = (Mark Price - Entry Price) / Entry Price x Position Size`

**Short:** `PnL = (Entry Price - Mark Price) / Entry Price x Position Size`

**Example:** 2x long SOL at $140, $100 collateral ($200 position):

| SOL Price | Change | PnL | Return on Collateral |
|:----------|:-------|:----|:---------------------|
| $154 | +10% | +$20 | +20% |
| $147 | +5% | +$10 | +10% |
| $140 | 0% | $0 | 0% |
| $133 | -5% | -$10 | -10% |
| $126 | -10% | -$20 | -20% |

PnL is **unrealized** while the position is open. It becomes **realized** when you close.

## Liquidation

When losses approach your collateral, the protocol automatically closes your position.

| Leverage | Approx. Move to Liquidation |
|:---------|:---------------------------|
| 2x | ~50% against you |
| 5x | ~20% against you |
| 10x | ~10% against you |
| 20x | ~5% against you |

::: danger
Liquidation is permanent. Your position is closed and collateral is lost.
:::

**Avoid liquidation:**

```bash
add $50 to SOL long       # Add collateral
set sl SOL long $130      # Set stop-loss
risk report               # Check liquidation distances
```

## Fees

| Fee | When | Rate |
|:----|:-----|:-----|
| **Open fee** | Opening a position | ~0.08% of position size |
| **Close fee** | Closing a position | ~0.08% of position size |
| **Borrow fee** | While position is open | Variable, accrues over time |

Example: $200 position → ~$0.16 open fee + ~$0.16 close fee = ~$0.32 round trip.

Fees are shown in the trade preview before you confirm.

## Prices

All prices come from [Pyth Network](https://pyth.network/) oracles — the same feeds used by Flash Trade on-chain. Prices are validated for:

- **Staleness** — Must be recent (< 30s)
- **Confidence** — Must be within confidence interval
- **Deviation** — Must not deviate excessively

```bash
price SOL          # Current price with confidence
```

## Trade Confirmation (Live Mode)

Every live trade shows a full preview:

```
  Market:      SOL/USD LONG
  Leverage:    5x
  Collateral:  $500.00 USDC
  Size:        $2,500.00
  Est. Fee:    $2.00
  Wallet:      ABDR...7x4f
  Est. Entry:  $148.52
  Est. Liq:    $121.39

  Proceed? [y/N]
```

You must type `yes`. This cannot be bypassed.

## Available Markets

```bash
markets
```

**Pools:**

| Pool | Markets |
|:-----|:--------|
| Crypto.1 | SOL, BTC, ETH, ZEC, BNB |
| Ondo.1 | SPY, NVDA, TSLA, AAPL, AMD, AMZN, PLTR |
| Virtual.1 | XAU, XAG, CRUDEOIL, NATGAS, EUR, GBP, USDJPY, USDCNH |
| Governance.1 | JTO, JUP, PYTH, RAY, HYPE, MET, KMNO |
| Community.1 | PUMP, BONK, PENGU |
| Community.2 | WIF |
| Trump.1 | FARTCOIN |
| Ore.1 | ORE |

Each market has per-pool leverage limits set by the Flash Trade protocol.

## Next Steps

- [Commands](/guide/commands) — Full command reference
- [Simulation Mode](/guide/simulation) — Practice risk-free
- [Risk & Safety](/guide/risk-safety) — All safety systems explained
