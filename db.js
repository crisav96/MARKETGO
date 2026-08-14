require("dotenv").config();

const mysql = require("mysql2/promise");

async function conectarDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "marketgo",
            ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
        });

        console.log("✅ Conectado correctamente a MySQL");

        return connection;

    } catch (error) {
        console.error("❌ Error al conectar a MySQL");
        console.error(error.message);
    }
}

module.exports = conectarDB;