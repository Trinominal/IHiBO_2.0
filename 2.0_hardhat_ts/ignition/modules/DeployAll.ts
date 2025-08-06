import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("DeployAll", (m) => {
  const argumentation = m.contract("Argumentation");
  const negotiation = m.contract("Negotiation")
  const balancing = m.contract("Balancing");

  return {
    argumentation,
    negotiation,
    balancing,
  };
});
