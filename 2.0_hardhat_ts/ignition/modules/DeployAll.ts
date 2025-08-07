import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("DeployAll", (m) => {
  // const argumentation = m.contract("Argumentation");
  // const negotiation = m.contract("Negotiation");
  // const balancing = m.contract("Balancing");
  const balanceBasedDetachment = m.contract("BalanceBasedDetachment");

  return {
    // argumentation,
    // negotiation,
    // balancing,
    balanceBasedDetachment,
  };
});
