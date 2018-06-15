require('dotenv').config();

const Postgrator = require('postgrator');

const postgrator = new Postgrator({
	migrationDirectory: __dirname + '/../migrations',
	driver: 'pg',
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.DATABASE_SSL === 'true',
	schemaTable: '__migrations',
	validateChecksums: false
});

module.exports = postgrator;
