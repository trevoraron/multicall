import { expect } from "chai";
import { Multicall, MulticallWrapper, Multicall__factory, TestContract, TestContract__factory, MulticallWrapper__factory } from "../@types/generated";
import hre from "hardhat";
import { BytesLike } from "ethers";
import { hexDataLength } from "ethers/lib/utils";

const { ethers } = hre;

let abi = [
    "function getVal() public view returns (uint256)",
]
let iface = new ethers.utils.Interface(abi)
let workingAmount1 = 10
let workingAmount2 = 30
let nonWorkingAmount = 20

describe("Multicall", () => {
  let multicall: Multicall;
  let multicallWrapper: MulticallWrapper;
  let testContractWorking1: TestContract;
  let testContractWorking2: TestContract;
  let testContractBroke: TestContract;

  beforeEach(async () => {
    const multicallFactory = (await hre.ethers.getContractFactory(
      "Multicall"
    )) as Multicall__factory;

    const multicallWrapperFactory = (await hre.ethers.getContractFactory(
        "MulticallWrapper"
      )) as MulticallWrapper__factory

    const testContractFactory = (await hre.ethers.getContractFactory(
        "TestContract"
    )) as TestContract__factory;

    multicall = await multicallFactory.deploy();
    multicallWrapper = await multicallWrapperFactory.deploy(multicall.address);
    testContractWorking1 = await testContractFactory.deploy(workingAmount1, false)
    testContractWorking2 = await testContractFactory.deploy(workingAmount2, false)
    testContractBroke = await testContractFactory.deploy(nonWorkingAmount, true)
  });

  it("all working", async () => {
    let calls: { target: string, callData: BytesLike}[] = [
      { target: testContractWorking1.address, callData: iface.encodeFunctionData("getVal") },
      { target: testContractWorking2.address, callData: iface.encodeFunctionData("getVal") }
    ]
    let res = await multicallWrapper.aggregate(calls)
    expect(res.returnData.length).to.eq(2)
    expect(iface.decodeFunctionResult("getVal", res.returnData[0])[0]).to.eq(workingAmount1)
    expect(iface.decodeFunctionResult("getVal", res.returnData[1])[0]).to.eq(workingAmount2)
  });

  it("with reverts", async () => {
    let calls: { target: string, callData: BytesLike}[] = [
        { target: testContractBroke.address, callData: iface.encodeFunctionData("getVal") },
        { target: testContractWorking2.address, callData: iface.encodeFunctionData("getVal") }
    ]
    let res = await multicallWrapper.aggregate(calls)
    expect(res.returnData.length).to.eq(2)
    // First call should revert and return a zero length byte string
    expect(hexDataLength(res.returnData[0])).to.eq(0)
    expect(iface.decodeFunctionResult("getVal", res.returnData[1])[0]).to.eq(workingAmount2)
  });
});