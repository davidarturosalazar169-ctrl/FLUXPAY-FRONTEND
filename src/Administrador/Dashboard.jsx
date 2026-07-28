import "./DashboardAdmin.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { tienePermiso } from "../utils/permisos";

import {
  FaHome, FaStore, FaChartBar, FaHeadset, FaBell, FaDollarSign,
  FaShoppingCart, FaUsers, FaCog,FaUserLock, FaBoxes 
} from "react-icons/fa";
import CerrarSesion from "../CerrarSesion";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dashboard", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Accept": "application/json"
        }
      });
      if (!res.ok) throw new Error("Error en la respuesta");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(value || 0);
  };

  const getComparacion = (valor) => {
    const esPositivo = valor >= 0;
    return (
      <span className={esPositivo ? "positive" : "negative"}>
        {esPositivo ? "↑" : "↓"} {Math.abs(valor)}% respecto al mes anterior
      </span>
    );
  };

  const chartData = {
    series: [{ name: "Ingresos", data: data?.grafica?.map(i => parseFloat(i.total).toFixed(2)) || [] }],
    options: {
      chart: { type: "area", toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#0d2b5c"],
      fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
      xaxis: {
        categories: data?.grafica?.map(i => {
          const d = new Date(i.fecha + "T00:00:00");
          return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
        }) || [],
        labels: { style: { fontSize: '11px', colors: '#7a8ca5' }, hideOverlappingLabels: true },
        axisBorder: { show: false }
      },
      yaxis: { labels: { formatter: (val) => `$${Intl.NumberFormat('en-US').format(val)}`, style: { colors: '#7a8ca5' } } },
      tooltip: { y: { formatter: (val) => formatMoney(val) } }
    },
  };

  console.log("Permisos:", JSON.parse(localStorage.getItem("permisos")));
console.log("¿Tiene permiso reportes_ver?", tienePermiso("reportes_ver"));

  if (loading) {
    return (
      <div className="admin-layout loader-container">
        <h2 style={{color: '#0d2b5c'}}>Cargando Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo-container">
            <img src="/impulsaPay.jpg" alt="ImpulsaPay Logo" className="admin-logo" />
          </div>
          <ul className="sidebar-menu">
            <li className="active" onClick={() => navigate("/admin/dashboard")}><FaHome /> Dashboard</li>
            <li onClick={() => navigate("/admin/negocios")}><FaStore /> Gestión Negocios</li>
              <li onClick={()=>navigate("/admin/inventario")}><FaBoxes />Inventario</li>
            <li onClick={() => navigate("/admin/reportes")}><FaChartBar /> Reportes globales</li>
            <li onClick={() => navigate("/admin/soporte")}><FaHeadset /> Soporte</li>
           <li onClick={() => navigate("/admin/permisos")}><FaUserLock /> Roles y permisos</li> 
          </ul>
        </div>
        <div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/configuracion")}><FaCog /> Configuración</li>
          </ul>
          <CerrarSesion />
        </div>
      </aside>

      <div className="admin-main">
        {/* HEADER ADAPTADO EXACTAMENTE A LA SEGUNDA IMAGEN */}
        <header className="modern-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Dashboard Administrador</h1>
              <p>Administra tus ventas y productos fácilmente</p>
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


        <main className="admin-dashboard">
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Ventas de {data?.mesNombre}</h4>
              <p>{data?.transaccionesMes || 0} {getComparacion(data?.crecimiento)}</p>
            </div>
            <div className="stat-card">
              <h4>Transacciones totales</h4>
              <p>{data?.transacciones || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Ingresos de {data?.mesNombre}</h4>
              <p>{formatMoney(data?.ingresosMes)} {getComparacion(data?.crecimiento)}</p>
            </div>
            <div className="stat-card">
              <h4>Total acumulado</h4>
              <p>{formatMoney(data?.ingresosTotales)}</p>
            </div>
            <div className="stat-card">
              <h4>Tickets emitidos</h4>
              <p>{data?.ticketsTotales || 0}</p>
            </div>
          </div>

          <div className="middle-section">
            <div className="chart-box">
              <h3>Ingresos de los últimos días con actividad</h3>
              <Chart options={chartData.options} series={chartData.series} type="area" height={280} />
            </div>

            <div className="recent-business">
              <h3>Negocios recientes</h3>
              <ul>
                {data?.negociosRecientes?.map((n) => (
                  <li key={n.id} className="business-item-row">
                    <div className="b-info"><strong>{n.nombre}</strong></div>
                    <span className="b-date">{new Date(n.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bottom-section">
            <div className="action-card centered-card">
              <h3>Gestión de Negocios</h3>
              <div className="actions">
                <button className="btn-primary" onClick={() => navigate("/admin/negocios")}>Ver negocios</button>
                <button className="btn-dark">Agregar negocio</button>
              </div>
            </div>
            <div className="action-card centered-card">
              <h3>Centro de soporte</h3>
              <div className="actions">
                <button className="btn-primary" onClick={() => navigate("/admin/soporte")}>Ver consultas</button>
                <button className="btn-dark">Nuevo ticket</button>
              </div>
            </div>
          </div>

          <div className="reports">
            <div className="report-item"><FaUsers /> {data?.negocios || 0} Negocios registrados</div>
            <div className="report-item"><FaShoppingCart /> {data?.transacciones || 0} Transacciones totales</div>
            <div className="report-item"><FaDollarSign /> {formatMoney(data?.ingresosTotales)} Ingresos totales</div>
          </div>
        </main>
      </div>
    </div>
  );
}