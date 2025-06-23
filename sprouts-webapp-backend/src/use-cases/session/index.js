const RefreshById = require("./refresh-by-id");
const Create = require("./create");

module.exports = (dependencies) => ({
  refreshById: RefreshById(dependencies),
  create: Create(dependencies),
});
