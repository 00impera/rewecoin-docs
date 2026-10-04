# ReweCoin (RWC) — Whitepaper

*Version 0.1 — Draft, September 2026*

> **Note on this draft:** This whitepaper is built entirely on parameters verified directly from the ReweCoin mainnet node and its consensus source code. Sections marked **TBD** are intentionally left open for the project team to finalize — they are not filled with invented figures.

---

## 1. What is ReweCoin?

ReweCoin (ticker: **RWC**) is an independent, standalone Proof-of-Work blockchain built on the Zcash codebase (zcashd 6.0.0). It launched its own mainnet on **September 21, 2026**, with no protocol-level premine, no founders' reward in the consensus rules and no genesis allocation. All blocks mined to date (height 2388, October 4, 2026) were mined by the project team; public mining is not yet open.

ReweCoin inherits Zcash's transaction model (transparent and shielded pools, UTXO-based ledger) and its Equihash Proof-of-Work consensus, while operating as a fully separate chain with its own genesis block, its own emission schedule, and its own network parameters.

## 2. Why does it exist?

**TBD** — this section should state the project's actual motivation in the founder's own words: what gap ReweCoin is meant to fill, what makes it different from simply using Zcash or another existing chain, and what long-term problem it aims to solve. A whitepaper's credibility rests heavily on this section being specific and honest rather than generic.

## 3. How does it work?

### 3.1 Consensus

ReweCoin uses **Proof-of-Work** with the **Equihash** algorithm — the same memory-hard, ASIC-resistant algorithm used by Zcash, designed to keep mining accessible to consumer GPU hardware rather than concentrating it in specialized mining hardware.

- **Target block time:** 75 seconds
- **Difficulty adjustment:** dynamic, per-block (inherited from zcashd)

### 3.2 Transaction model

ReweCoin supports both transparent (visible, auditable) and shielded transaction pools, inherited from the Zcash architecture (Sapling/Orchard shielded pools are present in the protocol, though usage patterns to date have been primarily transparent).

### 3.3 Network infrastructure (live today)

| Component | Status | URL |
|---|---|---|
| Mainnet node | Live | — |
| Testnet | Live | — |
| Block explorer | Live | https://explorer.rewecoin.com |
| Web wallet | Live | https://wallet.rewecoin.com |
| Faucet (testnet/early mainnet) | Live | via wallet |
| Mining | Live | Equihash, standard zcashd-compatible miners |

## 4. What utility does it have?

**TBD** — as of this draft, ReweCoin functions as base-layer infrastructure (send, receive, mine, explore) with no additional utility layer yet. Honest framing for this draft: *"Without additional utility, RWC is currently infrastructure, not a product."* Planned utility directions under consideration:

- Payment rail for goods/services
- Membership / access-gating token
- Marketplace settlement currency
- Staking or reward mechanisms (would require protocol-level design work, as the current chain is pure PoW)

Each of these should only be listed in a final whitepaper once there is a concrete implementation plan — vague utility promises are a common credibility problem in new token launches.

## 5. Supply and emission

Full detail: see [`tokenomics/supply-and-emission.md`](./tokenomics/supply-and-emission.md). Summary:

- **Initial block reward:** 50 RWC
- **Halving interval:** 840,960 blocks (~2 years at target block time)
- **Premine:** None at protocol level (no genesis allocation, no founders' reward). All blocks mined to date by the project team; public mining not yet open
- **Theoretical asymptotic total supply:** ~84,093,434 RWC
- **Technical overflow cap:** 100,000,000 RWC (not the real target — see tokenomics doc)

## 6. Roadmap

**TBD** — the items below are carried over from internal planning notes and should be confirmed/reordered by the team before publishing:

- [x] Mainnet + testnet live
- [x] Block explorer (search, transactions, addresses, blocks)
- [x] Web wallet (send/receive/transactions/mining status)
- [x] Faucet
- [ ] Public whitepaper (this document)
- [ ] Landing page (rewecoin.com)
- [ ] Community channels (Telegram, Discord, X) <img src="assets/icons/telegram.svg" alt="Telegram" width="28" height="28" style="vertical-align:middle"> <img src="assets/icons/discord.svg" alt="Discord" width="28" height="28" style="vertical-align:middle"> <img src="assets/icons/x.svg" alt="X" width="28" height="28" style="vertical-align:middle"> <img src="assets/icons/privacy.svg" alt="Privacy" width="28" height="28" style="vertical-align:middle">
- [ ] End-to-end public test: faucet → wallet A → send → wallet B → explorer confirmation
- [ ] Defined utility layer (see Section 4)
- [ ] Exchange listing / swap mechanism — **note:** this may carry regulatory implications (money transmission / KYC-AML) depending on jurisdiction and structure; recommend legal review before implementation, not just engineering.
- [ ] Mining pool (pool.rewecoin.com)
- [ ] Mobile app or PWA

## 7. Risks and disclaimers

- ReweCoin is an early-stage network. At the time of this draft, mainnet difficulty is at its floor value and the network has a minimal number of connected peers — normal for a newly launched chain, but it means real-world block timing and security assumptions will shift as the network grows.
- Emission timeline projections in Section 5 assume the network sustains its target block time; actual timelines will vary with real hashrate.
- This document does not constitute financial advice, and RWC should not be treated as an investment absent a clear, separately-documented utility case.

---

*This whitepaper will be revised as the project reaches each roadmap milestone. Suggestions and corrections should be filed as issues/PRs against this repository.*
