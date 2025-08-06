// import { ethers } from "hardhat";
// import fs from 'fs';
// import { expect } from "chai";

const filepath = './data3.csv';

const printGraph = (g: any) => {
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
  console.log('---------------------');
};

const printGraph2 = (g: any) => {
  console.log('--------Graph--------');
  for (let i = 0; i < g.nodes.length; i++) {
    console.log('Node:', g.nodes[i].toString(), ';  Votes:', g.votes[i].toString());
  }

  for (let i = 0; i < g.edgesSource.length; i++) {
    console.log(
      g.edgesSource[i].toString(),
      ' -> ',
      g.edgesTarget[i].toString()
    );
  }
  console.log('---------------------');
};

Inclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};

describe('Tinkering 1', function () {
  let alpha: string;
  let beta: string;
  let gamma: string;
  let delta: string;

  before(async function () {
    const accounts = await ethers.getSigners();
    alpha = accounts[0].address;
    beta = accounts[1].address;
    gamma = accounts[2].address;
    delta = accounts[3].address;
  });

  it('Test 1', async function () {
    const Tinkering = await ethers.getContractFactory("Tinkering");
    const sc = await Tinkering.deploy();
    await sc.deployed();

    // Making Graph
    const resAlpha1 = await sc.insertArgument('a', {
      from: alpha,
    });
    const resAlpha2 = await sc.insertArgument('b', {
      from: alpha,
    });
    const resAlpha3 = await sc.insertArgument('c', {
      from: alpha,
    });

    const resBetaSupport = await sc.supportArgument(2, {
      from: beta,
    });

    const edgeAB = await sc.insertAttack(1, 2, '');

    // Graph operations
    const g = await sc.getGraph(1);

    const resReduction1 = await sc.pafReductionToAfPr1();
    const r1 = await sc.getGraph(2);

    const resReduction2 = await sc.pafReductionToAfPr2();
    const r2 = await sc.getGraph(3);

    const resReduction3 = await sc.pafReductionToAfPr3();
    const r3 = await sc.getGraph(4);

    const resReduction4 = await sc.pafReductionToAfPr4();
    const r5 = await sc.getGraph(5);

    // Printing
    const t1 = await sc.getGraph2(1);
    console.log('Original');
    printGraph2(t1);

    const t2 = await sc.getGraph(2);
    console.log('pafReductionToAfPr1');
    printGraph(t2);

    const t3 = await sc.getGraph(3);
    console.log('pafReductionToAfPr2');
    printGraph(t3);

    const t4 = await sc.getGraph(4);
    console.log('pafReductionToAfPr3');
    printGraph(t4);

    const t5 = await sc.getGraph(5);
    console.log('pafReductionToAfPr4');
    printGraph(t5);
  });
});

describe('Tinkering 2', function () {
  let alpha: string;
  let beta: string;
  let gamma: string;
  let delta: string;

  before(async function () {
    const accounts = await ethers.getSigners();
    alpha = accounts[0].address;
    beta = accounts[1].address;
    gamma = accounts[2].address;
    delta = accounts[3].address;
  });

  it('Test 2', async function () {
    const Tinkering = await ethers.getContractFactory("Tinkering");
    const sc = await Tinkering.deploy();
    await sc.deployed();

    // Making Graph
    const resAlpha1 = await sc.insertArgument('a', {
      from: alpha,
    });
    const resAlpha2 = await sc.insertArgument('b', {
      from: alpha,
    });

    const resBetaSupport = await sc.supportArgument(2, {
      from: beta,
    });

    const edgeAB = await sc.insertAttack(1, 2, '');

    // Graph operations
    const g = await sc.getGraph(1);

    const resReduction1 = await sc.pafReductionToAfPr1();
    const r1 = await sc.getGraph(2);

    const resReduction3 = await sc.pafReductionToAfPr3();
    const r3 = await sc.getGraph(3);

    const r4 = await sc.enumeratingPreferredExtensions(3);

    // Printing
    const t1 = await sc.getGraph2(1);
    console.log('Original');
    printGraph2(t1);

    const t2 = await sc.getGraph2(2);
    console.log('pafReductionToAfPr1 (f1)');
    printGraph(t2);

    const t3 = await sc.getGraph2(3);
    console.log('pafReductionToAfPr2 (f3)');
    printGraph(t3);
  });
});


