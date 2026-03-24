# Autonomous Agent

Flash Terminal includes a self-learning trading agent that adapts to market conditions in real time. It is not a static bot executing fixed rules — it observes outcomes, updates its policies, validates its own edge, and disables strategies that stop working.

## Starting the Agent

```bash
# Dry-run mode — agent runs full loop but never executes trades
agent start

# Live execution — trades are signed and broadcast
agent start --live

# Stop the agent
agent stop

# Check status, active strategies, and learning metrics
agent status
```

::: warning
`agent start --live` requires a connected wallet and USDC balance. Every trade still passes through the signing confirmation gate. The agent cannot bypass safety limits.
:::

## How It Works

The agent runs a tick-based control loop. Default tick interval is 10 seconds, adaptive between 2–30 seconds based on volatility and opportunity density.

Each tick executes six phases in sequence:

```
Observe → Classify → Score → Decide → Execute → Learn
```

| Phase | Action |
|:------|:-------|
| **Observe** | Fetch prices, funding rates, OI, volume from oracles and on-chain data |
| **Classify** | Detect market regime (trending, ranging, volatile, compressed) |
| **Score** | Run all signal generators, fuse into composite opportunity scores |
| **Decide** | Entry and exit policies select action based on current Q-table state |
| **Execute** | Submit trade via the same pipeline as manual commands (all safety layers apply) |
| **Learn** | Update Q-tables, edge profiler, and opportunity tracker with outcome data |

## Learning Systems

The agent maintains four independent learning systems. They operate concurrently but update at different frequencies.

### 1. Entry Policy — Q-Learning

Decides **whether and how aggressively to enter** a new position.

- **State space**: 36 states — `regime (6) × signal_strength (3) × market_condition (2)`
- **Actions**: `aggressive`, `normal`, `conservative`, `skip`
- **Learning rate**: 0.15 (initial) → 0.03 (decayed over 500 trades)
- **Exploration**: 12% (initial) → 2.5% (epsilon-greedy decay)
- **Discount factor**: 0.95

The policy shifts toward conservative entries during drawdowns and aggressive entries when edge is confirmed by the profiler.

### 2. Exit Policy — Q-Learning V2

Decides **when and how to close** existing positions.

- **State space**: 540 states — `pnl_bucket (6) × time_held (5) × volatility (3) × tp_sl_proximity (3) × momentum (2)`
- **Actions**: `hold`, `tighten_stop`, `extend_target`, `partial_close`, `full_close`
- **Hard stop-loss**: -15% of collateral — non-negotiable, not subject to policy override

The exit policy learns to hold winners longer in trending regimes and cut losers faster in ranging markets.

### 3. Edge Profiler

Decomposes realized PnL into three components:

| Component | What it measures |
|:----------|:-----------------|
| **Signal quality** | Was the directional call correct? |
| **Execution loss** | Slippage between signal price and fill price |
| **Cost drag** | Fees, funding, and spread erosion |

The profiler maintains a rolling EV estimate per strategy. If a strategy's EV drops below **20 basis points**, it is excluded from signal fusion until it recovers.

### 4. Opportunity Learner

Tracks the last **200 missed trades** — opportunities that scored above threshold but were skipped due to policy, sizing, or cooldown.

For each missed trade, the learner records what would have happened:

- Entry and exit prices (from oracle history)
- Hypothetical PnL
- Capture rate (% of missed opportunities that would have been profitable)

When capture rate exceeds 65% for a specific pattern, the learner suggests parameter adjustments to the entry policy.

## Edge Validation

The **Production Validator** prevents the agent from trading on unproven strategies.

When a new strategy configuration is deployed or a significant policy update occurs, the validator:

1. **Freezes** the current architecture (no further learning updates)
2. **Observes** 200 live trades under the frozen configuration
3. **Measures** real performance metrics:
   - Sharpe ratio (minimum: 0.5)
   - Profit factor (minimum: 1.2)
   - Maximum drawdown (maximum: 12%)
   - Win rate stability (standard deviation < 8%)
4. **Verdict**: strategies that fail validation are **auto-disabled**

::: tip
The validator uses live market conditions, not backtests. A strategy can pass backtesting and still fail production validation if execution costs or market microstructure differ from historical data.
:::

## Loss Protection

Multiple independent mechanisms prevent catastrophic drawdowns. They operate in parallel — any single trigger is sufficient to intervene.

| Mechanism | Trigger | Action |
|:----------|:--------|:-------|
| **Hard stop-loss** | Position PnL < -15% | Immediate full close |
| **Stagnation exit** | PnL flat for > 40 ticks | Close position, free capital |
| **Max hold time** | Position open > 60 ticks | Force close regardless of PnL |
| **ATR trailing stop** | Price reverses 4× ATR from peak | Close at trailing stop level |
| **Scale-out** | Profit targets hit | 30% at 1R, 30% at 2R, 40% at 3R |
| **Consecutive loss cooldown** | 3+ consecutive losses | Pause new entries, widen filters |
| **Sharpe degradation** | Rolling Sharpe drops > 20% | Reduce position size by 20% |
| **Drawdown gate** | Portfolio drawdown > 10% | Disable scale-out, conservative only |

## System Governor

The governor prevents the learning systems from destabilizing themselves through excessive adaptation.

**Hard clamps:**

| Parameter | Floor | Ceiling |
|:----------|:------|:--------|
| Position size multiplier | 0.4× | 1.5× |
| Learning rate | 0.03 | 0.15 |
| Policy changes per 100 trades | — | 3 |

**Meta-stability score**: A composite score from 0–100 measuring how stable the agent's behavior is over the last 100 ticks. Inputs: policy change frequency, sizing variance, win-rate trend, and Q-table convergence.

- Score > 60: all systems normal
- Score 20–60: learning rate reduced, exploration clamped
- Score < 20: **all adaptive systems disabled**, agent falls back to static conservative policy

## State Persistence

Agent state is saved to `~/.flash/agent-state.json` every 50 ticks and on shutdown. This includes:

- Q-tables for entry and exit policies
- Edge profiler history and per-strategy EV
- Opportunity learner buffer
- Governor meta-stability score
- Cumulative trade statistics

On restart, the agent restores from the saved state. There is no cold-start penalty — learning resumes from where it left off.

## Commands

| Command | Description |
|:--------|:------------|
| `agent start` | Start agent in dry-run mode |
| `agent start --live` | Start agent with live execution |
| `agent stop` | Stop the agent loop |
| `agent status` | Current state, active strategies, metrics |
| `agent reset` | Clear learned state and start fresh |
| `agent config` | Show agent configuration |
