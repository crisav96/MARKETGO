const express = require("express");

const router = express.Router();

const checkoutController = require("../controllers/checkoutController");
const { requiereAutenticacion, requiereAutenticacionApi } = require("../middleware/autenticacionMiddleware");

// Mostrar página de checkout
router.get("/", requiereAutenticacion, checkoutController.mostrarCheckout);

// Confirmar compra
router.post("/", requiereAutenticacionApi, checkoutController.confirmarCompra);

// Página de éxito
router.get("/confirmacion/:id", requiereAutenticacion, checkoutController.mostrarConfirmacion);

module.exports = router;
