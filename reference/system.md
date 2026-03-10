# System Commands

## system status

Show system health information.

**Description:** Displays build version, RPC provider, latency, wallet connection state, simulation/live mode, and session uptime.

**Syntax:**

```bash
system status
```

**Aliases:** `system`

---

## rpc status

Show RPC endpoint health and latency.

**Description:** Displays per-endpoint details including URL, latency, failure rate, slot lag, and active/inactive status.

**Syntax:**

```bash
rpc status
```

---

## rpc test

Run a full RPC diagnostic with scoring.

**Description:** Tests connectivity, latency, slot freshness, and transaction simulation across all configured endpoints. Produces a health score.

**Syntax:**

```bash
rpc test
```

---

## tx inspect

Inspect a transaction on-chain.

**Description:** Fetches and displays transaction details, program logs, and confirmation status for a given signature.

**Syntax:**

```bash
tx inspect <signature>
```

**Example:**

```bash
tx inspect 5K7x...abc
```

---

## tx debug

Debug a transaction with protocol context.

**Description:** Fetches transaction details and provides protocol-level context including program errors, instruction breakdown, and Flash Trade error code mapping.

**Syntax:**

```bash
tx debug <signature>
```

**Example:**

```bash
tx debug 5K7x...abc
```

---

## doctor

Run a full system diagnostic.

**Description:** Checks RPC connectivity, wallet state, build integrity, and all subsystem health. Reports issues and suggested fixes.

**Syntax:**

```bash
doctor
```

**Aliases:** `flash doctor`

---

## degen

Toggle degen mode.

**Description:** Enables or disables degen mode, which unlocks 500x leverage on SOL, BTC, and ETH markets.

**Syntax:**

```bash
degen on
degen off
```

---

## help

List all available commands.

**Description:** Displays every available command with a brief description.

**Syntax:**

```bash
help
```

**Aliases:** `commands`, `?`

---

## exit

Clean shutdown.

**Description:** Gracefully stops all subsystems in order: status bar, risk monitor, reconciler, plugins, and RPC manager. Returns to the shell.

**Syntax:**

```bash
exit
```

**Aliases:** `quit`
