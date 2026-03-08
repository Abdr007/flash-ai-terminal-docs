# Installation

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 8+ |
| Solana RPC | Any mainnet endpoint |

**Optional:**

- [Helius RPC](https://helius.dev/) for improved reliability and failover
- Anthropic API key for LLM-powered natural language parsing

## Install

```bash
git clone https://github.com/Abdr007/flash-ai-terminal.git
cd flash-ai-terminal
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

FAT starts in **simulation mode** by default. No wallet or RPC configuration is required to explore.

## First Session

```bash
flash [sim] > help               # list all commands
flash [sim] > markets            # view 24 supported markets
flash [sim] > monitor            # live market prices
flash [sim] > open 2x long SOL $100
flash [sim] > positions          # view open positions
flash [sim] > close SOL long
flash [sim] > exit
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
| `MAX_LEVERAGE` | Maximum leverage multiplier | Market default |
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

## Enabling Live Trading

1. Set `SIMULATION_MODE=false` in `.env`
2. Configure a reliable RPC endpoint (Helius recommended)
3. Import a wallet:
   ```bash
   wallet import main ~/wallets/my-keypair.json
   ```
4. Start the terminal

::: warning REAL FUNDS AT RISK
Live trading executes real on-chain transactions. Start with small positions and always verify transactions on [Solscan](https://solscan.io).
:::

## Logs

Runtime logs are stored at `~/.flash/logs/`:

| Log File | Contents |
|----------|----------|
| `flash.log` | General runtime log (10MB rotation) |
| `reconcile.log` | State reconciliation events |
| `signing-audit.log` | Every trade attempt with outcome |

Debug information is written to log files only and never displayed in the terminal.
