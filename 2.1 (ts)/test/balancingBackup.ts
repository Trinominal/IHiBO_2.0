
import { ethers } from "hardhat";
import fs from 'fs';
import { expect } from "chai";

const filepath = './data4.csv';

const printReasons = (R: any) => {
  console.log('--------Reasons--------');

  const V = ['?', '-', '+'];

  for (let i = 0; i < R.justifications.length; i++) {
    if (R.polarities[i] == 0 || R.polarities[i] == 1 || R.polarities[i] == 2) {
      let x = "x";
      let y = "y";
      let r = "r";
      R.justifications[i] == 0 ? x += "?" : x += R.justifications[i].toString();
      R.issues[i] == 0 ? y += "?" : y += R.issues[i].toString();
      i == 0 ? r += "?" : r += i.toString();

      console.log(
        r,
        ' =  (' + x + ', ' + y + ', ' + V[R.polarities[i]] + ')'
      );
    } else {
      console.log("NaR: Not available Reason");
    }
  }
  console.log('-----------------------');
};

const printContexts = (C: any) => {
  console.log('-------Contexts--------');

  for (let i = 0; i < C.issues.length; i++) {
    let x = '';
    if (C.reasonss[i].length > 0) {
      C.reasonss[i][0] == 0 ? x = 'r?' : x = 'r' + C.reasonss[i][0].toString();
      for (let j = 1; j < C.reasonss[i].length; j++) {
        C.reasonss[i][j] == 0 ? x = x + ', r?' : x = x + ', r' + C.reasonss[i][j].toString();
      }
    }
    let y = 'y';
    let c = 'c';
    C.issues[i] == 0 ? y += '?' : y += C.issues[i].toString();
    i == 0 ? c += '?' : c += i.toString();
    console.log(
      c, ' = ((' + x + '), ' + y + ')'
    );
  }

  console.log('-----------------------');
};

const printWeights = (W: any) => {
  console.log('--------Weights--------');
  for (let i = 0; i < W.length; i++) {
    for (let j = 0; j < W[i].length; j++) {
      let input = '(r' + j.toString() + ', c' + i.toString() + ')';
      console.log('f_{w?}(' + input + ') = ' + W[i][j]);
    }
  }
  console.log('------------------------');
};

const printValuation = (cases: any, p: any) => {
  console.log('-------Valuations-------');

  const V = ['?', '-', '+'];

  expect(cases.length).to.equal(p.length);
  for (let i = 0; i < p.length; i++) {
    expect(p[i]).to.be.lessThan(3);
    const valuation = V[p[i]];
    console.log('c' + cases[i].toString(), ': ', valuation);
  }

  console.log('------------------------');
};

describe('Balancing 1', function () {
  let alpha: string;

  before(async function () {
    const accounts = await ethers.getSigners();
    alpha = accounts[0].address;
  });

  it('Test 1', async function () {
    const Balancing = await ethers.getContractFactory("Balancing");
    const sc = await Balancing.deploy();
    await sc.deployed();

    const resAlpha10 = await sc.insertReason.call(1, 1, 1, {
      from: alpha,
    });
    const resAlpha1 = await sc.insertReason(1, 1, 1, {
      from: alpha,
    });
    const resAlpha12 = await sc.insertReason.call(1, 1, 1, {
      from: alpha,
    });

    const resAlpha20 = await sc.insertReason.call(2, 1, 2, {
      from: alpha,
    });
    const resAlpha2 = await sc.insertReason(2, 1, 2, {
      from: alpha,
    });
    const resAlpha22 = await sc.insertReason.call(2, 1, 2, {
      from: alpha,
    });

    const resAlpha30 = await sc.insertReason.call(3, 1, 0, {
      from: alpha,
    });
    const resAlpha3 = await sc.insertReason(3, 1, 0, {
      from: alpha,
    });
    const resAlpha31 = await sc.insertReason.call(3, 1, 0, {
      from: alpha,
    });

    const resAlpha4 = await sc.insertReason(4, 1, 0, {
      from: alpha,
    });

    const reasons = await sc.getReasons();
    printReasons(reasons);

    const conAlpha1 = await sc.insertContext([1, 2], 1, {
      from: alpha,
    });

    const conAlpha2 = await sc.insertContext([35, 36], 42, {
      from: alpha,
    });

    const contexts = await sc.getContexts();
    printContexts(contexts);

    await sc.changeWeight(0, 1, 1, 3);

    const weights = await sc.getWeights.call(0);
    printWeights(weights);

    const pa1 = await sc.procedureAdditive.call(0, [1, 2]);
    printValuation([1, 2], pa1);
  });
});
