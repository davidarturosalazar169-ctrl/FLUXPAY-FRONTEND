import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./register.css";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente"); // 🔥 por defecto

  const handleRegister = async (e) => {
    e.preventDefault();
  const API_URL = import.meta.env.VITE_API_URL;

    try {
  const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          rol
        })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Cuenta creada",
          text: "Tu cuenta fue registrada correctamente.",
          confirmButtonColor: "#0d2b5c"
        });

        navigate("/");
      } else {
        Swal.fire("Error", data.message || "No se pudo registrar", "error");
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
          <select onChange={(e) => setRol(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="negocio">Negocio</option>
          </select>

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