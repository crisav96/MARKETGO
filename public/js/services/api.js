const CABECERAS_JSON = {
    "Content-Type": "application/json"
};

// ===========================
// POST
// ===========================

export async function post(url, datos) {

    const respuesta = await fetch(url, {

        method: "POST",

        headers: CABECERAS_JSON,

        body: JSON.stringify(datos)

    });

    return await respuesta.json();

}
