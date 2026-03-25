# Installation

## Requirements

| Requirement | Version | How to Check |
|:------------|:--------|:-------------|
| **Node.js** | v20 or higher | `node --version` |
| **npm** | Comes with Node.js | `npm --version` |

Don't have Node.js? Download it from [nodejs.org](https://nodejs.org/). Choose the **LTS** version.

## Install from npm (Recommended)

```bash
npm install -g flash-terminal
```

This installs Flash Terminal globally so you can run it from anywhere.

**Expected output:**

```
added 1 package in 5s
```

**Verify it worked:**

```bash
flash --version
```

You should see the version number printed.

## Install from Source

If you prefer to build from source:

```bash
git clone https://github.com/Abdr007/flash-terminal.git
cd flash-terminal
npm install
npm run build
npm link
```

**Verify it worked:**

```bash
flash --version
```

## Run with Docker

```bash
docker build -t flash-terminal .
docker run -it --env-file .env flash-terminal
```

To persist your data (logs, trade history, settings):

```bash
docker run -it --env-file .env -v ~/.flash:/root/.flash flash-terminal
```

## Updating

To update to the latest version:

```bash
npm update -g flash-terminal
```

## Troubleshooting Install Issues

### "command not found: flash"

Your npm global bin directory isn't in your PATH.

**Fix:**

```bash
# Find where npm installs global packages
npm config get prefix

# Add the bin directory to your PATH
# For example, if prefix is /usr/local:
export PATH="/usr/local/bin:$PATH"
```

Add the `export` line to your `~/.bashrc` or `~/.zshrc` to make it permanent.

### "permission denied"

On macOS/Linux, you may need to fix npm permissions:

```bash
# Option 1: Use sudo (quick fix)
sudo npm install -g flash-terminal

# Option 2: Fix npm permissions (better)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Node.js version too old

```bash
# Check your version
node --version

# If below v20, update Node.js:
# Visit https://nodejs.org/ and download the LTS version
```

## Next Steps

- [Quick Start](/guide/quick-start) — Make your first trade
- [Wallet Setup](/guide/wallet-setup) — Set up a wallet for live trading
- [RPC Setup](/guide/rpc-setup) — Configure your Solana connection
