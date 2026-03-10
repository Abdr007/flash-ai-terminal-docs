# Trading Commands

## open

Open a leveraged perpetual position.

**Description:** Opens a new long or short perpetual position on the specified market with the given leverage and collateral amount.

**Syntax:**

```
open <leverage>x <long|short> <market> $<collateral>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `leverage` | number | Leverage multiplier (1-100x) |
| `long\|short` | string | Position direction |
| `market` | string | Market symbol (e.g., SOL, BTC, ETH) |
| `collateral` | number | Collateral amount in USD ($10 minimum) |

**Example:**

```bash
open 5x long SOL $500
```

---

## close

Close an existing position.

**Description:** Closes an open position on the specified market and side. Realizes PnL and returns collateral minus fees.

**Syntax:**

```
close <market> <long|short>
```

**Example:**

```bash
close SOL long
```

---

## add

Add collateral to an existing position.

**Description:** Increases the collateral on an open position, reducing leverage and moving the liquidation price further away.

**Syntax:**

```
add $<amount> to <market> <long|short>
```

**Example:**

```bash
add $200 to SOL long
```

---

## remove

Remove collateral from an existing position.

**Description:** Decreases the collateral on an open position, increasing leverage and moving the liquidation price closer.

**Syntax:**

```
remove $<amount> from <market> <long|short>
```

**Example:**

```bash
remove $100 from ETH long
```

---

## positions

Display all open positions.

**Description:** Shows a table of all open positions with detailed metrics.

**Syntax:**

```
positions
```

**Output columns:**

| Column | Description |
|:-------|:------------|
| Market | Asset being traded (SOL, BTC, ETH, etc.) |
| Side | Long or Short |
| Leverage | Current leverage multiplier |
| Size | Position notional value (collateral × leverage) |
| Collateral | Margin posted |
| Entry | Average fill price at open |
| Mark | Current Pyth oracle price |
| PnL | Unrealized profit/loss |
| Fees | Accumulated fees (open fee + borrow fees) |
| Liq | Liquidation price |

---

## position debug

Protocol-level position debug information.

**Description:** Shows detailed on-chain position data for a specific market, including raw account fields, CustodyAccount parameters, and SDK liquidation price comparison.

**Syntax:**

```bash
position debug <market>
```

**Example:**

```bash
position debug SOL
```

---

## trade history

View recent trades.

**Description:** Displays the trade journal with recent trade activity including timestamps, actions, markets, sizes, entry prices, and realized PnL.

**Syntax:**

```
trade history
```

**Aliases:** `trades`, `journal`, `history`

---

## dryrun

Preview any trade command without signing.

**Description:** Compiles and simulates the transaction on-chain without broadcasting. Shows entry price, liquidation price, fees, and compute units. No wallet signature is required.

**Syntax:**

```
dryrun <trade command>
```

**Example:**

```bash
dryrun open 2x long SOL $10
```
