import "../styles.css";
import Navbar from "../Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import TarjetasCliente from "./TarjetasCliente";
import { Button, Card, Row, Col } from "react-bootstrap";
import PaymentForm from "./PaymentForm";
import DataGrid from "../DataGrid";
import {FaHome,FaSignOutAlt,FaHistory,FaCog,} 
from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import CerrarSesion from "../CerrarSesion";
import ImpulsaPlayCliente from "./ImpulsaPlayCliente.jpeg";

const HistorialCliente = () => {
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    nombre: "",
    correo: "",
  });

  useEffect(() => {
    console.log("TOKEN:", token);

    Axios.get("http://localhost/api/historial", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err.response?.data || err);
      });
  }, [token]);

  useEffect(() => {
    Axios.get("http://127.0.0.1:8000/api/cliente/configuracion", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUser({
          nombre: res.data.nombre,
          correo: res.data.correo,
        });
      })
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div className="page">
      {/* Sidebar */}

      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo-container">
            <img
              src={ImpulsaPlayCliente}
              alt="Impulsa Play"
              className="admin-logo"
            />
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

        <CerrarSesion />
      </aside>

      {/* Contenido principal */}
      <div className="main-content">
        <div className="container-fluid px-4 pt-4">
          <div className="bg-white shadow rounded-4 p-3">
            <Navbar
              nombre={user.nombre}
              correo={user.correo}
              rol="Cliente"
            />
          </div>
        </div>

        <div
          style={{
            width: "400px",
            margin: "60px auto 0 auto",
            textAlign: "center",
          }}
        >
          <h1>Historial de compras</h1>
        </div>

        <div>
          {/* Tabla de contenido */}
          <div className="container d-flex justify-content-center mt-4">
            <div style={{ width: "85%", maxWidth: "1100px" }}>
              <DataGrid
                columns={["Fecha", "Concepto", "Monto", "Estado"]}
                data={data}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialCliente;