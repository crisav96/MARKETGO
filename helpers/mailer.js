const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USUARIO,
        pass: process.env.GMAIL_APP_PASSWORD
    },
    // Esta máquina intercepta/inspecciona el tráfico HTTPS (típico de un antivirus)
    // y rompe la verificación normal del certificado de Gmail. Sin esto, ni con
    // credenciales correctas se logra conectar. Ver README para más detalle.
    tls: {
        rejectUnauthorized: false
    }
});

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

module.exports = {
    enviarCorreoCambioEstado
};
