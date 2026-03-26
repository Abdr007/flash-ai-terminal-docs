# Wallet Commands

## wallet

Show wallet connection status: address, mode (sim/live), connection state.

**Aliases:** `wallet status`

## wallet tokens

View all token balances in the connected wallet. Detects SPL tokens and Token-2022 tokens. Uses 30-second cache.

## wallet balance

Show SOL balance only.

## wallet list

List all saved/named wallets.

## wallet import

Import a keypair JSON file and save it with a name for quick switching.

```bash
wallet import <path>
```

## wallet use

Switch to a previously saved wallet by name.

```bash
wallet use <name>
```

## wallet connect

Load a keypair directly from file path (without saving).

```bash
wallet connect <path>
```

## wallet disconnect

Disconnect the active wallet. Zeros the secret key from memory.

## wallet address

Display the current wallet's public address (hidden from help).

## wallet remove

Remove a saved wallet by name (does not delete the keypair file).

---

**See also:** [Wallet Setup Guide](/guide/wallet-setup) | [Configuration](/guide/configuration) | [Troubleshooting](/guide/troubleshooting)
