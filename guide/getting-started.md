# Installation

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 20+ |
| npm | 8+ |
| Solana RPC | Any mainnet endpoint |

**Optional:**

- [Helius RPC](https://helius.dev/) for improved reliability and failover
- Anthropic API key for LLM-powered natural language parsing
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
Flash Terminal prompts users to select Simulation or Live mode on startup. Simulation mode is recommended for first-time users — it uses real oracle prices but never signs transactions.
:::

## First Session

```bash
flash                           # start the terminal (select mode)
flash > help                    # list all commands
flash > markets                 # view supported markets
flash > monitor                 # live market prices
flash > open 2x long SOL $100  # open a position
flash > positions               # view open positions
flash > close SOL long          # close the position
flash > exit                    # clean shutdown
```

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### Core Settings

| Variable | Purpose | Default |
|----------|---------|---------|
| `RPC_URL` | Primary Solana RPC endpoint | Public RPC |
| `BACKUP_RPC_1` | First failover endpoint | None |
| `BACKUP_RPC_2` | Second failover endpoint | None |
| `SIMULATION_MODE` | Paper trading mode | `true` |

### Trading Limits

| Variable | Purpose | Default |
|----------|---------|---------|
| `MAX_COLLATERAL_PER_TRADE` | Per-trade collateral cap (USD) | Unlimited |
| `MAX_POSITION_SIZE` | Max position size (USD) | Unlimited |
| `MAX_LEVERAGE` | Maximum leverage multiplier | 100 |
| `MAX_TRADES_PER_MINUTE` | Rate limit | 10 |
| `MIN_DELAY_BETWEEN_TRADES_MS` | Min delay between trades | 3000 |

### Performance

| Variable | Purpose | Default |
|----------|---------|---------|
| `COMPUTE_UNIT_PRICE` | Priority fee in microLamports | `500000` |
| `DEFAULT_SLIPPAGE_BPS` | Slippage tolerance | `50` |

### Optional

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | LLM-powered natural language command parsing |
| `GROQ_API_KEY` | Alternative LLM provider |

See `.env.example` for all available options.

## Log Files

Runtime logs are stored at `~/.flash/logs/`:

| Log File | Contents |
|----------|----------|
| `flash.log` | General runtime log (10MB rotation) |
| `reconcile.log` | State reconciliation events |
| `signing-audit.log` | Every trade attempt with outcome |

Debug information is written to log files only and never displayed in the terminal.
