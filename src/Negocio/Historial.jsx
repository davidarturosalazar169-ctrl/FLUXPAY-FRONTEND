import React, { useState, useEffect } from "react";
import { 
    FaSearch, FaTimes, FaCalendarAlt, 
    FaDownload, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const API_BASE = import.meta.env.VITE_API_URL;

// const API_URL = "http://localhost:8000/api/movimientos";
const API_URL = `${API_BASE}/movimientos`;

export default function HistorialNegocio() {
    const [transacciones, setTransacciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 8; // Ajustado para mejor proporción visual

    useEffect(() => {
        const fetchMovimientos = async () => {
            try {
                setCargando(true);
                const response = await axios.get(API_URL, {
                    params: { q: busqueda, desde: fechaInicio, hasta: fechaFin }
                });
                setTransacciones(response.data);
                setPaginaActual(1); 
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setCargando(false);
            }
        };
        const timeoutId = setTimeout(fetchMovimientos, 500);
        return () => clearTimeout(timeoutId);
    }, [busqueda, fechaInicio, fechaFin]);

    const ultimoIndice = paginaActual * registrosPorPagina;
    const primerIndice = ultimoIndice - registrosPorPagina;
    const registrosPagina = transacciones.slice(primerIndice, ultimoIndice);
    const totalPaginas = Math.ceil(transacciones.length / registrosPorPagina);

    const exportarExcel = () => {
        const datosExcel = transacciones.map(t => ({
            "FECHA": t.fecha_movimiento,
            "REFERENCIA": t.referencia_pago,
            "MONTO TOTAL": `$${t.monto_total}`,
            "ESTADO": t.status === 1 ? "Completado" : "Pendiente"
        }));
        const worksheet = XLSX.utils.json_to_sheet(datosExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, `FluxPay_Historial.xlsx`);
    };

    return (
        <div style={containerStyle}>
            {/* HEADER ESTILO PRODUCTOS */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Historial de Actividad</h2>
                    <p style={subtitleStyle}>{transacciones.length} movimientos encontrados</p>
                </div>
                <button onClick={exportarExcel} style={btnExportarStyle}>
                    <FaDownload size={12} /> Exportar Reporte
                </button>
            </div>

            <div style={tableCardStyle}>
                {/* FILTROS CLEAN */}
                <div style={barraFiltrosStyle}>
                    <div style={contenedorBusqueda}>
                        <FaSearch style={{ color: "#94a3b8" }} size={14} />
                        <input 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por referencia..." 
                            style={inputBusquedaInner} 
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={contenedorFecha}>
                            <FaCalendarAlt size={12} color="#94a3b8" />
                            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={inputFechaStyle} />
                        </div>
                        <span style={{ color: "#cbd5e1" }}>—</span>
                        <div style={contenedorFecha}>
                            <FaCalendarAlt size={12} color="#94a3b8" />
                            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={inputFechaStyle} />
                        </div>
                        {(fechaInicio || fechaFin || busqueda) && (
                            <button onClick={() => {setBusqueda(""); setFechaInicio(""); setFechaFin("");}} style={btnLimpiarStyle}>
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLA CON PROPORCIONES DE PRODUCTOS */}
                <table style={tableStyle}>
                    <thead>
                        <tr style={thRowStyle}>
                            <th style={thStyle}>FECHA</th>
                            <th style={thStyle}>REFERENCIA DE PAGO</th>
                            <th style={thStyle}>MONTO TOTAL</th>
                            <th style={{ ...thStyle, textAlign: "right" }}>ESTADO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!cargando ? (
                            registrosPagina.map((item) => (
                                <tr key={item.id} style={trStyle}>
                                    <td style={tdStyle}>
                                        <span style={dateText}>{new Date(item.fecha_movimiento).toLocaleDateString()}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={dotStyle} />
                                            <span style={referenceText}>{item.referencia_pago}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={amountText}>${item.monto_total.toLocaleString()}</span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: "right" }}>
                                        <span style={statusBadge(item.status)}>
                                            {item.status === 1 ? "Completado" : "Pendiente"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={loadingTd}>Cargando historial...</td></tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINACIÓN (MANTENIENDO TU ESTRUCTURA ORIGINAL) */}
                {totalPaginas > 1 && (
                    <div style={estiloPaginacion}>
                        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                            Mostrando <span style={{ fontWeight: "600", color: "#0f172a" }}>{primerIndice + 1}</span> a <span style={{ fontWeight: "600", color: "#0f172a" }}>{Math.min(ultimoIndice, transacciones.length)}</span> de {transacciones.length}
                        </p>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} style={estiloBtnPagina(paginaActual === 1)}>
                                <FaChevronLeft fontSize="10px" />
                            </button>
                            {[...Array(totalPaginas)].map((_, i) => (
                                <button key={i + 1} onClick={() => setPaginaActual(i + 1)} style={paginaActual === i + 1 ? estiloBtnPaginaActivo : estiloBtnPagina(false)}>
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas} style={estiloBtnPagina(paginaActual === totalPaginas)}>
                                <FaChevronRight fontSize="10px" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- ESTILOS "CLEAN" (IGUAL A PRODUCTOS) ---
const containerStyle = { padding: "40px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" };
const titleStyle = { margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.02em" };
const subtitleStyle = { margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" };
const btnExportarStyle = { background: "#0f172a", color: "white", padding: "10px 18px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" };

const tableCardStyle = { background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" };
const barraFiltrosStyle = { padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff" };

const contenedorBusqueda = { display: "flex", alignItems: "center", gap: "10px", background: "#f1f5f9", padding: "8px 16px", borderRadius: "10px", width: "320px" };
const inputBusquedaInner = { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "13px", color: "#1e293b" };

const contenedorFecha = { display: "flex", alignItems: "center", gap: "8px", background: "#ffffff", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "8px" };
const inputFechaStyle = { border: "none", outline: "none", fontSize: "12px", color: "#475569", cursor: "pointer" };
const btnLimpiarStyle = { background: "#fee2e2", color: "#ef4444", border: "none", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thRowStyle = { background: "#fcfcfc" };
const thStyle = { padding: "14px 24px", textAlign: "left", color: "#64748b", fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #f1f5f9" };
const trStyle = { borderBottom: "1px solid #f1f5f9" };
const tdStyle = { padding: "16px 24px" };

const dateText = { fontSize: "14px", fontWeight: "500", color: "#64748b" };
const referenceText = { fontSize: "14px", fontWeight: "600", color: "#0f172a" };
const amountText = { fontSize: "15px", fontWeight: "700", color: "#0f172a" };
const dotStyle = { width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6" };

const statusBadge = (status) => ({
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    background: status === 1 ? "#ecfdf5" : "#fffbeb",
    color: status === 1 ? "#065f46" : "#b45309",
    border: `1px solid ${status === 1 ? "#d1fae5" : "#fef3c7"}`
});

const loadingTd = { textAlign: "center", padding: "60px", color: "#64748b", fontSize: "14px" };

// --- TU BARRA DE PAGINACIÓN ORIGINAL ---
const estiloPaginacion = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "#fcfcfc" };
const estiloBtnPagina = (disabled) => ({ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e2e8f0", background: disabled ? "#f8fafc" : "white", color: disabled ? "#cbd5e1" : "#1e293b", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", transition: "all 0.2s" });
const estiloBtnPaginaActivo = { width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#0f172a", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" };