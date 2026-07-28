import React, { useEffect, useState } from "react";
import axios from "axios";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import FormularioStripe from "./FormularioStripe";

function PagarPedido(){

    const [pedido, setPedido] = useState(null);

    const [clientSecret, setClientSecret] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;


    const stripePromise = loadStripe(
    "pk_test_51TeVLCCE5hGDEGBLsDzQjc7DJsqcxbvNp4qP6fLZiPuYZxAVP1jk7nd9Ct3honQhf1ioA29PKWxV8cJvR1XzmEF2006OfrFvJW"
);


    useEffect(()=>{

        const params = new URLSearchParams(
            window.location.search
        );


        const idPedido = params.get("pedido");


        if(idPedido){

            const datos = localStorage.getItem(
                `pedido_${idPedido}`
            );


            if(datos){

                setPedido(
                    JSON.parse(datos)
                );

            }

        }


    },[]);





    const pagarConStripe = async () => {


        if(!pedido){

            alert("No existe el pedido");

            return;

        }



const datosPago = {

    idnegocio: 1,

    iduser: 1,

    pedido_id: window.location.search
        .split("pedido=")[1],

    productos: pedido.productos,

    total: pedido.total

};




        try {


            const respuesta = await axios.post(

                `${API_URL}/crear-checkout`,

                datosPago

            );



            console.log(
                "Respuesta Stripe:",
                respuesta.data
            );



            setClientSecret(
                respuesta.data.client_secret
            );



        } catch(error){


            console.log(error);


            alert(
                "Error creando pago"
            );


        }


    };





    return (


        <div>


            <h2>
                Pago del pedido
            </h2>




            {
                pedido ? (


                    <>


                    <h3>
                        Productos
                    </h3>




                    <table className="table">


                        <thead>

                            <tr>

                                <th>
                                    Producto
                                </th>


                                <th>
                                    Cantidad
                                </th>


                                <th>
                                    Precio
                                </th>


                                <th>
                                    Subtotal
                                </th>


                            </tr>


                        </thead>




                        <tbody>


                        {

                            pedido.productos.map(

                                (producto,index)=>(


                                <tr key={index}>


                                    <td>
                                        {producto.nombre}
                                    </td>


                                    <td>
                                        {producto.cantidad}
                                    </td>


                                    <td>
                                        ${producto.precio}
                                    </td>


                                    <td>
                                        ${producto.subtotal}
                                    </td>


                                </tr>


                                )

                            )

                        }


                        </tbody>



                    </table>




                    <h2>

                        Total:
                        {" "}
                        ${pedido.total}

                    </h2>





                    <button

                        className="btn btn-primary"

                        onClick={pagarConStripe}

                    >

                        Pagar con Stripe


                    </button>





{
    clientSecret && (

        <Elements

            stripe={stripePromise}

            options={{
                clientSecret: clientSecret
            }}

        >

            <FormularioStripe />

        </Elements>

    )
}





                    </>



                ) : (


                    <p>
                        Pedido no encontrado
                    </p>


                )

            }



        </div>


    );


}


export default PagarPedido;