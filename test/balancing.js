const Balancing = artifacts.require('Balancing');
const fs = require('fs');
const filepath = './data4.csv';
// import LogRocket from 'logrocket';




const printReasons = (R) => {
  console.log('--------Reasons--------');

  // const V = ['?', '-', '+'];

  for (let i = 0; i < R.justifications.length; i++) {
    // if (R.polarities[i] == 0 || R.polarities[i] == 1 || R.polarities[i] == 2 ) {
      let x = "x";
      let y = "y";
      let r = "r";
      x += R.justifications[i].toString();
      y += R.issues[i].toString();
      r += i.toString();

      // console.log(
      //   r,
      //   ' =  (' + x + ', ' +  y + ', ' + V[R.polarities[i]] + ')'
      // );
      console.log(
        r,
        ' =  (' + x + ', ' +  y + ', ' + R.polarities[i] + ')'
      );
    // } else {
    //   console.log("NaR: Not available Reason");
    // }
  }
  console.log('-----------------------');
};

// const printContexts = (C) => {
//   console.log('-------Contexts--------');

//   for (let i = 0; i < C.issues.length; i++) {
//     let x = '';
//     if (C.reasonss[i].length > 0) {
//       C.reasonss[i][0] == 0 ? x = 'r?' : x = 'r' + C.reasonss[i][0].toString();
//       for (let j = 1; j < C.reasonss[i].length; j++) {
//         C.reasonss[i][j] == 0 ? x = x + ', r?' : x = x + ', r' + C.reasonss[i][j].toString();
//       }
//     } 
//     else {
//     }
//     let y = 'y';
//     let c = 'c';
//     C.issues[i] == 0 ? y += '?' : y += C.issues[i].toString();
//     i == 0 ? c += '?' : c += i.toString();
//     console.log(
//       c, ' = ((' + x + '), ' + y + ')'
//     );
//   } 

//   console.log('-----------------------');
// };

const printWeights = (W) => {
  console.log('--------Weights--------');
  // TODO after getWeights is finished
  for (let i = 0; i < W.length; i++) {
      let input = '(r' + i.toString() + ')';
      console.log('f_{w}(' + input + ') = ' + W[i]);
  }

  console.log('------------------------');
};

// const printValuation = (cases, p) => {
//   console.log('-------Valuations-------');

//   const V = ['?', '-', '+'];

//   assert(cases.length == p.length);
//   for (let i = 0; i < p.length; i++) {
//     assert(p[i]<3);
//     const valuation = V[p[i]];
//     console.log('c'+cases[i].toString(), ': ', valuation);    
//   }
  
//   console.log('------------------------');
// };


const printValuation = (p, issue) => {
  console.log('-------Valuations-------');

  const V = ['?', '-', '+'];


  // assert(p<3);
  // const valuation = V[p];
  // console.log('issue: ' + issue.toString() + '; valuated at: ' + valuation);    
  console.log('issue: ' + issue.toString() + '; valuated at: ' + p);    
  
  console.log('------------------------');
};


