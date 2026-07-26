import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaPlus, FaTrash, FaEdit, FaExclamationTriangle,
  FaChevronLeft, FaChevronRight, FaBoxOpen
} from "react-icons/fa";

export default function ProductosNegocio() {
  // ESTADOS
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 7;
  const API_BASE = import.meta.env.VITE_API_URL;

  const API_URL = `${API_BASE}/productos`;
  const MARCAS_URL = `${API_BASE}/marcas`;

  const getAuthHeader = () => ({
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  });

  const fetchData = async () => {
    try {
      const [resProd, resMarcas] = await Promise.all([
        axios.get(API_URL, getAuthHeader()),
        axios.get(MARCAS_URL, getAuthHeader())
      ]);
      setProductos(resProd.data || []);
      setMarcas(resMarcas.data || []);
    } catch (err) {
      console.error("Error en FluxPay:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // LÓGICA DE PAGINACIÓN (Basada en Historial)
  const ultimoIndice = paginaActual * registrosPorPagina;
  const primerIndice = ultimoIndice - registrosPorPagina;
  const registrosPagina = productos.slice(primerIndice, ultimoIndice);
  const totalPaginas = Math.ceil(productos.length / registrosPorPagina);

  const handleGuardar = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datos = {
      nombre: formData.get("nombre"),
      idmarca: parseInt(formData.get("idmarca")),
      tipoProducto: formData.get("tipoProducto"),
      precio: parseFloat(formData.get("precio")),
      idnegocio: 1,
      status: 1
    };

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, datos, getAuthHeader());
      } else {
        await axios.post(API_URL, datos, getAuthHeader());
      }
      fetchData();
      cerrarModal();
    } catch (err) {
      alert("Error al procesar la solicitud");
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      await axios.delete(`${API_URL}/${productoAEliminar.id}`, getAuthHeader());
      fetchData();
      setShowDeleteModal(false);
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const cerrarModal = () => { setShowModal(false); setEditandoId(null); };

  const productoActual = editandoId ? productos.find(p => p.id === editandoId) : null;

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Inventario</h2>
          <p style={subtitleStyle}>{productos.length} productos registrados</p>
        </div>
        <button onClick={() => setShowModal(true)} style={btnPlusStyle}>
          <FaPlus size={12} /> Nuevo Producto
        </button>
      </div>

      {/* TABLA */}
      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={thRowStyle}>
              <th style={thStyle}>PRODUCTO</th>
              <th style={thStyle}>VARIEDAD</th>
              <th style={thStyle}>PRECIO</th>
              <th style={{ ...thStyle, textAlign: "right" }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {registrosPagina.length > 0 ? (
              registrosPagina.map((item) => (
                <tr key={item.id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={brandText}>
                      {marcas.find(m => String(m.id) === String(item.idmarca))?.nombre || "Genérico"}
                    </div>
                    <div style={productText}>{item.nombre}</div>
                  </td>
                  <td style={tdStyle}>{item.tipoProducto}</td>
                  <td style={priceText}>${item.precio.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button onClick={() => { setEditandoId(item.id); setShowModal(true); }} style={actionBtn}><FaEdit /></button>
                    <button onClick={() => { setProductoAEliminar(item); setShowDeleteModal(true); }} style={deleteBtn}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No hay productos registrados.</td></tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN ESTILO HISTORIAL */}
        {totalPaginas > 1 && (
          <div style={estiloPaginacion}>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Mostrando <span style={{ fontWeight: "700", color: "#0e2a5a" }}>{primerIndice + 1}</span> a <span style={{ fontWeight: "700", color: "#0e2a5a" }}>{Math.min(ultimoIndice, productos.length)}</span> de {productos.length} registros
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                style={estiloBtnPagina(paginaActual === 1)}
              >
                <FaChevronLeft fontSize="12px" />
              </button>
              
              {[...Array(totalPaginas)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPaginaActual(i + 1)}
                  style={paginaActual === i + 1 ? estiloBtnPaginaActivo : estiloBtnPagina(false)}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
                style={estiloBtnPagina(paginaActual === totalPaginas)}
              >
                <FaChevronRight fontSize="12px" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeader}>
              <FaBoxOpen color="#0e2a5a" size={20} />
              <h3 style={{ margin: 0, fontSize: '18px' }}>{editandoId ? "Editar Producto" : "Nuevo Producto"}</h3>
            </div>
            <form onSubmit={handleGuardar} style={formStyle}>
              <div style={inputGroup}>
                <label style={labelStyle}>Nombre / Categoría</label>
                <input name="nombre" defaultValue={productoActual?.nombre} required style={inputStyle} placeholder="Ej. Perfume" />
              </div>
              
              <div style={inputGroup}>
                <label style={labelStyle}>Marca</label>
                <select name="idmarca" defaultValue={productoActual?.idmarca} required style={inputStyle}>
                  <option value="">Seleccionar...</option>
                  {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Variedad (Sabor/Modelo)</label>
                <input name="tipoProducto" defaultValue={productoActual?.tipoProducto} required style={inputStyle} placeholder="Ej. Citríco" />
              </div>
              
              <div style={inputGroup}>
                <label style={labelStyle}>Precio de venta</label>
                <input name="precio" type="number" step="0.01" defaultValue={productoActual?.precio} required style={inputStyle} placeholder="0.00" />
              </div>

              <div style={modalFooter}>
                <button type="button" onClick={cerrarModal} style={btnCancel}>Cancelar</button>
                <button type="submit" style={btnSave}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {showDeleteModal && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: '300px', padding: '30px' }}>
            <FaExclamationTriangle color="#ef4444" size={40} style={{ marginBottom: '15px' }} />
            <p style={{ margin: '0 0 20px 0', color: '#1e293b' }}>¿Deseas eliminar <b>{productoAEliminar?.nombre}</b>?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDeleteModal(false)} style={btnCancel}>No</button>
              <button onClick={ejecutarEliminacion} style={btnConfirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- ESTILOS DE TABLA E INTERFAZ ---
const containerStyle = { padding: "40px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const titleStyle = { margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: "700" };
const subtitleStyle = { margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" };
const btnPlusStyle = { background: "#0f172a", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" };

const tableCardStyle = { background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thRowStyle = { background: "#fcfcfc" };
const thStyle = { padding: "16px 24px", textAlign: "left", color: "#64748b", fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #f1f5f9" };
const trStyle = { borderBottom: "1px solid #f1f5f9" };
const tdStyle = { padding: "16px 24px" };

const brandText = { fontWeight: "600", color: "#0f172a", fontSize: "14px" };
const productText = { fontSize: "12px", color: "#64748b", marginTop: "2px" };
const priceText = { padding: "16px 24px", fontWeight: "700", color: "#0f172a", fontSize: "14px" };

const actionBtn = { background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "16px", padding: "8px", borderRadius: "6px" };
const deleteBtn = { ...actionBtn, color: "#cbd5e1", marginLeft: "4px" };

// --- ESTILOS DE PAGINACIÓN (Sincronizado con Historial) ---
const estiloPaginacion = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderTop: "1px solid #f1f5f9", background: "#fcfcfc" };
const estiloBtnPagina = (disabled) => ({ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid #e2e8f0", background: disabled ? "#f8fafc" : "white", color: disabled ? "#cbd5e1" : "#1e293b", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", transition: "all 0.2s" });
const estiloBtnPaginaActivo = { width: "36px", height: "36px", borderRadius: "10px", border: "none", background: "#0e2a5a", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" };

// --- ESTILOS MODALES ---
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 };
const modalStyle = { background: "white", borderRadius: "20px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", overflow: "hidden" };
const modalHeader = { padding: "24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "12px" };
const formStyle = { padding: "24px" };
const inputGroup = { marginBottom: "16px" };
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" };
const modalFooter = { display: "flex", gap: "12px", marginTop: "24px" };
const btnSave = { flex: 2, padding: "12px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" };
const btnCancel = { flex: 1, padding: "12px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontWeight: "600" };
const btnConfirmDelete = { ...btnSave, background: "#ef4444" };