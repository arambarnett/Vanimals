var Migrations = artifacts.require("./KittyCore.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
