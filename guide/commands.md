# Commands

Complete command reference. Every command listed here is verified from the CLI source code.

## Trading

### Open a Position

```bash
open <leverage>x <long|short> <asset> $<collateral>
```

Word order is flexible. These all work:

```bash
open 2x long SOL $100
long SOL 2x $100
buy SOL 2x $100
SOL long 2x $100
```

With take-profit and stop-loss:

```bash
open 2x long SOL $100 tp $160 sl $130
```

### Close a Position

```bash
close <asset> <long|short>
close 50% of SOL long          # Partial close
close $200 of BTC short         # Close by dollar amount
close all                       # Close ALL positions
```

### Add / Remove Collateral

```bash
add $200 to SOL long            # Lower leverage, safer
remove $100 from ETH long       # Higher leverage, riskier
```

### Dry Run (Preview)

```bash
dryrun open 5x long SOL $500
```

Shows trade summary without executing. Works with any trade command.

## Limit Orders

```bash
limit long SOL 2x $100 @ $130       # Buy SOL if price drops to $130
limit short BTC 3x $200 at $72000   # Short BTC if price rises to $72k
```

Manage orders:

```bash
orders                    # View all active orders
cancel order <id>         # Cancel a specific order
edit limit <id> $<price>  # Change an order's target price
```

## Take-Profit & Stop-Loss

```bash
set tp SOL long $160           # Take profit at $160
set sl SOL long $130           # Stop loss at $130
remove tp SOL long             # Remove take-profit
remove sl SOL long             # Remove stop-loss
tp status                      # View all active TP/SL targets
```

Shortcut syntax:

```bash
tp SOL 160                     # Auto-detects side from open positions
sl BTC 60000
```

## Market Data

```bash
price SOL                # Current price from Pyth oracle
prices                   # All asset prices
markets                  # Available markets with pools
monitor                  # Live-updating price table (5s refresh)
funding SOL              # Current funding rate
stats SOL                # 24h volume, OI, fees
depth SOL                # Liquidity depth around current price
```

## Portfolio & Risk

```bash
positions                # All open positions with PnL
portfolio                # Full portfolio summary
dashboard                # System dashboard with risk metrics
risk report              # Position risk assessment
exposure                 # Exposure breakdown by asset
rebalance                # Rebalance analysis
history                  # Recent trade history
```

**Shortcuts:** `pos`, `port`, `dash`, `hist`

## Analytics

```bash
volume                   # Protocol trading volume (7d/30d)
open interest            # OI breakdown by market (alias: oi)
leaderboard              # Top traders by PnL/volume
whale activity           # Recent large positions (alias: whales)
fees                     # Protocol fee data
liquidations SOL         # Recent liquidations for an asset
```

## Earn & Liquidity

```bash
earn                     # View earn pools with live yield
earn add $100 crypto     # Add liquidity to a pool
earn remove 50% crypto   # Remove liquidity
earn stake $200 gov      # Stake FLP tokens
earn unstake 25% gov     # Unstake FLP
earn claim               # Claim LP/staking rewards
earn info crypto         # Pool details
earn positions           # Your LP positions
earn best                # Rank pools by yield
earn dashboard           # Full liquidity portfolio
earn pnl                 # Earn P&L tracking
earn simulate $1000 crypto  # Simulate yield projection
```

## FAF Token

```bash
faf                      # FAF staking dashboard
faf stake <amount>       # Stake FAF tokens
faf unstake <amount>     # Unstake FAF tokens
faf claim                # Claim FAF rewards + USDC revenue
faf tier                 # VIP tier levels & benefits
faf rewards              # Pending rewards
faf points               # Voltage points & tier multiplier
faf referral             # Referral status & rebates
faf requests             # Pending unstake requests
faf cancel <index>       # Cancel an unstake request
```

## Protocol Inspection

```bash
inspect protocol         # Protocol overview (TVL, OI, pools)
inspect pool <name>      # Pool composition & utilization
inspect market SOL       # Per-market deep dive (OI, whales, risk)
protocol fees SOL        # Fee breakdown for a market
protocol verify          # Full protocol alignment audit
protocol health          # Protocol health metrics
source verify SOL        # Verify price source integrity
```

## Wallet

```bash
wallet                   # Show wallet address & mode
wallet tokens            # All token balances
wallet balance           # SOL balance
wallet list              # List saved wallets
wallet import <path>     # Import & save a keypair
wallet use <name>        # Switch to a saved wallet
wallet connect <path>    # Load keypair directly
wallet disconnect        # Disconnect (zeros key from memory)
```

## Swap

```bash
swap SOL USDC $10        # Swap tokens via Flash Trade
```

## RPC Management

```bash
rpc status               # Current endpoint health
rpc test                 # Test all endpoints
rpc list                 # List configured endpoints
rpc set <url>            # Change primary endpoint
rpc add <url>            # Add backup endpoint
rpc remove <url>         # Remove an endpoint
```

## System

```bash
help                     # List all commands
doctor                   # Full system diagnostics
system status            # System health overview
system metrics           # Runtime metrics (memory, uptime)
system health            # Event loop & memory health
system audit             # Protocol data integrity check
tx inspect <sig>         # Inspect a transaction signature
tx debug <sig>           # Debug a failed transaction
tx metrics               # TX engine performance stats
update                   # Check for updates
degen                    # Toggle degen mode (higher leverage limits)
config                   # Show active configuration
clear                    # Clear terminal
exit                     # Quit
```

## Tips

- **Flexible asset names** — `SOL`, `sol`, `solana` all resolve to SOL. Same for `BTC`/`bitcoin`, `ETH`/`ethereum`, `oil`/`crudeoil`.
- **Fuzzy correction** — Typos like `lon` or `shor` are auto-corrected to `long`/`short`.
- **Arrow keys** — Navigate command history. Persists across sessions.
- **Degen mode** — `degen on` unlocks higher per-market leverage limits. Use with caution.

## Next Steps

- [Trading Guide](/guide/trading-guide) — Understand leverage, PnL, liquidation
- [Simulation Mode](/guide/simulation) — Practice risk-free
- [Earn & Liquidity](/guide/earn) — Provide liquidity and earn yield
