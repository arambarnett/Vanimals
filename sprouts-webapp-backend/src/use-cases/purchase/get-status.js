const ApplicationError = require("../../errors");
const { errors: { StripeError } } = require("stripe");
const { STRIPE_STATUS, MINTED_STATUS } = require("../../constants");

module.exports = ({
  database: { models: { Purchase, Item } },
  stripe,
}) => async ({
  purchaseId, userId
}) => {
  const purchase = await Purchase.findOne({
    where: { id: purchaseId, userId },
    include: [{ model: Item }],
  });
  if (!purchase) throw new ApplicationError("PURCHASE_NOT_FOUND");
  const { paymentIntentId, paymentIntentStatus } = purchase;
  if (!paymentIntentId) return { status: paymentIntentStatus };

  const status = purchase.paymentIntentStatus;
  const ENDED_STATUS = [
    MINTED_STATUS,
    STRIPE_STATUS.SUCCEEDED,
    STRIPE_STATUS.REQUIRES_SOURCE,
    STRIPE_STATUS.REQUIRES_PAYMENT_METHOD,
  ];
  if (ENDED_STATUS.includes(status)) return { status, purchase };

  let intent;
  try {
    intent = await stripe.fn.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    // ? logging or add to res the err.message?
    if (err instanceof StripeError) {
      await Purchase.update({ paymentIntentStatus: err.rawType.toUpperCase() }, {
        where: { paymentIntentId }
      });
      throw new ApplicationError(err.rawType.toUpperCase());
    }
    throw err;
  }

  await Purchase.update({
    paymentIntentStatus: intent.status.toUpperCase(),
  }, {
    where: { id: purchaseId }
  });

  return {
    status: intent.status,
    purchase,
    ...stripe.generateIntentResponse(intent),
  };
};
