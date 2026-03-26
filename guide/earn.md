# Earn & Liquidity

Provide liquidity to Flash Trade pools, stake tokens, and earn yield — all from the terminal.

## Overview

Flash Trade has multiple liquidity pools. When you add liquidity, you receive FLP (Flash Liquidity Provider) tokens representing your share. You earn from trading fees and can stake FLP for additional rewards.

## View Earn Pools

```bash
earn                     # All pools with live APY
earn best                # Rank pools by yield + risk score
earn info crypto         # Detailed info on a specific pool
```

## Add Liquidity

```bash
earn add $100 crypto     # Add $100 to the Crypto pool
earn deposit $500 gov    # Same — deposit to Governance pool
```

## Remove Liquidity

```bash
earn remove 50% crypto      # Remove 50% of your liquidity
earn withdraw 100% crypto   # Full withdrawal
```

## Stake FLP

Stake your FLP tokens for additional protocol rewards:

```bash
earn stake $200 governance     # Stake FLP in governance pool
earn unstake 25% governance    # Unstake 25%
```

## Claim Rewards

```bash
earn claim               # Claim all LP and staking rewards
```

## Portfolio & Analytics

```bash
earn positions           # Your LP positions across all pools
earn dashboard           # Full liquidity portfolio overview
earn pnl                 # Earn P&L tracking over time
earn demand              # Liquidity utilization analysis
earn simulate $1000 crypto  # Project yield for a deposit
earn history crypto      # Historical pool performance
earn rotate              # Suggest optimal liquidity rotation
```

## FAF Token

FAF is Flash Trade's governance/utility token with a separate staking system:

```bash
faf                      # Staking dashboard
faf stake 1000           # Stake FAF tokens
faf unstake 500          # Unstake FAF
faf claim                # Claim FAF rewards + USDC revenue share
faf tier                 # VIP tier levels & fee discounts
faf rewards              # Pending rewards breakdown
faf points               # Voltage points & tier multiplier
faf referral             # Referral program status
faf requests             # Pending unstake requests
faf cancel <index>       # Cancel a pending unstake
```

## Next Steps

- [Commands](/guide/commands) — Full command reference
- [Configuration](/guide/configuration) — Environment variables
- [FAQ](/guide/faq) — Common questions
