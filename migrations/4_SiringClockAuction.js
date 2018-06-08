const Contract = artifacts.require('./SiringClockAuction.sol');
const KittyCore = artifacts.require('./KittyCore');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(Contract, KittyCore.address, 375); // 3.75% cut
};
