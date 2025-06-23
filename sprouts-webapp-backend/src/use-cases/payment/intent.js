const ApplicationError = require("../../errors");
const { errors: { StripeError } } = require("stripe");

module.exports = ({
  database: { models: { Purchase } },
  stripe,
}) => async ({
  itemPrice,
  itemId,
  userId,
  order: {
    paymentMethodId,
    currency,
  }
}) => {
  const { id: purchaseId } = await Purchase.create({
    paymentMethodId,
    itemPrice,
    itemId,
    userId,
  });

  let intent;
  try {
    intent = await stripe.paymentCreate({
      amount: itemPrice,
      currency: currency,
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
      metadata: {
        itemPrice,
        itemId,
        purchaseId,
        userId,
      }
    });
  } catch (err) {
    // ? logging or add to res the err.message?
    if (err instanceof StripeError) {
      const paymentIntentId = err.payment_intent ? err.payment_intent.id : null;
      await Purchase.update({
        paymentIntentStatus: err.rawType.toUpperCase(),
        paymentIntentId,
      }, {
        where: { id: purchaseId }
      });
      throw new ApplicationError(err.rawType.toUpperCase());
    }
    throw err;
  }

  await Purchase.update({
    paymentIntentId: intent.id,
    paymentIntentStatus: intent.status.toUpperCase(),
  }, {
    where: { id: purchaseId }
  });

  return {
    purchaseId,
    status: intent.status,
    ...stripe.generateIntentResponse(intent),
  };
};
