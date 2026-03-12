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

**Examples:**

```bash
open 5x long SOL $500
open 2x long SOL $100 tp $95 sl $80
open 3x short BTC $200 sl $73000
```

**Inline TP/SL:** You can attach take-profit and/or stop-loss targets directly to the open command. These are set automatically after the position is confirmed. See [TP/SL](#set-tp-sl) for details.

| Suffix | Description |
|--------|-------------|
| `tp $<price>` | Set take-profit target (optional) |
| `sl $<price>` | Set stop-loss target (optional) |

Order of `tp` and `sl` is flexible. Both are optional.

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

---

## set tp/sl

Set take-profit or stop-loss targets on an open position.

**Description:** Attaches automated price targets to an existing position. When the valuation price reaches the target, the position is closed automatically using the existing trading pipeline.

**Syntax:**

```
set tp <market> <long|short> $<price>
set sl <market> <long|short> $<price>
```

**Examples:**

```bash
set tp SOL long $95
set sl SOL long $80
set tp BTC short $60000
```

**Alternate syntax:**

```bash
set tp $95 for SOL long
set sl $80 for SOL long
```

**Safety features:**

- **Spike protection:** Requires 2 consecutive price ticks before triggering (prevents false execution from oracle spikes)
- **Pre-trigger validation:** Circuit breaker and kill switch are checked before every execution
- **Duplicate prevention:** A triggered target cannot fire again

---

## remove tp/sl

Remove a take-profit or stop-loss target from a position.

**Syntax:**

```
remove tp <market> <long|short>
remove sl <market> <long|short>
```

**Example:**

```bash
remove tp SOL long
remove sl BTC short
```

---

## tp status

Display all active TP/SL targets.

**Syntax:**

```
tp status
```

**Aliases:** `tpsl status`, `tpsl`

---

## limit

Place a limit order that triggers when price reaches a specified level.

**Description:** Creates a session-scoped limit order. When the valuation price hits the target, the existing open-position pipeline is called automatically. Limit orders exist only for the current terminal session and are not written to disk.

**Trigger logic:**

- **Long:** Triggers when price drops to or below the limit price (buy the dip)
- **Short:** Triggers when price rises to or above the limit price (sell the rally)

**Syntax:**

```
limit <long|short> <market> <leverage>x $<collateral> @ $<price>
```

**Examples:**

```bash
limit long SOL 2x $100 @ $82
limit short BTC 3x $200 @ $72000
limit long ETH 5x $500 at $1800
limit order sol 2x for 10 dollars long at 82
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `long\|short` | string | Position direction |
| `market` | string | Market symbol |
| `leverage` | number | Leverage multiplier (1-100x) |
| `collateral` | number | Collateral amount in USD |
| `price` | number | Trigger price |

**Safety features:**

- **Spike protection:** Requires 2 consecutive price ticks before triggering
- **Pre-trigger validation:** Circuit breaker and kill switch checked before execution
- **Execution failure recovery:** If the trade fails, the order resets and can retry
- **Session-scoped:** Orders are cleared on terminal restart
- **Capacity limit:** Maximum 50 active orders

The parser accepts flexible phrasing — `@` or `at`, `$` or bare numbers, `dollars`, `for`/`with` prefixes, and any word order.

---

## orders

Display all active limit orders.

**Syntax:**

```
orders
```

**Aliases:** `order list`, `limit orders`

**Output columns:**

| Column | Description |
|:-------|:------------|
| ID | Order identifier (order-1, order-2, ...) |
| Market | Target market |
| Side | Long or Short |
| Lev | Leverage multiplier |
| Collateral | Collateral amount |
| Limit Price | Trigger price |

---

## cancel order

Cancel an active limit order.

**Syntax:**

```
cancel order <id>
```

**Example:**

```bash
cancel order order-1
```
