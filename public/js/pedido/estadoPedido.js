const badges = document.querySelectorAll("[data-badge-estado]");

if (badges.length > 0 && window.io) {

    const socket = io();

    const idsOrdenes = new Set();

    badges.forEach(badge => idsOrdenes.add(badge.dataset.ordenId));

    socket.on("connect", () => {

        idsOrdenes.forEach(ordenId => socket.emit("unirseOrden", ordenId));

    });

    socket.on("estadoActualizado", datos => {

        document
            .querySelectorAll(`[data-badge-estado][data-orden-id="${datos.ordenId}"]`)
            .forEach(badge => {

                badge.textContent = datos.estado;
                badge.className = `badge-estado badge-${datos.estadoClase}`;

            });

    });

}
