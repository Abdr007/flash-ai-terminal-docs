# Wallet Setup

A wallet is required **only for live trading**. Simulation mode works without one.

## What is a Wallet File?

A Solana wallet file is a JSON file containing your private key as an array of numbers:

```json
[45,12,198,33,87,...]
```

This is the standard format created by the Solana CLI (`solana-keygen`). Flash Terminal reads this file locally to sign transactions. **It is never sent anywhere.**

::: danger NEVER SHARE THIS FILE
Your wallet file IS your private key. Anyone with this file can spend all your funds. Never share it, never upload it, never commit it to git.
:::

## Step 1 — Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Restart your terminal, then verify:

```bash
solana --version
```

## Step 2 — Create a Wallet

```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

You'll be asked for a passphrase (optional — press Enter to skip).

Verify the file exists:

```bash
ls ~/.config/solana/id.json
```

See your wallet address:

```bash
solana address
```

## Step 3 — Add to Flash Terminal

Set the path in your `.env` file:

```bash
WALLET_PATH=~/.config/solana/id.json
```

**Default paths:**

| OS | Default Path |
|:---|:-------------|
| macOS / Linux | `~/.config/solana/id.json` |
| Windows (WSL) | `~/.config/solana/id.json` |

## Step 4 — Fund Your Wallet

For live trading you need:

| Token | Purpose | Minimum |
|:------|:--------|:--------|
| **SOL** | Transaction fees | ~0.01 SOL |
| **USDC** | Trade collateral | Any amount |

Get SOL and USDC from any Solana exchange (Coinbase, Binance, Jupiter, etc.).

Check balances inside Flash Terminal:

```bash
flash [live] > wallet tokens
```

## Using an Existing Wallet

If you already have a keypair JSON file:

```bash
# Set path directly
WALLET_PATH=/path/to/your/keypair.json

# Or import inside the terminal
flash > wallet import /path/to/keypair.json
```

## Multi-Wallet Support

Flash Terminal supports multiple saved wallets:

```bash
wallet import ~/.config/solana/trading.json    # Import with a name
wallet list                                     # List all saved wallets
wallet use trading                              # Switch to a named wallet
wallet disconnect                               # Disconnect current wallet
```

## Security Best Practices

| Practice | Why |
|:---------|:----|
| Use a **dedicated trading wallet** | Don't risk your main holdings |
| Keep the file **outside your project** | Prevents accidental git commits |
| Set permissions to **owner-only** | `chmod 600 ~/.config/solana/id.json` |
| **Test in simulation first** | Verify your setup before going live |
| Start with **small amounts** | Build confidence before scaling |

::: tip
Flash Terminal validates wallet paths — they must resolve within your home directory and cannot follow symlinks outside it.
:::

## Next Steps

- [RPC Setup](/guide/rpc-setup) — Configure your Solana connection
- [Configuration](/guide/configuration) — All environment variables
- [Trading Guide](/guide/trading-guide) — Start trading