/*

describe('Tinkering 0', function () {
    let alpha: string;
    let beta: string;
    let gamma: string;
  
    before(async function () {
      const accounts = await ethers.getSigners();
      alpha = accounts[0].address;
      beta = accounts[1].address;
      gamma = accounts[2].address;
    });
  
    it('graph 1, IHiBO original', async function () {
      const Tinkering = await ethers.getContractFactory("Tinkering");
      const sc = await Tinkering.deploy();
      await sc.deployed();
  
      const resAlpha = await sc.insertArgument('a', {
        from: alpha,
      });
      const resBeta = await sc.insertArgument('b', {
        from: beta,
      });
      const resGamma = await sc.insertArgument('c', {
        from: gamma,
      });
      const resBetaSupport = await sc.supportArgument(3, {
        from: beta,
      });
      const resGammaSupport = await sc.supportArgument(2, {
        from: gamma,
      });
  
      const edgeAB = await sc.insertAttack(1, 2, '');
      const edgeBA = await sc.insertAttack(2, 1, '');
      const edgeAC = await sc.insertAttack(1, 3, '');
      const edgeCA = await sc.insertAttack(3, 1, '');
  
      const g = await sc.getGraph(1);
      //printGraph(g);
  
      const resReduction1 = await sc.pafReductionToAfPr1();
      //const r1 = await sc.getGraph(2);
      //printGraph(r1);
  
      const resReduction3 = await sc.pafReductionToAfPr3();
      //const r3 = await sc.getGraph(3);
      //printGraph(r3);
  
      const r4 = await sc.enumeratingPreferredExtensions(3);
      //r4.logs.forEach((element) => {
      //  console.log('***************************************');
      //  console.log(element.args.args);
      //});
    });
  });
  
*/
/*

describe("Tinkering 1", function () {
  let alpha: string;
  let beta: string;
  let gamma: string;
  let Tinkering: any;
  let tinkering: any;

  before(async () => {
    const accounts = await ethers.getSigners();
    alpha = accounts[0].address;
    beta = accounts[1].address;
    gamma = accounts[2].address;

    const TinkeringFactory = await ethers.getContractFactory("Tinkering");
    tinkering = await TinkeringFactory.deploy();
    await tinkering.deployed();
  });

  it("graph 2, related work", async () => {
    const resAlpha = await tinkering.insertArgument("b", { from: alpha });
    const resAlphaGasUsed = (await resAlpha.wait()).gasUsed.toNumber();
    const resBeta = await tinkering.insertArgument("c", { from: beta });
    const resBetaGasUsed = (await resBeta.wait()).gasUsed.toNumber();
    const resGamma = await tinkering.insertArgument("d", { from: gamma });
    const resGammaGasUsed = (await resGamma.wait()).gasUsed.toNumber();
    const resAlpha2 = await tinkering.insertArgument("e", { from: alpha });
    const resAlpha2GasUsed = (await resAlpha2.wait()).gasUsed.toNumber();
    console.log(
      "insertArgument(): ",
      (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resAlpha2GasUsed) / 4
    );

    const resBetaSupport = await tinkering.supportArgument(3, { from: beta });
    const resBetaSupportGasUsed = (await resBetaSupport.wait()).gasUsed.toNumber();
    const resGammaSupport = await tinkering.supportArgument(2, { from: gamma });
    const resGammaSupportGasUsed = (await resGammaSupport.wait()).gasUsed.toNumber();
    console.log(
      "supportArgument(): ",
      (resBetaSupportGasUsed + resGammaSupportGasUsed) / 2
    );

    const edgeBC = await tinkering.insertAttack(1, 2, "");
    const edgeBCGasUsed = (await edgeBC.wait()).gasUsed.toNumber();
    const edgeCD = await tinkering.insertAttack(2, 3, "");
    const edgeCDGasUsed = (await edgeCD.wait()).gasUsed.toNumber();
    const edgeCE = await tinkering.insertAttack(2, 4, "");
    const edgeCEGasUsed = (await edgeCE.wait()).gasUsed.toNumber();
    const edgeDB = await tinkering.insertAttack(3, 1, "");
    const edgeDBGasUsed = (await edgeDB.wait()).gasUsed.toNumber();
    const edgeED = await tinkering.insertAttack(4, 3, "");
    const edgeEDGasUsed = (await edgeED.wait()).gasUsed.toNumber();
    console.log(
      "insertAttack(): ",
      (edgeBCGasUsed + edgeCDGasUsed + edgeCEGasUsed + edgeDBGasUsed + edgeEDGasUsed) / 5
    );

    const g = await tinkering.getGraph(1);
    printGraph(g);

    const resReduction3 = await tinkering.pafReductionToAfPr3();
    const r3 = await tinkering.getGraph(2);
    printGraph(r3);
    const resReduction3GasUsed = (await resReduction3.wait()).gasUsed.toNumber();
    console.log("pafReductionToAfPr3(): ", resReduction3GasUsed);

    const r4 = await tinkering.enumeratingPreferredExtensions(2);
    r4.logs.forEach((element: any) => {
      console.log("*************************************");
      console.log(element.args.args);
    });
    const r4GasUsed = (await r4.wait()).gasUsed.toNumber();
    console.log("enumeratingPreferredExtensions(): ", r4GasUsed);
  });
});

*/

