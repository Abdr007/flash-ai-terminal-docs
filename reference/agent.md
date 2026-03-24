# Agent Commands

## agent start

Start the autonomous trading agent in dry-run mode.

**Syntax:**

```
agent start
```

**Example:**

```bash
agent start
```

Launches the agent in dry-run mode. The agent analyzes markets, generates trade signals, and logs decisions without executing any trades.

---

## agent start --live

Start the agent with live trade execution.

**Syntax:**

```
agent start --live
```

**Example:**

```bash
agent start --live
```

Launches the agent with live execution enabled. Requires a connected wallet and sufficient USDC balance. All trades go through the signing confirmation gate and respect risk limits.

::: warning
Live mode executes real trades with real funds. Ensure risk limits are configured before starting.
:::

---

## agent stop

Stop the agent and save learning state.

**Syntax:**

```
agent stop
```

**Example:**

```bash
agent stop
```

Gracefully stops the agent loop, closes any managed positions (dry-run only), and persists learning state to disk.

---

## agent status

View current agent status and performance.

**Syntax:**

```
agent status
```

**Example:**

```bash
agent status
```

**Output fields:**

| Field | Description |
|-------|-------------|
| Mode | dry-run or live |
| Iteration | Current loop iteration count |
| Capital | Available trading capital |
| Open Positions | Number of active positions |
| Total Trades | Trades executed this session |
| Win Rate | Percentage of profitable trades |
| Session PnL | Cumulative profit/loss |
| Uptime | Time since agent start |

---

## agent attach

Attach to a background agent tmux session.

**Syntax:**

```
agent attach
```

**Example:**

```bash
agent attach
```

Attaches to the running tmux session. Detach with `Ctrl+B` then `D`.

---

## agent logs

View recent agent decision logs.

**Syntax:**

```
agent logs
```

**Example:**

```bash
agent logs
```

Shows the last 50 agent decision entries including market analysis, signal generation, trade reasoning, and execution results.

---

## agent report

Generate a performance evaluation report.

**Syntax:**

```
agent report
```

**Example:**

```bash
agent report
```

Produces a detailed report covering win rate, average PnL per trade, max drawdown, Sharpe ratio, best/worst trades, and strategy effectiveness breakdown.

---

## Related Commands

### risk monitor

Background position risk monitoring.

**Syntax:**

```
risk monitor on
risk monitor off
```

**Example:**

```bash
risk monitor on
```

Monitors all open positions in the background. Alerts on liquidation proximity with tiered levels: SAFE, WARNING (<30% distance), CRITICAL (<15% distance). Suggests collateral additions when risk is elevated.

---

### set tp / set sl

Set take-profit or stop-loss on an open position.

**Syntax:**

```
set tp <market> <side> $<price>
set sl <market> <side> $<price>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `market` | string | Market symbol (e.g., SOL, BTC) |
| `side` | string | `long` or `short` |
| `price` | number | Target price in USD |

**Examples:**

```bash
set tp SOL long $200
set sl SOL long $120
set tp BTC short $60000
set sl BTC short $72000
```

---

### tp status

View active take-profit and stop-loss targets.

**Syntax:**

```
tp status
```

**Example:**

```bash
tp status
```

Lists all active TP/SL targets with market, side, target price, current price, and distance percentage.

---

## Background Running

The agent can run as a background process via tmux using the provided shell script.

**Script:** `./scripts/flash-agent.sh`

| Command | Description |
|---------|-------------|
| `./scripts/flash-agent.sh start` | Start agent in background tmux session |
| `./scripts/flash-agent.sh stop` | Stop background agent |
| `./scripts/flash-agent.sh attach` | Attach to agent session |
| `./scripts/flash-agent.sh status` | Check if agent is running |
| `./scripts/flash-agent.sh logs` | Tail agent logs |

## State Files

| File | Description |
|------|-------------|
| `~/.flash/agent-state.json` | Persistent learning state — trade history, strategy weights, regime memory. Survives restarts. |
| `~/.flash/agent-heartbeat.json` | Liveness heartbeat — updated every iteration. Used by `agent status` and the background script to detect hangs. |
