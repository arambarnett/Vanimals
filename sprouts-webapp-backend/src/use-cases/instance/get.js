const ApplicationError = require("../../errors");
const calculatePoints = require("../../lib/points-modulator");

module.exports = ({
  database: { models: { Instance, Prototype, PrototypeAsset, Stat } },
}) => async ({ instanceId, userId: ownerUserId }) => {
  const instance = await Instance.findOne({
    where: { id: instanceId, ownerUserId },
    include: [{
      model: Prototype,
      include: [
        { model: Stat },
        { model: PrototypeAsset, as: "prototypeAssets" },
      ]
    }]
  });
  if (!instance) throw new ApplicationError("INSTANCE_NOT_FOUND");

  const points = calculatePoints({
    stats: instance.prototype.stats,
    randomMultipliers: instance.randomMultipliers
  });
  
  return { instance, points };
};
