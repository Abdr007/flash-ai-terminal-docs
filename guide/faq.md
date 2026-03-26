# FAQ

## General

### What is Flash Terminal?

A command-line tool for trading perpetual futures on [Flash Trade](https://www.flash.trade/), a Solana derivatives protocol. 100+ commands covering trading, earn, analytics, and protocol inspection.

### Is this safe?

Yes. 10 independent safety layers protect every live trade — trade confirmation, signing guard, rate limiter, circuit breaker, kill switch, exposure control, pre-flight simulation, program whitelist, instruction freeze, and trade mutex. See [Risk & Safety](/guide/risk-safety).

### Do I need money to try it?

No. Simulation mode (the default) uses virtual USDC with real market prices. No wallet, no funds, no account.

### What network does it support?

Solana mainnet-beta only. Flash Trade operates exclusively on Solana.

### What assets can I trade?

32+ assets: crypto (SOL, BTC, ETH), equities (NVDA, TSLA, SPY), commodities (Gold, Oil), forex (EUR, GBP), governance tokens (JUP, PYTH), and memecoins (BONK, WIF). Run `markets` to see the full list.

---

## Setup

### Do I need a wallet for simulation?

No. Just install and run `flash`.

### What wallet format is supported?

Solana keypair JSON file — an array of numbers like `[45,12,198,...]`. Standard format from `solana-keygen new`.

### Can I use a Ledger hardware wallet?

Not currently. Flash Terminal requires a file-based keypair.

### Which RPC should I use?

- **Simulation:** Default public RPC is fine
- **Live trading:** Use a paid provider like [Helius](https://helius.dev/) or [Triton](https://triton.one/)

### How do I update?

```bash
npm update -g flash-terminal
# or inside the terminal:
update
```

---

## Trading

### What's the minimum trade size?

~$10 USDC collateral, depending on the market.

### How much SOL do I need for fees?

~0.005-0.01 SOL per trade. Keep at least 0.1 SOL.

### Can I have two positions on the same asset?

One long and one short — yes. Two longs or two shorts on the same market — no. Flash Trade rejects duplicates.

### What happens if I get liquidated?

Your position is closed and its collateral is lost. Other positions are unaffected. See [Trading Guide](/guide/trading-guide#liquidation).

### Are TP/SL orders on-chain?

In live mode, yes. They're placed on the Flash Trade protocol and survive terminal shutdown.

### What happens to positions if I close the terminal?

Live positions and on-chain orders (TP/SL, limits) persist. Manage them from [flash.trade](https://www.flash.trade/) or restart the terminal.

### What is degen mode?

`degen on` unlocks higher per-market leverage limits (e.g., 200x on SOL instead of 100x). Use `degen off` to restore defaults. Markets must support degen mode for this to have effect.

---

## Simulation

### Are simulation prices real?

Yes. Same Pyth oracle feeds used for live Flash Trade execution.

### Can I switch from sim to live mid-session?

No. Mode is locked at startup. Exit, change `SIMULATION_MODE=false`, restart.

### Where is simulation data stored?

In memory. Terminal crash = state lost.

---

## Security

### Is my private key safe?

Flash Terminal reads the keypair file locally and never sends it over the network. On `wallet disconnect`, the key is zeroed from memory. API keys are scrubbed from all log files.

### Does Flash Terminal phone home?

No. It only communicates with:
- Your configured Solana RPC endpoint
- Pyth Hermes (oracle prices)
- Flash Trade fstats API (analytics)
- CoinGecko (market data)
- Your AI provider (if configured, for NL queries only — never trades)

### Where are logs?

- **Signing audit:** `~/.flash/signing-audit.log` — every trade attempt, no keys
- **Application:** configured via `LOG_FILE` env var

Both rotate at 10MB.

---

## Platform

### Does it work on Windows?

Yes — via WSL, native Node.js, or Docker.

### Does it work on Linux?

Yes. Any system with Node.js v20+.

### Is there a GUI?

No. Flash Terminal is CLI-only. For a web UI, use [flash.trade](https://www.flash.trade/).

---

## Still Have Questions?

- Run `help` inside Flash Terminal
- Check [Troubleshooting](/guide/troubleshooting)
- Run `doctor` for diagnostics
- Open a [GitHub issue](https://github.com/Abdr007/flash-terminal/issues)
