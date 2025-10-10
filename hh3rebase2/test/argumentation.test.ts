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

    // let nodes = g[0];
    // let edgesSource = g[1];
    // let edgesTarget = g[2];

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
    const sc = await viem.deployContract("Argumentation");

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

    // Get original graph

    const gRaw = await sc.read.getGraph([1n]);
    const g: Graph<number> = {
      nodes: gRaw[0].map(n => Number(n)),
      edgesSource: gRaw[1].map(n => Number(n)),
      edgesTarget: gRaw[2].map(n => Number(n)),
    };
    printGraph(g);


    // Reduction 1
    await sc.write.pafReductionToAfPr1({ account: alpha.account });
    const r1Raw = await sc.read.getGraph([2n]);
    console.log("--------Reduction 1--------");
    const r1: Graph<number> = {
      nodes: r1Raw[0].map(n => Number(n)),
      edgesSource: r1Raw[1].map(n => Number(n)),
      edgesTarget: r1Raw[2].map(n => Number(n)),
    };
    printGraph(r1);

    // Reduction 3
    await sc.write.pafReductionToAfPr3({ account: alpha.account });
    const r3Raw = await sc.read.getGraph([3n]);
    console.log("--------Reduction 3--------");
    const r3: Graph<number> = {
      nodes: r3Raw[0].map(n => Number(n)),
      edgesSource: r3Raw[1].map(n => Number(n)),
      edgesTarget: r3Raw[2].map(n => Number(n)),
    };
    printGraph(r3);

    // Preferred extensions
    await sc.write.enumeratingPreferredExtensions([3n], { account: alpha.account });
    const r4Raw = await sc.read.getGraph([4n]);
    console.log("--------Preferred Extensions--------");
    const r4: Graph<number> = {
      nodes: r4Raw[0].map(n => Number(n)),
      edgesSource: r4Raw[1].map(n => Number(n)),
      edgesTarget: r4Raw[2].map(n => Number(n)),
    };
    printGraph(r4);

    // Basic assertion
    assert.ok(g.nodes.length > 0, "Graph should have nodes");
    // console.log("Random int [1,10]:", getRandomIntInclusive(1, 10));
    
  });
});
/*
contract('Argumentation 1', (accounts) => {
  const alpha = accounts[0];
  const beta = accounts[1];
  const gamma = accounts[2];

  it('graph 2, related work', async () => {
    const sc = await Argumentation.deployed();

    const resAlpha = await sc.insertArgument('b', {
      from: alpha,
    });
    const resAlphaGasUsed = resAlpha.receipt.gasUsed;
    const resBeta = await sc.insertArgument('c', {
      from: beta,
    });
    const resBetaGasUsed = resBeta.receipt.gasUsed;
    const resGamma = await sc.insertArgument('d', {
      from: gamma,
    });
    const resGammaGasUsed = resGamma.receipt.gasUsed;
    const resAlpha2 = await sc.insertArgument('e', {
      from: alpha,
    });
    const resAlpha2GasUsed = resAlpha2.receipt.gasUsed;
    console.log(
      'insertArgument(): ',
      (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resAlpha2GasUsed) /
        4
    );

    const resBetaSupport = await sc.supportArgument(3, {
      from: beta,
    });
    const resBetaSupportGasUsed = resBetaSupport.receipt.gasUsed;
    const resGammaSupport = await sc.supportArgument(2, {
      from: gamma,
    });
    const resGammaSupportGasUsed = resGammaSupport.receipt.gasUsed;
    console.log(
      'supportArgument(): ',
      (resBetaSupportGasUsed + resGammaSupportGasUsed) / 2
    );

    const edgeBC = await sc.insertAttack(1, 2, '');
    const edgeBCGasUsed = edgeBC.receipt.gasUsed;
    const edgeCD = await sc.insertAttack(2, 3, '');
    const edgeCDGasUsed = edgeCD.receipt.gasUsed;
    const edgeCE = await sc.insertAttack(2, 4, '');
    const edgeCEGasUsed = edgeCE.receipt.gasUsed;
    const edgeDB = await sc.insertAttack(3, 1, '');
    const edgeDBGasUsed = edgeDB.receipt.gasUsed;
    const edgeED = await sc.insertAttack(4, 3, '');
    const edgeEDGasUsed = edgeED.receipt.gasUsed;
    console.log(
      'insertAttack(): ',
      (edgeBCGasUsed +
        edgeCDGasUsed +
        edgeCEGasUsed +
        edgeDBGasUsed +
        edgeEDGasUsed) /
        5
    );

    const g = await sc.getGraph(1);
    printGraph(g);

    const resReduction3 = await sc.pafReductionToAfPr3();
    const r3 = await sc.getGraph(2);
    printGraph(r3);
    const resReduction3GasUsed = resReduction3.receipt.gasUsed;
    console.log('pafReductionToAfPr3(): ', resReduction3GasUsed);

    const r4 = await sc.enumeratingPreferredExtensions(2);
    r4.logs.forEach((element) => {
      console.log('*************************************');
      console.log(element.args.args);
    });
    const r4GasUsed = r4.receipt.gasUsed;
    console.log('enumeratingPreferredExtensions(): ', r4GasUsed);
  });
});

contract('Argumentation 2', (accounts) => {
  const alpha = accounts[0];
  const beta = accounts[1];
  const gamma = accounts[2];

  it('graph 3, new graph', async () => {
    const sc = await Argumentation.deployed();

    const resAlpha = await sc.insertArgument('a', {
      from: alpha,
    });
    const resAlphaGasUsed = resAlpha.receipt.gasUsed;
    const resGamma = await sc.insertArgument('b', {
      from: gamma,
    });
    const resGammaGasUsed = resGamma.receipt.gasUsed;
    const resBeta = await sc.insertArgument('c', {
      from: beta,
    });
    const resBetaGasUsed = resBeta.receipt.gasUsed;
    const resGamma2 = await sc.insertArgument('d', {
      from: gamma,
    });
    const resGamma2GasUsed = resGamma2.receipt.gasUsed;
    console.log(
      'insertArgument(): ',
      (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resGamma2GasUsed) /
        4
    );

    const resBetaSupport = await sc.supportArgument(1, {
      from: beta,
    });
    const resBetaSupportGasUsed = resBetaSupport.receipt.gasUsed;
    const resAlphaSupport = await sc.supportArgument(3, {
      from: alpha,
    });
    const resAlphaSupportGasUsed = resAlphaSupport.receipt.gasUsed;
    console.log(
      'supportArgument(): ',
      (resBetaSupportGasUsed + resAlphaSupportGasUsed) / 2
    );

    const edgeGasUsed = [];
    const edgeAB = await sc.insertAttack(1, 2, '');
    edgeGasUsed.push(edgeAB.receipt.gasUsed);
    const edgeAC = await sc.insertAttack(1, 3, '');
    edgeGasUsed.push(edgeAC.receipt.gasUsed);
    const edgeAD = await sc.insertAttack(1, 4, '');
    edgeGasUsed.push(edgeAD.receipt.gasUsed);

    const edgeBA = await sc.insertAttack(2, 1, '');
    edgeGasUsed.push(edgeBA.receipt.gasUsed);
    const edgeBC = await sc.insertAttack(2, 3, '');
    edgeGasUsed.push(edgeBC.receipt.gasUsed);
    const edgeBD = await sc.insertAttack(2, 4, '');
    edgeGasUsed.push(edgeBD.receipt.gasUsed);

    const edgeCA = await sc.insertAttack(3, 1, '');
    edgeGasUsed.push(edgeCA.receipt.gasUsed);
    const edgeCB = await sc.insertAttack(3, 2, '');
    edgeGasUsed.push(edgeCB.receipt.gasUsed);
    const edgeCD = await sc.insertAttack(3, 4, '');
    edgeGasUsed.push(edgeCD.receipt.gasUsed);

    const edgeDA = await sc.insertAttack(4, 1, '');
    edgeGasUsed.push(edgeDA.receipt.gasUsed);
    const edgeDB = await sc.insertAttack(4, 2, '');
    edgeGasUsed.push(edgeDB.receipt.gasUsed);
    const edgeDC = await sc.insertAttack(4, 3, '');
    edgeGasUsed.push(edgeDC.receipt.gasUsed);

    let avgGasUsed = 0;
    for (const gu of edgeGasUsed) {
      avgGasUsed += gu;
    }
    avgGasUsed /= edgeGasUsed.length;
    console.log('insertAttack(): ', avgGasUsed);

    const g = await sc.getGraph(1);
    printGraph(g);

    const resReduction3 = await sc.pafReductionToAfPr1();
    const r3 = await sc.getGraph(2);
    printGraph(r3);
    const resReduction3GasUsed = resReduction3.receipt.gasUsed;
    console.log('pafReductionToAfPr1(): ', resReduction3GasUsed);

    const r4 = await sc.enumeratingPreferredExtensions(2);
    r4.logs.forEach((element) => {
      console.log('*************************************');
      console.log(element.args.args);
    });
    const r4GasUsed = r4.receipt.gasUsed;
    console.log('enumeratingPreferredExtensions(): ', r4GasUsed);
  });
});

*/