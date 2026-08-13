const express = require("express");

const router = express.Router();

const adminCategoriaController = require("../controllers/adminCategoriaController");
const { requiereAdmin } = require("../middleware/adminMiddleware");

router.use(requiereAdmin);

// Listar
router.get("/", adminCategoriaController.listar);

// Nueva categoría
router.get("/nuevo", adminCategoriaController.formNuevo);
router.post("/", adminCategoriaController.crear);

// Editar categoría
router.get("/editar/:id", adminCategoriaController.formEditar);
router.post("/editar/:id", adminCategoriaController.actualizar);

// Eliminar categoría
router.post("/eliminar/:id", adminCategoriaController.eliminar);

module.exports = router;
