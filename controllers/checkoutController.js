const checkoutModel = require("../models/checkoutModel");

const METODOS_PAGO_VALIDOS = ["Tarjeta", "SINPE Móvil", "Contra entrega"];

// ===========================
// MOSTRAR PÁGINA DE CHECKOUT
// ===========================

const mostrarCheckout = (req, res) => {

    res.render("cliente/checkout", {
        titulo: "Finalizar compra"
    });

};

// ===========================
// CONFIRMAR COMPRA
// ===========================

const confirmarCompra = async (req, res) => {

    try {

        const { direccion, telefono, metodoPago, productos } = req.body;

        const usuarioId = req.session.usuario.id;

        if (!direccion || !direccion.trim()) {

            return res.status(400).json({
                exito: false,
                mensaje: "La dirección es obligatoria."
            });

        }

        if (!Array.isArray(productos) || productos.length === 0) {

            return res.status(400).json({
                exito: false,
                mensaje: "El carrito está vacío."
            });

        }

        const metodoPagoValido = METODOS_PAGO_VALIDOS.includes(metodoPago)
            ? metodoPago
            : "Contra entrega";

        const resultado = await checkoutModel.crearOrden(
            usuarioId,
            {
                direccion: direccion.trim(),
                telefono: telefono ? telefono.trim() : null,
                metodoPago: metodoPagoValido
            },
            productos
        );

        res.json({
            exito: true,
            ordenId: resultado.ordenId
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            exito: false,
            mensaje: error.message || "No fue posible procesar el pedido."
        });

    }

};

// ===========================
// MOSTRAR CONFIRMACIÓN
// ===========================

const mostrarConfirmacion = async (req, res) => {

    const orden = await checkoutModel.obtenerOrdenPorId(req.params.id);

    if (!orden || orden.usuario_id !== req.session.usuario.id) {

        return res.redirect("/");

    }

    res.render("cliente/confirmacion", {
        titulo: "Pedido confirmado",
        orden
    });

};

module.exports = {
    mostrarCheckout,
    confirmarCompra,
    mostrarConfirmacion
};
