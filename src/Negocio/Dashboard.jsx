import React, { useState, useEffect } from "react";
import { 
  FaChartLine, FaCookie, FaCandyCane, FaWineBottle, 
  FaAppleAlt, FaFileDownload, FaWallet, FaQrcode, FaCreditCard, FaExchangeAlt 
} from "react-icons/fa";
import * as XLSX from "xlsx";
import axios from "axios";

export default function DashboardNegocio() {
  const [mesSeleccionado, setMesSeleccionado] = useState("Todos");
  const [activeIndex, setActiveIndex] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  // ESTADOS DEL BACKEND
  const [productos, setProductos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [resumen, setResumen] = useState({ 
    total: 0, 
    efectivo: 0, 
    qr: 0, 
    tarjeta: 0, 
    transferencia: 0 
  });

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

    axios.get(`${API_URL}/tienda/dashboard/productos`, config)
      .then(res => setProductos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error productos:", err));

    axios.get(`${API_URL}/tienda/dashboard/ingresos`, config)
      .then(res => setIngresos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error ingresos:", err));

    axios.get(`${API_URL}/tienda/dashboard/resumen`, config)
      .then(res => setResumen(res.data))
      .catch(err => console.error("Error resumen:", err));
  }, []);

  // PROCESAMIENTO MATEMÁTICO DE LOS INGRESOS
  const efectivo = parseFloat(ingresos.find(i => i.metodo_pago?.toLowerCase() === "efectivo")?.total || 0);
  const qr = parseFloat(ingresos.find(i => i.metodo_pago?.toLowerCase() === "qr")?.total || 0);
  const tarjeta = parseFloat(ingresos.find(i => i.metodo_pago?.toLowerCase() === "tarjeta")?.total || 0);
  const transferencia = parseFloat(ingresos.find(i => i.metodo_pago?.toLowerCase() === "transferencia")?.total || 0);

  const totalGrafica = (efectivo + qr + tarjeta + transferencia) || 1;

  // Datos organizados con colores premium desaturados
  const dataMetodos = [
    { name: "Efectivo", value: efectivo, color: "#3b82f6", icon: <FaWallet /> },
    { name: "Código QR", value: qr, color: "#64748b", icon: <FaQrcode /> },
    { name: "Tarjeta", value: tarjeta, color: "#10b981", icon: <FaCreditCard /> },
    { name: "Transferencia", value: transferencia, color: "#f59e0b", icon: <FaExchangeAlt /> }
  ];

  // Función matemática para generar los arcos del Diagrama de Pasteles (SVG Path)
  let cumulativeAngle = 0;
  const generatePieSegments = () => {
    return dataMetodos.map((item, index) => {
      const percentage = item.value / totalGrafica;
      if (percentage === 0) return null;

      const angle = percentage * 360;
      
      // Coordenadas del arco en círculo de radio 50
      const x1 = 70 + 50 * Math.cos((cumulativeAngle - 90) * Math.PI / 180);
      const y1 = 70 + 50 * Math.sin((cumulativeAngle - 90) * Math.PI / 180);
      
      cumulativeAngle += angle;
      
      const x2 = 70 + 50 * Math.cos((cumulativeAngle - 90) * Math.PI / 180);
      const y2 = 70 + 50 * Math.sin((cumulativeAngle - 90) * Math.PI / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // Comando de dibujo SVG
      const pathData = `M 70 70 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      return {
        pathData,
        color: item.color,
        name: item.name,
        percentage: (percentage * 100).toFixed(1),
        value: item.value,
        index
      };
    }).filter(Boolean);
  };

  const pieSegments = generatePieSegments();

  const getIcon = (name) => {
    const iconStyle = { fontSize: "1.2rem", marginRight: "12px" };
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
      { Concepto: "Total General", Valor: resumen.total },
      { Concepto: "Efectivo", Valor: resumen.efectivo },
      { Concepto: "QR", Valor: resumen.qr },
      { Concepto: "Tarjeta", Valor: resumen.tarjeta },
      { Concepto: "Transferencia", Valor: resumen.transferencia }
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
          <h2 style={titleStyle}>Panel de Control</h2>
          <p style={subtitleStyle}>Métricas e inventario de ImpulsaPay</p>
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

      {/* TARJETAS SUPERIORES CON SEPARACIÓN FLUIDA INTELIGENTE */}
      <div style={metricsRowStyle}>
        <div style={metricCardStyle}>
          <div style={metricHeader}>
            <span style={metricLabelStyle}>Efectivo</span>
            <FaWallet color="#3b82f6" size={14} />
          </div>
          <h3 style={metricValueStyle}>${(resumen.efectivo || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
        </div>
        <div style={metricCardStyle}>
          <div style={metricHeader}>
            <span style={metricLabelStyle}>Código QR</span>
            <FaQrcode color="#64748b" size={14} />
          </div>
          <h3 style={metricValueStyle}>${(resumen.qr || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
        </div>
        <div style={metricCardStyle}>
          <div style={metricHeader}>
            <span style={metricLabelStyle}>Tarjeta</span>
            <FaCreditCard color="#10b981" size={14} />
          </div>
          <h3 style={{ ...metricValueStyle, color: "#065f46" }}>${(resumen.tarjeta || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
        </div>
        <div style={metricCardStyle}>
          <div style={metricHeader}>
            <span style={metricLabelStyle}>Transferencia</span>
            <FaExchangeAlt color="#f59e0b" size={14} />
          </div>
          <h3 style={{ ...metricValueStyle, color: "#92400e" }}>${(resumen.transferencia || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
        </div>
        <div style={{ ...metricCardStyle, background: "#0f172a", borderColor: "#0f172a" }}>
          <div style={metricHeader}>
            <span style={{ ...metricLabelStyle, color: "#94a3b8" }}>Total General</span>
            <FaChartLine color="#10b981" size={14} />
          </div>
          <h3 style={{ ...metricValueStyle, color: "#ffffff", fontSize: "21px" }}>${(resumen.total || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
        </div>
      </div>

      <div style={mainGridStyle}>
        {/* INVENTARIO */}
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
                    ${parseFloat(item.income).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📊 DIAGRAMA DE PASTELES PROFESIONAL CON MEDIDAS */}
        <div style={cardStyle}>
          <h4 style={cardTitleStyle}>Diagrama de Pasteles</h4>
          
          <div style={pieContainerStyle}>
            <svg width="100%" height="100%" viewBox="0 0 140 140">
              {pieSegments.map((segment) => {
                const isSelected = activeIndex === segment.index;
                return (
                  <path
                    key={segment.index}
                    d={segment.pathData}
                    fill={segment.color}
                    style={{
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s",
                      transformOrigin: "70px 70px",
                      transform: isSelected ? "scale(1.06)" : "scale(1)",
                      cursor: "pointer",
                      opacity: activeIndex !== null && !isSelected ? 0.4 : 1
                    }}
                    onMouseEnter={() => setActiveIndex(segment.index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                );
              })}
            </svg>
            
            {/* Tooltip flotante con medidas precisas en el centro */}
            {activeIndex !== null && (
              <div style={pieTooltipCenter}>
                <span style={tooltipLabel}>{dataMetodos[activeIndex].name}</span>
                <span style={tooltipValue}>
                  ${dataMetodos[activeIndex].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* REFERENCIAS / LEYENDA DEL DIAGRAMA */}
          <div style={legendListStyle}>
            {dataMetodos.map((metodo, index) => {
              const pct = ((metodo.value / totalGrafica) * 100).toFixed(1);
              const isSelected = activeIndex === index;

              return (
                <div 
                  key={index}
                  style={{
                    ...legendItemStyle,
                    backgroundColor: isSelected ? "#f8fafc" : "transparent",
                    borderLeft: `4px solid ${isSelected ? metodo.color : "transparent"}`
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ ...colorDot, backgroundColor: metodo.color }} />
                    <span style={legendNameText}>{metodo.name}</span>
                  </div>
                  <div style={legendValues}>
                    <span style={legendPercentText}>{pct}%</span>
                    <span style={legendSubAmt}>${metodo.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

// --- SISTEMA DE ARQUITECTURA VISUAL ---
const containerStyle = { backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px", fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" };
const titleStyle = { color: "#0f172a", fontSize: "24px", fontWeight: "800", margin: 0 };
const subtitleStyle = { color: "#64748b", fontSize: "14px", margin: "4px 0 0 0" };

const selectStyle = { padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px", fontWeight: "600", color: "#0f172a", outline: "none", cursor: "pointer", backgroundColor: "#fff" };
const btnExportStyle = { display: "flex", alignItems: "center", gap: "10px", background: "#0f172a", color: "white", border: "none", padding: "11px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" };

// SOLUCIÓN AL ACOMODO APRETADO: Rejilla adaptativa con ancho mínimo controlado (Evita encimamientos)
const metricsRowStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "35px" };
const metricCardStyle = { background: "white", padding: "20px 18px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" };
const metricHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" };
const metricLabelStyle = { fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" };
const metricValueStyle = { fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0, whiteSpace: "nowrap" };

const mainGridStyle = { display: "grid", gridTemplateColumns: "1.5fr 1.2fr", gap: "30px" };
const cardStyle = { background: "white", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px -2px rgba(0,0,0,0.01)" };
const cardTitleStyle = { margin: "0 0 25px 0", fontSize: "13px", color: "#475569", fontWeight: "800", textTransform: 'uppercase', letterSpacing: '1px' };

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thRowStyle = { borderBottom: "2px solid #f1f5f9" };
const thStyle = { padding: "12px 10px", textAlign: "left", color: "#94a3b8", fontSize: "11px", fontWeight: "800" };
const trStyle = { borderBottom: "1px solid #f1f5f9" };
const tdStyle = { padding: "16px 10px", fontSize: "14px", color: "#334155" };
const nameText = { ...tdStyle, fontWeight: "600", color: "#0f172a", display: "flex", alignItems: "center" };

// ESTILOS DE LA NUEVA GRÁFICA DE PASTEL (PIE CHART)
const pieContainerStyle = { position: "relative", width: "180px", height: "180px", margin: "0 auto 30px auto" };
const pieTooltipCenter = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(15, 23, 42, 0.95)", color: "white", padding: "8px 12px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)", pointerEvents: "none", zIndex: 10 };
const tooltipLabel = { fontSize: "10px", fontWeight: "700", textTransform: "uppercase", opacity: 0.8, letterSpacing: "0.5px" };
const tooltipValue = { fontSize: "12px", fontWeight: "800", marginTop: "2px", whiteSpace: "nowrap" };

const legendListStyle = { display: "flex", flexDirection: "column", gap: "6px" };
const legendItemStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", transition: "all 0.2s ease", cursor: "pointer" };
const colorDot = { width: "10px", height: "10px", borderRadius: "50%" };
const legendNameText = { fontSize: "13px", fontWeight: "600", color: "#334155" };
const legendValues = { display: "flex", flexDirection: "column", textAlign: "right" };
const legendPercentText = { fontSize: "13px", fontWeight: "800", color: "#0f172a" };
const legendSubAmt = { fontSize: "11px", color: "#94a3b8", fontWeight: "500", marginTop: "1px" };