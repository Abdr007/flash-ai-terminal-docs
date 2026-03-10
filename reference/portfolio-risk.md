# Portfolio & Risk Commands

## portfolio

Portfolio summary with balance, positions, PnL, and exposure.

**Description:** Displays the full portfolio overview including wallet balance, total collateral deployed, total exposure (leveraged size), unrealized PnL, and per-position allocation breakdown.

**Syntax:**

```bash
portfolio
```

**Aliases:** `balance`, `account`

---

## dashboard

Comprehensive trading dashboard.

**Description:** Combines portfolio summary, open positions, market overview, risk level, largest position, borrow fees, and realized PnL into a single view.

**Syntax:**

```bash
dashboard
```

**Aliases:** `dash`

---

## risk report

Per-position liquidation distance and risk level.

**Description:** Analyzes each open position for liquidation risk. Shows liquidation distance as a percentage, assigns a risk level (healthy, warning, or critical), and suggests actions for at-risk positions.

**Syntax:**

```bash
risk report
```

**Aliases:** `risk`

---

## risk monitor on

Enable real-time liquidation risk monitoring.

**Description:** Starts a background monitor that tracks position risk continuously. Prices refresh every 5 seconds, positions refresh every 20 seconds. Alerts fire on risk level transitions using hysteresis thresholds to prevent oscillation. Automatically suggests collateral additions for critical positions.

**Syntax:**

```bash
risk monitor on
```

---

## risk monitor off

Disable real-time risk monitoring.

**Description:** Stops the background risk monitor and suppresses all risk alerts.

**Syntax:**

```bash
risk monitor off
```

---

## exposure

Portfolio exposure breakdown by market and direction.

**Description:** Shows how portfolio exposure is distributed across markets and directions (long/short). Flags concentration risk when any single position exceeds 30% of total exposure.

**Syntax:**

```bash
exposure
```

---

## rebalance

Portfolio rebalance analysis and suggestions.

**Description:** Analyzes current portfolio allocation and provides rebalancing suggestions to improve diversification and risk distribution.

**Syntax:**

```bash
rebalance
```
