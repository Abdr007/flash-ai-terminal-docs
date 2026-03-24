# Risk & Safety Systems

Safety in Flash Terminal is not a feature. It is infrastructure. Every trade passes through 10 independent safety layers before it touches the chain. They are always active. They cannot be bypassed by the agent, by command input, or by configuration. There is no flag to turn them off.

This is the non-negotiable contract: **no transaction is signed unless every layer approves it.**

## Safety Layers

| # | Layer | What It Does | Scope |
|:--|:------|:-------------|:------|
| 1 | **Signing Guard** | Displays full trade summary (market, side, leverage, collateral, size, fees, wallet) and requires explicit confirmation before signing. Enforces per-trade collateral, position size, and leverage limits. Rate limiter: 10 trades/min, 3s minimum delay. | Every trade |
| 2 | **Circuit Breaker** | Halts all trading when cumulative session loss or daily loss exceeds configured threshold. Manual restart required to reset. | Session-wide |
| 3 | **Kill Switch** | Master toggle via `TRADING_ENABLED=false`. Disables all 4 trade operations instantly. Risk monitoring and position queries continue. | Global |
| 4 | **Execution Kill-Switch** | Auto-halts on execution degradation: slippage >50bps across 5 trades, 3 consecutive fill failures, or p90 latency >10s. 5-minute cooldown before auto-recovery. | Automatic |
| 5 | **Transaction Simulation** | On-chain simulation before broadcast. Program errors (insufficient collateral, invalid market, leverage violation) abort immediately. No funds at risk. | Every TX |
| 6 | **Program Whitelist** | Only Flash Trade program IDs (loaded from `PoolConfig`) and Solana system programs (System, Token, ATA, ComputeBudget) are permitted in instruction targets. Unknown programs are rejected. | Every TX |
| 7 | **Instruction Freeze** | `Object.freeze()` applied to the instruction array after validation. Prevents mutation between validation and signing. | Every TX |
| 8 | **Duplicate Detection** | Signature cache with 120s TTL. If a transaction with the same `action:market:side[:amount]` key recently landed, resubmission is blocked. | Every TX |
| 9 | **Crash Recovery** | Trade journal records pending transactions. On restart, the reconciler verifies whether pending TXs landed on-chain and corrects local state. | Startup |
| 10 | **State Reconciliation** | Syncs local position state with blockchain every 60 seconds and after every confirmed trade. On-chain state is always authoritative. Discrepancies are logged and auto-corrected. | Continuous |

## Circuit Breaker Configuration

```bash
# Session loss threshold — trading halts when cumulative session PnL drops below this
MAX_SESSION_LOSS_USD=500

# Daily loss threshold — resets at midnight UTC
MAX_DAILY_LOSS_USD=1000

# Maximum portfolio exposure as percentage of account value
MAX_PORTFOLIO_EXPOSURE=0.8
```

When the circuit breaker trips, all trade operations return an error immediately. The agent stops submitting signals. Monitoring and position queries remain functional. To resume trading, restart the terminal session.

## Risk Monitor

The background risk monitor tracks liquidation distance on all open positions. Enable or disable it at runtime:

```
risk monitor on
risk monitor off
```

**Refresh schedule:**

| Data | Interval |
|:-----|:---------|
| Oracle prices | Every 5s |
| Position state | Every 20s |

**Alert tiers with hysteresis:**

| Level | Enter Threshold | Recover Threshold | Action |
|:------|:----------------|:-------------------|:-------|
| SAFE | Default | >35% distance | Normal operation |
| WARNING | <30% distance | >35% to recover | Alert with collateral suggestion |
| CRITICAL | <15% distance | >18% to recover | Urgent alert, auto-calculated collateral needed |

Hysteresis prevents oscillation. A position at 31% distance stays WARNING until it crosses 35% — it does not flicker between SAFE and WARNING.

When a position enters WARNING or CRITICAL, the monitor runs a binary search (max 20 iterations, tolerance-based early break) to calculate the exact collateral addition needed to restore the position to a safe distance.

Alerts fire only on level transitions. No repeated notifications for the same state.

## TP/SL Engine

Take-profit and stop-loss orders are evaluated locally against oracle prices:

- **Evaluation interval:** every 5 seconds
- **2-tick confirmation:** price must satisfy the condition on two consecutive checks before triggering
- **Spike protection:** a single anomalous tick does not execute the order

This design filters oracle noise and flash wicks. The 10-second effective latency (2 ticks x 5s) is the tradeoff for not closing positions on bad data.
