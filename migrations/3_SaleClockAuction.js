const Contract = artifacts.require('./SaleClockAuction.sol');
const KittyCore = artifacts.require('./KittyCore');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(Contract, KittyCore.address, 375); // 3.75% cut
};
