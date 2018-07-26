const VanimalCore = artifacts.require('./VanimalCore');
const VanimalCoreSaleAuction = artifacts.require('./VanimalCoreSaleAuction');
const VanimalCoreSiringAuction = artifacts.require('./VanimalCoreSiringAuction');
const GeneScience = artifacts.require('./GeneScience');

module.exports = async (deployer, network, accounts) => {
	const vanimal = await VanimalCore.deployed();

	await vanimal.setCFO(accounts[0]);
	await vanimal.setSaleAuctionAddress(VanimalCoreSaleAuction.address);
	await vanimal.setSiringAuctionAddress(VanimalCoreSiringAuction.address);
	await vanimal.setGeneScienceAddress(GeneScience.address);
	await vanimal.unpause();
};
