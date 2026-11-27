import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
    "pk_test_51TeVLCCE5hGDEGBLsDzQjc7DJsqcxbvNp4qP6fLZiPuYZxAVP1jk7nd9Ct3honQhf1ioA29PKWxV8cJvR1XzmEF2006OfrFvJW"
);

const API_URL = import.meta.env.VITE_API_URL;

function FormularioPagoExterno({ clientSecret, pedidoId }) {
    const stripe = useStripe();
    const elements = useElements();

    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const pagar = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setCargando(true);
        setMensaje("");

        try {
            const resultado = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href
                },
                redirect: "if_required"
            });

            if (resultado.error) {
                setMensaje(resultado.error.message);
                setCargando(false);
                return;
            }

            if (resultado.paymentIntent?.status === "succeeded") {
                const respuesta = await fetch(
                    `${API_URL}/integraciones/confirmar-pago`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            pedido_id: pedidoId
                        })
                    }
                );

                const datos = await respuesta.json();

                if (datos.success) {
                    setMensaje("Pago realizado y confirmado correctamente.");
                } else {
                    setMensaje(
                        "El pago se realizó, pero el servidor no pudo confirmar el pedido."
                    );
                }
            } else {
                setMensaje(
                    "Estado del pago: " +
                    (resultado.paymentIntent?.status || "pendiente")
                );
            }
        } catch (error) {
            setMensaje("Ocurrió un error al procesar el pago.");
        }

        setCargando(false);
    };

    return (
        <form onSubmit={pagar}>
            <PaymentElement />

            <button
                type="submit"
                disabled={!stripe || cargando}
                style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "20px",
                    background: "#198754",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                {cargando ? "Procesando..." : "Pagar ahora"}
            </button>

            {mensaje && (
                <p style={{ marginTop: "15px" }}>
                    {mensaje}
                </p>
            )}
        </form>
    );
}

export default function PagarPedidoExterno() {
    const [clientSecret, setClientSecret] = useState("");
    const [pedidoId, setPedidoId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("pedido_id");

        if (!id) {
            setError("No se encontró el identificador del pedido.");
            return;
        }

        setPedidoId(id);

        fetch(`${API_URL}/integraciones/obtener-pago/${id}`, {
            headers: {
                "Accept": "application/json"
            }
        })
            .then(async (response) => {
                const datos = await response.json();

                if (!response.ok || !datos.success) {
                    throw new Error(
                        datos.mensaje || "No se pudo recuperar el pago."
                    );
                }

                setClientSecret(datos.client_secret);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!clientSecret) {
        return <p>Cargando pago...</p>;
    }

    return (
        <div
            style={{
                maxWidth: "450px",
                margin: "50px auto",
                padding: "25px",
                border: "1px solid #ddd",
                borderRadius: "10px"
            }}
        >
            <h2>Pago con tarjeta</h2>

            <p>Pedido: {pedidoId}</p>

            <Elements
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <FormularioPagoExterno
                    clientSecret={clientSecret}
                    pedidoId={pedidoId}
                />
            </Elements>
        </div>
    );
}
