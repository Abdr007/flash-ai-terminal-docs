# FAF Token Commands

## faf

FAF staking dashboard.

**Syntax:**

```
faf
```

**Example:**

```bash
faf
```

Shows staked FAF balance, VIP tier, pending rewards, revenue share earnings, and unstake requests.

---

## faf stake

Stake FAF tokens for revenue sharing and VIP benefits.

**Syntax:**

```
faf stake <amount>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | number | Number of FAF tokens to stake |

**Example:**

```bash
faf stake 10000
faf stake 50000
```

Staked FAF earns USDC revenue share and unlocks VIP fee discounts.

---

## faf unstake

Request unstake with 90-day linear unlock.

**Syntax:**

```
faf unstake <amount>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | number | Number of FAF tokens to unstake |

**Example:**

```bash
faf unstake 5000
```

Initiates a 90-day linear unlock. Tokens are released proportionally over the unlock period. Use `faf requests` to track progress.

---

## faf claim

Claim pending FAF rewards and USDC revenue.

**Syntax:**

```
faf claim
```

**Example:**

```bash
faf claim
```

Claims both FAF staking rewards and USDC revenue share in a single transaction.

---

## faf tier

View VIP tier levels and benefits.

**Syntax:**

```
faf tier
```

**Example:**

```bash
faf tier
```

Displays all VIP tiers, your current tier, staking requirements, and associated benefits.

---

## faf rewards

View pending FAF rewards and USDC revenue.

**Syntax:**

```
faf rewards
```

**Example:**

```bash
faf rewards
```

Shows claimable FAF token rewards and accumulated USDC revenue share without claiming.

---

## faf referral

Referral status and claimable rebates.

**Syntax:**

```
faf referral
```

**Example:**

```bash
faf referral
```

Shows your referral link, referred users, generated volume, and claimable USDC rebates.

---

## faf points

Voltage points tier and multiplier.

**Syntax:**

```
faf points
```

**Example:**

```bash
faf points
```

Displays your Voltage points balance, current tier, points multiplier, and progress to next tier.

---

## faf requests

View pending unstake requests and progress.

**Syntax:**

```
faf requests
```

**Example:**

```bash
faf requests
```

Lists all active unstake requests with index, amount, start date, unlock progress, and claimable tokens.

---

## faf cancel

Cancel a pending unstake request by index.

**Syntax:**

```
faf cancel <index>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `index` | number | Unstake request index (from `faf requests`) |

**Example:**

```bash
faf cancel 0
faf cancel 2
```

Cancels the unstake request and returns tokens to staked balance. Index is zero-based.

---

## VIP Tiers

| Level | Staked FAF | Fee Discount | Referral Rebate |
|-------|-----------|--------------|-----------------|
| 0 | 0 | 0% | 5% |
| 1 | 1,000 | 5% | 10% |
| 2 | 10,000 | 10% | 12% |
| 3 | 50,000 | 15% | 15% |
| 4 | 200,000 | 20% | 18% |
| 5 | 1,000,000 | 30% | 20% |

Higher tiers unlock progressively better trading fee discounts and referral rebate percentages.

## Revenue Sharing

50% of Flash Trade protocol revenue is distributed to FAF stakers in USDC. Revenue is accumulated continuously and claimable at any time via `faf claim`. Share is proportional to your staked FAF relative to the total staked supply.
