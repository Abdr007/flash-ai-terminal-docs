# RPC Reliability

FT is designed for real-world RPC conditions where endpoints fail, latency spikes, and nodes fall behind the network tip.

## Multi-Endpoint Failover

Configure multiple RPC endpoints in `.env`:

```bash
RPC_URL=https://mainnet.helius-rpc.com/?api-key=...
BACKUP_RPC_1=https://api.mainnet-beta.solana.com
BACKUP_RPC_2=https://solana-api.projectserum.com
```

### Failover Triggers

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Endpoint failure | Unhealthy or unreachable | Switch to next endpoint |
| High latency | > 3 seconds response time | Switch to next endpoint |
| Slot lag | > 50 slots behind network | Switch to next endpoint |
| Failure rate | > 50% in 20-sample window | Switch to next endpoint |
| Network error during tx | Timeout, 429, 503 | Immediate switch (bypass cooldown) |

### Cooldown

A 60-second cooldown prevents oscillation between endpoints. After switching, the system stays on the new endpoint for at least 60 seconds before considering another switch.

Transaction-level network errors bypass this cooldown to ensure immediate recovery during critical operations.

### Connection Pinning

The same RPC connection is used for an entire transaction lifecycle (build, sign, send, confirm). This prevents mid-transaction failover from causing inconsistent state.

## Slot Lag Detection

FT tracks the latest slot from each endpoint and computes relative lag:

```
Endpoint A: slot 285,432,100  (active)
Endpoint B: slot 285,431,950  (150 slots behind)
```

When an endpoint falls more than 50 slots behind, it is considered stale and triggers failover.

## Transaction Retry Logic

Transaction submission uses a multi-attempt strategy:

```
Attempt 1
  Fetch fresh blockhash
  Simulate transaction (catch program errors early)
  Broadcast with sendRawTransaction
  Poll confirmation for 45 seconds
  Resend periodically during polling

Attempt 2  (on network failure)
  Switch RPC endpoint
  Fetch fresh blockhash
  Broadcast directly (skip simulation)
  Poll confirmation for 45 seconds

Attempt 3  (on network failure)
  Same as Attempt 2
  Final attempt before failure
```

**Network errors** (timeout, ECONNREFUSED, HTTP 429/503) trigger failover and retry.

**Program errors** (invalid instruction, insufficient funds) fail immediately without retry.

## State Reconciliation

The reconciliation engine ensures CLI state matches blockchain state.

### When It Runs

| Event | Trigger |
|-------|---------|
| Startup | After client initialization |
| Wallet switch | When changing wallets |
| Post-trade | After confirmed transactions |
| Background | Every 60 seconds |

### How It Works

1. Fetch authoritative positions from blockchain
2. Validate numeric integrity (reject NaN/Infinity/zero)
3. Compare with locally tracked positions
4. If mismatch detected, retry after delay
5. If mismatch persists across consecutive cycles, accept blockchain state
6. Log all events to `~/.flash/logs/reconcile.log`

## Background Health Monitoring

The RPC manager runs a health check every 30 seconds:

- Ping each configured endpoint
- Record latency and success/failure
- Update slot lag metrics
- Trigger failover if the active endpoint degrades

All monitoring timers use `.unref()` so they never prevent Node.js from exiting.

## Status Indicators

The terminal shows live RPC status:

```
RPC: Helius (340ms) | Sync: OK
```

| Indicator | Meaning |
|-----------|---------|
| RPC name + latency | Active endpoint and smoothed latency |
| Sync: OK | Reconciler reports no mismatch |
| Sync: DELAY | Reconciler detected a state mismatch |
| Slot lag detected | Active endpoint is behind network tip |
