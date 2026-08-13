const conectarDB = require("../db");

// ===========================
// CONTAR CATEGORÍAS
// ===========================

async function contarCategorias() {

    const connection = await conectarDB();

    const [[{ total }]] = await connection.execute(
        `SELECT COUNT(*) AS total FROM categorias`
    );

    await connection.end();

    return total;

}

// ===========================
// LISTAR CATEGORÍAS
// ===========================

async function obtenerCategorias() {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT id, nombre FROM categorias ORDER BY nombre`
    );

    await connection.end();

    return filas;

}

// ===========================
// LISTAR CATEGORÍAS CON CONTEO DE PRODUCTOS (ADMIN)
// ===========================

async function obtenerCategoriasConConteo() {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT c.id, c.nombre, COUNT(p.id) AS totalProductos
         FROM categorias c
         LEFT JOIN productos p ON p.categoria_id = c.id
         GROUP BY c.id, c.nombre
         ORDER BY c.nombre`
    );

    await connection.end();

    return filas;

}

// ===========================
// OBTENER CATEGORÍA POR ID
// ===========================

async function obtenerCategoriaPorId(id) {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT id, nombre FROM categorias WHERE id = ?`,
        [id]
    );

    await connection.end();

    return filas[0];

}

// ===========================
// CREAR CATEGORÍA
// ===========================

async function crearCategoria(nombre) {

    const connection = await conectarDB();

    const [resultado] = await connection.execute(
        `INSERT INTO categorias (nombre) VALUES (?)`,
        [nombre]
    );

    await connection.end();

    return resultado.insertId;

}

// ===========================
// ACTUALIZAR CATEGORÍA
// ===========================

async function actualizarCategoria(id, nombre) {

    const connection = await conectarDB();

    await connection.execute(
        `UPDATE categorias SET nombre = ? WHERE id = ?`,
        [nombre, id]
    );

    await connection.end();

}

// ===========================
// ELIMINAR CATEGORÍA
// ===========================

async function eliminarCategoria(id) {

    const connection = await conectarDB();

    try {

        await connection.execute(`DELETE FROM categorias WHERE id = ?`, [id]);

    } finally {

        await connection.end();

    }

}

module.exports = {
    contarCategorias,
    obtenerCategorias,
    obtenerCategoriasConConteo,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
