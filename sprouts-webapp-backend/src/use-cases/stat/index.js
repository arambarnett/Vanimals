const Create = require("./create");
const Delete = require("./delete");

module.exports = (dependencies) => ({
  create: Create(dependencies),
  delete: Delete(dependencies),
});
