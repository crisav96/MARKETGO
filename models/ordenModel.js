const conectarDB = require("../db");

const ESTADOS_VALIDOS = ["Pendiente", "Preparando", "En camino", "Entregado"];

// ===========================
// ÓRDENES DE UN USUARIO (HISTORIAL)
// ===========================

async function obtenerOrdenesPorUsuario(usuarioId) {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT id, fecha, total, estado
         FROM ordenes
         WHERE usuario_id = ?
         ORDER BY fecha DESC`,
        [usuarioId]
    );

    await connection.end();

    return filas;

}

// ===========================
// ORDEN CON DETALLE (CABECERA + PRODUCTOS)
// ===========================

async function obtenerOrdenConDetalle(id) {

    const connection = await conectarDB();

    const [ordenes] = await connection.execute(
        `SELECT
            o.id, o.usuario_id, o.direccion, o.telefono, o.metodo_pago, o.total, o.estado, o.fecha,
            u.nombre AS nombreCliente, u.correo AS correoCliente
         FROM ordenes o
         INNER JOIN usuarios u ON o.usuario_id = u.id
         WHERE o.id = ?`,
        [id]
    );

    const orden = ordenes[0];

    if (!orden) {

        await connection.end();

        return null;

    }

    const [productos] = await connection.execute(
        `SELECT
            od.cantidad,
            od.precio,
            p.nombre,
            p.imagen
         FROM orden_detalle od
         INNER JOIN productos p ON od.producto_id = p.id
         WHERE od.orden_id = ?`,
        [id]
    );

    await connection.end();

    orden.productos = productos;

    return orden;

}

// ===========================
// CONTAR ÓRDENES
// ===========================

async function contarOrdenes() {

    const connection = await conectarDB();

    const [[{ total }]] = await connection.execute(
        `SELECT COUNT(*) AS total FROM ordenes`
    );

    await connection.end();

    return total;

}

// ===========================
// VENTAS TOTALES
// ===========================

async function obtenerVentasTotales() {

    const connection = await conectarDB();

    const [[{ total }]] = await connection.execute(
        `SELECT COALESCE(SUM(total), 0) AS total FROM ordenes`
    );

    await connection.end();

    return Number(total).toFixed(2);

}

// ===========================
// ÚLTIMAS ÓRDENES (ADMIN)
// ===========================

async function obtenerUltimasOrdenes(limite) {

    // mysql2 no soporta bien "LIMIT ?" como parámetro preparado,
    // así que se valida como entero seguro y se interpola directo.
    const limiteSeguro = Number.isInteger(limite) && limite > 0 ? limite : 5;

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT
            o.id,
            o.total,
            o.estado,
            o.fecha,
            u.nombre AS nombreCliente
         FROM ordenes o
         INNER JOIN usuarios u ON o.usuario_id = u.id
         ORDER BY o.fecha DESC
         LIMIT ${limiteSeguro}`
    );

    await connection.end();

    return filas;

}

// ===========================
// LISTAR ÓRDENES (ADMIN) — con búsqueda y filtro por estado
// ===========================

async function obtenerOrdenesAdmin({ buscar, estado } = {}) {

    const connection = await conectarDB();

    const condiciones = [];
    const valores = [];

    if (buscar) {

        const comoNumero = Number(buscar);

        if (Number.isInteger(comoNumero)) {

            condiciones.push("(u.nombre LIKE ? OR u.correo LIKE ? OR o.id = ?)");
            valores.push(`%${buscar}%`, `%${buscar}%`, comoNumero);

        } else {

            condiciones.push("(u.nombre LIKE ? OR u.correo LIKE ?)");
            valores.push(`%${buscar}%`, `%${buscar}%`);

        }

    }

    if (estado) {
        condiciones.push("o.estado = ?");
        valores.push(estado);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";

    const [filas] = await connection.execute(
        `SELECT
            o.id, o.total, o.estado, o.fecha,
            u.nombre AS nombreCliente, u.correo AS correoCliente
         FROM ordenes o
         INNER JOIN usuarios u ON o.usuario_id = u.id
         ${where}
         ORDER BY o.fecha DESC`,
        valores
    );

    await connection.end();

    return filas;

}

// ===========================
// ACTUALIZAR ESTADO DE UNA ORDEN
// ===========================

async function actualizarEstado(id, estado) {

    if (!ESTADOS_VALIDOS.includes(estado)) {

        throw new Error("Estado inválido.");

    }

    const connection = await conectarDB();

    await connection.execute(
        `UPDATE ordenes SET estado = ? WHERE id = ?`,
        [estado, id]
    );

    await connection.end();

}

module.exports = {
    ESTADOS_VALIDOS,
    obtenerOrdenesPorUsuario,
    obtenerOrdenConDetalle,
    contarOrdenes,
    obtenerVentasTotales,
    obtenerUltimasOrdenes,
    obtenerOrdenesAdmin,
    actualizarEstado
};
