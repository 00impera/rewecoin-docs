# ReweCoin (RWC) — Documentation

Official public documentation for **ReweCoin (RWC)**, an independent, fair-launch Proof-of-Work blockchain built on the Zcash codebase (zcashd 6.0.0) and mined with Equihash 200,9.

**Whitepaper:** https://00impera.github.io/rewecoin-docs/whitepaper.html

## Quick facts

| | |
|---|---|
| Ticker | RWC |
| Consensus | Proof-of-Work, Equihash 200,9 |
| Mainnet launch | September 21, 2026 |
| Premine / founders' allocation | None |
| Block time | 75 seconds |
| Initial block reward | 50 RWC |
| Halving interval | 840,960 blocks (~2 years) |
| Asymptotic supply | ~84,093,434 RWC |
| Mainnet address prefix | `C7` |

## Links

- Website: https://rewecoin.com
- Wallet: https://wallet.rewecoin.com
- Explorer: https://explorer.rewecoin.com
- Testnet: https://testnet.rewecoin.com
- Faucet: https://wallet.rewecoin.com/receive.html
- X: https://x.com/ionelxxx1
- Discord: https://discord.gg/pVDyKAqeF
- Telegram: https://t.me/ReweCoin_bot
- GitHub: https://github.com/00impera

## Mining

Any Equihash 200,9 compatible miner works (for example CPU miners such as nheqminer):

```
nheqminer -l HOST:PORT -u YOUR_C7_ADDRESS.worker1
```

A stratum mining pool is **in testing** and not public yet. Planned work: variable difficulty (vardiff), PPLNS payouts, TLS. Progress is tracked in the roadmap section of the whitepaper.

## Repository contents

| Path | Description |
|---|---|
| `whitepaper.html` | Whitepaper (current draft, v0.2) |
| `index.md` | Documentation home page |
| `tokenomics/` | Supply and emission details |
| `assets/` | Images and static files |
| `_config.yml` | GitHub Pages / Jekyll configuration |

## Status

This documentation is a **draft**. Sections marked **TBD** in the whitepaper (motivation, utility) are intentionally left open and contain no invented figures. The whitepaper is revised as the project reaches each roadmap milestone.

## Contributing

Corrections and suggestions are welcome: open an issue or a pull request against this repository. Please cite a source (node output, consensus code, explorer link) for any factual change.

## Disclaimer

This documentation does not constitute financial advice. RWC is an early-stage network and should not be treated as an investment absent a clear, separately documented utility case.