/*
describe("Tinkering 2", function () {
  let alpha: string;
  let beta: string;
  let gamma: string;
  let Tinkering: any;
  let tinkering: any;

  before(async () => {
    const accounts = await ethers.getSigners();
    alpha = accounts[0].address;
    beta = accounts[1].address;
    gamma = accounts[2].address;

    const TinkeringFactory = await ethers.getContractFactory("Tinkering");
    tinkering = await TinkeringFactory.deploy();
    await tinkering.deployed();
  });

  it("graph 3, new graph", async () => {
    const resAlpha = await tinkering.insertArgument("a", { from: alpha });
    const resAlphaGasUsed = (await resAlpha.wait()).gasUsed.toNumber();
    const resGamma = await tinkering.insertArgument("b", { from: gamma });
    const resGammaGasUsed = (await resGamma.wait()).gasUsed.toNumber();
    const resBeta = await tinkering.insertArgument("c", { from: beta });
    const resBetaGasUsed = (await resBeta.wait()).gasUsed.toNumber();
    const resGamma2 = await tinkering.insertArgument("d", { from: gamma });
    const resGamma2GasUsed = (await resGamma2.wait()).gasUsed.toNumber();
    console.log(
      "insertArgument(): ",
      (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resGamma2GasUsed) / 4
    );

    const resBetaSupport = await tinkering.supportArgument(1, { from: beta });
    const resBetaSupportGasUsed = (await resBetaSupport.wait()).gasUsed.toNumber();
    const resAlphaSupport = await tinkering.supportArgument(3, { from: alpha });
    const resAlphaSupportGasUsed = (await resAlphaSupport.wait()).gasUsed.toNumber();
    console.log(
      "supportArgument(): ",
      (resBetaSupportGasUsed + resAlphaSupportGasUsed) / 2
    );

    const edgeGasUsed: number[] = [];
    const edgeAB = await tinkering.insertAttack(1, 2, "");
    edgeGasUsed.push((await edgeAB.wait()).gasUsed.toNumber());
    const edgeAC = await tinkering.insertAttack(1, 3, "");
    edgeGasUsed.push((await edgeAC.wait()).gasUsed.toNumber());
    const edgeAD = await tinkering.insertAttack(1, 4, "");
    edgeGasUsed.push((await edgeAD.wait()).gasUsed.toNumber());

    const edgeBA = await tinkering.insertAttack(2, 1, "");
    edgeGasUsed.push((await edgeBA.wait()).gasUsed.toNumber());
    const edgeBC = await tinkering.insertAttack(2, 3, "");
    edgeGasUsed.push((await edgeBC.wait()).gasUsed.toNumber());
    const edgeBD = await tinkering.insertAttack(2, 4, "");
    edgeGasUsed.push((await edgeBD.wait()).gasUsed.toNumber());

    const edgeCA = await tinkering.insertAttack(3, 1, "");
    edgeGasUsed.push((await edgeCA.wait()).gasUsed.toNumber());
    const edgeCB = await tinkering.insertAttack(3, 2, "");
    edgeGasUsed.push((await edgeCB.wait()).gasUsed.toNumber());
    const edgeCD = await tinkering.insertAttack(3, 4, "");
    edgeGasUsed.push((await edgeCD.wait()).gasUsed.toNumber());

    const edgeDA = await tinkering.insertAttack(4, 1, "");
    edgeGasUsed.push((await edgeDA.wait()).gasUsed.toNumber());
    const edgeDB = await tinkering.insertAttack(4, 2, "");
    edgeGasUsed.push((await edgeDB.wait()).gasUsed.toNumber());
    const edgeDC = await tinkering.insertAttack(4, 3, "");
    edgeGasUsed.push((await edgeDC.wait()).gasUsed.toNumber());

    let avgGasUsed = 0;
    for (const gu of edgeGasUsed) {
      avgGasUsed += gu;
    }
    avgGasUsed /= edgeGasUsed.length;
    console.log("insertAttack(): ", avgGasUsed);

    const g = await tinkering.getGraph(1);
    printGraph(g);

    const resReduction3 = await tinkering.pafReductionToAfPr1();
    const r3 = await tinkering.getGraph(2);
    printGraph(r3);
    const resReduction3GasUsed = (await resReduction3.wait()).gasUsed.toNumber();
    console.log("pafReductionToAfPr1(): ", resReduction3GasUsed);

    const r4 = await tinkering.enumeratingPreferredExtensions(2);
    r4.logs.forEach((element: any) => {
      console.log("*************************************");
      console.log(element.args.args);
    });
    const r4GasUsed = (await r4.wait()).gasUsed.toNumber();
    console.log("enumeratingPreferredExtensions(): ", r4GasUsed);
  });
});
*/

