# Portfolio & Risk Commands

## portfolio

Portfolio summary with exposure breakdown.

```bash
portfolio
```

Shows: wallet balance, total collateral, total exposure, unrealized PnL, and per-position allocation.

---

## dashboard

Full trading dashboard.

```bash
dashboard
```

Comprehensive view including: portfolio summary, open positions, market overview, risk level, largest position, realized PnL, and funding rates.

---

## risk report

Risk analysis across all positions.

```bash
risk report
```

Shows per-position: liquidation distance, risk level, and suggested actions.

---

## risk monitor on

Enable real-time liquidation risk monitoring.

```bash
risk monitor on
```

Background monitoring with:
- Price refresh every 5 seconds
- Position refresh every 20 seconds
- Alerts on risk level changes (with hysteresis)
- Auto-collateral suggestions for critical positions

---

## risk monitor off

Disable risk monitoring.

```bash
risk monitor off
```

---

## exposure

View portfolio exposure breakdown.

```bash
exposure
```

---

## rebalance

Get rebalance suggestions.

```bash
rebalance
```
