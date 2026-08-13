const btnCuenta = document.getElementById("btnCuenta");
const menuCuenta = document.getElementById("menuCuenta");

if(btnCuenta && menuCuenta){

    btnCuenta.addEventListener("click", function(e){

        e.stopPropagation();

        menuCuenta.classList.toggle("activo");

    });

    document.addEventListener("click", function(e){

        if(!menuCuenta.contains(e.target) && !btnCuenta.contains(e.target)){

            menuCuenta.classList.remove("activo");

        }

    });

}
