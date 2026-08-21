const conectarDB = require("../db");

async function obtenerProductos() {

    const connection = await conectarDB();

    const sql = `
        SELECT
            p.id,
            p.nombre,
            p.descripcion,
            p.precio,
            p.precio_oferta AS precioOferta,
            p.oferta_activa AS ofertaActiva,
            p.stock,
            p.imagen,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
        ON p.categoria_id = c.id
        ORDER BY p.nombre;
    `;

    const [rows] = await connection.execute(sql);

    await connection.end();

    return rows;

}

async function obtenerOfertas(limite = null) {

    const connection = await conectarDB();

    // mysql2 no soporta "LIMIT ?" como parámetro preparado (ver ordenModel.obtenerUltimasOrdenes
    // para el mismo caso), así que se valida como entero seguro y se interpola directo.
    const limiteSeguro = Number.isInteger(limite) && limite > 0 ? limite : null;
    const limiteSQL = limiteSeguro ? `LIMIT ${limiteSeguro}` : "";

    const [filas] = await connection.execute(
        `SELECT p.id, p.nombre, p.descripcion, p.precio,
                p.precio_oferta AS precioOferta,
                p.oferta_activa AS ofertaActiva,
                p.stock, p.imagen, c.nombre AS categoria
         FROM productos p
         INNER JOIN categorias c ON p.categoria_id = c.id
         WHERE p.oferta_activa = TRUE
           AND p.precio_oferta IS NOT NULL
           AND p.precio_oferta < p.precio
           AND p.stock > 0
         ORDER BY (p.precio - p.precio_oferta) DESC, p.nombre
         ${limiteSQL}`
    );

    await connection.end();

    return filas;

}

// ===========================
// DETALLE DE UN PRODUCTO (CLIENTE)
// ===========================

async function obtenerProductoDetalle(id) {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT p.id, p.nombre, p.descripcion, p.precio,
            p.precio_oferta AS precioOferta,
            p.oferta_activa AS ofertaActiva,
            p.stock, p.imagen, c.nombre AS categoria
         FROM productos p
         INNER JOIN categorias c ON p.categoria_id = c.id
         WHERE p.id = ?`,
        [id]
    );

    await connection.end();

    return filas[0];

}

// ===========================
// CONTAR PRODUCTOS
// ===========================

async function contarProductos() {

    const connection = await conectarDB();

    const [[{ total }]] = await connection.execute(
        `SELECT COUNT(*) AS total FROM productos`
    );

    await connection.end();

    return total;

}

// ===========================
// LISTAR PRODUCTOS (ADMIN) — con búsqueda y filtro por categoría
// ===========================

async function obtenerProductosAdmin({ buscar, categoriaId } = {}) {

    const connection = await conectarDB();

    const condiciones = [];
    const valores = [];

    if (buscar) {
        condiciones.push("p.nombre LIKE ?");
        valores.push(`%${buscar}%`);
    }

    if (categoriaId) {
        condiciones.push("p.categoria_id = ?");
        valores.push(categoriaId);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";

    const [filas] = await connection.execute(
        `SELECT
            p.id, p.nombre, p.descripcion, p.precio, p.precio_oferta AS precioOferta,
            p.oferta_activa AS ofertaActiva, p.stock, p.imagen, p.categoria_id,
            c.nombre AS categoria
         FROM productos p
         INNER JOIN categorias c ON p.categoria_id = c.id
         ${where}
         ORDER BY p.nombre`,
        valores
    );

    await connection.end();

    return filas;

}

// ===========================
// OBTENER PRODUCTO POR ID
// ===========================

async function obtenerProductoPorId(id) {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT id, nombre, descripcion, precio, precio_oferta AS precioOferta,
            oferta_activa AS ofertaActiva, stock, imagen, categoria_id
         FROM productos
         WHERE id = ?`,
        [id]
    );

    await connection.end();

    return filas[0];

}

// ===========================
// CREAR PRODUCTO
// ===========================

