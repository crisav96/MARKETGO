const flashMiddleware = (req, res, next) => {

    res.locals.mensaje = req.session.mensaje;

    delete req.session.mensaje;

    next();

};

module.exports = flashMiddleware;