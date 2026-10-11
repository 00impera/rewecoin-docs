# ReweCoin JavaScript SDK

A small, dependency-free client for the ReweCoin public REST API ([API docs](../api.html)).

- Works in Node.js 18+ (uses the global `fetch`) and in browsers.
- Single file: `rewecoin.js`.
- Default API: `https://rest.rewecoin.com` (mainnet).
- `getBalance` uses the explorer API, `https://mainnet-api.rewecoin.com`.

## Usage

```js
const { ReweCoin } = require("./rewecoin.js");

const rwc = new ReweCoin();

(async () => {
  const net = await rwc.getNetwork();
  console.log(net.chain, net.blocks);

  const block = await rwc.getBlock("latest");
  console.log(block.height, block.hash);

  const bal = await rwc.getBalance("C7TuJsfkLhAD3kh2rSmVdZBonBVmTFC2Z9Z");
  console.log(bal.balance, bal.txCount);
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
| `getBalance(address, opts)` | explorer `/api/address/{address}` | Balance, received, sent, transaction count |
| `health()` | `/api/health` | `true` if the API is up |

## getBalance

```js
const bal = await rwc.getBalance("C7...");            // without txids
const full = await rwc.getBalance("C7...", { includeTxids: true });
```

Returns:

| Field | Meaning |
|---|---|
| `address` | The address queried |
| `balance`, `received`, `sent` | Amounts in RWC |
| `balanceZat`, `receivedZat`, `sentZat` | Same amounts in zatoshi (1 RWC = 100,000,000) |
| `txCount` | Number of transactions |
| `txids` | Transaction IDs, only with `includeTxids: true` |

Notes:

- **Browsers.** The explorer's `/api/address` route sends `access-control-allow-origin: *`, so `getBalance` works from any web page. Other explorer routes do not send CORS headers.
- **Separate server.** It queries the explorer, not `rest.rewecoin.com`. Change it with the `explorerUrl` option. If the explorer is down, only `getBalance` fails.
- **Response size.** The explorer returns every transaction ID of the address, about 67 bytes each. An address with 1,088 transactions returns about 71 KB. The SDK drops `txids` unless you ask for them, but the full response is still downloaded.
- **Units.** Zatoshi is inferred from the data (a pool address received 5,075,004,140,000, which matches 1,015 blocks of 50 RWC plus fees). The explorer API does not document it.
- An address with no history returns `balance: 0`. An invalid address (bad checksum) rejects with `ReweCoinError` (`status` 404, message `Invalid address`).

## Options and errors

```js
const rwc = new ReweCoin({
  baseUrl: "https://rest.rewecoin.com",
  explorerUrl: "https://mainnet-api.rewecoin.com",
  timeoutMs: 10000
});
```

Failed requests reject with a `ReweCoinError` that has `message`, `status` and `body`. The REST API allows about 5 requests per second per IP and answers `429` above that.

## Not available yet

Rich list method. The SDK has no method for it yet. The data is available from the public API at `GET https://api.rewecoin.com/api/richlist` (transparent addresses only).
