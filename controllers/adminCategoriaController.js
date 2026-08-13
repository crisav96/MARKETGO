const categoriaModel = require("../models/categoriaModel");
const productoModel = require("../models/productoModel");
const setFlash = require("../helpers/flashHelper");

// ===========================
// LISTAR
// ===========================

const listar = async (req, res) => {

    try {

        const categorias = await categoriaModel.obtenerCategoriasConConteo();

        res.render("admin/categorias/listar", {
            layout: "admin",
            titulo: "Categorías",
            categorias
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar las categorías.");

        res.redirect("/admin");

    }

};

// ===========================
// FORMULARIO NUEVA
// ===========================

const formNuevo = (req, res) => {

    res.render("admin/categorias/form", {
        layout: "admin",
        titulo: "Nueva categoría"
    });

};

// ===========================
// CREAR
// ===========================

const crear = async (req, res) => {

    try {

        const { nombre } = req.body;

        if (!nombre || !nombre.trim()) {

            setFlash(req, "error", "El nombre es obligatorio.");

            return res.redirect("/admin/categorias/nuevo");

        }

        await categoriaModel.crearCategoria(nombre.trim());

        setFlash(req, "exito", "Categoría creada correctamente.");

        res.redirect("/admin/categorias");

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible crear la categoría.");

        res.redirect("/admin/categorias/nuevo");

    }

};

// ===========================
// FORMULARIO EDITAR
// ===========================

const formEditar = async (req, res) => {

    try {

        const categoria = await categoriaModel.obtenerCategoriaPorId(req.params.id);

        if (!categoria) {

            setFlash(req, "advertencia", "Esa categoría no existe.");

            return res.redirect("/admin/categorias");

        }

        res.render("admin/categorias/form", {
            layout: "admin",
            titulo: "Editar categoría",
            categoria
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar la categoría.");

        res.redirect("/admin/categorias");

    }

};

// ===========================
// ACTUALIZAR
// ===========================

const actualizar = async (req, res) => {

    const { id } = req.params;

    try {

        const { nombre } = req.body;

        if (!nombre || !nombre.trim()) {

            setFlash(req, "error", "El nombre es obligatorio.");

            return res.redirect(`/admin/categorias/editar/${id}`);

        }

        await categoriaModel.actualizarCategoria(id, nombre.trim());

        setFlash(req, "exito", "Categoría actualizada correctamente.");

        res.redirect("/admin/categorias");

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible actualizar la categoría.");

        res.redirect(`/admin/categorias/editar/${id}`);

    }

};

// ===========================
// ELIMINAR
// ===========================

const eliminar = async (req, res) => {

    try {

        const totalProductos = await productoModel.contarProductosPorCategoria(req.params.id);

        if (totalProductos > 0) {

            setFlash(
                req,
                "error",
                `No se puede eliminar: hay ${totalProductos} producto(s) en esta categoría.`
            );

            return res.redirect("/admin/categorias");

        }

        await categoriaModel.eliminarCategoria(req.params.id);

        setFlash(req, "exito", "Categoría eliminada correctamente.");

    } catch (error) {

        if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {

            setFlash(req, "error", "No se puede eliminar: la categoría tiene productos asociados.");

        } else {

            console.error(error);

            setFlash(req, "error", "No fue posible eliminar la categoría.");

        }

    }

    res.redirect("/admin/categorias");

};

module.exports = {
    listar,
    formNuevo,
    crear,
    formEditar,
    actualizar,
    eliminar
};
