const express = require("express");

const router = express.Router();

const adminUsuarioController = require("../controllers/adminUsuarioController");
const { requiereAdmin } = require("../middleware/adminMiddleware");

router.use(requiereAdmin);

// Listar
router.get("/", adminUsuarioController.listar);

// Nuevo usuario
router.get("/nuevo", adminUsuarioController.formNuevo);
router.post("/", adminUsuarioController.crear);

module.exports = router;