async function crearProducto({ nombre, descripcion, precio, precioOferta, stock, categoriaId, imagen }) {

    const connection = await conectarDB();

    const [resultado] = await connection.execute(
        `INSERT INTO productos (categoria_id, nombre, descripcion, precio, precio_oferta, oferta_activa, stock, imagen)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [categoriaId, nombre, descripcion, precio, precioOferta, precioOferta !== null, stock, imagen]
    );

    await connection.end();

    return resultado.insertId;

}

// ===========================
// ACTUALIZAR PRODUCTO
// ===========================

async function actualizarProducto(id, { nombre, descripcion, precio, precioOferta, stock, categoriaId, imagen }) {

    const connection = await conectarDB();

    if (imagen) {

        await connection.execute(
            `UPDATE productos
            SET categoria_id = ?, nombre = ?, descripcion = ?, precio = ?, precio_oferta = ?, oferta_activa = ?, stock = ?, imagen = ?
             WHERE id = ?`,
            [categoriaId, nombre, descripcion, precio, precioOferta, precioOferta !== null, stock, imagen, id]
        );

    } else {

        await connection.execute(
            `UPDATE productos
            SET categoria_id = ?, nombre = ?, descripcion = ?, precio = ?, precio_oferta = ?, oferta_activa = ?, stock = ?
             WHERE id = ?`,
            [categoriaId, nombre, descripcion, precio, precioOferta, precioOferta !== null, stock, id]
        );

    }

    await connection.end();

}

// ===========================
// ACTUALIZAR OFERTA (ADMIN)
// ===========================

async function actualizarOferta(id, { precioOferta, ofertaActiva }) {

    const connection = await conectarDB();

    await connection.execute(
        `UPDATE productos
         SET precio_oferta = ?, oferta_activa = ?
         WHERE id = ?`,
        [precioOferta, ofertaActiva, id]
    );

    await connection.end();

}

// ===========================
// ELIMINAR PRODUCTO
// ===========================

async function eliminarProducto(id) {

    const connection = await conectarDB();

    try {

        await connection.execute(`DELETE FROM productos WHERE id = ?`, [id]);

    } finally {

        await connection.end();

    }

}

// ===========================
// CONTAR PRODUCTOS DE UNA CATEGORÍA
// ===========================

async function contarProductosPorCategoria(categoriaId) {

    const connection = await conectarDB();

    const [[{ total }]] = await connection.execute(
        `SELECT COUNT(*) AS total FROM productos WHERE categoria_id = ?`,
        [categoriaId]
    );

    await connection.end();

    return total;

}

// ===========================
// CATÁLOGO (CLIENTE) — búsqueda, categorías (múltiples), precio máximo y orden
// ===========================

const ORDENES_VALIDOS = {
    "precio-asc": "p.precio ASC",
    "precio-desc": "p.precio DESC",
    "nombre": "p.nombre ASC"
};

async function obtenerProductosCatalogo({ buscar, categorias, precioMax, orden } = {}) {

    const connection = await conectarDB();

    const condiciones = [];
    const valores = [];

    if (buscar) {
        condiciones.push("p.nombre LIKE ?");
        valores.push(`%${buscar}%`);
    }

    if (categorias && categorias.length > 0) {
        condiciones.push(`p.categoria_id IN (${categorias.map(() => "?").join(",")})`);
        valores.push(...categorias);
    }

    if (precioMax) {
        condiciones.push("p.precio <= ?");
        valores.push(precioMax);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
    const ordenSQL = ORDENES_VALIDOS[orden] || ORDENES_VALIDOS.nombre;

    const [filas] = await connection.execute(
        `SELECT p.id, p.nombre, p.descripcion, p.precio,
            p.precio_oferta AS precioOferta,
            p.oferta_activa AS ofertaActiva,
            p.stock, p.imagen, c.nombre AS categoria
         FROM productos p
         INNER JOIN categorias c ON p.categoria_id = c.id
         ${where}
         ORDER BY ${ordenSQL}`,
        valores
    );

    await connection.end();

    return filas;

}

module.exports = {

    obtenerProductos,
    obtenerProductoDetalle,
    contarProductos,
    obtenerProductosAdmin,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    contarProductosPorCategoria,
    obtenerProductosCatalogo,
    obtenerOfertas,
    actualizarOferta

};