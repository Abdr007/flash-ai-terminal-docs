# Earn & Liquidity Commands

## earn

View all pools with live yield metrics.

**Syntax:**

```
earn
```

**Example:**

```bash
earn
```

Displays a table of all available pools with current APY, TVL, utilization, and fee share.

---

## earn info

Detailed pool information.

**Syntax:**

```
earn info <pool>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pool` | string | Pool name (e.g., crypto, gold, defi, meme) |

**Example:**

```bash
earn info crypto
```

Shows TVL, APY breakdown, fee share percentage, supported assets, utilization rate, and pool composition.

---

## earn deposit

Deposit USDC into a pool and mint FLP tokens.

**Syntax:**

```
earn deposit $<amount> <pool>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | number | USDC amount to deposit |
| `pool` | string | Target pool name |

**Example:**

```bash
earn deposit $1000 crypto
earn deposit $500 gold
```

Mints FLP tokens proportional to your share of the pool. FLP auto-compounds trading fees.

---

## earn withdraw

Burn FLP tokens and receive USDC back.

**Syntax:**

```
earn withdraw <percent>% <pool>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `percent` | number | Percentage of your FLP position to withdraw (1-100) |
| `pool` | string | Pool to withdraw from |

**Example:**

```bash
earn withdraw 50% crypto
earn withdraw 100% gold
```

---

## earn stake

Stake FLP tokens for USDC rewards (converts FLP to sFLP).

**Syntax:**

```
earn stake $<amount> <pool>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | number | USD value of FLP to stake |
| `pool` | string | Pool whose FLP tokens to stake |

**Example:**

```bash
earn stake $500 crypto
```

Staked FLP (sFLP) earns USDC rewards paid hourly instead of auto-compounding.

---

## earn unstake

Unstake sFLP tokens back to FLP.

**Syntax:**

```
earn unstake <percent>% <pool>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `percent` | number | Percentage of sFLP to unstake (1-100) |
| `pool` | string | Pool whose sFLP tokens to unstake |

**Example:**

```bash
earn unstake 100% crypto
```

---

## earn claim

Claim pending LP and staking USDC rewards.

**Syntax:**

```
earn claim
```

**Example:**

```bash
earn claim
```

Claims all accumulated USDC rewards from sFLP staking across all pools.

---

## earn positions

View active LP positions across all pools.

**Syntax:**

```
earn positions
```

**Example:**

```bash
earn positions
```

Shows FLP and sFLP balances, USD value, pool share percentage, and accumulated rewards per pool.

---

## earn best

Rank pools by yield and risk.

**Syntax:**

```
earn best
```

**Example:**

```bash
earn best
```

Displays pools sorted by risk-adjusted yield, factoring in APY, utilization, TVL depth, and historical volatility.

---

## earn simulate

Project yield returns for a deposit amount and pool.

**Syntax:**

```
earn simulate $<amount> <pool>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | number | Hypothetical USDC deposit amount |
| `pool` | string | Target pool |

**Example:**

```bash
earn simulate $5000 crypto
earn simulate $1000 defi
```

Projects estimated returns at 7d, 30d, 90d, and 1y horizons based on current APY.

---

## earn dashboard

Liquidity portfolio overview.

**Syntax:**

```
earn dashboard
```

**Example:**

```bash
earn dashboard
```

Consolidated view of all LP positions, total value, aggregate yield, reward claims, and pool allocation breakdown.

---

## earn pnl

Earn profit and loss tracking.

**Syntax:**

```
earn pnl
```

**Example:**

```bash
earn pnl
```

Shows realized and unrealized PnL from liquidity provision, including fees earned, impermanent loss, and net returns.

---

## earn demand

Liquidity demand analysis.

**Syntax:**

```
earn demand
```

**Example:**

```bash
earn demand
```

Analyzes current trading volume, open interest, and utilization to identify pools with highest liquidity demand.

---

## earn history

Historical APY data for a pool.

**Syntax:**

```
earn history <pool>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pool` | string | Pool name |

**Example:**

```bash
earn history crypto
earn history meme
```

Shows historical APY over 7d, 30d, and 90d periods.

---

## earn rotate

Suggest liquidity rotation between pools.

**Syntax:**

```
earn rotate
```

**Example:**

```bash
earn rotate
```

Analyzes yield trends and suggests rebalancing LP across pools for optimal risk-adjusted returns.

---

## Available Pools

| Pool | Pool ID | Assets |
|------|---------|--------|
| crypto | Crypto.1 | SOL, BTC, ETH |
| gold | Gold.1 | XAU (tokenized gold) |
| defi | DeFi.1 | JUP, RNDR, PYTH, HNT, JTO, BONK |
| meme | Meme.1 | WIF, BONK, POPCAT, TRUMP |
| wif | WIF.1 | WIF single-asset |
| ore | ORE.1 | ORE single-asset |
| fart | FART.1 | FART single-asset |

## FLP vs sFLP

| Token | Behavior | Rewards |
|-------|----------|---------|
| **FLP** | Liquidity provider token | Auto-compounds — trading fees are reinvested into the pool, increasing FLP value over time |
| **sFLP** | Staked FLP | Pays USDC rewards hourly — claim manually with `earn claim` |

Deposit USDC to receive FLP. Stake FLP to convert to sFLP. Unstake sFLP to get FLP back. Withdraw FLP to receive USDC.
