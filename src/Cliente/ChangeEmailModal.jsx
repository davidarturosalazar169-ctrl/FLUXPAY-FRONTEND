import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";

const ChangeEmailModal = ({ show, handleClose, currentPassword, onSave }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = () => {

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos",
        confirmButtonText: "Aceptar"
      });
      return;
    }

const token = localStorage.getItem("token");

Axios.put(`${API_URL}/cliente/actualizar`, {
  current_password: password,
  correo: email
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
    .then(() => {
      onSave(email);
      handleClose();

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "El correo se actualizó correctamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#0d3b66"
      });
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: err.response?.data?.error || "Error",
        confirmButtonText: "Aceptar"
      });
    });
  };
  
  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Cambiar correo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Nuevo correo</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Contraseña actual</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end gap-3">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="primary" onClick={handleSubmit}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeEmailModal;