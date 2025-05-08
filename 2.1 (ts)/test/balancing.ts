import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, ContractFactory, Signer } from "ethers";
import { Balancing } from "../typechain-types"; // adjust the import path based on your project
import { artifacts } from 'hardhat';
import fs from 'fs';
const filepath = './data4.csv';

// const Balancing = artifacts.require('Balancing'); // Type is generic in Hardhat + TypeChain context

// export { Balancing, fs, filepath };


export const printReasons = (R: {
  justifications: bigint[];
  issues: bigint[];
  polarities: number[];
}): void => {
  console.log('--------Reasons--------');

  for (let i = 0; i < R.justifications.length; i++) {
    const x = 'x' + R.justifications[i].toString();
    const y = 'y' + R.issues[i].toString();
    const r = 'r' + i.toString();

    console.log(`${r} = (${x}, ${y}, ${R.polarities[i]})`);
  }

  console.log('-----------------------');
};

export const printWeights = (W: bigint[]): void => {
  console.log('--------Weights--------');

  for (let i = 0; i < W.length; i++) {
    const input = `(r${i.toString()})`;
    console.log(`f_{w}${input} = ${W[i].toString()}`);
  }

  console.log('------------------------');
};

export const printValuation = (valuation: number | string | bigint, issue: bigint): void => {
  console.log('-------Valuations-------');

  // If you want to map numeric values to '?', '-', '+'
  const V = ['?', '-', '+'];
  const label = typeof valuation === 'number' ? V[valuation] ?? valuation : valuation;

  console.log(`issue: ${issue.toString()}; valuated at: ${label}`);
  console.log('------------------------');
};




describe("Balancing debugging", function () {
  let alpha: Signer;
  let beta: Signer;
  let gamma: Signer;
  let BalancingFactory: ContractFactory;
  let deployed: Contract; // Replace 'any' with the specific contract type if using TypeChain

  beforeEach(async function () {
    BalancingFactory = await ethers.getContractFactory("Balancing");
    deployed = await BalancingFactory.deploy();
    
    [alpha, beta, gamma] = await ethers.getSigners();
  });

  it("Test 1", async function () {
    const balancing = deployed;

    
    try {
        await balancing.setIssue('1');
        console.log("setIssue succeeded");
    } catch (error) {
        console.error("Error in setIssue:", error);
    }
    
    const scAlpha = balancing.connect(alpha);

    
    try {
        await balancing.setReputation(1, scAlpha)
        console.log("setRep succeeded");
    } catch (error) {
        console.error("Error in setRep:", error);
    }
    

    const checkAndVote = async (arg1: any, arg2: any, arg3: any, arg4: any) => {
        console.log(`Arguments: ${arg1}, ${arg2}, ${arg3}, ${arg4}`);
        console.log(`Types: ${typeof arg1}, ${typeof arg2}, ${typeof arg3}, ${typeof arg4}`);
        return await scAlpha.voteOnReason(arg1, arg2, arg3, arg4);
    };
    
    try {
        const resAl1 = await checkAndVote('1', '1', '1', 1);
        const resAl2 = await checkAndVote('2', '1', '2', 1);
        const resAl3 = await checkAndVote(3, 1, 0, 1);
        const resAl4 = await checkAndVote(4, 1, 0, 1);
    } catch (error) {
        console.error("Error in voteOnReason:", error);
    }
      

    // try {
    //       await scAlpha.voteOnReason('1', '1', '1', 1);
    //     console.log("vote1 succeeded");
    // } catch (error) {
    //     console.error("Error in vote1:", error);
    // }
    // await scAlpha.voteOnReason('1', '1', '1', 1);
    // console.log('bla');
    // await scAlpha.voteOnReason('2', '1', '2', 1);
    // console.log('bla');
    // await scAlpha.voteOnReason('3', '1', '0', 1);
    // console.log('bla');
    // await scAlpha.voteOnReason('4', '1', '0', 1);
    // console.log('bla');
    // // Using callStatic to simulate a call without state change
    // const resAlpha10 = await balancing.callStatic.voteOnReason(1, 1, 1, 1);
    // const resAlpha1 = await balancing.connect(alpha).voteOnReason(1, 1, 1, 1);
    // const resAlpha12 = await balancing.connect(alpha).callStatic.voteOnReason(1, 1, 1, 1);

    // const resAlpha20 = await balancing.connect(alpha).callStatic.voteOnReason(2, 1, 2, 1);
    // const resAlpha2 = await balancing.connect(alpha).voteOnReason(2, 1, 2, 1);
    // const resAlpha22 = await balancing.connect(alpha).callStatic.voteOnReason(2, 1, 2, 1);

    // const resAlpha30 = await balancing.connect(alpha).callStatic.voteOnReason(3, 1, 0, 1);
    // const resAlpha3 = await balancing.connect(alpha).voteOnReason(3, 1, 0, 1);
    // const resAlpha31 = await balancing.connect(alpha).callStatic.voteOnReason(3, 1, 0, 1);

    // await balancing.connect(alpha).voteOnReason(4, 1, 0, 1);

    // console.log("bla");

    const reasons = await balancing.getReasons();
    printReasons(reasons);

    const issue = await balancing.getIssue();
    console.log("issue: " + issue.toString());

    const weights = await balancing.callStatic.getWeights();
    printWeights(weights);

    const pa1 = await balancing.callStatic.procedureAdditive();
    printValuation(pa1, issue);

    // Uncomment below as needed

    // await balancing.connect(alpha).insertContext([1, 2], 1);
    // await balancing.connect(alpha).insertContext([35, 36], 42);
    // const contexts = await balancing.getContexts();
    // printContexts(contexts);

    // await balancing.changeWeight(0, 0, 1, 1);
    // const weight = await balancing.callStatic.returnWeight(0, 0);
    // console.log(weight.toString());

    // const w20 = await balancing.callStatic.returnWeight(3, 0);
    // console.log(w20.toString());

    // await balancing.changeWeight(0, 1, 1, 3);
    // await balancing.changeWeight(0, 2, 1, 3);
    // const w21 = await balancing.callStatic.returnWeight(3, 0);
    // console.log(w21.toString());
  });
});

