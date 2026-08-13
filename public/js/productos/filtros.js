const formulario = document.getElementById("formFiltros");
const rangoPrecio = document.getElementById("rangoPrecio");
const precioMaxTexto = document.getElementById("precioMaxTexto");

if (rangoPrecio && precioMaxTexto) {

    rangoPrecio.addEventListener("input", () => {

        precioMaxTexto.textContent = `₡${rangoPrecio.value}`;

    });

}

if (formulario) {

    // Categoría y orden se aplican al instante
    formulario.querySelectorAll('input[type="checkbox"], select').forEach(campo => {

        campo.addEventListener("change", () => formulario.submit());

    });

    // El precio se aplica al soltar el control, no en cada pixel de arrastre
    if (rangoPrecio) {

        rangoPrecio.addEventListener("change", () => formulario.submit());

    }

}
