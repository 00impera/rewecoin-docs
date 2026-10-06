# ReweCoin (RWC) — Documentation

Official public documentation for **ReweCoin (RWC)**, an independent Proof-of-Work blockchain built on the Zcash codebase (zcashd 6.0.0) and mined with Equihash 200,9.

[![Whitepaper](https://img.shields.io/badge/Whitepaper-Read_online-00eaff?style=for-the-badge&labelColor=050A0E)](https://00impera.github.io/rewecoin-docs/whitepaper.html)

## Quick facts

<!-- VERIFY: asymptotic supply. 50 RWC x 840,960 blocks x 2 = 84,096,000, not 84,093,434. -->

| | |
|---|---|
| Ticker | RWC |
| Consensus | Proof-of-Work, Equihash 200,9 |
| Mainnet launch | September 21, 2026 |
| Premine / founders' allocation | None at protocol level (no genesis allocation, no founders' reward). All blocks mined to date by the project team |
| Block time | 75 seconds |
| Initial block reward | 50 RWC |
| Halving interval | 840,960 blocks (~2 years) |
| Asymptotic supply | ~84,093,434 RWC |
| Mainnet address prefix | `C7` |

## Links

[![Website](https://img.shields.io/badge/Website-rewecoin.com-00eaff?style=for-the-badge&labelColor=050A0E)](https://rewecoin.com)
[![Wallet](https://img.shields.io/badge/Wallet-wallet.rewecoin.com-00eaff?style=for-the-badge&labelColor=050A0E)](https://wallet.rewecoin.com)
[![Explorer](https://img.shields.io/badge/Explorer-explorer.rewecoin.com-00eaff?style=for-the-badge&labelColor=050A0E)](https://explorer.rewecoin.com)
[![Testnet](https://img.shields.io/badge/Testnet-testnet.rewecoin.com-00eaff?style=for-the-badge&labelColor=050A0E)](https://testnet.rewecoin.com)
[![Faucet](https://img.shields.io/badge/Faucet-Get_test_coins-00eaff?style=for-the-badge&labelColor=050A0E)](https://wallet.rewecoin.com/receive.html)

[![X](https://img.shields.io/badge/X-@ionelxxx1-00eaff?style=for-the-badge&labelColor=050A0E&logo=x&logoColor=00eaff)](https://x.com/ionelxxx1)
[![Discord](https://img.shields.io/badge/Discord-Join-00eaff?style=for-the-badge&labelColor=050A0E&logo=discord&logoColor=00eaff)](https://discord.gg/pVDyKAqeF)
[![Telegram](https://img.shields.io/badge/Telegram-ReweCoin_bot-00eaff?style=for-the-badge&labelColor=050A0E&logo=telegram&logoColor=00eaff)](https://t.me/ReweCoin_bot)
[![GitHub](https://img.shields.io/badge/GitHub-00impera-00eaff?style=for-the-badge&labelColor=050A0E&logo=github&logoColor=00eaff)](https://github.com/00impera)

## Mining

Pool: **Equihash (200,9) · Zcash-style PoW · PPLNS · payouts to transparent addresses**

### Connection details

<!-- VERIFY: replace the IP with a domain (e.g. pool.rewecoin.com) so miners don't have to reconfigure if the server changes. -->

| Setting | Value |
|---|---|
| Stratum host | `178.104.208.90` |
| Stratum port | `3092` (variable difficulty) |
| Algorithm | Equihash `200,9` |
| Personalization | `ZcashPoW` |
| Username | `YOUR_RWC_ADDRESS.workername` |
| Password | `x` |
| SSL | Not available |

### New to mining? Start here

You do **not** need to register on the pool. No email, no password, no account. Your RWC address is your account.

**1. Create your wallet**

1. Open <https://wallet.rewecoin.com/> and create a new wallet.
2. **Write the recovery phrase on paper.** Never type it anywhere else and never share it. Anyone who has it can take your coins. If you lose it, nobody can recover your coins.
3. Copy your **transparent** receive address. It starts with `C7`.

<!-- VERIFY: confirm the wallet shows a transparent C7 address by default. If not, add the exact steps here. -->

Alternatively, if you run your own node: `rewecoin-cli getnewaddress`.
Before you mine, check that your address starts with `C7`.

**2. Connect your miner**

Use your address as the username. The part after the dot is just a name for your rig, so you can see each machine separately.

miniZ:

```bash
miniZ --url=C7YourAddressHere.rig1@178.104.208.90:3092 --pass=x --par=200,9 --pers=ZcashPoW
```

If your miniZ version rejects `--pers`, run it without that flag.

nheqminer (CPU):

```bash
nheqminer -l 178.104.208.90:3092 -u C7YourAddressHere.rig1
```

Any other Equihash 200,9 miner with personalization `ZcashPoW` works with the same host, port, username and password. Replace `C7YourAddressHere` with your own address. A typo sends your earnings to the wrong place and they cannot be recovered.

**3. Get paid**

- The pool counts the shares your miner submits under your address.
- When your balance reaches **0.01 RWC**, the pool sends it straight to your address. Nothing to claim.
- Using several machines? Give each a different worker name (`.rig1`, `.rig2`, ...) with the **same address**.
- Mine to a wallet you control, not to an exchange address, unless you are sure it is a transparent RWC address.

### Payouts

| | |
|---|---|
| Scheme | PPLNS |
| Pool fee | _X %_ <!-- fill in --> |
| Minimum payout | 0.01 RWC |
| Payout type | Transparent address |
| Block maturity | _N confirmations_ <!-- fill in --> |
| Payout frequency | _every X minutes/hours_ <!-- fill in --> |

Payouts are sent in cycles. On a young chain with few blocks, a payout can wait until the pool's change funds have enough confirmations, so a delay does not mean your balance is lost.

### Check your payments

1. Open the [block explorer](https://explorer.rewecoin.com/?net=mainnet#/).
2. Paste your address in the search box.
3. Incoming payouts appear as transactions to your address.

### Troubleshooting

| Problem | What to do |
|---|---|
| Cannot connect | Check host and port `3092`, and that your firewall allows outgoing TCP |
| Shares rejected | Confirm `--par=200,9` and personalization `ZcashPoW` |
| Unauthorized worker | The address must be a valid transparent RWC address starting with `C7` |
| No payout yet | You need at least 0.01 RWC, and the pool may be waiting on confirmations |

Still stuck? Ask on [Discord](https://discord.gg/pVDyKAqeF).

## Repository contents

| Path | Description |
|---|---|
| `whitepaper.html` | Whitepaper (current draft, v0.2) |
| `index.md` | Documentation home page |
| `tokenomics/` | Supply and emission details |
| `assets/` | Images and static files |
| `_config.yml` | GitHub Pages / Jekyll configuration |

## Status

This documentation is a draft. Sections marked **TBD** in the whitepaper (motivation, utility) are intentionally left open and contain no invented figures. The whitepaper is revised as the project reaches each roadmap milestone.

## Contributing

Corrections and suggestions are welcome: open an issue or a pull request against this repository. Please cite a source (node output, consensus code, explorer link) for any factual change.

## Disclaimer

This documentation does not constitute financial advice. RWC is an early-stage network and should not be treated as an investment absent a clear, separately documented utility case.

---

<div align="center">

<a href="https://rewecoin.com"><img src="assets/logo.png" alt="ReweCoin" width="72"></a>

**ReweCoin Token — mine it. hold it. own it.**

</div>
