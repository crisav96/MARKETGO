const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");
const { requiereAdmin } = require("../middleware/adminMiddleware");

// Cerrar sesión de administrador (el login es el mismo formulario que /auth/login)
router.get("/logout", adminController.logout);

// Dashboard
router.get("/", requiereAdmin, adminController.dashboard);

// NOTA: CRUD de productos/categorías, gestión de pedidos y usuarios
// se agregan módulo por módulo (ver instrucciones del proyecto).

module.exports = router;
