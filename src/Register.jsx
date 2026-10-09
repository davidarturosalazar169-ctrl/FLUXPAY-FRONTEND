import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./register.css";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [negocio, setNegocio] = useState({
    nombre: "",
    telefono: "",
    descripcion: "",
    rfc: "",
    codigo_postal: ""
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const payload = { name, email, password, rol };
      if (rol === "negocio") {
        payload.negocio = {
          ...negocio,
          nombre: negocio.nombre.trim()
        };
      }

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Cuenta creada",
          text: rol === "negocio"
            ? "Tu cuenta y tu negocio fueron registrados correctamente."
            : "Tu cuenta fue registrada correctamente.",
          confirmButtonColor: "#0d2b5c"
        });

        navigate("/");
      } else {
        const validationError = data.errors
          ? Object.values(data.errors).flat()[0]
          : null;
        Swal.fire(
          "Error",
          validationError || data.message || "No se pudo registrar",
          "error"
        );
      }

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al conectar con el servidor", "error");
    }
  };

  return (
    <div className="register-page">

      {/* IZQUIERDA */}
      <div className="register-left">
        <img src="/impulsaPay.jpg" alt="ImpulsaPay Logo" className="hero-logo" />

        <h1>
          Impulsa tu negocio con <span>ImpulsaPay</span>
        </h1>

        <p>
          Acepta pagos digitales, genera códigos QR y administra tus 
          ingresos desde una sola plataforma segura y moderna.
        </p>
      </div>

      {/* FORM */}
      <form className="register-card" onSubmit={handleRegister}>
        <h2>Crear Cuenta</h2>

        <div className="register-grid">

          <input 
            type="email" 
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <input 
            type="text" 
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />

          <input 
            type="password" 
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          {/* 🔥 SELECT DE ROL */}
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="cliente">Cliente</option>
            <option value="negocio">Negocio</option>
          </select>

          {rol === "negocio" && (
            <>
              <input
                type="text"
                placeholder="Nombre del negocio"
                value={negocio.nombre}
                onChange={(e) => setNegocio({ ...negocio, nombre: e.target.value })}
                maxLength={150}
                required
              />

              <input
                type="tel"
                placeholder="Teléfono del negocio (opcional)"
                value={negocio.telefono}
                onChange={(e) => setNegocio({ ...negocio, telefono: e.target.value })}
                maxLength={25}
              />

              <textarea
                placeholder="Descripción del negocio (opcional)"
                value={negocio.descripcion}
                onChange={(e) => setNegocio({ ...negocio, descripcion: e.target.value })}
                maxLength={1000}
                rows={3}
              />

              <input
                type="text"
                placeholder="RFC (opcional)"
                value={negocio.rfc}
                onChange={(e) => setNegocio({ ...negocio, rfc: e.target.value.toUpperCase() })}
                maxLength={20}
              />

              <input
                type="text"
                inputMode="numeric"
                placeholder="Código postal (opcional)"
                value={negocio.codigo_postal}
                onChange={(e) => setNegocio({ ...negocio, codigo_postal: e.target.value })}
                maxLength={10}
              />
            </>
          )}

        </div>

        <button type="submit" className="btn-primary">
          Registrarme
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/")}
        >
          Volver al Login
        </button>
      </form>
    </div>
  );
}