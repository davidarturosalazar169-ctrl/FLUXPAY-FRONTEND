import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

/* ================= CLIENTE ================= */
import Dashboard from "./Cliente/Dashboard";
import ClienteTarjeta from "./Cliente/ClienteTarjeta";
import HistorialCliente from "./Cliente/HistorialCliente";
import ClienteConfiguracion from "./Cliente/ClienteConfiguracion";

/* ================= ADMIN ================= */
import DashboardAdmin from "./Administrador/Dashboard";
import GestionNegocios from "./Administrador/GestionNegocios";
import AgregarNegocio from "./Administrador/AgregarNegocio";
import DetalleNegocio from "./Administrador/DetalleNegocio";
import ReportesGlobales from "./Administrador/ReportesGlobales";
import Soporte from "./Administrador/Soporte";
import ConfiguracionAdmi from "./Administrador/ConfiguracionAdmi";

/* ================= NEGOCIO ================= */
import DashboardNegocio from "./Negocio/Dashboard";
import ProductosNegocio from "./Negocio/Productos";
import LayoutNegocio from "./Negocio/LayoutNegocio";
import HistorialNegocio from './Negocio/Historial'; 
import ReportesNegocio from "./Negocio/Reportes";
import CobrarNegocio from "./Negocio/Cobrar";
import GenerarQR from "./Negocio/GenerarQR";
import Cuenta from "./Negocio/Cuenta";
import ConfiguracionNegocio from "./Negocio/Configuracion";
import Clientes from './Negocio/Clientes';

/* ================= Stripe ================= */

import StripeProvider from "./stripe/StripeProvider";
import Checkout from "./stripe/Checkout";
import Renderprueba from "./Renderprueba";

function App() {
  return (
    <Routes>

      {/* ================= PUBLICO ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= CLIENTE ================= */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute rolPermitido={9}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/Cliente/clienteTarjetas" 
        element={
          <ProtectedRoute rolPermitido={9}>
            <ClienteTarjeta />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/Cliente/HistorialCliente" 
        element={
          <ProtectedRoute rolPermitido={9}>
            <HistorialCliente />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/Cliente/ClienteConfiguracion" 
        element={
          <ProtectedRoute rolPermitido={9}>
            <ClienteConfiguracion />
          </ProtectedRoute>
        } 
      />

      {/* ================= ADMIN ================= */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute rolPermitido={1}>
            <DashboardAdmin />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/negocios" 
        element={
          <ProtectedRoute rolPermitido={1}>
            <GestionNegocios />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/agregar" 
        element={
          <ProtectedRoute rolPermitido={1}>
            <AgregarNegocio />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/negocio/:id" 
        element={
          <ProtectedRoute rolPermitido={1}>
            <DetalleNegocio />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/reportes" 
        element={
          <ProtectedRoute rolPermitido={1}>
            <ReportesGlobales />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/soporte" 
        element={
          <ProtectedRoute rolPermitido={1}>
            <Soporte />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/configuracion" 
        element={
          <ProtectedRoute rolPermitido={1}>
            <ConfiguracionAdmi />
          </ProtectedRoute>
        } 
      />

      {/* ================= NEGOCIO ================= */}
      <Route 
        path="/negocio" 
        element={
          <ProtectedRoute rolPermitido={8}>
            <LayoutNegocio />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardNegocio />} />
        <Route path="Dashboard" element={<DashboardNegocio />} />
        <Route path="Productos" element={<ProductosNegocio />} />
        <Route path="Historial" element={<HistorialNegocio />} />
        <Route path="Reportes" element={<ReportesNegocio />} />
        <Route path="Cobrar" element={<CobrarNegocio />} />
        <Route path="QR" element={<GenerarQR />} />
        <Route path="Cuenta" element={<Cuenta />} />
        <Route path="Configuracion" element={<ConfiguracionNegocio />} />
        <Route path="Clientes" element={<Clientes />} />
      </Route>
      {/* ================= Stripe ================= */}
      <Route
  path="/stripe-test"
  element={
    <StripeProvider>
      <div style={{ maxWidth: "400px", margin: "50px auto" }}>
        <h2>Prueba Stripe</h2>
        <Checkout />
      </div>
    </StripeProvider>
  }
/>

<Route path="/render-test" element={<Renderprueba />} />
    </Routes>
        
  );
}



export default App;