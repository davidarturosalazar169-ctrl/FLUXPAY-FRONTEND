import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaHome,
  FaStore,
  FaChartBar,
  FaHeadset,
  FaBell,
  FaCheckCircle,
  FaCog,
  FaUserLock,
  FaBoxes ,
} from "react-icons/fa";
import "./GestionNegocios.css";
import CerrarSesion from "../CerrarSesion";

export default function GestionNegocios() {
  const navigate = useNavigate();

  // Estados
  const [negociosData, setNegociosData] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", descripcion: "", telefono: "" });
  const [data, setData] = useState(null); // Almacena info del usuario conectado

  const negociosPorPagina = 5;

  // Token de usuario
  const token = localStorage.getItem("token");

  // Obtener datos de la API
  const obtenerNegocios = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/negocios", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      const formateados = data.map((n) => ({
        id: n.id,
        nombre: n.nombre,
        descripcion: n.descripcion || "Sin información",
        telefono: n.telefono || "N/A",
        estado: n.status === 1 ? "activo" : n.status === 0 ? "inactivo" : "verificar",
        ventas: 0,
        ingresos: "$0",
      }));

      setNegociosData(formateados);
    } catch (err) {
      console.error("Error al cargar negocios:", err);
    }
  };

  useEffect(() => {
    obtenerNegocios();
  }, []);

  // Guardar o actualizar negocio
  const guardarNegocio = async () => {
    const url = editando
      ? `http://127.0.0.1:8000/api/negocios/${form.id}`
      : "http://127.0.0.1:8000/api/negocios";
    const method = editando ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          telefono: form.telefono,
          status: 1
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al guardar negocio");
      }

      Swal.fire(
        "Éxito",
        editando ? "Negocio actualizado" : "Negocio creado",
        "success"
      );

      cerrarModal();
      obtenerNegocios();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Eliminar negocio
  const eliminarNegocio = (id) => {
    Swal.fire({
      title: "¿Eliminar negocio?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://127.0.0.1:8000/api/negocios/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });
          Swal.fire("Eliminado", "El negocio ha sido borrado", "success");
          obtenerNegocios();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el negocio", "error");
        }
      }
    });
  };

  // Modales
  const abrirCrear = () => {
    setEditando(false);
    setForm({ id: null, nombre: "", descripcion: "", telefono: "" });
    setMostrarModal(true);
  };

  const abrirEditar = (negocio) => {
    setEditando(true);
    setForm(negocio);
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

  // Filtrar y paginar
  const negociosFiltrados = negociosData.filter(
    (n) =>
      n.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceUltimo = paginaActual * negociosPorPagina;
  const indicePrimero = indiceUltimo - negociosPorPagina;
  const negociosActuales = negociosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(negociosFiltrados.length / negociosPorPagina);

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
            <li className="active"><FaStore /> Gestión Negocios</li>
            <li onClick={()=>navigate("/admin/inventario")}><FaBoxes />Inventario</li>
            <li onClick={() => navigate("/admin/reportes")}><FaChartBar /> Reportes</li>
            <li><FaHeadset /> Soporte</li>
            <li onClick={() => navigate("/admin/permisos")}><FaUserLock /> Roles y permisos</li> 
          </ul>
        </div>
        <div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/configuracion")}><FaCog /> Configuración</li>
          </ul>
          <div> <CerrarSesion/> </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="admin-main">
        
        {/* NUEVO HEADER REPLICADO SINTONIZADO */}
        <header className="modern-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Gestión negocios</h1>
              <p>Administra todos los negocios registrados en la plataforma</p>
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

          <div className="search-container">
        <input
            type="text"
            placeholder="Buscar negocio..."
            value={busqueda}
            onChange={(e)=>{
                setBusqueda(e.target.value);
                setPaginaActual(1);
            }}
        />
    </div>
          
       <div className="action-row-container">
    <button className="btn-primary" onClick={abrirCrear}>
        + Agregar negocio
    </button>
</div>

          {/* TABLA */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Negocio</th>
                  <th>Descripción</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Ventas / Ingresos</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {negociosActuales.length > 0 ? (
                  negociosActuales.map((negocio) => (
                    <tr key={negocio.id}>
                      <td className="font-bold">{negocio.nombre}</td>
                      <td>{negocio.descripcion}</td>
                      <td>{negocio.telefono}</td>
                      <td>
                        <span className={`badge ${negocio.estado}`}>
                          <FaCheckCircle /> {negocio.estado}
                        </span>
                      </td>
                      <td>{negocio.ventas} | {negocio.ingresos}</td>
                      <td className="acciones">
                        <button className="btn-dark small" onClick={() => abrirEditar(negocio)}>Editar</button>
                        <button className="btn-eliminar small" onClick={() => eliminarNegocio(negocio.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No se encontraron negocios.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <div className="pagination">
            <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1}>{"<"}</button>
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                className={paginaActual === i + 1 ? "active" : ""}
                onClick={() => setPaginaActual(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>{">"}</button>
          </div>
        </main>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editando ? "Editar negocio" : "Agregar negocio"}</h2>
            <div className="form-group">
              <label>Nombre del negocio</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Taquería El Chavo" />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Breve descripción..." />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="123 456 7890" />
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={guardarNegocio}>Guardar Cambios</button>
              <button className="btn-dark" onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}