const ordenModel = require("../models/ordenModel");
const setFlash = require("../helpers/flashHelper");
const { claseEstado, formatearFecha } = require("../helpers/formatoHelper");
const { emitirCambioEstado } = require("../helpers/socket");
const { enviarCorreoCambioEstado } = require("../helpers/mailer");

// ===========================
// LISTAR
// ===========================

const listar = async (req, res) => {

    try {

        const buscar = (req.query.buscar || "").trim();
        const estado = req.query.estado || "";

        const ordenes = await ordenModel.obtenerOrdenesAdmin({ buscar, estado });

        const ordenesFormateadas = ordenes.map(orden => ({
            ...orden,
            fechaFormateada: formatearFecha(orden.fecha),
            estadoClase: claseEstado(orden.estado)
        }));

        const estados = ordenModel.ESTADOS_VALIDOS.map(valor => ({
            valor,
            seleccionado: valor === estado
        }));

        res.render("admin/ordenes/listar", {
            layout: "admin",
            titulo: "Pedidos",
            ordenes: ordenesFormateadas,
            estados,
            buscar
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar los pedidos.");

        res.redirect("/admin");

    }

};

// ===========================
// VER DETALLE
// ===========================

const verDetalle = async (req, res) => {

    try {

        const orden = await ordenModel.obtenerOrdenConDetalle(req.params.id);

        if (!orden) {

            setFlash(req, "advertencia", "Ese pedido no existe.");

            return res.redirect("/admin/ordenes");

        }

        orden.fechaFormateada = formatearFecha(orden.fecha);
        orden.estadoClase = claseEstado(orden.estado);

        orden.productos = orden.productos.map(producto => ({
            ...producto,
            subtotal: (Number(producto.precio) * producto.cantidad).toFixed(2)
        }));

        const estados = ordenModel.ESTADOS_VALIDOS.map(valor => ({
            valor,
            seleccionado: valor === orden.estado
        }));

        res.render("admin/ordenes/detalle", {
            layout: "admin",
            titulo: `Pedido #${orden.id}`,
            orden,
            estados
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar el pedido.");

        res.redirect("/admin/ordenes");

    }

};

// ===========================
// CAMBIAR ESTADO
// ===========================

const cambiarEstado = async (req, res) => {

    const { id } = req.params;

    try {

        const { estado } = req.body;

        if (!ordenModel.ESTADOS_VALIDOS.includes(estado)) {

            setFlash(req, "error", "Estado inválido.");

            return res.redirect(`/admin/ordenes/${id}`);

        }

        const orden = await ordenModel.obtenerOrdenConDetalle(id);

        if (!orden) {

            setFlash(req, "advertencia", "Ese pedido no existe.");

            return res.redirect("/admin/ordenes");

        }

        await ordenModel.actualizarEstado(id, estado);

        emitirCambioEstado(id, {
            estado,
            estadoClase: claseEstado(estado)
        });

        try {

            await enviarCorreoCambioEstado({
                correo: orden.correoCliente,
                nombreCliente: orden.nombreCliente,
                ordenId: id,
                estado
            });

        } catch (errorCorreo) {

            console.error("No fue posible enviar el correo de notificación:", errorCorreo.message);

        }

        setFlash(req, "exito", "Estado del pedido actualizado. Se notificó al cliente por correo.");

        res.redirect(`/admin/ordenes/${id}`);

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible actualizar el estado.");

        res.redirect(`/admin/ordenes/${id}`);

    }

};

module.exports = {
    listar,
    verDetalle,
    cambiarEstado
};
