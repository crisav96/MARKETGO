const ordenModel = require("../models/ordenModel");
const setFlash = require("../helpers/flashHelper");
const { claseEstado, formatearFecha } = require("../helpers/formatoHelper");

// ===========================
// HISTORIAL DE PEDIDOS
// ===========================

const historial = async (req, res) => {

    try {

        const ordenes = await ordenModel.obtenerOrdenesPorUsuario(req.session.usuario.id);

        const ordenesFormateadas = ordenes.map(orden => ({
            ...orden,
            fechaFormateada: formatearFecha(orden.fecha),
            estadoClase: claseEstado(orden.estado)
        }));

        res.render("cliente/historialPedidos", {
            titulo: "Mis pedidos",
            ordenes: ordenesFormateadas
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar tus pedidos.");

        res.redirect("/");

    }

};

// ===========================
// DETALLE DE UN PEDIDO
// ===========================

const detalle = async (req, res) => {

    try {

        const orden = await ordenModel.obtenerOrdenConDetalle(req.params.id);

        if (!orden || orden.usuario_id !== req.session.usuario.id) {

            setFlash(req, "advertencia", "Ese pedido no existe o no te pertenece.");

            return res.redirect("/");

        }

        orden.fechaFormateada = formatearFecha(orden.fecha);
        orden.estadoClase = claseEstado(orden.estado);

        orden.productos = orden.productos.map(producto => ({
            ...producto,
            subtotal: (Number(producto.precio) * producto.cantidad).toFixed(2)
        }));

        res.render("cliente/detallePedido", {
            titulo: `Pedido #${orden.id}`,
            orden
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar el pedido.");

        res.redirect("/ordenes/historial");

    }

};

module.exports = {
    historial,
    detalle
};
