import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";


function PagoTerminado(){

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

        <div className="impulpay-wrapper">


            <div className="impulpay-card">


                <div className="impulpay-header">

                    <div className="impulpay-icon-success">
                        ✓
                    </div>

                    <h1>
                        Pago realizado correctamente
                    </h1>

                </div>


                <div className="impulpay-body">

                    <p className="impulpay-text">
                        Tu pago fue confirmado por Stripe.
                    </p>


                    <div className="impulpay-intent-box">

                        <p className="impulpay-intent-label">
                            ID de pago:
                        </p>


                        <strong className="impulpay-intent-id">
                            {paymentIntent}
                        </strong>

                    </div>



                    {
                        guardado &&
                        <div className="impulpay-alert-success">
                            <h3>
                                Venta registrada correctamente
                            </h3>
                        </div>
                    }

                </div>


            </div>


            {/* ESTILOS AZULES IMPULPAY */}
            <style>{`
                .impulpay-wrapper {
                    min-height: 100vh;
                    background-color: #F0F4F8;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .impulpay-card {
                    background-color: #FFFFFF;
                    width: 100%;
                    max-width: 450px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px -5px rgba(10, 37, 64, 0.1);
                    overflow: hidden;
                    border: 1px solid #E2E8F0;
                    text-align: center;
                }
                .impulpay-header {
                    background-color: #0A2540;
                    padding: 30px 20px 24px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .impulpay-icon-success {
                    width: 56px;
                    height: 56px;
                    background-color: #00D4B2;
                    color: #FFFFFF;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 12px;
                    box-shadow: 0 4px 12px rgba(0, 212, 178, 0.3);
                }
                .impulpay-header h1 {
                    color: #FFFFFF;
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                }
                .impulpay-body {
                    padding: 24px;
                }
                .impulpay-text {
                    color: #486581;
                    font-size: 15px;
                    margin-top: 0;
                    margin-bottom: 20px;
                }
                .impulpay-intent-box {
                    background-color: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 20px;
                    word-break: break-all;
                }
                .impulpay-intent-label {
                    margin: 0 0 4px 0;
                    font-size: 12px;
                    text-transform: uppercase;
                    color: #627D98;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .impulpay-intent-id {
                    color: #0066FF;
                    font-size: 14px;
                }
                .impulpay-alert-success {
                    background-color: #EBF8FF;
                    border: 1px solid #BEE3F8;
                    border-left: 4px solid #0066FF;
                    padding: 12px;
                    border-radius: 6px;
                }
                .impulpay-alert-success h3 {
                    margin: 0;
                    color: #2B6CB0;
                    font-size: 14px;
                    font-weight: 600;
                }
            `}</style>


        </div>

    );


}


export default PagoTerminado;