import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaQrcode,
  FaCreditCard,
  FaTimes,
  FaReceipt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTrash,
  FaMoneyBillWave,
  FaBarcode,
  FaUniversity,
  FaPrint,
  FaWhatsapp,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

const FluxPaySystem = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [metodo, setMetodo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [efectivoRecibido, setEfectivoRecibido] = useState("");
  const [ventaFinalizada, setVentaFinalizada] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const [linkDePagoCliente, setLinkDePagoCliente] = useState("");
  const [cargandoQr, setCargandoQr] = useState(false);
  const [idTicketCreado, setIdTicketCreado] = useState(null);
  const [idPedido, setIdPedido] = useState(null);
  const [numeroWhatsApp, setNumeroWhatsApp] = useState("");
  const [enviandoWhatsApp, setEnviandoWhatsApp] = useState(false);

  const [fichaOxxo, setFichaOxxo] = useState("");
  const [referenciaOxxo, setReferenciaOxxo] = useState("");
  const [cargandoOxxo, setCargandoOxxo] = useState(false);

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] =
    useState(false);
  const [nombreNuevoCliente, setNombreNuevoCliente] = useState("");
  const [telefonoNuevoCliente, setTelefonoNuevoCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [puntosACanjear, setPuntosACanjear] = useState("100");
  const [descuentoPuntos, setDescuentoPuntos] = useState(0);

  // Ahora identifica el método al que se le aplica comisión:
  // false = ninguno, "qr" = QR, "oxxo" = OXXO.
  const [aplicarComisiones, setAplicarComisiones] = useState(false);

  const [mostrarConfiguracionPuntos, setMostrarConfiguracionPuntos] =
    useState(false);

  const [configuracionPuntos, setConfiguracionPuntos] = useState({
    puntos_para_canjear: 100,
    puntos_por_compra: 10,
    cantidad_de_pesos: 1,
  });

  const [cargandoConfiguracionPuntos, setCargandoConfiguracionPuntos] =
    useState(false);
  const [guardandoConfiguracionPuntos, setGuardandoConfiguracionPuntos] =
    useState(false);

  const [clienteEditando, setClienteEditando] = useState(null);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [busquedaCliente, setBusquedaCliente] = useState("");

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const mostrarAlerta = (titulo, texto, icono = "info") => {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonColor: "#0e2a5a",
      confirmButtonText: "Aceptar",
    });
  };

  // Consultar configuración de puntos del negocio
  const cargarConfiguracionPuntos = async () => {
    setCargandoConfiguracionPuntos(true);

    try {
      const respuesta = await axios.get(
        `${API_URL}/clientes-negocios/puntos/configuracion`,
        getAuthHeader()
      );

      setConfiguracionPuntos({
        puntos_por_compra: respuesta.data.puntos_por_compra ?? 10,
        puntos_para_canjear: respuesta.data.puntos_para_canjear,
        cantidad_de_pesos: respuesta.data.cantidad_de_pesos,
      });

      console.log("CONFIGURACIÓN DE PUNTOS:", respuesta.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setConfiguracionPuntos({
          puntos_por_compra: 10,
          puntos_para_canjear: 100,
          cantidad_de_pesos: 1,
        });
      } else {
        console.error(
          "ERROR CONSULTANDO CONFIGURACIÓN:",
          error.response?.data || error
        );

        mostrarAlerta(
          "Error",
          "No se pudo consultar la configuración de puntos.",
          "error"
        );
      }
    } finally {
      setCargandoConfiguracionPuntos(false);
    }
  };

  // Guardar configuración de puntos del negocio
  const guardarConfiguracionPuntos = async () => {
    const puntosPorCompra = Number(
      configuracionPuntos.puntos_por_compra
    );

    const puntos = Number(configuracionPuntos.puntos_para_canjear);
    const pesos = Number(configuracionPuntos.cantidad_de_pesos);

    if (!Number.isInteger(puntosPorCompra) || puntosPorCompra < 1) {
      mostrarAlerta(
        "Puntos por compra inválidos",
        "Los puntos por compra deben ser un número entero mayor que cero.",
        "warning"
      );
      return;
    }

    if (!Number.isInteger(puntos) || puntos < 1) {
      mostrarAlerta(
        "Puntos inválidos",
        "Los puntos para canjear deben ser un número entero mayor que cero.",
        "warning"
      );
      return;
    }

    if (!Number.isFinite(pesos) || pesos <= 0) {
      mostrarAlerta(
        "Cantidad inválida",
        "La equivalencia en pesos debe ser mayor que cero.",
        "warning"
      );
      return;
    }

    setGuardandoConfiguracionPuntos(true);

    try {
      const respuesta = await axios.post(
        `${API_URL}/clientes-negocios/puntos/configuracion`,
        {
          puntos_por_compra: puntosPorCompra,
          puntos_para_canjear: puntos,
          cantidad_de_pesos: pesos,
        },
        getAuthHeader()
      );

      setConfiguracionPuntos({
        puntos_por_compra: puntosPorCompra,
        puntos_para_canjear: puntos,
        cantidad_de_pesos: pesos,
      });

      await mostrarAlerta(
        "Configuración guardada",
        respuesta.data.message ||
          "La configuración de puntos se guardó correctamente.",
        "success"
      );

      setMostrarConfiguracionPuntos(false);
    } catch (error) {
      console.error(
        "ERROR GUARDANDO CONFIGURACIÓN:",
        error.response?.data || error
      );

      mostrarAlerta(
        "Error",
        error.response?.data?.message ||
          "No se pudo guardar la configuración.",
        "error"
      );
    } finally {
      setGuardandoConfiguracionPuntos(false);
    }
  };

  const cargarClientes = async () => {
    setCargandoClientes(true);

    try {
      const respuesta = await axios.get(
        "http://localhost:8000/api/clientes-negocios",
        getAuthHeader()
      );

      setClientes(
        Array.isArray(respuesta.data) ? respuesta.data : []
      );
    } catch (error) {
      console.error(
        "ERROR CARGANDO CLIENTES:",
        error.response?.data || error
      );

      mostrarAlerta(
        "Error",
        "No se pudieron cargar los clientes del negocio.",
        "error"
      );
    } finally {
      setCargandoClientes(false);
    }
  };

  const abrirListadoClientes = () => {
    setBusquedaCliente("");
    setMostrarClientes(true);
    cargarClientes();
  };

  const asignarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarClientes(false);
  };

  const quitarCliente = () => {
    setClienteSeleccionado(null);
  };

  const procesarPuntosCliente = async () => {
    console.log("INICIO DE PROCESAMIENTO DE PUNTOS");

    if (!clienteSeleccionado) {
      console.log(
        "No hay cliente seleccionado. No se procesarán puntos."
      );
      return;
    }

    try {
      const respuesta = await axios.post(
        `${API_URL}/clientes-negocios/puntos/acumular`,
        {
          cliente_id: clienteSeleccionado.id,
        },
        getAuthHeader()
      );

      console.log("PUNTOS PROCESADOS:", respuesta.data);

      const puntosActualizados =
        respuesta.data.puntos_disponibles;

      setClienteSeleccionado((anterior) =>
        anterior
          ? { ...anterior, puntos: puntosActualizados }
          : anterior
      );

      setClientes((anteriores) =>
        anteriores.map((cliente) =>
          cliente.id === clienteSeleccionado.id
            ? { ...cliente, puntos: puntosActualizados }
            : cliente
        )
      );

      mostrarAlerta(
        "Puntos acumulados",
        `Se agregaron ${
          Number(puntosActualizados) -
          Number(clienteSeleccionado.puntos ?? 0)
        } puntos al cliente.`,
        "success"
      );
    } catch (error) {
      console.error(
        "ERROR PROCESANDO PUNTOS:",
        error.response?.data || error
      );

      mostrarAlerta(
        "Error",
        error.response?.data?.message ||
          "No se pudieron procesar los puntos.",
        "error"
      );
    }
  };

  const canjearPuntosCliente = async () => {
    if (!clienteSeleccionado) {
      mostrarAlerta(
        "Selecciona un cliente",
        "Selecciona un cliente antes de canjear puntos.",
        "warning"
      );
      return;
    }

    const puntos = Number(puntosACanjear);

    const puntosEquivalentes = Number(
      configuracionPuntos.puntos_para_canjear
    );

    if (
      !Number.isInteger(puntos) ||
      puntosEquivalentes < 1 ||
      puntos < puntosEquivalentes ||
      puntos % puntosEquivalentes !== 0
    ) {
      mostrarAlerta(
        "Puntos inválidos",
        `Los puntos deben ser múltiplos de ${puntosEquivalentes}.`,
        "warning"
      );
      return;
    }

    if (puntos > Number(clienteSeleccionado.puntos ?? 0)) {
      mostrarAlerta(
        "Puntos insuficientes",
        "El cliente no tiene suficientes puntos.",
        "warning"
      );
      return;
    }

    try {
      const respuesta = await axios.post(
        `${API_URL}/clientes-negocios/puntos/canjear`,
        {
          cliente_id: clienteSeleccionado.id,
          puntos: puntos,
        },
        getAuthHeader()
      );

      console.log("CANJE DE PUNTOS:", respuesta.data);

      const puntosActualizados =
        respuesta.data.puntos_disponibles;

      const descuento = Number(respuesta.data.descuento_mxn);

      setClienteSeleccionado((anterior) =>
        anterior
          ? { ...anterior, puntos: puntosActualizados }
          : anterior
      );

      setClientes((anteriores) =>
        anteriores.map((cliente) =>
          cliente.id === clienteSeleccionado.id
            ? { ...cliente, puntos: puntosActualizados }
            : cliente
        )
      );

      setDescuentoPuntos(descuento);

      await Swal.fire({
        title: "¡Canje realizado!",
        html: `
          <p>Se canjearon <strong>${puntos}</strong> puntos.</p>
          <p>Descuento aplicado:</p>
          <h2 style="color:#0e2a5a;margin:10px 0">
            $${descuento.toFixed(2)} MXN
          </h2>
        `,
        icon: "success",
        confirmButtonColor: "#0e2a5a",
        confirmButtonText: "Continuar",
      });
    } catch (error) {
      console.error(
        "ERROR CANJEANDO PUNTOS:",
        error.response?.data || error
      );

      mostrarAlerta(
        "Error al canjear",
        error.response?.data?.message ||
          "No se pudieron canjear los puntos.",
        "error"
      );
    }
  };

  const iniciarEdicionCliente = (cliente) => {
    setClienteEditando(cliente);
    setNombreNuevoCliente(cliente.nombreCliente || "");
    setTelefonoNuevoCliente(cliente.telefono || "");

    setMostrarClientes(false);
    setMostrarFormularioCliente(true);
  };

  const eliminarCliente = async (cliente) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: `¿Seguro que deseas eliminar a "${cliente.nombreCliente}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!resultado.isConfirmed) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/clientes-negocios/${cliente.id}`,
        getAuthHeader()
      );

      setClientes((anteriores) =>
        anteriores.filter((c) => c.id !== cliente.id)
      );

      if (clienteSeleccionado?.id === cliente.id) {
        setClienteSeleccionado(null);
      }

      mostrarAlerta(
        "Cliente eliminado",
        "El cliente se eliminó correctamente.",
        "success"
      );
    } catch (error) {
      console.error(
        "ERROR ELIMINANDO CLIENTE:",
        error.response?.data || error
      );

      mostrarAlerta(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudo eliminar el cliente.",
        "error"
      );
    }
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const busqueda = busquedaCliente.toLowerCase().trim();

    return (
      (cliente.nombreCliente || "")
        .toLowerCase()
        .includes(busqueda) ||
      (cliente.telefono || "")
        .toLowerCase()
        .includes(busqueda)
    );
  });

  const subtotal = selectedProducts.reduce(
    (acc, p) =>
      acc + Number(p.precio) * Number(p.cant),
    0
  );

  const totalAntesComisiones = Math.max(
    0,
    subtotal - descuentoPuntos
  );

  // Comisión QR: 2% + 3.6% + $3 MXN.
  const comisionQrPorcentaje =
    aplicarComisiones === "qr" && subtotal > 0
      ? subtotal * 0.02 + subtotal * 0.036
      : 0;

  const comisionQrFija =
    aplicarComisiones === "qr" && subtotal > 0
      ? 3
      : 0;

  // Comisión OXXO: 4% + $3 MXN.
  const comisionOxxoPorcentaje =
    aplicarComisiones === "oxxo" && subtotal > 0
      ? subtotal * 0.04
      : 0;

  const comisionOxxoFija =
    aplicarComisiones === "oxxo" && subtotal > 0
      ? 3
      : 0;

  const total = Number(
    (
      totalAntesComisiones +
      comisionQrPorcentaje +
      comisionQrFija +
      comisionOxxoPorcentaje +
      comisionOxxoFija
    ).toFixed(2)
  );

  const montoNumerico =
    parseFloat(efectivoRecibido) || 0;

  const cambio =
    montoNumerico > 0 ? montoNumerico - total : 0;

  // Se conserva la lógica original del QR.
  const handleSeleccionarMetodoQR = async () => {
    if (selectedProducts.length === 0) {
      mostrarAlerta(
        "Carrito vacío",
        "Agrega productos primero.",
        "warning"
      );
      return;
    }

    // Calculamos el total QR antes de enviar la solicitud.
    const totalQR = Number(
      (
        totalAntesComisiones +
        subtotal * 0.02 +
        subtotal * 0.036 +
        3
      ).toFixed(2)
    );

    setAplicarComisiones("qr");
    setCargandoQr(true);
    setMetodo("qr");

    console.log("TOTAL QUE SE ENVIA AL QR:", totalQR);

    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_API_URL}/crear-pedido`,
        {
          idnegocio: 1,
          iduser: 1,
          productos: selectedProducts.map((p) => ({
            idproducto: p.id,
            nombre: p.nombre,
            cantidad: p.cant,
            precio: p.precio,
          })),
          total: totalQR,
        }
      );

      console.log("Pedido creado:", respuesta.data);

      const pedidoId = respuesta.data.pedido_id;

      const urlPago =
        `https://fluxpay-frontend-dun.vercel.app/qr-pagar-pedido?pedido=${pedidoId}&total=${totalQR}`;

      console.log("URL DEL QR:", urlPago);

      setLinkDePagoCliente(urlPago);
    } catch (error) {
      console.error(
        "Error creando pedido en backend:",
        error
      );

      const pedidoTemporal = Date.now();

      const pedido = {
        idpedido: pedidoTemporal,
        productos: selectedProducts,
        total: totalQR,
      };

      localStorage.setItem(
        `pedido_${pedidoTemporal}`,
        JSON.stringify(pedido)
      );

      const urlPago =
        `https://fluxpay-frontend-dun.vercel.app/qr-pagar-pedido?pedido=${pedidoTemporal}&total=${totalQR}`;

      console.log("URL DEL QR (LOCAL):", urlPago);

      setLinkDePagoCliente(urlPago);
    } finally {
      setCargandoQr(false);
    }
  };

  const handlePagoOxxo = async () => {
    if (selectedProducts.length === 0) {
      mostrarAlerta(
        "Carrito vacío",
        "Agrega productos antes de generar la ficha OXXO.",
        "warning"
      );
      return;
    }

    const resultado = await Swal.fire({
      title: "Pago en OXXO",
      text: "Escribe el correo del cliente para generar la ficha de prueba.",
      input: "email",
      inputPlaceholder: "cliente@correo.com",
      inputAttributes: {
        autocomplete: "email",
      },
      showCancelButton: true,
      confirmButtonText: "Generar ficha",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0e2a5a",
      inputValidator: (valor) => {
        if (!valor) {
          return "Escribe el correo del cliente.";
        }
      },
    });

    if (!resultado.isConfirmed || !resultado.value) {
      return;
    }

    // Comisión OXXO: 4% + $3 MXN.
    const totalOxxo = Number(
      (
        totalAntesComisiones +
        subtotal * 0.04 +
        3
      ).toFixed(2)
    );

    setAplicarComisiones("oxxo");
    setCargandoOxxo(true);
    setFichaOxxo("");
    setReferenciaOxxo("");
    setMetodo("oxxo");

    try {
      const respuesta = await axios.post(
        `${API_URL}/crear-pago-oxxo`,
        {
          total: totalOxxo,
          email: resultado.value,
        }
      );

      setFichaOxxo(respuesta.data.ficha || "");
      setReferenciaOxxo(respuesta.data.referencia || "");
    } catch (error) {
      console.error("ERROR GENERANDO FICHA OXXO:", error);
      console.error("RESPUESTA DEL BACKEND:", error.response?.data);
      console.error("ESTADO HTTP:", error.response?.status);
      console.error("MENSAJE:", error.message);

      mostrarAlerta(
        "Error al generar la ficha",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudo generar la ficha OXXO. Verifica el controlador y las credenciales de Stripe.",
        "error"
      );
    } finally {
      setCargandoOxxo(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const respuesta = await axios.get(
        "http://localhost:8000/api/productos",
        getAuthHeader()
      );

      console.log("PRODUCTOS DEL BACKEND:", respuesta.data);

      const productosConvertidos = respuesta.data.map((p) => ({
        ...p,
        precio: Number(p.precio),
      }));

      setProductos(productosConvertidos);
    } catch (error) {
      console.error(
        "ERROR CARGANDO PRODUCTOS:",
        error.response?.data || error
      );

      mostrarAlerta(
        "Error",
        "No se pudieron cargar los productos.",
        "error"
      );
    }
  };

  useEffect(() => {
    let verificadorBaseDatos;

    if (showModal && metodo === "qr") {
      verificadorBaseDatos = setInterval(async () => {
        try {
          // Se conserva el verificador original comentado.
          // const res = await fetch(`http://localhost:8000/api/verificar-pago/${idTicketCreado}`);
          // const data = await res.json();
          // if (data.pagado) {
          //   finalizarVenta();
          //   clearInterval(verificadorBaseDatos);
          // }
        } catch (e) {
          console.log(e);
        }
      }, 3000);
    }

    return () => clearInterval(verificadorBaseDatos);
  }, [showModal, metodo]);

  const handleBarcodeSearch = (e) => {
    e.preventDefault();

    const p = productos.find(
      (x) => x.code === barcodeInput
    );

    if (p) {
      addProduct(p);
      setBarcodeInput("");
    }
  };

  const addProduct = (p) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((x) => x.id === p.id);

      if (exists) {
        return prev.map((x) =>
          x.id === p.id
            ? { ...x, cant: x.cant + 1 }
            : x
        );
      }

      return [...prev, { ...p, cant: 1 }];
    });
  };

  const removeProduct = (id) =>
    setSelectedProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );

  const finalizarVenta = async () => {
    await procesarPuntosCliente();

    // Guardamos el total del método antes de quitar la comisión del resumen.
    setVentaFinalizada({
      productos: [...selectedProducts],
      total,
      subtotal,
      comision: Number((total - totalAntesComisiones).toFixed(2)),
      metodo,
      fecha: new Date().toLocaleString(),
    });

    setShowModal(false);
    setAplicarComisiones(false);
    setMetodo(null);
  };

  const cerrarModalPago = () => {
    setShowModal(false);
    setMetodo(null);
    setAplicarComisiones(false);
  };

  const resetTodo = () => {
    setVentaFinalizada(null);
    setSelectedProducts([]);
    setMetodo(null);
    setEfectivoRecibido("");
    setLinkDePagoCliente("");
    setDescuentoPuntos(0);
    setAplicarComisiones(false);
    setClienteSeleccionado(null);
  };

  const generarImagenQR = () => {
    return new Promise((resolve, reject) => {
      const qr = document.getElementById("fluxpay-qr");

      if (!qr) {
        reject(new Error("No se encontró el código QR"));
        return;
      }

      const svgData = new XMLSerializer().serializeToString(qr);

      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = 500;
        canvas.height = 500;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 500, 500);
        ctx.drawImage(img, 0, 0, 500, 500);

        URL.revokeObjectURL(url);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo generar la imagen"));
          },
          "image/png"
        );
      };

      img.onerror = () =>
        reject(new Error("No se pudo cargar el QR"));

      img.src = url;
    });
  };

  const compartirQR = async () => {
    try {
      const blob = await generarImagenQR();

      const archivo = new File(
        [blob],
        "FluxPay-QR.png",
        { type: "image/png" }
      );

      if (
        navigator.share &&
        navigator.canShare?.({ files: [archivo] })
      ) {
        await navigator.share({
          title: "Pago FluxPay",
          text: "Escanea este código QR para realizar tu pago.",
          files: [archivo],
        });
      } else {
        mostrarAlerta(
          "No disponible",
          "Este dispositivo o navegador no permite compartir imágenes directamente.",
          "warning"
        );
      }
    } catch (error) {
      console.error(error);

      mostrarAlerta(
        "Error",
        error.message || "No se pudo compartir el QR.",
        "error"
      );
    }
  };

  const enviarWhatsAppNumero = async () => {
    if (!numeroWhatsApp) {
      mostrarAlerta(
        "Falta el número",
        "Escribe un número de WhatsApp.",
        "warning"
      );
      return;
    }

    let numero = numeroWhatsApp.replace(/\D/g, "");

    if (numero.length === 10) {
      numero = "52" + numero;
    }

    setEnviandoWhatsApp(true);

    try {
      const blob = await generarImagenQR();

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);

        window.open(`https://wa.me/${numero}`, "_blank");

        await mostrarAlerta(
          "Imagen preparada",
          "La imagen del QR se copió. En el chat abierto, presiona Ctrl+V o Cmd+V y después envíala.",
          "success"
        );
      } else {
        throw new Error("clipboard-no-soportado");
      }
    } catch (error) {
      console.error(
        "No se pudo copiar la imagen automáticamente:",
        error
      );

      try {
        const blob = await generarImagenQR();

        const enlaceDescarga =
          document.createElement("a");

        enlaceDescarga.href =
          URL.createObjectURL(blob);

        enlaceDescarga.download = "FluxPay-QR.png";

        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        document.body.removeChild(enlaceDescarga);
      } catch (e) {
        console.error(e);
      }

      window.open(`https://wa.me/${numero}`, "_blank");

      await mostrarAlerta(
        "Adjunta la imagen",
        "Se descargó la imagen del QR. Adjunta el archivo manualmente en el chat de WhatsApp.",
        "info"
      );
    } finally {
      setEnviandoWhatsApp(false);
    }
  };

  return (
    <div style={styles.terminalBg}>
      <div style={styles.mainLayout}>
        <section style={{ flex: 1, padding: "40px" }}>
          <header style={styles.header}>
            <h2 style={styles.logo}>
              Impulsa
              <span style={{ color: "#0e2a5a" }}>Pay</span>
            </h2>

            <div style={styles.badge}>
              TERMINAL DE COBRO
            </div>
          </header>

          <form
            onSubmit={handleBarcodeSearch}
            style={styles.barcodeContainer}
          >
            <FaBarcode color="#0e2a5a" size={20} />

            <input
              type="text"
              placeholder="Escanea código de barras..."
              style={styles.barcodeInput}
              value={barcodeInput}
              onChange={(e) =>
                setBarcodeInput(e.target.value)
              }
              autoFocus
            />
          </form>

          <div style={styles.grid}>
            {productos.map((p) => (
              <div
                key={p.id}
                onClick={() => addProduct(p)}
                style={styles.cardProduct}
              >
                <strong style={styles.productTitle}>
                  {p.nombre}
                </strong>

                <p style={styles.priceTag}>
                  ${p.precio.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside style={styles.sidebar}>
          <div style={styles.ticketHeader}>
            <FaReceipt /> RESUMEN
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
            }}
          >
            {selectedProducts.map((item) => (
              <div
                key={item.id}
                style={styles.ticketItem}
              >
                <div>
                  {item.cant}x {item.nombre}
                </div>

                <button
                  type="button"
                  onClick={() => removeProduct(item.id)}
                  style={styles.deleteBtn}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div style={styles.sidebarFooter}>
            <div style={styles.totalRow}>
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="button"
              style={styles.btnSeleccionarCliente}
              onClick={abrirListadoClientes}
            >
              {clienteSeleccionado
                ? `CLIENTE: ${clienteSeleccionado.nombreCliente}`
                : "CLIENTE: NINGUNO"}
            </button>

            <button
              type="button"
              style={styles.btnCobrar}
              onClick={async () => {
                await cargarConfiguracionPuntos();
                setMostrarConfiguracionPuntos(true);
              }}
              disabled={cargandoConfiguracionPuntos}
            >
              {cargandoConfiguracionPuntos
                ? "CARGANDO..."
                : "CONFIGURAR PUNTOS"}
            </button>

            {clienteSeleccionado && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                <p style={styles.puntosCliente}>
                  Puntos disponibles:{" "}
                  {clienteSeleccionado.puntos ?? 0}
                </p>

                <div style={{ marginTop: "12px" }}>
                  <label
                    htmlFor="puntosACanjear"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#334155",
                      textAlign: "left",
                    }}
                  >
                    Puntos que deseas canjear
                  </label>

                  <input
                    id="puntosACanjear"
                    type="number"
                    min={configuracionPuntos.puntos_para_canjear}
                    step={configuracionPuntos.puntos_para_canjear}
                    value={puntosACanjear}
                    onChange={(e) =>
                      setPuntosACanjear(e.target.value)
                    }
                    style={styles.buscarCliente}
                  />

                  <p style={styles.textoDescuento}>
                    Descuento: $
                    {(
                      (Number(puntosACanjear) /
                        Number(configuracionPuntos.puntos_para_canjear || 1)) *
                      Number(configuracionPuntos.cantidad_de_pesos || 0)
                    ).toFixed(2)}
                    {" "}MXN
                  </p>

                  <button
                    type="button"
                    style={styles.btnCobrar}
                    disabled={
                      Number(puntosACanjear) <
                        Number(configuracionPuntos.puntos_para_canjear || 1) ||
                      Number(puntosACanjear) %
                        Number(configuracionPuntos.puntos_para_canjear || 1) !== 0 ||
                      Number(puntosACanjear) >
                        Number(clienteSeleccionado.puntos ?? 0)
                    }
                    onClick={canjearPuntosCliente}
                  >
                    CANJEAR PUNTOS
                  </button>
                </div>

                <button
                  type="button"
                  style={styles.btnQuitarCliente}
                  onClick={quitarCliente}
                >
                  Quitar cliente
                </button>
              </div>
            )}

            <button
              type="button"
              style={styles.btnCobrar}
              disabled={subtotal <= 0}
              onClick={async () => {
                if (subtotal <= 0) return;

                console.log(
                  "CLIENTE SELECCIONADO:",
                  clienteSeleccionado
                );

                console.log(
                  "PUNTOS ANTES DEL PAGO:",
                  clienteSeleccionado?.puntos ?? 0
                );

                console.log("SUBTOTAL:", subtotal);

                if (!clienteSeleccionado) {
                  console.log(
                    "No hay cliente seleccionado; no se acumularán puntos."
                  );
                }

                setAplicarComisiones(false);
                setMetodo(null);
                setShowModal(true);
              }}
            >
              PROCEDER AL PAGO
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL DE PAGO */}
      {showModal && (
        <div
          style={styles.overlay}
          onClick={cerrarModalPago}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={cerrarModalPago}
              style={styles.closeBtn}
            >
              <FaTimes />
            </button>

            {!metodo ? (
              <div style={{ padding: "16px 0" }}>
                <h2 style={styles.modalTitle}>
                  Método de pago
                </h2>

                <p style={styles.modalDescription}>
                  Selecciona cómo deseas realizar el cobro.
                </p>

                <div style={styles.methodGrid}>
                  <div
                    style={styles.methodCard}
                    onClick={handleSeleccionarMetodoQR}
                  >
                    <FaQrcode size={32} />
                    <p>Código QR móvil</p>
                  </div>

                  <div
                    style={styles.methodCard}
                    onClick={() => {
                      setAplicarComisiones(false);
                      setMetodo("cash");
                    }}
                  >
                    <FaMoneyBillWave size={32} />
                    <p>Efectivo</p>
                  </div>

                  <div
                    style={styles.methodCard}
                    onClick={handlePagoOxxo}
                  >
                    <FaBarcode size={32} />
                    <p>Pagar en OXXO</p>
                  </div>

                  <div
                    style={styles.methodCard}
                    onClick={() => {
                      setAplicarComisiones(false);
                      setMetodo("transferencia");
                    }}
                  >
                    <FaUniversity size={32} />
                    <p>Transferencia</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.modalContent}>
                {metodo !== "transferencia" && (
                  <>
                    <p style={styles.modalDescription}>
                      Total a cobrar
                    </p>

                    <h1 style={styles.modalBigTotal}>
                      ${total.toFixed(2)}
                    </h1>
                  </>
                )}

                {metodo === "qr" && (
                  <div style={styles.centeredColumn}>
                    <div style={styles.statusBadge}>
                      <FaHourglassHalf /> ESPERANDO ESCANEO DEL CLIENTE...
                    </div>

                    <div style={styles.qrBox}>
                      {cargandoQr ? (
                        <p>Generando link seguro...</p>
                      ) : (
                        <QRCodeSVG
                          id="fluxpay-qr"
                          value={linkDePagoCliente}
                          size={180}
                          level="M"
                          fgColor="#0e2a5a"
                        />
                      )}
                    </div>

                    {!cargandoQr && linkDePagoCliente && (
                      <>
                        <button
                          type="button"
                          onClick={compartirQR}
                          style={styles.btnWhatsapp}
                        >
                          <FaWhatsapp size={20} />
                          ENVIAR QR POR WHATSAPP
                        </button>

                        <input
                          type="tel"
                          placeholder="Número de WhatsApp"
                          value={numeroWhatsApp}
                          onChange={(e) =>
                            setNumeroWhatsApp(e.target.value)
                          }
                          style={styles.whatsappInput}
                        />

                        <button
                          type="button"
                          onClick={enviarWhatsAppNumero}
                          disabled={enviandoWhatsApp}
                          style={styles.btnWhatsappNumero}
                        >
                          <FaWhatsapp size={20} />
                          {enviandoWhatsApp
                            ? "PREPARANDO IMAGEN..."
                            : "ENVIAR IMAGEN A ESTE NÚMERO"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {metodo === "cash" && (
                  <input
                    type="number"
                    placeholder="$ Recibido"
                    style={styles.cashInput}
                    value={efectivoRecibido}
                    onChange={(e) =>
                      setEfectivoRecibido(e.target.value)
                    }
                  />
                )}

                {metodo === "oxxo" && (
                  <div style={styles.centeredColumn}>
                    {cargandoOxxo ? (
                      <p>Generando ficha OXXO...</p>
                    ) : fichaOxxo ? (
                      <>
                        <div style={styles.statusBadge}>
                          <FaHourglassHalf /> PENDIENTE DE PAGO
                        </div>

                        <p style={{ textAlign: "center" }}>
                          Ficha de pago de prueba
                        </p>

                        {referenciaOxxo && (
                          <p
                            style={{
                              textAlign: "center",
                              overflowWrap: "anywhere",
                            }}
                          >
                            <strong>Referencia:</strong> {referenciaOxxo}
                          </p>
                        )}

                        <button
                          type="button"
                          style={styles.btnWhatsapp}
                          onClick={() => {
                            const mensaje =
                              `Ficha de pago OXXO de ImpulsaPay\n` +
                              `Total: $${total.toFixed(2)} MXN\n` +
                              `Referencia: ${referenciaOxxo || "Consultar ficha"}\n` +
                              `Ficha: ${fichaOxxo}`;

                            window.open(
                              `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
                              "_blank"
                            );
                          }}
                        >
                          <FaWhatsapp size={20} />
                          COMPARTIR FICHA POR WHATSAPP
                        </button>

                        <button
                          type="button"
                          style={styles.btnVolver}
                          onClick={() => window.open(fichaOxxo, "_blank")}
                        >
                          VER FICHA OXXO
                        </button>
                      </>
                    ) : (
                      <p>No se recibió una ficha de Stripe.</p>
                    )}
                  </div>
                )}

                {/* MODAL DE TRANSFERENCIA */}
                {metodo === "transferencia" && (
                  <div style={styles.centeredColumn}>
                    <h2 style={styles.modalTitle}>
                      TRANSACCIÓN
                    </h2>

                    <p style={styles.modalDescription}>
                      Transfiere al siguiente número de tarjeta de débito:
                    </p>

                    <strong
                      style={{
                        fontSize: "22px",
                        color: "#0e2a5a",
                        textAlign: "center",
                        letterSpacing: "2px",
                        margin: "15px 0",
                      }}
                    >
                      XXXX XXXX XXXX XXXX
                    </strong>
                  </div>
                )}

                {metodo !== "oxxo" && (
                  <button
                    type="button"
                    style={styles.btnFinalize}
                    onClick={finalizarVenta}
                  >
                    <FaCheckCircle /> CONFIRMAR TRANSACCIÓN
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURACIÓN DE PUNTOS */}
      {mostrarConfiguracionPuntos && (
        <div
          style={styles.overlay}
          onClick={() => setMostrarConfiguracionPuntos(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={styles.closeBtn}
              onClick={() => setMostrarConfiguracionPuntos(false)}
            >
              <FaTimes />
            </button>

            <h2 style={styles.modalTitle}>
              CONFIGURAR SISTEMA DE PUNTOS
            </h2>

            <p style={styles.modalDescription}>
              Define cuántos puntos necesita acumular un cliente
              para obtener un descuento.
            </p>

            <label style={styles.etiquetaFormulario}>
              Puntos que se abonan por cada compra:
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={configuracionPuntos.puntos_por_compra}
              onChange={(e) =>
                setConfiguracionPuntos({
                  ...configuracionPuntos,
                  puntos_por_compra: e.target.value,
                })
              }
              style={styles.buscarCliente}
              disabled={
                cargandoConfiguracionPuntos ||
                guardandoConfiguracionPuntos
              }
            />

            <p style={styles.textoDescuento}>
              Por cada compra se abonarán{" "}
              {configuracionPuntos.puntos_por_compra || 0} puntos.
            </p>

            <label style={styles.etiquetaFormulario}>
              Puntos necesarios para canjear:
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={configuracionPuntos.puntos_para_canjear}
              onChange={(e) =>
                setConfiguracionPuntos({
                  ...configuracionPuntos,
                  puntos_para_canjear: e.target.value,
                })
              }
              style={styles.buscarCliente}
              disabled={
                cargandoConfiguracionPuntos ||
                guardandoConfiguracionPuntos
              }
            />

            <label style={styles.etiquetaFormulario}>
              Equivalencia en pesos mexicanos:
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={configuracionPuntos.cantidad_de_pesos}
              onChange={(e) =>
                setConfiguracionPuntos({
                  ...configuracionPuntos,
                  cantidad_de_pesos: e.target.value,
                })
              }
              style={styles.buscarCliente}
              disabled={
                cargandoConfiguracionPuntos ||
                guardandoConfiguracionPuntos
              }
            />

            <p style={styles.textoDescuento}>
              Ejemplo: {configuracionPuntos.puntos_para_canjear || 0} puntos
              equivalen a $
              {Number(
                configuracionPuntos.cantidad_de_pesos || 0
              ).toFixed(2)}
              {" "}MXN.
            </p>

            <button
              type="button"
              style={styles.btnCobrar}
              onClick={guardarConfiguracionPuntos}
              disabled={
                guardandoConfiguracionPuntos ||
                cargandoConfiguracionPuntos
              }
            >
              {guardandoConfiguracionPuntos
                ? "GUARDANDO..."
                : "GUARDAR CONFIGURACIÓN"}
            </button>

            <button
              type="button"
              style={styles.btnVolver}
              onClick={() => setMostrarConfiguracionPuntos(false)}
              disabled={guardandoConfiguracionPuntos}
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE LISTADO DE CLIENTES */}
      {mostrarClientes && (
        <div
          style={styles.overlay}
          onClick={() => setMostrarClientes(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={styles.closeBtn}
              onClick={() => setMostrarClientes(false)}
            >
              <FaTimes />
            </button>

            <h2 style={styles.modalTitle}>
              Clientes del negocio
            </h2>

            <p style={styles.modalDescription}>
              Busca un cliente o registra uno nuevo.
            </p>

            <button
              type="button"
              style={styles.btnCobrar}
              onClick={() => {
                setMostrarClientes(false);
                setClienteEditando(null);
                setNombreNuevoCliente("");
                setTelefonoNuevoCliente("");
                setMostrarFormularioCliente(true);
              }}
            >
              + REGISTRAR CLIENTE
            </button>

            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={busquedaCliente}
              onChange={(e) =>
                setBusquedaCliente(e.target.value)
              }
              style={styles.buscarCliente}
            />

            {cargandoClientes ? (
              <p style={styles.estadoClientes}>
                Cargando clientes...
              </p>
            ) : clientesFiltrados.length === 0 ? (
              <p style={styles.estadoClientes}>
                No se encontraron clientes.
              </p>
            ) : (
              <div style={styles.listaClientes}>
                {clientesFiltrados.map((cliente) => (
                  <div
                    key={cliente.id}
                    style={styles.tarjetaCliente}
                  >
                    <div style={{ flex: 1, minWidth: "130px" }}>
                      <strong style={styles.nombreCliente}>
                        {cliente.nombreCliente}
                      </strong>

                      <p style={styles.datoCliente}>
                        Teléfono: {cliente.telefono || "No registrado"}
                      </p>

                      <p style={styles.datoCliente}>
                        Puntos: {cliente.puntos ?? 0}
                      </p>
                    </div>

                    <div style={styles.accionesCliente}>
                      <button
                        type="button"
                        style={styles.btnAsignarCliente}
                        onClick={() => asignarCliente(cliente)}
                      >
                        Seleccionar
                      </button>

                      <button
                        type="button"
                        style={{
                          ...styles.btnAsignarCliente,
                          background: "#2563eb",
                        }}
                        onClick={() =>
                          iniciarEdicionCliente(cliente)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        style={{
                          ...styles.btnAsignarCliente,
                          background: "#dc2626",
                        }}
                        onClick={() => eliminarCliente(cliente)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO Y EDICIÓN DE CLIENTE */}
      {mostrarFormularioCliente && (
        <div
          style={styles.overlay}
          onClick={() => setMostrarFormularioCliente(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={styles.closeBtn}
              onClick={() => setMostrarFormularioCliente(false)}
            >
              <FaTimes />
            </button>

            <h2 style={styles.modalTitle}>
              {clienteEditando
                ? "Editar cliente"
                : "Registrar cliente"}
            </h2>

            <p style={styles.modalDescription}>
              Completa los datos del cliente.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!nombreNuevoCliente.trim()) {
                  mostrarAlerta(
                    "Nombre requerido",
                    "Escribe el nombre del cliente.",
                    "warning"
                  );
                  return;
                }

                try {
                  const datosCliente = {
                    nombreCliente: nombreNuevoCliente.trim(),
                    telefono:
                      telefonoNuevoCliente.trim() || null,
                  };

                  if (clienteEditando) {
                    const respuesta = await axios.put(
                      `http://localhost:8000/api/clientes-negocios/${clienteEditando.id}`,
                      datosCliente,
                      getAuthHeader()
                    );

                    const clienteActualizado =
                      respuesta.data.cliente || {
                        ...clienteEditando,
                        ...datosCliente,
                      };

                    setClientes((anteriores) =>
                      anteriores.map((c) =>
                        c.id === clienteEditando.id
                          ? clienteActualizado
                          : c
                      )
                    );

                    setClienteSeleccionado((anterior) =>
                      anterior?.id === clienteEditando.id
                        ? clienteActualizado
                        : anterior
                    );

                    await mostrarAlerta(
                      "Cliente actualizado",
                      "Los datos se actualizaron correctamente.",
                      "success"
                    );
                  } else {
                    const respuesta = await axios.post(
                      "http://localhost:8000/api/clientes-negocios",
                      datosCliente,
                      getAuthHeader()
                    );

                    const nuevoCliente =
                      respuesta.data.cliente || respuesta.data;

                    setClientes((anteriores) => [
                      nuevoCliente,
                      ...anteriores.filter(
                        (c) => c.id !== nuevoCliente.id
                      ),
                    ]);

                    setClienteSeleccionado(nuevoCliente);

                    await mostrarAlerta(
                      "Cliente registrado",
                      "El cliente se registró correctamente.",
                      "success"
                    );
                  }

                  setClienteEditando(null);
                  setNombreNuevoCliente("");
                  setTelefonoNuevoCliente("");
                  setMostrarFormularioCliente(false);
                  setMostrarClientes(true);

                  await cargarClientes();
                } catch (error) {
                  console.error(
                    "ERROR GUARDANDO CLIENTE:",
                    error.response?.data || error
                  );

                  mostrarAlerta(
                    "Error",
                    error.response?.data?.message ||
                      error.response?.data?.error ||
                      "No se pudo guardar el cliente.",
                    "error"
                  );
                }
              }}
              style={styles.formularioCliente}
            >
              <label style={styles.etiquetaFormulario}>
                Nombre del cliente
              </label>

              <input
                type="text"
                placeholder="Escribe el nombre"
                value={nombreNuevoCliente}
                onChange={(e) =>
                  setNombreNuevoCliente(e.target.value)
                }
                required
                style={styles.buscarCliente}
              />

              <label style={styles.etiquetaFormulario}>
                Teléfono
              </label>

              <input
                type="tel"
                placeholder="Escribe el teléfono"
                value={telefonoNuevoCliente}
                onChange={(e) =>
                  setTelefonoNuevoCliente(e.target.value)
                }
                style={styles.buscarCliente}
              />

              <button
                type="submit"
                style={styles.btnCobrar}
              >
                {clienteEditando
                  ? "GUARDAR CAMBIOS"
                  : "REGISTRAR CLIENTE"}
              </button>

              <button
                type="button"
                style={styles.btnVolver}
                onClick={() => {
                  setMostrarFormularioCliente(false);
                  setMostrarClientes(true);
                }}
              >
                VOLVER AL LISTADO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  terminalBg: {
    backgroundColor: "#f4f7f9",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  mainLayout: {
    display: "flex",
    minHeight: "100vh",
  },

  logo: {
    color: "#0e2a5a",
    fontWeight: "900",
    fontSize: "28px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  badge: {
    background: "#0e2a5a",
    color: "white",
    padding: "6px 16px",
    borderRadius: "50px",
    fontSize: "11px",
  },

  barcodeContainer: {
    display: "flex",
    alignItems: "center",
    background: "white",
    padding: "12px 20px",
    borderRadius: "15px",
    marginBottom: "30px",
  },

  barcodeInput: {
    border: "none",
    marginLeft: "15px",
    width: "100%",
    outline: "none",
    padding: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },

  cardProduct: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    cursor: "pointer",
    textAlign: "center",
    border: "1px solid #edf1f7",
    transition: "box-shadow 0.2s ease",
  },

  productTitle: {
    fontSize: "16px",
  },

  priceTag: {
    color: "#0e2a5a",
    fontWeight: "800",
    fontSize: "24px",
  },

  sidebar: {
    width: "400px",
    flexShrink: 0,
    background: "white",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-5px 0 24px rgba(15, 23, 42, 0.05)",
  },

  ticketHeader: {
    padding: "25px",
    fontWeight: "bold",
    color: "#0e2a5a",
    borderBottom: "1px solid #edf1f7",
  },

  ticketItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    borderBottom: "1px solid #f1f5f9",
  },

  deleteBtn: {
    background: "#fff1f2",
    color: "#dc2626",
    border: "none",
    borderRadius: "8px",
    padding: "9px",
    cursor: "pointer",
  },

  sidebarFooter: {
    padding: "25px",
    borderTop: "1px solid #edf1f7",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "28px",
    color: "#0e2a5a",
    fontWeight: "900",
    marginBottom: "16px",
  },

  btnCobrar: {
    width: "100%",
    padding: "15px",
    background: "#0e2a5a",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.2s ease",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(8, 24, 52, 0.68)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
    zIndex: 1000,
  },

  modal: {
    background: "#ffffff",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    padding: "32px",
    boxSizing: "border-box",
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.25)",
  },

  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
    color: "#334155",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    zIndex: 2,
  },

  modalTitle: {
    color: "#0e2a5a",
    fontSize: "25px",
    fontWeight: "800",
    margin: "0 0 16px",
    paddingRight: "35px",
  },

  modalDescription: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: "0 0 16px",
    textAlign: "center",
  },

  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "20px 8px 8px",
  },

  centeredColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },

  modalBigTotal: {
    fontSize: "44px",
    fontWeight: "900",
    color: "#0e2a5a",
    margin: "0 0 20px",
    textAlign: "center",
  },

  statusBadge: {
    background: "#fffbeb",
    color: "#b45309",
    padding: "10px 16px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
  },

  qrBox: {
    padding: "20px",
    background: "white",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "220px",
    minHeight: "220px",
  },

  cashInput: {
    width: "100%",
    padding: "15px",
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "15px",
    border: "1px solid #dbe3ef",
    borderRadius: "12px",
    boxSizing: "border-box",
  },

  btnFinalize: {
    width: "100%",
    background: "#0e2a5a",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px",
  },

  btnWhatsapp: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    background: "#25D366",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px",
  },

  whatsappInput: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
  },

  btnWhatsappNumero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    background: "#0e2a5a",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },

  methodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },

  methodCard: {
    padding: "28px 14px",
    border: "1px solid #dbe5f1",
    borderRadius: "18px",
    cursor: "pointer",
    textAlign: "center",
    color: "#0e2a5a",
    fontWeight: "700",
    background: "#f8fafc",
  },

  buscarCliente: {
    width: "100%",
    padding: "13px 15px",
    margin: "12px 0",
    border: "1px solid #dbe3ef",
    borderRadius: "12px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    background: "#ffffff",
  },

  listaClientes: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "18px",
    maxHeight: "42vh",
    overflowY: "auto",
    paddingRight: "4px",
  },

  tarjetaCliente: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "18px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    flexWrap: "wrap",
  },

  nombreCliente: {
    color: "#0e2a5a",
    fontSize: "15px",
  },

  datoCliente: {
    color: "#64748b",
    fontSize: "13px",
    margin: "7px 0 0",
  },

  accionesCliente: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "110px",
  },

  btnAsignarCliente: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    background: "#0e2a5a",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  btnSeleccionarCliente: {
    width: "100%",
    marginTop: "16px",
    padding: "14px",
    border: "1px solid #dbe5ef",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#0e2a5a",
    fontWeight: "700",
    cursor: "pointer",
  },

  btnQuitarCliente: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
    background: "#fff1f2",
    color: "#be123c",
    border: "1px solid #fecdd3",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  puntosCliente: {
    padding: "12px",
    borderRadius: "12px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "700",
    margin: "10px 0",
  },

  textoDescuento: {
    color: "#475569",
    fontSize: "14px",
    margin: "10px 0",
    fontWeight: "600",
  },

  estadoClientes: {
    textAlign: "center",
    color: "#64748b",
    padding: "24px 10px",
  },

  formularioCliente: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  etiquetaFormulario: {
    display: "block",
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
    marginTop: "10px",
  },

  btnVolver: {
    width: "100%",
    marginTop: "10px",
    padding: "13px",
    border: "1px solid #dbe3ef",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#0e2a5a",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default FluxPaySystem;