const VanimalCore = artifacts.require('./VanimalCore');

const VanimalCoreSaleAuction = artifacts.require('./VanimalCoreSaleAuction.sol');
const VanimalCoreSiringAuction = artifacts.require('./VanimalCoreSiringAuction.sol');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(VanimalCoreSaleAuction, VanimalCore.address, 375); // 3.75% cut
	deployer.deploy(VanimalCoreSiringAuction, VanimalCore.address, 375);
};
