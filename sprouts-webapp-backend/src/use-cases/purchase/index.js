const GetStatusCkb = require("./get-status-ckb");
const CreateCkb = require("./create-ckb");
const GetStatus = require("./get-status");
const Confirm = require("./confirm");
const Get = require("./get");

module.exports = (dependencies) => ({
  statusCkb: GetStatusCkb(dependencies),
  createCkb: CreateCkb(dependencies),
  confirm: Confirm(dependencies),
  status: GetStatus(dependencies),
  get: Get(dependencies),
});
