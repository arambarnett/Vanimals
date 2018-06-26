const VanimalDog = artifacts.require('./VanimalDog');
const VanimalElephant = artifacts.require('./VanimalElephant');
const VanimalPanda = artifacts.require('./VanimalPanda');
const VanimalPigeon = artifacts.require('./VanimalPigeon');
const VanimalSealion = artifacts.require('./VanimalSealion');

const VanimalDogSaleAuction = artifacts.require('./VanimalDogSaleAuction.sol');
const VanimalElephantSaleAuction = artifacts.require('./VanimalElephantSaleAuction.sol');
const VanimalPandaSaleAuction = artifacts.require('./VanimalPandaSaleAuction.sol');
const VanimalPigeonSaleAuction = artifacts.require('./VanimalPigeonSaleAuction.sol');
const VanimalSealionSaleAuction = artifacts.require('./VanimalSealionSaleAuction.sol');

const VanimalDogSiringAuction = artifacts.require('./VanimalDogSiringAuction.sol');
const VanimalElephantSiringAuction = artifacts.require('./VanimalElephantSiringAuction.sol');
const VanimalPandaSiringAuction = artifacts.require('./VanimalPandaSiringAuction.sol');
const VanimalPigeonSiringAuction = artifacts.require('./VanimalPigeonSiringAuction.sol');
const VanimalSealionSiringAuction = artifacts.require('./VanimalSealionSiringAuction.sol');

module.exports = async (deployer, network, accounts) => {
	deployer.deploy(VanimalDogSaleAuction, VanimalDog.address, 375); // 3.75% cut
	deployer.deploy(VanimalElephantSaleAuction, VanimalElephant.address, 375);
	deployer.deploy(VanimalPandaSaleAuction, VanimalPanda.address, 375);
	deployer.deploy(VanimalPigeonSaleAuction, VanimalPigeon.address, 375);
	deployer.deploy(VanimalSealionSaleAuction, VanimalSealion.address, 375);

	deployer.deploy(VanimalDogSiringAuction, VanimalDog.address, 375);
	deployer.deploy(VanimalElephantSiringAuction, VanimalElephant.address, 375);
	deployer.deploy(VanimalPandaSiringAuction, VanimalPanda.address, 375);
	deployer.deploy(VanimalPigeonSiringAuction, VanimalPigeon.address, 375);
	deployer.deploy(VanimalSealionSiringAuction, VanimalSealion.address, 375);
};
