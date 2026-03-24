# Strategies

The agent combines multiple signal generators through Bayesian fusion. No single strategy makes decisions alone — every trade requires agreement across independent models weighted by regime and recent performance.

## Signal Generators

### Momentum

Trend-following strategy based on MACD crossovers and supertrend direction.

- **Primary signal**: MACD histogram slope + supertrend flip
- **Confirmation**: price above/below 20-period EMA
- **Best regime**: `TRENDING_UP`, `TRENDING_DOWN`
- **Weakness**: generates false signals in ranging and choppy markets

Momentum weight increases automatically when the regime detector identifies a sustained trend. It is suppressed during compression and range-bound periods.

### Mean Reversion

Identifies overextended moves and fades them toward equilibrium.

- **Primary signal**: Bollinger band penetration (2.0 standard deviations)
- **Confirmation**: OI imbalance — extreme long/short ratio suggests crowded positioning
- **Best regime**: `RANGING`
- **Weakness**: gets destroyed by trending markets — mean reversion into a trend is the fastest way to lose money

The strategy requires both price extension and OI skew to fire. Price alone is not sufficient.

### Whale Follow

Detects large position entries via on-chain open interest shifts.

- **Primary signal**: OI delta exceeds 2× the rolling average over 1-hour window
- **Confirmation**: directional bias — is the OI increase concentrated on longs or shorts?
- **Best regime**: any — whale activity is regime-independent
- **Weakness**: whales can be wrong, and large OI changes can also signal hedging rather than directional conviction

Whale signals carry high weight but low frequency. They fire rarely and are typically used to confirm or reject signals from other generators.

### Volume Analysis

Volume ratio changes signal shifts in market participation.

- **Primary signal**: current volume / 20-period average volume — ratios above 2.0 indicate unusual activity
- **Confirmation**: volume direction alignment — high volume on price advance vs. high volume on price decline
- **Best regime**: `TRENDING_UP`, `TRENDING_DOWN`, `HIGH_VOLATILITY`
- **Weakness**: volume spikes can be noise (liquidation cascades, market maker rebalancing)

Volume is primarily used as a filter — it validates other signals rather than generating entries on its own.

### Funding Rate

Funding rate skew indicates directional bias and crowded positioning.

- **Primary signal**: absolute funding rate above 0.01% per hour — skew suggests one side is overpaying
- **Confirmation**: funding direction divergence from price — positive funding during a downtrend signals trapped longs
- **Best regime**: any
- **Weakness**: funding can stay extreme for extended periods during strong trends

High funding against a position is a strong contrarian signal. High funding aligned with a position suggests crowding risk.

### Microstructure

Short-timeframe orderbook pressure for low-latency confirmation.

- **Primary signal**: bid/ask imbalance ratio from recent trade flow
- **Confirmation**: trade size clustering — large trades on one side signal directional intent
- **Best regime**: any — used as a timing filter, not a directional signal
- **Weakness**: highly noisy, only useful in combination with other signals

Microstructure signals have the shortest half-life. They are weighted highest in the first 2 ticks after generation and decay rapidly.

## Signal Fusion

Individual signals are combined using Bayesian fusion. Each generator produces:

- **Direction**: long, short, or neutral
- **Confidence**: 0.0–1.0

The fusion engine:

1. **Weights** each signal by regime fit and recent accuracy
2. **Combines** directional probabilities using Bayes' rule
3. **Applies minimum confidence threshold**: 0.60 — below this, no trade
4. **Requires 2-tick confirmation**: the fused signal must persist for 2 consecutive ticks to filter single-tick spikes

```
fused_confidence = bayesian_combine(
    momentum    × regime_weight × accuracy_weight,
    mean_rev    × regime_weight × accuracy_weight,
    whale       × regime_weight × accuracy_weight,
    volume      × regime_weight × accuracy_weight,
    funding     × regime_weight × accuracy_weight,
    micro       × regime_weight × accuracy_weight
)

if fused_confidence >= 0.60 and confirmed_ticks >= 2:
    emit signal
```

## Regime Detection

The regime detector classifies the current market into one of five states. Classification updates every tick using price action, volatility, and trend indicators.

| Regime | Condition | Effect on strategies |
|:-------|:----------|:---------------------|
| `TRENDING_UP` | Sustained higher highs, supertrend bullish | Momentum weight increased, mean reversion suppressed |
| `TRENDING_DOWN` | Sustained lower lows, supertrend bearish | Momentum weight increased, mean reversion suppressed |
| `RANGING` | Price oscillating within Bollinger bands | Mean reversion weight increased, momentum suppressed |
| `HIGH_VOLATILITY` | ATR > 2× 20-period average | All position sizes reduced, wider stops |
| `COMPRESSION` | ATR < 0.5× 20-period average, Bollinger squeeze | No new entries, wait for breakout |

Regime transitions require 3 consecutive ticks of agreement to prevent whipsawing on single-tick noise.

## Opportunity Scoring

Every potential trade is scored on a composite scale before the entry policy evaluates it. The score determines priority when multiple opportunities compete for limited capital.

| Factor | Weight | Source |
|:-------|:-------|:-------|
| Signal strength | 30% | Fused confidence from Bayesian combination |
| Regime fit | 25% | How well the dominant signal matches current regime |
| Risk-adjusted return | 25% | Expected value / expected max drawdown |
| Capital efficiency | 15% | Collateral required vs. available balance |
| Technical setup | 5% | Chart pattern quality, support/resistance proximity |

Scores below 0.50 are rejected outright. Scores between 0.50–0.65 require conservative sizing. Scores above 0.65 qualify for normal sizing.

## How Strategies Are Disabled

The edge profiler tracks rolling EV per strategy over the last 100 trades where that strategy contributed to the fused signal.

```
strategy_ev = avg(pnl_contribution) - avg(cost_drag)
```

If a strategy's EV drops below the minimum threshold (20 basis points), the fusion engine sets its weight to zero. The strategy continues to generate signals — they are just ignored in the fusion calculation.

Recovery path:

1. Strategy continues running in shadow mode (signals generated but not acted on)
2. Shadow performance is tracked for 50 trades
3. If shadow EV exceeds 30 basis points (hysteresis buffer), the strategy is re-enabled
4. Re-enabled strategies start at 50% of their normal regime weight and ramp up over 20 trades

This mechanism prevents a single underperforming strategy from dragging down the entire system while allowing recovery when market conditions shift back in its favor.
