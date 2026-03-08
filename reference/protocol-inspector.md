# Protocol Inspector Commands

## inspect protocol

Protocol-wide overview.

```bash
inspect protocol
```

Shows:
- Program ID
- Total pools and markets
- Aggregate open interest (long / short)
- 30-day volume and trade count
- Protocol fees
- Long/short ratio

---

## inspect pool

Deep-dive into a specific pool.

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

Shows:
- Pool address and supported markets
- Open interest per market
- Whale positions
- Pool utilization

---

## inspect market

Deep-dive into a specific market.

```bash
inspect market <asset>
```

**Examples:**

```bash
inspect market SOL
inspect market BTC
inspect market ETH
```

Shows:
- Trading hours and status
- Open interest breakdown (long / short)
- Position counts
- Largest open positions
- Risk metrics
