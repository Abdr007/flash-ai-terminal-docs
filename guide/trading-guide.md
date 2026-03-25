# Trading Guide

This guide explains how trading works in Flash Terminal. No prior trading experience needed.

## How Trading Works

When you trade on Flash Terminal, you're trading **perpetual futures** — a type of contract that lets you bet on whether an asset's price will go up or down.

You don't buy or sell the actual asset. Instead, you open a **position** that tracks the price.

## Long vs Short

There are two directions:

**Long** — You profit when the price goes **up**.

```bash
open 2x long SOL $100
# If SOL goes from $140 to $154 (+10%), you profit
```

**Short** — You profit when the price goes **down**.

```bash
open 2x short SOL $100
# If SOL goes from $140 to $126 (-10%), you profit
```

## What is Leverage?

Leverage multiplies your position size relative to your collateral.

```
Position Size = Collateral x Leverage
```

**Example:**

| Collateral | Leverage | Position Size |
|:-----------|:---------|:--------------|
| $100 | 1x | $100 |
| $100 | 2x | $200 |
| $100 | 5x | $500 |
| $100 | 10x | $1,000 |

Higher leverage = bigger profits **and** bigger losses.

**With 2x leverage and $100 collateral:**
- SOL goes up 10% → you gain **$20** (20% return)
- SOL goes down 10% → you lose **$20** (20% loss)

**With 10x leverage and $100 collateral:**
- SOL goes up 10% → you gain **$100** (100% return)
- SOL goes down 10% → you lose **$100** (100% loss = liquidated)

::: warning HIGHER LEVERAGE = HIGHER RISK
At 10x leverage, a 10% move against you wipes out your entire collateral. Start with 2x or 3x until you're comfortable.
:::

## What is Collateral?

Collateral is the USDC you put up as margin for a position. It determines your **maximum loss** on that trade (excluding fees).

You can adjust collateral on open positions:

```bash
add $50 to SOL long       # More collateral → lower leverage → safer
remove $20 from SOL long  # Less collateral → higher leverage → riskier
```

## Understanding PnL

PnL (Profit and Loss) shows how much money you're making or losing.

**For long positions:**

```
PnL = (Current Price - Entry Price) / Entry Price x Position Size
```

**For short positions:**

```
PnL = (Entry Price - Current Price) / Entry Price x Position Size
```

**Example:** You open a 2x long SOL at $140 with $100 collateral ($200 position).

| SOL Price | Price Change | PnL |
|:----------|:-------------|:----|
| $154 | +10% | +$20 |
| $147 | +5% | +$10 |
| $140 | 0% | $0 |
| $133 | -5% | -$10 |
| $126 | -10% | -$20 |

PnL is **unrealized** while the position is open. It becomes **realized** when you close.

## What is Liquidation?

Liquidation happens when your losses get too close to your collateral amount. The protocol closes your position automatically to protect the system.

**How close is too close?** It depends on your leverage:

| Leverage | Approximate Move to Liquidation |
|:---------|:-------------------------------|
| 2x | ~50% against you |
| 5x | ~20% against you |
| 10x | ~10% against you |
| 20x | ~5% against you |

::: danger LIQUIDATION IS PERMANENT
When liquidated, your position is closed and your collateral is lost. You cannot undo a liquidation.
:::

**How to avoid liquidation:**

1. **Use lower leverage** — Gives you more room
2. **Add collateral** — `add $50 to SOL long`
3. **Set a stop-loss** — `set sl SOL long $130`
4. **Monitor your positions** — `risk monitor on`

Check how close you are to liquidation:

```bash
risk report
```

## Fees

Every trade has fees:

| Fee | When | Typical Rate |
|:----|:-----|:-------------|
| **Open fee** | When you open a position | ~0.08% of position size |
| **Close fee** | When you close a position | ~0.08% of position size |
| **Borrow fee** | While position is open | Variable, accrues over time |

**Example:** Opening a $200 position costs about $0.16 in fees. Closing costs another $0.16. Total round-trip: ~$0.32.

Flash Terminal shows estimated fees in the trade preview before you confirm.

## Available Markets

Flash Terminal supports 32+ assets across multiple categories:

| Category | Examples |
|:---------|:---------|
| **Crypto** | SOL, BTC, ETH, BNB |
| **Stocks** | NVDA, TSLA, AAPL, AMD, AMZN, SPY |
| **Commodities** | Gold (XAU), Silver (XAG), Crude Oil |
| **Forex** | EUR, GBP, JPY, CNH |
| **Governance** | JTO, JUP, PYTH, RAY |
| **Memecoins** | BONK, WIF, PENGU, FARTCOIN |

See all markets:

```bash
markets
```

Each market has its own leverage limits set by the protocol. Major assets like SOL and BTC allow up to 100x. Smaller tokens may be limited to 20-40x.

## Prices

All prices come from [Pyth Network](https://pyth.network/) — the same oracle used by Flash Trade's on-chain program. Prices are validated for freshness and accuracy before use.

```bash
price SOL          # Current price with confidence interval
monitor            # Live price table, updates every 5s
```

## Trade Confirmation

In live mode, every trade shows a full preview before signing:

```
CONFIRM TRANSACTION
─────────────────────────────────
  Market:      SOL LONG
  Leverage:    5x
  Collateral:  $500.00 USDC
  Size:        $2,500.00
  Est. Fee:    $2.00
  Wallet:      ABDR...7x4f

  Risk Preview:
    Est. Entry:   $148.52
    Est. Liq:     $123.77
    Distance:     16.7%

  Proceed? [y/N]
```

You must type `yes` to confirm. There is no way to skip this.

## Next Steps

- [Basic Commands](/guide/basic-commands) — Full command reference
- [Simulation Mode](/guide/simulation) — Practice without risk
- [Risk & Safety](/guide/risk-safety) — Understanding the safety systems
- [Configuration](/guide/configuration) — Set trade limits and risk controls
