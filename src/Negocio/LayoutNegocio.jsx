import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom"; // Importamos useNavigate

import {
    FaHome, FaMoneyBill, FaQrcode, FaHistory,
    FaBox, FaUsers, FaUniversity, FaChartBar,
    FaCog, FaSignOutAlt, FaBell
} from "react-icons/fa";
import "./LayoutNegocio.css";

export default function LayoutNegocio() {
    const navigate = useNavigate(); // Hook para redireccionar
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            // 1. Eliminamos el token y datos del usuario
            localStorage.removeItem("token");
            localStorage.removeItem("user"); 
            
            // 2. Redirigimos al Login
            navigate("/"); 
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div>
                    <div className="admin-logo-container">
                        <div className="sidebar-logo-wrapper">
                            <img
                                src="/ImpulsaPay.jpeg"
                                alt="FluxPay Logo"
                                className="logo-img"
                            />
                        </div>
                    </div>

                    <nav>
                        <ul className="sidebar-menu">
                            <li>
                                <NavLink to="/Negocio/Dashboard">
                                    <FaHome /> <span>Dashboard</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/Negocio/Cobrar" className={({ isActive }) => (isActive ? "active" : "")}>
                                    <FaMoneyBill /> <span>Cobrar</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/Negocio/Productos">
                                    <FaBox /> <span>Productos</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/Negocio/QR">
                                    <FaQrcode /> <span>QR</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/Negocio/Historial">
                                    <FaHistory /> <span>Historial</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/Negocio/Clientes">
                                    <FaUsers /> <span>Clientes</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/Negocio/Cuenta">
                                    <FaUniversity /> <span>Cuenta / Banco</span>
                                </NavLink>
                            </li>
                            
                            <li>
                                <NavLink to="/Negocio/Reportes">
                                    <FaChartBar /> <span>Reportes</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/Negocio/Configuracion">
                                    <FaCog /> <span>Configuración</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div
                    className="logout"
                    style={{
                        display: 'flex',
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        fontWeight: '600',
                        fontSize: '14px',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        marginTop: 'auto'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#f87171';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#94a3b8';
                    }}
                    onClick={handleLogout} // Usamos la función corregida
                >
                    <FaSignOutAlt style={{ fontSize: '18px' }} />
                    <span>Cerrar sesión</span>
                </div>
            </aside>

            {/* MAIN */}
            <main className="admin-main">

                {/* HEADER */}
                <header className="negocio-header">

                    <div className="negocio-header-left">
                        <div>
                            <h1 className="negocio-title">
                                {user.negocio?.nombre || "Panel de Negocio"}
                            </h1>
                            <p className="negocio-subtitle">
                                Administra tus ventas y productos fácilmente
                            </p>
                        </div>
                    </div>

                    <div className="negocio-header-right">

                        <div className="negocio-user-box">
                            <div className="negocio-user-info">
                                <span className="negocio-user-name">
                                    {user.name || "Usuario"}
                                </span>
                                <span className="negocio-user-email">
                                    {user.email || ""}
                                </span>
                            </div>

                            <div className="negocio-avatar-container">
                                <div className="negocio-avatar-wrapper">
                                    <img
                                        src="https://i.pravatar.cc/150?img=32"
                                        alt="Usuario"
                                    />
                                </div>

                                <div className="negocio-online-dot"></div>
                            </div>
                        </div>

                        <FaBell className="negocio-bell-icon" />

                    </div>
                </header>

                <section className="view-container">
                    <Outlet />
                </section>

            </main>
        </div>
    );
}