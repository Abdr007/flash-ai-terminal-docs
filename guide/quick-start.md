# Quick Start

Your first trade in under 2 minutes. No wallet needed.

## Step 1: Install

Make sure you have [Node.js](https://nodejs.org/) v20 or higher installed.

```bash
node --version
# Should show v20.x.x or higher
```

Then install Flash Terminal:

```bash
npm install -g flash-terminal
```

## Step 2: Launch

```bash
flash
```

You'll see a mode selection screen:

```
┌─────────────────────────────────────┐
│  Flash Terminal                     │
│                                     │
│  Select mode:                       │
│  1. Simulation (paper trading)      │
│  2. Live (real transactions)        │
│                                     │
└─────────────────────────────────────┘
```

Choose **1** (Simulation). Your prompt will look like this:

```
flash [sim] >
```

## Step 3: Your First Trade

Open a 2x long position on SOL with $100:

```
flash [sim] > open 2x long SOL $100
```

You'll see a trade preview showing entry price, estimated fees, and liquidation price. Type `yes` to confirm.

## Step 4: Check Your Position

```
flash [sim] > positions
```

```
┌─────────┬──────┬─────┬──────────┬────────────┬──────────┬──────────┬─────────┬────────┬───────────┐
│ Market  │ Side │ Lev │ Size     │ Collateral │ Entry    │ Mark     │ PnL     │ Fees   │ Liq Price │
├─────────┼──────┼─────┼──────────┼────────────┼──────────┼──────────┼─────────┼────────┼───────────┤
│ SOL     │ LONG │ 2x  │ $200.00  │ $100.00    │ $142.50  │ $143.10  │ +$0.84  │ $0.16  │ $71.96    │
└─────────┴──────┴─────┴──────────┴────────────┴──────────┴──────────┴─────────┴────────┴───────────┘
```

## Step 5: Close the Trade

```
flash [sim] > close SOL long
```

Done. You just made your first trade.

## What You Can Try Next

```bash
# Check your portfolio
flash [sim] > portfolio

# See all available markets
flash [sim] > markets

# Get the price of Bitcoin
flash [sim] > price BTC

# Open a short position
flash [sim] > open 3x short ETH $50

# View trade history
flash [sim] > history

# Get help
flash [sim] > help
```

## Ready for More?

- [Basic Commands](/guide/basic-commands) — Full list of everything you can do
- [Trading Guide](/guide/trading-guide) — Understand leverage, PnL, and liquidation
- [Wallet Setup](/guide/wallet-setup) — Set up a real wallet for live trading
- [Configuration](/guide/configuration) — Customize your `.env` settings
