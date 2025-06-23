const Delete = require("./delete");
const Create = require("./create");
const GetAll = require("./getAll");
const Get = require("./get");

module.exports = (dependencies) => ({
  delete: Delete(dependencies),
  create: Create(dependencies),
  getAll: GetAll(dependencies),
  get: Get(dependencies),
});
