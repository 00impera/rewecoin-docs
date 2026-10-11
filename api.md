---
layout: default
title: Public API
---

# ReweCoin Public API

**Base URL (mainnet):** `https://api.rewecoin.com`

Read-only REST API returning JSON. No API key required.

## Conventions

- All endpoints use `GET`.
- Amounts are in RWC unless a field name ends in `Zat` / `Sat` (smallest unit, 1 RWC = 100,000,000 zatoshi).
- Mainnet transparent addresses start with `C7`.
- Rate limit: 120 requests per 60 seconds per client on address and richlist routes (see the `RateLimit-*` response headers). Back off on `429`.
- CORS: read endpoints answer `Access-Control-Allow-Origin: *` (no credentials), so they can be called from any browser app.
- Errors are JSON, e.g. `{"error": "unknown endpoint"}` with a 4xx status.

## Endpoints

### `GET /api/health`

Liveness check.

```json
{"ok": true}
```

### `GET /api/network`

Chain and node status.

```json
{
  "chain": "main",
  "blocks": 4144,
  "headers": 4144,
  "bestBlockHash": "05f01fd4...",
  "difficulty": 1,
  "connections": 4
}
```

`chain` must be `"main"` on mainnet. Additional node fields (version, subversion, protocol version) may be present.

### `GET /api/block/latest`
### `GET /api/block/{height}`

Block by height, or the chain tip with `latest`.

```
GET /api/block/4000
```

Key fields: `hash`, `height`, `confirmations`, `size`, `version`, `merkleroot`, `tx` (array of txids), `time`.

The tip has `confirmations: 1`. Do not treat a transaction as final with very few confirmations; reorganizations are possible.

### `GET /api/tx/{txid}`

Transaction as returned by the node (Zcash-style fields). Key fields: `txid`, `size`, `version`, `locktime`, `expiryheight`, `vin`, `vout`, `vjoinsplit`, `vShieldedSpend`, `vShieldedOutput`, `orchard`, `blockhash`, `height`, `confirmations`, `time`.

### `GET /api/address/{address}`

Balance and history for a transparent address.

```json
{
  "address": "C7WoFm8QNufcRnpcQA13FjhY4FEGcQYYskD",
  "balance": 0,
  "received": 0,
  "sent": 0,
  "txCount": 0,
  "txids": []
}
```

Shielded balances are not visible here.

### `GET /api/hashrate`

Estimated network hashrate, computed from chainwork over the last blocks. Fields: `solsPerSecond`, `windowBlocks`, `avgBlockTimeSeconds`, `difficulty`, `note`.

### `GET /api/supply`

Coin supply split by pool.

```json
{
  "total": 207200.0,
  "transparent": 195004.382829,
  "shielded": 12195.617171,
  "pools": [{"id": "transparent", "value": 195004.382829}]
}
```

### `GET /api/richlist`

Top transparent addresses by balance.

```json
{
  "cached": true,
  "list": [
    {"rank": 1, "address": "C7...", "balance": 106658.48, "percentage": 54.68}
  ]
}
```

The list is cached and covers transparent addresses only; shielded funds are not included.

## Token routes

`/api/token*` and `/api/tx/{txid}/token` exist for the token platform. They are not documented yet.

## Not exposed publicly

Wallet and send routes (`/api/wallet`, `/api/send`) are intentionally disabled on the public API.

## SDK

```js
const { ReweCoin } = require('rewecoin');
const rwc = new ReweCoin();
const info = await rwc.getBalance('C7WoFm8QNufcRnpcQA13FjhY4FEGcQYYskD');
```

Install with `npm i rewecoin`. See the [SDK docs](sdk/).

## Examples

```bash
curl https://api.rewecoin.com/api/network
curl https://api.rewecoin.com/api/block/latest
curl https://api.rewecoin.com/api/address/C7WoFm8QNufcRnpcQA13FjhY4FEGcQYYskD
```

```js
const r = await fetch('https://api.rewecoin.com/api/supply');
console.log(await r.json());
```
