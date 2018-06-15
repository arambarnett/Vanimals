#!/usr/bin/env node

const fs = require('fs');
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const version = Date.now();
const schema = [
	{ name: 'name', alias: 'n', type: String },
	{ name: 'help', alias: 'h', type: String },
	{ name: 'type', alias: 't', type: String, defaultValue: 'sql' }
];

const usage = [
	{
		header: 'Migration Create',
		content: 'Generates a migration'
	},
	{
		header: 'Options',
		optionList: [
			{
				name: 'name',
				typeLabel: '[underline]{name}',
				description: 'The name of the migration'
			},
			{
				name: 'type',
				typeLabel: '[underline]{type}',
				description: 'The file type. Accepts (js) and (sql). Defaults to sql.'
			},
			{
				name: 'help',
				description: 'Print this usage guide.'
			}
		]
	}
];

const args = commandLineArgs(schema);

if (args.help === null) {
	console.log(getUsage(usage));
	process.exit();
}

['do', 'undo'].forEach(action => {
	let path = `server/migrations/${version}.${action}`;

	if (args.name) {
		path = path + `.${args.name}`;
	}

	if (args.type === 'js') {
		const content = "'use strict';\n\nmodule.exports.generateSql = function () {\n\t\n};";

		fs.writeFileSync(`${path}.js`, content, { flag: 'w' });
	} else {
		fs.openSync(`${path}.sql`, 'w');
	}
});
