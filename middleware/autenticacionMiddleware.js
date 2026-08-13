const setFlash = require("../helpers/flashHelper");

// ===========================
// PARA VISTAS (redirige a login)
// ===========================

function requiereAutenticacion(req, res, next) {

    if (!req.session.usuario) {

        setFlash(req, "advertencia", "Debes iniciar sesión para continuar.");

        return res.redirect("/auth/login");

    }

    next();

}

// ===========================
// PARA ENDPOINTS JSON (responde 401)
// ===========================

function requiereAutenticacionApi(req, res, next) {

    if (!req.session.usuario) {

        return res.status(401).json({
            exito: false,
            mensaje: "Debes iniciar sesión para continuar."
        });

    }

    next();

}

module.exports = {
    requiereAutenticacion,
    requiereAutenticacionApi
};
