const Contract = artifacts.require('./KittyCore.sol');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(Contract);
};
