# Protocol Inspector Commands

## inspect protocol

Protocol-wide overview.

**Description:** Displays top-level protocol information including the program ID, total pools and markets, aggregate open interest (long and short), 30-day volume and trade count, protocol fees, and the overall long/short ratio.

**Syntax:**

```bash
inspect protocol
```

**Aliases:** `inspect`

---

## inspect pool

Deep-dive into a specific pool.

**Description:** Shows detailed information for a single pool including its on-chain address, supported markets, open interest per market, whale positions, and pool utilization.

**Syntax:**

```bash
inspect pool <name>
```

**Available pools:**

| Pool | Markets |
|------|---------|
| Crypto.1 | SOL, BTC, ETH, ZEC, BNB |
| Virtual.1 | XAG, XAU, CRUDEOIL, EUR, GBP, USDJPY, USDCNH |
| Governance.1 | JTO, JUP, PYTH, RAY, HYPE, MET, KMNO |
| Community.1 | PUMP, BONK, PENGU |
| Community.2 | WIF |
| Trump.1 | FARTCOIN |
| Ore.1 | ORE |

**Example:**

```bash
inspect pool Crypto.1
```

---

## inspect market

Deep-dive into a specific market.

**Description:** Provides a detailed view of a single market including trading hours and status, open interest breakdown (long and short), position counts, largest open positions, and risk metrics.

**Syntax:**

```bash
inspect market <market>
```

**Examples:**

```bash
inspect market SOL
inspect market BTC
inspect market ETH
```
