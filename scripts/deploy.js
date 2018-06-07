#!/usr/bin/env node

require('dotenv').config();

const ethers = require('ethers');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const prompt = require('prompt-async');

const schema = [
	{
		name: 'abi',
		alias: 'a',
		type: String,
		defaultValue: 'contracts/build/KittyCore.abi'
	},
	{
		name: 'bytecode',
		alias: 'b',
		type: String,
		defaultValue: 'contracts/build/KittyCore.bytecode'
	},
	{ name: 'gasLimit', alias: 'l', type: Number, defaultValue: 5000000 },
	{ name: 'gasPrice', alias: 'p', type: Number, defaultValue: 1000000000 }
];

const args = commandLineArgs(schema);

const abi = fs.readFileSync(args.abi).toString();
const bytecode = `0x${fs.readFileSync(args.bytecode).toString()}`;

const wallet = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC_PHRASE);
wallet.provider = ethers.providers.getDefaultProvider(process.env.ETHEREUM_NETWORK);

const transaction = ethers.Contract.getDeployTransaction(bytecode, abi);
Object.assign(transaction, { gasPrice: args.gasPrice, gasLimit: args.gasLimit });

console.log(
	`Deploying this contract could cost up to ${ethers.utils.formatEther(
		ethers.utils.bigNumberify(transaction.gasLimit).mul(transaction.gasPrice)
	)} ETH.\nAre you sure you want to proceed?\nType 'yes' to continue\n`
);

deploy();

async function deploy() {
	const { run } = await prompt.get(['run']);

	if (run !== 'yes') {
		return console.log('Aborted Contract Deploy');
	}

	const deployedContract = await wallet.sendTransaction(transaction);
	console.log('Contract Submitted. Transaction Hash', deployedContract.hash);

	const response = await deployedContract.wait();
	console.log(
		'Contract Mined.',
		`https://${
			process.env.ETHEREUM_NETWORK ? process.env.ETHEREUM_NETWORK + '.' : ''
		}etherscan.io/tx/${response.hash}`
	);
}
