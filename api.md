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

The list is cached for about 5 minutes and covers transparent addresses only; shielded funds are not included. The `cached` and `generatedAt` fields show whether the response came from the cache and when the list was built. A request that rebuilds the list can take about 10 to 15 seconds, so use a timeout of at least 30 seconds.

## Token routes

Read-only routes for tokens created on the ReweCoin token layer.

- Token IDs look like `tok_a7d6f80f8a34`. Token-layer addresses start with `rwu1`, not `C7`.
- Amounts (`total_supply`, `balance`, `amount`) are **strings** in the smallest unit. Divide by `10^decimals` to get the display value.
- Errors are JSON, for example `{"error": "token inexistent"}` with status `404` (the message text is in Romanian).

### `GET /api/tokens`

All tokens, newest first.

```json
{
  "count": 7,
  "tokens": [
    {
      "token_id": "tok_a7d6f80f8a34",
      "name": "$MOTO",
      "symbol": "MOTO",
      "decimals": 8,
      "total_supply": "10000000000000000",
      "holders_count": 1,
      "transfers_count": 0,
      "deploy_txid": "3f5ce1cc...",
      "deploy_block_height": 3166,
      "creator_address": "rwu1...",
      "is_official": true,
      "is_verified": 1,
      "is_test": false,
      "logo_path": "tok_a7d6f80f8a34.png",
      "logo_status": "approved",
      "created_at": 1791411864
    }
  ]
}
```

`is_verified` can be `null`. Logo fields (`logo_status`, `logo_reject_reason`, `logo_uploaded_at`) and `receive_address` are also present and may be `null`.

### `GET /api/token/{token_id}`

One token, same object as in the list above. `404` if the token does not exist.

### `GET /api/token/{token_id}/holders`

Addresses with a balance above zero, largest first.

```json
{
  "token_id": "tok_a7d6f80f8a34",
  "count": 1,
  "holders": [{"address": "rwu1...", "balance": "10000000000000000"}]
}
```

### `GET /api/token/{token_id}/transfers`

Transfers of this token, newest block first.

```json
{
  "token_id": "tok_a7d6f80f8a34",
  "count": 0,
  "transfers": []
}
```

Each transfer has `txid`, `block_height`, `status`, `error_message`, `from`, `to`, `amount` and `executed_at`. `from` may be `null` when the sender is not made public.

### `GET /api/token/{token_id}/balance/{address}`

```json
{"token_id": "tok_a7d6f80f8a34", "address": "rwu1...", "balance": "0"}
```

An address with no balance returns `"0"`, not an error.

### `GET /api/tx/{txid}/token`

Tells you whether a transaction is a token deploy or transfer.

```json
{"kind": "deploy", "token": {"token_id": "tok_a7d6f80f8a34", "symbol": "MOTO"}}
```

For a successful transfer, `kind` is `"transfer"` and the response also has `to` and `amount`. If the transaction is neither, the answer is `404` with `{"kind": null}`.

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