/*

const filepath = "./data.csv";

// Write the header to the file
fs.writeFile(filepath, `NodesNumber, EdgesNumber, EdgesP, PrefP, ReductionPref3, PrefExtensionsGas\n`, (err) => {
  if (err) throw err;
  console.log('New data file has been saved!');
});

for (let i = 0; i < 2; i++) {

  console.log('checkpoint: 1');

  describe('Tinkering N:' + i, function () {
    let alpha: string;
    let beta: string;
    let gamma: string;
    const prefP = 0.25;
    const nodesNumber = [2, 3, 2, 3];
    const edgesP = [0.33, 0.5, 0.66];
    let edgesNumber = 0;

    console.log('checkpoint: 2');

    before(async () => {
      const accounts = await ethers.getSigners();
      alpha = accounts[0].address;
      beta = accounts[1].address;
      gamma = accounts[2].address;
    });

    it('random graphs', async function () {

      console.log(i, nodesNumber[i % 4], edgesP[i % 3]);

      console.log('checkpoint: 3');

      const Tinkering = await ethers.getContractFactory("Tinkering");
      const sc = await Tinkering.deploy();
      await sc.deployed();

      console.log('checkpoint: 4');

      if (i >= 1) {
        const k = await sc.getGraph2(1);
        printGraph2(k);
      }

      console.log('checkpoint: 5');

      for (let j = 0; j < nodesNumber[i % 4]; j++) {
        console.log('insert node!');
        await sc.insertArgument(`a`, {
          from: accounts[j % 3].address,
        });
        console.log('bla');
        for (let k = 1; k <= 2; k++) {
          console.log('support node?');
          if (Math.random() < prefP) {
            console.log('support node!');
            await sc.supportArgument(j + 1, {
              from: accounts[(j + k) % 3].address,
            });
          }
        }
        console.log('blabla');
      }

      console.log('checkpoint: 6');

      for (let source = 1; source <= nodesNumber[i % 4]; source++) {
        console.log('bla');
        for (let target = 1; target <= nodesNumber[i % 4]; target++) {
          console.log('insert edge?');
          if (Math.random() < edgesP[i % 3] && source != target) {
            console.log('insert edge!');
            await sc.insertAttack(source, target, '');
            edgesNumber++;
          }
        }
        console.log('blabla');
      }

      console.log('checkpoint: 7');

      const g = await sc.getGraph2(1);
      printGraph2(g);

      console.log('reduction');
      const resReduction3 = await sc.pafReductionToAfPr3();
      const reductionGasUsed = (await resReduction3.wait()).gasUsed.toNumber();
      console.log(reductionGasUsed);

      console.log('extension');
      const r4 = await sc.enumeratingPreferredExtensions(2);
      const gasUsed = (await r4.wait()).gasUsed.toNumber();
      console.log(gasUsed);

      fs.writeFileSync(
        filepath,
        `${nodesNumber[i % 4]}, ${edgesNumber}, ${edgesP[i % 3]}, ${prefP}, ${reductionGasUsed}, ${gasUsed}\n`,
        { flag: 'a' }
      );

      console.log('checkpoint: 8');
    });
    console.log('checkpoint: 9');
  });
  console.log('checkpoint: 10');
}

function printGraph2(graph: any) {
  console.log("Graph: ", graph);
}

*/
