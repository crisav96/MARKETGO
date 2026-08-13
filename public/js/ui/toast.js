const ICONOS = {
    exito: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    advertencia: "bi-exclamation-triangle-fill"
};

let contenedor = null;

// ===========================
// CONTENEDOR (se crea una sola vez)
// ===========================

function obtenerContenedor() {

    if (contenedor) return contenedor;

    contenedor = document.createElement("div");

    contenedor.id = "toastContainer";
    contenedor.className = "toast-contenedor";

    document.body.appendChild(contenedor);

    return contenedor;

}

// ===========================
// MOSTRAR TOAST
// ===========================

export function mostrarToast(texto, tipo = "exito", duracion = 3500) {

    if (!texto) return;

    const toast = document.createElement("div");

    toast.className = `toast toast-${tipo}`;

    const icono = document.createElement("i");
    icono.className = `bi ${ICONOS[tipo] || ICONOS.exito}`;

    const mensaje = document.createElement("span");
    mensaje.textContent = texto;

    const botonCerrar = document.createElement("button");
    botonCerrar.className = "toast-cerrar";
    botonCerrar.setAttribute("aria-label", "Cerrar");
    botonCerrar.innerHTML = `<i class="bi bi-x"></i>`;

    toast.append(icono, mensaje, botonCerrar);

    obtenerContenedor().appendChild(toast);

    const cerrar = () => {

        toast.classList.add("toast-salir");

        toast.addEventListener("animationend", () => toast.remove(), { once: true });

    };

    botonCerrar.addEventListener("click", cerrar);

    setTimeout(cerrar, duracion);

}
