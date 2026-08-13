const conectarDB = require("../db");

async function crearUsuario(nombre, correo, password) {

    const connection = await conectarDB();

    const sql = `
        INSERT INTO usuarios(nombre, correo, password)
        VALUES (?, ?, ?)
    `;

    const [resultado] = await connection.execute(sql, [
        nombre,
        correo,
        password
    ]);

    await connection.end();

    return resultado;
}

async function buscarPorCorreo(correo) {

    const connection = await conectarDB();

    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
    `;

    const [rows] = await connection.execute(sql, [correo]);

    await connection.end();

    return rows[0];
}

// ===========================
// CONTAR USUARIOS
// ===========================

async function contarUsuarios() {

    const connection = await conectarDB();

    const [[{ total }]] = await connection.execute(
        `SELECT COUNT(*) AS total FROM usuarios`
    );

    await connection.end();

    return total;

}

// ===========================
// LISTAR USUARIOS (ADMIN)
// ===========================

async function obtenerUsuarios() {

    const connection = await conectarDB();

    const [filas] = await connection.execute(
        `SELECT id, nombre, correo, fecha_registro
         FROM usuarios
         ORDER BY fecha_registro DESC`
    );

    await connection.end();

    return filas;

}

module.exports = {
    crearUsuario,
    buscarPorCorreo,
    contarUsuarios,
    obtenerUsuarios
};