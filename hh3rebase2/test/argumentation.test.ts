// import { describe, it } from 'node:test';
// import assert from 'node:assert';

// describe('Argumentation', () => {
//   it('should deploy and interact', async () => {
//     const hre = await import('hardhat');
//     const { ethers } = hre;

//     const Argumentation = await ethers.getContractFactory('Argumentation');
//     const sc = await Argumentation.deploy();
//     await sc.deployed();

//     const [alpha] = await ethers.getSigners();
//     await sc.connect(alpha).insertArgument('a');

//     const g = await sc.getGraph(1);
//     console.log('Graph:', g);i

//     assert.ok(g.nodes.length > 0, 'Graph should have nodes');
//   });
// });


// import { test } from 'node:test';
// import assert from 'node:assert';
// import { getContractAt, getWalletClients, getPublicClient } from 'hardhat';

// test('Argumentation: graph 1, IHiBO original', async () => {
//   const publicClient = getPublicClient();
//   const [alpha, beta, gamma] = await getWalletClients();

//   const sc = await getContractAt('Argumentation', await scAddress(), {
//     client: alpha,
//   });

//   await sc.write.insertArgument(['a']);
//   await sc.write.insertArgument(['b'], { account: beta.account });
//   await sc.write.insertArgument(['c'], { account: gamma.account });

//   await sc.write.supportArgument([3], { account: beta.account });
//   await sc.write.supportArgument([2], { account: gamma.account });

//   await sc.write.insertAttack([1, 2, '']);
//   await sc.write.insertAttack([2, 1, '']);
//   await sc.write.insertAttack([1, 3, '']);
//   await sc.write.insertAttack([3, 1, '']);

//   const g = await sc.read.getGraph([1]);
//   console.log('Graph:', g);

//   await sc.write.pafReductionToAfPr1();
//   const r1 = await sc.read.getGraph([2]);
//   console.log('Reduction 1:', r1);

//   await sc.write.pafReductionToAfPr3();
//   const r3 = await sc.read.getGraph([3]);
//   console.log('Reduction 3:', r3);

//   const r4 = await sc.read.enumeratingPreferredExtensions([3]);
//   console.log('Preferred Extensions:', r4);

//   assert.ok(g.nodes.length > 0, 'Graph should have nodes');
// });

// // Helper to get deployed contract address
// async function scAddress(): Promise<`0x${string}`> {
//   const deployments = await import('../deployments/localhost/Argumentation.json');
//   return deployments.address as `0x${string}`;
// }

// import assert from "node:assert/strict";
// import { describe, it } from "node:test";
// import { network } from "hardhat";

// describe("Argumentation", async function () {
//   const { viem } = await network.connect();
//   const publicClient = await viem.getPublicClient();

//   it("should deploy and run IHiBO original graph test", async () => {
//     const sc = await viem.deployContract("Argumentation");

//     // Insert arguments
//     await sc.write.insertArgument(["a"]);
//     await sc.write.insertArgument(["b"]);
//     await sc.write.insertArgument(["c"]);

//     // Support arguments
//     await sc.write.supportArgument(3);
//     await sc.write.supportArgument(2);

//     // Insert attacks
//     await sc.write.insertAttack([1, 2, ""]);
//     await sc.write.insertAttack([2, 1, ""]);
//     await sc.write.insertAttack([1, 3, ""]);
//     await sc.write.insertAttack([3, 1, ""]);

//     // Get original graph
//     const g = await sc.read.getGraph([1]);
//     console.log("--------Graph--------");
//     for (const node of g.nodes) {
//       console.log("Node:", node.toString());
//     }
//     for (let i = 0; i < g.edgesSource.length; i++) {
//       console.log(
//         g.edgesSource[i].toString(),
//         " -> ",
//         g.edgesTarget[i].toString()
//       );
//     }

//     // Reduction 1
//     await sc.write.pafReductionToAfPr1();
//     const r1 = await sc.read.getGraph([2]);
//     console.log("--------Reduction 1--------");
//     for (const node of r1.nodes) {
//       console.log("Node:", node.toString());
//     }

//     // Reduction 3
//     await sc.write.pafReductionToAfPr3();
//     const r3 = await sc.read.getGraph([3]);
//     console.log("--------Reduction 3--------");
//     for (const node of r3.nodes) {
//       console.log("Node:", node.toString());
//     }

//     // Preferred extensions
//     const r4 = await sc.read.enumeratingPreferredExtensions([3]);
//     console.log("--------Preferred Extensions--------");
//     console.log(r4);

//     // Basic assertion
//     assert.ok(g.nodes.length > 0, "Graph should have nodes");
//   });
// });

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

// Define a minimal Graph shape. You can refine it to your actual types.
export interface Graph<N = unknown> {
  nodes: N[];
  edgesSource: N[];
  edgesTarget: N[];
}

/**
 * Prints a graph to the console.
 * Uses String(x) instead of x.toString() so it works for any N (number, object, etc.)
 */
export function printGraph<N>(g: Graph<N>): void {
  console.log("--------Graph--------");

  for (const node of g.nodes) {
    console.log("Node:", String(node));
  }

  const len = Math.min(g.edgesSource.length, g.edgesTarget.length);
  for (let i = 0; i < len; i++) {
    console.log(String(g.edgesSource[i]), " -> ", String(g.edgesTarget[i]));
  }
}

/**
 * Returns a random integer in the inclusive range [min, max].
 * Swaps if min > max to be robust.
 */
export function getRandomIntInclusive(min: number, max: number): number {
  let lo = Math.ceil(min);
  let hi = Math.floor(max);
  if (hi < lo) {
    const tmp = lo; lo = hi; hi = tmp;
  }
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}


