export function tienePermiso(clave) {

    const permisos = JSON.parse(localStorage.getItem("permisos")) || [];

    return permisos.includes(clave);

}