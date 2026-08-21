const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const authController = require("../controllers/authController");

// Máximo 10 intentos de login por IP cada 15 min, para frenar fuerza bruta
// contra cuentas de usuario y contra el usuario/contraseña fijos del admin.
const limitadorLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en unos minutos."
});

router.get("/login", authController.mostrarLogin);
router.get("/registro", authController.mostrarRegistro);
router.post("/registro", authController.registrar);
router.post("/login", limitadorLogin, authController.login);
router.get("/logout", authController.logout);

module.exports = router;