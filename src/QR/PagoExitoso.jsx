import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";


function PagoExitoso(){

    const [params] = useSearchParams();

    const [guardado,setGuardado] = useState(false);


    const paymentIntent = params.get(
        "payment_intent"
    );



    useEffect(()=>{


        const confirmar = async()=>{


            try{


                const respuesta = await axios.post(

                    "http://127.0.0.1:8000/api/confirmar-pago-stripe",

                    {
                        payment_intent: paymentIntent
                    }

                );


                console.log(
                    "Datos Stripe:",
                    respuesta.data
                );



                // aquí después guardaremos movimiento


                setGuardado(true);



            }catch(error){

                console.log(error);

            }


        };



        if(paymentIntent){

            confirmar();

        }



    },[]);





    return (

        <div>


            <h1>
                Pago realizado correctamente
            </h1>


            <p>
                Tu pago fue confirmado por Stripe.
            </p>


            <p>
                ID de pago:
            </p>


            <strong>
                {paymentIntent}
            </strong>



            {
                guardado &&
                <h3>
                    Venta registrada correctamente
                </h3>
            }


        </div>

    );


}


export default PagoExitoso;