#!/usr/bin/env node

const postgrator = require('../server/lib/postgrator');
const fs = require('fs');

const files = fs
	.readdirSync('server/migrations')
	.filter(each => each.includes('.do.'))
	.map(each => each.split('.')[0]);

postgrator
	.getDatabaseVersion()
	.then(version => {
		const currentIndex = files.findIndex(each => `${each}` === version);
		const prev = files[currentIndex - 1] || '0';

		return postgrator.migrate(prev);
	})
	.then(appliedMigrations => console.log(appliedMigrations))
	.catch(console.log)
	.then(() => process.exit(0));
