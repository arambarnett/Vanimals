#!/usr/bin/env node

require('dotenv').config();

const fs = require('fs');
const Postgrator = require('js-base-lib/lib/Postgrator');
const postgrator = Postgrator(__dirname + '/../server/migrations');

postgrator
	.migrate()
	.then(appliedMigrations => console.log(appliedMigrations))
	.then(() => process.exit(0));
