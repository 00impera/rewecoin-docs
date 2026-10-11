# ReweCoin JavaScript SDK

A small, dependency-free client for the ReweCoin public REST API ([API docs](../api.html)).

- Works in browsers and in Node.js 18+ (uses the global `fetch`).
- Single file: `rewecoin.js`.
- Default API: `https://rest.rewecoin.com` (mainnet).

## Usage

```js
const { ReweCoin } = require("./rewecoin.js");

const rwc = new ReweCoin();

(async () => {
  const net = await rwc.getNetwork();
  console.log(net.chain, net.blocks);

  const block = await rwc.getBlock("latest");
  console.log(block.height, block.hash);
})();
```

In a browser, load the file with `<script src="rewecoin.js"></script>` and use `new ReweCoin()`.

## Methods

| Method | Endpoint | Returns |
|---|---|---|
| `getNetwork()` | `/api/network` | Chain, height, difficulty, connections |
| `getBlock(id)` | `/api/block/{id}` | Block by height, hash, or `"latest"` (default) |
| `getTx(txid)` | `/api/tx/{txid}` | Transaction by ID |
| `getHashrate()` | `/api/hashrate` | Estimated network hashrate |
| `getSupply()` | `/api/supply` | Issued supply and pool breakdown |
| `health()` | `/api/health` | `true` if the API is up |

## Options and errors

```js
const rwc = new ReweCoin({ baseUrl: "https://rest.rewecoin.com", timeoutMs: 10000 });
```

Failed requests reject with a `ReweCoinError` that has `message`, `status` and `body`. The API allows about 5 requests per second per IP and answers `429` above that.

## Not available yet

Address balances and rich list. They need an address index, which the node does not have at the moment.