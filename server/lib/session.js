const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const md5 = require('js-md5');

const config = {
	store: new RedisStore({ url: process.env.REDIS_URL }),
	cookie: {
		path: '/',
		maxAge: 86400000
	},
	name: 'vanimals.' + md5(process.env.REDIS_URL),
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	rolling: true
};

module.exports = session(config);
