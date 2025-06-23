const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Item, Prototype, PrototypeAsset, Stat } },
}) => async (itemId) => {
  const item = await Item.findOne({
    where: { id: itemId },
    include: [{
      model: Prototype,
      include: [
        { model: Stat },
        { model: PrototypeAsset, as: "prototypeAssets" },
      ]
    }]
  });
  if (!item) throw new ApplicationError("ITEM_NOT_FOUND");
  
  return item;
};
