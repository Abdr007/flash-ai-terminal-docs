# Basic Commands

Every command you need to use Flash Terminal.

## Trading

### Open a Position

```bash
open <leverage>x <long|short> <asset> $<amount>
```

**Examples:**

```bash
open 2x long SOL $100       # Go long SOL with $100 at 2x leverage
open 5x short ETH $500      # Go short ETH with $500 at 5x leverage
open 10x long BTC $1000     # Go long BTC with $1000 at 10x leverage
```

You can also attach take-profit and stop-loss:

```bash
open 2x long SOL $100 tp $160 sl $130
```

### Close a Position

```bash
close <asset> <long|short>
```

**Examples:**

```bash
close SOL long       # Close your SOL long position
close ETH short      # Close your ETH short position
```

### Add Collateral

Reduce your liquidation risk by adding more collateral:

```bash
add $<amount> to <asset> <long|short>
```

**Example:**

```bash
add $50 to SOL long
```

### Remove Collateral

Withdraw excess collateral from a position:

```bash
remove $<amount> from <asset> <long|short>
```

**Example:**

```bash
remove $20 from SOL long
```

::: warning
Removing collateral increases leverage and moves your liquidation price closer. Be careful.
:::

### Dry Run (Preview)

Preview any trade without executing it:

```bash
dryrun open 5x long SOL $500
```

Shows the full trade summary (entry price, fees, liquidation price) but doesn't execute.

## Limit Orders

Place orders that execute when price reaches a target:

```bash
limit long SOL 2x $100 @ $82       # Buy SOL if price drops to $82
limit short BTC 3x $200 at $72000  # Short BTC if price rises to $72k
```

Manage limit orders:

```bash
orders                # View all active orders
cancel order 0        # Cancel a specific order
edit limit 0 $85      # Change an order's price
```

## Take-Profit & Stop-Loss

Set automated exit targets on existing positions:

```bash
set tp SOL long $160       # Take profit at $160
set sl SOL long $130       # Stop loss at $130
remove tp SOL long         # Remove take-profit
remove sl SOL long         # Remove stop-loss
tp status                  # View all active targets
```

## Market Data

### Prices

```bash
price SOL        # Current SOL price from Pyth oracle
prices           # All supported asset prices
```

### Market Info

```bash
markets          # List all available markets and pools
funding SOL      # Current funding rate
stats SOL        # 24h volume, open interest, fees
```

### Live Monitor

```bash
monitor          # Live-updating price table (refreshes every 5s)
```

Press any key to exit the monitor.

## Portfolio

```bash
positions        # All open positions with PnL
portfolio        # Full portfolio summary
dashboard        # Risk metrics, exposure breakdown
history          # Recent trade history
```

**Shortcuts:**

| Shortcut | Full Command |
|:---------|:-------------|
| `pos` | `positions` |
| `port` | `portfolio` |
| `dash` | `dashboard` |
| `hist` | `history` |
| `mon` | `monitor` |

## Earn & Staking

```bash
stake <amount> FLP         # Stake FLP tokens
unstake <amount> FLP       # Unstake FLP tokens
faf                        # FAF staking dashboard
faf stake <amount>         # Stake FAF tokens
faf claim                  # Claim FAF rewards
faf tier                   # View VIP tier levels
```

## Wallet

```bash
wallet                     # Show connected wallet address
wallet tokens              # Show token balances
wallet import <path>       # Import a keypair file
wallet disconnect          # Disconnect wallet
```

## Protocol Inspection

```bash
inspect protocol           # Protocol-level stats (TVL, open interest)
inspect pool <name>        # Pool composition and utilization
inspect market <asset>     # Per-market OI, long/short ratio
```

## System

```bash
help                       # List all commands
help <command>             # Detailed help for a command
doctor                     # Run full system diagnostics
rpc status                 # RPC health and latency
config                     # Show active configuration
risk monitor on            # Enable background risk alerts
risk monitor off           # Disable risk alerts
clear                      # Clear terminal
exit                       # Quit
```

## Tips

- **Asset names are flexible** — `SOL`, `sol`, and `solana` all work. Same for `BTC`/`bitcoin`, `ETH`/`ethereum`.
- **Command history** — Use arrow keys to navigate previous commands. History persists across sessions.
- **Natural language** — If you set an `ANTHROPIC_API_KEY`, you can ask questions like "how is SOL doing?" or "show my biggest position."

## Next Steps

- [Trading Guide](/guide/trading-guide) — Understand leverage, PnL, and liquidation
- [Simulation Mode](/guide/simulation) — Practice risk-free
- [Configuration](/guide/configuration) — Customize your setup
