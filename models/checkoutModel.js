const conectarDB = require("../db");

// Debe coincidir con COSTO_ENVIO en public/js/checkout/checkout.js (ahí solo se muestra, aquí es la fuente real)
const COSTO_ENVIO = 2.00;

// ===========================
// CREAR ORDEN (TRANSACCIONAL)
// ===========================
// datosOrden: { direccion, telefono, metodoPago }
// items: [{ id, cantidad }]

async function crearOrden(usuarioId, datosOrden, items) {

    const { direccion, telefono, metodoPago } = datosOrden;

    const connection = await conectarDB();

    try {

        await connection.beginTransaction();

        const detalles = [];

        for (const item of items) {

            const [filas] = await connection.execute(
                `SELECT id, nombre, precio, precio_oferta AS precioOferta,
                        oferta_activa AS ofertaActiva, stock
                 FROM productos
                 WHERE id = ?
                 FOR UPDATE`,
                [item.id]
            );

            const producto = filas[0];

            if (!producto) {
                throw new Error("Uno de los productos ya no está disponible.");
            }

            const cantidad = Number(item.cantidad);

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                throw new Error(`Cantidad inválida para ${producto.nombre}.`);
            }

            if (producto.stock < cantidad) {
                throw new Error(`Stock insuficiente para ${producto.nombre}.`);
            }

            // Misma regla que productoModel.obtenerOfertas: solo se respeta el precio de
            // oferta si está activa, tiene valor y es menor al precio normal.
            const hayOfertaValida = producto.ofertaActiva
                && producto.precioOferta !== null
                && Number(producto.precioOferta) < Number(producto.precio);

            const precioFinal = hayOfertaValida ? producto.precioOferta : producto.precio;

            detalles.push({
                productoId: producto.id,
                cantidad,
                precio: precioFinal
            });

        }

        const total = detalles.reduce(
            (suma, detalle) => suma + detalle.precio * detalle.cantidad,
            0
        ) + COSTO_ENVIO;

        const [resultadoOrden] = await connection.execute(
            `INSERT INTO ordenes (usuario_id, direccion, telefono, metodo_pago, total, estado)
             VALUES (?, ?, ?, ?, ?, 'Pendiente')`,
            [usuarioId, direccion, telefono, metodoPago, total]
        );

        const ordenId = resultadoOrden.insertId;

        for (const detalle of detalles) {

            await connection.execute(
                `INSERT INTO orden_detalle (orden_id, producto_id, cantidad, precio)
                 VALUES (?, ?, ?, ?)`,
                [ordenId, detalle.productoId, detalle.cantidad, detalle.precio]
            );

            await connection.execute(
                `UPDATE productos
                 SET stock = stock - ?
                 WHERE id = ?`,
                [detalle.cantidad, detalle.productoId]
            );

        }

        await connection.commit();

        return { ordenId };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        await connection.end();

    }

}

// ===========================
// OBTENER ORDEN POR ID
// ===========================

async function obtenerOrdenPorId(id) {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT id, usuario_id, direccion, telefono, metodo_pago, total, estado, fecha
         FROM ordenes
         WHERE id = ?`,
        [id]
    );

    await connection.end();

    return filas[0];

}

module.exports = {
    crearOrden,
    obtenerOrdenPorId
};
