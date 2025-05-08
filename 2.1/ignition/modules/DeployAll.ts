import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("DeployAll", (m) => {
  const argumentation = m.contract("Argumentation");
  const negotiation = m.contract("Negotiation");
  const tinkering = m.contract("Tinkering");
  const balancing = m.contract("Balancing");

  return {
    argumentation,
    negotiation,
    tinkering,
    balancing,
  };
});
