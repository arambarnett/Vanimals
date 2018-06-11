require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const ethUnit = require('ethjs-unit');

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1',
			port: 9545,
			network_id: '*',
			gasPrice: ethUnit.toWei(.1, 'gwei')
		},
		rinkeby: {
			provider: function() {
				return new HDWalletProvider(
					process.env.MNEMONIC_PHRASE,
					'https://rinkeby.infura.io/01dJIr88UVq6pLzueOSW'
				);
			},
			network_id: '*',
			gasPrice: ethUnit.toWei(.1, 'gwei')
		},
		production: {
			host: '127.0.0.1',
			port: 9545,
			network_id: '*',
			gasPrice: ethUnit.toWei(.1, 'gwei')
		},
	}
};
