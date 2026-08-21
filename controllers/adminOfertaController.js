const productoModel = require("../models/productoModel");
const setFlash = require("../helpers/flashHelper");

// ===========================
// LISTAR (todos los productos, con su estado de oferta)
// ===========================

const listar = async (req, res) => {

    try {

        const buscar = (req.query.buscar || "").trim();

        const productos = await productoModel.obtenerProductosAdmin({ buscar });

        res.render("admin/ofertas/listar", {
            layout: "admin",
            titulo: "Ofertas",
            productos,
            buscar
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar los productos.");

        res.redirect("/admin");

    }

};

// ===========================
// ACTUALIZAR OFERTA DE UN PRODUCTO
// ===========================

const actualizar = async (req, res) => {

    const { id } = req.params;

    try {

        const producto = await productoModel.obtenerProductoPorId(id);

        if (!producto) {

            setFlash(req, "advertencia", "Ese producto no existe.");

            return res.redirect("/admin/ofertas");

        }

        const activa = req.body.ofertaActiva === "on";
        const precioOfertaTexto = (req.body.precioOferta || "").trim();

        let precioOfertaFinal = null;

        if (precioOfertaTexto) {

            const numero = Number(precioOfertaTexto);

            if (!(numero > 0 && numero < Number(producto.precio))) {

                setFlash(req, "error", "El precio de oferta debe ser mayor a cero y menor al precio normal.");

                return res.redirect("/admin/ofertas");

            }

            precioOfertaFinal = numero;

        }

        if (activa && precioOfertaFinal === null) {

            setFlash(req, "error", "Indica un precio de oferta antes de activarla.");

            return res.redirect("/admin/ofertas");

        }

        await productoModel.actualizarOferta(id, {
            precioOferta: precioOfertaFinal,
            ofertaActiva: activa
        });

        setFlash(
            req,
            "exito",
            activa ? "Oferta activada correctamente." : "Oferta guardada/desactivada."
        );

        res.redirect("/admin/ofertas");

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible actualizar la oferta.");

        res.redirect("/admin/ofertas");

    }

};

module.exports = {
    listar,
    actualizar
};
