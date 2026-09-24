import React from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";


function FormularioStripe() {

    const stripe = useStripe();
    const elements = useElements();
    const API_URL = import.meta.env.VITE_API_URL;


    const pagar = async (e) => {

        e.preventDefault();


        if (!stripe || !elements) {
            return;
        }


        const resultado = await stripe.confirmPayment({

            elements,

            confirmParams: {
                return_url:
                    
                "https://fluxpay-frontend-dun.vercel.app/pago-exitoso"
            }

        });


        if (resultado.error) {

            console.log(resultado.error.message);

        }


    };



    return (

        <form onSubmit={pagar}>

            <PaymentElement />


            <button
                type="submit"
                className="btn btn-success"
            >
                Completar pago 
            </button>


        </form>

    );

}


export default FormularioStripe;