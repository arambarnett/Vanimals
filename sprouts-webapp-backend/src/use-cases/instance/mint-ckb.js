const { UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");
const ApplicationError = require("../../errors");
const { MINTED_STATUS, ITEM_TYPE } = require("../../constants");

module.exports = ({
  database: { models: { Instance, PurchaseCkb, Item }, connection },
}) => async ({
  item,
  userId,
  purchaseCkbId,
}) => {
  try {
    // TODO calculate randomMultipliers
    let randomMultipliers;
    const rand = () => Math.floor(Math.random() * (11 - 1) + 1);

    if (item.type === ITEM_TYPE.PROTOTYPE) {
      randomMultipliers = `${rand()},${rand()},${rand()},${rand()}`;
      /* eslint-disable-next-line no-unused-vars */
      return connection.transaction( async (t) => {
        const instance = await Instance.create({
          prototypeId: item.prototypeId,
          generator: item.generator,
          asset: item.asset,
          assetType: item.assetType,
          ownerUserId: userId,
          randomMultipliers,
        });
        await PurchaseCkb.update({
          instanceId: instance.id,
          paymentStatus: MINTED_STATUS,
        }, {
          where: { id: purchaseCkbId }
        });
        return instance;
      });
    } else if (item.type === ITEM_TYPE.PACK) {
      // TODO randItem from diferent randCategories
      /* eslint-disable-next-line no-unused-vars */
      return connection.transaction( async (t) => {
        const type = ITEM_TYPE.PROTOTYPE;
        const promises = [];
        let randItem;
        for (let i = 0; i < 3; i++) {
          randItem = await Item.findOne({ where: { type }, order: connection.random() });
          randomMultipliers = `${rand()},${rand()},${rand()},${rand()}`;
          promises.push(Instance.create({
            prototypeId: randItem.prototypeId,
            generator: randItem.generator,
            asset: randItem.asset,
            assetType: randItem.assetType,
            ownerUserId: userId,
            randomMultipliers,
          }));
        }
        const instances = await Promise.all(promises);
        await PurchaseCkb.update({
          instanceId: instances[0].id,
          paymentStatus: MINTED_STATUS,
        }, {
          where: { id: purchaseCkbId }
        });
        return instances;
      });
    }
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new ApplicationError("INSTANCE_ALREADY_EXIST");
    } else if (err instanceof ForeignKeyConstraintError) {
      throw new ApplicationError("PROTOTYPE_NOT_AVAILABLE");
    } else {
      throw err;
    }
  }
};
