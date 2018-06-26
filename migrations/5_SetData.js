const VanimalDog = artifacts.require('./VanimalDog');
const VanimalElephant = artifacts.require('./VanimalElephant');
const VanimalPanda = artifacts.require('./VanimalPanda');
const VanimalPigeon = artifacts.require('./VanimalPigeon');
const VanimalSealion = artifacts.require('./VanimalSealion');

const VanimalDogSaleAuction = artifacts.require('./VanimalDogSaleAuction');
const VanimalElephantSaleAuction = artifacts.require('./VanimalElephantSaleAuction');
const VanimalPandaSaleAuction = artifacts.require('./VanimalPandaSaleAuction');
const VanimalPigeonSaleAuction = artifacts.require('./VanimalPigeonSaleAuction');
const VanimalSealionSaleAuction = artifacts.require('./VanimalSealionSaleAuction');

const VanimalDogSiringAuction = artifacts.require('./VanimalDogSiringAuction');
const VanimalElephantSiringAuction = artifacts.require('./VanimalElephantSiringAuction');
const VanimalPandaSiringAuction = artifacts.require('./VanimalPandaSiringAuction');
const VanimalPigeonSiringAuction = artifacts.require('./VanimalPigeonSiringAuction');
const VanimalSealionSiringAuction = artifacts.require('./VanimalSealionSiringAuction');

const GeneScience = artifacts.require('./GeneScience');

module.exports = async (deployer, network, accounts) => {
	const dog = await VanimalDog.deployed();
	const elephant = await VanimalElephant.deployed();
	const panda = await VanimalPanda.deployed();
	const pigeon = await VanimalPigeon.deployed();
	const sealion = await VanimalSealion.deployed();

	await dog.setCFO(accounts[0]);
	await elephant.setCFO(accounts[0]);
	await panda.setCFO(accounts[0]);
	await pigeon.setCFO(accounts[0]);
	await sealion.setCFO(accounts[0]);

	await dog.setSaleAuctionAddress(VanimalDogSaleAuction.address);
	await elephant.setSaleAuctionAddress(VanimalElephantSaleAuction.address);
	await panda.setSaleAuctionAddress(VanimalPandaSaleAuction.address);
	await pigeon.setSaleAuctionAddress(VanimalPigeonSaleAuction.address);
	await sealion.setSaleAuctionAddress(VanimalSealionSaleAuction.address);

	await dog.setSiringAuctionAddress(VanimalDogSiringAuction.address);
	await elephant.setSiringAuctionAddress(VanimalElephantSiringAuction.address);
	await panda.setSiringAuctionAddress(VanimalPandaSiringAuction.address);
	await pigeon.setSiringAuctionAddress(VanimalPigeonSiringAuction.address);
	await sealion.setSiringAuctionAddress(VanimalSealionSiringAuction.address);

	await dog.setGeneScienceAddress(GeneScience.address);
	await elephant.setGeneScienceAddress(GeneScience.address);
	await panda.setGeneScienceAddress(GeneScience.address);
	await pigeon.setGeneScienceAddress(GeneScience.address);
	await sealion.setGeneScienceAddress(GeneScience.address);
};
