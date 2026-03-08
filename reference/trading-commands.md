# Trading Commands

## open

Open a leveraged perpetual position.

**Syntax:**

```
open <leverage>x <long|short> <market> $<collateral>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `leverage` | number | Leverage multiplier (1-100x, market-dependent) |
| `long\|short` | string | Position direction |
| `market` | string | Market symbol (e.g., SOL, BTC, ETH) |
| `collateral` | number | Collateral amount in USD (min $10) |

**Examples:**

```bash
open 2x long SOL $10
open 5x short ETH $200
open 10x long BTC $1000
```

---

## close

Close an existing position.

**Syntax:**

```
close <market> <long|short>
close <market>              # auto-detects side if only one position
```

**Examples:**

```bash
close SOL long
close ETH short
close SOL                   # auto-detect
```

---

## add

Add collateral to an existing position.

**Syntax:**

```
add $<amount> to <market> <long|short>
```

**Examples:**

```bash
add $100 to SOL long
add $50 to BTC short
```

---

## remove

Remove collateral from an existing position.

**Syntax:**

```
remove $<amount> from <market> <long|short>
```

**Examples:**

```bash
remove $100 from SOL long
remove $50 from BTC short
```

---

## positions

Display all open positions.

```bash
positions
```

Output columns: Market, Side, Leverage, Size, Collateral, Entry, Mark, PnL, Fees, Liquidation.

---

## trade history

View trade journal.

```bash
trade history
```

Aliases: `trades`, `journal`, `history`

---

## dryrun

Preview any trade command without signing.

```bash
dryrun open 5x long SOL $100
dryrun close ETH short
```

Compiles and simulates the transaction on-chain. Shows entry price, liquidation price, fees, and compute units.
