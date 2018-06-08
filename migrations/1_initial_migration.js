var Migrations = artifacts.require('./Migrations.sol');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(Migrations);
};
