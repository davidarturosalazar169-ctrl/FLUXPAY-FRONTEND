import React, { useState, useRef } from 'react';
import { 
    FaBuilding, FaMapMarkerAlt, FaPhone, 
    FaCrown, FaCheckCircle, FaLink, FaChevronDown, 
    FaCreditCard, FaPencilAlt, FaUniversity, FaEnvelope, FaCalendarAlt, FaLock 
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const Configuracion = () => {
    const [editMode, setEditMode] = useState(false);
    const [showMetodos, setShowMetodos] = useState(false);
    const fileInputRef = useRef(null);

    // Estado real del negocio e información del usuario
    const [negocio, setNegocio] = useState({
        nombre: "Tendejon",
        ubicacion: "Juan Pablo II",
        telefono: "+0189322392",
        correo: "joseagui@gmail.com",
        fecha: "1/9/2020",
        foto: "https://i.pravatar.cc/150?img=32" 
    });

    // Estado temporal para el formulario de edición
    const [formValues, setFormValues] = useState({
        contrasena: '',
        correo: negocio.correo,
        fecha: negocio.fecha
    });
    const [tempFoto, setTempFoto] = useState(null);

    const logos = {
        paypal: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
        stripe: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    };

    const handleStartEditing = () => {
        setFormValues({
            contrasena: '',
            correo: negocio.correo,
            fecha: negocio.fecha
        });
        setTempFoto(null);
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handlePhotoPreview = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setTempFoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGuardar = () => {
        if (!formValues.correo.trim()) {
            Swal.fire({
                title: 'Error',
                text: 'El correo electrónico no puede estar vacío.',
                icon: 'error',
                confirmButtonColor: '#1e293b'
            });
            return;
        }

        const nuevaFoto = tempFoto || negocio.foto;

        setNegocio({
            ...negocio,
            correo: formValues.correo,
            fecha: formValues.fecha,
            foto: nuevaFoto
        });

        const headerAvatar = document.querySelector('.negocio-avatar-wrapper img');
        if (headerAvatar) headerAvatar.src = nuevaFoto;

        const headerName = document.querySelector('.negocio-user-name');
        if (headerName) headerName.textContent = "José Aguilar"; 

        const headerEmail = document.querySelector('.negocio-user-email');
        if (headerEmail) headerEmail.textContent = formValues.correo;
        
        Swal.fire({
            title: 'Cambios guardados',
            text: 'La información se ha actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1e293b',
            iconColor: '#10b981'
        }).then(() => {
            setEditMode(false);
            setTempFoto(null);
        });
    };

    return (
        <div className="config-fluid-container">
            {/* ESTILOS INYECTADOS OPTIMIZADOS PARA EL ANCHO COMPLETO DEL PANEL */}
            <style>{`
                .config-fluid-container {
                    width: 100%;
                    box-sizing: border-box;
                    font-family: system-ui, -apple-system, sans-serif;
                    color: #334155;
                }
                .config-header { 
                    margin-bottom: 2rem; 
                    margin-top: 0.5rem;
                }
                .config-title { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 0.4rem; }
                .config-subtitle { font-size: 0.95rem; color: #64748b; }
                
                .config-grid-layout {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 1.5rem;
                    align-items: stretch;
                    width: 100%;
                }
                .config-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 1.75rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;
                }
                .card-section-title { font-size: 1.1rem; font-weight: 600; color: #1e293b; margin-bottom: 1.25rem; margin-top: 0; }
                
                .form-grid-two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .form-input-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
                .form-input-group label { font-size: 0.85rem; font-weight: 500; color: #64748b; display: flex; align-items: center; gap: 0.5rem; }
                
                .config-neutral-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    color: #1e293b;
                    background-color: #f8fafc;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }
                .config-neutral-input:focus { outline: none; border-color: #94a3b8; background-color: #fff; }
                .readonly-style { background-color: #ffffff; color: #334155; border-color: #e2e8f0; }
                
                .action-card-style { cursor: pointer; border-style: dashed; border-color: #cbd5e1; background: #fafafa; transition: all 0.2s; }
                .action-card-style:hover { border-color: #94a3b8; background: #f8fafc; }
                .action-card-content { text-align: center; padding: 1.5rem 0; }
                .action-icon-circle { width: 50px; height: 50px; background: #e2e8f0; color: #475569; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.25rem; }
                .action-card-desc { font-size: 0.875rem; color: #64748b; line-height: 1.5; margin-bottom: 1.5rem; padding: 0 1rem; }
                
                .btn-neutral-save { background-color: #1e293b; color: #ffffff; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; width: 100%; transition: background-color 0.2s; }
                .btn-neutral-save:hover { background-color: #0f172a; }
                .btn-neutral-cancel { background-color: transparent; color: #64748b; border: 1px solid #cbd5e1; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
                .btn-neutral-cancel:hover { background-color: #f1f5f9; color: #334155; }
                
                .edit-actions-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
                .text-center-flex { align-items: center; justify-content: center; text-align: center; }
                
                .avatar-edit-container { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .avatar-preview-box { position: relative; width: 120px; height: 120px; }
                .avatar-preview-box img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid #e2e8f0; }
                .badge-status-online { position: absolute; bottom: 5px; right: 5px; width: 14px; height: 14px; background: #10b981; border: 2.5px solid #fff; border-radius: 50%; }
                .avatar-helper-text { font-size: 0.8rem; color: #94a3b8; margin: 0; }
                .btn-secondary-outline { background: #fff; border: 1px solid #cbd5e1; padding: 0.5rem 1rem; border-radius: 6px; color: #475569; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
                .btn-secondary-outline:hover { background: #f8fafc; }
                
                .clean-badge-row { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
                .neutral-badge-premium { background: #fef3c7; color: #92400e; font-size: 0.8rem; padding: 0.35rem 0.75rem; border-radius: 20px; display: flex; align-items: center; gap: 0.35rem; font-weight: 500; }
                .neutral-badge-expiry { background: #f1f5f9; color: #475569; font-size: 0.8rem; padding: 0.35rem 0.75rem; border-radius: 20px; display: flex; align-items: center; gap: 0.35rem; }
                
                .methods-collapsible-section { width: 100%; margin-top: auto; }
                .btn-trigger-dropdown { width: 100%; background: none; border: 1px solid #e2e8f0; padding: 0.75rem 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; color: #475569; font-size: 0.9rem; cursor: pointer; }
                .arrow-transition { transition: transform 0.2s; }
                .arrow-transition.rotated { transform: rotate(180deg); }
                
                .clean-methods-list { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
                .minimalist-method-item { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 0.75rem; box-sizing: border-box; }
                .method-details { display: flex; align-items: center; gap: 0.75rem; }
                .method-icon { color: #64748b; font-size: 1.25rem; }
                .method-title { font-size: 0.9rem; font-weight: 600; color: #334155; margin: 0; }
                .method-sub { font-size: 0.8rem; color: #94a3b8; margin: 0; }
                .method-tag { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 500; }
                .method-tag.active { background: #dcfce7; color: #166534; }
                .method-tag.alternative { background: #e2e8f0; color: #475569; }
                
                .clean-integrations-flex { display: flex; gap: 1rem; width: 100%; margin-top: auto; }
                .integration-logo-card { flex: 1; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 8px; display: flex; justify-content: center; align-items: center; background: #f8fafc; height: 60px; box-sizing: border-box; }
                .integration-logo-card img { max-height: 24px; }
            `}</style>

            <div className="config-header">
                <h2 className="config-title">{editMode ? "Modificar Perfil de Usuario" : "Configuración del Sistema"}</h2>
                <p className="config-subtitle">Gestiona la información de tu cuenta, facturación y preferencias de integraciones.</p>
            </div>

            {editMode ? (
                /* ================= VISTA EDICIÓN (SIMÉTRICA) ================= */
                <div className="config-grid-layout">
                    <div className="config-card">
                        <div>
                            <h4 className="card-section-title">Formulario de Actualización</h4>
                            <div className="form-grid-two-cols">
                                <div className="form-input-group">
                                    <label><FaEnvelope /> Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        name="correo"
                                        value={formValues.correo}
                                        onChange={handleInputChange}
                                        className="config-neutral-input" 
                                    />
                                </div>
                                <div className="form-input-group">
                                    <label><FaCalendarAlt /> Fecha de Registro</label>
                                    <input 
                                        type="text" 
                                        name="fecha"
                                        value={formValues.fecha}
                                        onChange={handleInputChange}
                                        className="config-neutral-input" 
                                    />
                                </div>
                            </div>
                            <div className="form-input-group" style={{ marginTop: '0.5rem' }}>
                                <label><FaLock /> Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    name="contrasena"
                                    value={formValues.contrasena}
                                    onChange={handleInputChange}
                                    placeholder="Escribe una nueva contraseña para cambiarla" 
                                    className="config-neutral-input" 
                                />
                            </div>
                        </div>
                        <div className="edit-actions-footer">
                            <button className="btn-neutral-cancel" onClick={() => { setEditMode(false); setTempFoto(null); }}>Cancelar</button>
                            <button className="btn-neutral-save" style={{width: 'auto'}} onClick={handleGuardar}>Confirmar y Guardar</button>
                        </div>
                    </div>

                    <div className="config-card text-center-flex">
                        <h4 className="card-section-title">Imagen de Perfil</h4>
                        <div className="avatar-edit-container">
                            <div className="avatar-preview-box">
                                <img src={tempFoto || negocio.foto} alt="Perfil" />
                                <span className="badge-status-online"></span>
                            </div>
                            <p className="avatar-helper-text">Formatos recomendados: JPG, PNG. Máximo 2MB.</p>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handlePhotoPreview} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                            />
                            <button className="btn-secondary-outline" onClick={() => fileInputRef.current.click()}>
                                <FaLink /> Cambiar Imagen
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* ================= VISTA GENERAL (ANCHO COMPLETO) ================= */
                <div className="config-grid-layout">
                    
                    {/* Columna Izquierda Superior */}
                    <div className="config-card">
                        <div>
                            <h4 className="card-section-title">Información General</h4>
                            <div className="form-input-group">
                                <label><FaBuilding /> Nombre del Negocio</label>
                                <input type="text" value={negocio.nombre} readOnly className="config-neutral-input readonly-style" />
                            </div>
                            <div className="form-input-group">
                                <label><FaMapMarkerAlt /> Ubicación Principal</label>
                                <input type="text" value={negocio.ubicacion} readOnly className="config-neutral-input readonly-style" />
                            </div>
                            <div className="form-input-group" style={{ marginBottom: 0 }}>
                                <label><FaPhone /> Teléfono de Contacto</label>
                                <input type="tel" value={negocio.telefono} readOnly className="config-neutral-input readonly-style" />
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha Superior */}
                    <div className="config-card action-card-style" onClick={handleStartEditing}>
                        <div className="action-card-content">
                            <div className="action-icon-circle">
                                <FaPencilAlt />
                            </div>
                            <h4 className="card-section-title" style={{ marginBottom: '0.5rem' }}>Actualizar Perfil</h4>
                            <p className="action-card-desc">
                                Modifica tus credenciales de acceso, cambia tu dirección de correo electrónico institucional y actualiza la fotografía pública del cliente.
                            </p>
                        </div>
                        <button className="btn-neutral-save" onClick={(e) => { e.stopPropagation(); handleStartEditing(); }}>Modificar Datos</button>
                    </div>

                    {/* Columna Izquierda Inferior */}
                    <div className="config-card">
                        <div style={{ marginBottom: '1.25rem' }}>
                            <h4 className="card-section-title" style={{ marginBottom: '0.75rem' }}>Facturación y Cuenta</h4>
                            <div className="clean-badge-row">
                                <div className="neutral-badge-premium">
                                    <FaCrown /> Plan: <strong>Premium</strong>
                                </div>
                                <div className="neutral-badge-expiry">
                                    <FaCheckCircle /> Expira en 3 días
                                </div>
                            </div>
                        </div>

                        <div className="methods-collapsible-section">
                            <button className="btn-trigger-dropdown" style={{ marginBottom: showMetodos ? '0.5rem' : 0 }} onClick={() => setShowMetodos(!showMetodos)}>
                                <span>{showMetodos ? "Ocultar métodos de pago" : "Gestionar métodos de pago"}</span>
                                <FaChevronDown className={`arrow-transition ${showMetodos ? 'rotated' : ''}`} />
                            </button>
                            
                            {showMetodos && (
                                <div className="clean-methods-list">
                                    <div className="minimalist-method-item">
                                        <div className="method-details">
                                            <FaCreditCard className="method-icon" />
                                            <div>
                                                <p className="method-title">Visa Debit</p>
                                                <p className="method-sub">**** **** **** 4242</p>
                                            </div>
                                        </div>
                                        <span className="method-tag active">Activa</span>
                                    </div>
                                    <div className="minimalist-method-item">
                                        <div className="method-details">
                                            <FaUniversity className="method-icon" />
                                            <div>
                                                <p className="method-title">BBVA Bancomer</p>
                                                <p className="method-sub">Cuenta **** 123</p>
                                            </div>
                                        </div>
                                        <span className="method-tag alternative">Ahorros</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha Inferior */}
                    <div className="config-card">
                        <div style={{ marginBottom: '1.25rem' }}>
                            <h4 className="card-section-title">Pasarelas de Pago</h4>
                            <p className="action-card-desc" style={{ margin: 0, padding: 0, textAlign: 'left' }}>Servicios externos vinculados actualmente a tu cuenta para transacciones.</p>
                        </div>
                        <div className="clean-integrations-flex">
                            <div className="integration-logo-card">
                                <img src={logos.paypal} alt="Paypal" />
                            </div>
                            <div className="integration-logo-card">
                                <img src={logos.stripe} alt="Stripe" />
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Configuracion;