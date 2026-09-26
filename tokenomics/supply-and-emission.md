# ReweCoin — Supply & Emission

All figures on this page were verified directly against the running mainnet node (`rewecoin-cli`) and the consensus source code (`chainparams.cpp`, `consensus/params.h`) as of **September 26, 2026**, at mainnet block height 945. None of these numbers are estimates or marketing claims.

## Consensus

| Parameter | Value |
|---|---|
| Consensus mechanism | Proof-of-Work |
| Mining algorithm | Equihash |
| Codebase | zcashd 6.0.0 fork |
| Target block time | 75 seconds |
| Current network difficulty | 1 (early-stage network) |

## Emission

| Parameter | Value |
|---|---|
| Initial block reward | 50 RWC / block |
| Halving interval | 840,960 blocks (~2 years at target block time) |
| Premine | **None** — 0 RWC to founders, 0 to funding streams, verified at every checked height |
| Founders' reward | 0 RWC (disabled) |
| Technical safety cap (`MAX_MONEY`) | 100,000,000 RWC *(overflow guard, not the real emission target — see below)* |
| Theoretical asymptotic total supply | **~84,093,434 RWC** |

The 100,000,000 RWC `MAX_MONEY` constant is a consensus-layer overflow safeguard inherited from the zcashd codebase, not a target. The actual total supply, as the halving curve approaches zero reward, converges to approximately 84.09 million RWC — it will never be fully reached, only approached asymptotically, exactly like Bitcoin's 21M figure is a limit, not a hard stop.

## Verified on-chain proof of fair launch

At block 945, the chain holds exactly:

945 blocks × 50 RWC = 47,250 RWC

This matches the node's own reported `chainValue` (47,250 RWC) exactly — confirming that **100% of circulating supply has come from public mining**, with no hidden pre-mine or off-schedule issuance.

## Emission schedule (projected, theoretical)

Real dates assume the network sustains its 75-second target block time continuously, which depends on total network hashrate. Early-stage networks with low hashrate commonly see slower real block times than target. Treat the "year" column as a ceiling estimate, not a guarantee.

| Era | Block range | Reward (RWC/block) | Cumulative supply | Approx. year mark |
|---|---|---|---|---|
| 1 | 0 – 840,960 | 50 | 42,048,000 | Year 2 |
| 2 | 840,960 – 1,681,920 | 25 | 63,072,000 | Year 4 |
| 3 | 1,681,920 – 2,522,880 | 12.5 | 73,284,000 | Year 6 |
| 4 | 2,522,880 – 3,363, 840 | 6.25 | 78,840,000 | Year 8 |
| 5 | 3,363, 840 – 4,204,800 | 3.125 | 81,468,000 | Year 10 |
| 6 | 4,204,800 – 5,045,760 | 1.5625 | 82,782,000 | Year 12 |
| 7+| ... | ... | asymptotic → ~84,093,434 | Year 14+ |

## Genesis

| Parameter | Value |
|---|---|
| Genesis timestamp (UTC) | 2026-09-21 09:44:27 |
| Estimated first halving (at target block time) | ~2028-09-20 |

## Sources

- `getblockchaininfo`, `getmininginfo`, `getblocksubsidy` (RPC, mainnet node)
- `src/chainparams.cpp`, `src/consensus/params.h`, `src/amount.h` (source code constants)
