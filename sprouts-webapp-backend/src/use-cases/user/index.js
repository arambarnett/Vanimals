const LinkAuthenticationMethod = require("./link-authentication-method");
const FindOrCreate = require("./find-or-create");
const HardDelete = require("./hard-delete");
const Update = require("./update");
const GetAll = require("./get-all");
const Get = require("./get");

module.exports = (dependencies) => ({
  linkAuthenticationMethod: LinkAuthenticationMethod(dependencies),
  findOrCreate: FindOrCreate(dependencies),
  hardDelete: HardDelete(dependencies),
  update: Update(dependencies),
  getAll: GetAll(dependencies),
  get: Get(dependencies),
});