/*
contract('Balancing debugging', (accounts) => {
  const alpha = accounts[0];
  // const beta = accounts[1];
  // const gamma = accounts[2];
  // const delta = accounts[3];

  it('Test 1', async () => {
    // Connect with Balancing Contract
    const sc = await Balancing.deployed();

    sc.setIssue(1);

    sc.setReputation(alpha, 1);

    const resAlpha10 = await sc.voteOnReason.call(1,1,1,1, {
      from: alpha,
    });
    const resAlpha1 = await sc.voteOnReason(1,1,1,1, {
      from: alpha,
    });
    const resAlpha12 = await sc.voteOnReason.call(1,1,1,1, {
      from: alpha,
    });

    const resAlpha20 = await sc.voteOnReason.call(2,1,2,1, {
      from: alpha,
    });
    const resAlpha2 = await sc.voteOnReason(2,1,2,1, {
      from: alpha,
    });
    const resAlpha22 = await sc.voteOnReason.call(2,1,2,1, {
      from: alpha,
    });

    const resAlpha30 = await sc.voteOnReason.call(3,1,0,1, {
      from: alpha,
    });
    const resAlpha3 = await sc.voteOnReason(3,1,0,1, {
      from: alpha,
    });
    const resAlpha31 = await sc.voteOnReason.call(3,1,0,1, {
      from: alpha,
    });

    const resAlpha4 = await sc.voteOnReason(4,1,0,1, {
      from: alpha,
    });

    // console.log(resAlpha10.toString(), resAlpha1.toString(), resAlpha12.toString());
    // console.log(resAlpha20.toString(), resAlpha2.toString(), resAlpha22.toString());
    // console.log(resAlpha30.toString(), resAlpha3.toString(), resAlpha31.toString());

    const reasons = await sc.getReasons();

    printReasons(reasons);

    // const conAlpha1 = await sc.insertContext([1,2],1, {
    //   from: alpha,
    // });

    // // const conAlpha12 = await sc.insertContext.call([0,1],3, {
    // //   from: alpha,
    // // });

    // const conAlpha2 = await sc.insertContext([35,36],42, {
    //   from: alpha,
    // });
    
    // const contexts = await sc.getContexts();

    // printContexts(contexts);

    // sc.changeWeight(0,0,1,1);
    // const weight = await sc.returnWeight.call(0,0);
    // console.log(weight.toString());

    // const w20 = await sc.returnWeight.call(3,0);
    // console.log(w20.toString());

    // await sc.changeWeight(0,1,1,3);
    // await sc.changeWeight(0,2,1,3);

    // const w21 = await sc.returnWeight.call(3,0);
    // console.log(w21.toString());

    const issue = await sc.getIssue();
    console.log('issue: ' + issue.toString());

    const weights = await sc.getWeights.call(); //*

    //console.log(weights.toString());

    printWeights(weights); //*


    const pa1 = await sc.procedureAdditive.call(); // *

    //console.log(pa1.toString());

    printValuation(pa1, issue); // *

    
  

    // const pa1 = await sc.bla.call(0,1);

    // console.log(pa1.toString());

    // const pa1 = await sc.alb.call(0);

    // console.log(pa1.toString());
    

    // sc.Bla().watch({}, '', function(error, result)) {
    //   console.log(result);
    // }

    // console.log(Array.isArray(contexts.issues));

    // console.log('printing contexts array:');
    // contexts[1].forEach(function(entry) {
    //   console.log(entry.toString());
    // });

  });
});
*/

/*
contract('Balancing 0', (accounts) => {
  const alpha = accounts[0];
  const beta = accounts[1];
  const gamma = accounts[2];

  it('graph 1, IHiBO original', async () => {
    const sc = await Balancing.deployed();

    sc.setIssue(1);

    sc.setReputation(alpha, 1);
    sc.setReputation(beta, 1);
    sc.setReputation(gamma, 1);

    const resAlpha = await sc.voteOnReason(1,1,1,1, {
      from: alpha,
    });
    const resBeta = await sc.voteOnReason(2,1,2,1, {
      from: beta,
    });
    const resGamma = await sc.voteOnReason(3,1,2,1, {
      from: gamma,
    });
    const resBetaSupport = await sc.voteOnReason(3,1,2,1, {
      from: beta,
    });
    const resGammaSupport = await sc.voteOnReason(2,1,2,1, {
      from: gamma,
    });

    // // TODO are these attacks implemented in the example?
    // // i think i chose random polarities for the reasons.
    // // maybe 1 should have polarity 2 and 2 and 3 polarity 1?
    // const edgeAB = await sc.insertAttack(1, 2, '');
    // const edgeBA = await sc.insertAttack(2, 1, '');
    // const edgeAC = await sc.insertAttack(1, 3, '');
    // const edgeCA = await sc.insertAttack(3, 1, '');

    const reasons = await sc.getReasons();
    printReasons(reasons);
    
    const issue = await sc.getIssue();
    // console.log('issue: ' + issue.toString());

    const weights = await sc.getWeights.call();
    printWeights(weights); //*

    const pa1 = await sc.procedureAdditive.call();
    printValuation(pa1, issue);
    
    const g = await sc.getGraph(1);
    printGraph(g);

    // const resReduction1 = await sc.pafReductionToAfPr1();
    // const r1 = await sc.getGraph(2);
    // printGraph(r1);

    // const resReduction3 = await sc.pafReductionToAfPr3();
    // const r3 = await sc.getGraph(3);
    // printGraph(r3);

    // const r4 = await sc.enumeratingPreferredExtensions(3);
    // r4.logs.forEach((element) => {
    //   console.log('***************************************');
    //   console.log(element.args.args);
    // });
  });
});
*/

