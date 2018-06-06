#!/usr/bin/env node

const solc = require('solc');
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const schema = [
	{
		name: 'contract',
		alias: 'c',
		type: String,
		defaultValue: 'contracts/KittyCore.sol'
	}
];

const args = commandLineArgs(schema);

function findImports(path) {
	return { contents: fs.readFileSync(`contracts/${path}`).toString() };
}

const contract = fs.readFileSync(args.contract).toString();
const input = { 'contract.sol': contract };

const output = solc.compile({ sources: input }, 0, findImports);

console.log(JSON.stringify(output.errors, null, 2));

const key = Object.keys(output.contracts).find(k => k.includes('contract.sol'));
const abi = output.contracts[key].interface;
const bytecode = output.contracts[key].bytecode;
const name = key.split(':')[1];

fs.writeFileSync(`contracts/build/${name}.abi`, abi);
console.log(`wrote contracts/build/${name}.abi`);

fs.writeFileSync(`contracts/build/${name}.bytecode`, bytecode);
console.log(`wrote contracts/build/${name}.bytecode`);
