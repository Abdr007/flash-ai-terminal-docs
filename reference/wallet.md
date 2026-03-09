# Wallet Commands

## wallet

Show wallet connection status.

**Description:** Displays whether a wallet is connected, the active wallet name, and the public key.

**Syntax:**

```bash
wallet
```

**Aliases:** `wallet status`

---

## wallet tokens

View all token balances.

**Description:** Lists all token balances for the connected wallet. Results are cached for 30 seconds.

**Syntax:**

```bash
wallet tokens
```

---

## wallet balance

Show SOL balance.

**Description:** Displays the native SOL balance of the connected wallet.

**Syntax:**

```bash
wallet balance
```

---

## wallet list

List saved wallets.

**Description:** Shows all wallets stored in `~/.flash/wallets/`.

**Syntax:**

```bash
wallet list
```

---

## wallet import

Import and store a keypair file.

**Description:** Imports a wallet from a keypair JSON file and saves it under the given name. Validates that the file contains a valid 64-byte secret key. The file path is restricted to the home directory and symlinks are resolved for security.

**Syntax:**

```bash
wallet import <name> <path>
```

**Example:**

```bash
wallet import main ~/wallets/my-wallet.json
```

---

## wallet use

Switch to a saved wallet.

**Description:** Activates a previously imported wallet by name.

**Syntax:**

```bash
wallet use <name>
```

**Example:**

```bash
wallet use main
```

---

## wallet connect

Connect a wallet file directly.

**Description:** Connects a keypair file for the current session only. The wallet is not saved to `~/.flash/wallets/`.

**Syntax:**

```bash
wallet connect <path>
```

**Example:**

```bash
wallet connect ~/my-keypair.json
```

---

## wallet disconnect

Disconnect the active wallet.

**Description:** Disconnects the currently connected wallet and zeros the secret key bytes in memory.

**Syntax:**

```bash
wallet disconnect
```

---

## wallet address

Show wallet public key.

**Description:** Displays the base58-encoded public key of the connected wallet.

**Syntax:**

```bash
wallet address
```
