---
layout: default
title: Public API
---

# ReweCoin Public API

Read-only REST API for the ReweCoin **mainnet**.

**Base URL:** `https://rest.rewecoin.com`

All responses are JSON. Only `GET` requests are supported. CORS is open (`Access-Control-Allow-Origin: *`), so the API can be called directly from a browser.

## Rate limits and caching

| Item | Value |
|---|---|
| Rate limit | 5 requests/second per IP, burst of 20 |
| Over the limit | HTTP `429` |
| Caching | Responses are cached for a few seconds (see each endpoint) |

If you receive `429`, wait a moment and retry. Polling faster than the cache time returns the same data, so there is no benefit in doing so.

## Endpoints

| Endpoint | Description | Cache |
|---|---|---|
| `GET /api/network` | Chain, height, difficulty, connections, node version | 5 s |
| `GET /api/block/latest` | Latest block | 5 s |
| `GET /api/block/{height}` | Block by height | 5 s |
| `GET /api/block/{hash}` | Block by hash | 5 s |
| `GET /api/tx/{txid}` | Transaction by ID | 10 s |
| `GET /api/hashrate` | Estimated network hashrate | 30 s |
| `GET /api/supply` | Issued supply and pool breakdown | 60 s |
| `GET /api/health` | Service health check | none |

### `GET /api/network`

```bash
curl -s https://rest.rewecoin.com/api/network
```

```json
{
  "chain": "main",
  "blocks": 4020,
  "headers": 4020,
  "bestBlockHash": "013f283e84c11922fc052aa57cb312c2d89e51d2e0753bc79478ee6016ce3c21",
  "difficulty": 3.477303779166169,
  "connections": 3,
  "version": 6000050,
  "subversion": "/ReweCoin:6.0.0/",
  "protocolVersion": 170150
}
```

### `GET /api/block/latest`
### `GET /api/block/{height}`
### `GET /api/block/{hash}`

```bash
curl -s https://rest.rewecoin.com/api/block/latest
curl -s https://rest.rewecoin.com/api/block/4000
```

Returns the block as reported by the node, without the `solution` field. Main fields (example shortened):

```json
{
  "hash": "0092d2f2...fc0fe9",
  "confirmations": 1,
  "size": 6872,
  "height": 4019,
  "version": 4,
  "merkleroot": "95ab8886...d2e66",
  "tx": ["62647f79...", "9a19f18a...", "37c4ecba..."],
  "time": 1791650865,
  "bits": "20022a05",
  "difficulty": 3.696613527557834,
  "chainwork": "000000000000000000000000000000000000000000000000000000000005bba1",
  "chainSupply": { "monitored": true, "chainValue": 200950.0 },
  "valuePools": [ { "id": "transparent", "chainValue": 188814.35233375 } ],
  "previousblockhash": "0178e157...91f8"
}
```

### `GET /api/tx/{txid}`

```bash
curl -s https://rest.rewecoin.com/api/tx/<txid>
```

Returns the verbose transaction (raw hex, inputs, outputs, `confirmations` and `blockhash` once mined). The node has `txindex` enabled, so any transaction on the chain can be looked up.

### `GET /api/hashrate`

```bash
curl -s https://rest.rewecoin.com/api/hashrate
```

```json
{
  "solsPerSecond": 0.8041,
  "nodeReportedSolsPerSecond": 0,
  "windowBlocks": 120,
  "avgBlockTimeSeconds": 347.4,
  "difficulty": 3.586241569421454,
  "note": "computed from chainwork over the last blocks, in the same units as the node's getnetworksolps but with decimals"
}
```

The node rounds its own figure to a whole number, which reads `0` on a small network. `solsPerSecond` is computed from `chainwork` over the last `windowBlocks` blocks and keeps the decimals.

### `GET /api/supply`

```bash
curl -s https://rest.rewecoin.com/api/supply
```

```json
{
  "total": 201000.0,
  "transparent": 188863.60298375,
  "shielded": 12136.39701625,
  "pools": [
    { "id": "transparent", "value": 188863.60298375 },
    { "id": "sprout", "value": 0.0 },
    { "id": "sapling", "value": 12136.39701625 },
    { "id": "orchard", "value": 0.0 },
    { "id": "lockbox", "value": 0.0 }
  ],
  "note": "total issued supply as reported by the node; includes immature coinbase"
}
```

`total` is the issued supply reported by the node and includes immature coinbase outputs.

### `GET /api/health`

```bash
curl -s https://rest.rewecoin.com/api/health
```

```json
{ "ok": true }
```

## Which API should I use?

| Host | Network | Source |
|---|---|---|
| `rest.rewecoin.com` | mainnet | Public API described on this page, backed by a ReweCoin node |
| `mainnet-api.rewecoin.com` | mainnet | Explorer API |
| `api.rewecoin.com` | **testnet** | Explorer API for testnet |

Do not use `api.rewecoin.com` for mainnet data: it serves testnet.

## Not available yet

Address balances and rich list. These require an address index, which the node does not have at the moment.
