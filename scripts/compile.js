#!/usr/bin/env node

const solc = require('solc');
const fs = require('fs');

function findImports(path) {
	return { contents: fs.readFileSync(`contracts/${path}`).toString() };
}

const vanimalCore = fs.readFileSync(`contracts/KittyCore.sol`).toString();
const input = { 'VanimalCore.sol': vanimalCore };

const output = solc.compile({ sources: input }, 0, findImports);

console.log(output);

