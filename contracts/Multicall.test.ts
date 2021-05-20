import { expect } from "chai";
import {
  Multicall,
  Multicall__factory,
  TestContract,
  TestContract__factory,
} from "../@types/generated";
import hre from "hardhat";
import { BytesLike } from "ethers";
import { hexDataLength } from "ethers/lib/utils";

const { ethers } = hre;

const abi = ["function getVal() public view returns (uint256)"];
const iface = new ethers.utils.Interface(abi);
const workingAmount1 = 10;
const workingAmount2 = 30;
const nonWorkingAmount = 20;

describe("Multicall", () => {
  let multicall: Multicall;
  let testContractWorking1: TestContract;
  let testContractWorking2: TestContract;
  let testContractBroke: TestContract;

  beforeEach(async () => {
    const multicallFactory = (await hre.ethers.getContractFactory(
      "Multicall"
    )) as Multicall__factory;

    const testContractFactory = (await hre.ethers.getContractFactory(
      "TestContract"
    )) as TestContract__factory;

    multicall = await multicallFactory.deploy();
    testContractWorking1 = await testContractFactory.deploy(
      workingAmount1,
      false
    );
    testContractWorking2 = await testContractFactory.deploy(
      workingAmount2,
      false
    );
    testContractBroke = await testContractFactory.deploy(
      nonWorkingAmount,
      true
    );
  });

  it("all working", async () => {
    const calls: { target: string; callData: BytesLike }[] = [
      {
        target: testContractWorking1.address,
        callData: iface.encodeFunctionData("getVal"),
      },
      {
        target: testContractWorking2.address,
        callData: iface.encodeFunctionData("getVal"),
      },
    ];
    const res = await multicall.aggregate(calls, 60000);
    expect(res.returnData.length).to.eq(2);
    expect(iface.decodeFunctionResult("getVal", res.returnData[0])[0]).to.eq(
      workingAmount1
    );
    expect(iface.decodeFunctionResult("getVal", res.returnData[1])[0]).to.eq(
      workingAmount2
    );
  });

  it("with reverts", async () => {
    const calls: { target: string; callData: BytesLike }[] = [
      {
        target: testContractBroke.address,
        callData: iface.encodeFunctionData("getVal"),
      },
      {
        target: testContractWorking2.address,
        callData: iface.encodeFunctionData("getVal"),
      },
    ];
    const res = await multicall.aggregate(calls, 60000);
    expect(res.returnData.length).to.eq(2);
    // First call should revert and return a zero length byte string
    expect(hexDataLength(res.returnData[0])).to.eq(0);
    expect(iface.decodeFunctionResult("getVal", res.returnData[1])[0]).to.eq(
      workingAmount2
    );
  });
});
