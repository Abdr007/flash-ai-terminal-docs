# Quick Start

Goal: execute your first trade in under 5 minutes.

## Prerequisites

| Requirement | Minimum | Notes |
|:------------|:--------|:------|
| **Node.js** | v20+ | LTS recommended. Check with `node --version`. |
| **Solana RPC** | Any mainnet endpoint | [Helius](https://helius.dev/) or [Triton](https://triton.one/) recommended for reliability. Public RPC works but has rate limits. |
| **Solana keypair** | Ed25519 JSON file | Only required for live trading. Simulation mode needs no keypair. |

## Step 1: Install

```bash
npm install -g flash-terminal
```

Or install from source:

```bash
git clone https://github.com/Abdr007/flash-terminal.git
cd flash-terminal
npm install
npm run build
npm link
```

Verify the installation:

```bash
flash --version
```

## Step 2: Configure

```bash
cp .env.example .env
```

Open `.env` and set the following:

| Variable | Required | Description |
|:---------|:---------|:------------|
| `RPC_URL` | Yes | Your Solana mainnet RPC endpoint. HTTPS required (HTTP allowed only for localhost). |
| `WALLET_PATH` | For live trading | Absolute path to your Solana keypair JSON file. Supports `~` expansion. |
| `SIMULATION_MODE` | No | `true` (default) or `false`. Controls whether transactions are signed and broadcast. |
| `ANTHROPIC_API_KEY` | No | Enables natural language queries ("how is SOL doing?"). Not used for trade execution. |

::: tip START IN SIMULATION
Leave `SIMULATION_MODE=true` (the default). Simulation uses real Pyth oracle prices and protocol-accurate fee models but never signs or broadcasts transactions. You do not need a wallet or SOL balance.
:::

## Step 3: Run

```bash
flash
```

The terminal presents a mode selection prompt:

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

Select **Simulation** for your first session. The prompt changes to indicate the active mode:

```
flash [sim] >
```

## Step 4: First Trade

**Open a position.** Go 2x long SOL with $100 collateral:

```
flash [sim] > open 2x long SOL $100
```

The terminal displays a full trade preview — market, side, leverage, collateral, estimated size, entry price, liquidation price, and fees — before execution.

**View your position:**

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

**Check your portfolio:**

```
flash [sim] > portfolio
```

**Close the position:**

```
flash [sim] > close SOL long
```

**Review trade history:**

```
flash [sim] > trade history
```

## Step 5: Going Live

When you are ready to trade with real funds:

**What you need:**
- A funded Solana wallet (keypair JSON file) with:
  - **SOL** for transaction fees (~0.005 SOL per trade)
  - **USDC** for position collateral
- A reliable RPC endpoint (public RPC will work but may drop transactions under load)

**Switch to live mode:**

Set `SIMULATION_MODE=false` in your `.env` file and restart, or select **Live** at the mode selection prompt.

```
flash [live] >
```

::: warning LIVE MODE SAFEGUARDS
In live mode, every trade requires explicit confirmation before signing. The signing guard displays the full trade summary — market, side, leverage, collateral, size, estimated fees, and wallet address — and waits for your approval. Configure `MAX_COLLATERAL_PER_TRADE` and `MAX_LEVERAGE` in `.env` for additional protection.
:::

**Verify your connection:**

```
flash [live] > wallet
flash [live] > rpc status
flash [live] > protocol verify
```

## What's Next

- [Core Concepts](/guide/core-concepts) -- understand markets, leverage, liquidation, and fees
- [Trading Commands](/guide/trading-commands) -- full command reference for all trade operations
- [Security Model](/guide/security) -- the 10-layer safety stack protecting your trades
- [Architecture](/guide/architecture) -- how the execution pipeline works end to end
