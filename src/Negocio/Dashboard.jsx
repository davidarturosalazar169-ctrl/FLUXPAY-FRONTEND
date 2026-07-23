import React, { useState, useEffect } from "react";
import { 
  FaChartLine, FaCookie, FaCandyCane, FaWineBottle, 
  FaAppleAlt, FaFileDownload 
} from "react-icons/fa";
import * as XLSX from "xlsx";
import axios from "axios";

export default function DashboardNegocio() {
  const [mesSeleccionado, setMesSeleccionado] = useState("Todos");
  const [activeTooltip, setActiveTooltip] = useState(null);

  // ESTADOS
  const [productos, setProductos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [resumen, setResumen] = useState({ total: 0, efectivo: 0, qr: 0 });

  // 🔌 CONEXIÓN A LARAVEL
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      } 
    };

    axios.get("http://127.0.0.1:8000/api/tienda/dashboard/productos", config)
      .then(res => setProductos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error productos:", err));

    axios.get("http://127.0.0.1:8000/api/tienda/dashboard/ingresos", config)
      .then(res => setIngresos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error ingresos:", err));

    axios.get("http://127.0.0.1:8000/api/tienda/dashboard/resumen", config)
      .then(res => setResumen(res.data))
      .catch(err => console.error("Error resumen:", err));
  }, []);

  const efectivoGrafica = parseFloat(ingresos.find(i => i.metodo_pago === "efectivo")?.total || 0);
  const qrGrafica = parseFloat(ingresos.find(i => i.metodo_pago === "qr")?.total || 0);
  const totalGrafica = (efectivoGrafica + qrGrafica) || 1;

  const getIcon = (name) => {
    const iconStyle = { fontSize: "1.4rem", marginRight: "12px" };
    switch (name) {
      case "Galletas": return <FaCookie style={{ ...iconStyle, color: "#475569" }} />;
      case "Sabritas": return <FaAppleAlt style={{ ...iconStyle, color: "#1e293b" }} />;
      case "Refrescos": return <FaWineBottle style={{ ...iconStyle, color: "#334155" }} />;
      case "Golosinas": return <FaCandyCane style={{ ...iconStyle, color: "#64748b" }} />;
      default: return <FaAppleAlt style={{ ...iconStyle, color: "#94a3b8" }} />;
    }
  };

  const exportToExcel = () => {
    const worksheet1 = XLSX.utils.json_to_sheet([
      { Concepto: "Total", Valor: resumen.total },
      { Concepto: "Efectivo", Valor: resumen.efectivo },
      { Concepto: "QR", Valor: resumen.qr }
    ]);
    const worksheet2 = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, "Resumen_Financiero");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Inventario_Detalle");
    XLSX.writeFile(workbook, `Reporte_FluxPay_${mesSeleccionado}.xlsx`);
  };

  return (
    <section style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Dashboard</h2>
          <p style={subtitleStyle}>Bienvenido a ImpulsaPay</p>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <select 
            value={mesSeleccionado} 
            onChange={(e) => setMesSeleccionado(e.target.value)}
            style={selectStyle}
          >
            <option value="Todos">Todos los meses</option>
            <option value="Enero">Enero 2026</option>
            <option value="Diciembre">Diciembre 2025</option>
          </select>

          <button onClick={exportToExcel} style={btnExportStyle}>
            <FaFileDownload /> Exportar Reporte
          </button>
        </div>
      </div>

      {/* CARDS SUPERIORES */}
      <div style={metricsRowStyle}>
        <div style={metricCardStyle}>
          <div style={metricHeader}>
            <span style={metricLabelStyle}>Ingresos Efectivo</span>
            <FaChartLine color="#94a3b8" />
          </div>
          <h3 style={metricValueStyle}>${resumen.efectivo.toLocaleString()}.00</h3>
        </div>
        <div style={metricCardStyle}>
          <div style={metricHeader}>
            <span style={metricLabelStyle}>Ingresos QR</span>
            <FaChartLine color="#94a3b8" />
          </div>
          <h3 style={metricValueStyle}>${resumen.qr.toLocaleString()}.00</h3>
        </div>
        <div style={{ ...metricCardStyle, borderLeft: "5px solid #0f172a" }}>
          <div style={metricHeader}>
            <span style={metricLabelStyle}>Total General</span>
            <FaChartLine color="#0f172a" />
          </div>
          <h3 style={{ ...metricValueStyle, color: "#0f172a" }}>${resumen.total.toLocaleString()}.00</h3>
        </div>
      </div>

      <div style={mainGridStyle}>
        {/* TABLA INVENTARIO */}
        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>Inventario Actual</h4>
          <table style={tableStyle}>
            <thead>
              <tr style={thRowStyle}>
                <th style={thStyle}>PRODUCTO</th>
                <th style={{ ...thStyle, textAlign: "center" }}>UNIDADES</th>
                <th style={{ ...thStyle, textAlign: "right" }}>INGRESOS</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((item, index) => (
                <tr key={index} style={trStyle}>
                  <td style={nameText}>
                    {getIcon(item.name)} {item.name}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center", fontWeight: "700" }}>{item.units}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: "800", color: "#0f172a" }}>
                    ${item.income.toLocaleString()}.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GRÁFICA MÉTODOS PAGO */}
        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>Distribución de Pagos</h4>
          <div style={chartContainer}>
            <div 
              style={{ ...barStyle, height: `${(efectivoGrafica / totalGrafica) * 100}%`, background: "#0f172a" }}
              onMouseEnter={() => setActiveTooltip("ef")} onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === "ef" && <span style={tooltipStyle}>${efectivoGrafica}</span>}
            </div>
            <div 
              style={{ ...barStyle, height: `${(qrGrafica / totalGrafica) * 100}%`, background: "#94a3b8" }}
              onMouseEnter={() => setActiveTooltip("qr")} onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === "qr" && <span style={tooltipStyle}>${qrGrafica}</span>}
            </div>
          </div>
          <div style={legendStyle}>
            <div style={legendItem}><span style={{ ...dot, background: "#0f172a" }}></span> Efectivo: {((efectivoGrafica / totalGrafica) * 100).toFixed(1)}%</div>
            <div style={legendItem}><span style={{ ...dot, background: "#94a3b8" }}></span> QR: {((qrGrafica / totalGrafica) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- SISTEMA DE DISEÑO (UNIFICADO CON CUENTA.JS) ---
const containerStyle = { backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px", fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" };
const titleStyle = { color: "#0f172a", fontSize: "26px", fontWeight: "800", margin: 0 };
const subtitleStyle = { color: "#64748b", fontSize: "16px", margin: "4px 0 0 0" };

const selectStyle = { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "15px", fontWeight: "600", color: "#0f172a", outline: "none", cursor: "pointer" };
const btnExportStyle = { display: "flex", alignItems: "center", gap: "10px", background: "#0f172a", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px" };

const metricsRowStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "35px" };
const metricCardStyle = { background: "white", padding: "26px", borderRadius: "18px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" };
const metricHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" };
const metricLabelStyle = { fontSize: "15px", color: "#64748b", fontWeight: "600" };
const metricValueStyle = { fontSize: "28px", fontWeight: "800", color: "#334155", margin: 0 };

const mainGridStyle = { display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "30px" };
const cardStyle = { background: "white", padding: "28px", borderRadius: "20px", border: "1px solid #e2e8f0" };
const cardTitleStyle = { margin: "0 0 25px 0", fontSize: "15px", color: "#64748b", fontWeight: "800", textTransform: 'uppercase', letterSpacing: '1px' };

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thRowStyle = { borderBottom: "1px solid #f1f5f9" };
const thStyle = { padding: "15px", textAlign: "left", color: "#94a3b8", fontSize: "12px", fontWeight: "800", letterSpacing: '1px' };
const trStyle = { borderBottom: "1px solid #f8fafc" };
const tdStyle = { padding: "18px 15px", fontSize: "15px", color: "#475569" };
const nameText = { ...tdStyle, fontWeight: "600", color: "#0f172a", display: "flex", alignItems: "center" };

const chartContainer = { height: "220px", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "40px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" };
const barStyle = { position: "relative", width: "60px", borderRadius: "8px 8px 2px 2px", transition: "all 0.3s ease", cursor: "pointer" };
const tooltipStyle = { position: "absolute", top: "-35px", left: "50%", transform: "translateX(-50%)", background: "#0f172a", color: "white", padding: "5px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" };

const legendStyle = { marginTop: "25px", display: "flex", flexDirection: "column", gap: "12px" };
const legendItem = { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "600", color: "#475569" };
const dot = { width: "10px", height: "10px", borderRadius: "50%" };