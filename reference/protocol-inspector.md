# Protocol Commands

## inspect protocol

Protocol-wide overview: TVL, total OI, active pools, and health status.

**Aliases:** `inspect`

## inspect pool

Pool composition, utilization, and liquidity metrics.

```bash
inspect pool <name>
```

```bash
inspect pool Crypto.1
inspect pool Virtual.1
```

## inspect market

Per-market deep dive: OI, long/short ratio, whale positions, risk metrics.

```bash
inspect market <asset>
```

```bash
inspect market SOL
```

## protocol fees

Fee breakdown for a specific market.

```bash
protocol fees <market>
```

## protocol verify

Full protocol alignment audit. Compares local calculations against on-chain state.

## protocol status

Protocol connection overview.

**Aliases:** `protocol`

## source verify

Verify price source integrity for an asset.

```bash
source verify <asset>
```

**Aliases:** `verify source`

---

**See also:** [Architecture](/guide/architecture) | [Market Data](/reference/market-data) | [System](/reference/system)
