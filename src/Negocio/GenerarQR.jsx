import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  FaTerminal, FaShieldAlt, FaImage, FaQuoteLeft, 
  FaPalette, FaRocket, FaDownload, FaWhatsapp, FaMagic 
} from 'react-icons/fa';

const GenerarQR = () => {
  const [colorPrimario, setColorPrimario] = useState('#0e2a5a');
  const [colorSecundario, setColorSecundario] = useState('#ef4444');
  const [mensaje, setMensaje] = useState('TU ESLOGAN AQUÍ');
  const [negocio, setNegocio] = useState('CAFÉ CENTRAL');
  const [imagenNegocio, setImagenNegocio] = useState("https://cdn-icons-png.flaticon.com/512/10523/10523071.png");
  const [usarDegradado, setUsarDegradado] = useState(false);
   const API_URL = import.meta.env.VITE_API_URL;
  const qrRef = useRef(null);

  const presets = [
    { p: '#0e2a5a', s: '#ef4444' },
    { p: '#1a1a1a', s: '#facc15' },
    { p: '#064e3b', s: '#10b981' },
    { p: '#4c1d95', s: '#a855f7' },
    { p: '#b91c1c', s: '#f87171' },
    { p: '#0f172a', s: '#38bdf8' },
  ];

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
      canvas.height = 1250; 

      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = colorPrimario;
        ctx.font = "bold 50px 'JetBrains Mono'";
        ctx.textAlign = "center";
        ctx.fillText(negocio.toUpperCase(), 500, 150);

        ctx.drawImage(img, 150, 250, 700, 700);

        ctx.fillStyle = usarDegradado ? colorPrimario : colorSecundario;
        ctx.font = "bold 45px 'Plus Jakarta Sans'";
        ctx.fillText(mensaje, 500, 1050);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 25px 'Plus Jakarta Sans'";
        ctx.fillText("MÉRIDA • 2026 | SECURE ASSET", 500, 1180);

        resolve(canvas);
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    });
  };

  const descargarQR = async () => {
    const canvas = await generarCanvas();
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngFile;
    downloadLink.download = `ImpulsaPay_${negocio}.png`;
    downloadLink.click();
  };

  const compartirWhatsApp = async () => {
    const canvas = await generarCanvas();
    canvas.toBlob(async (blob) => {
      const file = new File([blob], `QR_${negocio}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `QR ImpulsaPay - ${negocio}`,
            text: `Aquí tienes el código QR de pago para ${negocio}`,
          });
        } catch (error) { console.error("Error al compartir:", error); }
      } else {
        alert("Tu navegador no permite compartir archivos directamente. Usa el botón de descargar.");
      }
    });
  };

  return (
    <div style={styles.layout}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Plus+Jakarta+Sans:wght@300;400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .color-swatch { height: 35px; border-radius: 8px; cursor: pointer; display: flex; overflow: hidden; border: 2px solid transparent; transition: 0.2s; }
        .color-swatch.active { border-color: #0e2a5a; transform: scale(1.05); }

        .btn-action { width: 100%; padding: 14px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; margin-top: 10px; }
        .btn-whatsapp { background: #25D366; color: white; }
        .btn-download { background: #0e2a5a; color: white; }
        .btn-action:hover { filter: brightness(1.1); transform: translateY(-2px); }

        .custom-color-input { -webkit-appearance: none; border: none; width: 100%; height: 40px; cursor: pointer; border-radius: 8px; background: none; }
        .custom-color-input::-webkit-color-swatch { border-radius: 8px; border: 2px solid #e2e8f0; }

        .toggle-gradient {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f1f5f9;
          padding: 12px;
          border-radius: 12px;
          margin-top: 10px;
          cursor: pointer;
        }
      `}</style>

      <main style={styles.mainContainer}>
        <section style={styles.panelLeft}>
          <div style={styles.cardInternal}>
            <header style={{ marginBottom: '25px' }}>
              <span style={styles.badge}><FaTerminal /> IMPULSAPAY_CORE_V6.5</span>
              <h1 style={styles.title}>ImpulsaPay Studio</h1>
            </header>

            <div style={styles.controlGroup}>
              <label style={styles.label}><FaRocket /> NEGOCIO</label>
              <input style={styles.input} value={negocio} onChange={(e) => setNegocio(e.target.value)} />
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.label}><FaQuoteLeft /> ESLOGAN</label>
              <input style={styles.input} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.label}><FaPalette /> PERSONALIZAR COLORES</label>
              <div style={styles.colorGrid}>
                {presets.map((p, i) => (
                  <div key={i} className={`color-swatch ${colorPrimario === p.p ? 'active' : ''}`} onClick={() => { setColorPrimario(p.p); setColorSecundario(p.s); }}>
                    <div style={{ flex: 1, background: p.p }} />
                    <div style={{ flex: 1, background: p.s }} />
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9px', fontWeight: 800 }}>PRIMARIO</span>
                  <input type="color" className="custom-color-input" value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9px', fontWeight: 800 }}>ACENTO / GRAD</span>
                  <input type="color" className="custom-color-input" value={colorSecundario} onChange={(e) => setColorSecundario(e.target.value)} />
                </div>
              </div>

              <div className="toggle-gradient" onClick={() => setUsarDegradado(!usarDegradado)}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                   <FaMagic style={{ marginRight: '8px' }} /> ACTIVAR DEGRADADO
                </span>
                <input type="checkbox" checked={usarDegradado} readOnly />
              </div>
            </div>

            <label style={styles.uploadBtn}>
              <FaImage /> LOGO DEL QR
              <input type="file" hidden onChange={handleImageUpload} />
            </label>

            <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
              <button className="btn-action btn-whatsapp" onClick={compartirWhatsApp}>
                <FaWhatsapp size={20} /> COMPARTIR POR WA
              </button>
              <button className="btn-action btn-download" onClick={descargarQR}>
                <FaDownload /> DESCARGAR PNG
              </button>
            </div>
          </div>
        </section>

        <section style={styles.panelRight}>
          <div style={styles.qrPoster}>
            <h2 style={{ ...styles.promoText, color: colorPrimario }}>{negocio}</h2>
            <div ref={qrRef} style={styles.qrWrapper}>
              <QRCodeSVG 
                value={`IMPULSAPAY|${negocio}`}
                size={300}
                level="H"
                fgColor={usarDegradado ? undefined : colorPrimario}
                imageSettings={{ 
                  src: imagenNegocio, 
                  height: 75, 
                  width: 75, 
                  excavate: true 
                }}
              >
                {usarDegradado && (
                  <defs>
                    <linearGradient id="qr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colorPrimario} />
                      <stop offset="100%" stopColor={colorSecundario} />
                    </linearGradient>
                  </defs>
                )}
                {usarDegradado && <style>{`rect { fill: url(#qr-grad); }`}</style>}
              </QRCodeSVG>
            </div>
            <p style={{ ...styles.slongan, color: usarDegradado ? colorPrimario : colorSecundario }}>{mensaje}</p>
            <div style={styles.footer}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaShieldAlt color={colorPrimario} /> SECURE ASSET
              </div>
              <span>MÉRIDA • 2026</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  layout: { height: '100vh', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8fafc' },
  mainContainer: { display: 'flex', height: '100%', width: '100%' },
  panelLeft: { flex: 1, padding: '30px', display: 'flex', flexDirection: 'column' },
  cardInternal: { background: 'white', padding: '30px', borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  panelRight: { flex: 1, padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  qrPoster: { background: 'white', padding: '50px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '480px', textAlign: 'center' },
  badge: { fontSize: '9px', fontWeight: '800', color: '#94a3b8', letterSpacing: '2px' },
  title: { fontSize: '22px', color: '#0e2a5a', fontWeight: '800' },
  controlGroup: { marginBottom: '18px' },
  label: { fontSize: '10px', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' },
  colorGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' },
  uploadBtn: { background: '#f8fafc', padding: '12px', borderRadius: '10px', textAlign: 'center', fontSize: '11px', fontWeight: '700', cursor: 'pointer', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  qrWrapper: { padding: '20px', background: 'white', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'inline-block' },
  promoText: { fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', letterSpacing: '4px', marginBottom: '25px', textTransform: 'uppercase' },
  slongan: { marginTop: '25px', fontSize: '18px', fontWeight: '800' },
  footer: { marginTop: '35px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', fontWeight: '700' }
};

export default GenerarQR;