describe("Argumentation", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [alpha, beta, gamma] = await viem.getWalletClients();

  it("should deploy and run IHiBO original graph test", async () => {
    const sc = await viem.deployContract("Argumentation"//, {
      // client: alpha,
    // }
  );

    // Insert arguments
    await sc.write.insertArgument(["a"], { account: alpha.account });
    await sc.write.insertArgument(["b"], { account: beta.account });
    await sc.write.insertArgument(["c"], { account: gamma.account });

    // Support arguments
    await sc.write.supportArgument([3n], { account: beta.account });
    await sc.write.supportArgument([2n], { account: gamma.account });

    // Insert attacks
    await sc.write.insertAttack([1n, 2n, ""], { account: alpha.account });
    await sc.write.insertAttack([2n, 1n, ""], { account: beta.account });
    await sc.write.insertAttack([1n, 3n, ""], { account: alpha.account });
    await sc.write.insertAttack([3n, 1n, ""], { account: gamma.account });

    
    // debugging 
    const g = await sc.read.getGraph([1n]);
    console.log("Raw graph output:", g);
    if (Array.isArray(g.nodes)) {
      for (const node of g.nodes) {
        console.log("Node:", node.toString());
      }
    } else {
      console.log("Unexpected graph format:", g);
    }

    console.log("--------Graph--------");
    // if (Array.isArray(g.nodes)) {
    for (const node of g) {
      console.log("Node:", node.toString());
    }
    // }
    if (Array.isArray(g.edgesSource) && Array.isArray(g.edgesTarget)) {
      console.log("Edges:");
      for (let i = 0; i < g.edgesSource.length; i++) {
        console.log(g.edgesSource[i].toString(), " -> ", g.edgesTarget[i].toString());
      }
    }
    console.log("--------End of Graph--------");

    // 000000000000000000
  //  // debugging 
  //   const g = await sc.read.getGraph([1n]);
  //   console.log("Raw graph output:", g);
  //   if (Array.isArray(g.nodes)) {
  //     for (const node of g.nodes) {
  //       console.log("Node:", node.toString());
  //     }
  //   } else {
  //     console.log("Unexpected graph format:", g);
  //   }

  //   console.log("--------Graph--------");
  //   // if (Array.isArray(g.nodes)) {
  //   for (const node of g) {
  //     console.log("Node:", node.toString());
  //   }

  //   let i = 0; 
  //   let name = ["nodes", "edgesSource", "edgesTarget"];
  //   for (const node of g) {
  //     console.log(name[i] + ":", node.toString());
  //     i++;
  //   }
  //   const nodes = g.nodes;
  //   const edgesSource = g.edgesSource;
  //   const edgesTarget = g.edgesTarget;
  //   console.log("Nodes array:", nodes);
  //   console.log("Edges Source array:", edgesSource);
  //   console.log("Edges Target array:", edgesTarget);

  //   for (let i = 0; i < g.length; i++) {
  //     console.log("Node:", g[i].toString());
  //   }
  //   if (Array.isArray(g.edgesSource) && Array.isArray(g.edgesTarget)) {
  //     console.log("Edges:");
  //     for (let i = 0; i < g.edgesSource.length; i++) {
  //       console.log(g.edgesSource[i].toString(), " -> ", g.edgesTarget[i].toString());
  //     }
  //   }
  //   console.log("--------End of Graph--------");

  //   // 000000000000000000

    /*
    // Get original graph
    const g = await sc.read.getGraph([1]);
    console.log("--------Graph--------");
    for (const node of g.nodes) {
      console.log("Node:", node.toString());
    }
    for (let i = 0; i < g.edgesSource.length; i++) {
      console.log(
        g.edgesSource[i].toString(),
        " -> ",
        g.edgesTarget[i].toString()
      );
    }

    // Reduction 1
    await sc.write.pafReductionToAfPr1({ account: alpha.account });
    const r1 = await sc.read.getGraph([2]);
    console.log("--------Reduction 1--------");
    for (const node of r1.nodes) {
      console.log("Node:", node.toString());
    }

    // Reduction 3
    await sc.write.pafReductionToAfPr3({ account: alpha.account });
    const r3 = await sc.read.getGraph([3]);
    console.log("--------Reduction 3--------");
    for (const node of r3.nodes) {
      console.log("Node:", node.toString());
    }

    // Preferred extensions
    const r4 = await sc.read.enumeratingPreferredExtensions([3]);
    console.log("--------Preferred Extensions--------");
    console.log(r4);

    // Basic assertion
    assert.ok(g.nodes.length > 0, "Graph should have nodes");
    */
  });
});




// import assert from "node:assert/strict";
// import { describe, it } from "node:test";

// import { network } from "hardhat";

// describe("Argumentation", async function () {
//   const { viem } = await network.connect();
//   const publicClient = await viem.getPublicClient();

//   it("", async function () {
//     const counter = await viem.deployContract("Counter");

//     await viem.assertions.emitWithArgs(
//       counter.write.inc(),
//       counter,
//       "Increment",
//       [1n],
//     );
//   });

//   it("The sum of the Increment events should match the current value", async function () {
//     const counter = await viem.deployContract("Counter");
//     const deploymentBlockNumber = await publicClient.getBlockNumber();

//     // run a series of increments
//     for (let i = 1n; i <= 10n; i++) {
//       await counter.write.incBy([i]);
//     }

//     const events = await publicClient.getContractEvents({
//       address: counter.address,
//       abi: counter.abi,
//       eventName: "Increment",
//       fromBlock: deploymentBlockNumber,
//       strict: true,
//     });

//     // check that the aggregated events match the current value
//     let total = 0n;
//     for (const event of events) {
//       total += event.args.by;
//     }

//     assert.equal(total, await counter.read.x());
//   });
// });
