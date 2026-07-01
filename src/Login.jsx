import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();
      

      console.log("Respuesta login:", data); 
      

      if (res.ok) {

          // Guardar token
localStorage.setItem("token", data.token);

// Guardar toda la información del usuario
localStorage.setItem("user", JSON.stringify(data.user));

// Guardar permisos
localStorage.setItem(
  "permisos",
  JSON.stringify(data.user.permisos)
);
        
   
       
        switch (data.user.idrol) {

          case 1:
            navigate("/admin/dashboard");
            break;

          case 8:
            navigate("/negocio"); // 🔥 IMPORTANTE
            break;

          case 9:
            navigate("/dashboard");
            break;

          default:
            navigate("/");
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

        {/* IZQUIERDA */}
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
              Registrate
            </button>
          </div>
        </div>

        {/* DERECHA */}
        <div className="login-right">
          <div className="login-card">

            <div className="logo-box">
              <img
                src="/impulsaPay.jpg"
                alt="impulsaPay Logo"
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

              <button type="submit" className="btn-login">
                Iniciar sesión
              </button>

              <p className="forgot">Olvidé mi contraseña</p>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}