const botonCarrito = document.getElementById("abrirCarrito");
const cerrar = document.getElementById("cerrarCarrito");
const overlay = document.getElementById("carritoOverlay");
const contenedorItems = document.getElementById("carritoItems");

// ===========================
// INICIALIZAR EVENTOS
// ===========================
// callbacks: { onAgregar, onSumar, onRestar, onEliminar, onAbrir, onCerrar }

export function inicializarEventos(callbacks) {

    // Agregar producto (delegado, cubre toda la grilla de productos)

    document.addEventListener("click", e => {

        const boton = e.target.closest(".btn-agregar");

        if (!boton) return;

        callbacks.onAgregar({

            id: boton.dataset.id,
            nombre: boton.dataset.nombre,
            precio: Number(boton.dataset.precio),
            imagen: boton.dataset.imagen,
            categoria: boton.dataset.categoria,
            cantidad: 1

        });

    });

    // Sumar / restar / eliminar dentro del panel del carrito (delegado, los items se re-renderizan)

    if (contenedorItems) {

        contenedorItems.addEventListener("click", e => {

            const btnSumar = e.target.closest(".btn-sumar");
            const btnRestar = e.target.closest(".btn-restar");
            const btnEliminar = e.target.closest(".btn-eliminar-item");

            if (btnSumar) callbacks.onSumar(btnSumar.dataset.id);

            if (btnRestar) callbacks.onRestar(btnRestar.dataset.id);

            if (btnEliminar) callbacks.onEliminar(btnEliminar.dataset.id);

        });

    }

    // Abrir carrito

    if (botonCarrito) {

        botonCarrito.addEventListener("click", e => {

            e.preventDefault();

            callbacks.onAbrir();

        });

    }

    // Cerrar carrito

    if (cerrar) cerrar.addEventListener("click", callbacks.onCerrar);

    if (overlay) overlay.addEventListener("click", callbacks.onCerrar);

}
