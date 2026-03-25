# Wallet Setup

A wallet is required **only for live trading**. Simulation mode works without one.

## What is a Wallet File?

A wallet file is a JSON file that contains your Solana private key. It's how Flash Terminal signs transactions on your behalf.

The file looks like this:

```json
[45,12,198,33,...]
```

It's an array of numbers — your private key in byte format.

::: danger NEVER SHARE THIS FILE
Your wallet file is your private key. Anyone with this file can spend your funds. Never share it, never upload it, never commit it to git.
:::

## Step 1: Install Solana CLI

If you don't have a wallet yet, install the Solana CLI to create one:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

After installation, restart your terminal or run:

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

Verify it's installed:

```bash
solana --version
```

## Step 2: Create a Wallet

```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

You'll be asked to set a passphrase (optional — press Enter to skip).

**Your wallet file is now at:**

```
~/.config/solana/id.json
```

**See your wallet address:**

```bash
solana address
```

## Step 3: Add to Flash Terminal

Create a `.env` file in the directory where you run Flash Terminal (or in the flash-terminal project directory):

```bash
WALLET_PATH=~/.config/solana/id.json
```

That's it. Flash Terminal will load this wallet when you start in live mode.

## Step 4: Fund Your Wallet

For live trading, your wallet needs:

| Token | Purpose | Minimum |
|:------|:--------|:--------|
| **SOL** | Transaction fees | ~0.01 SOL |
| **USDC** | Trade collateral | As much as you want to trade with |

You can get SOL and USDC from any Solana exchange or DEX.

**Check your balances in Flash Terminal:**

```
flash [live] > wallet tokens
```

## Using an Existing Wallet

If you already have a Solana keypair JSON file, just point to it:

```bash
WALLET_PATH=/path/to/your/keypair.json
```

You can also import a wallet inside Flash Terminal:

```
flash [live] > wallet import /path/to/your/keypair.json
```

## Security Best Practices

| Practice | Why |
|:---------|:----|
| Use a dedicated trading wallet | Don't use your main wallet with all your assets |
| Keep the JSON file outside your project folder | Prevents accidentally committing it to git |
| Set file permissions to owner-only | `chmod 600 ~/.config/solana/id.json` |
| Never share the file or its contents | Anyone with the key can drain the wallet |
| Start with small amounts | Test with small trades before scaling up |

::: tip SIMULATION FIRST
Always test your setup in simulation mode before going live. Simulation uses the exact same commands and interface — the only difference is no real money is involved.
:::

## Wallet Commands

Once connected, these commands are available:

```bash
wallet              # Show wallet address and mode
wallet tokens       # Show token balances
wallet disconnect   # Disconnect wallet (zeros key from memory)
```

## Next Steps

- [RPC Setup](/guide/rpc-setup) — Configure your Solana connection
- [Configuration](/guide/configuration) — Full `.env` reference
- [Trading Guide](/guide/trading-guide) — Start trading
