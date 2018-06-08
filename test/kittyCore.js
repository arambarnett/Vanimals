const KittyCore = artifacts.require('KittyCore');

contract('KittyCore', async accounts => {
	it('should start with correct ceoAddress', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.ceoAddress();

		assert.equal(response, '0x627306090abab3a6e1400e9345bc60c78a8bef57');
	});

	it('should start with correct cooAddress', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.cooAddress();

		assert.equal(response, '0x627306090abab3a6e1400e9345bc60c78a8bef57');
	});

	it('should start with correct cfoAddress', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.cfoAddress();

		assert.equal(response, '0x0000000000000000000000000000000000000000');
	});

	it('should start with correct autoBirthFee', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.autoBirthFee();

		assert.equal(response.valueOf(), 2000000000000000); // 2 Finney
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

		assert.equal(response.valueOf(), 10000000000000000); // 10 Finney
	});

	it('should start with correct gen0CreatedCount', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.gen0CreatedCount();

		assert.equal(response.valueOf(), 0);
	});

	it('should start with correct geneScience', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.geneScience();

		assert.equal(response, '0x0000000000000000000000000000000000000000');
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

	it('should start paused', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.paused();

		assert.equal(response, true);
	});

	it('should start with 0 pregnantKitties', async () => {
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

		assert.equal(response, '0x0000000000000000000000000000000000000000');
	});

	it('should start with correct secondsPerBlock', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.secondsPerBlock();

		assert.equal(response.valueOf(), 15);
	});

	it('should start with 0 siring auction', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.siringAuction();

		assert.equal(response, 0);
	});

	it('should start with correct symbol', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.symbol();

		assert.equal(response, 'CK');
	});

	it('should start with 0 total supply', async () => {
		const instance = await KittyCore.deployed();
		const response = await instance.totalSupply();

		assert.equal(response, 0);
	});
});
