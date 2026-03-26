# Quick Start

Your first trade in under 2 minutes. No wallet needed.

## 1. Install

```bash
npm install -g flash-terminal
```

Requires [Node.js](https://nodejs.org/) v20+. Check with `node --version`.

## 2. Launch

```bash
flash
```

Select **Simulation** mode. Your prompt shows:

```
flash [sim] >
```

## 3. Open a Trade

```bash
flash [sim] > open 2x long SOL $100
```

This opens a **long position** on SOL with **$100 collateral** at **2x leverage** ($200 position size).

You'll see a trade preview with entry price, estimated fees, and liquidation price. Confirm with `yes`.

## 4. Check Your Position

```bash
flash [sim] > positions
```

```
  SOL  LONG  2x  $200.00  $100.00  $148.52  $149.10  +$0.78  $0.16  $75.02
```

Shows: Market, Side, Leverage, Size, Collateral, Entry, Mark Price, PnL, Fees, Liquidation Price.

## 5. Close It

```bash
flash [sim] > close SOL long
```

Done. Your PnL is realized and your collateral is returned.

## Try More

```bash
price SOL                   # Current SOL price
prices                      # All asset prices
markets                     # Available markets
portfolio                   # Full portfolio view
open 3x short ETH $50      # Short ETH
history                     # Trade history
help                        # All commands
```

## Next Steps

| What | Where |
|:-----|:------|
| All commands | [Commands](/guide/commands) |
| Understand leverage & PnL | [Trading Guide](/guide/trading-guide) |
| Set up a real wallet | [Wallet Setup](/guide/wallet-setup) |
| Configure your terminal | [Configuration](/guide/configuration) |