/*
contract('Balancing 1', (accounts) => {
  const alpha = accounts[0];
  const beta = accounts[1];
  const gamma = accounts[2];

  it('graph 2, related work', async () => {
    const sc = await Balancing.deployed();

    // const resAlpha = await sc.insertArgument('b', {
    //   from: alpha,
    // });
    // const resAlphaGasUsed = resAlpha.receipt.gasUsed;
    // const resBeta = await sc.insertArgument('c', {
    //   from: beta,
    // });
    // const resBetaGasUsed = resBeta.receipt.gasUsed;
    // const resGamma = await sc.insertArgument('d', {
    //   from: gamma,
    // });
    // const resGammaGasUsed = resGamma.receipt.gasUsed;
    // const resAlpha2 = await sc.insertArgument('e', {
    //   from: alpha,
    // });
    // const resAlpha2GasUsed = resAlpha2.receipt.gasUsed;
    // console.log(
    //   'insertArgument(): ',
    //   (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resAlpha2GasUsed) /
    //     4
    // );

    // const resBetaSupport = await sc.supportArgument(3, {
    //   from: beta,
    // });
    // const resBetaSupportGasUsed = resBetaSupport.receipt.gasUsed;
    // const resGammaSupport = await sc.supportArgument(2, {
    //   from: gamma,
    // });
    // const resGammaSupportGasUsed = resGammaSupport.receipt.gasUsed;
    // console.log(
    //   'supportArgument(): ',
    //   (resBetaSupportGasUsed + resGammaSupportGasUsed) / 2
    // );

    // const edgeBC = await sc.insertAttack(1, 2, '');
    // const edgeBCGasUsed = edgeBC.receipt.gasUsed;
    // const edgeCD = await sc.insertAttack(2, 3, '');
    // const edgeCDGasUsed = edgeCD.receipt.gasUsed;
    // const edgeCE = await sc.insertAttack(2, 4, '');
    // const edgeCEGasUsed = edgeCE.receipt.gasUsed;
    // const edgeDB = await sc.insertAttack(3, 1, '');
    // const edgeDBGasUsed = edgeDB.receipt.gasUsed;
    // const edgeED = await sc.insertAttack(4, 3, '');
    // const edgeEDGasUsed = edgeED.receipt.gasUsed;
    // console.log(
    //   'insertAttack(): ',
    //   (edgeBCGasUsed +
    //     edgeCDGasUsed +
    //     edgeCEGasUsed +
    //     edgeDBGasUsed +
    //     edgeEDGasUsed) /
    //     5
    // );

    sc.setIssue(1);

    sc.setReputation(alpha, 1);
    sc.setReputation(beta, 1);
    sc.setReputation(gamma, 1);


    // not clear how to translate the attack relations to +/- issue
    const resAlpha = await sc.voteOnReason(2,1,0,1, {
      from: alpha,
    });
    const resAlpha2 = await sc.voteOnReason(5,1,0,1, {
      from: gamma,
    });
    const resBeta = await sc.voteOnReason(3,1,0,1, {
      from: beta,
    });
    const resBeta2 = await sc.voteOnReason(4,1,0,1, {
      from: beta,
    });
    const resGamma = await sc.voteOnReason(4,1,0,1, {
      from: gamma,
    });
    const resGamma2 = await sc.voteOnReason(3,1,0,1, {
      from: gamma,
    });

    const reasons = await sc.getReasons();
    printReasons(reasons);
    
    const issue = await sc.getIssue();
    // console.log('issue: ' + issue.toString());

    const weights = await sc.getWeights.call();
    printWeights(weights); //*

    const pa1 = await sc.procedureAdditive.call();
    printValuation(pa1, issue);
    

    // const g = await sc.getGraph(1);
    // printGraph(g);

    // const resReduction3 = await sc.pafReductionToAfPr3();
    // const r3 = await sc.getGraph(2);
    // printGraph(r3);
    // const resReduction3GasUsed = resReduction3.receipt.gasUsed;
    // console.log('pafReductionToAfPr3(): ', resReduction3GasUsed);

    // const r4 = await sc.enumeratingPreferredExtensions(2);
    // r4.logs.forEach((element) => {
    //   console.log('*************************************');
    //   console.log(element.args.args);
    // });
    // const r4GasUsed = r4.receipt.gasUsed;
    // console.log('enumeratingPreferredExtensions(): ', r4GasUsed);
  });
});
*/

