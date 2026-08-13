const bcrypt = require("bcrypt");

const usuarioModel = require("../models/usuarioModel");
const setFlash = require("../helpers/flashHelper");
const { formatearFecha } = require("../helpers/formatoHelper");

// ===========================
// LISTAR
// ===========================

const listar = async (req, res) => {

    try {

        const usuarios = await usuarioModel.obtenerUsuarios();

        const usuariosFormateados = usuarios.map(usuario => ({
            ...usuario,
            fechaFormateada: formatearFecha(usuario.fecha_registro)
        }));

        res.render("admin/usuarios/listar", {
            layout: "admin",
            titulo: "Usuarios",
            usuarios: usuariosFormateados
        });

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "No fue posible cargar los usuarios.");

        res.redirect("/admin");

    }

};

// ===========================
// FORMULARIO NUEVO
// ===========================

const formNuevo = (req, res) => {

    res.render("admin/usuarios/form", {
        layout: "admin",
        titulo: "Nuevo usuario"
    });

};

// ===========================
// CREAR
// ===========================

const crear = async (req, res) => {

    try {

        const { nombre, correo, password } = req.body;

        if (!nombre || !nombre.trim() || !correo || !correo.trim() || !password) {

            setFlash(req, "error", "Nombre, correo y contraseña son obligatorios.");

            return res.redirect("/admin/usuarios/nuevo");

        }

        if (correo.toLowerCase() === process.env.ADMIN_USUARIO.toLowerCase()) {

            setFlash(req, "error", "Ese correo no está disponible.");

            return res.redirect("/admin/usuarios/nuevo");

        }

        if (password.length < 6) {

            setFlash(req, "error", "La contraseña debe tener al menos 6 caracteres.");

            return res.redirect("/admin/usuarios/nuevo");

        }

        const passwordHash = await bcrypt.hash(password, 10);

        await usuarioModel.crearUsuario(nombre.trim(), correo.trim(), passwordHash);

        setFlash(req, "exito", "Usuario creado correctamente.");

        res.redirect("/admin/usuarios");

    } catch (error) {

        if (error.code === "ER_DUP_ENTRY") {

            setFlash(req, "error", "Ese correo ya está registrado.");

        } else {

            console.error(error);

            setFlash(req, "error", "No fue posible crear el usuario.");

        }

        res.redirect("/admin/usuarios/nuevo");

    }

};

module.exports = {
    listar,
    formNuevo,
    crear
};
