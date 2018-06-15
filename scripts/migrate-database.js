#!/usr/bin/env node

require('dotenv').config();

const fs = require('fs');
const postgrator = require('../server/lib/postgrator');

postgrator
	.migrate()
	.then(appliedMigrations => console.log(appliedMigrations))
	.then(() => process.exit(0));
