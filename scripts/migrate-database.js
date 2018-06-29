#!/usr/bin/env node

require('dotenv').config();

const fs = require('fs');
const postgrator = require('js-base-lib/lib/Postgrator');

postgrator
	.migrate()
	.then(appliedMigrations => console.log(appliedMigrations))
	.then(() => process.exit(0));
