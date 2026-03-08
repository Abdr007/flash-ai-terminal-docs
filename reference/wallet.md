# Wallet Commands

## wallet

Show wallet connection status.

```bash
wallet
```

---

## wallet tokens

View token balances for the connected wallet. Cached for 30 seconds.

```bash
wallet tokens
```

---

## wallet balance

Show SOL balance.

```bash
wallet balance
```

---

## wallet list

List saved wallets.

```bash
wallet list
```

---

## wallet import

Import a wallet from a keypair file.

```bash
wallet import <name> <path-to-keypair>
```

**Example:**

```bash
wallet import main ~/wallets/my-wallet.json
```

The file path is validated within the home directory. Symlinks are resolved. Input is hidden during import.

---

## wallet use

Switch to a saved wallet.

```bash
wallet use <name>
```

---

## wallet connect

Quick connect to a keypair file.

```bash
wallet connect <path>
```

---

## wallet disconnect

Disconnect the current wallet.

```bash
wallet disconnect
```

---

## wallet address

Show the public key of the connected wallet.

```bash
wallet address
```
