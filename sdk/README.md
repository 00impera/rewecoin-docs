# ReweCoin JavaScript SDK

**Version 0.3.0** · MIT license · single file, no dependencies

A small client for the ReweCoin public, read-only REST API ([API reference](https://rewecoin.gitbook.io/rewecoin-rwc/public-api)).

- Works in Node.js 18+ (global `fetch`) and in browsers.
- Default API: `https://api.rewecoin.com` (mainnet).
- Download: [`rewecoin.js`](https://raw.githubusercontent.com/00impera/rewecoin-docs/master/sdk/rewecoin.js) (source on [GitHub](https://github.com/00impera/rewecoin-docs/tree/master/sdk)). There is no npm package yet: copy the file into your project.

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

  const { count, tokens } = await rwc.getTokens();
  console.log(count, tokens[0].symbol, tokens[0].token_id);
})();
```

In a browser, load the file with `<script src="rewecoin.js"></script>`. It defines the global `ReweCoin` (and `ReweCoinError`); use `new ReweCoin()`.

## Methods

All methods return a Promise.

| Method | Endpoint | Returns |
|---|---|---|
| `getNetwork()` | `/api/network` | Chain, height, difficulty, connections |
| `getBlock(id)` | `/api/block/{id}` | Block by height, hash, or `"latest"` (default) |
| `getTx(txid)` | `/api/tx/{txid}` | Transaction by ID |
| `getHashrate()` | `/api/hashrate` | Estimated network hashrate |
| `getSupply()` | `/api/supply` | Issued supply and pool breakdown |
| `getRichList()` | `/api/richlist` | Top transparent addresses by balance. Cached about 5 minutes; a rebuild can take about 15 s, so this call waits up to 30 s |
| `getBalance(address, opts)` | `/api/address/{address}` | Balance, received, sent, transaction count |
| `getTokens()` | `/api/tokens` | All tokens (`count`, `tokens[]`), newest first |
| `getToken(tokenId)` | `/api/token/{token_id}` | One token, for example `"tok_b0749135a397"` |
| `getTokenHolders(tokenId)` | `/api/token/{token_id}/holders` | Addresses with a balance, largest first |
| `getTokenTransfers(tokenId)` | `/api/token/{token_id}/transfers` | Transfers, newest block first |
| `getTokenBalance(tokenId, address)` | `/api/token/{token_id}/balance/{address}` | Balance in base units (string; 1 token = 100,000,000) |
| `getTxToken(txid)` | `/api/tx/{txid}/token` | Whether a transaction is a token deploy or transfer |
| `health()` | `/api/health` | `true` if the API is up |

## getBalance

```js
const bal = await rwc.getBalance("C7...");                       // without txids
const full = await rwc.getBalance("C7...", { includeTxids: true });
```

| Field | Meaning |
|---|---|
| `address` | The address queried |
| `balance`, `received`, `sent` | Amounts in RWC |
| `balanceZat`, `receivedZat`, `sentZat` | Same amounts in zatoshi, the smallest unit (1 RWC = 100,000,000 zatoshi) |
| `txCount` | Number of transactions |
| `txids` | Transaction IDs, only with `includeTxids: true` |

- An address with no history returns `balance: 0`.
- An invalid address rejects with `ReweCoinError` (`status` 404, message `Invalid address`).
- The API returns every transaction ID of the address (about 67 bytes each). The SDK drops `txids` unless you ask for them, but for very active addresses the response is still large (about 71 KB for 1,088 transactions).
- Browsers: the API sends `access-control-allow-origin: *`, so the SDK works from any web page.

## Options and errors

```js
const rwc = new ReweCoin({
  baseUrl: "https://api.rewecoin.com",      // REST API
  explorerUrl: "https://api.rewecoin.com",  // used by getBalance
  timeoutMs: 10000,                         // per request
  fetch: customFetch                        // optional: your own fetch implementation
});
```

Failed requests reject with a `ReweCoinError` that has `message`, `status` and `body`.

Rate limit: 120 requests per 60 seconds per client on the address and richlist routes (see the `RateLimit-*` response headers). Above the limit the API answers `429`; wait and retry.

## Changelog

- **0.3.0** — token methods: `getTokens`, `getToken`, `getTokenHolders`, `getTokenTransfers`, `getTokenBalance`, `getTxToken`.
- **0.2.0** — `getRichList`; every method, `getBalance` included, defaults to `api.rewecoin.com`.
- **0.1.0** — first release: network, blocks, transactions, hashrate, supply, health, `getBalance`.
