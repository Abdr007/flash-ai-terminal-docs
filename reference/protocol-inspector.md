# Protocol Commands

## inspect protocol

Protocol-wide overview.

**Description:** Displays program ID, total pools and markets, aggregate open interest (long and short), 30-day volume and trade count, protocol fees, and long/short ratio.

**Syntax:**

```bash
inspect protocol
```

**Aliases:** `inspect`

---

## inspect pool

Inspect a specific pool.

**Description:** Shows pool address, supported markets, open interest per market, whale positions, and pool utilization.

**Syntax:**

```bash
inspect pool <name>
```

**Available pools:**

| Pool | Markets |
|:-----|:--------|
| Crypto.1 | SOL, BTC, ETH, and others |
| Virtual.1 | XAG, XAU, CRUDEOIL, EUR, GBP, and others |
| Governance.1 | JTO, JUP, PYTH, RAY, HYPE, MET, KMNO |
| Community.1 | Various community tokens |
| Community.2 | Various community tokens |
| Trump.1 | TRUMP, MELANIA |
| Ore.1 | ORE |

::: tip Pool Discovery
Markets are discovered dynamically from Flash SDK `PoolConfig`. Run `markets` to see the current list.
:::

**Example:**

```bash
inspect pool Crypto.1
```

---

## inspect market

Inspect a specific market.

**Description:** Shows trading hours, open interest breakdown (long/short), position counts, largest positions, and risk metrics.

**Syntax:**

```bash
inspect market <market>
```

**Example:**

```bash
inspect market SOL
```

---

## protocol fees

View on-chain fee rates for a specific market.

**Description:** Fetches fee rates directly from `CustodyAccount` on-chain. Shows open/close fee rates, max leverage, and maintenance margin rate with their raw on-chain values and decoded rates.

**Syntax:**

```bash
protocol fees <market>
```

**Example:**

```bash
protocol fees SOL
```

**Output includes:**
- Open fee rate (raw value / `RATE_POWER`)
- Close fee rate (raw value / `RATE_POWER`)
- Max leverage (raw value / `BPS_POWER`)
- Maintenance margin rate (1 / maxLeverage)
- Source: `on-chain` or `sdk-default`

---

## protocol verify

Run a full protocol alignment audit.

**Description:** Performs 6 real-time checks against the Flash Trade protocol to verify that the CLI is correctly reading and calculating protocol parameters.

**Syntax:**

```bash
protocol verify
```

**Aliases:** `verify protocol`, `verify`

**Checks performed:**

| Check | What it verifies |
|:------|:-----------------|
| RPC Health | Slot advancement, latency |
| Oracle Freshness | Pyth price age (<5 seconds) |
| CustodyAccount | Fee rates loaded from on-chain |
| Fee Engine | CLI rates match CustodyAccount within tolerance |
| Liquidation Engine | Long/short position symmetry |
| Protocol Parameters | Leverage, margin, fees within valid bounds |

**Example output:**

```
PROTOCOL VERIFICATION
─────────────────────────────
  ✓ RPC Health         Slot 312847291 · 142ms
  ✓ Oracle Freshness   SOL $148.52 · 2s age
  ✓ CustodyAccount     SOL/BTC/ETH fees loaded (on-chain)
  ✓ Fee Engine         Rates match CustodyAccount
  ✓ Liquidation Engine Symmetry verified
  ✓ Protocol Params    All within bounds

  Status: HEALTHY
```

All checks use real protocol data. No synthetic validation.

---

## protocol status

Protocol connection overview.

**Description:** Shows current connection status to Flash Trade protocol, SDK version, RPC endpoint, and operating mode.

**Syntax:**

```bash
protocol status
```

**Aliases:** `protocol`
