const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((user, done) => {
	done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.Postgres.findById(id);

		if (!user) {
			return done(null, false);
		}

		return done(null, user);
	} catch (e) {
		done(e);
	}
});
