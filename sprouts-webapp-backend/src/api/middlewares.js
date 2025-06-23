const HttpError = require("http-errors");
const config = require("../config");

module.exports = ({
  jwtManager,
}) => ({
  withAuth: {
    optional: async (req, res, next) => {
      const token = req.headers["authorization"];
      if (token) {
        try {
          const session = await jwtManager.verifyAsync(token);
          if (session.id && session.user) {
            req.locals = {
              ...req.locals,
              session
            };
            return next();
          }
        } catch (err) {
        //
        }
        return next(HttpError.Unauthorized("INVALID_AUTH_TOKEN"));
      }
      return next();
    },
    required: async (req, res, next) => {
      try {
        const token = req.headers["authorization"];
        if (token) {
          const session = await jwtManager.verifyAsync(token);
          if (session.id && session.user) {
            req.locals = {
              ...req.locals,
              session
            };
            return next();
          }
        }
      } catch (err) {
        //
      }
      next(HttpError.Unauthorized("INVALID_AUTH_TOKEN"));
    },
    admin: async (req, res, next) => {
      const token = req.headers["x-admin-token"];
      if (token) {
        const isAdmin = (token === config.ADMIN_SECRET);
        if (isAdmin) {
          req.locals = {
            ...req.locals,
            isAdmin
          };
          return next();
        }
      }
      next(HttpError.Unauthorized("INVALID_AUTH_TOKEN"));
    }
  },
  verifyUserHasRole: (role) => (req, res, next) => {
    if (req.locals.session.user.roles.includes(role)) next();
    else next( HttpError.Unauthorized("USER_MISSING_ROLE"));
  },
});
