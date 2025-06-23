const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Prototype, PrototypeAsset, Stat } },
}) => async (prototypeId) => {
  const prototype = await Prototype.findOne({
    where: { id: prototypeId },
    include: [
      { model: Stat },
      { model: PrototypeAsset, as: "prototypeAssets" },
    ]
  });
  if (!prototype) throw new ApplicationError("PROTOTYPE_NOT_FOUND");
  
  return prototype;
};
