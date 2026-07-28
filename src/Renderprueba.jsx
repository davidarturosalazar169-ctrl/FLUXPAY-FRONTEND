import { useEffect, useState } from "react";

export default function Renderprueba() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkRender = async () => {
    try {
      const res = await fetch("http://localhost/api/render-status");
      const data = await res.json();

      setStatus(data);
    } catch (error) {
      setStatus({
        status: false,
        mensaje: "🔴 Error conectando con Laravel",
        error: error.message
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    checkRender();
  }, []);

  return (
    <div style={{
      padding: 20,
      fontFamily: "Arial",
      textAlign: "center"
    }}>
      <h2>🚀 Estado de conexión a Render</h2>

      {loading && <p>⏳ Verificando conexión...</p>}

      {!loading && status && (
        <div>
          {status.status ? (
            <h1 style={{ color: "green" }}>
              🟢 CONECTADO A RENDER
            </h1>
          ) : (
            <h1 style={{ color: "red" }}>
              🔴 NO CONECTADO
            </h1>
          )}

          <pre style={{
            background: "#111",
            color: "#0f0",
            padding: 10,
            marginTop: 20
          }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}