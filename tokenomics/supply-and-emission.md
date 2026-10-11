# ReweCoin — Supply & Emission

All figures on this page were verified directly against the running mainnet node (`rewecoin-cli`) and the consensus source code (`chainparams.cpp`, `consensus/params.h`) as of **October 11, 2026**, at mainnet block height 4118. None of these numbers are estimates or marketing claims.

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
| Premine | **None at protocol level** — no genesis allocation, 0 RWC founders' reward, 0 to funding streams. All blocks mined to date were mined by the project team (team statement, not verifiable on-chain). The pool is open to external miners |
| Founders' reward | 0 RWC (disabled) |
| Technical safety cap (`MAX_MONEY`) | 100,000,000 RWC *(overflow guard, not the real emission target — see below)* |
| Theoretical asymptotic total supply | **~84,095,900 RWC** |

The 100,000,000 RWC `MAX_MONEY` constant is a consensus-layer overflow safeguard inherited from the zcashd codebase, not a target. The actual total supply, as the halving curve approaches zero reward, converges to approximately 84.1 million RWC — it will never be fully reached, only approached asymptotically, exactly like Bitcoin's 21M figure is a limit, not a hard stop.

## On-chain supply verification

At block 4118, the chain holds exactly:

4118 blocks × 50 RWC = 205,900 RWC

This matches the node's own reported `chainValue` (205,900 RWC) exactly: no off-schedule issuance. It does not show who mined the blocks. **All blocks mined to date were mined by the project team, including GPU test mining (team statement; the chain does not record who controls an address). The pool is open to external miners.**

## Current status (October 11, 2026)

- No protocol-level premine
- No founders' reward in the consensus rules
- No genesis allocation
- All blocks mined to date by the project team (team statement)
- Pool open to external miners

## Emission schedule (projected, theoretical)

Real dates assume the network sustains its 75-second target block time continuously, which depends on total network hashrate. Early-stage networks with low hashrate commonly see slower real block times than target. Treat the "year" column as a ceiling estimate, not a guarantee.

| Era | Block range | Reward (RWC/block) | Cumulative supply | Approx. year mark |
|---|---|---|---|---|
| 1 | 1 – 840,958 | 50 | 42,047,900 | Year 2 |
| 2 | 840,959 – 1,681,918 | 25 | 63,071,900 | Year 4 |
| 3 | 1,681,919 – 2,522,878 | 12.5 | 73,583,900 | Year 6 |
| 4 | 2,522,879 – 3,363,838 | 6.25 | 78,839,900 | Year 8 |
| 5 | 3,363,839 – 4,204,798 | 3.125 | 81,467,900 | Year 10 |
| 6 | 4,204,799 – 5,045,758 | 1.5625 | 82,781,900 | Year 12 |
| 7+| ... | ... | asymptotic → ~84,095,900 | Year 14+ |

## Genesis

| Parameter | Value |
|---|---|
| Genesis timestamp (UTC) | 2026-09-21 09:44:27 |
| Estimated first halving (at target block time) | ~2028-09-20 |

## Sources

- `getblockchaininfo`, `getmininginfo`, `getblocksubsidy` (RPC, mainnet node)
- `src/chainparams.cpp`, `src/consensus/params.h`, `src/amount.h` (source code constants)
