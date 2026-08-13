function usuarioMiddleware(req, res, next) {

    res.locals.usuario = req.session.usuario || null;

    next();

}

module.exports = usuarioMiddleware;