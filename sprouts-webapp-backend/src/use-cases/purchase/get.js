const ApplicationError = require("../../errors");

module.exports = ({
  database: { models: { Purchase, PurchaseCkb, Item } },
}) => async ({
  userId, limit = 20, offset = 0
}) => {
  const purchasesUsd = await Purchase.findAndCountAll({
    limit, offset,
    where: { userId },
    attributes: {
      exclude: ["userId", "paymentMethodId", "paymentIntentId" ]
    },
    include: [{ model: Item }],
    order: [["updatedAt", "DESC"]]
  });

  const purchasesCkb = await PurchaseCkb.findAndCountAll({
    limit, offset,
    where: { userId },
    include: [{ model: Item }],
    order: [["updatedAt", "DESC"]]
  });
  if (!purchasesUsd && !purchasesCkb) throw new ApplicationError("PURCHASES_NOT_FOUND");

  // TODO PAGINATION COUNT
  const purchases = [...purchasesUsd.rows, ...purchasesCkb.rows];
  return {
    purchases: purchases.sort((a, b) => (b.createdAt - a.createdAt)),
    totalCount: Math.max(purchasesCkb.count, purchasesUsd.count),
  };
};
