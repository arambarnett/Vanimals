const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { AuthenticationMethod } },
  facebook,
  google,
}) => async ({ method, token }, { user }) => {
  let id;
  if (method === "google") {
    try {
      const googleAccount = await google.getAccountByToken(token);
      id = googleAccount.accountId;
    } catch (err) {
      throw new ApplicationError("ERROR_LOGGING_WITH_GOOGLE");
    }
  } else {
    try {
      const facebookProfile = await facebook.getUser(token);
      id = facebookProfile.id;
    } catch (err) {
      throw new ApplicationError("ERROR_LOGGING_WITH_FACEBOOK");
    }
  }
  
  if (!id) throw new ApplicationError("ERROR_LINKING_ACCOUNT");
  
  try {
    await AuthenticationMethod.create({
      userId: user.id,
      value: id,
      method,
    });
  } catch (err) {
    throw new ApplicationError("ACCOUNT_ALREADY_LINKED");
  }
};
