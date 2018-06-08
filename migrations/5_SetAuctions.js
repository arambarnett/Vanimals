const SiringAuction = artifacts.require('./SiringClockAuction');
const SaleAuction = artifacts.require('./SaleClockAuction');
const KittyCore = artifacts.require('./KittyCore');

module.exports = async (deployer, network, accounts) => {
	const instance = await KittyCore.deployed();

	await instance.setSaleAuctionAddress(SaleAuction.address)
	await instance.setSiringAuctionAddress(SiringAuction.address)
};
