# FAQ

## General

### What is Flash Terminal?

A command-line tool for trading perpetual futures on [Flash Trade](https://www.flash.trade/), a Solana-based derivatives protocol. You type commands, it executes trades.

### Is this safe to use?

Yes. Flash Terminal has 10 independent safety layers protecting every live trade:

- Every trade shows a full preview before signing
- You must type `yes` to confirm
- Rate limits prevent accidental rapid-fire trades
- Circuit breakers halt trading if losses exceed your limits
- Simulation mode lets you practice with zero risk

See [Risk & Safety](/guide/risk-safety) for the full breakdown.

### Do I need money to try it?

No. Simulation mode is free and uses virtual USDC with real market prices. No wallet, no funds, no account needed.

### What networks are supported?

**Solana mainnet only.** Flash Trade operates exclusively on Solana mainnet-beta.

### What assets can I trade?

32+ assets across crypto, stocks, commodities, forex, governance tokens, and memecoins. Run `markets` inside the terminal to see the full list.

### Is there a GUI version?

No. Flash Terminal is CLI-only by design. For a web interface, use [flash.trade](https://www.flash.trade/).

---

## Setup

### Do I need a wallet for simulation mode?

No. Simulation mode works without any wallet. Just install and run `flash`.

### What kind of wallet file do I need?

A Solana keypair JSON file — an array of numbers like `[45,12,198,...]`. This is the standard format created by `solana-keygen new`.

### Can I use a hardware wallet (Ledger)?

No. Flash Terminal currently requires a file-based keypair. Use a dedicated software wallet for trading.

### Which RPC provider should I use?

- **For simulation:** The default public RPC is fine
- **For live trading:** Use a paid provider like [Helius](https://helius.dev/) or [Triton](https://triton.one/) for better reliability

### How do I update to the latest version?

```bash
npm update -g flash-terminal
```

---

## Trading

### What is the minimum trade size?

The minimum depends on the market and pool, but typically around $10 USDC collateral.

### How much SOL do I need for transaction fees?

About 0.005-0.01 SOL per trade. Keep at least 0.1 SOL in your wallet for fees.

### Can I have multiple positions on the same asset?

You can have one **long** and one **short** position on the same asset, but not two positions on the same side. Flash Trade rejects duplicates.

### What happens if I get liquidated?

Your position is closed automatically and your collateral for that position is lost. Other positions are not affected. See [Trading Guide](/guide/trading-guide#what-is-liquidation) for details.

### Are TP/SL orders on-chain?

Yes. Take-profit and stop-loss orders are placed on the Flash Trade protocol. They survive terminal shutdown and are visible on [flash.trade](https://www.flash.trade/).

### Can I trade after the terminal is closed?

Your existing positions and on-chain orders (TP/SL, limit orders) remain active. You can manage them from the Flash Trade website or restart Flash Terminal.

---

## Simulation

### Are simulation prices real?

Yes. Simulation uses live [Pyth oracle](https://pyth.network/) prices — the same feeds used by Flash Trade for real trades.

### Are simulation fees accurate?

Approximately. Simulation uses 0.08% (8 bps) fee rate, which is typical for Flash Trade. Live mode reads the exact fee from on-chain data, which may vary slightly by market.

### Can I switch from simulation to live mid-session?

No. The mode is locked when the terminal starts. Close the terminal, set `SIMULATION_MODE=false` in `.env`, and restart.

### Where is simulation data stored?

In memory. If the terminal crashes, simulation state may be lost.

---

## Security

### Is my private key safe?

Flash Terminal reads your keypair file locally and never sends it anywhere. When you disconnect (`wallet disconnect`), the key is zeroed from memory.

Additional protections:
- API keys are scrubbed from log files
- Wallet import validates file paths (no arbitrary file reads)
- RPC URLs are validated (must be HTTPS)
- All signing goes through a signing guard with audit logging

### Does Flash Terminal phone home?

No. Flash Terminal only communicates with:
- Your configured Solana RPC endpoint
- Pyth Hermes (for oracle prices)
- Flash Trade fstats API (for analytics)
- CoinGecko (for market data)
- Your AI provider (if configured, for NL queries only)

### Where are trade logs stored?

`~/.flash/signing-audit.log` — Records every trade attempt with timestamp, market, side, and result. Never contains private keys or sensitive data.

---

## Troubleshooting

### Why is the terminal slow?

Usually the RPC endpoint. Try:
1. `rpc status` to check latency
2. Switch to a faster/paid RPC provider
3. Check your internet connection

### Why do I see "circuit breaker active"?

Your cumulative losses exceeded `MAX_SESSION_LOSS_USD` or `MAX_DAILY_LOSS_USD`. Restart the terminal to reset. See [Troubleshooting](/guide/troubleshooting#circuit-breaker-tripped).

### Can I run Flash Terminal on Windows?

Yes, via WSL (Windows Subsystem for Linux), or natively with Node.js for Windows. Docker also works.

### How do I report a bug?

Open an issue on [GitHub](https://github.com/Abdr007/flash-terminal/issues).

---

## Still Have Questions?

- Read the [Basic Commands](/guide/basic-commands) guide
- Run `help` inside Flash Terminal
- Check [Troubleshooting](/guide/troubleshooting)
- Open a [GitHub issue](https://github.com/Abdr007/flash-terminal/issues)
