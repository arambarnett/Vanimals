const KittyCore = artifacts.require('KittyCore');
const SiringAuction = artifacts.require('./SiringClockAuction');
const SaleAuction = artifacts.require('./SaleClockAuction');
const GeneScience = artifacts.require('./GeneScience');

const ethUnit = require('ethjs-unit');

contract('KittyCore', async accounts => {
	it('should start with correct ceoAddress', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.ceoAddress();

		assert.equal(response, accounts[0]);
	});

	it('should start with correct cooAddress', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.cooAddress();

		assert.equal(response, accounts[0]);
	});

	it('should start with correct cfoAddress', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.cfoAddress();

		assert.equal(response, accounts[0]);
	});

	it('should start with correct autoBirthFee', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.autoBirthFee();

		assert.equal(response.valueOf(), ethUnit.toWei(2, 'finney'));
	});

	it('should start with correct erc721Metadata', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.erc721Metadata();

		assert.equal(response, '0x0000000000000000000000000000000000000000');
	});

	it('should start with correct GEN0_AUCTION_DURATION', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.GEN0_AUCTION_DURATION();

		assert.equal(response.valueOf(), 86400);
	});

	it('should start with correct GEN0_CREATION_LIMIT', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.GEN0_CREATION_LIMIT();

		assert.equal(response.toString(), 45000);
	});

	it('should start with correct GEN0_STARTING_PRICE', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.GEN0_STARTING_PRICE();

		assert.equal(response.valueOf(), ethUnit.toWei(10, 'finney'));
	});

	it('should start with correct gen0CreatedCount', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.gen0CreatedCount();

		assert.equal(response.valueOf(), 0);
	});

	it('should start with correct geneScience', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.geneScience();

		assert.equal(response, GeneScience.address);
	});

	it('should start with correct name', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.name();

		assert.equal(response, 'CryptoKitties');
	});

	it('should start with correct newContractAddress', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.newContractAddress();

		assert.equal(response, '0x0000000000000000000000000000000000000000');
	});

	it('should start with correct paused', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.paused();

		assert.equal(response, true);
	});

	it('should start with correct pregnantKitties', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.pregnantKitties();

		assert.equal(response.valueOf(), 0);
	});

	it('should start with correct PROMO_CREATION_LIMIT', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.PROMO_CREATION_LIMIT();

		assert.equal(response.valueOf(), 5000);
	});

	it('should start with correct promoCreatedCount', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.promoCreatedCount();

		assert.equal(response.valueOf(), 0);
	});

	it('should start with correct saleAuction', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.saleAuction();

		assert.equal(response, SaleAuction.address);
	});

	it('should start with correct secondsPerBlock', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.secondsPerBlock();

		assert.equal(response.valueOf(), 15);
	});

	it('should start with correct siringAuction', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.siringAuction();

		assert.equal(response, SiringAuction.address);
	});

	it('should start with correct symbol', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.symbol();

		assert.equal(response, 'CK');
	});

	it('should start with correct totalSupply', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.totalSupply();

		assert.equal(response, 0);
	});

	it('should setAutoBirthFee correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setAutoBirthFee(100);
		let response = await instance.autoBirthFee();

		assert.equal(response.valueOf(), 100);
	});

	it('should setCEO correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setCEO(accounts[1]);
		let response = await instance.ceoAddress();

		assert.equal(response, accounts[1]);

		await instance.setCEO(accounts[0], { from: accounts[1] });
		response = await instance.ceoAddress();

		assert.equal(response, accounts[0]);
	});

	it('should setCFO correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setCFO(accounts[1]);
		let response = await instance.cfoAddress();

		assert.equal(response, accounts[1]);

		await instance.setCFO(accounts[0]);
		response = await instance.cfoAddress();

		assert.equal(response, accounts[0]);
	});

	it('should setCOO correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setCOO(accounts[1]);
		let response = await instance.cooAddress();

		assert.equal(response, accounts[1]);

		await instance.setCOO(accounts[0]);
		response = await instance.cooAddress();

		assert.equal(response, accounts[0]);
	});

	it('should setGeneScienceAddress correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setGeneScienceAddress(GeneScience.address);
		let response = await instance.geneScience();

		assert.equal(response, GeneScience.address);
	});

	it('should setMetadataAddress correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setMetadataAddress('0x0000000000000000000000000000000000000001');
		let response = await instance.erc721Metadata();

		assert.equal(response, '0x0000000000000000000000000000000000000001');
	});

	it('should setNewAddress correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setNewAddress('0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef');
		let response = await instance.newContractAddress();

		assert.equal(response, '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef');

		await instance.setNewAddress('0x0000000000000000000000000000000000000000');
		response = await instance.newContractAddress();

		assert.equal(response, '0x0000000000000000000000000000000000000000');
	});

	it('should setSaleAuctionAddress correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setSaleAuctionAddress(SaleAuction.address);
		let response = await instance.saleAuction();

		assert.equal(response, SaleAuction.address);
	});

	it('should setSecondsPerBlock correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setSecondsPerBlock(10);
		let response = await instance.secondsPerBlock();

		assert.equal(response.valueOf(), 10);
	});

	it('should setSiringAuctionAddress correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.setSiringAuctionAddress(SiringAuction.address);
		let response = await instance.siringAuction();

		assert.equal(response, SiringAuction.address);
	});

	it('should unpause correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.unpause();
		let response = await instance.paused();

		assert.equal(response, false);
	});

	it('should pause correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.pause();
		let response = await instance.paused();

		assert.equal(response, true);
		await instance.unpause();
	});

	it('should createGen0Auction correctly', async () => {
		const instance = await KittyCore.deployed();

		await instance.createGen0Auction(1);
		await instance.createGen0Auction(1);
	});

	it('should totalSupply correctly', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.totalSupply();

		assert.equal(response.valueOf(), 2);
	});

	it('should getKitty correctly', async () => {
		const instance = await KittyCore.deployed();
		let response = await instance.getKitty(1);

		assert.equal(!!response, true);
	});

	it('should getKitty correctly', async () => {
		const instance = await KittyCore.deployed();
		let response = await instance.getKitty(1);

		assert.equal(!!response, true);
	});

	it('should start with correct isSaleClockAuction', async () => {
		const instance = await SaleAuction.deployed();
		const response = await instance.isSaleClockAuction();

		assert.equal(response, true);
	});

	it('should start with correct paused', async () => {
		const instance = await SaleAuction.deployed();
		const response = await instance.paused();

		assert.equal(response, false);
	});

	it('should start with correct getAuction', async () => {
		const instance = await SaleAuction.deployed();
		const response = await instance.getAuction(1);

		assert.equal(!!response, true);
	});

	it('should bid correctly', async () => {
		const instance = await SaleAuction.deployed();
		await instance.bid(1, { from: accounts[1], value: ethUnit.toWei(10, 'finney') });
		await instance.bid(2, { from: accounts[1], value: ethUnit.toWei(10, 'finney') });
	});

	it('should gen0SaleCount correctly', async () => {
		const instance = await SaleAuction.deployed();
		const response = await instance.gen0SaleCount();

		assert.equal(response.valueOf(), 2);
	});

	it('should ownerOf correctly', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.ownerOf(1);
		const response2 = await instance.ownerOf(2);

		assert.equal(response, accounts[1]);
		assert.equal(response2, accounts[1]);
	});

	it('should tokensOfOwner correctly', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.tokensOfOwner(accounts[1]);

		assert.equal(response.length, 2);
	});

	it('should isReadyToBreed correctly', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.isReadyToBreed(1);

		assert.equal(response, true);
	});

	it('should canBreedWith correctly', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.canBreedWith(1, 2);

		assert.equal(response, true);
	});

	it('should breedWithAuto correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.breedWithAuto(1, 2, { from: accounts[1], value: ethUnit.toWei(2, 'finney') });
	});

	it('should isPregnant correctly', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.isPregnant(1);

		assert.equal(response, true);
	});

	it('should pregnantKitties correctly', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.pregnantKitties();

		assert.equal(response.valueOf(), 1);
	});

	it('should giveBirth correctly', async () => {
		const instance = await KittyCore.deployed();

		const array = new Array(5);

		for (let i of array) {
			await instance.createGen0Auction(1);
		}

		await instance.giveBirth(1, { from: accounts[1] });

		const response = await instance.tokensOfOwner(accounts[1]);

		assert.equal(response.length, 3);
	});

	it('should transfer correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.transfer(accounts[2], 1, { from: accounts[1] });

		const response = await instance.ownerOf(1);

		assert.equal(response, accounts[2]);
	});

	it('should createSaleAuction correctly', async () => {
		const instance = await KittyCore.deployed();
		const saleContract = await SaleAuction.deployed();

		const price = ethUnit.toWei(1, 'ether').toString();
		await instance.createSaleAuction(2, price, price, 60, { from: accounts[1] });
		await saleContract.bid(2, { from: accounts[2], value: ethUnit.toWei(1, 'ether') });

		const response = await instance.ownerOf(2);

		assert.equal(response, accounts[2]);
	});

	it('should withdrawBalance correctly', async () => {
		const instance = await KittyCore.deployed();
		const saleContract = await SaleAuction.deployed();
		await saleContract.withdrawBalance();
		await instance.withdrawBalance();
	});

	it('should createPromoKitty correctly', async () => {
		const instance = await KittyCore.deployed();
		await instance.createPromoKitty(12, accounts[4]);
	});
});
