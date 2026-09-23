import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  FaUpload, FaWhatsapp, FaSlidersH, FaLink, FaFont, FaShapes, FaCheckCircle, FaQrcode, FaShieldAlt, FaWifi 
} from 'react-icons/fa';

const GenerarQR = () => {
  const [colorPrimario, setColorPrimario] = useState('#4f46e5');
  const [colorSecundario, setColorSecundario] = useState('#ec4899');
  const [tamanoQR, setTamanoQR] = useState(250);
  const [bordeadoQR, setBordeadoQR] = useState(24);
  const [tamanoLogo, setTamanoLogo] = useState(60);
  
  const [tipoFuente, setTipoFuente] = useState("'Plus Jakarta Sans', sans-serif");
  const [formaImagen, setFormaImagen] = useState("50%");

  const [mensaje, setMensaje] = useState('¡10% DE DESCUENTO HOY!');
  const [negocio, setNegocio] = useState('MODA & ESTILO');
  
  const [enlaceCompleto, setEnlaceCompleto] = useState('https://tienda.ejemplo.com/caja-principal');

  const [imagenNegocio, setImagenNegocio] = useState("https://cdn-icons-png.flaticon.com/512/869/869636.png");
  const qrRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagenNegocio(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generarCanvas = () => {
    return new Promise((resolve) => {
      const svg = qrRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      canvas.width = 1000;
      canvas.height = 1500; 

      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = colorPrimario;
        ctx.font = "bold 56px 'JetBrains Mono'";
        ctx.textAlign = "center";
        ctx.fillText(negocio.toUpperCase(), 500, 160);

        const qrSizeCanvas = 740;
        const qrPosCanvas = (1000 - qrSizeCanvas) / 2;
        ctx.drawImage(img, qrPosCanvas, 240, qrSizeCanvas, qrSizeCanvas);

        ctx.fillStyle = colorSecundario;
        ctx.font = `bold 48px ${tipoFuente}`;
        ctx.fillText(mensaje, 500, 1150);

        ctx.fillStyle = "#64748b";
        ctx.font = `400 30px ${tipoFuente}`;
        ctx.fillText("Escanea para pagar con cualquier app bancaria", 500, 1210);

        ctx.fillStyle = colorPrimario;
        ctx.font = `bold 26px ${tipoFuente}`;
        ctx.fillText("PAGO SEGURO  |  DEMOSTRACIÓN • 2026", 500, 1370);

        resolve(canvas);
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    });
  };

  const compartirWhatsApp = async () => {
    const canvas = await generarCanvas();
    
    let textoMensaje = `¡Hola! Aquí tienes tu tarjeta de cobro oficial para *${negocio}*.\n\n`;
    textoMensaje += `🔗 *Destino:* ${enlaceCompleto}\n`;
    textoMensaje += `📌 *Concepto:* ${mensaje}`;

    canvas.toBlob(async (blob) => {
      const file = new File([blob], `QR_${negocio}.png`, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Cobro - ${negocio}`,
            text: textoMensaje,
          });
        } catch (error) { console.error("Error al compartir:", error); }
      } else {
        const urlWp = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensaje)}`;
        window.open(urlWp, '_blank');
      }
    });
  };

  return (
    <div style={styles.layout}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;600;700;800&family=Poppins:wght@400;600;700;800&family=Roboto:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .input-styled:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
          background: #ffffff !important;
        }

        .btn-whatsapp-killer {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          width: 100%;
          padding: 18px 22px;
          border-radius: 16px;
          border: none;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
          transition: all 0.25s ease;
        }
        .btn-whatsapp-killer:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -4px rgba(16, 185, 129, 0.6);
        }

        @keyframes pulse-dot {
          0% { transform: scale(0.95); boxShadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
          70% { transform: scale(1); boxShadow: 0 0 0 6px rgba(79, 70, 229, 0); }
          100% { transform: scale(0.95); boxShadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }

        .pulse-badge {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #4f46e5;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      <main style={styles.mainContainer}>
        {/* PANEL IZQUIERDO */}
        <section style={styles.panelLeft}>
          <div style={styles.cardInternal}>
            
            <div style={styles.sectionBox}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>
                  <span style={styles.iconBox}><FaQrcode size={12} color="#4f46e5"/></span> 
                  Datos de la Tienda
                </span>
              </div>

              <div style={styles.controlGroup}>
                <label style={styles.label}>NOMBRE COMERCIAL</label>
                <input className="input-styled" style={styles.input} value={negocio} onChange={(e) => setNegocio(e.target.value)} />
              </div>

              <div style={styles.controlGroup}>
                <label style={styles.label}>ESLOGAN O MENSAJE DE COBRO</label>
                <input className="input-styled" style={styles.input} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
              </div>

              <div style={styles.controlGroup}>
                <label style={styles.label}>ADJUNTAR LOGOTIPO</label>
                <label style={styles.uploadBtn}>
                  <FaUpload color="#4f46e5" size={14} /> Cargar imagen (PNG / JPG)
                  <input type="file" hidden onChange={handleImageUpload} />
                </label>
              </div>

              <div style={styles.controlGroup}>
                <label style={styles.label}><FaShapes /> FORMA DE LA IMAGEN CENTRAL</label>
                <select className="input-styled" style={styles.input} value={formaImagen} onChange={(e) => setFormaImagen(e.target.value)}>
                  <option value="50%">Círculo perfecto</option>
                  <option value="12px">Cuadrado redondeado</option>
                  <option value="0px">Cuadrado completo</option>
                </select>
              </div>
            </div>

            <div style={{ ...styles.sectionBox, marginTop: '16px' }}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>
                  <span style={styles.iconBox}><FaLink size={12} color="#4f46e5"/></span> 
                  Enlace de Pago / Destino
                </span>
                <span style={{ fontSize: '11px', color: '#4f46e5', fontWeight: '800', background: '#e0e7ff', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaCheckCircle size={10} /> Activo
                </span>
              </div>

              <div style={styles.controlGroup}>
                <label style={styles.label}>ENLACE WEB A DONDE APUNTA EL QR</label>
                <input className="input-styled" style={styles.input} value={enlaceCompleto} onChange={(e) => setEnlaceCompleto(e.target.value)} />
              </div>
            </div>

            <div style={{ ...styles.sectionBox, marginTop: '16px', borderBottom: 'none' }}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>
                  <span style={styles.iconBox}><FaSlidersH size={12} color="#4f46e5"/></span> 
                  Personalización Visual y Tipografía
                </span>
              </div>

              <div style={styles.controlGroup}>
                <label style={styles.label}><FaFont /> TIPO DE LETRA</label>
                <select className="input-styled" style={styles.input} value={tipoFuente} onChange={(e) => setTipoFuente(e.target.value)}>
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Moderna)</option>
                  <option value="'Inter', sans-serif">Inter (Limpia y corporativa)</option>
                  <option value="'Poppins', sans-serif">Poppins (Amigable)</option>
                  <option value="'Roboto', sans-serif">Roboto (Clásica)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1, background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={styles.label}>COLOR PRIMARIO</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <input type="color" value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} style={styles.colorInput} />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{colorPrimario}</span>
                  </div>
                </div>
                <div style={{ flex: 1, background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={styles.label}>COLOR SECUNDARIO</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <input type="color" value={colorSecundario} onChange={(e) => setColorSecundario(e.target.value)} style={styles.colorInput} />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{colorSecundario}</span>
                  </div>
                </div>
              </div>

              <div style={styles.controlGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={styles.label}>TAMAÑO QR</label>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5' }}>{tamanoQR}px</span>
                </div>
                <input type="range" min="180" max="300" value={tamanoQR} onChange={(e) => setTamanoQR(Number(e.target.value))} style={styles.rangeInput} />
              </div>

              <div style={styles.controlGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={styles.label}>BORDEADO</label>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5' }}>{bordeadoQR}px</span>
                </div>
                <input type="range" min="0" max="40" value={bordeadoQR} onChange={(e) => setBordeadoQR(Number(e.target.value))} style={styles.rangeInput} />
              </div>

              <div style={styles.controlGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={styles.label}>TAMAÑO LOGO CENTRAL</label>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5' }}>{tamanoLogo}px</span>
                </div>
                <input type="range" min="35" max="85" value={tamanoLogo} onChange={(e) => setTamanoLogo(Number(e.target.value))} style={styles.rangeInput} />
              </div>
            </div>

          </div>
        </section>

        {/* PANEL DERECHO */}
        <section style={styles.panelRight}>
          {/* APARTADO DECORATIVO DE ESTADO */}
          <div style={styles.decorativeBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={styles.decorativeIconBox}>
                <FaShieldAlt size={16} color="#4f46e5" />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  SISTEMA DE PAGO CERTIFICADO <span className="pulse-badge"></span>
                </span>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>
                  Enlace cifrado de alta seguridad para transacciones comerciales
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e0e7ff', padding: '6px 10px', borderRadius: '10px' }}>
              <FaWifi size={12} color="#4f46e5" />
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#4f46e5' }}>En Línea</span>
            </div>
          </div>

          <div style={styles.qrPoster}>
            <div style={{ background: '#fce7f3', color: '#db2777', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'inline-block', marginBottom: '14px', fontFamily: tipoFuente, border: '1px solid #fbcfe8' }}>
              🛍️ Tienda de Ropa y Accesorios
            </div>

            <h2 style={{ ...styles.promoText, color: colorPrimario, fontFamily: tipoFuente }}>{negocio}</h2>
            
            <div ref={qrRef} style={{ ...styles.qrWrapper, borderRadius: `${bordeadoQR}px` }}>
              <QRCodeSVG 
                value={enlaceCompleto}
                size={tamanoQR} 
                level="H"
                fgColor={colorPrimario}
                imageSettings={{ 
                  src: imagenNegocio, 
                  height: tamanoLogo, 
                  width: tamanoLogo, 
                  excavate: true 
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${tamanoLogo}px`,
                height: `${tamanoLogo}px`,
                borderRadius: formaImagen,
                overflow: 'hidden',
                pointerEvents: 'none',
                boxShadow: '0 0 0 4px white, 0 4px 10px rgba(0,0,0,0.15)'
              }}>
                <img src={imagenNegocio} alt="Logo QR" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            <p style={{ ...styles.slongan, color: colorSecundario, fontFamily: tipoFuente }}>{mensaje}</p>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: '500', fontFamily: tipoFuente }}>Escanea para pagar con cualquier app bancaria</p>

            <div style={{ ...styles.footer, fontFamily: tipoFuente }}>
              <span style={{ color: colorPrimario, fontWeight: '800', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>🛡️ Pago Seguro</span>
              <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>SPEI / CODI</span>
            </div>
          </div>

          <div style={{ width: '100%', marginTop: '16px' }}>
            <button className="btn-whatsapp-killer" onClick={compartirWhatsApp}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
                  <FaWhatsapp size={24} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '14px', lineHeight: '1.2', fontWeight: '800', letterSpacing: '0.3px' }}>COBRAR POR WHATSAPP AHORA</span>
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: '500', opacity: '0.9' }}>Envía el QR oficial + enlace directo al chat</span>
                </div>
              </div>
              <span style={{ background: '#f59e0b', color: '#fff', fontSize: '10px', padding: '5px 10px', borderRadius: '8px', fontWeight: '800', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>⚡ 1-CLIC</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  layout: { 
    minHeight: '100vh', 
    width: '100%', 
    fontFamily: "'Plus Jakarta Sans', sans-serif", 
    background: '#f1f5f9', 
    padding: '24px 20px 40px 20px' 
  },

  mainContainer: { 
    display: 'flex', 
    width: '100%', 
    maxWidth: '1400px', 
    margin: '0 auto', 
    gap: '24px', 
    alignItems: 'flex-start',
    padding: '0'
  },

  panelLeft: { 
    flex: 1.15, 
    display: 'flex', 
    flexDirection: 'column',
    minWidth: 0
  },

  cardInternal: { 
    background: '#ffffff', 
    padding: '24px 28px', 
    borderRadius: '24px', 
    border: '1px solid #e2e8f0', 
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between' 
  },

  sectionBox: { 
    borderBottom: '1px solid #f1f5f9', 
    paddingBottom: '16px' 
  },

  sectionHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '12px' 
  },

  sectionTitle: { 
    fontSize: '13px', 
    fontWeight: '800', 
    color: '#4f46e5', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    letterSpacing: '0.3px'
  },

  iconBox: {
    background: '#e0e7ff',
    padding: '6px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  panelRight: { 
    flex: 0.85, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    maxWidth: '540px',
    minWidth: 0
  },

  decorativeBanner: { 
    width: '100%', 
    marginBottom: '16px', 
    background: '#ffffff', 
    padding: '14px 18px', 
    borderRadius: '20px', 
    border: '1px solid #e2e8f0', 
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  decorativeIconBox: {
    background: '#e0e7ff',
    padding: '10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  qrPoster: { 
    background: '#ffffff', 
    padding: '32px 24px', 
    borderRadius: '24px', 
    boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.08)', 
    width: '100%', 
    textAlign: 'center', 
    border: '1px solid #e2e8f0', 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  controlGroup: { 
    marginBottom: '12px', 
    textAlign: 'left' 
  },

  label: { 
    fontSize: '10px', 
    fontWeight: '800', 
    color: '#64748b', 
    marginBottom: '6px', 
    display: 'block', 
    letterSpacing: '0.6px' 
  },

  input: { 
    width: '100%', 
    padding: '11px 14px', 
    borderRadius: '10px', 
    border: '1px solid #cbd5e1', 
    fontSize: '13px', 
    outline: 'none', 
    background: '#f8fafc', 
    color: '#0f172a', 
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },

  colorInput: { 
    border: 'none', 
    width: '36px', 
    height: '36px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    background: 'none' 
  },

  rangeInput: { 
    width: '100%', 
    accentColor: '#4f46e5', 
    cursor: 'pointer', 
    height: '6px' 
  },

  uploadBtn: { 
    background: '#f8fafc', 
    padding: '12px', 
    borderRadius: '10px', 
    textAlign: 'center', 
    fontSize: '12px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    border: '2px dashed #cbd5e1', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    color: '#4f46e5',
    transition: 'all 0.2s'
  },

  qrWrapper: { 
    padding: '16px', 
    background: '#ffffff', 
    display: 'inline-block', 
    border: '1px solid #e2e8f0', 
    position: 'relative', 
    transition: 'all 0.2s', 
    margin: '10px 0',
    boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
  },

  promoText: { 
    fontSize: '22px', 
    letterSpacing: '0.5px', 
    marginBottom: '4px', 
    textTransform: 'uppercase', 
    fontWeight: '800' 
  },

  slongan: { 
    marginTop: '10px', 
    fontSize: '15px', 
    fontWeight: '800', 
    textTransform: 'uppercase' 
  },

  footer: { 
    marginTop: '16px', 
    borderTop: '1px solid #f1f5f9', 
    paddingTop: '14px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    width: '100%', 
    fontSize: '11px', 
    color: '#64748b', 
    fontWeight: '700' 
  }
};

export default GenerarQR;