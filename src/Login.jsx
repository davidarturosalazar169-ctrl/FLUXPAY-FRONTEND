import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("🚀 API utilizada:", API_URL);
    console.log("📡 Endpoint login:", `${API_URL}/login`);

    try {
<<<<<<< HEAD
      const res = await fetch(`${API_URL}/login`, {        
=======
      const res = await fetch(`${API_URL}/login`, {
>>>>>>> equipo-produccion
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      console.log("Respuesta login:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "permisos",
          JSON.stringify(data.user.permisos || [])
        );

        switch (data.user.idrol) {
          case 1:
            navigate("/admin/dashboard");
            break;

          case 8:
            navigate("/negocio");
            break;

          case 9:
            navigate("/dashboard");
            break;

          default:
            navigate("/");
            break;
        }
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">

        <div className="login-left">
          <div className="left-content">
            <h1>
              Bienvenido a <span>ImpulsaPay</span>
            </h1>

            <p>
              Gestiona tus negocios, analiza ingresos y controla
              tus transacciones desde un solo lugar.
            </p>

            <button
              className="btn-register"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </button>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">

            <div className="logo-box">
              <img
                src="/impulsaPay.jpg"
                alt="ImpulsaPay Logo"
                className="login-logo"
              />
            </div>

            <h2>Iniciar sesión</h2>

            <form onSubmit={handleLogin}>

              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn-login"
              >
                Iniciar sesión
              </button>

              <p className="forgot">
                Olvidé mi contraseña
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}