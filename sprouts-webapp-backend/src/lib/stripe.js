const Stripe = require("stripe");

const generateIntentResponse = (intent) => {
  // Generate a response based on the intent"s status
  switch (intent.status) {
  case "requires_action":
  case "requires_source_action":
    // Card requires authentication
    return {
      requiresAction: true,
      clientSecret: intent.client_secret
    };
  case "requires_payment_method":
  case "requires_source":
    // Card was not properly authenticated, suggest a new payment method
    return {
      error: "Your card was denied, please provide a new payment method"
    };
  case "succeeded":
    // Payment is complete, authentication not required
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    return { clientSecret: intent.client_secret };
  }
};

module.exports = ({
  STRIPE: {
    PUBLISHABLE_KEY,
    SECRET_KEY
  },
}) => {
  const stripe = Stripe(SECRET_KEY);
  stripe.setMaxNetworkRetries(2);

  return {
    fn: stripe,
    generateIntentResponse,
    getPublishableKey: () => PUBLISHABLE_KEY,
    paymentCreate: (payment) => stripe.paymentIntents.create(payment),
    paymentConfirm: (payment) => stripe.paymentIntents.confirm(payment),
    // paymentIntents: (order) => stripe.paymentIntents.create(order),
  };
};
