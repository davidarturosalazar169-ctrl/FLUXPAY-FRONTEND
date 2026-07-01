import "./InventarioAdmin.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  FaHome,
  FaStore,
  FaChartBar,
  FaHeadset,
  FaBell,
  FaCog,
  FaUserLock,
  FaBoxes
} from "react-icons/fa";

import CerrarSesion from "../CerrarSesion";

export default function InventarioAdmin() {

    const navigate = useNavigate();

const [inventario, setInventario] = useState([]);
const [resumen, setResumen] = useState({
    productos: 0,
    stock_bajo: 0,
    agotados: 0,
    produccion: 0
});
useEffect(() => {
    cargarInventario();
}, []);
const [buscar, setBuscar] = useState("");


const cargarInventario = async () => {

    try{

        const res = await fetch("http://127.0.0.1:8000/api/inventario",{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token"),
                Accept:"application/json"
            }
        });

        const data = await res.json();

        setInventario(data.inventario);

        setResumen({

            productos:data.productos,
            stock_bajo:data.stock_bajo,
            agotados:data.agotados,
            produccion:data.produccion

        });

    }catch(error){

        console.log(error);

    }

};

const inventarioFiltrado = inventario.filter(item => {

    return (

        item.producto.nombre
            .toLowerCase()
            .includes(buscar.toLowerCase())

        ||

        item.negocio.nombre
            .toLowerCase()
            .includes(buscar.toLowerCase())

    );

});

    return (


<div className="admin-layout">

    <aside className="admin-sidebar">

        <div>

            <div className="admin-logo-container">
                <img src="/impulsaPay.jpg" className="admin-logo" />
            </div>

            <ul className="sidebar-menu">

                <li onClick={()=>navigate("/admin/dashboard")}>
                    <FaHome/> Dashboard
                </li>

                <li onClick={()=>navigate("/admin/negocios")}>
                    <FaStore/> Gestión Negocios
                </li>
                
                <li className="active">
                    <FaBoxes/> Inventario
                </li>

                <li onClick={()=>navigate("/admin/reportes")}>
                    <FaChartBar/> Reportes
                </li>

                <li onClick={()=>navigate("/admin/soporte")}>
                    <FaHeadset/> Soporte
                </li>

                <li onClick={()=>navigate("/admin/permisos")}>
                    <FaUserLock/> Roles y permisos
                </li>

            </ul>

        </div>

        <div>

            <ul className="sidebar-menu">

                <li onClick={()=>navigate("/admin/configuracion")}>
                    <FaCog/> Configuración
                </li>

            </ul>

            <CerrarSesion/>

        </div>

    </aside>

    <div className="admin-main">

        <header className="modern-header">

            <div className="header-content">

                <div className="header-left">

                    <h1>Inventario</h1>

                    <p>Control de producción e inventario en tiempo real.</p>

                </div>

                <div className="header-right">

                    <div className="profile-info">

                        <span className="profile-name">
                            Administrador
                        </span>

                        <span className="profile-email">
                            admin@impulsapay.com
                        </span>

                    </div>

                    <div className="avatar-container">

                        <div className="profile-avatar-fallback">

                            A

                        </div>

                        <span className="status-indicator"></span>

                    </div>

                    <button className="notification-btn">

                        <FaBell/>

                    </button>

                </div>

            </div>

        </header>

        <main className="inventario-container">

    <div className="cards">

        <div className="card-info">
            <h3>Productos</h3>
            <h1>{resumen.productos}</h1>
        </div>

        <div className="card-info">
            <h3>Stock Bajo</h3>
            <h1>{resumen.stock_bajo}</h1>
        </div>

        <div className="card-info">
            <h3>En Producción</h3>
            <h1>{resumen.produccion}</h1>
        </div>

        <div className="card-info">
            <h3>Agotados</h3>
            <h1>{resumen.agotados}</h1>
        </div>

    </div>
    <div className="inventario-header">

    <input

        type="text"

        placeholder="Buscar producto o negocio..."

        value={buscar}

        onChange={(e)=>setBuscar(e.target.value)}

    />

</div>

    <table className="tabla-inventario">

        <thead>
            <tr>
                <th>Producto</th>
                <th>Negocio</th>
                <th>Stock</th>
                <th>Producción</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>

        <tbody>

            {inventarioFiltrado.map(item => (

                <tr key={item.id}>

                    <td>{item.producto.nombre}</td>

                    <td>{item.negocio.nombre}</td>

                    <td>

    {item.stock}

    {

        item.stock<=item.stock_minimo &&

        <span className="alerta-stock">

        </span>

    }

</td>

                    <td>{item.en_produccion}</td>

                    <td>

                        <span
                            className={
                                item.estado === "Disponible"
                                    ? "estado disponible"
                                    : item.estado === "Bajo"
                                    ? "estado bajo"
                                    : "estado agotado"
                            }
                        >
                            {item.estado}
                        </span>

                    </td>
                    <td>

    <button className="btn-editar">

        Editar

    </button>

</td>

                </tr>
                

            ))}

        </tbody>

    </table>

</main>

    </div>

</div>

    );

}