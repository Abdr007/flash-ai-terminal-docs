# Simulation Mode

Simulation mode allows traders to test strategies and explore the terminal without executing real transactions.

## How It Works

When `SIMULATION_MODE=true` (the default), the terminal uses a paper trading engine instead of the Flash SDK:

- Positions are tracked in memory with a virtual USDC balance
- Prices come from real oracle data (Pyth / CoinGecko)
- PnL is computed using mark-to-market pricing
- Fees are simulated at 0.08% (matching Flash Trade's fee structure)
- No transactions are signed or broadcast

## Starting in Simulation Mode

Simulation is the default. Simply start the terminal:

```bash
flash
```

The prompt indicates simulation mode:

```
flash [sim] > _
```

## Dry Run

The `dryrun` command compiles and simulates a transaction on-chain without signing or broadcasting.

```bash
dryrun open 5x long SOL $100
```

Output includes:

```
DRY-RUN RESULTS
─────────────────────
  Status:            Success
  Estimated Fee:     $0.08
  Compute Units:     142,350
  Entry Price:       $148.52
  Liquidation Price: $121.79

  Program Logs:
    Program Flash...invoke [1]
    Program log: Instruction: OpenPosition
    ...
```

### What Dry Run Provides

| Field | Description |
|-------|-------------|
| Status | Whether the transaction would succeed |
| Estimated Fee | Trading fee (0.08% of position size) |
| Compute Units | CU consumption for priority fee estimation |
| Entry Price | Expected entry from oracle |
| Liquidation Price | Estimated liquidation level |
| Program Logs | Full Solana runtime simulation output |

### When to Use Dry Run

- Before your first live trade on a new market
- When testing unusual leverage levels
- When verifying compute unit requirements
- When debugging transaction failures

## Simulation vs Live

| Feature | Simulation | Live |
|---------|-----------|------|
| Wallet required | No | Yes |
| Transactions signed | No | Yes |
| Funds at risk | No | Yes |
| Oracle prices | Real | Real |
| Fee simulation | 0.08% | Actual protocol fee |
| Position tracking | In-memory | On-chain |
| Confirmation required | Yes | Yes (strict) |

## Safety Guarantee

Simulation mode is locked at startup. It cannot be changed to live mode mid-session. This prevents accidental transitions from paper trading to real execution.

::: tip
Start every new strategy in simulation mode. Once you understand the execution flow, transition to live mode with small positions.
:::
