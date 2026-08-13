const { Server } = require("socket.io");

let io = null;

// ===========================
// INICIALIZAR
// ===========================
// sessionMiddleware: la misma instancia de express-session que usa la app,
// para poder leer socket.request.session dentro de los eventos.

function inicializarSocket(server, sessionMiddleware) {

    io = new Server(server);

    io.engine.use(sessionMiddleware);

    io.on("connection", socket => {

        socket.on("unirseOrden", async ordenId => {

            const sesion = socket.request.session;

            if (!sesion || !sesion.usuario) return;

            // Reutiliza el modelo existente — evita que alguien escuche
            // los cambios de un pedido que no le pertenece.
            const ordenModel = require("../models/ordenModel");

            const orden = await ordenModel.obtenerOrdenConDetalle(ordenId);

            if (orden && orden.usuario_id === sesion.usuario.id) {

                socket.join(`orden-${ordenId}`);

            }

        });

    });

    return io;

}

// ===========================
// EMITIR CAMBIO DE ESTADO
// ===========================

function emitirCambioEstado(ordenId, datos) {

    if (!io) return;

    io.to(`orden-${ordenId}`).emit("estadoActualizado", { ordenId, ...datos });

}

module.exports = {
    inicializarSocket,
    emitirCambioEstado
};
