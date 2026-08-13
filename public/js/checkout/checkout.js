import { leerCarrito, vaciarCarrito } from "../carrito/carritoStorage.js";
import { calcularSubtotal, formatearMoneda } from "../carrito/carritoUtils.js";
import { post } from "../services/api.js";
import { mostrarToast } from "../ui/toast.js";

const COSTO_ENVIO = 2.00;

const contenedorItems = document.getElementById("checkoutItems");
const subtotalEl = document.getElementById("checkoutSubtotal");
const envioEl = document.getElementById("checkoutEnvio");
const totalEl = document.getElementById("checkoutTotal");
const formulario = document.getElementById("formCheckout");

const carrito = leerCarrito();

// ===========================
// RENDERIZAR RESUMEN
// ===========================

function crearFilaItem(producto) {

    const fila = document.createElement("div");
    fila.className = "checkout-item";

    const info = document.createElement("div");
    info.className = "checkout-item-info";

    const icono = document.createElement("i");
    icono.className = "bi bi-basket2-fill";

    const textos = document.createElement("div");

    const nombre = document.createElement("span");
    nombre.className = "checkout-item-nombre";
    nombre.textContent = producto.nombre;

    const cantidad = document.createElement("small");
    cantidad.className = "checkout-item-cantidad";
    cantidad.textContent = `x${producto.cantidad}`;

    textos.append(nombre, cantidad);
    info.append(icono, textos);

    const subtotal = document.createElement("strong");
    subtotal.textContent = formatearMoneda(producto.precio * producto.cantidad);

    fila.append(info, subtotal);

    return fila;

}

function renderizarResumen() {

    if (!contenedorItems) return;

    contenedorItems.innerHTML = "";

    if (carrito.length === 0) {

        const vacio = document.createElement("p");
        vacio.className = "checkout-vacio";
        vacio.textContent = "Tu carrito está vacío.";

        contenedorItems.appendChild(vacio);

        const boton = formulario?.querySelector("button[type=submit]");
        if (boton) boton.disabled = true;

        return;

    }

    carrito.forEach(producto => contenedorItems.appendChild(crearFilaItem(producto)));

}

function actualizarTotales() {

    const subtotal = calcularSubtotal(carrito);
    const envio = carrito.length === 0 ? 0 : COSTO_ENVIO;

    if (subtotalEl) subtotalEl.textContent = formatearMoneda(subtotal);
    if (envioEl) envioEl.textContent = formatearMoneda(envio);
    if (totalEl) totalEl.textContent = formatearMoneda(subtotal + envio);

}

renderizarResumen();
actualizarTotales();

// ===========================
// CONFIRMAR COMPRA
// ===========================

if (formulario) {

    formulario.addEventListener("submit", async e => {

        e.preventDefault();

        if (carrito.length === 0) return;

        const datos = new FormData(formulario);

        const provincia = datos.get("provincia");
        const canton = datos.get("canton").trim();
        const distrito = datos.get("distrito").trim();
        const direccionExacta = datos.get("direccionExacta").trim();

        if (!provincia || !canton || !distrito || !direccionExacta) {

            mostrarToast("Completa todos los datos de entrega.", "advertencia");

            return;

        }

        const direccion = `${provincia}, ${canton}, ${distrito}. ${direccionExacta}`;

        const productos = carrito.map(producto => ({
            id: producto.id,
            cantidad: producto.cantidad
        }));

        const boton = formulario.querySelector("button[type=submit]");

        boton.disabled = true;

        try {

            const respuesta = await post("/checkout", {
                direccion,
                telefono: datos.get("telefono").trim(),
                metodoPago: datos.get("metodoPago"),
                productos
            });

            if (respuesta.exito) {

                vaciarCarrito();

                window.location.href = `/checkout/confirmacion/${respuesta.ordenId}`;

            } else {

                mostrarToast(respuesta.mensaje || "No fue posible procesar el pedido.", "error");

                boton.disabled = false;

            }

        } catch (error) {

            mostrarToast("Error de conexión. Intenta de nuevo.", "error");

            boton.disabled = false;

        }

    });

}
