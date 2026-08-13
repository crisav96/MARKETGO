const express = require("express");

const router = express.Router();

const carritoController = require("../controllers/carritoController");

// Mostrar carrito
router.get("/", carritoController.verCarrito);

// Agregar producto
router.post("/agregar/:id", carritoController.agregarProducto);

// Actualizar cantidad
router.post("/actualizar/:id", carritoController.actualizarCantidad);

// Eliminar producto
router.get("/eliminar/:id", carritoController.eliminarProducto);

module.exports = router;