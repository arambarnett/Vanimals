const PrototypeAsset = require("./prototype-asset");
const Prototype = require("./prototype");
const Purchase = require("./purchase");
const Instance = require("./instance");
const Payment = require("./payment");
const Globals = require("./globals");
const Session = require("./session");
const Item = require("./item");
const Deck = require("./deck");
const Stat = require("./stat");
const User = require("./user");

module.exports = (dependencies) => {
  const prototypeAsset = PrototypeAsset(dependencies);
  const prototype = Prototype(dependencies);
  const purchase = Purchase(dependencies);
  const instance = Instance(dependencies);
  const payment = Payment(dependencies);
  const globals = Globals(dependencies);
  const item = Item(dependencies);
  const deck = Deck(dependencies);
  const stat = Stat(dependencies);
  const user = User(dependencies);
  const session = Session({
    ...dependencies,
    useCases: {
      user
    }
  });

  return ({
    prototypeAsset,
    prototype,
    purchase,
    instance,
    payment,
    globals,
    session,
    item,
    deck,
    stat,
    user,
  });
};
