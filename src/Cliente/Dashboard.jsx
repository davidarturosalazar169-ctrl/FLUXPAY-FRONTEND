import "../styles.css";
import Navbar from "../Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Administrador/DashboardAdmin.css";
import "./Cliente.css";
import "./clientedashboard.css";
import { useNavigate } from "react-router-dom";
import "../Styles/StyleNavbar.css";
import {
  FaHome,
  FaSignOutAlt,
  FaHistory,
  FaCog, 
} from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import CerrarSesion from "../CerrarSesion";
import ImpulsaPlayCliente from "./ImpulsaPlayCliente.jpeg";
import { useState, useEffect } from "react";
import Axios from "axios";


export default function DashboardCliente() {
  const navigate = useNavigate();
const token = localStorage.getItem("token");

const [user, setUser] = useState({
  nombre: "",
  correo: ""
});

useEffect(() => {
  Axios.get("https://fluxpay-2-cpye.onrender.com/api/cliente/configuracion", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      setUser({
        nombre: res.data.nombre,
        correo: res.data.correo
      });
    })
    .catch((err) => console.log(err));
}, []);

  return (
    <div className="admin-layout">
      
      {/* Sidebar */}
<aside className="admin-sidebar">
  <div>
    <div className="admin-logo-container">
<img src={ImpulsaPlayCliente} alt="Impulsa Play" className="admin-logo" />
    </div>

    <ul className="sidebar-menu">
      
      <li 
        className="active"
        onClick={() => navigate("/dashboard")} 
        style={{ cursor: "pointer" }}
      >
        <FaHome /> Dashboard
      </li>

      <li 
        onClick={() => navigate("/Cliente/clienteTarjetas")} 
        style={{ cursor: "pointer" }}
      >
        <CiCreditCard1 /> Mis Tarjetas
      </li>

      <li 
        onClick={() => navigate("/Cliente/HistorialCliente")} 
        style={{ cursor: "pointer" }}
      >
        <FaHistory /> Historial
      </li>

      <li 
        onClick={() => navigate("/Cliente/ClienteConfiguracion")} 
        style={{ cursor: "pointer" }}
      >
        <FaCog /> Configuración
      </li>

    </ul>
  </div>

<CerrarSesion/>

</aside>
      
      {/* Contenido principal */}
      <div className="admin-main">
<div className="container-fluid px-4 pt-4">
  <div className="bg-white shadow rounded-4 p-3">
<Navbar
  nombre={user.nombre}
  correo={user.correo}
  rol="Cliente"
/>
  </div>
</div>
{/* Contenido moderno */}
<div className="container-fluid dashboard-wrapper">

  <div className="row g-4 mt-3">

    {/* Mis Tarjetas */}
    <div className="col-12 col-md-6 col-lg-4">
      <div 
        className="modern-card"
        onClick={() => navigate("/Cliente/clienteTarjetas")}
      >
        <div className="icon-circle blue">
          <CiCreditCard1 size={28} />
        </div>

        <div className="card-content">
          <h5>Mis Tarjetas</h5>
          <p>Administra tus métodos de pago fácilmente</p>
        </div>
      </div>
    </div>

    {/* Historial */}
    <div className="col-12 col-md-6 col-lg-4">
      <div 
        className="modern-card"
        onClick={() => navigate("/Cliente/HistorialCliente")}
      >
        <div className="icon-circle purple">
          <FaHistory size={26} />
        </div>

        <div className="card-content">
          <h5>Historial de Pagos</h5>
          <p>Consulta todas tus transacciones realizadas</p>
        </div>
      </div>
    </div>

  </div>

</div>

      </div>
    </div>
  );
}