/*
contract('Balancing 2', (accounts) => {
  const alpha = accounts[0];
  const beta = accounts[1];
  const gamma = accounts[2];

  it('graph 3, new graph', async () => {
    const sc = await Balancing.deployed();

    // const resAlpha = await sc.insertArgument('a', {
    //   from: alpha,
    // });
    // const resAlphaGasUsed = resAlpha.receipt.gasUsed;
    // const resGamma = await sc.insertArgument('b', {
    //   from: gamma,
    // });
    // const resGammaGasUsed = resGamma.receipt.gasUsed;
    // const resBeta = await sc.insertArgument('c', {
    //   from: beta,
    // });
    // const resBetaGasUsed = resBeta.receipt.gasUsed;
    // const resGamma2 = await sc.insertArgument('d', {
    //   from: gamma,
    // });
    // const resGamma2GasUsed = resGamma2.receipt.gasUsed;
    // console.log(
    //   'insertArgument(): ',
    //   (resAlphaGasUsed + resBetaGasUsed + resGammaGasUsed + resGamma2GasUsed) /
    //     4
    // );

    // const resBetaSupport = await sc.supportArgument(1, {
    //   from: beta,
    // });
    // const resBetaSupportGasUsed = resBetaSupport.receipt.gasUsed;
    // const resAlphaSupport = await sc.supportArgument(3, {
    //   from: alpha,
    // });
    // const resAlphaSupportGasUsed = resAlphaSupport.receipt.gasUsed;
    // console.log(
    //   'supportArgument(): ',
    //   (resBetaSupportGasUsed + resAlphaSupportGasUsed) / 2
    // );

    // const edgeGasUsed = [];
    // const edgeAB = await sc.insertAttack(1, 2, '');
    // edgeGasUsed.push(edgeAB.receipt.gasUsed);
    // const edgeAC = await sc.insertAttack(1, 3, '');
    // edgeGasUsed.push(edgeAC.receipt.gasUsed);
    // const edgeAD = await sc.insertAttack(1, 4, '');
    // edgeGasUsed.push(edgeAD.receipt.gasUsed);

    // const edgeBA = await sc.insertAttack(2, 1, '');
    // edgeGasUsed.push(edgeBA.receipt.gasUsed);
    // const edgeBC = await sc.insertAttack(2, 3, '');
    // edgeGasUsed.push(edgeBC.receipt.gasUsed);
    // const edgeBD = await sc.insertAttack(2, 4, '');
    // edgeGasUsed.push(edgeBD.receipt.gasUsed);

    // const edgeCA = await sc.insertAttack(3, 1, '');
    // edgeGasUsed.push(edgeCA.receipt.gasUsed);
    // const edgeCB = await sc.insertAttack(3, 2, '');
    // edgeGasUsed.push(edgeCB.receipt.gasUsed);
    // const edgeCD = await sc.insertAttack(3, 4, '');
    // edgeGasUsed.push(edgeCD.receipt.gasUsed);

    // const edgeDA = await sc.insertAttack(4, 1, '');
    // edgeGasUsed.push(edgeDA.receipt.gasUsed);
    // const edgeDB = await sc.insertAttack(4, 2, '');
    // edgeGasUsed.push(edgeDB.receipt.gasUsed);
    // const edgeDC = await sc.insertAttack(4, 3, '');
    // edgeGasUsed.push(edgeDC.receipt.gasUsed);

    
    sc.setIssue(1);

    sc.setReputation(alpha, 1);
    sc.setReputation(beta, 1);
    sc.setReputation(gamma, 1);


    // not clear how to translate the attack relations to +/- issue
    const resAlpha = await sc.voteOnReason(1,1,0,1, {
      from: alpha,
    });
    const resAlpha2 = await sc.voteOnReason(3,1,0,1, {
      from: gamma,
    });
    const resBeta = await sc.voteOnReason(3,1,0,1, {
      from: beta,
    });
    const resBeta2 = await sc.voteOnReason(1,1,0,1, {
      from: beta,
    });
    const resGamma = await sc.voteOnReason(2,1,0,1, {
      from: gamma,
    });
    const resGamma2 = await sc.voteOnReason(4,1,0,1, {
      from: gamma,
    });

    const reasons = await sc.getReasons();
    printReasons(reasons);
    
    const issue = await sc.getIssue();
    // console.log('issue: ' + issue.toString());

    const weights = await sc.getWeights.call();
    printWeights(weights); 

    const pa1 = await sc.procedureAdditive.call();
    printValuation(pa1, issue);
    

    // let avgGasUsed = 0;
    // for (const gu of edgeGasUsed) {
    //   avgGasUsed += gu;
    // }
    // avgGasUsed /= edgeGasUsed.length;
    // console.log('insertAttack(): ', avgGasUsed);

    // const g = await sc.getGraph(1);
    // printGraph(g);

    // const resReduction3 = await sc.pafReductionToAfPr1();
    // const r3 = await sc.getGraph(2);
    // printGraph(r3);
    // const resReduction3GasUsed = resReduction3.receipt.gasUsed;
    // console.log('pafReductionToAfPr1(): ', resReduction3GasUsed);

    // const r4 = await sc.enumeratingPreferredExtensions(2);
    // r4.logs.forEach((element) => {
    //   console.log('*************************************');
    //   console.log(element.args.args);
    // });
    // const r4GasUsed = r4.receipt.gasUsed;
    // console.log('enumeratingPreferredExtensions(): ', r4GasUsed);
  });
});
 */



