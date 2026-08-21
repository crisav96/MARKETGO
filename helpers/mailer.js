const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USUARIO,
        pass: process.env.GMAIL_APP_PASSWORD
    },
    // Mismo criterio que db.js: la ausencia de DB_HOST indica que estamos en local,
    // donde el antivirus intercepta el tráfico HTTPS y rompe la verificación del
    // certificado de Gmail. En producción (Render, donde DB_HOST sí existe) el
    // certificado se valida normalmente.
    tls: {
        rejectUnauthorized: !!process.env.DB_HOST
    }
});

// ===========================
// ESCAPAR HTML (evita inyectar markup en los correos)
// ===========================

function escaparHtml(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

// ===========================
// PLANTILLA HTML
// ===========================

function plantillaCorreo({ nombreCliente, ordenId, estado }) {

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    return `
        <div style="font-family:Arial, sans-serif; background:#f5f5f5; padding:30px;">
            <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 3px 15px rgba(0,0,0,.08);">

                <div style="background:#2E7D32; padding:24px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">MarketGo</h1>
                </div>

                <div style="padding:30px;">

                    <p style="font-size:15px; color:#333;">Hola ${nombreCliente},</p>

                    <p style="font-size:15px; color:#333;">
                        El estado de tu pedido <strong>#${ordenId}</strong> ha cambiado a:
                    </p>

                    <p style="font-size:24px; font-weight:bold; color:#2E7D32; text-align:center; margin:20px 0;">
                        ${estado}
                    </p>

                    <div style="text-align:center; margin-top:24px;">
                        <a
                            href="${baseUrl}/ordenes/${ordenId}"
                            style="background:#2E7D32; color:#ffffff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
                            Ver mi pedido
                        </a>
                    </div>

                    <p style="font-size:13px; color:#999; margin-top:30px;">
                        Gracias por comprar en MarketGo.
                    </p>

                </div>

            </div>
        </div>
    `;

}

// ===========================
// ENVIAR NOTIFICACIÓN DE CAMBIO DE ESTADO
// ===========================

async function enviarCorreoCambioEstado({ correo, nombreCliente, ordenId, estado }) {

    await transporter.sendMail({
        from: `"MarketGo" <${process.env.GMAIL_USUARIO}>`,
        to: correo,
        subject: `Tu pedido #${ordenId} ahora está: ${estado}`,
        html: plantillaCorreo({ nombreCliente, ordenId, estado })
    });

}

// ===========================
// PLANTILLA CONTACTO
// ===========================

function plantillaContacto({ nombre, correo, mensaje }) {

    return `
        <div style="font-family:Arial, sans-serif; background:#f5f5f5; padding:30px;">
            <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 3px 15px rgba(0,0,0,.08);">

                <div style="background:#2E7D32; padding:24px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">Nuevo mensaje de contacto</h1>
                </div>

                <div style="padding:30px;">

                    <p style="font-size:15px; color:#333;"><strong>Nombre:</strong> ${escaparHtml(nombre)}</p>

                    <p style="font-size:15px; color:#333;"><strong>Correo:</strong> ${escaparHtml(correo)}</p>

                    <p style="font-size:15px; color:#333; margin-top:16px;"><strong>Mensaje:</strong></p>

                    <p style="font-size:15px; color:#333; white-space:pre-line;">${escaparHtml(mensaje)}</p>

                </div>

            </div>
        </div>
    `;

}

// ===========================
// ENVIAR MENSAJE DE CONTACTO
// ===========================

async function enviarCorreoContacto({ nombre, correo, mensaje }) {

    await transporter.sendMail({
        from: `"MarketGo" <${process.env.GMAIL_USUARIO}>`,
        to: process.env.GMAIL_USUARIO,
        replyTo: correo,
        subject: `Nuevo mensaje de contacto de ${nombre}`,
        html: plantillaContacto({ nombre, correo, mensaje })
    });

}

module.exports = {
    enviarCorreoCambioEstado,
    enviarCorreoContacto
};
