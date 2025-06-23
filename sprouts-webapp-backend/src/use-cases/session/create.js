const isFuture = require("date-fns/isFuture");
const { normalizeUsername, nanoid } = require("../../utils");
const ApplicationError = require("../../errors");
const Sentry = require("@sentry/node");
const Ethers = require("ethers");

module.exports = ({
  database: { models: { Session } },
  google, facebook, jwtManager,
  useCases,
  logger,
}) => {
  const createSessionForUserWithAuthMethod = async (user, authMethod, context) => {
    const session = await Session.create({
      userId: user.id,
      authenticationMethodId: authMethod.id,
      ...context,
    });
    
    const accessToken = await jwtManager.signAsync({
      id: session.id,
      user
    });

    return {
      ...session.toJSON(),
      accessToken,
      user
    };
  };

  const withGoogle = async (token, context) => {
    let googleAccount;
    try {
      googleAccount = await google.getAccountByToken(token);
    } catch (err) {
      logger.error(err);
      Sentry.captureMessage(
        "ERROR_LOGGING_WITH_GOOGLE",
        {
          extra: {
            token
          }
        }
      );
      throw new ApplicationError("ERROR_LOGGING_WITH_GOOGLE");
    }
    const {
      accountId,
      givenName,
      pictureUrl,
      email,
      familyName
    } = googleAccount;
    const authenticationMethod = { method: "google", value: accountId };
    let username = `${givenName || ""}${familyName || ""}`;
    if (username.length < 4) username = email.substring(0, email.indexOf("@"));
    const defaults = {
      username: normalizeUsername(username),
      pictureUrl,
      email,
    };

    const user = await useCases.user.findOrCreate({ authenticationMethod }, defaults);
    const storedAuthMethod = user.authenticationMethods.find((am) => am.value === authenticationMethod.value);
    const session = await createSessionForUserWithAuthMethod(user, storedAuthMethod, context);
    return session;
  };

  const withFacebook = async (token, context) => {
    let facebookProfile;
    try {
      facebookProfile = await facebook.getUser(token);
    } catch (err) {
      logger.error(err);
      Sentry.captureMessage(
        "ERROR_LOGGING_WITH_FACEBOOK",
        {
          extra: {
            token
          }
        }
      );
      throw new ApplicationError("ERROR_LOGGING_WITH_FACEBOOK");
    }
    const { id, email, name, picture } = facebookProfile;
    const authenticationMethod = { method: "facebook", value: id };
    const defaults = {
      username: normalizeUsername(name),
      pictureUrl: picture?.data?.url,
      email
    };
    const user = await useCases.user.findOrCreate({ authenticationMethod }, defaults);
    const storedAuthMethod = user.authenticationMethods.find((am) => am.value === authenticationMethod.value);
    const session = await createSessionForUserWithAuthMethod(user, storedAuthMethod, context);
    return session;
  };

  const withMetamask = async ({ signature, jwt }, context) => {
    const verifiedJwt = await jwtManager.verifyAsync(jwt);
    if (!isFuture(new Date(verifiedJwt.expiresAt))) {
      throw new ApplicationError("JWT_EXPIRED");
    }

    let address;
    try {
      address = Ethers.utils.verifyMessage(verifiedJwt.challenge, signature);
    } catch (err) {
      throw new ApplicationError("INVALID_SIGNATURE");
    }

    const authenticationMethod = { method: "metamask", value: address };
    const defaults = {
      username: nanoid(),
      pictureUrl: null,
      email: null
    };
    const user = await useCases.user.findOrCreate({ authenticationMethod }, defaults);
    const storedAuthMethod = user.authenticationMethods.find((am) => am.value === authenticationMethod.value);
    const session = await createSessionForUserWithAuthMethod(user, storedAuthMethod, context);
    return session;
  };

  return {
    withGoogle,
    withFacebook,
    withMetamask,
  };
};
