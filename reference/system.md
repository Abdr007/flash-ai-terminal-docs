# System Commands

## help

List all available commands with descriptions.

**Aliases:** `commands`, `?`

## doctor

Run full system diagnostics: RPC health, wallet status, configuration validation, oracle feed checks.

**Aliases:** `flash doctor`, `health`, `flash health`

## system status

System health overview: connection state, active mode, uptime.

**Aliases:** `system`

## system metrics

Full runtime metrics: memory usage, uptime, cache sizes, event loop stats.

**Aliases:** `sysmetrics`

## system health

Runtime health: event loop latency, memory pressure, GC stats.

**Aliases:** `sys health`, `runtime`

## system audit

Verify protocol data integrity. Compares local state against on-chain truth.

## rpc status

Current RPC endpoint health: latency, slot height, slot lag.

## rpc test

Active connectivity test against all configured endpoints.

## rpc list

List all configured RPC endpoints.

**Aliases:** `rpc ls`, `rpc endpoints`

## rpc set

Change the primary RPC endpoint.

```bash
rpc set <url>
```

## rpc add

Add a backup RPC endpoint.

```bash
rpc add <url>
```

## rpc remove

Remove an RPC endpoint.

```bash
rpc remove <url>
```

## tx inspect

Inspect a transaction by signature.

```bash
tx inspect <signature>
```

## tx debug

Debug a failed transaction.

```bash
tx debug <signature>
```

## tx metrics

Transaction engine performance stats: success rate, average confirm time, retry rate.

**Aliases:** `tx stats`, `tx perf`, `tx engine`

## update

Check for Flash Terminal updates.

**Aliases:** `flash update`

## config

Show all active configuration values and their sources.

## degen

Toggle degen mode (higher per-market leverage limits).

**Aliases:** `degen on`, `degen off`

## engine status

Show execution engine info (hidden from help).

**Aliases:** `engine`

## benchmark engine

Benchmark execution engines (hidden from help).

**Aliases:** `engine benchmark`

## clear

Clear the terminal screen.

## exit

Quit Flash Terminal.

---

**See also:** [RPC Setup](/guide/rpc-setup) | [Troubleshooting](/guide/troubleshooting) | [Configuration](/guide/configuration)
