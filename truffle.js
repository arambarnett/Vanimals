require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1',
			port: 9545,
			network_id: '*',
			gasPrice: 100000000 // .1 Gwei
		},
		rinkeby: {
			provider: function() {
				return new HDWalletProvider(
					process.env.MNEMONIC_PHRASE,
					'https://rinkeby.infura.io/01dJIr88UVq6pLzueOSW'
				);
			},
			network_id: '*',
			gasPrice: 100000000 // .1 Gwei
		}
	}
};
