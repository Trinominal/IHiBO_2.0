import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import fs from 'fs';

// Filepath for storing the result
const filepath = './data.csv';

// Function to print the graph
const printGraph = (g: { nodes: any[], edgesSource: any[], edgesTarget: any[] }) => {
  console.log('--------Graph--------');
  for (const node of g.nodes) {
    console.log('Node:', node.toString());
  }

  for (let i = 0; i < g.edgesSource.length; i++) {
    console.log(
      g.edgesSource[i].toString(),
      ' -> ',
      g.edgesTarget[i].toString()
    );
  }
};


// Function to generate a random integer between min and max (inclusive)
const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};


describe('Argumentation 0', function () {
  let Argumentation: Contract;
  let alpha: string;
  let beta: string;
  let gamma: string;

  beforeEach(async function () {
    // Deploy the contract before each test
    Argumentation = await ethers.getContractFactory("Argumentation");
    const deployed = await Argumentation.deploy();
    await deployed.deployed();

    [alpha, beta, gamma] = await ethers.getSigners();
  });

  it('graph 1, IHiBO original', async () => {
    const sc = Argumentation;

    const resAlpha = await sc.insertArgument('a', { from: alpha.address });
    const resBeta = await sc.insertArgument('b', { from: beta.address });
    const resGamma = await sc.insertArgument('c', { from: gamma.address });

    await sc.supportArgument(3, { from: beta.address });
    await sc.supportArgument(2, { from: gamma.address });

    await sc.insertAttack(1, 2, '');
    await sc.insertAttack(2, 1, '');
    await sc.insertAttack(1, 3, '');
    await sc.insertAttack(3, 1, '');

    const g = await sc.getGraph(1);
    printGraph(g);

    const resReduction1 = await sc.pafReductionToAfPr1();
    const r1 = await sc.getGraph(2);
    printGraph(r1);

    const resReduction3 = await sc.pafReductionToAfPr3();
    const r3 = await sc.getGraph(3);
    printGraph(r3);

    const r4 = await sc.enumeratingPreferredExtensions(3);
    r4.logs.forEach((element: any) => {
      console.log('***************************************');
      console.log(element.args.args);
    });
  });
});

describe('Argumentation 1', function () {
  let Argumentation: Contract;
  let alpha: string;
  let beta: string;
  let gamma: string;

  beforeEach(async function () {
    // Deploy the contract before each test
    Argumentation = await ethers.getContractFactory("Argumentation");
    const deployed = await Argumentation.deploy();
    await deployed.deployed();

    [alpha, beta, gamma] = await ethers.getSigners();
  });

  it('graph 2, related work', async () => {
    const sc = Argumentation;

    const resAlpha = await sc.insertArgument('b', { from: alpha.address });
    const resAlphaGasUsed = resAlpha.receipt.gasUsed;
    const resBeta = await sc.insertArgument('c', { from: beta.address });
    const resBetaGasUsed = resBeta.receipt.gasUsed;
    const resGamma = await sc.insertArgument('d', { from: gamma.address });
    const resGammaGasUsed = resGamma.receipt.gasUsed;
    const resAlpha2 = await sc.insertArgument('e', { from: alpha.address });
    const resAlpha2GasUsed = resAlpha2.receipt.gasUsed;

    console.log(
      'insertArgument(): ',
      (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resAlpha2GasUsed) / 4
    );

    const resBetaSupport = await sc.supportArgument(3, { from: beta.address });
    const resBetaSupportGasUsed = resBetaSupport.receipt.gasUsed;
    const resGammaSupport = await sc.supportArgument(2, { from: gamma.address });
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
    r4.logs.forEach((element: any) => {
      console.log('*************************************');
      console.log(element.args.args);
    });
    const r4GasUsed = r4.receipt.gasUsed;
    console.log('enumeratingPreferredExtensions(): ', r4GasUsed);
  });
});


