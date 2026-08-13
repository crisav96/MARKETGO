const express = require("express");

const router = express.Router();

const ordenController = require("../controllers/ordenController");
const { requiereAutenticacion } = require("../middleware/autenticacionMiddleware");

// Historial de pedidos (debe ir antes de "/:id")
router.get("/historial", requiereAutenticacion, ordenController.historial);

// Detalle de un pedido
router.get("/:id", requiereAutenticacion, ordenController.detalle);

module.exports = router;
