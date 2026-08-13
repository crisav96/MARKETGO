const express = require("express");

const router = express.Router();

const adminOrdenController = require("../controllers/adminOrdenController");
const { requiereAdmin } = require("../middleware/adminMiddleware");

router.use(requiereAdmin);

// Listar (soporta ?buscar= y ?estado=)
router.get("/", adminOrdenController.listar);

// Detalle
router.get("/:id", adminOrdenController.verDetalle);

// Cambiar estado
router.post("/:id/estado", adminOrdenController.cambiarEstado);

module.exports = router;
