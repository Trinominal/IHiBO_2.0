import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("DeployAll", (m) => {
  // const argumentation = m.contract("Argumentation");
  // const negotiation = m.contract("Negotiation");
  // const tinkering = m.contract("Tinkering");
  // const balancing = m.contract("Balancing");
  const balancing2 = m.contract("Balancing_2");

  return {
    // argumentation,
    // negotiation,
    // tinkering,
    // balancing,
    balancing2,
  };
});
