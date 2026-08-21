const formulario = document.getElementById("formRegistro");
const password = document.querySelector('input[name="password"]');
const confirmarPassword = document.querySelector('input[name="confirmarPassword"]');

if (formulario && password && confirmarPassword) {

    function validarCoincidencia() {

        if (confirmarPassword.value && confirmarPassword.value !== password.value) {

            confirmarPassword.setCustomValidity("Las contraseñas no coinciden.");

        } else {

            confirmarPassword.setCustomValidity("");

        }

    }

    password.addEventListener("input", validarCoincidencia);
    confirmarPassword.addEventListener("input", validarCoincidencia);

}
