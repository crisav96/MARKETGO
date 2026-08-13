const productoModel = require("../models/productoModel");
const categoriaModel = require("../models/categoriaModel");
const setFlash = require("../helpers/flashHelper");

const listarProductos = async (req, res) => {

    try {

        const buscar = (req.query.buscar || "").trim();

        const categoriasSeleccionadas = Array.isArray(req.query.categoria)
            ? req.query.categoria
            : req.query.categoria
                ? [req.query.categoria]
                : [];

        const precioMax = req.query.precioMax ? Number(req.query.precioMax) : null;

        const orden = req.query.orden || "nombre";

        const [productos, categoriasDisponibles] = await Promise.all([
            productoModel.obtenerProductosCatalogo({
                buscar,
                categorias: categoriasSeleccionadas,
                precioMax,
                orden
            }),
            categoriaModel.obtenerCategorias()
        ]);

        const categorias = categoriasDisponibles.map(categoria => ({
            ...categoria,
            marcada: categoriasSeleccionadas.includes(String(categoria.id))
        }));

        res.render("cliente/productos", {

            titulo: "Productos",

            productos,
            categorias,
            buscar,
            precioMax: precioMax || 10,
            ordenNombre: orden === "nombre",
            ordenPrecioAsc: orden === "precio-asc",
            ordenPrecioDesc: orden === "precio-desc"

        });

    } catch (error) {

        console.error(error);

        res.send("Error al cargar los productos.");

    }

};

// ===========================
// DETALLE DE UN PRODUCTO
// ===========================

const verDetalle = async (req, res) => {

    try {

        const producto = await productoModel.obtenerProductoDetalle(req.params.id);

        if (!producto) {

            setFlash(req, "advertencia", "Ese producto no existe.");

            return res.redirect("/productos");

        }

        res.render("cliente/detalleProducto", {

            titulo: producto.nombre,

            producto

        });

    } catch (error) {

        console.error(error);

        res.send("Error al cargar el producto.");

    }

};

module.exports = {

    listarProductos,
    verDetalle

};
