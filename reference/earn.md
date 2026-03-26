# Earn & Liquidity Commands

## earn

View all pools with live yield metrics.

**Aliases:** `earn status`, `earn pools`

## earn add

Add liquidity to a pool.

```bash
earn add $<amount> <pool>
```

**Aliases:** `earn add-liquidity`

## earn remove

Remove liquidity from a pool.

```bash
earn remove <percent>% <pool>
```

**Aliases:** `earn remove-liquidity`

## earn deposit

Deposit into a pool (same as `earn add`).

```bash
earn deposit $<amount> <pool>
```

## earn withdraw

Withdraw from a pool (same as `earn remove`).

```bash
earn withdraw <percent>% <pool>
```

## earn stake

Stake FLP tokens for additional rewards.

```bash
earn stake $<amount> <pool>
```

**Aliases:** `earn stake-flp`

## earn unstake

Unstake FLP tokens.

```bash
earn unstake <percent>% <pool>
```

**Aliases:** `earn unstake-flp`

## earn claim

Claim all LP and staking rewards.

**Aliases:** `earn claim-rewards`, `earn claim rewards`

## earn info

Detailed information on a specific pool.

```bash
earn info <pool>
```

## earn positions

View your LP positions across all pools.

**Aliases:** `earn pos`

## earn best

Rank pools by yield and risk score.

## earn dashboard

Full liquidity portfolio overview.

**Aliases:** `earn dash`

## earn pnl

Earn P&L tracking over time.

**Aliases:** `earn profit`, `earn performance`

## earn simulate

Project yield for a hypothetical deposit.

```bash
earn simulate $<amount> <pool>
```

## earn demand

Liquidity demand and utilization analysis.

**Aliases:** `earn utilization`

## earn history

Historical performance for a pool.

```bash
earn history <pool>
```

## earn rotate

Suggest optimal liquidity rotation between pools.

**Aliases:** `earn optimize`, `earn rebalance`

## earn integrations

FLP integration partners.

**Aliases:** `earn partners`
