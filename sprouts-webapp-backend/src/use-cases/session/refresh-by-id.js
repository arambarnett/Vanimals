const ApplicationError = require("../../errors");
const Sentry = require("@sentry/node");

module.exports = ({
  database: { models: { Session, User, AuthenticationMethod } },
  jwtManager
}) => async (sessionId) => {
  const session = await Session.findOne({
    where: {
      id: sessionId
    },
    include: {
      model: User,
      include: AuthenticationMethod
    }
  });

  if (!session) {
    Sentry.captureMessage(
      "SESSION_NOT_FOUND",
      {
        extra: {
          sessionId
        }
      }
    );
    throw new ApplicationError("SESSION_NOT_FOUND");
  }
  if (!session.user) {
    Sentry.captureMessage(
      "USER_NOT_FOUND",
      {
        extra: {
          sessionId
        }
      }
    );
    throw new ApplicationError("USER_NOT_FOUND");
  }

  const sessionJSON = session.toJSON();

  const accessToken = await jwtManager.signAsync({
    id: session.id,
    user: sessionJSON.user
  });

  return {
    ...sessionJSON,
    accessToken
  };
};
