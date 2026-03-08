# Terminal Features

## Status Bar

The terminal title bar shows live system status using xterm OSC escape sequences.

```
Flash | RPC: Helius (340ms) | Sync: OK | Wallet: ABDR | Mode: LIVE
```

- Updates every 10 seconds
- Only redraws when values change
- Uses smoothed latency (5-sample rolling average with 3x outlier rejection)
- Shows sync state from the reconciliation engine
- Zero visual noise — never adds lines to the terminal

## Risk Monitor

Real-time background monitoring of position liquidation risk.

```bash
risk monitor on
risk monitor off
```

**Tiered refresh rates:**

| Data | Interval |
|------|----------|
| Prices | 5 seconds |
| Positions | 20 seconds |

**Risk levels with hysteresis:**

| Transition | Threshold |
|------------|-----------|
| SAFE → WARNING | Distance < 30% |
| WARNING → SAFE | Distance > 35% |
| WARNING → CRITICAL | Distance < 15% |
| CRITICAL → WARNING | Distance > 18% |

Hysteresis prevents alert oscillation near boundaries. Alerts fire only on level changes.

When a position enters CRITICAL, the monitor suggests additional collateral needed to restore safety using a binary search algorithm.

## Watch Mode

Auto-refresh any read-only command on a timer.

```bash
watch positions       # Refresh positions every 5 seconds
watch portfolio       # Refresh portfolio every 5 seconds
watch open interest   # Refresh OI every 5 seconds
```

- Screen redraws in place using cursor control
- Press `q` to exit watch mode
- Timer uses `.unref()` and is cleaned up on exit

## Market Monitor

Full-screen live market table.

```bash
monitor
```

Shows all markets with: price, 24h change, open interest, and long/short ratio. Sorted by OI (most active markets first). Refreshes every 5 seconds. Press any key to exit.

## Command Autocomplete

TAB completion for commands, markets, and pool names.

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

Mistyped commands trigger "Did you mean?" suggestions.

```
flash [sim] > positons

  Did you mean?
    positions
```

Uses Levenshtein edit distance (threshold: 2) with prefix matching as fallback.

## Command History

Arrow keys navigate previous commands. History is saved to `~/.flash_terminal_history` and persists across sessions.

## Wallet Manager

Manage wallets from the terminal.

```bash
wallet               # Connection status
wallet tokens         # Token balances (30s cache)
wallet balance        # SOL balance
wallet list           # Saved wallets
wallet import <name> <path>   # Import keypair
wallet use <name>     # Switch wallet
wallet connect <path> # Quick connect
wallet disconnect     # Disconnect
wallet address        # Show public key
```
