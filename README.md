# Multicall

Multicall aggregates results from multiple contract constant function calls.

This reduces the number of separate JSON RPC requests that need to be sent
(especially useful if using remote nodes like Infura), while also providing the
guarantee that all values returned are from the same block (like an atomic read)
and returning the block number the values are from (giving them important
context so that results from old blocks can be ignored if they're from an
out-of-date node).

This is a fork of the original hosted here
(https://github.com/makerdao/multicall) it supports contract reverts -- if one
contract reverts we still get the results of other calls

This fork also refactors the original Multicall code to use HardHat instead of
DappHub tools

# Contracts

ropsten:
https://ropsten.etherscan.io/address/0x1DFE03fab8D4746bcCB81d38BdD5813c06146e46#code

## Setup

Requirements:

- Node >= v12
- Yarn

```
$ npm i -g yarn       # Install yarn if you don't already have it
$ yarn install        # Install dependencies
$ yarn setup          # Setup Git hooks
```

## Linting and Formatting

To check code for problems:

```
$ yarn typecheck      # Type-check TypeScript code
$ yarn lint           # Check JavaScript and TypeScript code
$ yarn lint --fix     # Fix problems where possible
$ yarn solhint        # Check Solidity code
```

To auto-format code:

```
$ yarn fmt
```

## TypeScript type definition files for the contracts

To generate type definitions:

```
$ yarn compile && yarn typechain
```

## Testing

First, make sure Ganache is running.

```
$ yarn ganache
```

Run all tests:

```
$ yarn test
```

To run tests in a specific file, run:

```
$ yarn test [path/to/file]
```

To run tests and generate test coverage, run:

```
$ yarn coverage
```
