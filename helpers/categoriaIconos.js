const ICONOS = {
    "Frutas": "🍎",
    "Verduras": "🥦",
    "Lácteos": "🥛",
    "Carnes": "🥩",
    "Bebidas": "🧃"
};

const ICONO_DEFECTO = "🛒";

function obtenerIcono(nombreCategoria) {

    return ICONOS[nombreCategoria] || ICONO_DEFECTO;

}

module.exports = {
    obtenerIcono
};
