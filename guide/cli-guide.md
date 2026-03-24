# CLI Guide

Flash Terminal is an interactive REPL for trading Solana perpetual futures. It boots into a prompt, accepts commands, and returns structured output. No GUI, no web interface, no daemon — one process, one terminal.

## Modes

The terminal operates in two modes, selected at startup.

| Mode | Prompt | Signing | Prices |
|:-----|:-------|:--------|:-------|
| Simulation | `flash [sim] >` | Never signs transactions | Live Pyth oracles |
| Live | `flash [live] >` | Signs and broadcasts to Solana | Live Pyth oracles |

Simulation is the default. It uses real oracle prices but never touches the blockchain. Balances, positions, and PnL are tracked in-memory and persisted to `~/.flash/sim-state.json`.

::: warning
Live mode requires a connected wallet with USDC. Every trade displays a full confirmation panel before signing. There is no way to bypass this gate.
:::

## Command Structure

Commands are parsed by a deterministic regex engine. The parser extracts intent, asset, side, leverage, and amounts from structured input:

```
open 5x long SOL $100
close SOL
add collateral SOL $50
```

When an `ANTHROPIC_API_KEY` or `GROQ_API_KEY` is set, unrecognized input falls back to natural language interpretation. The LLM maps free-text queries to the same structured tool calls — it cannot invent new operations.

```
flash [sim] > what's the funding rate on ETH?
flash [sim] > show me my biggest position
flash [sim] > how much SOL open interest is there?
```

The deterministic path is always tried first. The LLM fallback is read-only for market data queries and requires confirmation for any trade action.

## Command Categories

### Trading

| Command | Description |
|:--------|:------------|
| `open <lev>x <long\|short> <asset> $<collateral>` | Open a leveraged position |
| `close <asset>` | Close an existing position |
| `add collateral <asset> $<amount>` | Add collateral to reduce liquidation risk |
| `remove collateral <asset> $<amount>` | Withdraw excess collateral |
| `dryrun open 3x long SOL $100` | Preview a trade without executing |

### Earn

| Command | Description |
|:--------|:------------|
| `stake <amount> FLP` | Stake FLP tokens |
| `unstake <amount> FLP` | Unstake FLP tokens |

### FAF Token

| Command | Description |
|:--------|:------------|
| `faf` | FAF staking dashboard |
| `faf stake <amount>` | Stake FAF for revenue sharing + VIP |
| `faf claim` | Claim FAF rewards + USDC revenue |
| `faf tier` | VIP tier levels and benefits |

### TP/SL Automation

| Command | Description |
|:--------|:------------|
| `set tp <asset> <side> $<price>` | Set take-profit trigger |
| `set sl <asset> <side> $<price>` | Set stop-loss trigger |
| `remove tp <asset> <side>` | Remove take-profit |
| `remove sl <asset> <side>` | Remove stop-loss |
| `tp status` | View active targets |

### Market Data

| Command | Description |
|:--------|:------------|
| `price <asset>` | Current oracle price |
| `prices` | All supported asset prices |
| `funding <asset>` | Current funding rate |
| `stats <asset>` | 24h volume, OI, fees |
| `monitor` | Live-updating market table (5s refresh) |
| `markets` | List all supported markets and pools |

### Portfolio

| Command | Description |
|:--------|:------------|
| `positions` | All open positions with mark-to-market PnL |
| `portfolio` | Full portfolio summary with exposure breakdown |
| `dashboard` | Risk metrics, largest position, realized PnL |
| `history` | Recent trade journal |

### Protocol

| Command | Description |
|:--------|:------------|
| `inspect protocol` | Protocol-level stats (TVL, OI, pools) |
| `inspect pool <name>` | Pool composition and utilization |
| `inspect market <asset>` | Per-market OI, long/short ratio, whale activity |

### Wallet

| Command | Description |
|:--------|:------------|
| `wallet` | Connected wallet address and mode |
| `wallet tokens` | Token balances with USD values |
| `wallet import <path>` | Import a keypair file |
| `wallet disconnect` | Disconnect and zero keypair memory |

### System

| Command | Description |
|:--------|:------------|
| `help` | List all commands |
| `help <command>` | Detailed usage for a specific command |
| `doctor` | Run system diagnostics (RPC, wallet, config) |
| `rpc status` | RPC endpoint health and slot lag |
| `risk monitor on` | Enable background position risk monitoring |
| `risk monitor off` | Disable risk monitor |
| `config` | Show active configuration |
| `clear` | Clear terminal output |
| `exit` | Quit |

## Getting Help

`help` prints every registered command with a one-line description. `help <command>` shows full syntax, parameters, and examples:

```
flash [sim] > help open
  open <leverage>x <long|short> <asset> $<collateral>

  Opens a leveraged perpetual position.

  Parameters:
    leverage    Multiplier (1-100x)
    side        long or short
    asset       SOL, ETH, BTC, or any supported market
    collateral  USD amount of USDC collateral

  Examples:
    open 2x long SOL $100
    open 10x short BTC $500
    open 3x long ETH $200 tp $2100 sl $1800
```

## Dry Run

Prefix any trade command with `dryrun` to preview it without execution. The terminal renders the full confirmation panel — market, side, leverage, collateral, estimated entry, estimated liquidation, fees — but never signs or broadcasts.

```
flash [sim] > dryrun open 5x long SOL $500
```

Useful for validating command syntax and checking estimated prices before committing.

## Trade Confirmation

In live mode, every trade that would sign a transaction displays a confirmation panel:

```
CONFIRM TRANSACTION
─────────────────────────────────
  Market:      SOL LONG
  Pool:        Crypto.1
  Leverage:    5x
  Collateral:  $500.00 USDC
  Size:        $2,500.00
  Est. Fee:    $2.00
  Wallet:      ABDR...7x4f

  Risk Preview:
    Est. Entry:   $148.52
    Est. Liq:     $123.77
    Distance:     16.7%

  Proceed? [y/N]
```

There is no flag to skip this. The signing guard enforces configurable limits (`MAX_COLLATERAL_PER_TRADE`, `MAX_POSITION_SIZE`, `MAX_LEVERAGE`) and rate-limits submissions. Every attempt is logged to `~/.flash/signing-audit.log`.

## Shortcuts

| Shortcut | Equivalent |
|:---------|:-----------|
| `pos` | `positions` |
| `dash` | `dashboard` |
| `port` | `portfolio` |
| `mon` | `monitor` |
| `doc` | `doctor` |
| `hist` | `history` |

## Tips

- **Command history** — arrow keys navigate previous commands. History persists across sessions.
- **Asset aliases** — `SOL`, `sol`, `solana` all resolve to the same market. Same for `BTC`/`bitcoin`, `ETH`/`ethereum`.
- **Typo correction** — common misspellings are caught and suggested. The parser normalizes whitespace and casing.
- **Piped input** — the terminal reads from stdin. You can pipe commands for scripting: `echo "prices" | flash`.
- **Environment overrides** — all config values can be set via environment variables. See `config` output for the full list.
