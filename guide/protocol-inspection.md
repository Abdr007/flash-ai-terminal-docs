# Protocol Inspection

The terminal provides direct access to Flash protocol state through a set of inspection commands.

## Inspect Protocol

View protocol-wide statistics.

```bash
inspect protocol
```

Shows:

- Program ID
- Total pools and markets
- Aggregate open interest (long / short)
- 30-day volume and trade count
- Protocol fees collected
- Long/short ratio

## Inspect Pool

Deep-dive into a specific pool.

```bash
inspect pool Crypto.1
```

Shows:

- Pool address
- Supported markets
- Open interest per market
- Largest positions
- Pool utilization

Available pools:

| Pool | Assets |
|------|--------|
| Crypto.1 | SOL, BTC, ETH, ZEC, BNB |
| Virtual.1 | XAG, XAU, CRUDEOIL, EUR, GBP, USDJPY, USDCNH |
| Governance.1 | JTO, JUP, PYTH, RAY, HYPE, MET, KMNO |
| Community.1 | PUMP, BONK, PENGU |
| Community.2 | WIF |
| Trump.1 | FARTCOIN |
| Ore.1 | ORE |

## Inspect Market

Deep-dive into a specific market.

```bash
inspect market SOL
```

Shows:

- Trading hours and current status
- Open interest breakdown (long / short)
- Number of open positions per side
- Largest open positions
- Risk metrics

## Data Sources

Protocol inspection data comes from:

| Data | Source |
|------|--------|
| Pool configuration | Flash SDK (on-chain) |
| Open interest | fstats API |
| Protocol statistics | fstats API |
| Whale positions | fstats API |

Data is cached for 15 seconds. If the API is unavailable, stale cached data is returned as a fallback.

## Use Cases

- **Before trading:** Check OI skew to understand market positioning
- **Risk assessment:** Identify crowded trades via long/short ratio
- **Market research:** Find markets with high activity or unusual whale positioning
- **Protocol monitoring:** Track protocol-wide volume and fee generation
