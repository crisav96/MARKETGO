function requiereAdmin(req, res, next) {

    if (!req.session.esAdmin) {

        return res.redirect("/auth/login");

    }

    next();

}

module.exports = {
    requiereAdmin
};
