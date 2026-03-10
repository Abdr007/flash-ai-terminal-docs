# Installation

## Requirements

| Requirement | Version |
|:------------|:--------|
| Node.js | 20+ |
| npm | 8+ |
| Solana RPC | Any mainnet endpoint |

**Optional:**

- [Helius RPC](https://helius.dev/) for improved reliability and multi-endpoint failover
- Anthropic API key for LLM-powered natural language parsing (read-only queries only)
- Groq API key as an alternative LLM provider

## Install

```bash
git clone https://github.com/Abdr007/flash-terminal.git
cd flash-terminal
npm install
npm run build
```

## Run

```bash
npm start
```

Or link globally for the `flash` command:

```bash
npm link
flash
```

::: tip MODE SELECTION
Flash Terminal prompts you to select Simulation or Live mode on startup. Simulation mode is recommended for first-time users — it uses real Pyth oracle prices but never signs transactions.
:::

## First Session

```bash
flash                           # start the terminal (select mode)
flash > help                    # list all commands
flash > markets                 # view supported markets and pools
flash > monitor                 # live market prices (full-screen)
flash > analyze SOL             # deep market analysis
flash > open 2x long SOL $100  # open a position (confirmation required)
flash > positions               # view open positions with mark-to-market
flash > risk report             # liquidation distance per position
flash > portfolio               # balance, exposure, PnL summary
flash > close SOL long          # close the position
flash > trade history           # view trade journal
flash > protocol verify         # verify protocol alignment
flash > exit                    # clean shutdown
```

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### Core Settings

| Variable | Purpose | Default |
|:---------|:--------|:--------|
| `RPC_URL` | Primary Solana RPC endpoint | Public RPC |
| `BACKUP_RPC_1` | First failover endpoint | None |
| `BACKUP_RPC_2` | Second failover endpoint | None |
| `SIMULATION_MODE` | Paper trading mode | `true` |

### Trading Limits

These are enforced by the [signing guard](/guide/security) before any transaction is signed:

| Variable | Purpose | Default |
|:---------|:--------|:--------|
| `MAX_COLLATERAL_PER_TRADE` | Per-trade collateral cap (USD) | Unlimited |
| `MAX_POSITION_SIZE` | Max position size (USD) | Unlimited |
| `MAX_LEVERAGE` | Maximum leverage multiplier | 100 |
| `MAX_TRADES_PER_MINUTE` | Rate limit | 10 |
| `MIN_DELAY_BETWEEN_TRADES_MS` | Min delay between trades | 3000 |

### Performance

| Variable | Purpose | Default |
|:---------|:--------|:--------|
| `COMPUTE_UNIT_PRICE` | Priority fee in microLamports | `500000` |
| `DEFAULT_SLIPPAGE_BPS` | Slippage tolerance in basis points | `50` |

### Protocol

| Variable | Purpose | Default |
|:---------|:--------|:--------|
| `FLASH_STRICT_PROTOCOL` | Reject trades when CLI/SDK diverge >0.5% | `false` |

### Optional

| Variable | Purpose |
|:---------|:--------|
| `ANTHROPIC_API_KEY` | LLM-powered natural language command parsing |
| `GROQ_API_KEY` | Alternative LLM provider |

::: warning LLM Usage
LLM keys are only used for **read-only** natural language queries (e.g., "how is SOL doing?"). Trade commands always use deterministic regex parsing regardless of whether an LLM key is configured.
:::

See `.env.example` for all available options.

## Log Files

Runtime logs are stored at `~/.flash/logs/`:

| Log File | Contents | Rotation |
|:---------|:---------|:---------|
| `flash.log` | General runtime log | 10MB (keeps `.old` and `.old.2`) |
| `reconcile.log` | State reconciliation events | 10MB |
| `signing-audit.log` | Every trade attempt with outcome | Append-only |

All log output is scrubbed — API keys are masked (`sk-ant-***`, `gsk_***`) and private keys are never written.
