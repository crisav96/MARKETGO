const bcrypt = require("bcrypt");
const usuarioModel = require("../models/usuarioModel");
const setFlash = require("../helpers/flashHelper");

// Mostrar formulario de login
const mostrarLogin = (req, res) => {

    res.render("auth/login", {
        titulo: "Iniciar sesión"
    });

};

// Mostrar formulario de registro
const mostrarRegistro = (req, res) => {

    res.render("auth/registro", {
        titulo: "Registro"
    });

};

// Registrar usuario
const registrar = async (req, res) => {

    try {

        const { nombre, correo, password } = req.body;

        const correoNormalizado = correo?.toLowerCase() || "";
        const correoAdmin = (process.env.ADMIN_USUARIO || "").toLowerCase();

        if (correoAdmin && correoNormalizado === correoAdmin) {

            setFlash(req, "error", "Ese correo no está disponible.");

            return res.redirect("/auth/registro");

        }

        const passwordHash = await bcrypt.hash(password, 10);

        await usuarioModel.crearUsuario(
            nombre,
            correo,
            passwordHash
        );

        setFlash(
            req,
            "exito",
            "Usuario registrado correctamente. Ahora puede iniciar sesión."
        );

        res.redirect("/auth/login");

    } catch (error) {

        console.error(error);

        setFlash(
            req,
            "error",
            "Ocurrió un error al registrar el usuario."
        );

        res.redirect("/auth/registro");

    }

};

// Login
const login = async (req, res) => {

    try {

        const { correo, password } = req.body;

        // Admin: credenciales fijas del servidor, no viven en la BD
        if (correo === process.env.ADMIN_USUARIO && password === process.env.ADMIN_PASSWORD) {

            req.session.esAdmin = true;

            setFlash(req, "exito", "Bienvenido, administrador.");

            return res.redirect("/admin");

        }

        const usuario = await usuarioModel.buscarPorCorreo(correo);

        if (!usuario) {

            setFlash(
                req,
                "advertencia",
                "El usuario no existe."
            );

            return res.redirect("/auth/login");

        }

        const coincide = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!coincide) {

            setFlash(
                req,
                "error",
                "La contraseña es incorrecta."
            );

            return res.redirect("/auth/login");

        }

        req.session.usuario = {

            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo

        };

        setFlash(
            req,
            "exito",
            `Bienvenido ${usuario.nombre}.`
        );

        res.redirect("/");

    } catch (error) {

        console.error(error);

        setFlash(
            req,
            "error",
            "No fue posible iniciar sesión."
        );

        res.redirect("/auth/login");

    }

};

// Logout
const logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

};

module.exports = {
    mostrarLogin,
    mostrarRegistro,
    registrar,
    login,
    logout
};