/*
describe("Balancing 0", function () {
  let balancing: Balancing;
  let alpha: any;
  let beta: any;
  let gamma: any;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    alpha = signers[0];
    beta = signers[1];
    gamma = signers[2];

    const BalancingFactory = await ethers.getContractFactory("Balancing");
    balancing = await BalancingFactory.deploy();
    await balancing.deployed();
  });

  it("graph 1, IHiBO original", async function () {
    await balancing.setIssue(1);

    await balancing.setReputation(await alpha.getAddress(), 1);
    await balancing.setReputation(await beta.getAddress(), 1);
    await balancing.setReputation(await gamma.getAddress(), 1);

    await balancing.connect(alpha).voteOnReason(1, 1, 1, 1);
    await balancing.connect(beta).voteOnReason(2, 1, 2, 1);
    await balancing.connect(gamma).voteOnReason(3, 1, 2, 1);
    await balancing.connect(beta).voteOnReason(3, 1, 2, 1);
    await balancing.connect(gamma).voteOnReason(2, 1, 2, 1);

    // Optional: Insert attacks if needed
    // await balancing.insertAttack(1, 2, "");
    // await balancing.insertAttack(2, 1, "");
    // await balancing.insertAttack(1, 3, "");
    // await balancing.insertAttack(3, 1, "");

    const reasons = await balancing.getReasons();
    printReasons(reasons);

    const issue = await balancing.getIssue();
    const weights = await balancing.callStatic.getWeights();
    printWeights(weights);

    const pa1 = await balancing.callStatic.procedureAdditive();
    printValuation(pa1, issue);

    const graph = await balancing.getGraph(1);
    printGraph(graph);

    // Uncomment if needed
    // await balancing.pafReductionToAfPr1();
    // const r1 = await balancing.getGraph(2);
    // printGraph(r1);

    // await balancing.pafReductionToAfPr3();
    // const r3 = await balancing.getGraph(3);
    // printGraph(r3);

    // const r4 = await balancing.enumeratingPreferredExtensions(3);
    // r4.logs.forEach((element) => {
    //   console.log("***************************************");
    //   console.log(element.args.args);
    // });
  });
});
*/
/*
describe("Balancing 1", () => {
  let alpha: any, beta: any, gamma: any;
  let sc: Contract;

  before(async () => {
    [alpha, beta, gamma] = await ethers.getSigners();
    const BalancingFactory = await ethers.getContractFactory("Balancing");
    sc = await BalancingFactory.deploy();
    await sc.deployed();
  });

  it("graph 2, related work", async () => {
    await sc.setIssue(1);

    await sc.setReputation(alpha.address, 1);
    await sc.setReputation(beta.address, 1);
    await sc.setReputation(gamma.address, 1);

    await sc.connect(alpha).voteOnReason(2, 1, 0, 1);
    await sc.connect(gamma).voteOnReason(5, 1, 0, 1);
    await sc.connect(beta).voteOnReason(3, 1, 0, 1);
    await sc.connect(beta).voteOnReason(4, 1, 0, 1);
    await sc.connect(gamma).voteOnReason(4, 1, 0, 1);
    await sc.connect(gamma).voteOnReason(3, 1, 0, 1);

    const reasons = await sc.getReasons();
    console.log("Reasons:", reasons);

    const issue = await sc.getIssue();
    console.log("Issue:", issue.toString());

    const weights = await sc.getWeights();
    console.log("Weights:", weights);

    const pa1 = await sc.procedureAdditive();
    console.log("Valuation:", pa1.toString());

    // Optionally:
    // const g = await sc.getGraph(1);
    // console.log("Graph 1:", g);

    // const resReduction3 = await sc.pafReductionToAfPr3();
    // const r3 = await sc.getGraph(2);
    // console.log("Reduced Graph 3:", r3);

    // const r4 = await sc.enumeratingPreferredExtensions(2);
    // for (const log of r4.logs) {
    //   console.log("*************************************");
    //   console.log(log.args.args);
    // }
  });
});
*/
/*
describe("Balancing 2", function () {
  let balancing: Balancing;
  let alpha: string;
  let beta: string;
  let gamma: string;

  beforeEach(async () => {
    const [a, b, c] = await ethers.getSigners();
    alpha = a.address;
    beta = b.address;
    gamma = c.address;

    const BalancingFactory = await ethers.getContractFactory("Balancing");
    balancing = await BalancingFactory.deploy();
    await balancing.deployed();
  });

  it("graph 3, new graph", async () => {
    // await (await balancing.insertArgument("a")).wait();
    // await (await balancing.insertArgument("b")).wait();
    // await (await balancing.insertArgument("c")).wait();
    // await (await balancing.insertArgument("d")).wait();

    // Support/Attack setup could go here if needed

    await (await balancing.setIssue(1)).wait();

    await (await balancing.setReputation(alpha, 1)).wait();
    await (await balancing.setReputation(beta, 1)).wait();
    await (await balancing.setReputation(gamma, 1)).wait();

    await (await balancing.voteOnReason(1, 1, 0, 1)).wait();
    await (await balancing.connect(await ethers.getSigner(gamma)).voteOnReason(3, 1, 0, 1)).wait();
    await (await balancing.connect(await ethers.getSigner(beta)).voteOnReason(3, 1, 0, 1)).wait();
    await (await balancing.connect(await ethers.getSigner(beta)).voteOnReason(1, 1, 0, 1)).wait();
    await (await balancing.connect(await ethers.getSigner(gamma)).voteOnReason(2, 1, 0, 1)).wait();
    await (await balancing.connect(await ethers.getSigner(gamma)).voteOnReason(4, 1, 0, 1)).wait();

    const reasons = await balancing.getReasons();
    printReasons(reasons);

    const issue = await balancing.getIssue();
    console.log("issue: " + issue.toString());

    const weights = await balancing.getWeights();
    printWeights(weights);

    const pa1 = await balancing.procedureAdditive();
    printValuation(pa1, issue);
  });
});
 */


