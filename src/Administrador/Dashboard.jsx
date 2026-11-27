import "./DashboardAdmin.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { tienePermiso } from "../utils/permisos";
import AdminNotifications from "./AdminNotifications";

import {
  FaHome, FaStore, FaChartBar, FaHeadset, FaDollarSign,
  FaShoppingCart, FaUsers, FaCog, FaUserLock, FaBoxes
} from "react-icons/fa";
import CerrarSesion from "../CerrarSesion";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // REFERENCIA PARA EL DASHBOARD DE SUPERSET
  const supersetRef = useRef(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard`, {
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

  // INTEGRACIÓN DEL DASHBOARD DE SUPERSET
  useEffect(() => {
    if (loading || !supersetRef.current) return;

    let activo = true;

    const cargarSuperset = async () => {
      try {
        await embedDashboard({
          id: "50cd0105-20c3-4860-854b-d8f00c437fa1",

          supersetDomain: "http://localhost:8088",

          mountPoint: supersetRef.current,

          fetchGuestToken: async () => {
            const response = await fetch(
              `${API_URL}/superset/guest-token`,
              {
                method: "GET",
                headers: {
                  "Authorization": "Bearer " + localStorage.getItem("token"),
                  "Accept": "application/json"
                }
              }
            );

            if (!response.ok) {
              throw new Error("Error al obtener Guest Token");
            }

            const result = await response.json();
            return result.token;
          },

          dashboardUiConfig: {
            hideTitle: true,
            filters: {
              expanded: false
            }
          }
        });

      } catch (error) {
        if (activo) {
          console.error("Error al cargar Superset:", error);
        }
      }
    };

    cargarSuperset();

    return () => {
      activo = false;

      if (supersetRef.current) {
        supersetRef.current.innerHTML = "";
      }
    };

  }, [loading]);

  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
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
    series: [{
      name: "Ingresos",
      data: data?.grafica?.map(i => parseFloat(i.total).toFixed(2)) || []
    }],

    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },

      dataLabels: { enabled: false },

      stroke: {
        curve: "smooth",
        width: 3
      },

      colors: ["#0d2b5c"],

      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05
        }
      },

      xaxis: {
        categories: data?.grafica?.map(i => {
          const d = new Date(i.fecha + "T00:00:00");

          return d.toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short'
          });
        }) || [],

        labels: {
          style: {
            fontSize: '11px',
            colors: '#7a8ca5'
          },
          hideOverlappingLabels: true
        },

        axisBorder: { show: false }
      },

      yaxis: {
        labels: {
          formatter: (val) =>
            `$${Intl.NumberFormat('en-US').format(val)}`,

          style: {
            colors: '#7a8ca5'
          }
        }
      },

      tooltip: {
        y: {
          formatter: (val) => formatMoney(val)
        }
      }
    }
  };

  console.log(
    "Permisos:",
    JSON.parse(localStorage.getItem("permisos"))
  );

  console.log(
    "¿Tiene permiso reportes_ver?",
    tienePermiso("reportes_ver")
  );

  if (loading) {
    return (
      <div className="admin-layout loader-container">
        <h2 style={{ color: '#0d2b5c' }}>
          Cargando Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo-container">
            <img
              src="/impulsaPay.jpg"
              alt="ImpulsaPay Logo"
              className="admin-logo"
            />
          </div>

          <ul className="sidebar-menu">
            <li
              className="active"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaHome /> Dashboard
            </li>

            <li onClick={() => navigate("/admin/negocios")}>
              <FaStore /> Gestión Negocios
            </li>

            <li onClick={() => navigate("/admin/inventario")}>
              <FaBoxes /> Inventario
            </li>

            <li onClick={() => navigate("/admin/reportes")}>
              <FaChartBar /> Reportes globales
            </li>

            <li onClick={() => navigate("/admin/soporte")}>
              <FaHeadset /> Soporte
            </li>

            <li onClick={() => navigate("/admin/permisos")}>
              <FaUserLock /> Roles y permisos
            </li>
          </ul>
        </div>

        <div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/configuracion")}>
              <FaCog /> Configuración
            </li>
          </ul>

          <CerrarSesion />
        </div>
      </aside>

      <div className="admin-main">

        {/* HEADER ORIGINAL */}
        <header className="modern-header">
          <div className="header-content">

            <div className="header-left">
              <h1>Dashboard Administrador</h1>
              <p>Administra tus ventas y productos fácilmente</p>
            </div>

            <div className="header-right">

              <div className="profile-info">
                <span className="profile-name">
                  {data?.usuario_nombre || "José Aguilar"}
                </span>

                <span className="profile-email">
                  {data?.usuario_email || "joseagui@gmail.com"}
                </span>
              </div>

              <div className="avatar-container">
                {data?.usuario_avatar ? (
                  <img
                    src={data.usuario_avatar}
                    alt="Avatar"
                    className="profile-avatar-img"
                  />
                ) : (
                  <div className="profile-avatar-fallback">
                    {data?.usuario_nombre?.charAt(0) || "J"}
                  </div>
                )}

                <span className="status-indicator"></span>
              </div>

              <AdminNotifications />

            </div>
          </div>
        </header>

        <main className="admin-dashboard">

          {/* ================================== */}
          {/* DASHBOARD NUEVO DE APACHE SUPERSET */}
          {/* ================================== */}

          <div className="superset-section">

            <div
              ref={supersetRef}
              id="superset-container"
            >
              <p>Cargando reportes de ImpulsaPay...</p>
            </div>

          </div>

          {/* ================================== */}
          {/* DASHBOARD ORIGINAL DE IMPULSAPAY */}
          {/* ================================== */}

          <div className="stats-grid">

            <div className="stat-card">
              <h4>Ventas de {data?.mesNombre}</h4>

              <p>
                {data?.transaccionesMes || 0}{" "}
                {getComparacion(data?.crecimiento)}
              </p>
            </div>

            <div className="stat-card">
              <h4>Transacciones totales</h4>
              <p>{data?.transacciones || 0}</p>
            </div>

            <div className="stat-card">
              <h4>Ingresos de {data?.mesNombre}</h4>

              <p>
                {formatMoney(data?.ingresosMes)}{" "}
                {getComparacion(data?.crecimiento)}
              </p>
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

              <Chart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={280}
              />
            </div>

            <div className="recent-business">
              <h3>Negocios recientes</h3>

              <ul>
                {data?.negociosRecientes?.map((n) => (
                  <li
                    key={n.id}
                    className="business-item-row"
                  >
                    <div className="b-info">
                      <strong>{n.nombre}</strong>
                    </div>

                    <span className="b-date">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="bottom-section">

            <div className="action-card centered-card">
              <h3>Gestión de Negocios</h3>

              <div className="actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/admin/negocios")}
                >
                  Ver negocios
                </button>

                <button className="btn-dark">
                  Agregar negocio
                </button>
              </div>
            </div>

            <div className="action-card centered-card">
              <h3>Centro de soporte</h3>

              <div className="actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/admin/soporte")}
                >
                  Ver consultas
                </button>

                <button className="btn-dark">
                  Nuevo ticket
                </button>
              </div>
            </div>

          </div>

          <div className="reports">

            <div className="report-item">
              <FaUsers /> {data?.negocios || 0} Negocios registrados
            </div>

            <div className="report-item">
              <FaShoppingCart /> {data?.transacciones || 0} Transacciones totales
            </div>

            <div className="report-item">
              <FaDollarSign /> {formatMoney(data?.ingresosTotales)} Ingresos totales
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
