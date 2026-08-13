const productoModel = require("../models/productoModel");
const categoriaModel = require("../models/categoriaModel");
const usuarioModel = require("../models/usuarioModel");
const ordenModel = require("../models/ordenModel");
const setFlash = require("../helpers/flashHelper");
const { claseEstado, formatearFecha } = require("../helpers/formatoHelper");

// ===========================
// LOGOUT ADMIN
// ===========================

const logout = (req, res) => {

    delete req.session.esAdmin;

    res.redirect("/");

};

// ===========================
// DASHBOARD
// ===========================

const dashboard = async (req, res) => {

    try {

        const [
            totalProductos,
            totalCategorias,
            totalUsuarios,
            totalOrdenes,
            totalVentas,
            ultimasOrdenes
        ] = await Promise.all([
            productoModel.contarProductos(),
            categoriaModel.contarCategorias(),
            usuarioModel.contarUsuarios(),
            ordenModel.contarOrdenes(),
            ordenModel.obtenerVentasTotales(),
            ordenModel.obtenerUltimasOrdenes(5)
        ]);

        const ultimasOrdenesFormateadas = ultimasOrdenes.map(orden => ({
            ...orden,
            fechaFormateada: formatearFecha(orden.fecha),
            estadoClase: claseEstado(orden.estado)
        }));

        res.render("admin/dashboard", {
            layout: "admin",
            titulo: "Dashboard",
            totalProductos,
            totalCategorias,
            totalUsuarios,
            totalOrdenes,
            totalVentas,
            ultimasOrdenes: ultimasOrdenesFormateadas
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar el panel de administración.");

        res.redirect("/auth/login");

    }

};

module.exports = {
    logout,
    dashboard
};
