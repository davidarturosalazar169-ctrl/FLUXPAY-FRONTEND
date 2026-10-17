
import React, { useEffect, useState } from "react";

export default function MetabaseGrafica() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("[Metabase] Solicitando token a Laravel...");

    fetch("http://localhost:8000/api/metabase/token")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el token de Laravel");
        }
        return res.json();
      })
      .then((data) => {
        console.log("[Metabase] Token recibido:", data.token);

        window.metabaseConfig = {
          theme: { preset: "dark" },
          isGuest: true,
          instanceUrl: data.instanceUrl,
        };

        setToken(data.token);

        if (!document.querySelector("#metabase-script")) {
          const script = document.createElement("script");
          script.id = "metabase-script";
          script.src = `${data.instanceUrl}/app/embed.js`;
          script.onload = () =>
            console.log("[Metabase] Script cargado correctamente");
          script.onerror = () =>
            console.error("[Metabase] Error al cargar embed.js");

          document.body.appendChild(script);
        }
      })
      .catch((err) => {
        console.error("[Metabase] Error:", err);
        setError(err.message);
      });
  }, []);

  if (error) return <p>Error: {error}</p>;

  if (!token) return <p>Conectando con Metabase...</p>;

  return (
    <div style={{ width: "100%", minHeight: "600px" }}>
      <metabase-dashboard
        token={token}
        with-title="true"
        with-downloads="true"
      />
    </div>
  );
}
