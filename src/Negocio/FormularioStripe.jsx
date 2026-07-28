import React from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";


function FormularioStripe() {

    const stripe = useStripe();
    const elements = useElements();


    const pagar = async (e) => {

        e.preventDefault();


        if (!stripe || !elements) {
            return;
        }


        const resultado = await stripe.confirmPayment({

            elements,

            confirmParams: {
                return_url:
                    
                "http://localhost:5173/pago-exitoso"
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