const CLAVE_CARRITO = "marketgo_carrito";

// ===========================
// LEER CARRITO
// ===========================

export function leerCarrito() {

    const datos = localStorage.getItem(CLAVE_CARRITO);

    return datos ? JSON.parse(datos) : [];

}

// ===========================
// GUARDAR CARRITO
// ===========================

export function guardarCarrito(carrito) {

    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));

}

// ===========================
// AGREGAR PRODUCTO
// ===========================

export function agregarProducto(carrito, producto) {

    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {

        existente.cantidad += producto.cantidad;

    } else {

        carrito.push(producto);

    }

    guardarCarrito(carrito);

    return carrito;

}

// ===========================
// INCREMENTAR CANTIDAD
// ===========================

export function incrementarCantidad(carrito, id) {

    const producto = carrito.find(item => item.id === id);

    if (producto) {

        producto.cantidad++;

    }

    guardarCarrito(carrito);

    return carrito;

}

// ===========================
// DECREMENTAR CANTIDAD
// ===========================

export function decrementarCantidad(carrito, id) {

    const producto = carrito.find(item => item.id === id);

    if (!producto) {

        return carrito;

    }

    producto.cantidad--;

    const actualizado = producto.cantidad <= 0
        ? carrito.filter(item => item.id !== id)
        : carrito;

    guardarCarrito(actualizado);

    return actualizado;

}

// ===========================
// ELIMINAR PRODUCTO
// ===========================

export function eliminarProducto(carrito, id) {

    const actualizado = carrito.filter(item => item.id !== id);

    guardarCarrito(actualizado);

    return actualizado;

}

// ===========================
// VACIAR CARRITO
// ===========================

export function vaciarCarrito() {

    localStorage.removeItem(CLAVE_CARRITO);

    return [];

}
