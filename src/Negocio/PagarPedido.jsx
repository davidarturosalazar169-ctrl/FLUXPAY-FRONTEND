import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import FormularioStripe from "./FormularioStripe";

function PagarPedido() {

    const stripePromise = loadStripe(
        "pk_test_51TeVLCCE5hGDEGBLsDzQjc7DJsqcxbvNp4qP6fLZiPuYZxAVP1jk7nd9Ct3honQhf1ioA29PKWxV8cJvR1XzmEF2006OfrFvJW"
    );

    const [params] = useSearchParams();

    const [pedido, setPedido] = useState(null);

    const [idPedido, setIdPedido] = useState(null);

    const [clientSecret, setClientSecret] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {

        const id = params.get("pedido");

        console.log("ID PEDIDO:", id);

        setIdPedido(id);

        if (id) {

            const datos = localStorage.getItem(
                `pedido_${id}`
            );

            console.log(
                "DATOS:",
                datos
            );

            if (datos) {

                setPedido(
                    JSON.parse(datos)
                );

            }

        }

    }, []);

    const pagar = async () => {

        if (!pedido) {

            alert("No hay pedido");

            return;

        }

        const datosPago = {

            idnegocio: 1,

            iduser: 1,

            pedido_id: idPedido,

            total: pedido.total,

            productos: pedido.productos.map(p => ({

                idproducto: p.id,

                cantidad: p.cant,

                precio: p.precio,

                subtotal: p.precio * p.cant

            }))

        };

        console.log(
            "ENVIANDO:",
            datosPago
        );

        try {

            const respuesta = await axios.post(

                `${API_URL}/crear-checkout`,

                datosPago

            );

            console.log(
                "STRIPE:",
                respuesta.data
            );

            setClientSecret(
                respuesta.data.client_secret
            );

        } catch (error) {

            console.log(
                error.response?.data || error
            );

            alert(
                "Error creando pago"
            );

        }

    };

    return (

        <div className="impulpay-wrapper">


            <div className="impulpay-card">


                <div className="impulpay-header">

                    <h1>
                        Pago del pedido
                    </h1>

                </div>



                <div className="impulpay-body">

                    {
                        pedido ? (

                            <>


                                <h2>
                                    Productos
                                </h2>



                                <div className="impulpay-productos-list">

                                    {
                                        pedido.productos.map(

                                            (p, index) => (


                                                <div key={index} className="impulpay-producto-item">

                                                    <span><b>{p.cant}x</b> {p.nombre}</span>

                                                    <span>${p.precio}</span>

                                                </div>


                                            )


                                        )
                                    }

                                </div>



                                <h2 className="impulpay-total">

                                    Total:
                                    <span>${pedido.total}</span>

                                </h2>




                                <button
                                    onClick={pagar}
                                    className="impulpay-btn"
                                >

                                    PAGAR

                                </button>




                                {
                                    clientSecret && (

                                        <div className="impulpay-stripe-container">

                                            <Elements

                                                stripe={stripePromise}

                                                options={{
                                                    clientSecret: clientSecret
                                                }}

                                            >

                                                <FormularioStripe />

                                            </Elements>

                                        </div>

                                    )
                                }



                            </>


                        ) : (


                            <h3>
                                Cargando pedido...
                            </h3>


                        )
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
                }
                .impulpay-header {
                    background-color: #0A2540;
                    padding: 20px;
                    text-align: center;
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
                .impulpay-body h2 {
                    font-size: 13px;
                    text-transform: uppercase;
                    color: #627D98;
                    margin-top: 0;
                    margin-bottom: 12px;
                    letter-spacing: 0.5px;
                }
                .impulpay-productos-list {
                    background-color: #F8FAFC;
                    border-radius: 8px;
                    padding: 8px 16px;
                    margin-bottom: 20px;
                    border: 1px solid #EDF2F7;
                }
                .impulpay-producto-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #E2E8F0;
                    font-size: 14px;
                    color: #334E68;
                }
                .impulpay-producto-item:last-child {
                    border-bottom: none;
                }
                .impulpay-producto-item b {
                    color: #0066FF;
                }
                .impulpay-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 2px dashed #E2E8F0;
                    padding-top: 16px;
                    margin-bottom: 20px !important;
                    font-size: 18px !important;
                    color: #102A43 !important;
                    text-transform: none !important;
                }
                .impulpay-total span {
                    font-size: 24px;
                    font-weight: 800;
                    color: #0066FF;
                }
                .impulpay-btn {
                    width: 100%;
                    background-color: #0066FF;
                    color: #FFFFFF;
                    border: none;
                    padding: 14px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 102, 255, 0.25);
                    transition: background 0.2s ease;
                }
                .impulpay-btn:hover {
                    background-color: #0052CC;
                }
                .impulpay-stripe-container {
                    margin-top: 20px;
                    border-top: 1px solid #E2E8F0;
                    padding-top: 20px;
                }
            `}</style>


        </div>


    )


}


export default PagarPedido;