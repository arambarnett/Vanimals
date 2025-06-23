const { random } = require("lodash");
const axios = require("axios");
const { generateRandomAvatar } = require("../../utils");
const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { User, AuthenticationMethod } },
  logger,
  aws
}) => async ({ authenticationMethod }, defaults) => {

  let user = await User
    .findOne({
      include: {
        model: AuthenticationMethod,
        where: authenticationMethod,
      }
    });
  
  if (user) {
    const authMethodIsPaired = user.authenticationMethods
      .some((authMethod) => authMethod.value === authenticationMethod.value);
    if (!authMethodIsPaired) {
      await AuthenticationMethod.create({
        ...authenticationMethod,
        userId: user.id,
      });
    }
  } else {
    if (authenticationMethod.method !== "metamask") throw new ApplicationError("USER_NEED_TO_CREATE_WITH_METAMASK");
    
    user = new User({
      ...defaults,
    });

    const newAuthMethod = new AuthenticationMethod({
      ...authenticationMethod,
      userId: user.id
    });
      
    let bufferImage;
      
    if (defaults.pictureUrl) {
      const picture = await axios.get(defaults.pictureUrl, { responseType: "arraybuffer" });
      bufferImage = Buffer.from(picture.data);
    } else {
      bufferImage = await generateRandomAvatar(user.username);
    }
      
    const { Location: avatar } = await aws.uploadFile(
      ["users", user.id, "avatars"],
      bufferImage,
      { userId: user.id },
    );

    user.avatar = avatar;
    try {
      await user.save();
      await newAuthMethod.save();
    } catch (err) {
      user.username = user.username + random(0, 9);
      await user.save();
      logger.info(user.toJSON(), authenticationMethod, newAuthMethod.toJSON());
      await newAuthMethod.save();
    }
  }
   
  const authenticationMethods = await AuthenticationMethod.findAll({
    userId: user.id
  });

  return {
    ...user.toJSON(),
    authenticationMethods
  };
};
