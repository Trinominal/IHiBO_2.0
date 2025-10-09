import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BalancingModule", (m) => {
  const balancing = m.contract("Balancing");

  // m.call(detachment, "detachBy", [5n]);

  return { balancing };
});


// import { buildModule } from "@nomicfoundation/ignition-core";

// export default buildModule("DeployAll", (m) => {
//   // const argumentation = m.contract("Argumentation");
//   // const negotiation = m.contract("Negotiation");
//   // const balancing = m.contract("Balancing");
//   const balanceBasedDetachment = m.contract("BalanceBasedDetachment");

//   return {
//     // argumentation,
//     // negotiation,
//     // balancing,
//     balanceBasedDetachment,
//   };
// });
