import "./Soporte.css";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaHome,
  FaStore,
  FaChartBar,
  FaHeadset,
  FaCog,
  FaBell,
  FaUserLock,
  FaBoxes,
} from "react-icons/fa";
import CerrarSesion from "../CerrarSesion";

export default function Soporte() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const ticketsPorPagina = 5;
  const [tickets, setTickets] = useState([]);
  const [data, setData] = useState(null); // Estado unificado para la información del usuario conectado

  const cargarTickets = () => {
    fetch("http://127.0.0.1:8000/api/tickets", {
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        const formateados = data.map(t => ({
          id: t.id,
          cliente: t.cliente,
          negocio: t.negocio?.nombre || "Sin negocio",
          estado: t.estado,
          prioridad: t.prioridad,
          tiempo: "Reciente",
          mensaje: t.mensaje
        }));
        setTickets(formateados);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) throw new Error("Error al actualizar");
      Swal.fire("Actualizado", "Estado cambiado correctamente", "success");
      setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const cambiarPrioridad = async (id, nuevaPrioridad) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tickets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          estado: tickets.find(t => t.id === id).estado,
          prioridad: nuevaPrioridad
        })
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setTickets(prev => prev.map(t => t.id === id ? { ...t, prioridad: nuevaPrioridad } : t));
      Swal.fire("Listo", "Prioridad actualizada", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((t) => {
      const coincideBusqueda = t.negocio.toLowerCase().includes(busqueda.toLowerCase()) ||
                               t.cliente.toLowerCase().includes(busqueda.toLowerCase());
      const coincideFiltro = filtro === "Todos" || t.estado === filtro || (filtro === "Importante" && t.prioridad === "Alta");
      return coincideBusqueda && coincideFiltro;
    });
  }, [tickets, busqueda, filtro]);

  const indiceUltimo = paginaActual * ticketsPorPagina;
  const indicePrimero = indiceUltimo - ticketsPorPagina;
  const ticketsActuales = ticketsFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(ticketsFiltrados.length / ticketsPorPagina);

  const verTicket = (ticket) => {
    Swal.fire({
      title: `Ticket #${ticket.id}`,
      html: `<b>Cliente:</b> ${ticket.cliente}<br><b>Negocio:</b> ${ticket.negocio}<br><br><b>Problema:</b><br>${ticket.mensaje}`,
      icon: "info",
      confirmButtonText: "Cerrar"
    });
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo-container">
            <img src="/impulsaPay.jpg" alt="ImpulsaPay Logo" className="admin-logo" />
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/dashboard")}><FaHome /> Dashboard</li>
            <li onClick={() => navigate("/admin/negocios")}><FaStore /> Gestión Negocios</li>
            <li onClick={() => navigate("/admin/inventario")}><FaBoxes /> Inventario</li>
            <li onClick={() => navigate("/admin/reportes")}><FaChartBar /> Reportes globales</li>
            <li className="active"><FaHeadset /> Soporte</li>
            <li onClick={() => navigate("/admin/permisos")}><FaUserLock /> Roles y permisos</li> 
          </ul>
        </div>
        <div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/configuracion")}><FaCog /> Configuración</li>
          </ul>
          <CerrarSesion/>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="admin-main">
        
        {/* HEADER UNIFICADO (Idéntica estructura y tipografía a juego) */}
        <header className="modern-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Centro soporte</h1>
              <p>Gestión dinámica de tickets</p>
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

        {/* TU CONTENIDO ORIGINAL RESPETADO AL 100% */}
        <main className="admin-dashboard">
          <div className="soporte-stats">
            <div>Total consultas: {tickets.length}</div>
            <div>Pendientes: {tickets.filter(t => t.estado === "Pendiente").length}</div>
            <div>En curso: {tickets.filter(t => t.estado === "En curso").length}</div>
            <div>Resueltas: {tickets.filter(t => t.estado === "Resuelto").length}</div>
          </div>

          <div className="soporte-filtros">
            <input
              placeholder="Buscar negocio o cliente"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {["Todos", "Pendiente", "En curso", "Resuelto", "Importante"].map((tipo) => (
              <button
                key={tipo}
                className={`btn ${filtro === tipo ? "active" : ""}`}
                onClick={() => { setFiltro(tipo); setPaginaActual(1); }}
              >
                {tipo}
              </button>
            ))}
          </div>

          <div className="tickets-table">
            <div className="table-header">
              <div>Cliente</div>
              <div>Estado</div>
              <div>Prioridad</div>
              <div>Última Actualización</div>
              <div>Acciones</div>
            </div>

            {ticketsActuales.map((t) => (
              <div key={t.id} className="table-row">
                <div>
                  <strong>{t.cliente}</strong><br />
                  <small>{t.negocio}</small>
                </div>
                <div>
                  <span className={`badge ${t.estado.toLowerCase().replace(" ","-")}`}>
                    {t.estado}
                  </span>
                </div>
                <div>
                  <span className={`badge prioridad ${t.prioridad.toLowerCase()}`}>
                    {t.prioridad}
                  </span>
                </div>
                <div>{t.tiempo}</div>
                <div className="acciones">
                  <button className="btn-ver" onClick={() => verTicket(t)}>Ver</button>
                  <button className="btn-accion estado" onClick={() => cambiarEstado(t.id, "En curso")}>En curso</button>
                  <button className="btn-accion resolver" onClick={() => cambiarEstado(t.id, "Resuelto")}>Resolver</button>
                  <button className="btn-accion prioridad" onClick={() => cambiarPrioridad(t.id, "Alta")}>Alta</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className="page-btn" onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>{"<"}</button>
            {[...Array(totalPaginas)].map((_, i) => (
              <button key={i} className={`page-btn ${paginaActual === i + 1 ? "active" : ""}`} onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
            ))}
            <button className="page-btn" onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>{">"}</button>
          </div>
        </main>
      </div>
    </div>
  );
}