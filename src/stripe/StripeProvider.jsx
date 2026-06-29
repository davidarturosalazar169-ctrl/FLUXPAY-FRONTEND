import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51TeVLCCE5hGDEGBLsDzQjc7DJsqcxbvNp4qP6fLZiPuYZxAVP1jk7nd9Ct3honQhf1ioA29PKWxV8cJvR1XzmEF2006OfrFvJW"
);

export default function StripeProvider({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
