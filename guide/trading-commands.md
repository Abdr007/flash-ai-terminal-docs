# Trading Commands

Flash Terminal provides deterministic trading commands that map directly to on-chain actions.

## Open Position

Open a leveraged perpetual position.

```
open <leverage>x <long|short> <asset> $<collateral>
```

**Examples:**

```bash
open 2x long SOL $100
open 5x short ETH $500
open 10x long BTC $1000
open 2x long SOL $100 tp $95 sl $80
```

You can attach take-profit and stop-loss targets inline. They are set automatically after the position is confirmed.

The terminal displays a confirmation panel before execution:

```
CONFIRM TRANSACTION
─────────────────────────────────
  Market:      SOL LONG
  Pool:        Crypto.1
  Leverage:    2x
  Collateral:  $100.00 USDC
  Size:        $200.00
  Est. Fee:    $0.16
  Wallet:      ABDR...7x4f

  Risk Preview:
    Est. Entry:   $148.52
    Est. Liq:     $81.69
    Distance:     45.0%
    Risk:         MEDIUM
    Exposure:     $0.00 → $200.00
```

Type `yes` to confirm or `no` to cancel.

## Close Position

Close an existing position.

```
close <asset> <long|short>
```

**Examples:**

```bash
close SOL long
close ETH short
```

The confirmation shows current position details including unrealized PnL.

## Add Collateral

Add collateral to reduce liquidation risk.

```
add $<amount> to <asset> <long|short>
```

**Examples:**

```bash
add $100 to SOL long
add $50 to BTC short
```

## Remove Collateral

Withdraw excess collateral from a position.

```
remove $<amount> from <asset> <long|short>
```

**Examples:**

```bash
remove $100 from SOL long
remove $50 from BTC short
```

::: warning
Removing collateral increases leverage and moves the liquidation price closer. The confirmation panel shows current position details so you can assess the impact.
:::

## View Positions

Display all open positions in a formatted table.

```bash
positions
```

Output includes: market, side, leverage, size, collateral, entry price, mark price, unrealized PnL, fees, and liquidation price.

## Trade History

View the trade journal.

```bash
trade history
```

**Aliases:** `trades`, `journal`, `history`

In simulation mode, shows all executed trades with entry/exit prices, PnL, and fees. In live mode, provides links to Solscan for on-chain verification.

## Fee Structure

Every trade incurs an open fee and a close fee, calculated as a percentage of position size (not collateral). Fee rates are read from `CustodyAccount` on-chain data per market. Typical rates are ~0.08% (8 bps).

```
Open Fee  = Position Size × Open Fee Rate
Close Fee = Position Size × Close Fee Rate
```

While a position is open, **borrow fees** accrue continuously in `unsettledFeesUsd`. Flash Trade does not use periodic funding rates like centralized exchanges.

See [Protocol Alignment](/guide/protocol-alignment) for details on how fee rates are extracted from on-chain data.

## Take-Profit / Stop-Loss

Flash Terminal can automatically close positions when price targets are hit.

### Setting Targets

Set targets on an existing position:

```bash
set tp SOL long $95
set sl SOL long $80
```

Or inline when opening:

```bash
open 2x long SOL $100 tp $95 sl $80
```

Both approaches produce identical targets in the TP/SL engine.

### Managing Targets

```bash
tp status              # View all active targets
remove tp SOL long     # Remove take-profit
remove sl SOL long     # Remove stop-loss
```

### Safety

- **Spike protection:** Requires 2 consecutive price ticks before triggering, preventing false execution from oracle spikes
- **Pre-trigger checks:** Circuit breaker and kill switch are verified before every close
- **Valuation price:** Uses the same Pyth oracle price used for PnL, liquidation, and risk calculations

## Limit Orders

Limit orders let you queue a position that opens automatically when price reaches a target level.

### Placing a Limit Order

```bash
limit long SOL 2x $100 @ $82
limit short BTC 3x $200 at $72000
```

The parser is flexible — these all work:

```bash
limit long sol 2x $100 @ $82
limit order sol 2x for 10 dollars long at 82
limit sol long 2x $100 at $82
```

### How It Works

- **Long orders** trigger when price drops to or below the limit price
- **Short orders** trigger when price rises to or above the limit price

When triggered, the order calls the same `open` pipeline used by manual trades — including signing guard, circuit breaker, and confirmation flow.

### Managing Orders

```bash
orders                 # View all active limit orders
cancel order order-1   # Cancel a specific order
```

### Session Scope

Limit orders exist only for the current terminal session. Restarting the terminal clears all orders. They are never written to disk.

::: warning
Limit orders require the terminal to remain running. If you close the terminal, all pending limit orders are lost.
:::

## Supported Markets

| Pool | Markets |
|:-----|:--------|
| Crypto.1 | SOL, BTC, ETH, and others |
| Virtual.1 | XAG, XAU, CRUDEOIL, EUR, GBP, and others |
| Governance.1 | JTO, JUP, PYTH, RAY, HYPE, MET, KMNO |
| Community.1 | Various community tokens |
| Community.2 | Various community tokens |
| Trump.1 | TRUMP, MELANIA |
| Ore.1 | ORE |

::: tip Dynamic Discovery
Markets are loaded dynamically from the Flash SDK `PoolConfig`. Run `markets` to see the current list.
:::
