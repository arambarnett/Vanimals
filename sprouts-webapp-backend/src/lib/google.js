const { OAuth2Client } = require("google-auth-library");
// const GeoCoder = require("node-geocoder");

/* eslint-disable-next-line no-inline-comments */
module.exports = async ({ /* OAUTH_SECRET, */ CLIENT_ID }) => {
  // const geocoder = GeoCoder({
  //   provider: "google",
  //   apiKey: API_KEY,
  // });

  // const getLocationFromCoordinates = async (coordinates) => {
  //   const [result] = await geocoder.reverse({
  //     lat: coordinates.latitude,
  //     lon: coordinates.longitude
  //   });
  //   const {
  //     extra: {
  //       neighborhood
  //     },
  //     country,
  //     administrativeLevels: {
  //       level1long: state,
  //       level2long: zone,
  //     },
  //     city,
  //     zipcode
  //   } = result;
  //   return ({
  //     country,
  //     state,
  //     city,
  //     zipcode,
  //     zone: neighborhood || zone
  //   });
  // };

  /**
   * @typedef {Object} googleData
   * @property {String} iss
   * @property {String} azp
   * @property {String} sub - userId
   * @property {String} email
   * @property {boolean} email_verified
   * @property {String} at_hash
   * @property {String} name
   * @property {String} picture
   * @property {String} given_name
   * @property {String} family_name
   * @property {String} locale
   * @property {int} iat
   * @property {int} exp
   * @property {String} jti
   */

  /**
   * Use the user's authentication code to obtain their data and return it.
   *
   * @param {String} tokenId
   * @returns {Promise<googledData>} 					Discord data.
   */
  const getAccountByToken = async (tokenId) => {
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: userId, email, email_verified, given_name, family_name, picture } = payload;
    const response = {
      accountId: userId,
      email,
      emailVerified: email_verified,
      givenName: given_name,
      familyName: family_name,
      pictureUrl: picture
    };
    return response;
  };

  return {
    getAccountByToken,
    // getLocationFromCoordinates
  };
};
