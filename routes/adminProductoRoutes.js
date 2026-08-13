const express = require("express");

const router = express.Router();

const adminProductoController = require("../controllers/adminProductoController");
const { requiereAdmin } = require("../middleware/adminMiddleware");
const { manejarSubida } = require("../middleware/uploadMiddleware");

router.use(requiereAdmin);

// Listar (soporta ?buscar= y ?categoria=)
router.get("/", adminProductoController.listar);

// Nuevo producto
router.get("/nuevo", adminProductoController.formNuevo);
router.post(
    "/",
    manejarSubida("/admin/productos/nuevo"),
    adminProductoController.crear
);

// Editar producto
router.get("/editar/:id", adminProductoController.formEditar);
router.post(
    "/editar/:id",
    manejarSubida(req => `/admin/productos/editar/${req.params.id}`),
    adminProductoController.actualizar
);

// Eliminar producto
router.post("/eliminar/:id", adminProductoController.eliminar);

module.exports = router;
