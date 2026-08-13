# MarketGo

Aplicación web de delivery para supermercados. Los clientes pueden registrarse, explorar el catálogo, agregar productos al carrito y realizar pedidos. Un panel de administración permite gestionar productos, categorías, pedidos y usuarios.

Proyecto final — Programación III, Universidad Politécnica Internacional.

## Stack

- **Backend:** Node.js + Express (patrón MVC)
- **Vistas:** Handlebars (`express-handlebars`)
- **Base de datos:** MySQL (`mysql2`)
- **Sesiones:** `express-session`
- **Autenticación:** `bcrypt`
- **Subida de imágenes:** `multer`
- **Tiempo real:** `socket.io` (actualización del estado del pedido sin recargar la página)
- **Notificaciones por correo:** `nodemailer` (Gmail) — le avisa al cliente cada vez que cambia el estado de su pedido

## Requisitos previos

- Node.js 18 o superior
- MySQL Server corriendo localmente (o accesible por red)

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con estas variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_NAME=marketgo

SESSION_SECRET=una_frase_secreta_larga

ADMIN_USUARIO=admin@marketgo.com
ADMIN_PASSWORD=una_contraseña_segura

GMAIL_USUARIO=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_contraseña_de_aplicacion_de_16_caracteres

BASE_URL=http://localhost:3000

PORT=3000
```

`ADMIN_USUARIO`/`ADMIN_PASSWORD` son las credenciales fijas del panel de administración — **no existen en la base de datos**, viven únicamente en el servidor.

### Correo de notificaciones (Gmail)

Las notificaciones de cambio de estado usan Gmail vía SMTP. `GMAIL_APP_PASSWORD` **no es tu contraseña normal de Gmail** — es una "contraseña de aplicación" de 16 caracteres:

1. Activa la verificación en dos pasos en tu cuenta de Google (Seguridad).
2. Genera una contraseña de aplicación en [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Pega ese código (sin espacios) en `GMAIL_APP_PASSWORD`.

Si el correo falla (credenciales sin configurar, sin internet, etc.), el pedido **igual cambia de estado** — el envío del correo nunca bloquea la operación, solo se registra el error en la consola del servidor.

> Nota: si tu máquina tiene un antivirus que inspecciona el tráfico HTTPS, puede que la conexión a Gmail falle con un error de certificado aunque las credenciales sean correctas. `helpers/mailer.js` ya incluye el ajuste necesario para ese caso.

## Base de datos

Con el servidor de MySQL corriendo, ejecuta los scripts en orden:

```bash
mysql -u root -p < database/01_DDL_MarketGo.sql
mysql -u root -p < database/02_DML_MarketGo.sql
```

Esto crea la base `marketgo`, sus tablas, y la carga con datos de prueba: 15 productos en 5 categorías, 3 usuarios y 3 pedidos de ejemplo.

## Ejecutar el proyecto

```bash
npm start
```

o, para desarrollo con recarga automática:

```bash
npm run dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

## Cuentas de prueba

**Administrador** — usa las credenciales que pusiste en `ADMIN_USUARIO`/`ADMIN_PASSWORD` del `.env`, en el mismo formulario de login de la tienda. Redirige automáticamente al panel (`/admin`).

**Clientes** (creados por el script `02_DML_MarketGo.sql`), contraseña para los tres: `Cliente123`

| Nombre | Correo |
|---|---|
| Cristopher Arroyo | cristopher@email.com |
| Melissa Elizondo | melissa@email.com |
| Juan Pérez | juan@email.com |

## Estructura del proyecto

```
controllers/    Lógica de cada ruta (cliente y administración)
models/         Acceso a datos (MySQL vía mysql2)
routes/         Definición de endpoints Express
middleware/     Autenticación de cliente/admin, sesión de flash, subida de imágenes
helpers/        Utilidades compartidas (mensajes flash, formato de fecha/estado, Socket.IO)
views/          Plantillas Handlebars (cliente, admin, layouts, partials)
public/         CSS, JS de cliente (organizado por módulo) e imágenes
database/       Scripts SQL (DDL y datos de prueba)
```

## Funcionalidades

- Registro e inicio de sesión de clientes, con rutas protegidas
- Catálogo con búsqueda, filtro por categoría, filtro por precio, orden, y vista de detalle de producto
- Carrito de compras persistente en `localStorage`, con cantidades y total en tiempo real
- Checkout transaccional (valida stock y descuenta inventario en la misma transacción de MySQL)
- Historial de pedidos del cliente, con detalle de cada uno
- Panel de administración (acceso fijo, no en BD): dashboard con estadísticas, CRUD de productos con subida de imagen, CRUD de categorías, gestión de pedidos con cambio de estado, y alta de usuarios
- Actualización del estado del pedido en tiempo real (Socket.IO), sin recargar la página
- Notificación por correo al cliente en cada cambio de estado del pedido (Nodemailer + Gmail)
