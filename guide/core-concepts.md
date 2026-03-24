# Core Concepts

This page covers the fundamentals of perpetual futures trading on Flash Trade as they apply to Flash Terminal. If you are already familiar with perps, skip to [Markets](#markets) for protocol-specific details.

## Markets

Flash Terminal supports 32+ assets organized into **pools**. A pool is a liquidity bucket — a set of deposited assets that back the positions opened against its markets. Each pool has its own risk parameters, fee schedules, and leverage limits.

| Pool | Assets | Category |
|:-----|:-------|:---------|
| **Crypto.1** | SOL, BTC, ETH, ZEC, BNB | Major cryptocurrencies |
| **Virtual.1** | XAG, XAU, CRUDEOIL, EUR, GBP, USDJPY, USDCNH | Commodities and forex |
| **Governance.1** | JTO, JUP, PYTH, RAY, HYPE, MET, KMNO | Solana governance tokens |
| **Community.1** | PUMP, BONK, PENGU | Community / meme tokens |
| **Community.2** | WIF | Community tokens |
| **Trump.1** | FARTCOIN | Meme tokens |
| **Ore.1** | ORE | Mining tokens |
| **Equity.1** | SPY, NVDA, TSLA, AAPL, AMD, AMZN | Equity indices and stocks |

Pools and their markets are discovered dynamically from the Flash SDK's `PoolConfig.json`. When Flash Trade adds new markets, they appear in Flash Terminal after updating the SDK dependency.

View available markets at any time:

```
flash > markets
```

## Positions

A position is a leveraged bet on the price direction of an asset. Every position has these properties:

| Property | Description |
|:---------|:------------|
| **Market** | The asset being traded (e.g., SOL, BTC, ETH) |
| **Side** | `LONG` (profit when price rises) or `SHORT` (profit when price falls) |
| **Leverage** | Multiplier applied to collateral to determine position size |
| **Collateral** | USDC deposited as margin backing the position |
| **Size** | Total position value in USD (collateral x leverage) |
| **Entry price** | Oracle price at the time the position was opened |
| **Mark price** | Current oracle price used for PnL and liquidation calculations |
| **Liquidation price** | Price at which the position will be liquidated |

Flash Trade allows one position per market per side. You cannot open two long positions on SOL simultaneously — the protocol rejects duplicates.

## Leverage

Leverage is the multiplier applied to your collateral to determine position size:

```
size = collateral x leverage
```

A 5x long SOL position with $100 collateral has a $500 size. If SOL rises 10%, the position gains $50 — a 50% return on the $100 collateral. If SOL falls 10%, the position loses $50 — a 50% loss.

**Higher leverage means closer liquidation.** At 2x leverage, the price must move ~50% against you before liquidation. At 10x, it only needs to move ~10%.

Leverage limits are set per market by the protocol and loaded from on-chain `CustodyAccount` state. Flash Terminal enforces these limits before submission — you cannot exceed what the protocol allows. Typical limits:

- Major assets (SOL, BTC, ETH): up to 100x
- Governance tokens: up to 50x
- Community/meme tokens: up to 20-40x

You can set an additional personal maximum via the `MAX_LEVERAGE` environment variable.

## Collateral

Collateral is the USDC you deposit as margin for a position. It determines your maximum loss (excluding fees) — you cannot lose more than your collateral on a single position.

While a position is open, you can adjust collateral:

```
flash > add collateral SOL long $50     # reduce leverage, push liquidation further
flash > remove collateral SOL long $20  # increase leverage, pull liquidation closer
```

Adding collateral decreases effective leverage and moves the liquidation price further away. Removing collateral increases effective leverage and moves it closer.

## PnL

Profit and loss is calculated against the current oracle mark price.

**For long positions:**

```
PnL = (markPrice - entryPrice) / entryPrice x size
```

**For short positions:**

```
PnL = (entryPrice - markPrice) / entryPrice x size
```

PnL is **unrealized** while the position is open — it fluctuates with the mark price. It becomes **realized** when the position is closed. Realized PnL is tracked cumulatively across your session and displayed in the portfolio view.

Fees are not included in PnL. Total return = realized PnL - total fees paid.

## Liquidation

Liquidation occurs when losses approach the collateral backing a position, minus the maintenance margin required by the protocol. The protocol closes the position automatically to prevent the loss from exceeding the pool's risk tolerance.

**Approximate liquidation price:**

For longs:

```
liquidationPrice = entryPrice x (1 - 1/leverage + maintenanceMargin)
```

For shorts:

```
liquidationPrice = entryPrice x (1 + 1/leverage - maintenanceMargin)
```

**Liquidation distance** is the percentage the current price must move to reach the liquidation price. Flash Terminal displays this in the risk report:

```
flash > risk report
```

::: warning LIQUIDATION IS IRREVERSIBLE
Once liquidated, the position is closed and the collateral is lost. Flash Terminal's risk monitor (`risk monitor on`) provides tiered alerts — SAFE, WARNING, CRITICAL — as positions approach liquidation. Monitor positions actively, especially at high leverage.
:::

**Avoiding liquidation:**
- Use lower leverage (wider distance to liquidation)
- Add collateral to an open position (`add collateral SOL long $50`)
- Set stop-loss orders to exit before liquidation (`open 2x long SOL $100 sl $120`)

## Fees

Every trade incurs fees deducted from collateral or returned amount.

| Fee type | When charged | Typical rate |
|:---------|:-------------|:-------------|
| **Open fee** | When opening a position | 0.08-0.10% of position size |
| **Close fee** | When closing a position | 0.08-0.10% of position size |
| **Borrow fee** | Continuously while position is open | Variable, accrues over time |

Fee rates are set per custody in the protocol and loaded from on-chain `CustodyAccount` state. Flash Terminal displays the estimated fee before execution in the trade preview.

**Example:** Opening a 5x long SOL with $100 collateral = $500 size. At 0.08% open fee, the fee is $0.40. The same fee applies on close, so the round-trip cost for this position is approximately $0.80.

In simulation mode, fees use the protocol's fee model (default `SIM_FEE_BPS=8`, representing 0.08%) and are deducted from your simulated balance.

## Oracle Prices

All prices in Flash Terminal come from [Pyth Network](https://pyth.network/) via the Hermes price service — the same oracle feeds used by Flash Trade's on-chain program for trade execution and liquidation.

Prices are validated before use:

| Check | Threshold | Behavior on failure |
|:------|:----------|:-------------------|
| **Staleness** | < 30 seconds | Price rejected, operation fails with error |
| **Confidence interval** | < 2% of price | Price rejected as unreliable |
| **Deviation** | < 50% from previous | Price rejected as likely erroneous |

This means Flash Terminal never displays a stale, low-confidence, or anomalous price. If the oracle feed is degraded, operations that depend on price will fail explicitly rather than proceed with bad data.

```
flash > price SOL          # current oracle price with confidence
flash > monitor            # live price table, refreshes every 5s
```
