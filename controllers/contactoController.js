const setFlash = require("../helpers/flashHelper");
const { enviarCorreoContacto } = require("../helpers/mailer");

// ===========================
// MOSTRAR PÁGINA DE CONTACTO
// ===========================

const mostrar = (req, res) => {

    res.render("contacto", {
        titulo: "Contacto"
    });

};

// ===========================
// ENVIAR MENSAJE
// ===========================

const enviar = async (req, res) => {

    try {

        const { nombre, correo, mensaje } = req.body;

        if (!nombre?.trim() || !correo?.trim() || !mensaje?.trim()) {

            setFlash(req, "error", "Completa todos los campos.");

            return res.redirect("/contacto");

        }

        try {

            await enviarCorreoContacto({
                nombre: nombre.trim(),
                correo: correo.trim(),
                mensaje: mensaje.trim()
            });

        } catch (errorCorreo) {

            console.error("No fue posible enviar el correo de contacto:", errorCorreo.message);

            setFlash(req, "error", "No fue posible enviar tu mensaje. Intenta de nuevo más tarde.");

            return res.redirect("/contacto");

        }

        setFlash(req, "exito", "Tu mensaje fue enviado. Te responderemos pronto.");

        res.redirect("/contacto");

    } catch (error) {

        console.error(error);

        setFlash(req, "error", "Ocurrió un error al enviar tu mensaje.");

        res.redirect("/contacto");

    }

};

module.exports = {
    mostrar,
    enviar
};
