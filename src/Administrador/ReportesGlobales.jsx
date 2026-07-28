import "./ReportesGlobales.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Chart from "react-apexcharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  FaHome,
  FaStore,
  FaChartBar,
  FaHeadset,
  FaArrowUp,
  FaFileExcel,
  FaCog,
  FaBell,
  FaUserLock,
  FaBoxes,
} from "react-icons/fa";
import CerrarSesion from "../CerrarSesion";

function ReportesGlobales() {
  const navigate = useNavigate();
  const [filtroActivo, setFiltroActivo] = useState("Día");
  const [busqueda, setBusqueda] = useState("");
  const [data, setData] = useState(null); // Misma lógica de estado del usuario que en Gestión de Negocios

  const datosIngresos = {
    Día: [1200, 1500, 1100, 1800, 1600, 2100, 1900],
    Semana: [8200, 7600, 9100, 10500],
    Mes: [32000, 41000, 38000, 45000]
  };

  const datosVentas = {
    Día: [120, 150, 110, 180, 160, 210, 190],
    Semana: [820, 760, 910, 1050],
    Mes: [3200, 4100, 3800, 4500]
  };

  const categorias =
    filtroActivo === "Día"
      ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      : filtroActivo === "Semana"
      ? ["Sem 1", "Sem 2", "Sem 3", "Sem 4"]
      : ["Ene", "Feb", "Mar", "Abr"];

  const chartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%"
      }
    },
    dataLabels: { enabled: false },
    xaxis: { categories: categorias },
    colors: ["#1e88e5", "#2ecc71"],
    legend: { position: "top" }
  };

  const chartSeries = [
    { name: "Ingresos", data: datosIngresos[filtroActivo] },
    { name: "Ventas", data: datosVentas[filtroActivo] }
  ];

  const exportarExcel = () => {
    const datos = categorias.map((item, index) => ({
      Periodo: item,
      Ingresos: datosIngresos[filtroActivo][index],
      Ventas: datosVentas[filtroActivo][index]
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reporte");

    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blobData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(
      blobData,
      `Reporte_ImpulsaPay_${filtroActivo}_${new Date().toLocaleDateString()}.xlsx`
    );
  };

  const ventas = [
    { fecha: "24/04/2026", negocio: "Café El Roble", metodo: "QR", monto: 320 },
    { fecha: "24/04/2026", negocio: "Moda Express", metodo: "Efectivo", monto: 500 }
  ];

  const ventasFiltradas = ventas.filter((v) =>
    v.negocio.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo-container">
            <img src="/impulsaPay.jpg" alt="ImpulsaPay" className="admin-logo" />
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/dashboard")}><FaHome /> Dashboard</li>
            <li onClick={() => navigate("/admin/negocios")}><FaStore /> Gestión Negocios</li>
            <li onClick={() => navigate("/admin/inventario")}><FaBoxes /> Inventario</li>
            <li className="active"><FaChartBar /> Reportes globales</li>
            <li onClick={() => navigate("/admin/soporte")}><FaHeadset /> Soporte</li>
            <li onClick={() => navigate("/admin/permisos")}><FaUserLock /> Roles y permisos</li> 
          </ul>
        </div>
        <div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/configuracion")}><FaCog /> Configuración</li>
          </ul>
          <div><CerrarSesion /></div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="admin-main">
        {/* HEADER UNIFICADO (Idéntico diseño, variables y estructura que Gestión de Negocios) */}
        <header className="modern-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Reportes globales</h1>
              <p>Administra todos los reportes globales</p>
            </div>

            <div className="header-right">
              <div className="profile-info">
                <span className="profile-name">{data?.usuario_nombre || "José Aguilar"}</span>
                <span className="profile-email">{data?.usuario_email || "joseagui@gmail.com"}</span>
              </div>

              <div className="avatar-container">
                {data?.usuario_avatar ? (
                  <img src={data.usuario_avatar} alt="Avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-fallback">
                    {data?.usuario_nombre?.charAt(0) || "J"}
                  </div>
                )}
                <span className="status-indicator"></span>
              </div>

              <button className="notification-btn">
                <FaBell />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENIDO ORIGINAL DE TABLAS Y GRÁFICAS */}
        <main className="admin-dashboard">
          {/* TARJETAS */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Ingresos totales</h3>
              <p className="stat-value">$128,900</p>
              <span className="stat-growth"><FaArrowUp /> 15%</span>
            </div>
            <div className="stat-card">
              <h3>Ventas totales</h3>
              <p className="stat-value">2,520</p>
            </div>
            <div className="stat-card">
              <h3>Pagos con QR</h3>
              <p className="stat-value">1,800</p>
            </div>
            <div className="stat-card">
              <h3>Pagos en efectivo</h3>
              <p className="stat-value">720</p>
            </div>
          </div>

          {/* GRAFICA */}
          <div className="card">
            <div className="card-header">
              <h3>Ingresos y ventas</h3>
              <div className="filters">
                {["Día", "Semana", "Mes"].map((item) => (
                  <button
                    key={item}
                    className={`filter-btn ${filtroActivo === item ? "active" : ""}`}
                    onClick={() => setFiltroActivo(item)}
                  >
                    {item}
                  </button>
                ))}
                <button className="excel-btn" onClick={exportarExcel}>
                  <FaFileExcel /> Exportar Excel
                </button>
              </div>
            </div>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={280} />
          </div>

          {/* TABLA RESUMEN */}
          <div className="card">
            <h3>Resumen de pagos</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Transacciones</th>
                  <th>Monto total</th>
                  <th>Última actualización</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>QR Pagos</td>
                  <td>1,800</td>
                  <td>$85,320</td>
                  <td>Hace 1 hora</td>
                </tr>
                <tr>
                  <td>Efectivo</td>
                  <td>720</td>
                  <td>$43,530</td>
                  <td>Hace 3 horas</td>
                </tr>
                <tr className="total-row">
                  <td>Total</td>
                  <td>2,520</td>
                  <td>$128,900</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RECIENTES */}
          <div className="card">
            <div className="card-header">
              <h3>Ventas y cobros recientes</h3>
              <button className="view-all">Ver todos</button>
            </div>
            <table className="table">
              <tbody>
                {ventasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>No se encontraron resultados</td>
                  </tr>
                ) : (
                  ventasFiltradas.map((v, i) => (
                    <tr key={i}>
                      <td>{v.fecha}</td>
                      <td>{v.negocio}</td>
                      <td>{v.metodo}</td>
                      <td>${v.monto}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ReportesGlobales;