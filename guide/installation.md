# Installation

## Requirements

| Requirement | Minimum | Check |
|:------------|:--------|:------|
| **Node.js** | v20.0.0 | `node --version` |
| **npm** | Included with Node.js | `npm --version` |

Get Node.js from [nodejs.org](https://nodejs.org/) — choose the **LTS** version.

## Install from npm

```bash
npm install -g flash-terminal
```

Verify:

```bash
flash --version
```

## Install from Source

```bash
git clone https://github.com/AustinJ712/flash-terminal.git
cd flash-terminal
npm install
npm run build
npm link
```

## Docker

```bash
docker build -t flash-terminal .
docker run -it --env-file .env flash-terminal
```

Persist data:

```bash
docker run -it --env-file .env -v ~/.flash:/root/.flash flash-terminal
```

## Update

```bash
npm update -g flash-terminal
```

Or check from inside the terminal:

```bash
flash > update
```

## Common Install Issues

### "command not found: flash"

npm global bin isn't in your PATH.

```bash
# Find your npm prefix
npm config get prefix

# Add to PATH (example for /usr/local)
export PATH="/usr/local/bin:$PATH"
```

Add the `export` line to `~/.bashrc` or `~/.zshrc` to persist.

### "permission denied"

```bash
# Option 1: sudo
sudo npm install -g flash-terminal

# Option 2: fix npm prefix (better)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Node.js too old

```bash
node --version
# If below v20, download LTS from https://nodejs.org/
```

## Next Steps

- [Quick Start](/guide/quick-start) — First trade in 2 minutes
- [Wallet Setup](/guide/wallet-setup) — Connect a wallet for live trading
