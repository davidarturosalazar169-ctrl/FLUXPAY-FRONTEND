import "./RolesPermisos.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
FaHome,
FaStore,
FaChartBar,
FaHeadset,
FaBell,
FaCog,
FaUserLock,
FaSearch,
FaSave,
FaBoxes,
} from "react-icons/fa";

import CerrarSesion from "../CerrarSesion";

export default function RolesPermisos(){

const navigate = useNavigate();

const [roles,setRoles]=useState([]);
const [permisos,setPermisos]=useState([]);
const [rolSeleccionado,setRolSeleccionado]=useState("");
const [permisosRol,setPermisosRol]=useState([]);
const [busqueda,setBusqueda]=useState("");
const usuario = JSON.parse(localStorage.getItem("user"));
useEffect(()=>{
    obtenerRoles();
    obtenerPermisos();
},[]);

useEffect(()=>{
    if(rolSeleccionado!=""){
        obtenerPermisosRol();
    }
},[rolSeleccionado]);

const obtenerRoles=async()=>{

const res=await fetch("http://127.0.0.1:8000/api/roles",{
headers:{
Authorization:"Bearer "+localStorage.getItem("token"),
Accept:"application/json"
}
});

const data=await res.json();

setRoles(data);

if(data.length>0){

setRolSeleccionado(data[0].id);

}

};

const obtenerPermisos=async()=>{

const res=await fetch("http://127.0.0.1:8000/api/permisos",{
headers:{
Authorization:"Bearer "+localStorage.getItem("token"),
Accept:"application/json"
}
});

const data=await res.json();

setPermisos(data);

};

const obtenerPermisosRol=async()=>{

const res=await fetch("http://127.0.0.1:8000/api/roles/"+rolSeleccionado+"/permisos",{
headers:{
Authorization:"Bearer "+localStorage.getItem("token"),
Accept:"application/json"
}
});

const data=await res.json();

setPermisosRol(data);

};

const cambiarPermiso=(id)=>{

if(permisosRol.includes(id)){

setPermisosRol(permisosRol.filter(x=>x!==id));

}else{

setPermisosRol([...permisosRol,id]);

}

};

const guardar=async()=>{

await fetch("http://127.0.0.1:8000/api/roles/"+rolSeleccionado+"/permisos",{

method:"PUT",

headers:{
Authorization:"Bearer "+localStorage.getItem("token"),
Accept:"application/json",
"Content-Type":"application/json"
},

body:JSON.stringify({

permisos:permisosRol

})

});

alert("Permisos actualizados");

};

const permisosFiltrados=permisos.filter(p=>

p.nombre.toLowerCase().includes(busqueda.toLowerCase())

);

return(

<div className="admin-layout">

<aside className="admin-sidebar">

<div>

<div className="admin-logo-container">

<img src="/impulsaPay.jpg" className="admin-logo"/>

</div>

<ul className="sidebar-menu">

<li onClick={()=>navigate("/admin/dashboard")}><FaHome/>Dashboard</li>

<li onClick={()=>navigate("/admin/negocios")}><FaStore/>Gestión Negocios</li>

<li onClick={()=>navigate("/admin/inventario")}><FaBoxes/>Inventario</li>

<li onClick={()=>navigate("/admin/reportes")}><FaChartBar/>Reportes</li>

<li onClick={()=>navigate("/admin/soporte")}><FaHeadset/>Soporte</li>

<li onClick={()=>navigate("/admin/rolespermisos")}><FaUserLock/>Roles y permisos</li>

</ul>

</div>

<div>

<ul className="sidebar-menu">

<li><FaCog/>Configuración</li>

</ul>

<CerrarSesion/>

</div>

</aside>

<div className="admin-main">

<header className="modern-header">

<div className="header-content">

<div className="header-left">

<h1>Roles y Permisos</h1>

<p>Administra los accesos del sistema.</p>

</div>

<div className="header-right">

    <div className="profile-info">
        <span className="profile-name">
            {usuario?.name || "Administrador"}
        </span>

        <span className="profile-email">
            {usuario?.email || "admin@impulsapay.com"}
        </span>
    </div>

    <div className="avatar-container">

        <div className="profile-avatar-fallback">
            {usuario?.name?.charAt(0).toUpperCase() || "A"}
        </div>

        <span className="status-indicator"></span>

    </div>

    <button className="notification-btn">
        <FaBell/>
    </button>

</div>

</div>

</header>

<main className="roles-container">

<div className="roles-card">

<div className="roles-top">

<div>

<h2>Administrador de permisos</h2>

<p>Selecciona un rol y define qué puede visualizar.</p>

</div>

<select

value={rolSeleccionado}

onChange={(e)=>setRolSeleccionado(e.target.value)}

>

{

roles.map(r=>

<option key={r.id} value={r.id}>

{r.nombre}

</option>

)

}

</select>

</div>

<div className="search-box">

<FaSearch/>

<input

placeholder="Buscar permiso..."

value={busqueda}

onChange={(e)=>setBusqueda(e.target.value)}

/>

</div>

<table className="tabla-permisos">

<thead>

<tr>

<th>Permiso</th>

<th>Estado</th>

</tr>

</thead>

<tbody>

{

permisosFiltrados.map(p=>

<tr key={p.id}>

<td>{p.nombre}</td>

<td>

<label className="switch">

<input

type="checkbox"

checked={permisosRol.includes(p.id)}

onChange={()=>cambiarPermiso(p.id)}

/>

<span className="slider"></span>

</label>

</td>

</tr>

)

}

</tbody>

</table>

<div className="footer-save">

<button onClick={guardar}>

<FaSave/>

Guardar Cambios

</button>

</div>

</div>

</main>

</div>

</div>

);

}