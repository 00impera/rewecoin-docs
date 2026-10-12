# ReweCoin tokens: management operations

ReweCoin tokens are an **overlay**: the node knows only blocks, transactions, addresses and RWC. Token state (balances, supply, flags) is computed by the overlay worker from operations written in the memo of shielded transactions. This page describes the management operations added on top of `deploy_token` and `transfer`.

**Status (2026-10-11):** all operations below are implemented and tested on **testnet**. They are **not yet active on mainnet**. Activation is a fixed block height per network, set in code and never changed after activation.

## How an operation is sent

An operation is a JSON object with an `op` field. It is sent as the memo of a shielded transaction from the sender's shielded address **to the same address**, with a small amount of RWC. The overlay reads it after the block has enough confirmations (6 on mainnet, 1 on testnet). The sender of the operation is the address that sends the transaction.

An operation that fails validation has no effect on token state.

All amounts are strings of digits in base units, without leading zeros. Tokens use exactly 8 decimals, so 1 token is `100000000` units.

## Activation

| Operations | Testnet | Mainnet |
|---|---|---|
| `mint`, `burn` and the new `deploy_token` fields | from block 14450 | not active |
| `freeze`, `unfreeze`, `pause`, `unpause` | from block 14479 | not active |

Before its activation height an operation is rejected, and the new `deploy_token` fields are ignored (the token is created as a fixed-supply token).

## `deploy_token` (new optional fields)

| Field | Type | Meaning |
|---|---|---|
| `mintable` | boolean | The creator can issue more tokens with `mint`. Default `false`. |
| `burnable` | boolean | Holders can destroy their own tokens with `burn`. Default `false`. |
| `max_supply` | string of digits | Required if `mintable` is `true`, and must be at least `total_supply`. Not allowed if `mintable` is `false`. |

The flags are fixed at creation and cannot be changed later. Tokens created without them keep a fixed supply forever.

`total_supply` stays the initial supply. The current supply changes with `mint` and `burn`.

## `mint`

```json
{"op": "mint", "token_id": "tok_xxxxxxxxxxxx", "to": "<shielded address>", "amount": "50000000"}
```

Accepted only if: the sender is the token creator, the token is `mintable`, `to` is a valid address, and the current supply plus `amount` does not exceed `max_supply`. Effect: the supply and the balance of `to` increase by `amount`.

## `burn`

```json
{"op": "burn", "token_id": "tok_xxxxxxxxxxxx", "amount": "20000000"}
```

Accepted only if the token is `burnable` and the sender holds at least `amount`. Effect: the sender's balance and the current supply decrease by `amount`. A burn can be followed by a new `mint` up to `max_supply`.

## `freeze` and `unfreeze`

```json
{"op": "freeze", "token_id": "tok_xxxxxxxxxxxx", "address": "<shielded address>"}
```

Only the token creator can freeze or unfreeze an address for that token. Freezing an already frozen address, or unfreezing an address that is not frozen, is rejected.

## `pause` and `unpause`

```json
{"op": "pause", "token_id": "tok_xxxxxxxxxxxx"}
```

Only the token creator can pause or unpause a token. Pausing a paused token, or unpausing a token that is not paused, is rejected. A pause applies to everyone, including the creator.

## What freeze and pause block

| Action | Frozen address | Paused token |
|---|---|---|
| `transfer` of the token | rejected | rejected |
| `add_liquidity` (either asset of the pool) | rejected if the sender is frozen for either asset | rejected if either asset is paused |
| `swap` | rejected if the sender is frozen for the **input** asset | rejected if either asset is paused |
| `remove_liquidity` | allowed | allowed |
| `mint` | not checked | allowed |
| `burn` | not checked | allowed |

Notes:

- Receiving a frozen token as the output of a swap is allowed.
- `remove_liquidity` is deliberately never blocked, so nobody is locked out of their pool position by a freeze or a pause.
- The native RWC asset is not affected by freeze or pause.
- Freeze and pause are enforced by the overlay. A wallet or service that reads the chain directly, without the overlay, does not see them.
- The token creator is the address that sent the `deploy_token` operation. Ownership cannot be transferred.