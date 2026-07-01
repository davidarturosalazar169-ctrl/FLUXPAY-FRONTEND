import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";

const ChangePasswordModal = ({ show, handleClose, currentPassword, onSave }) => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = () => {

    if (!current || !newPass || !confirm) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    // YA NO VALIDAMOS AQUÍ
    // if (current !== currentPassword) { ... }

    if (newPass !== confirm) {
      Swal.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Verifica la nueva contraseña",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    // VALIDACIÓN REAL EN LARAVEL
const token = localStorage.getItem("token");

Axios.put("http://localhost/api/cliente/actualizar", {
  current_password: current,
  password: newPass
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
    .then(() => {
      onSave(newPass);
      handleClose();

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "La contraseña se actualizó correctamente.",
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
        <Modal.Title className="fw-bold">Cambiar contraseña</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña actual</Form.Label>
          <Form.Control
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nueva contraseña</Form.Label>
          <Form.Control
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Confirmar nueva contraseña</Form.Label>
          <Form.Control
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>

<Modal.Footer className="d-flex justify-content-end align-items-center gap-3">
  <Button variant="outline-secondary" onClick={handleClose}>
    Cancelar
  </Button>

  <Button variant="primary" onClick={handleSubmit}>
    Guardar
  </Button>
</Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;