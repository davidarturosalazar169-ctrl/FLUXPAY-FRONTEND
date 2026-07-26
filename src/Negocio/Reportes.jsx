import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaSearch, FaTicketAlt, FaPlusCircle, FaHistory, 
  FaUser, FaStore, FaTag, FaChevronRight 
} from 'react-icons/fa';

const Reportes = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ESTADOS PARA SELECTS
  const [categoria, setCategoria] = useState("Pago QR");
  const [prioridad, setPrioridad] = useState("Baja");
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
  try {
    const response = await fetch(`${API_BASE}/tickets`, {
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token") // 🔥 IMPORTANTE
      }
    });

    if (!response.ok) throw new Error("Error en servidor");

    const data = await response.json();
    setTickets(data);

  } catch (error) {
    console.error("Error FluxPay:", error);
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const datosEnvio = {
      cliente: formData.get('cliente_nombre'), 
      negocio_id: formData.get('negocio_id'),
      mensaje: formData.get('asunto'), 
      prioridad: prioridad,
      categoria: categoria,
      estado: 'Pendiente'
    };

    try {
    const response = await fetch('http://localhost:8000/api/tickets', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    "Authorization": "Bearer " + localStorage.getItem("token") // 🔥 CLAVE
  },
  body: JSON.stringify(datosEnvio)
});

      if (response.ok) {
        e.target.reset();
        setCategoria("Pago QR");
        setPrioridad("Baja");
        fetchTickets(); 
      }
    } catch (error) {
      alert("Error al conectar con la base de datos");
    }
  };

  const filtrados = useMemo(() => {
    return tickets.filter(t => 
      t.mensaje?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toString().includes(searchTerm)
    );
  }, [searchTerm, tickets]);

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Centro de Soporte</h2>
          <p style={subtitleStyle}>Panel de incidencias y reportes técnicos</p>
        </div>
        <div style={{ background: "#0f172a", color: "white", padding: "10px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
          <FaTicketAlt size={14} /> {tickets.length} Tickets Totales
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '30px' }}>
        
        {/* FORMULARIO LATERAL */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: "#0f172a" }}>
            <FaPlusCircle size={18} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Nueva Solicitud</h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={inputGroup}>
              <label style={labelStyle}>Nombre del Cliente</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={iconInputStyle} />
                <input name="cliente_nombre" required placeholder="Ej: Javier López" style={inputWithIconStyle} />
              </div>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>ID Negocio</label>
              <div style={{ position: 'relative' }}>
                <FaStore style={iconInputStyle} />
                <input name="negocio_id" type="number" required placeholder="Ej: 1" style={inputWithIconStyle} />
              </div>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Mensaje del Reporte</label>
              <textarea name="asunto" required placeholder="Describe el problema a detalle..." style={textareaStyle} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>Categoría</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={selectStyle}>
                  <option value="Pago QR">Pago QR</option>
                  <option value="App Cliente">App Cliente</option>
                  <option value="Terminal">Terminal</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Prioridad</label>
                <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={selectStyle}>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
            </div>

            <button type="submit" style={btnSaveStyle}>
              <FaTag size={12} /> Generar Ticket
            </button>
          </form>
        </div>

        {/* LISTADO DE TICKETS */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: "#0f172a" }}>
              <FaHistory size={18} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Historial en BD</h3>
            </div>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '11px', color: "#64748b", fontSize: "14px" }} />
              <input 
                placeholder="Buscar cliente o ID..." 
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchStyle}
              />
            </div>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
            {loading ? <p style={{ color: "#64748b", fontSize: "14px" }}>Cargando tickets...</p> : 
              filtrados.length > 0 ? (
                filtrados.map(t => (
                  <div key={t.id} style={ticketItemStyle}>
                    <div style={{ flex: 1 }}>
                      <div style={ticketHeaderStyle}>
                        {t.cliente} 
                        <span style={negocioBadge}>ID: {t.negocio_id}</span>
                      </div>
                      <div style={ticketMessageStyle}>{t.mensaje}</div>
                      <div style={ticketFooterStyle}>
                        <span>TK-{t.id}</span>
                        <span style={{ margin: '0 8px' }}>•</span>
                        <span>{t.categoria}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                      <div style={priorityBadge(t.prioridad)}>
                        {t.prioridad}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>No se encontraron reportes.</div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SISTEMA DE DISEÑO UNIFICADO (FLUXPAY CLEAN) ---
const containerStyle = { padding: "40px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const titleStyle = { margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: "700" };
const subtitleStyle = { margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" };

const cardStyle = { background: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" };

const inputGroup = { marginBottom: "20px" };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px' };
const inputWithIconStyle = { width: '100%', padding: '12px 12px 12px 42px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const iconInputStyle = { position: 'absolute', left: '14px', top: '14px', color: '#94a3b8', fontSize: '14px' };

const textareaStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', minHeight: '100px', fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box' };

const selectStyle = { width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '14px', fontWeight: '500', color: '#1e293b', outline: 'none' };

const btnSaveStyle = { width: '100%', padding: '14px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' };

const searchStyle = { padding: '10px 15px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', width: '220px', outline: 'none' };

const ticketItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', borderBottom: '1px solid #f1f5f9', marginBottom: '10px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #f1f5f9' };

const ticketHeaderStyle = { fontWeight: '700', color: '#0f172a', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' };
const negocioBadge = { fontWeight: '400', fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' };
const ticketMessageStyle = { color: '#475569', fontSize: '13px', margin: '6px 0', lineHeight: '1.4' };
const ticketFooterStyle = { fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' };

const priorityBadge = (p) => ({
  fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase',
  backgroundColor: p === 'Alta' ? '#fee2e2' : p === 'Media' ? '#e0f2fe' : '#f1f5f9',
  color: p === 'Alta' ? '#dc2626' : p === 'Media' ? '#0284c7' : '#475569',
  border: `1px solid ${p === 'Alta' ? '#fecaca' : p === 'Media' ? '#bae6fd' : '#e2e8f0'}`
});

export default Reportes;