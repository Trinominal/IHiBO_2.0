import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DS_DetachmentModule", (m) => {
  const detachment = m.contract("DS_Detachment");

  // m.call(detachment, "detachBy", [5n]);

  return { detachment };
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
