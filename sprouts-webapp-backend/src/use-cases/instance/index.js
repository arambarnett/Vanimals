const MintCkb = require("./mint-ckb");
const Mint = require("./mint");
const GetAll = require("./getAll");
const Get = require("./get");

module.exports = (dependencies) => ({
  mintCkb: MintCkb(dependencies),
  mint: Mint(dependencies),
  getAll: GetAll(dependencies),
  get: Get(dependencies),
});
