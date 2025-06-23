const ApplicationError = require("../../errors");
const { CKB_STATUS, MINTED_STATUS } = require("../../constants");
const moment = require("moment");

module.exports = ({
  database: { models: { PurchaseCkb, Item } },
  ckb: { getBalance },
  config: { CKB },
}) => async ({
  purchaseCkbId, userId
}) => {
  const purchaseCkb = await PurchaseCkb.findOne({
    where: { id: purchaseCkbId, userId },
    include: [{ model: Item }],
  });
  if (!purchaseCkb) throw new ApplicationError("PURCHASE_NOT_FOUND");
  const status = purchaseCkb.paymentStatus;
  const ENDED_STATUS = [
    MINTED_STATUS,
    CKB_STATUS.EXPIRED,
    CKB_STATUS.SUCCEEDED,
    CKB_STATUS.CANCELLED,
  ];
  if (ENDED_STATUS.includes(status)) return { status, purchaseCkb };
  
  let newStatus, balance;
  const isExpired = moment()
    .subtract(CKB.PAYMENT_MINUTES_EXPIRE, "m")
    .isAfter(purchaseCkb.createdAt);
  if (isExpired) {
    newStatus = CKB_STATUS.EXPIRED;
  } else {
    const { depositAddress } = purchaseCkb;
    balance = await getBalance(depositAddress);
    // ? it will be a tolerance?
    if (balance >= purchaseCkb.itemPriceCkb) {
      newStatus = CKB_STATUS.SUCCEEDED;
    } else newStatus = CKB_STATUS.PENDING_CONFIRMATION;
  }
  if (newStatus !== status) {
    await PurchaseCkb.update({
      paymentStatus: newStatus,
    }, {
      where: { id: purchaseCkbId, userId }
    });
    return { status: newStatus, purchaseCkb, addressBalance: balance };
  }

  return { status, purchaseCkb, addressBalance: balance };
};
