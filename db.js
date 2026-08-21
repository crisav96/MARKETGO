require("dotenv").config();

const mysql = require("mysql2/promise");

// Pool en vez de una conexión nueva por consulta: evita el costo de reconectar
// en cada request y, sobre todo, acota cuántas conexiones puede llegar a dejar
// abiertas la app si una consulta falla a medio camino (antes, sin pool, ese
// escenario podía ir agotando las conexiones del servidor MySQL sin límite).
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "marketgo",
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
    waitForConnections: true,
    connectionLimit: 10
});

async function conectarDB() {
    try {
        const connection = await pool.getConnection();

        // El resto del proyecto llama a connection.end() al terminar, como si
        // fuera una conexión suelta. Con un pool, "terminar" debe significar
        // devolverla al pool (release), no destruirla (end) — se redirige acá
        // para no tener que tocar cada modelo.
        connection.end = () => connection.release();

        return connection;

    } catch (error) {
        console.error("❌ Error al conectar a MySQL");
        console.error(error.message);
    }
}

module.exports = conectarDB;