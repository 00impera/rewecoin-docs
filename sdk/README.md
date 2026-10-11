# ReweCoin JavaScript SDK

A small, dependency-free client for the ReweCoin public REST API ([API docs](../api.html)).

- Works in Node.js 18+ (uses the global `fetch`) and in browsers.
- Single file: `rewecoin.js`.
- Default API: `https://api.rewecoin.com` (mainnet).
- `getBalance` uses the same host by default (see the `explorerUrl` option).

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
| `getRichList()` | `/api/richlist` | Top addresses by balance (transparent only). Cached about 5 minutes; an uncached call can take about 15 s, so it uses a 30 s timeout |
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

- **Browsers.** The explorer's `/api/address` route sends `access-control-allow-origin: *`, so `getBalance` works from any web page. Other routes tested (such as `/api/block/latest`) send it too.
- **Explorer URL.** `getBalance` uses the `explorerUrl` option, which now defaults to the same host as the other methods.
- **Response size.** The explorer returns every transaction ID of the address, about 67 bytes each. An address with 1,088 transactions returns about 71 KB. The SDK drops `txids` unless you ask for them, but the full response is still downloaded.
- **Units.** Zatoshi is inferred from the data (a pool address received 5,075,004,140,000, which matches 1,015 blocks of 50 RWC plus fees). The explorer API does not document it.
- An address with no history returns `balance: 0`. An invalid address (bad checksum) rejects with `ReweCoinError` (`status` 404, message `Invalid address`).

## Options and errors

```js
const rwc = new ReweCoin({
  baseUrl: "https://api.rewecoin.com",
  explorerUrl: "https://api.rewecoin.com",
  timeoutMs: 10000
});
```

Failed requests reject with a `ReweCoinError` that has `message`, `status` and `body`. The API limits requests per IP and answers `429` above the limit; see the API docs for current limits.
