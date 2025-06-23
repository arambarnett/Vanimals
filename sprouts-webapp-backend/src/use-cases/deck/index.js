const Create = require("./create");
const Delete = require("./delete");
const Remove = require("./remove");
const GetAll = require("./get-all");
const Get = require("./get");
const Add = require("./add");

module.exports = (dependencies) => ({
  create: Create(dependencies),
  delete: Delete(dependencies),
  remove: Remove(dependencies),
  getAll: GetAll(dependencies),
  get: Get(dependencies),
  add: Add(dependencies),
});
