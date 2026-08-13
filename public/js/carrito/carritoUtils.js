// ===========================
// FORMATEAR MONEDA
// ===========================

export function formatearMoneda(valor) {

    return `₡${Number(valor).toFixed(2)}`;

}

// ===========================
// BUSCAR PRODUCTO POR ID
// ===========================

export function buscarProducto(carrito, id) {

    return carrito.find(producto => producto.id === id);

}

// ===========================
// CALCULAR SUBTOTAL
// ===========================

export function calcularSubtotal(carrito) {

    return carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
    );

}

// ===========================
// CALCULAR TOTAL DE ITEMS
// ===========================

export function calcularTotalItems(carrito) {

    return carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );

}
