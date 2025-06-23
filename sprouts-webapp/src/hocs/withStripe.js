import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const withStripe = (Component) => (props) => (
  <Elements stripe={stripePromise}>
    <Component {...props} />
  </Elements>
);

export default withStripe;