/*


// fs.writeFileSync(
//   filepath,
//   `${'nodesNumber'}, ${'voteP'}, ${'GasUsed'}, ${'agents'}\n`,
//   { flag: 'a' }
// );


let nodes = [5, 10, 15, 20];
let nod = 3;
let epochs = 2;
// let epochs = Math.floor(30/nodes[nod]);
// let epochs = 60;

for (let i = 0; i < epochs; i++) {
  contract('Balancing N; epoch: ' + i, (accounts) => {
    const alpha = accounts[0];
    const beta = accounts[1];
    const gamma = accounts[2];
    const delta = accounts[3];
    const epislon = accounts[4];
    const zeta = accounts[5];
    const eta = accounts[6];
    const theta = accounts[7];
    const iota = accounts[8];
    const kappa = accounts[9];

    const nodesNumber = nodes[nod];
    let c = '1';
    let ag = 3;
    let voteP = 0.65;
    let rs = 0;
    let cF1 = 0;
    let cF2 = 0;

    it('random graphs', async () => {
      const sc = await Balancing.deployed();


      sc.setIssue(c);

      sc.setReputation(1, alpha, {from: iota});
      sc.setReputation(1, beta, {from: iota});
      sc.setReputation(1, gamma, {from: iota});
  
      for (let j = 0; rs < nodesNumber; j++) {
        cF1 = 0;
        cF2 = 0;
        cF3 = 0;
        cF4 = 0;
        cF5 = 0;
        for (let k = 0; k < ag; k++) {
          if (Math.random() < voteP) {
            // console.log('k: ' + k);
            let p = Math.random();
            // negative -- reason
            if (p < 0.2) {
              // console.log('p: ' + p);
              if (cF1 == 1) {
                const res = await sc.voteOnReason(String(j),String(c),'--',1, {
                  from: accounts[k],
                }); 
                // console.log('vote');
              } else if (rs+cF1+cF2+cF3+cF4+cF5 < nodesNumber) {
                const res = await sc.voteOnReason(String(j),String(c),'--',1, {
                  from: accounts[k],
                }); 
                cF1 = 1;
                // console.log('create');
              }
            }
            // negative - reason
            else if (p < 0.4) {
              // console.log('p: ' + p);
              if (cF2 == 1) {
                const res = await sc.voteOnReason(String(j),String(c),'-',1, {
                  from: accounts[k],
                }); 
                // console.log('vote');
              } else if (rs+cF1+cF2+cF3+cF4+cF5 < nodesNumber) {
                const res = await sc.voteOnReason(String(j),String(c),'-',1, {
                  from: accounts[k],
                }); 
                cF2 = 1;
                // console.log('create');
              }
            }
            // neutral 0 reason
            else if (p < 0.6) {
              // console.log('p: ' + p);
              if (cF3 == 1) {
                const res = await sc.voteOnReason(String(j),String(c),'0',1, {
                  from: accounts[k],
                }); 
                // console.log('vote');
              } else if (rs+cF1+cF2+cF3+cF4+cF5 < nodesNumber) {
                const res = await sc.voteOnReason(String(j),String(c),'0',1, {
                  from: accounts[k],
                }); 
                cF3 = 1;
                // console.log('create');
              }
            }
            // positive + reason
            else if (p < 0.8) {
              // console.log('p: ' + p);
              if (cF4 == 1) {
                const res = await sc.voteOnReason(String(j),String(c),'+',1, {
                  from: accounts[k],
                }); 
                // console.log('vote');
              } else if (rs+cF1+cF2+cF3+cF4+cF5 < nodesNumber) {
                const res = await sc.voteOnReason(String(j),String(c),'+',1, {
                  from: accounts[k],
                }); 
                cF4 = 1;
                // console.log('create');
              }
            }
            // positive ++ reason
            else {
              // console.log('p: ' + p);
              if (cF5 == 1) {
                const res = await sc.voteOnReason(String(j),String(c),'++',1, {
                  from: accounts[k],
                }); 
                // console.log('vote');
              } else if (rs+cF1+cF2+cF3+cF4+cF5 < nodesNumber) {
                const res = await sc.voteOnReason(String(j),String(c),'++',1, {
                  from: accounts[k],
                }); 
                cF5 = 1;
                // console.log('create');
              }
            }
          }
        }
        rs += cF1 + cF2 + cF3 + cF4 + cF5;
      }

      const reasons = await sc.getReasons();
      printReasons(reasons);
      
      const issue = await sc.getIssue();
      // console.log('issue: ' + issue.toString());
  
      const weights = await sc.getWeights.call();
      printWeights(weights); 
  
      const pa1 = await sc.procedureAdditive.call();
      printValuation(pa1, issue);  
      const pa2 = await sc.procedureAdditive();
      // console.log(pa2);
      const GasUsed = pa2.receipt.gasUsed;
      console.log(GasUsed);


      fs.writeFileSync(
        filepath,
        `${nodesNumber}, ${voteP}, ${GasUsed}, ${ag}\n`,
        { flag: 'a' }
      );

    });
  });
}

*/
