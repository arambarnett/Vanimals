const Contract = artifacts.require('./GeneScience.sol');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(Contract);
};
