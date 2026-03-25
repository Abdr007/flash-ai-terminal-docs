# Troubleshooting

Common issues and how to fix them.

## "command not found: flash"

**Cause:** Flash Terminal isn't installed globally, or the npm global bin isn't in your PATH.

**Fix:**

```bash
# Reinstall globally
npm install -g flash-terminal

# If that doesn't work, find your npm bin directory
npm config get prefix

# Add it to your PATH (replace /usr/local with your prefix)
export PATH="/usr/local/bin:$PATH"
```

Add the `export` line to your `~/.bashrc` or `~/.zshrc` to make it permanent.

---

## "RPC error" or "All RPC endpoints unavailable"

**Cause:** Your Solana RPC endpoint is unreachable or rate-limited.

**Fix:**

1. Check your internet connection
2. Verify your `RPC_URL` in `.env` is correct and reachable
3. Check if Solana is having issues at [status.solana.com](https://status.solana.com)
4. If using public RPC, try a paid provider like [Helius](https://helius.dev/)

```bash
# Inside Flash Terminal, check RPC health
flash > rpc status
flash > rpc test
```

Flash Terminal retries automatically every 30 seconds. If you have backup endpoints configured, it will switch to them.

---

## Wallet Not Loading

**Cause:** The wallet file path is wrong, the file is corrupted, or permissions are incorrect.

**Fix:**

1. Check that the path in `.env` is correct:

```bash
WALLET_PATH=~/.config/solana/id.json
```

2. Verify the file exists:

```bash
ls -la ~/.config/solana/id.json
```

3. Verify it's valid JSON (should be an array of numbers):

```bash
head -c 50 ~/.config/solana/id.json
# Should show something like: [45,12,198,33,...
```

4. Check file permissions:

```bash
chmod 600 ~/.config/solana/id.json
```

---

## Transaction Not Landing

**Cause:** The transaction was broadcast but never confirmed on-chain.

**Fix:**

1. Check RPC health: `rpc status`
2. Make sure your wallet has enough SOL for transaction fees (~0.01 SOL)
3. If transactions are consistently failing, try increasing the priority fee:

```bash
# In your .env
COMPUTE_UNIT_PRICE=100000
```

4. Or enable dynamic compute units:

```bash
FLASH_DYNAMIC_CU=true
```

Flash Terminal automatically retries transactions. If it still fails after ~45 seconds, retry the trade.

---

## Position Not Showing

**Cause:** The position hasn't synced yet.

**Fix:**

1. Wait a few seconds and run `positions` again (cache refreshes every 30s)
2. Run `doctor` to verify connectivity
3. In live mode, the state reconciler syncs every 60 seconds

::: tip
In simulation mode, positions are stored in memory. If the terminal crashed, simulation state may be lost.
:::

---

## Circuit Breaker Tripped

**Cause:** Your cumulative session or daily loss exceeded the configured threshold.

**What happens:**
- All trade operations are blocked
- Monitoring, prices, and position queries still work
- This is intentional — it's protecting you from further losses

**Fix:**

Restart the terminal to reset the circuit breaker. If the thresholds are too tight, adjust them in `.env`:

```bash
MAX_SESSION_LOSS_USD=1000
MAX_DAILY_LOSS_USD=2000
```

---

## Simulation vs Live Confusion

**How to tell which mode you're in:**

Look at the prompt:

```
flash [sim] >     ← Simulation mode (safe, no real money)
flash [live] >    ← Live mode (real transactions)
```

Mode is locked for the entire session. To switch:

1. Close the terminal (`exit`)
2. Change `SIMULATION_MODE` in your `.env`
3. Restart `flash`

---

## Pyth Price Errors

**Cause:** The Pyth oracle is unreachable or returning stale data.

**What happens:**
- Flash Terminal backs off automatically (30s to 120s cooldown)
- Falls back to last known cached price
- Normal 5s refresh resumes when the oracle recovers

**Fix:** Usually resolves on its own. If persistent, check if [Pyth Hermes](https://pyth.network/) is experiencing an outage.

---

## Agent Not Trading

**Cause:** The autonomous agent is running but not executing trades.

This is usually **normal behavior**. The agent only trades when conditions are favorable.

**Check in order:**

1. **Cooldown** — Is a minimum trade interval in effect?
2. **Low confidence** — No market passes the confidence gate
3. **Circuit breaker** — Check with `doctor`
4. **Kill switch** — Is `TRADING_ENABLED=false` in your `.env`?

The agent is designed to do nothing when it doesn't find good opportunities.

---

## High Memory Usage

**Fix:** Restart the terminal. Long-running sessions with frequent agent ticks can accumulate memory pressure. Flash Terminal caps all caches, but GC pressure builds over time.

---

## Diagnostic Commands

When something goes wrong, start with these:

| Command | What It Does |
|:--------|:-------------|
| `doctor` | Full system check — RPC, wallet, config, oracle feeds |
| `rpc status` | RPC endpoint health, latency, slot lag |
| `rpc test` | Active connectivity test against all endpoints |
| `system health` | Runtime metrics — memory, uptime, cache sizes |
| `config` | Show all active configuration values |

---

## Log Files

| Log | Location | What's In It |
|:----|:---------|:-------------|
| **Signing audit** | `~/.flash/signing-audit.log` | Every trade attempt (never contains keys) |
| **Application** | Set via `LOG_FILE` env var | General app logs (API keys scrubbed) |
| **Reconciliation** | `~/.flash/logs/reconcile.log` | State sync events |

Logs rotate at 10MB.

## Still Stuck?

- Run `doctor` for a full diagnostic
- Check the [FAQ](/guide/faq)
- Open an issue on [GitHub](https://github.com/Abdr007/flash-terminal/issues)
