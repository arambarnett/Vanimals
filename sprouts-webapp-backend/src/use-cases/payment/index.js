const Intent = require("./intent");

module.exports = (dependencies) => ({
  intentCreate: Intent(dependencies),
});
