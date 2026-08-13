// ===========================
// CLASE CSS SEGÚN ESTADO
// ===========================

function claseEstado(estado) {

    return estado.toLowerCase().replace(/\s+/g, "-");

}

// ===========================
// FORMATEAR FECHA
// ===========================

function formatearFecha(fecha) {

    return new Date(fecha).toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}

module.exports = {
    claseEstado,
    formatearFecha
};
