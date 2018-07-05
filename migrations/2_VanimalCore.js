const VanimalCore = artifacts.require('./VanimalCore.sol');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(VanimalCore);
};
