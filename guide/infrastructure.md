# RPC Reliability

FAT is designed to operate under real-world RPC conditions where endpoints fail, latency spikes, and nodes fall behind the network tip.

## Why This Matters

In trading infrastructure, RPC reliability directly impacts execution quality:

- A failed RPC call can miss a trade window
- A stale endpoint can submit transactions with expired blockhashes
- An undetected outage can leave the user blind to position state

FAT treats RPC reliability as a first-class concern, not an afterthought.

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

The same RPC connection is used for an entire transaction lifecycle (build → sign → send → confirm). This prevents mid-transaction failover from causing inconsistent state.

## Slot Lag Detection

FAT tracks the latest slot from each endpoint and computes relative lag:

```
Endpoint A: slot 285,432,100  (active)
Endpoint B: slot 285,431,950  (150 slots behind)
```

When an endpoint falls more than 50 slots behind, it is considered stale and triggers failover.

The status bar shows slot lag when detected:

```
RPC: Helius (340ms) | Slot lag detected
```

## Transaction Retry Logic

Transaction submission uses a multi-attempt strategy:

```
Attempt 1
├── Fetch fresh blockhash
├── Simulate transaction (catch program errors early)
├── Broadcast with sendRawTransaction
├── Poll confirmation for 45 seconds
└── Resend every 2 polls

Attempt 2  (on network failure)
├── Switch RPC endpoint
├── Fetch fresh blockhash
├── Broadcast directly (skip simulation)
└── Poll confirmation for 45 seconds

Attempt 3  (on network failure)
├── Same as Attempt 2
└── Final attempt before failure
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
4. If RPC returns fewer positions, retry after 400ms
5. If mismatch persists for 3 consecutive cycles, accept blockchain state
6. Log all events to `~/.flash/logs/reconcile.log`

### Anti-Spam Protection

The reconciler shows at most one CLI warning per mismatch event. When state recovers, the warning resets. Internal debug messages are written to log files only.

## Background Health Monitoring

The RPC manager runs a health check every 30 seconds:

- Ping each configured endpoint
- Record latency and success/failure
- Update slot lag metrics
- Trigger failover if the active endpoint degrades

All monitoring timers use `.unref()` — they never prevent Node.js from exiting.

## Status Indicators

The terminal title bar shows live status:

```
Flash | RPC: Helius (340ms) | Sync: OK | Wallet: ABDR | Mode: LIVE
```

| Indicator | Meaning |
|-----------|---------|
| `RPC: Helius (340ms)` | Active endpoint and smoothed latency |
| `Sync: OK` | Reconciler reports no mismatch |
| `Sync: DELAY` | Reconciler detected a state mismatch |
| `Slot lag detected` | Active endpoint is behind network tip |

Latency uses a 5-sample rolling average with 3x outlier rejection to prevent visual jitter from transient spikes.
