const Argumentation = artifacts.require('Argumentation');
const Negotiation = artifacts.require('Negotiation');
const Tinkering = artifacts.require('Tinkering');
const Balancing = artifacts.require('Balancing');


module.exports = async () => {
  const argumentation = await Argumentation.new();
  Argumentation.setAsDeployed(argumentation);
  const negotiation = await Negotiation.new();
  Negotiation.setAsDeployed(negotiation);
};