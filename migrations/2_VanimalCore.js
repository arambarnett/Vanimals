const VanimalDog = artifacts.require('./VanimalDog.sol');
const VanimalElephant = artifacts.require('./VanimalElephant.sol');
const VanimalPanda = artifacts.require('./VanimalPanda.sol');
const VanimalPigeon = artifacts.require('./VanimalPigeon.sol');
const VanimalSealion = artifacts.require('./VanimalSealion.sol');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(VanimalDog);
	deployer.deploy(VanimalElephant);
	deployer.deploy(VanimalPanda);
	deployer.deploy(VanimalPigeon);
	deployer.deploy(VanimalSealion);
};