describe('Argumentation 2', function () {
  let Argumentation: Contract;
  let alpha: string;
  let beta: string;
  let gamma: string;

  beforeEach(async function () {
    // Deploy the contract before each test
    Argumentation = await ethers.getContractFactory("Argumentation");
    const deployed = await Argumentation.deploy();
    await deployed.deployed();

    [alpha, beta, gamma] = await ethers.getSigners();
  });

  it('graph 3, new graph', async () => {
    const sc = Argumentation;

    const resAlpha = await sc.insertArgument('a', { from: alpha.address });
    const resAlphaGasUsed = resAlpha.receipt.gasUsed;
    const resGamma = await sc.insertArgument('b', { from: gamma.address });
    const resGammaGasUsed = resGamma.receipt.gasUsed;
    const resBeta = await sc.insertArgument('c', { from: beta.address });
    const resBetaGasUsed = resBeta.receipt.gasUsed;
    const resGamma2 = await sc.insertArgument('d', { from: gamma.address });
    const resGamma2GasUsed = resGamma2.receipt.gasUsed;
    console.log(
      'insertArgument(): ',
      (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resGamma2GasUsed) / 4
    );

    const resBetaSupport = await sc.supportArgument(1, { from: beta.address });
    const resBetaSupportGasUsed = resBetaSupport.receipt.gasUsed;
    const resAlphaSupport = await sc.supportArgument(3, { from: alpha.address });
    const resAlphaSupportGasUsed = resAlphaSupport.receipt.gasUsed;
    console.log(
      'supportArgument(): ',
      (resBetaSupportGasUsed + resAlphaSupportGasUsed) / 2
    );

    const edgeGasUsed: number[] = [];
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
    r4.logs.forEach((element: any) => {
      console.log('*************************************');
      console.log(element.args.args);
    });
    const r4GasUsed = r4.receipt.gasUsed;
    console.log('enumeratingPreferredExtensions(): ', r4GasUsed);
  });
});



for (let i = 0; i < 1; i++) {
  describe('Argumentation N', function () {
    const prefP = 0.25;
    const nodesNumber = 5;
    const edgesP = 0.66;
    let Argumentation: Contract;
    let signers: Signer[];
    let alpha: Signer, beta: Signer, gamma: Signer;
    let edgesNumber = 0;
  
    beforeEach(async function () {
      const Factory = await ethers.getContractFactory("Argumentation");
      Argumentation = await Factory.deploy();
      await Argumentation.deployed();
  
      signers = await ethers.getSigners();
      [alpha, beta, gamma] = signers;
      edgesNumber = 0;
    });
  
    it('random graphs', async () => {
      const accounts = [alpha, beta, gamma];
      const sc = Argumentation;
  
      for (let j = 0; j < nodesNumber; j++) {
        const argTx = await sc.connect(accounts[j % 3]).insertArgument(`a`);
        await argTx.wait();
  
        for (let k = 1; k <= 2; k++) {
          if (Math.random() < prefP) {
            const supportTx = await sc
              .connect(accounts[(j + k) % 3])
              .supportArgument(j + 1);
            await supportTx.wait();
          }
        }
      }
  
      for (let source = 1; source <= nodesNumber; source++) {
        for (let target = 1; target <= nodesNumber; target++) {
          if (Math.random() < edgesP && source !== target) {
            const attackTx = await sc.insertAttack(source, target, '');
            await attackTx.wait();
            edgesNumber++;
          }
        }
      }
  
      const resReduction3 = await sc.pafReductionToAfPr3();
      const receipt1 = await resReduction3.wait();
      const reductionGasUsed = receipt1.gasUsed.toNumber();
      console.log(reductionGasUsed);
  
      const r4 = await sc.enumeratingPreferredExtensions(2);
      const receipt2 = await r4.wait();
      const gasUsed = receipt2.gasUsed.toNumber();
      console.log(gasUsed);
  
      fs.writeFileSync(
        filepath,
        `${nodesNumber}, ${edgesNumber}, ${edgesP}, ${prefP}, ${reductionGasUsed}, ${gasUsed}\n`,
        { flag: 'a' }
      );
    });
  });
}

