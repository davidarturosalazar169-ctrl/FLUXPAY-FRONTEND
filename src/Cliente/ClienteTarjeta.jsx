import "../styles.css";
import Navbar from "../Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import TarjetasCliente from "./TarjetasCliente";
import { Button, Card, Row, Col } from "react-bootstrap";
import PaymentForm from "./PaymentForm";
import "../Administrador/DashboardAdmin.css";
import axios from "axios";
import { useEffect } from "react";
import { FaHome,FaSignOutAlt,FaHistory,FaCog, } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import CerrarSesion from "../CerrarSesion";
import ImpulsaPlayCliente from "./ImpulsaPlayCliente.jpeg";


function ClienteTarjeta() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState({
    nombre: "",
    correo: ""
  });

  useEffect(() => {
    axios.get(`${API_URL}/cliente/configuracion`, {
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
  }, [token]);

  const [mostrar, setMostrar] = useState(false);
  const [tarjetas, setTarjetas] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("token");

  axios.get(`${API_URL}/tarjetas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => setTarjetas(res.data))
    .catch(err => console.error(err));
}, []);

  const handleMostrar = () => setMostrar(true);
  const handleCerrar = () => setMostrar(false);

const handlesave = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(`${API_URL}/tarjetas`, {
      brand: data.brand,
      last4: data.last4,
      exp_month: data.exp_month,
      exp_year: data.exp_year,
      name: data.name
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setTarjetas((prev) => [res.data.data, ...prev]);
    setMostrar(false);

  } catch (error) {
    console.error(error);
    alert("Error al guardar tarjeta");
  }
};
const borrarTarjeta = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API_URL}/tarjetas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setTarjetas((prev) => prev.filter((t) => t.id !== id));

  } catch (error) {
    console.error(error);
    alert("Error al eliminar tarjeta");
  }
};
  return (
    <div className="page">
      
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
<div className="text-center mt-4 mt-md-5">
  <h1 className="h3 h-md-2">Mis tarjetas</h1>
</div>
        <div className="container mt-4">
          <Row className="g-4">
            {tarjetas.length > 0 ? (
              tarjetas.map((tarjeta, index) => (
                <Col key={index} md={6} lg={4}>
                  <Card className="shadow-sm h-100">
                    <Card.Body>
<TarjetasCliente
  number={tarjeta.last4}   //  SOLO LOS 4
  brand={tarjeta.brand} 
  expiry={`${tarjeta.exp_month}/${String(tarjeta.exp_year).slice(-2)}`}
  name={tarjeta.name}
/>
<Button
  variant="danger"
  className="mt-3 w-100"
  onClick={() => borrarTarjeta(tarjeta.id)}
>
  Borrar Tarjeta
</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <Card.Title>No hay tarjetas registradas</Card.Title>
                    <Card.Text>
                      Agrega una nueva tarjeta para comenzar a realizar pagos.
                    </Card.Text>
                    <Button variant="warning" onClick={handleMostrar}>
                      Agregar Tarjeta
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          {tarjetas.length > 0 && (
            <div className="text-center mt-4">
              <Button variant="warning" onClick={handleMostrar}>
                Agregar Nueva Tarjeta
              </Button>
            </div>
          )}
        </div>

        <PaymentForm
          show={mostrar}
          handleCerrar={handleCerrar}
          handlesave={handlesave}
        />
      </div>
    </div>
  );
}

export default ClienteTarjeta;