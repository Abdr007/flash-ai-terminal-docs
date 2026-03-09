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
```

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

## Supported Markets

| Pool | Markets |
|------|---------|
| Crypto.1 | SOL, BTC, ETH |
| Virtual.1 | VIRTUAL |
| Governance.1 | JTO, JUP, KMNO, RAY, MET, PENGU, HYPE, TRUMP |
| Community.1 | WIF, BONK, POPCAT, PNUT, AI16Z, FARTCOIN, VINE |
| Community.2 | PUMP, XRP, DOGE, SUI |
| Trump.1 | TRUMP, MELANIA |
| Ore.1 | ORE |

View all available markets with:

```bash
markets
```
