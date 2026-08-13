const inputImagen = document.querySelector('input[name="imagen"]');
const previewImagen = document.getElementById("previewImagen");
const previewImagenImg = document.getElementById("previewImagenImg");

if (inputImagen && previewImagen && previewImagenImg) {

    inputImagen.addEventListener("change", () => {

        const archivo = inputImagen.files[0];

        if (!archivo) {

            previewImagen.hidden = true;

            return;

        }

        previewImagenImg.src = URL.createObjectURL(archivo);

        previewImagen.hidden = false;

    });

}
