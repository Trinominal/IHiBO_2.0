import { ethers } from "hardhat";
import { expect } from "chai";

describe("MyContract", function () {
  it("should deploy", async () => {
    const MyContract = await ethers.getContractFactory("MyContract");
    const contract = await MyContract.deploy();
    await contract.deployed();
    expect(contract.address).to.properAddress;
  });
});



// const MyContract = artifacts.require("MyContract");

// contract("MyContract", accounts => {
//   it("should deploy", async () => {
//     const instance = await MyContract.deployed();
//     assert(instance.address !== '');
//   });
// });
