require('dotenv').config();

const Vanimal = require('../models/Vanimal');

(async () => {
	const vanimal = await Vanimal.deployed();

	await vanimal.createPromoKitty(12, '0x627306090abab3a6e1400e9345bc60c78a8bef57', { from: '0x627306090abab3a6e1400e9345bc60c78a8bef57', gasLimit: 1200000, gas: 1200000 });
})();
