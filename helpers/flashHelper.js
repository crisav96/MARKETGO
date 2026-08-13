function setFlash(req, tipo, texto) {

    req.session.mensaje = {

        tipo,

        texto

    };

}

module.exports = setFlash;