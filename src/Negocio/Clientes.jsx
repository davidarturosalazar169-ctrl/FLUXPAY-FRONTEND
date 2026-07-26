import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUserPlus, FaTrash, FaUserEdit, FaUserCircle, 
  FaExclamationTriangle, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 7;
  const API_BASE = import.meta.env.VITE_API_URL;

  // const API_URL = "http://localhost:8000/api/clientes";
  const API_URL = `${API_BASE}/clientes`;

  const getAuthHeader = () => ({
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  });

  const fetchClientes = async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      setClientes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error en FluxPay:", err);
    }
  };

  useEffect(() => { fetchClientes(); }, []);

  // LÓGICA DE PAGINACIÓN (Sincronizada con Historial e Inventario)
  const ultimoIndice = paginaActual * registrosPorPagina;
  const primerIndice = ultimoIndice - registrosPorPagina;
  const registrosPagina = clientes.slice(primerIndice, ultimoIndice);
  const totalPaginas = Math.ceil(clientes.length / registrosPorPagina);

  const handleGuardar = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datos = {
      nombre: formData.get("nombre"), 
      correo: formData.get("correo"),
      password: "password123",
      rol: "cliente"
    };

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, datos, getAuthHeader());
      } else {
        await axios.post(API_URL, datos, getAuthHeader());
      }
      fetchClientes(); 
      cerrarModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error al procesar");
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      await axios.delete(`${API_URL}/${clienteAEliminar.id}`, getAuthHeader());
      fetchClientes();
      setShowDeleteModal(false);
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const cerrarModal = () => { setShowModal(false); setEditandoId(null); };
  const clienteActual = editandoId ? clientes.find(x => x.id === editandoId) : null;

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Gestión de Clientes</h2>
          <p style={subtitleStyle}>{clientes.length} usuarios registrados</p>
        </div>
        <button onClick={() => setShowModal(true)} style={btnPlusStyle}>
          <FaUserPlus size={14} /> Nuevo Cliente
        </button>
      </div>

      {/* TABLA COORDINADA */}
      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={thRowStyle}>
              <th style={thStyle}>USUARIO</th>
              <th style={thStyle}>CORREO ELECTRÓNICO</th>
              <th style={{ ...thStyle, textAlign: "right" }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {registrosPagina.length > 0 ? (
              registrosPagina.map((c) => (
                <tr key={c.id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FaUserCircle size={32} color="#cbd5e1" />
                      <div style={nameText}>{c.name}</div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={emailText}>{c.email}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button onClick={() => { setEditandoId(c.id); setShowModal(true); }} style={actionBtn}><FaUserEdit /></button>
                    <button onClick={() => { setClienteAEliminar(c); setShowDeleteModal(true); }} style={deleteBtn}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan="3" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No hay clientes registrados.</td></tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN (Estilo exacto a Historial e Inventario) */}
        {totalPaginas > 1 && (
          <div style={estiloPaginacion}>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Mostrando <span style={{ fontWeight: "700", color: "#0e2a5a" }}>{primerIndice + 1}</span> a <span style={{ fontWeight: "700", color: "#0e2a5a" }}>{Math.min(ultimoIndice, clientes.length)}</span> de {clientes.length} registros
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
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{editandoId ? "Editar Cliente" : "Nuevo Cliente"}</h3>
            </div>
            <form onSubmit={handleGuardar} style={{ padding: '24px' }}>
              <div style={inputGroup}>
                <label style={labelStyle}>Nombre Completo</label>
                <input name="nombre" defaultValue={clienteActual?.name || ""} required style={inputStyle} placeholder="Nombre del cliente" />
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Correo Electrónico</label>
                <input name="correo" type="email" defaultValue={clienteActual?.email || ""} required style={inputStyle} placeholder="correo@ejemplo.com" />
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
          <div style={{ ...modalStyle, width: '320px', padding: '30px', textAlign: 'center' }}>
            <FaExclamationTriangle size={40} color="#ef4444" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#1e293b', marginBottom: '25px', fontSize: '15px' }}>¿Deseas eliminar a <b>{clienteAEliminar?.name}</b>?</p>
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

// --- SISTEMA DE DISEÑO UNIFICADO ---
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
const tdStyle = { padding: "16px 24px", verticalAlign: "middle" };

const nameText = { fontWeight: "600", color: "#0f172a", fontSize: "14px" };
const emailText = { color: "#64748b", fontSize: "14px" };

const actionBtn = { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "18px", padding: "8px", borderRadius: "6px" };
const deleteBtn = { ...actionBtn, marginLeft: "4px" };

// --- PAGINACIÓN (Mismo diseño que Inventario/Historial) ---
const estiloPaginacion = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderTop: "1px solid #f1f5f9", background: "#fcfcfc" };
const estiloBtnPagina = (disabled) => ({ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid #e2e8f0", background: disabled ? "#f8fafc" : "white", color: disabled ? "#cbd5e1" : "#1e293b", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", transition: "all 0.2s" });
const estiloBtnPaginaActivo = { width: "36px", height: "36px", borderRadius: "10px", border: "none", background: "#0e2a5a", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" };

// --- MODALES ---
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 };
const modalStyle = { background: "white", borderRadius: "20px", width: "380px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", overflow: "hidden" };
const modalHeader = { padding: "24px", borderBottom: "1px solid #f1f5f9", textAlign: 'center' };
const inputGroup = { marginBottom: "16px" };
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" };
const modalFooter = { display: "flex", gap: "12px", marginTop: "24px" };
const btnSave = { flex: 2, padding: "12px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" };
const btnCancel = { flex: 1, padding: "12px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontWeight: "600" };
const btnConfirmDelete = { ...btnSave, background: "#ef4444" };