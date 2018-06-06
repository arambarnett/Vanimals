#!/usr/bin/env node

const solc = require('solc');
const fs = require('fs');

function findImports(path) {
	return { contents: fs.readFileSync(`contracts/${path}`).toString() };
}

const vanimalCore = fs.readFileSync(`contracts/KittyCore.sol`).toString();
const input = { 'KittyCore.sol': vanimalCore };

const output = solc.compile({ sources: input }, 0, findImports);

console.log(JSON.stringify(output.errors, null, 2));

Object.keys(output.contracts).forEach(name => {
	const abi = output.contracts[name].interface;
	const bytecode = output.contracts[name].bytecode;

	name = name.split(':')[1];

	fs.writeFileSync(`contracts/build/${name}.abi`, abi);
	console.log(`wrote contracts/build/${name}.abi`);

	fs.writeFileSync(`contracts/build/${name}.bytecode`, bytecode);
	console.log(`wrote contracts/build/${name}.bytecode`);
});
