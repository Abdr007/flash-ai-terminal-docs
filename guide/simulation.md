# Simulation Mode

Flash Terminal prompts users to select Simulation or Live mode when starting the CLI. Simulation mode enables paper trading with real oracle prices, allowing traders to test strategies without risking funds.

## How It Works

When Simulation mode is selected at startup, the terminal uses a paper trading engine instead of the Flash SDK:

- **Virtual USDC balance** -- Positions are tracked in memory with a virtual balance
- **Real-time oracle prices** -- Prices come from live Pyth oracle data
- **Mark-to-market PnL** -- Positions are valued against current oracle prices
- **0.08% fee model** -- Fees are simulated to match Flash Trade's fee structure
- **No transaction signing** -- No transactions are signed or broadcast to the blockchain

## Starting the Terminal

When you start the CLI, you are prompted to select a mode:

```bash
flash
```

The prompt indicates which mode is active:

```
flash [sim] > _
```

## Dry Run

The `dryrun` command compiles and simulates a transaction on-chain without signing or broadcasting. This is available regardless of mode selection.

```bash
dryrun open 5x long SOL $100
```

Example output:

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

### Dry Run Use Cases

- **Before your first live trade** -- Verify the transaction compiles and the program accepts it
- **Unusual leverage levels** -- Confirm the protocol allows the leverage on the target market
- **Compute unit requirements** -- Check CU consumption for priority fee estimation
- **Debugging** -- Inspect full Solana runtime simulation output for failed transactions

## Simulation vs Live

| Feature | Simulation | Live |
|---------|-----------|------|
| Wallet required | No | Yes |
| Transactions signed | No | Yes |
| Funds at risk | No | Yes |
| Oracle prices | Real (Pyth) | Real (Pyth) |
| Fee model | 0.08% simulated | Actual protocol fee |
| Position tracking | In-memory | On-chain |
| Risk preview | Yes | Yes |

## Safety

The mode is selected at startup and locked for the entire session. There is no command or API to switch between Simulation and Live mode mid-session. This prevents accidental transitions from paper trading to real execution.
