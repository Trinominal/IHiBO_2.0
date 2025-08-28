// We don't have Ethereum specific assertions in Hardhat 3 yet
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("DS_Detachment", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("bla", async function () {
    const DS_Detachment = await viem.deployContract("DS_Detachment");

    

  });

});
