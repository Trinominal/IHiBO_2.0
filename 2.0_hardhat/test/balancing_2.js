// import { ethers } from "hardhat";
// import { Contract, ContractFactory, Signer } from "ethers";
// import { expect } from "chai";
// import hre from "hardhat";
// import fs from 'fs';

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

// /*
describe('Argumentation 0', function () {
  let alpha: Signer;
  let beta: Signer;
  let gamma: Signer;
  let Balancing: ContractFactory;
  let deployed: Contract;
  // let beta: string;
  // let gamma: string;
  // let deployed: Contract;
  // let accounts: Signer[];

  beforeEach(async function () {
    // Deploy the contract before each test
    Balancing = await ethers.getContractFactory("Argumentation");
    deployed = await Balancing.deploy(); // Deploys the contract

    [alpha, beta, gamma] = await ethers.getSigners();
  });

  it('graph 1, IHiBO original', async () => {

    const sc = deployed;

    // Connect the contract to the respective signers
    const scAlpha = sc.connect(alpha);
    const scBeta = sc.connect(beta);
    const scGamma = sc.connect(gamma);
    
    // // Call the contract functions with the connected signers
    // const resAlpha = await scAlpha.insertArgument('a');
    // const resBeta = await scBeta.insertArgument('b');
    // const resGamma = await scGamma.insertArgument('c');
    
    // // Support arguments with respective signers
    // await scBeta.supportArgument(3);
    // await scGamma.supportArgument(2);
    
    // // Insert attacks
    // await scAlpha.insertAttack(1, 2, '');
    // await scAlpha.insertAttack(2, 1, '');
    // await scAlpha.insertAttack(1, 3, '');
    // await scAlpha.insertAttack(3, 1, '');
    

    // const g = await sc.getGraph(1);
    // printGraph(g);

    // const resReduction1 = await sc.pafReductionToAfPr1();
    // const r1 = await sc.getGraph(2);
    // printGraph(r1);

    // const resReduction3 = await sc.pafReductionToAfPr3();
    // const r3 = await sc.getGraph(3);
    // printGraph(r3);

    // // const r4 = await sc.enumeratingPreferredExtensions(3);
    // // r4.logs.forEach((element: any) => {
    // //   console.log('***************************************');
    // //   console.log(element.args.args);
    // // });

    
    // try {
    // // Set up the event listener
    //   sc.on('PreferredExtensions', (args: number[]) => {
    //     console.log('***************************************');
    //     console.log('Event args:', args[0]);
    //   });
  
    //   // Call the function to trigger the event
    //   const tx = await sc.enumeratingPreferredExtensions(3);
    //   await tx.wait(); // Wait for the transaction to be mined

    //   console.log('Transaction completed:');//, tx);
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  


    
    

  });
});
