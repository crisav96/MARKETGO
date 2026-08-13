import { mostrarToast } from "./ui/toast.js";

// ===========================
// MOSTRAR MENSAJE FLASH DEL SERVIDOR (SI EXISTE)
// ===========================

const datosFlash = document.getElementById("flashData");

if (datosFlash) {

    mostrarToast(datosFlash.dataset.texto, datosFlash.dataset.tipo);

}
