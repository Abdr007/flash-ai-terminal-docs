# System Commands

## system status

Show system health information.

```bash
system status
```

Shows: build version, RPC provider, latency, wallet state, simulation mode, and session uptime.

---

## rpc status

Show RPC endpoint health and latency.

```bash
rpc status
```

Shows per-endpoint: URL, latency, failure rate, slot lag, and active/inactive status.

---

## rpc test

Run a full RPC diagnostic with scoring.

```bash
rpc test
```

Tests: connectivity, latency, slot freshness, and transaction simulation. Provides a health score.

---

## tx inspect

Inspect a transaction on-chain.

```bash
tx inspect <signature>
```

Shows transaction details, program logs, and status.

---

## doctor

Run a full system diagnostic.

```bash
doctor
```

Alias: `flash doctor`

Checks: RPC connectivity, wallet state, build integrity, and subsystem health.

---

## help

List all available commands.

```bash
help
```

---

## exit

Clean shutdown.

```bash
exit
```

Stops all subsystems in order: status bar, risk monitor, reconciler, plugins, RPC manager. Returns to the shell.
