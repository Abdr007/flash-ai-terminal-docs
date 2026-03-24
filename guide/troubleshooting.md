# Troubleshooting

## Transaction Not Landing

The transaction was broadcast but never confirmed on-chain.

1. Check RPC health: `rpc status`. Look for latency spikes or slot lag >50.
2. Run `rpc test` to verify connectivity to all configured endpoints.
3. Ensure the wallet has sufficient SOL for transaction fees (typically 0.000005-0.01 SOL depending on compute units).
4. Check compute unit settings. If `COMPUTE_UNIT_PRICE` is too low during congestion, validators may deprioritize your transaction. Increase it or enable `FLASH_DYNAMIC_CU=true`.
5. The terminal automatically retries with `maxRetries:3` and rebroadcasts every 800ms. If confirmation still fails after ~45s, the attempt times out. Retry the trade.

## "All RPC endpoints unavailable"

Every configured RPC endpoint has failed health checks.

- The terminal enters read-only mode. You can query positions and prices but cannot submit transactions.
- Check your network connection.
- Verify `RPC_URL`, `BACKUP_RPC_1`, and `BACKUP_RPC_2` in your `.env` file are correct and reachable.
- Solana mainnet may be experiencing degraded performance. Check [status.solana.com](https://status.solana.com).
- The RPC manager retries on a 30s health check cycle. It will auto-recover when an endpoint responds.

## Position Not Showing

You opened a position but `positions` returns empty.

- Run `positions` again. The state cache has a 30s TTL — the position may not have synced yet.
- Run `doctor` to verify RPC connectivity and Flash Trade program reachability.
- The state reconciler syncs every 60 seconds in live mode. Wait for the next cycle or restart the terminal to force an immediate sync.
- In simulation mode, positions are in-memory only. If the terminal crashed, simulation state is lost.

## Circuit Breaker Tripped

Trading operations return "circuit breaker active" errors.

The circuit breaker halts all trading when cumulative session loss exceeds `MAX_SESSION_LOSS_USD` or daily loss exceeds `MAX_DAILY_LOSS_USD`. This is by design.

- Monitoring, position queries, and price feeds remain functional.
- The circuit breaker does not auto-reset. Restart the terminal session to reset session loss counters.
- Review your loss thresholds in `.env` if they are too tight for your trading size.

## High Memory Usage

The `system health` command reports elevated RSS.

- Flash Terminal uses bounded data structures. Price caches cap at 50 entries, trade journals at 2,000, performance metrics use pre-allocated circular buffers.
- If RSS exceeds ~1.5GB, restart the terminal. Long-running sessions with high-frequency agent ticks can accumulate GC pressure.
- The Pyth oracle circuit breaker automatically backs off (30s to 120s cooldown) when feeds are unreachable, reducing memory churn from failed requests.

## Pyth Price Errors

Oracle price fetches are failing or returning stale data.

- The Pyth circuit breaker opens after 3 consecutive failures. Cooldown starts at 30s and doubles up to 120s on repeated failures.
- During cooldown, the system falls back to the last known cached price. Prices are marked stale but still usable for monitoring.
- When the circuit breaker recovers, normal 5s refresh resumes automatically.
- Check if Pyth Hermes is experiencing an outage. The terminal logs Pyth errors to the app log file.

## Agent Not Trading

The autonomous agent is running (`agent status` shows active) but not executing trades.

Possible causes, in order of likelihood:

1. **Cooldown.** The agent respects a minimum interval between trades. Check if a trade just executed.
2. **Low confidence.** No market currently passes the confidence gate (EV >= 20 bps after costs, 2-tick confirmation).
3. **EV below threshold.** All scanned opportunities have negative or insufficient expected value.
4. **Circuit breaker.** Session loss threshold was hit. Check with `doctor`.
5. **Kill switch.** `TRADING_ENABLED=false` in environment. The agent scans but cannot execute.
6. **Regime mismatch.** All markets are classified in a regime where the agent's strategies have low historical edge.

This is normal behavior. The agent is designed to do nothing when conditions are unfavorable.

## Simulation vs Live Confusion

Check the terminal prompt. Simulation mode shows `[sim]`, live mode shows `[live]`.

- Mode is determined at startup by the `SIMULATION_MODE` environment variable (defaults to `true`).
- Mode cannot be changed during a session. Restart the terminal with the correct `.env` to switch.
- In simulation mode, no transactions are signed or broadcast. All trades execute in-memory with real oracle prices.
- If you see `[sim]` but expected live mode, verify `SIMULATION_MODE=false` in your `.env` file. The parser uses `.toLowerCase()` — values like `TRUE`, `True`, and `true` all resolve to simulation mode.

## Log Locations

| Log | Path | Contents |
|:----|:-----|:---------|
| Signing audit | `~/.flash/signing-audit.log` | Every trade attempt: timestamp, type, market, side, result. Never contains private keys. |
| Application | Set via `LOG_FILE` env var | General application logs. API keys are scrubbed (`sk-ant-***`, `gsk_***`). |
| Reconciliation | `~/.flash/logs/reconcile.log` | State sync events, discrepancies between local and on-chain state. |

Log files rotate at 10MB (`.old`, `.old.2`).

## Diagnostics Commands

**`doctor`** — Runs a full system diagnostic. Checks RPC connectivity, wallet state, Flash Trade program reachability, oracle feeds, and configuration validity. Start here when something is wrong.

**`system health`** — Shows runtime metrics: uptime, memory (RSS/heap), active connections, cache sizes, and circuit breaker states.

**`rpc status`** — Displays all configured RPC endpoints with latency, slot height, and health status. Shows slot lag if multiple endpoints are configured.

**`rpc test`** — Active connectivity test against all endpoints. Reports latency and any failures.