/*


// fs.writeFileSync(
//   filepath,
//   'nodesNumber, voteP, GasUsed, agents\n',
//   { flag: 'a' } // or 'w' to overwrite instead of append
// );

const nodes = [5, 10, 15, 20];
const nod = 3;
const epochs = 2;

describe("Balancing Random Graphs", function () {
  let accounts: any[];
  let balancing: Balancing;

  before(async () => {
    accounts = await ethers.getSigners();

    fs.writeFileSync(filepath, "nodesNumber, voteP, GasUsed, agents\n", {
      flag: "w",
    });
  });

  for (let i = 0; i < epochs; i++) {
    describe(`Epoch ${i}`, () => {
      beforeEach(async () => {
        const BalancingFactory = await ethers.getContractFactory("Balancing");
        balancing = await BalancingFactory.deploy();
        await balancing.deployed();
      });

      it("generates random voting graph", async () => {
        const alpha = accounts[0];
        const beta = accounts[1];
        const gamma = accounts[2];
        const iota = accounts[8];

        const nodesNumber = nodes[nod];
        const c = 1;
        const ag = 3;
        const voteP = 0.65;

        await (await balancing.setIssue(c)).wait();

        await (await balancing.connect(iota).setReputation(1, alpha.address)).wait();
        await (await balancing.connect(iota).setReputation(1, beta.address)).wait();
        await (await balancing.connect(iota).setReputation(1, gamma.address)).wait();

        let rs = 0;
        for (let j = 0; rs < nodesNumber; j++) {
          let cF1 = 0, cF2 = 0, cF3 = 0, cF4 = 0, cF5 = 0;

          for (let k = 0; k < ag; k++) {
            const actor = accounts[k];
            if (Math.random() < voteP) {
              const p = Math.random();

              const tryVote = async (symbol: string, flag: number) => {
                const tx = await balancing
                  .connect(actor)
                  .voteOnReason(String(j), String(c), symbol, 1);
                await tx.wait();
                return flag + 1;
              };

              if (p < 0.2 && cF1 === 0 && rs + cF1 + cF2 + cF3 + cF4 + cF5 < nodesNumber) {
                cF1 = await tryVote("--", cF1);
              } else if (p < 0.4 && cF2 === 0 && rs + cF1 + cF2 + cF3 + cF4 + cF5 < nodesNumber) {
                cF2 = await tryVote("-", cF2);
              } else if (p < 0.6 && cF3 === 0 && rs + cF1 + cF2 + cF3 + cF4 + cF5 < nodesNumber) {
                cF3 = await tryVote("0", cF3);
              } else if (p < 0.8 && cF4 === 0 && rs + cF1 + cF2 + cF3 + cF4 + cF5 < nodesNumber) {
                cF4 = await tryVote("+", cF4);
              } else if (p >= 0.8 && cF5 === 0 && rs + cF1 + cF2 + cF3 + cF4 + cF5 < nodesNumber) {
                cF5 = await tryVote("++", cF5);
              }
            }
          }

          rs += cF1 + cF2 + cF3 + cF4 + cF5;
        }

        const reasons = await balancing.getReasons();
        printReasons(reasons);

        const issue = await balancing.getIssue();
        const weights = await balancing.getWeights();
        printWeights(weights);

        const pa = await balancing.procedureAdditive();
        const receipt = await pa.wait();
        const gasUsed = receipt.gasUsed.toNumber();

        console.log("GasUsed:", gasUsed);

        fs.writeFileSync(
          filepath,
          `${nodesNumber}, ${voteP}, ${gasUsed}, ${ag}\n`,
          { flag: "a" }
        );
      });
    });
  }
});
*/
