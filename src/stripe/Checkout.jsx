import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const pay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/api/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 1000,
      }),
    });

    const data = await res.json();

    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Pago exitoso 💰");
        await fetch("http://127.0.0.1:8000/api/save-movimiento", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    monto_total: 1000,
    comision: 50,
    payment_intent: result.paymentIntent.id,
    charge_id: result.paymentIntent.latest_charge,
    stripe_status: result.paymentIntent.status
  }),
});

alert("Movimiento guardado en BD 💾");
      }
    }
  };

  return (
    <form onSubmit={pay}>
      <CardElement />
      <button disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar $10"}
      </button>
    </form>
  );
}