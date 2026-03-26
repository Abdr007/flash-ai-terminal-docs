# Troubleshooting

Common issues and how to fix them.

## "command not found: flash"

**Cause:** Flash Terminal isn't in your PATH.

```bash
# Reinstall
npm install -g flash-terminal

# If still not found, check npm prefix
npm config get prefix

# Add to PATH
export PATH="$(npm config get prefix)/bin:$PATH"
```

Add the `export` to `~/.bashrc` or `~/.zshrc` to persist.

---

## "RPC error" / "All RPC endpoints unavailable"

**Cause:** Your Solana RPC endpoint is down or rate-limited.

1. Check your internet connection
2. Verify `RPC_URL` in `.env` is correct
3. Check [status.solana.com](https://status.solana.com)
4. Try a paid RPC provider ([Helius](https://helius.dev/))

```bash
rpc status       # Check health
rpc test         # Test all endpoints
doctor           # Full diagnostics
```

---

## Wallet Not Loading

**Cause:** Wrong path, bad file, or permission issue.

```bash
# Check the path in .env
WALLET_PATH=~/.config/solana/id.json

# Verify file exists
ls -la ~/.config/solana/id.json

# Verify it's valid JSON (array of numbers)
head -c 50 ~/.config/solana/id.json

# Fix permissions
chmod 600 ~/.config/solana/id.json
```

::: tip
Wallet path must resolve within your home directory. Symlinks pointing outside are rejected.
:::

---

## Transaction Not Landing

**Cause:** Transaction broadcast but never confirmed.

1. Check RPC health: `rpc status`
2. Ensure wallet has SOL for fees (~0.01 SOL)
3. Increase priority fee:

```bash
COMPUTE_UNIT_PRICE=200000
```

4. Enable dynamic CU (default is on):

```bash
FLASH_DYNAMIC_CU=true
```

Flash Terminal retries automatically with rebroadcast every 800ms.

---

## "Circuit breaker active"

**Cause:** Session or daily losses exceeded your configured threshold.

This is **intentional** — protecting you from further losses.

**Fix:** Restart the terminal. Adjust limits if too tight:

```bash
MAX_SESSION_LOSS_USD=1000
MAX_DAILY_LOSS_USD=2000
```

---

## Position Not Showing

**Cause:** Cache hasn't refreshed yet.

1. Wait a few seconds and run `positions` again (30s cache)
2. Run `doctor` to verify connectivity
3. In live mode, state reconciler syncs every 60s

In simulation mode, positions are in-memory — lost if terminal crashes.

---

## "Exceeded CU limit"

**Cause:** Transaction used more compute units than allocated.

```bash
# Increase buffer percentage
FLASH_CU_BUFFER_PCT=40

# Or increase static limit
COMPUTE_UNIT_LIMIT=400000
```

With `FLASH_DYNAMIC_CU=true` (default), the buffer % is applied on top of the simulated usage.

---

## Simulation vs Live Confusion

Check the prompt:

```
flash [sim] >     ← Simulation (safe)
flash [live] >    ← Live (real money)
```

Mode is locked per session. To switch: exit, change `SIMULATION_MODE` in `.env`, restart.

---

## Pyth Price Errors

**Cause:** Pyth oracle unreachable or returning stale data.

Flash Terminal backs off automatically (30s → 120s cooldown) and uses last cached price. Normal refresh resumes when the oracle recovers.

Usually resolves on its own. Check [pyth.network](https://pyth.network/) for outages.

---

## Diagnostic Commands

| Command | What It Does |
|:--------|:-------------|
| `doctor` | Full system check — RPC, wallet, config, oracles |
| `rpc status` | Endpoint health, latency, slot lag |
| `rpc test` | Active connectivity test against all endpoints |
| `system health` | Runtime metrics — memory, uptime, event loop |
| `system audit` | Protocol data integrity verification |
| `config` | Show all active configuration values |

## Log Files

| Log | Location |
|:----|:---------|
| Signing audit | `~/.flash/signing-audit.log` |
| Application | Configured via `LOG_FILE` env var |

Logs rotate at 10MB. API keys are automatically scrubbed.

## Still Stuck?

- Run `doctor` for diagnostics
- Check the [FAQ](/guide/faq)
- Open an issue on [GitHub](https://github.com/Abdr007/flash-terminal/issues)
