# Trading Commands

## open

Open a leveraged perpetual position.

```bash
open <leverage>x <long|short> <asset> $<collateral> [tp $<price>] [sl $<price>]
```

Word order is flexible:

```bash
open 2x long SOL $100
long SOL 2x $100
buy SOL 2x $100
SOL long 2x $100
open 2x long SOL $100 tp $160 sl $130
```

| Param | Required | Description |
|:------|:---------|:------------|
| leverage | Yes | Multiplier (`2x`, `5x`, `10x`, etc.) |
| side | Yes | `long` or `short` |
| asset | Yes | Market symbol (`SOL`, `BTC`, `ETH`, etc.) |
| collateral | Yes | USD amount with `$` prefix |
| tp | No | Take-profit target price |
| sl | No | Stop-loss target price |

## close

Close an open position (full or partial).

```bash
close <asset> <side>
close <percent>% of <asset> <side>
close $<amount> of <asset> <side>
close all
```

**Aliases:** `close-all`, `closeall`, `exit all`

## add

Add collateral to an existing position. Reduces leverage.

```bash
add $<amount> to <asset> <side>
```

## remove

Remove collateral from an existing position. Increases leverage.

```bash
remove $<amount> from <asset> <side>
```

## dryrun

Preview any trade without executing.

```bash
dryrun <any trade command>
```

Shows entry price, estimated fees, liquidation price, and compute units.

## limit

Place a GTC limit order.

```bash
limit <side> <asset> <leverage>x $<collateral> @ $<price>
```

```bash
limit long SOL 2x $100 @ $130
limit short BTC 3x $200 at $72000
```

## orders

List all active limit orders.

**Aliases:** `order list`, `limit orders`

## cancel order

Cancel a limit order by ID.

```bash
cancel order <id>
```

## edit limit

Modify a limit order's target price.

```bash
edit limit <id> $<price>
```

## set tp / set sl

Set take-profit or stop-loss on an open position.

```bash
set tp <asset> <side> $<price>
set sl <asset> <side> $<price>
```

Shortcut (auto-detects side):

```bash
tp SOL 160
sl BTC 60000
```

## remove tp / remove sl

Remove take-profit or stop-loss from a position.

```bash
remove tp <asset> <side>
remove sl <asset> <side>
```

## tp status

View all active TP/SL targets.

**Aliases:** `tpsl status`, `tpsl`

## positions

View all open positions with PnL, fees, and liquidation price.

**Aliases:** `position`, `pos`

## position debug

Debug info for a specific position.

```bash
position debug <asset>
```

## trade history

Recent trade journal.

**Aliases:** `trades`, `journal`, `history`, `hist`

## swap

Swap tokens via Flash Trade.

```bash
swap <from> <to> $<amount>
```

```bash
swap SOL USDC $10
```
