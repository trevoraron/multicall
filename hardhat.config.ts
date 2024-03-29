import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "solidity-coverage";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const { ethers } = hre;
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const MNEMONIC = process.env.WALLET_PHRASE ? process.env.WALLET_PHRASE : "";
const INFURA_KEY = process.env.INFURA_KEY ? process.env.INFURA_KEY : "";
const ETHERSCAN = process.env.ETHERSCAN ? process.env.ETHERSCAN : "";
const NETWORK = process.env.NETWORK ? process.env.NETWORK : "";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ropsten: {
      url: `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN,
  },
  typechain: {
    outDir: "@types/generated",
    target: "ethers-v5",
  },
  paths: {
    tests: "./contracts",
  },
};
export default config;
