import React, { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import {
  FaPlus,
  FaTrash,
  FaQrcode,
  FaExternalLinkAlt,
  FaCopy
} from "react-icons/fa";


function PruebaQR() {

const [producto, setProducto] = useState({
    idproducto: "",
    nombre: "",
    cantidad: 1,
    precio: ""
});


  const [productos, setProductos] = useState([]);

  const [checkoutUrl, setCheckoutUrl] = useState("");



  // Agregar producto al pedido
  const agregarProducto = () => {

    if (
      !producto.idproducto ||
      !producto.nombre ||
      !producto.precio ||
      producto.cantidad <= 0
    ) {
      alert("Completa los datos del producto");
      return;
    }


    setProductos([
      ...productos,
      {
        ...producto,
        precio: Number(producto.precio),
        subtotal:
          Number(producto.precio) *
          Number(producto.cantidad)
      }
    ]);


    setProducto({
      idproducto: "",
      nombre: "",
      cantidad: 1,
      precio: ""
    });

  };



  // Eliminar producto
  const eliminarProducto = (index) => {

    const nuevaLista = productos.filter(
      (_, i) => i !== index
    );

    setProductos(nuevaLista);

  };



  // Total
  const total = productos.reduce(
    (suma, item) =>
      suma + item.subtotal,
    0
  );



  // Aquí después conectaremos Laravel + Stripe
const generarQR = async () => {

    if(productos.length === 0){

        alert("Agrega productos primero");
        return;

    }


    // Generar ID temporal del pedido
    const pedidoTemporal = Date.now();


    // Guardamos los datos temporalmente
    localStorage.setItem(
        `pedido_${pedidoTemporal}`,
        JSON.stringify({
            productos,
            total
        })
    );


    // Link hacia pantalla de pago
    const linkPago =
    `http://localhost:5173/qr-pagar-pedido?pedido=${pedidoTemporal}`;


    setCheckoutUrl(linkPago);

};


  const copiarLink = () => {

    navigator.clipboard.writeText(checkoutUrl);

    alert("Link copiado");

  };



  return (

    <div className="qr-container">


      <div className="qr-header">

        <FaQrcode />

        <h2>
          Prueba Stripe QR
        </h2>

      </div>



      <div className="qr-grid">



        {/* FORMULARIO */}

        <div className="qr-card">


          <h4>
            Agregar producto
          </h4>

<label>
    ID Producto
</label>

<input
    className="form-control"
    type="number"
    value={producto.idproducto}
    onChange={
        e =>
        setProducto({
            ...producto,
            idproducto:e.target.value
        })
    }
/>

          <label>
            Nombre
          </label>

          <input
            className="form-control"
            value={producto.nombre}
            onChange={
              e =>
              setProducto({
                ...producto,
                nombre:e.target.value
              })
            }
          />



          <label>
            Cantidad
          </label>

          <input
            type="number"
            className="form-control"
            value={producto.cantidad}
            onChange={
              e =>
              setProducto({
                ...producto,
                cantidad:e.target.value
              })
            }
          />



          <label>
            Precio
          </label>

          <input
            type="number"
            className="form-control"
            value={producto.precio}
            onChange={
              e =>
              setProducto({
                ...producto,
                precio:e.target.value
              })
            }
          />



          <button
            className="btn-add"
            onClick={agregarProducto}
          >

            <FaPlus />
            Agregar

          </button>



        </div>





        {/* PEDIDO */}


        <div className="qr-card">


          <h4>
            Pedido
          </h4>



<table className="table">

  <thead>
    <tr>
      <th>ID</th>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Precio</th>
      <th>Subtotal</th>
      <th></th>
    </tr>
  </thead>

  <tbody>


              {
                productos.map(
                  (item,index)=>(

<tr key={index}>

  <td>{item.idproducto}</td>

  <td>{item.nombre}</td>

  <td>{item.cantidad}</td>

  <td>${item.precio}</td>

  <td>${item.subtotal}</td>

  <td>
    <button
      className="btn-delete"
      onClick={() => eliminarProducto(index)}
    >
      <FaTrash />
    </button>
  </td>

</tr>
                  )
                )
              }


            </tbody>


          </table>



          <h3>

            Total:
            {" "}
            ${total}


          </h3>



          <button
            className="btn-generate"
            onClick={generarQR}
          >

            <FaQrcode />

            Generar QR

          </button>



        </div>



      </div>





      {/* QR */}

      {
        checkoutUrl &&

        <div className="qr-card qr-result">


          <h3>
            Escanea para pagar
          </h3>


          <QRCodeSVG
            value={checkoutUrl}
            size={250}
          />



          <div className="link-box">

            {checkoutUrl}

          </div>



          <div>


            <button
              className="btn-open"
              onClick={
                ()=>window.open(
                  checkoutUrl,
                  "_blank"
                )
              }
            >

              <FaExternalLinkAlt />

              Abrir Checkout

            </button>



            <button
              className="btn-copy"
              onClick={copiarLink}
            >

              <FaCopy />

              Copiar Link

            </button>


          </div>


        </div>

      }



    </div>

  );

}


export default PruebaQR;