# Architecture

Flash Terminal is built as isolated layers with strict downward communication. The risk layer sits between every command and every transaction — no bypass path exists.

## System Overview

```
CLI REPL
  └─ Command Registry (100+ commands, O(1) dispatch)
      └─ Parser (regex primary, fuzzy correction, NL fallback)
          └─ Tool Engine (unified dispatch to all tool categories)
              ├─ Signing Guard → Rate Limiter → Circuit Breaker → Kill Switch → Exposure
              │   └─ TX Builder (MessageV0, dynamic CU, cached blockhash)
              │       └─ Pre-flight Simulation
              │           └─ Broadcast (maxRetries:3, HTTP confirm, rebroadcast)
              │               └─ Flash Trade Program (Solana)
              ├─ Portfolio Tools (positions, PnL, risk, exposure)
              ├─ Analytics Tools (volume, OI, leaderboard, whales)
              ├─ Earn Tools (liquidity, staking, FLP, FAF)
              ├─ Protocol Tools (inspect, health, audit)
              └─ Wallet Tools (connect, import, switch, balances)
```

## Command Flow

When you type `open 5x long SOL $500`:

1. **Registry lookup.** Command matched via `COMMAND_REGISTRY` — O(1) for single-token commands, pattern matching for parameterized commands.

2. **Parse.** `flexParseOpen()` extracts: market=SOL, side=long, leverage=5, collateral=$500. Fuzzy correction handles typos (Levenshtein distance). Market aliases resolved (`solana` → `SOL`).

3. **Pool resolution.** `getPoolForMarket("SOL")` maps to `Crypto.1` from Flash SDK's PoolConfig.

4. **Price fetch.** Pyth Hermes oracle returns current price with staleness (<30s), confidence, and deviation checks.

5. **Risk gates.** Five gates in series — signing guard (limits), rate limiter, circuit breaker, kill switch, exposure control. Any gate can reject.

6. **Confirmation.** Full trade summary displayed. User types `yes`.

7. **TX build.** `MessageV0.compile()` with dynamic compute units (simulate first, add buffer) and cached blockhash.

8. **Pre-flight simulation.** Transaction simulated on-chain. Program errors abort here.

9. **Instruction freeze.** `Object.freeze()` locks instruction array. Program whitelist enforced.

10. **Broadcast.** `sendRawTransaction` with maxRetries:3. HTTP polling confirms. Rebroadcast every 800ms until confirmed.

11. **Verification.** State reconciler confirms position exists on-chain.

## Data Layer

**Upward flow (market data):**
- Pyth oracle prices → 5s cache
- Protocol snapshots → 15s cache
- Wallet balances → 30s cache
- Post-trade: balance cache invalidated immediately

**Downward flow (execution):**
- Commands → risk gates → TX build → simulate → broadcast → confirm
- Each gate can reject. Rejection is final.

## RPC Management

- Multi-endpoint failover with health monitoring every 30s
- Slot lag detection (>50 slots triggers failover)
- Leader routing for faster transaction landing
- Automatic recovery when primary endpoint returns

## Tool Categories

| Category | Count | Examples |
|:---------|:------|:--------|
| Trading | 7 | open, close, add/remove collateral, positions, portfolio |
| Orders | 7 | limit, cancel, edit, TP/SL, order list |
| Analytics | 5 | volume, OI, leaderboard, fees, profiles |
| Earn | 19+ | add/remove liquidity, stake, claim, simulate, rotate |
| FAF | 10+ | stake, unstake, claim, tier, points, referral |
| Protocol | 25+ | inspect, health, audit, funding, depth, liquidations |
| Wallet | 10 | connect, import, list, use, disconnect, balances |
| System | 10+ | doctor, RPC management, TX debug, metrics |

Total: **100+ registered tools** covering trading, portfolio, analytics, earn, FAF, wallet, protocol inspection, RPC management, transaction debugging, and system diagnostics.

## Key Design Decisions

- **No AI in execution path.** The parser is deterministic (regex + fuzzy correction). AI is only used for optional natural language queries and never executes trades.
- **Risk gates are in series.** All five must pass. No shortcut path exists.
- **Simulation uses the same code path.** Only the client implementation differs (SimulatedFlashClient vs FlashClient).
- **All state from chain is authoritative.** Local caches are convenience — the reconciler syncs every 60s in live mode.

## Next Steps

- [Risk & Safety](/guide/risk-safety) — All 10 safety layers explained
- [Configuration](/guide/configuration) — Tune compute units and limits
- [Commands](/guide/commands) — Full command reference
