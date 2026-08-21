import { formatearMoneda, calcularSubtotal, calcularTotalItems } from "./carritoUtils.js";

const panelCarrito = document.getElementById("carrito");
const overlay = document.getElementById("carritoOverlay");
const contenedorItems = document.getElementById("carritoItems");
const contadorCarrito = document.getElementById("contadorCarrito");
const subtotalCarrito = document.getElementById("subtotalCarrito");
const totalHeader = document.getElementById("totalHeader");

// ===========================
// RENDERIZAR CARRITO
// ===========================

export function renderizarCarrito(carrito) {

    if (!contenedorItems) return;

    if (carrito.length === 0) {

        mostrarCarritoVacio();

    } else {

        contenedorItems.innerHTML = carrito.map(plantillaItem).join("");

    }

    actualizarContador(carrito);

    actualizarSubtotal(carrito);

}

// ===========================
// ESCAPAR HTML (el nombre/categoría vienen del admin, no deben inyectar markup)
// ===========================

function escaparHtml(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

// ===========================
// PLANTILLA DE UN ITEM
// ===========================

function plantillaItem(producto) {

    const nombre = escaparHtml(producto.nombre);
    const categoria = escaparHtml(producto.categoria);

    return `
        <div class="item-carrito" data-id="${producto.id}">

            <img
                src="/img/productos/${producto.imagen}"
                alt="${nombre}"
                onerror="this.onerror=null; this.src='/img/productos/default.png';">

            <div class="item-info">

                <h4>${nombre}</h4>

                <small>${categoria}</small>

                <strong>${formatearMoneda(producto.precio)}</strong>

            </div>

            <div class="item-cantidad">

                <button class="btn-restar" data-id="${producto.id}">-</button>

                <span>${producto.cantidad}</span>

                <button class="btn-sumar" data-id="${producto.id}">+</button>

            </div>

            <button class="btn-eliminar-item" data-id="${producto.id}">
                <i class="bi bi-trash"></i>
            </button>

        </div>
    `;

}

// ===========================
// CARRITO VACÍO
// ===========================

export function mostrarCarritoVacio() {

    if (!contenedorItems) return;

    contenedorItems.innerHTML = `
        <div class="carrito-vacio">
            <i class="bi bi-cart-x"></i>
            <p>Tu carrito está vacío.</p>
        </div>
    `;

}

// ===========================
// ACTUALIZAR CONTADOR
// ===========================

export function actualizarContador(carrito) {

    if (!contadorCarrito) return;

    contadorCarrito.textContent = calcularTotalItems(carrito);

}

// ===========================
// ACTUALIZAR SUBTOTAL
// ===========================

export function actualizarSubtotal(carrito) {

    const texto = formatearMoneda(calcularSubtotal(carrito));

    if (subtotalCarrito) subtotalCarrito.textContent = texto;

    if (totalHeader) totalHeader.textContent = texto;

}

// ===========================
// ABRIR / CERRAR PANEL
// ===========================

export function abrirCarrito() {

    panelCarrito?.classList.add("activo");

    overlay?.classList.add("activo");

}

export function cerrarCarrito() {

    panelCarrito?.classList.remove("activo");

    overlay?.classList.remove("activo");

}
