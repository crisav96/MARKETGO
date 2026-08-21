const express = require("express");

const router = express.Router();

const adminOfertaController = require("../controllers/adminOfertaController");
const { requiereAdmin } = require("../middleware/adminMiddleware");

router.use(requiereAdmin);

router.get("/", adminOfertaController.listar);
router.post("/:id", adminOfertaController.actualizar);

module.exports = router;
