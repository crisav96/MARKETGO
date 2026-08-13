const path = require("path");
const fs = require("fs/promises");

const productoModel = require("../models/productoModel");
const categoriaModel = require("../models/categoriaModel");
const setFlash = require("../helpers/flashHelper");

const CARPETA_IMAGENES = path.join(__dirname, "..", "public", "img", "productos");

// ===========================
// MARCAR CATEGORÍA SELECCIONADA (para el <select>)
// ===========================

function marcarSeleccionada(categorias, idActual) {

    return categorias.map(categoria => ({
        ...categoria,
        seleccionada: idActual !== undefined && String(categoria.id) === String(idActual)
    }));

}

// ===========================
// BORRAR ARCHIVO DE IMAGEN (si no es la de por defecto)
// ===========================

async function eliminarImagen(nombreArchivo) {

    if (!nombreArchivo || nombreArchivo === "default.png") return;

    try {

        await fs.unlink(path.join(CARPETA_IMAGENES, nombreArchivo));

    } catch (error) {

        // el archivo ya no existía, no es un error real

    }

}

// ===========================
// VALIDAR CAMPOS DEL FORMULARIO
// ===========================

function validarDatos({ nombre, categoriaId, precio, stock }) {

    if (!nombre || !nombre.trim() || !categoriaId) {

        return "Nombre y categoría son obligatorios.";

    }

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (!(precioNumero > 0)) {

        return "El precio debe ser mayor a cero.";

    }

    if (!Number.isInteger(stockNumero) || stockNumero < 0) {

        return "El stock debe ser un número entero válido.";

    }

    return null;

}

// ===========================
// LISTAR
// ===========================

const listar = async (req, res) => {

    try {

        const buscar = (req.query.buscar || "").trim();
        const categoriaId = req.query.categoria || "";

        const [productos, categorias] = await Promise.all([
            productoModel.obtenerProductosAdmin({ buscar, categoriaId }),
            categoriaModel.obtenerCategorias()
        ]);

        res.render("admin/productos/listar", {
            layout: "admin",
            titulo: "Productos",
            productos,
            categorias: marcarSeleccionada(categorias, categoriaId),
            buscar,
            categoriaId
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar los productos.");

        res.redirect("/admin");

    }

};

// ===========================
// FORMULARIO NUEVO
// ===========================

const formNuevo = async (req, res) => {

    try {

        const categorias = await categoriaModel.obtenerCategorias();

        res.render("admin/productos/form", {
            layout: "admin",
            titulo: "Nuevo producto",
            categorias
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar el formulario.");

        res.redirect("/admin/productos");

    }

};

// ===========================
// CREAR
// ===========================

const crear = async (req, res) => {

    try {

        const { nombre, descripcion, precio, stock, categoriaId } = req.body;

        const errorValidacion = validarDatos({ nombre, categoriaId, precio, stock });

        if (errorValidacion) {

            setFlash(req, "error", errorValidacion);

            return res.redirect("/admin/productos/nuevo");

        }

        await productoModel.crearProducto({
            nombre: nombre.trim(),
            descripcion: (descripcion || "").trim(),
            precio: Number(precio),
            stock: Number(stock),
            categoriaId,
            imagen: req.file ? req.file.filename : null
        });

        setFlash(req, "exito", "Producto creado correctamente.");

        res.redirect("/admin/productos");

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible crear el producto.");

        res.redirect("/admin/productos/nuevo");

    }

};

// ===========================
// FORMULARIO EDITAR
// ===========================

const formEditar = async (req, res) => {

    try {

        const [producto, categorias] = await Promise.all([
            productoModel.obtenerProductoPorId(req.params.id),
            categoriaModel.obtenerCategorias()
        ]);

        if (!producto) {

            setFlash(req, "advertencia", "Ese producto no existe.");

            return res.redirect("/admin/productos");

        }

        res.render("admin/productos/form", {
            layout: "admin",
            titulo: "Editar producto",
            producto,
            categorias: marcarSeleccionada(categorias, producto.categoria_id)
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar el producto.");

        res.redirect("/admin/productos");

    }

};

// ===========================
// ACTUALIZAR
// ===========================

const actualizar = async (req, res) => {

    const { id } = req.params;

    try {

        const { nombre, descripcion, precio, stock, categoriaId } = req.body;

        const errorValidacion = validarDatos({ nombre, categoriaId, precio, stock });

        if (errorValidacion) {

            setFlash(req, "error", errorValidacion);

            return res.redirect(`/admin/productos/editar/${id}`);

        }

        const productoActual = await productoModel.obtenerProductoPorId(id);

        if (!productoActual) {

            setFlash(req, "advertencia", "Ese producto no existe.");

            return res.redirect("/admin/productos");

        }

        await productoModel.actualizarProducto(id, {
            nombre: nombre.trim(),
            descripcion: (descripcion || "").trim(),
            precio: Number(precio),
            stock: Number(stock),
            categoriaId,
            imagen: req.file ? req.file.filename : null
        });

        if (req.file) {

            await eliminarImagen(productoActual.imagen);

        }

        setFlash(req, "exito", "Producto actualizado correctamente.");

        res.redirect("/admin/productos");

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible actualizar el producto.");

        res.redirect(`/admin/productos/editar/${id}`);

    }

};

// ===========================
// ELIMINAR
// ===========================

const eliminar = async (req, res) => {

    try {

        const producto = await productoModel.obtenerProductoPorId(req.params.id);

        await productoModel.eliminarProducto(req.params.id);

        if (producto) await eliminarImagen(producto.imagen);

        setFlash(req, "exito", "Producto eliminado correctamente.");

    } catch (error) {

        if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {

            setFlash(req, "error", "No se puede eliminar: el producto tiene pedidos asociados.");

        } else {

            console.error(error);

            setFlash(req, "error", "No fue posible eliminar el producto.");

        }

    }

    res.redirect("/admin/productos");

};

module.exports = {
    listar,
    formNuevo,
    crear,
    formEditar,
    actualizar,
    eliminar
};
