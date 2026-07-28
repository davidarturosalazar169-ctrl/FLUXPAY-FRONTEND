import { Container, Row, Col, Card, Button, Form, Image } from "react-bootstrap";
import {FaCcVisa,FaCcMastercard,FaEnvelope,FaPhoneAlt,FaLock,FaCamera} from "react-icons/fa";
import { SiMercadopago } from "react-icons/si";
import Navbar from "../Navbar";
import ClientDataForm from "./ClientDataForm";
import ChangeEmailModal from "./ChangeEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangePhotoModal from "./ChangePhotoModal";
import { useState, useEffect } from "react";
import "../Administrador/DashboardAdmin.css";
import { useNavigate } from "react-router-dom";
import {FaHome,FaStore,FaChartBar,FaHeadset,FaSignOutAlt,FaSearch,FaBell,FaDollarSign,FaShoppingCart,FaUsers,FaHistory,FaCog, } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import Axios from "axios";
import CerrarSesion from "../CerrarSesion";
import ImpulsaPlayCliente from "./ImpulsaPlayCliente.jpeg";
// Imagen local
import FotoPerfil from "./FotoPerfil.png";

function ClienteConfiguracion() {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nombre: "José Aguilar",
    correo: "joseagui@gmail.com",
    telefono: "+52 893 223 92",
    password: "123456",
    foto: FotoPerfil
  });
  useEffect(() => {
  Axios.get(`${API_URL}/cliente/configuracion`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
    .then((res) => {
      setUser((prev) => ({
        ...prev,
        nombre: res.data.nombre,
        correo: res.data.correo
      }));
    })
    .catch((err) => console.log(err));
}, []);

  const [activeModal, setActiveModal] = useState(null);

  const updateField = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="page d-flex bg-light">

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
      <div className="main-content flex-grow-1 p-4">
<div className="container-fluid px-4 pt-4">
  <div className="bg-white shadow rounded-4 p-3">
    <Navbar
      nombre={user.nombre}
      correo={user.correo}
      rol="Cliente"
    />
  </div>
</div>

        <Container fluid className="mt-4">
   <div style={{ width: "400px", margin: "60px auto 0 auto", textAlign: "center" }}>
        <h1>Mis tarjetas</h1>
    </div>
          <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
            <Row className="g-4">

              {/* Nombre */}
              <Col md={6}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={user.nombre} readOnly />
                <Button
                  size="sm"
                  className="mt-2 rounded-pill"
                  onClick={() => setActiveModal("nombre")}
                >
                  Editar nombre
                </Button>
              </Col>

              {/* Correo */}
              <Col md={6}>
                <Form.Label>
                  <FaEnvelope className="me-2 text-primary" />
                  Correo
                </Form.Label>
                <Form.Control value={user.correo} readOnly />
                <Button
                  size="sm"
                  className="mt-2 rounded-pill"
                  onClick={() => setActiveModal("correo")}
                >
                  Editar correo
                </Button>
              </Col>

              {/* Teléfono */}
              <Col md={6}>
                <Form.Label>
                  <FaPhoneAlt className="me-2 text-primary" />
                  Teléfono
                </Form.Label>
                <Form.Control value={user.telefono} readOnly />
                <Button
                  size="sm"
                  className="mt-2 rounded-pill"
                  onClick={() => setActiveModal("telefono")}
                >
                  Editar teléfono
                </Button>
              </Col>

              {/* Contraseña */}
              <Col md={6}>
                <Form.Label>
                  <FaLock className="me-2 text-danger" />
                  Contraseña
                </Form.Label>
<Form.Control value={"*".repeat(user.password.length)} readOnly />
                <Button
                  size="sm"
                  variant="danger"
                  className="mt-2 rounded-pill"
                  onClick={() => setActiveModal("password")}
                >
                  Cambiar contraseña
                </Button>
              </Col>

              {/* FOTO CORREGIDA */}
              <Col md={6}>
                <Form.Label>
                  <FaCamera className="me-2 text-primary" />
                  Foto de perfil
                </Form.Label>

                <div className="d-flex align-items-center gap-3">
                  <Image
                    src={user.foto}
                    roundedCircle
                    width={80}
                    height={80}
                    style={{ objectFit: "cover" }}
                  />

                  <Button
                    size="sm"
                    className="rounded-pill"
                    onClick={() => setActiveModal("foto")}
                  >
                    Cambiar foto
                  </Button>
                </div>
              </Col>

            </Row>
          </Card>

          {/* Tarjetas */}
          <Card className="border-0 shadow-sm rounded-4 p-4 text-center">
            <h6 className="fw-semibold mb-3">
              Compañías compatibles
            </h6>

            <div className="d-flex justify-content-center gap-5 fs-1 text-secondary">
              <FaCcVisa />
              <FaCcMastercard />
              <SiMercadopago />
            </div>

            <small className="text-muted mt-3 d-block">
              Las tarjetas se gestionan desde la sección "Mis Tarjetas"
            </small>
          </Card>
        </Container>

        {/* MODALES */}

        <ClientDataForm
          show={activeModal === "nombre"}
          handleClose={() => setActiveModal(null)}
          title="Editar nombre"
          label="Nuevo nombre"
          value={user.nombre}
  onSave={(value) => {
    Axios.put(`${API_URL}/cliente/actualizar`, {
      nombre: value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => updateField("nombre", value));
  }}
        />

        <ClientDataForm
          show={activeModal === "telefono"}
          handleClose={() => setActiveModal(null)}
          title="Editar teléfono"
          label="Nuevo teléfono"
          value={user.telefono}
          onSave={(value) => updateField("telefono", value)}
        />

        <ChangeEmailModal
          show={activeModal === "correo"}
          handleClose={() => setActiveModal(null)}
          currentPassword={user.password}
          onSave={(value) => updateField("correo", value)}
        />

        <ChangePasswordModal
          show={activeModal === "password"}
          handleClose={() => setActiveModal(null)}
          currentPassword={user.password}
          onSave={(value) => updateField("password", value)}
        />

        <ChangePhotoModal
          show={activeModal === "foto"}
          handleClose={() => setActiveModal(null)}
          currentPhoto={user.foto}
          onSave={(value) => updateField("foto", value)}
        />

      </div>
    </div>
  );
}

export default ClienteConfiguracion;