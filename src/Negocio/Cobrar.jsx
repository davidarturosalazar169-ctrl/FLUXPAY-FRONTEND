import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FaQrcode, FaCreditCard, FaTimes, FaReceipt, FaHourglassHalf, FaCheckCircle, FaTrash, FaMoneyBillWave, FaBarcode, FaUniversity, FaPrint } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const FluxPaySystem = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [metodo, setMetodo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [efectivoRecibido, setEfectivoRecibido] = useState("");
  const [ventaFinalizada, setVentaFinalizada] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;


  // NUEVOS ESTADOS PARA INTEGRACIÓN CON STRIPE
  const [linkDePagoCliente, setLinkDePagoCliente] = useState("");
  const [cargandoQr, setCargandoQr] = useState(false);
  const [idTicketCreado, setIdTicketCreado] = useState(null);
  const [idPedido, setIdPedido] = useState(null);

  const productos = [
    { id: 1, nombre: "Café Sobre 50g", precio: 15.00, code: "750101" },
    { id: 2, nombre: "Galletas Gamesa", precio: 25.50, code: "750102" },
    { id: 3, nombre: "Refresco Sprite", precio: 22.00, code: "750103" },
    { id: 4, nombre: "Yakult", precio: 10.50, code: "750104" },
  ];

  const subtotal = selectedProducts.reduce((acc, p) => acc + (p.precio * p.cant), 0);
  const gananciaFlux = subtotal > 0 ? (subtotal * 0.02) : 0;

  const total = metodo === 'qr' || metodo === 'card'
    ? (subtotal + gananciaFlux + 3.00) / (1 - 0.036)
    : subtotal;

  const montoNumerico = parseFloat(efectivoRecibido) || 0;
  const cambio = montoNumerico > 0 ? montoNumerico - total : 0;

  // --- SOLICITAR QR DINÁMICO DE TU PASARELA ---
const handleSeleccionarMetodoQR = async () => {
    if (selectedProducts.length === 0) {
        alert("Agrega productos primero");
        return;
    }

    setCargandoQr(true);
    setMetodo("qr");

    try {

        // Intentar crear el pedido en el backend
        const respuesta = await axios.post(
            `${import.meta.env.VITE_API_URL}/crear-pedido`,
            {
                idnegocio: 1, // Cambiar por el negocio real
                iduser: 1,    // Cambiar por el usuario real
productos: selectedProducts.map(p => ({
    idproducto: p.id,
    nombre: p.nombre,
    cantidad: p.cant,
    precio: p.precio
})),
                total: total
            }
        );

        console.log("Pedido creado:", respuesta.data);

        const pedidoId = respuesta.data.pedido_id;

const urlPago = `https://fluxpay-frontend-dun.vercel.app/qr-pagar-pedido?pedido=${pedidoId}`;
        console.log("URL DEL QR:", urlPago);

        setLinkDePagoCliente(urlPago);

    } catch (error) {

        console.error("Error creando pedido en backend:", error);

        // Respaldo local
        const pedidoTemporal = Date.now();

        const pedido = {
            idpedido: pedidoTemporal,
            productos: selectedProducts,
            total: total
        };

        localStorage.setItem(
            `pedido_${pedidoTemporal}`,
            JSON.stringify(pedido)
        );

        const urlPago = `https://fluxpay-frontend-dun.vercel.app/qr-pagar-pedido?pedido=${pedidoTemporal}`;

        console.log("URL DEL QR (LOCAL):", urlPago);

        setLinkDePagoCliente(urlPago);

    } finally {

        setCargandoQr(false);

    }
};

  // --- REVISAR SI EL CLIENTE YA PAGÓ DESDE EL CELULAR ---
  useEffect(() => {
    let verificadorBaseDatos;
    if (showModal && metodo === 'qr') {
      // Short Polling: Cada 3 segundos va a tu Laravel a revisar si el status del movimiento cambió a 1
      verificadorBaseDatos = setInterval(async () => {
        try {
          // const res = await fetch(`http://localhost:8000/api/verificar-pago/${idTicketCreado}`);
          // const data = await res.json();
          // if(data.pagado) { finalizarVenta(); clearInterval(verificadorBaseDatos); }
        } catch (e) { console.log(e); }
      }, 3000);
    }
    return () => clearInterval(verificadorBaseDatos);
  }, [showModal, metodo]);

  // Resto de tus métodos nativos (Barcode, add, remove, ticket)...
  const handleBarcodeSearch = (e) => { e.preventDefault(); const p = productos.find(x => x.code === barcodeInput); if (p) { addProduct(p); setBarcodeInput(""); } };
  const addProduct = (p) => { setSelectedProducts(prev => { const exists = prev.find(x => x.id === p.id); if (exists) return prev.map(x => x.id === p.id ? { ...x, cant: x.cant + 1 } : x); return [...prev, { ...p, cant: 1 }]; }); };
  const removeProduct = (id) => setSelectedProducts(prev => prev.filter(p => p.id !== id));
  const finalizarVenta = () => { setVentaFinalizada({ productos: [...selectedProducts], total, subtotal, comision: total - subtotal, metodo, fecha: new Date().toLocaleString() }); setShowModal(false); };
  const resetTodo = () => { setVentaFinalizada(null); setSelectedProducts([]); setMetodo(null); setEfectivoRecibido(""); setLinkDePagoCliente(""); };

  return (
    <div style={styles.terminalBg}>
      <div style={styles.mainLayout}>
        <section style={{ flex: 1, padding: '40px' }}>
          <header style={styles.header}>
            <h2 style={styles.logo}>Impulsa<span style={{ color: '#0e2a5a' }}>Pay</span></h2>
            <div style={styles.badge}>TERMINAL DE COBRO</div>
          </header>

          <form onSubmit={handleBarcodeSearch} style={styles.barcodeContainer}>
            <FaBarcode color="#0e2a5a" size={20} />
            <input type="text" placeholder="Escanea código de barras..." style={styles.barcodeInput} value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} autoFocus />
          </form>

          <div style={styles.grid}>
            {productos.map(p => (
              <div key={p.id} onClick={() => addProduct(p)} style={styles.cardProduct}>
                <strong style={styles.productTitle}>{p.nombre}</strong>
                <p style={styles.priceTag}>${p.precio.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>

        <aside style={styles.sidebar}>
          <div style={styles.ticketHeader}><FaReceipt /> RESUMEN</div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {selectedProducts.map(item => (
              <div key={item.id} style={styles.ticketItem}>
                <div>{item.cant}x {item.nombre}</div>
                <button onClick={() => removeProduct(item.id)} style={styles.deleteBtn}><FaTrash /></button>
              </div>
            ))}
          </div>
          <div style={styles.sidebarFooter}>
            <div style={styles.totalRow}><span>TOTAL:</span><span>${subtotal.toFixed(2)}</span></div>
            <button style={styles.btnCobrar} onClick={() => subtotal > 0 && setShowModal(true)}>PROCEDER AL PAGO</button>
          </div>
        </aside>
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={() => { setShowModal(false); setMetodo(null); }} style={styles.closeBtn}><FaTimes /></button>

            {!metodo ? (
              <div style={{ padding: '30px' }}>
                <h2 style={styles.modalTitle}>Método de Pago</h2>
                <div style={styles.methodGrid}>
                  <div style={styles.methodCard} onClick={handleSeleccionarMetodoQR}><FaQrcode size={30} /><p>Código QR Móvil</p></div>
                  <div style={styles.methodCard} onClick={() => setMetodo('cash')}><FaMoneyBillWave size={30} /><p>Efectivo</p></div>
                </div>
              </div>
            ) : (
              <div style={styles.modalContent}>
                <h1 style={styles.modalBigTotal}>${total.toFixed(2)}</h1>

                {metodo === 'qr' && (
                  <div style={styles.centeredColumn}>
                    <div style={styles.statusBadge}><FaHourglassHalf /> ESPERANDO ESCANEO DEL CLIENTE...</div>
                    <div style={styles.qrBox}>
                      {cargandoQr ? <p>Generando link seguro...</p> : <QRCodeSVG value={linkDePagoCliente} size={180} level="M" fgColor="#0e2a5a" />}
                    </div>
                  </div>
                )}

                {metodo === 'cash' && (
                  <input type="number" placeholder="$ Recibido" style={styles.cashInput} value={efectivoRecibido} onChange={(e) => setEfectivoRecibido(e.target.value)} />
                )}

                <button style={styles.btnFinalize} onClick={finalizarVenta}><FaCheckCircle /> CONFIRMAR TRANSACCIÓN</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos base (Mantenidos de tu archivo para no romper diseño)
const styles = { terminalBg: { backgroundColor: '#f4f7f9', height: '100vh', fontFamily: "sans-serif" }, mainLayout: { display: 'flex', height: '100%' }, logo: { color: '#0e2a5a', fontWeight: '900', fontSize: '28px' }, header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, badge: { background: '#0e2a5a', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '11px' }, barcodeContainer: { display: 'flex', alignItems: 'center', background: 'white', padding: '12px 20px', borderRadius: '15px', marginBottom: '30px' }, barcodeInput: { border: 'none', marginLeft: '15px', width: '100%', outline: 'none' }, grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }, cardProduct: { background: 'white', padding: '25px', borderRadius: '20px', cursor: 'pointer', textAlign: 'center' }, productTitle: { fontSize: '16px' }, priceTag: { color: '#0e2a5a', fontWeight: '800', fontSize: '24px' }, sidebar: { width: '400px', background: 'white', display: 'flex', flexDirection: 'column' }, ticketHeader: { padding: '25px', fontWeight: 'bold' }, ticketItem: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px' }, deleteBtn: { background: '#f8fafc', border: 'none', cursor: 'pointer' }, sidebarFooter: { padding: '25px' }, totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '28px', color: '#0e2a5a', fontWeight: '900' }, btnCobrar: { width: '100%', padding: '18px', background: '#0e2a5a', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }, overlay: { position: 'fixed', inset: 0, background: 'rgba(14, 42, 90, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }, modal: { background: 'white', borderRadius: '35px', width: '440px', position: 'relative', padding: '20px' }, closeBtn: { position: 'absolute', top: '20px', right: '20px', border: 'none', cursor: 'pointer' }, modalContent: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, centeredColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }, modalBigTotal: { fontSize: '48px', fontWeight: '900', color: '#0e2a5a' }, statusBadge: { background: '#fffbeb', color: '#b45309', padding: '10px 20px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }, qrBox: { padding: '20px', background: 'white', borderRadius: '25px', border: '1px solid #f1f5f9' }, cashInput: { width: '100%', padding: '15px', fontSize: '24px', textAlign: 'center', marginBottom: '15px' }, btnFinalize: { width: '100%', background: '#0e2a5a', color: 'white', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }, methodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }, methodCard: { padding: '25px', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', textAlign: 'center', color: '#0e2a5a', fontWeight: 'bold' } };

export default FluxPaySystem;
