const axios = require("axios");

module.exports = () => ({
  getUser: async (accessToken) => {
    const url = `https://graph.facebook.com/v9.0/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`;
    const response = await axios(url);
    return response.data;
  }
});
