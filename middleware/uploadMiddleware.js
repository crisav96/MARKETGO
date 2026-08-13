const multer = require("multer");
const path = require("path");
const setFlash = require("../helpers/flashHelper");

const CARPETA_DESTINO = path.join(__dirname, "..", "public", "img", "productos");

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, CARPETA_DESTINO),

    filename: (req, file, cb) => {

        const sufijo = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(null, `${sufijo}${path.extname(file.originalname)}`);

    }

});

function filtroArchivo(req, file, cb) {

    if (TIPOS_PERMITIDOS.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF."));

    }

}

const upload = multer({
    storage,
    fileFilter: filtroArchivo,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ===========================
// ENVOLTORIO CON MANEJO DE ERRORES
// ===========================
// obtenerRutaError: string, o función (req) => string, a donde redirigir si falla la subida

function manejarSubida(obtenerRutaError) {

    return (req, res, next) => {

        upload.single("imagen")(req, res, error => {

            if (error) {

                setFlash(req, "error", error.message || "No fue posible subir la imagen.");

                const ruta = typeof obtenerRutaError === "function"
                    ? obtenerRutaError(req)
                    : obtenerRutaError;

                return res.redirect(ruta);

            }

            next();

        });

    };

}

module.exports = {
    manejarSubida
};
