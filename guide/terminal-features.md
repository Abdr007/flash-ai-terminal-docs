# Terminal Features

## Status Bar

The terminal title bar shows live system status using xterm OSC escape sequences.

```
Flash | RPC: Helius (340ms) | Sync: OK | Wallet: ABDR | Mode: LIVE
```

- Updates on a timer, only redraws when values change
- Uses smoothed latency (5-sample rolling average with 3x outlier rejection)
- Shows sync state from the reconciliation engine
- Zero visual noise -- never adds lines to the terminal output

## Watch Mode

Auto-refresh any read-only command every 5 seconds.

```bash
watch positions
watch portfolio
watch open interest
```

- Screen redraws in place using cursor control
- Press `q` to exit watch mode
- Timer is cleaned up on exit

## Market Monitor

Full-screen live market table.

```bash
monitor
```

Shows all markets with:

- Current price
- 24h price change
- Open interest
- Long/short ratio

Markets are sorted by OI (most active first). Refreshes every 5 seconds. Press any key to exit.

## Command Autocomplete

TAB completion for commands, market symbols, and pool names.

```bash
open 5x long S<TAB>    # Completes to SOL
inspect pool C<TAB>     # Completes to Crypto.1
clos<TAB>               # Completes to close
```

Context-aware completions:

- Trade commands suggest market symbols
- `inspect pool` suggests pool names
- `inspect market` suggests market symbols
- Bare input matches command names

## Typo Correction

Mistyped commands trigger "Did you mean?" suggestions using Levenshtein edit distance with a 2-character threshold.

```
flash [sim] > positons

  Did you mean?
    positions
```

## Command History

Arrow keys navigate previous commands. History is persisted to `~/.flash/history` and available across sessions.

## Wallet Manager

Manage wallets from the terminal.

```bash
wallet                         # Connection status
wallet tokens                  # Token balances (30s cache)
wallet balance                 # SOL balance
wallet list                    # Saved wallets
wallet import <name> <path>    # Import keypair
wallet use <name>              # Switch wallet
wallet connect <path>          # Quick connect
wallet disconnect              # Disconnect
```
