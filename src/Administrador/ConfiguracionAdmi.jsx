import "./ConfiguracionAdmi.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

export default function ConfiguracionAdmi() {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    telefono: "",
    password: "",
    foto: "https://i.pravatar.cc/100?u=alex"
  });

  const [editMode, setEditMode] = useState({
    nombre: false,
    correo: false,
    telefono: false,
    password: false
  });

  // CARGAR DATOS DESDE LARAVEL (CON TOKEN)
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token → fuera
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Sesión requerida",
        text: "Debes iniciar sesión"
      });
      navigate("/");
      return;
    }

    fetch("http://127.0.0.1:8000/api/admin", {
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("No autenticado");
        }
        return res.json();
      })
      .then(data => {
        // Si viene error del backend
        if (data.message) {
          throw new Error(data.message);
        }

        setAdminData({
          name: data.name || "",
          email: data.email || "",
          telefono: data.telefono || "",
          password: "",
          foto: "https://i.pravatar.cc/100?u=" + data.email
        });
      })
      .catch(err => {
        console.error(err);

        Swal.fire({
          icon: "error",
          title: "Sesión expirada",
          text: "Vuelve a iniciar sesión"
        });

        localStorage.removeItem("token");
        navigate("/");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value
    });
  };

  // GUARDAR EN BD (CON TOKEN)
  const toggleEdit = async (campo) => {
    if (editMode[campo]) {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/admin", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Accept": "application/json"
          },
          body: JSON.stringify(adminData)
        });

        if (!res.ok) {
          throw new Error("Error al guardar");
        }

        Swal.fire({
          icon: "success",
          title: "Datos actualizados",
          text: "Se guardaron en la base de datos.",
          confirmButtonColor: "#0d2b5c"
        });

      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar.",
        });
      }
    }

    setEditMode({
      ...editMode,
      [campo]: !editMode[campo]
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdminData({
          ...adminData,
          foto: reader.result
        });

        Swal.fire({
          icon: "success",
          title: "Foto actualizada",
          text: "La foto de perfil se cambió correctamente.",
          confirmButtonColor: "#0d2b5c"
        });
      };
      reader.readAsDataURL(file);
    }
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
            <li onClick={() => navigate("/admin/dashboard")}>
              <FaHome /> Dashboard
            </li>
            <li onClick={() => navigate("/admin/negocios")}>
              <FaStore /> Gestión Negocios
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
            <li className="active">
              <FaCog /> Configuración
            </li>
          </ul>
          <div>
            <CerrarSesion />
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="admin-main">
        
        {/* HEADER UNIFICADO (Idéntico diseño, tipografía y variables) */}
        <header className="modern-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Configuración</h1>
              <p>Administración de tu cuenta</p>
            </div>

            <div className="header-right">
              <div className="profile-info">
                <span className="profile-name">{adminData.name || "José Aguilar"}</span>
                <span className="profile-email">{adminData.email || "joseagui@gmail.com"}</span>
              </div>

              <div className="avatar-container">
                {adminData.foto ? (
                  <img src={adminData.foto} alt="Avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-fallback">
                    {(adminData.name || "J").charAt(0)}
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

        {/* FORMULARIO DE CONFIGURACIÓN */}
        <main className="admin-dashboard">
          <div className="config-card">
            <h2>Datos del administrador</h2>

            <div className="config-grid">
              {/* NOMBRE */}
              <div className="config-field">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={adminData.name}
                  disabled={!editMode.nombre}
                  onChange={handleChange}
                />
                <button
                  className="btn-primary"
                  onClick={() => toggleEdit("nombre")}
                >
                  {editMode.nombre ? "Guardar" : "Editar nombre"}
                </button>
              </div>

              {/* CORREO */}
              <div className="config-field">
                <label>Correo</label>
                <input
                  type="text"
                  name="email"
                  value={adminData.email}
                  disabled={!editMode.correo}
                  onChange={handleChange}
                />
                <button
                  className="btn-primary"
                  onClick={() => toggleEdit("correo")}
                >
                  {editMode.correo ? "Guardar" : "Editar correo"}
                </button>
              </div>

              {/* TELEFONO */}
              <div className="config-field">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={adminData.telefono}
                  disabled={!editMode.telefono}
                  onChange={handleChange}
                />
                <button
                  className="btn-primary"
                  onClick={() => toggleEdit("telefono")}
                >
                  {editMode.telefono ? "Guardar" : "Editar teléfono"}
                </button>
              </div>

              {/* PASSWORD */}
              <div className="config-field">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={adminData.password}
                  disabled={!editMode.password}
                  onChange={handleChange}
                />
                <button
                  className="btn-danger"
                  onClick={() => toggleEdit("password")}
                >
                  {editMode.password ? "Guardar contraseña" : "Cambiar contraseña"}
                </button>
              </div>

              {/* FOTO */}
              <div className="config-field photo-field">
                <label>Foto de perfil</label>
                <div className="photo-box">
                  <img src={adminData.foto} alt="perfil"/>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}