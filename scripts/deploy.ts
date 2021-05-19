import { Multicall__factory } from "../@types/generated";
import hre from "hardhat";

async function main() {
  const myTokenFactory = (await hre.ethers.getContractFactory(
    "Multicall"
  )) as Multicall__factory;

  const multicall = await myTokenFactory.deploy();

  await multicall.deployed();

  console.log("Multicall deployed at:", multicall.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
