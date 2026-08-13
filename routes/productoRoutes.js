const express = require("express");

const router = express.Router();

const productoController = require("../controllers/productoController");

// Mostrar catálogo
router.get("/", productoController.listarProductos);

// Ver detalle de un producto
router.get("/:id", productoController.verDetalle);

module.exports = router;