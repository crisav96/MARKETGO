import {
    leerCarrito,
    agregarProducto,
    incrementarCantidad,
    decrementarCantidad,
    eliminarProducto
} from "./carritoStorage.js";

import { renderizarCarrito, abrirCarrito, cerrarCarrito } from "./carritoUI.js";
import { inicializarEventos } from "./carritoEventos.js";
import { mostrarToast } from "../ui/toast.js";

// ===========================
// ESTADO
// ===========================

let carrito = leerCarrito();

function refrescar() {

    renderizarCarrito(carrito);

}

// ===========================
// EVENTOS -> STORAGE -> UI
// ===========================

inicializarEventos({

    onAgregar(producto) {

        carrito = agregarProducto(carrito, producto);
        refrescar();

        mostrarToast(`${producto.nombre} se agregó al carrito`, "exito");

    },

    onSumar(id) {

        carrito = incrementarCantidad(carrito, id);
        refrescar();

    },

    onRestar(id) {

        carrito = decrementarCantidad(carrito, id);
        refrescar();

    },

    onEliminar(id) {

        carrito = eliminarProducto(carrito, id);
        refrescar();

    },

    onAbrir: abrirCarrito,

    onCerrar: cerrarCarrito

});

// ===========================
// RENDER INICIAL
// ===========================

refrescar();
