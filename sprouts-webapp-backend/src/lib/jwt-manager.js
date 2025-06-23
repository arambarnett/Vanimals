const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

module.exports = (privateKey) => ({
  signAsync: (blob) => signAsync(blob, privateKey),
  verifyAsync: (blob) => verifyAsync(blob, privateKey),
});
