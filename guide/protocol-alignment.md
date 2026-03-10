# Protocol Alignment

Flash Terminal ensures correctness by deriving all protocol parameters from on-chain state and official SDK helpers. This page explains exactly how.

## Fee Rates

Fee rates are read from `CustodyAccount` — a per-asset Solana account that holds all configuration for that market.

```
CustodyAccount.fees.openPosition  → raw integer (e.g., 800,000)
CustodyAccount.fees.closePosition → raw integer (e.g., 800,000)
```

Rates are stored as integers with `RATE_DECIMALS = 9`:

```
feeRate = rawValue / RATE_POWER
        = 800,000 / 1,000,000,000
        = 0.0008
        = 0.08%
```

Fee is always charged on **position size** (leveraged), not collateral:

```
fee = positionSize × feeRate
positionSize = collateral × leverage

Example: $100 collateral at 5x = $500 size
Fee: $500 × 0.0008 = $0.40
```

Each market has its own `CustodyAccount` with potentially different rates. The CLI fetches these on-chain with slot-based cache invalidation (~60 seconds).

## Leverage and Margin

Max leverage comes from `CustodyAccount.pricing.maxLeverage`, stored with `BPS_DECIMALS = 4`:

```
maxLeverage = rawValue / BPS_POWER
            = 1,000,000 / 10,000
            = 100x
```

Maintenance margin is derived from max leverage:

```
maintenanceMarginRate = 1 / maxLeverage
                      = 1 / 100
                      = 0.01 (1%)
```

This matches the Flash Trade protocol definition.

## Liquidation Math

**Live mode** uses the Flash SDK helper directly:

```typescript
perpClient.getLiquidationPriceContractHelper(
  entryOraclePrice, unsettledFees, side, custodyAcct, posAcct
)
```

**Simulation mode** uses the same formula documented in the SDK:

```
maintenanceMargin = size × maintenanceMarginRate
exitFee           = size × closeFeeRate
available         = collateral - maintenanceMargin - exitFee - unsettledFees
priceMove         = (available / size) × entryPrice

liqPrice = entry - priceMove   (long)
liqPrice = entry + priceMove   (short)
```

## Divergence Detection

After computing liquidation prices, the CLI compares its result against the SDK helper:

```
DIVERGENCE_THRESHOLD = 0.5%
```

If the CLI's calculation deviates from the SDK by more than 0.5%, a warning is logged. With `FLASH_STRICT_PROTOCOL=true`, the trade is rejected.

## Fee Model

Flash Trade uses **borrow/lock fees**, not periodic funding rates like centralized exchanges.

| Fee | When | How |
|:----|:-----|:----|
| **Open fee** | Position entry | `size × openFeeRate` — deducted from balance |
| **Close fee** | Position exit | `size × closeFeeRate` — deducted from return |
| **Borrow/lock fee** | While position is open | Accumulates in `unsettledFeesUsd` on-chain |

Borrow fees grow continuously and reduce your effective collateral, moving the liquidation price closer over time.

## On-Chain Integer Math

Solana programs avoid floating point. All values are stored as scaled integers:

| Constant | Value | Decodes |
|:---------|:------|:--------|
| `RATE_POWER` | 1,000,000,000 (1e9) | Fee rates |
| `BPS_POWER` | 10,000 (1e4) | Leverage |
| `USD_DECIMALS` | 6 | All USD amounts (USDC precision) |

The CLI uses these exact constants for decoding.

## Protocol Verification

The `protocol verify` command performs 6 real-time checks:

| Check | What it verifies |
|:------|:-----------------|
| RPC Health | Slot advancement, latency |
| Oracle Freshness | Pyth price age <5 seconds |
| CustodyAccount | Fee rates loaded from on-chain |
| Fee Engine | CLI rates match CustodyAccount |
| Liquidation Engine | Long/short symmetry |
| Protocol Parameters | Leverage, margin, fees within bounds |

```bash
flash > protocol verify
```

All checks use real protocol data. No synthetic validation.

## Validation Guards

Before any trade, protocol parameters are validated:

- Fee rates must be `Number.isFinite()`, non-negative, and below 10%
- Max leverage must be finite and positive
- Maintenance margin must be below 100%
- Invalid `CustodyAccount` data throws `ProtocolParameterError` — never silently falls back

## SDK Integration

The CLI delegates to Flash SDK for all protocol interactions:

| Operation | SDK Method |
|:----------|:-----------|
| Open position | `perpClient.openPosition()` / `perpClient.swapAndOpen()` |
| Close position | `perpClient.closePosition()` / `perpClient.closeAndSwap()` |
| Add collateral | `perpClient.addCollateral()` / `perpClient.swapAndAddCollateral()` |
| Remove collateral | `perpClient.removeCollateral()` / `perpClient.removeCollateralAndSwap()` |
| Liquidation price | `perpClient.getLiquidationPriceContractHelper()` |
| Position size | `perpClient.getSizeAmountFromLeverageAndCollateral()` |
| Pool config | `PoolConfig.fromIdsByName()` |
| Custody data | `perpClient.program.account.custody.fetch()` |

No custom instruction building. The SDK builds all transaction instructions.
