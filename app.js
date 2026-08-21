require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const path = require("path");
const http = require("http");

// Base de datos
const conectarDB = require("./db");
const categoriaModel = require("./models/categoriaModel");
const productoModel = require("./models/productoModel");

// Socket.IO
const { inicializarSocket } = require("./helpers/socket");

// Helpers
const { obtenerIcono } = require("./helpers/categoriaIconos");

// Middlewares
const flashMiddleware = require("./middleware/flashMiddleware");
const usuarioMiddleware = require("./middleware/usuarioMiddleware");

// Rutas
const authRoutes = require("./routes/authRoutes");
const productoRoutes = require("./routes/productoRoutes");
const checkoutRoutes = require("./routes/checkout");
const ordenRoutes = require("./routes/ordenRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminProductoRoutes = require("./routes/adminProductoRoutes");
const adminCategoriaRoutes = require("./routes/adminCategoriaRoutes");
const adminOrdenRoutes = require("./routes/adminOrdenRoutes");
const adminUsuarioRoutes = require("./routes/adminUsuarioRoutes");
const contactoRoutes = require("./routes/contactoRoutes");

const app = express();

// ======================================
// Conexión a la Base de Datos
// ======================================

conectarDB();

// ======================================
// Middleware de Express
// ======================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// ======================================
// Sesiones
// ======================================

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
});

app.use(sessionMiddleware);

// ======================================
// Flash Messages
// ======================================

app.use(flashMiddleware);

// ======================================
// Usuario disponible en todas las vistas
// ======================================

app.use(usuarioMiddleware);

// ======================================
// Handlebars
// ======================================

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "views", "layouts"),
        partialsDir: path.join(__dirname, "views", "partials"),
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ======================================
// Rutas
// ======================================

app.use("/auth", authRoutes);
app.use("/productos", productoRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/ordenes", ordenRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/productos", adminProductoRoutes);
app.use("/admin/categorias", adminCategoriaRoutes);
app.use("/admin/ordenes", adminOrdenRoutes);
app.use("/admin/usuarios", adminUsuarioRoutes);
app.use("/contacto", contactoRoutes);

// ======================================
// Ruta Principal
// ======================================

app.get("/", async (req, res) => {

    const [categoriasResultado, ofertasResultado] = await Promise.allSettled([
        categoriaModel.obtenerCategorias(),
        productoModel.obtenerOfertas(4)
    ]);

    if (categoriasResultado.status === "rejected") {
        console.error(categoriasResultado.reason);
    }

    if (ofertasResultado.status === "rejected") {
        console.error(ofertasResultado.reason);
    }

    const categorias = categoriasResultado.status === "fulfilled"
        ? categoriasResultado.value.map(categoria => ({
            ...categoria,
            icono: obtenerIcono(categoria.nombre)
        }))
        : [];

    const ofertas = ofertasResultado.status === "fulfilled" ? ofertasResultado.value : [];

    res.render("home", {
        titulo: "MarketGo",
        categorias,
        ofertas
    });

});

// Secciones aún no construidas
app.get("/ofertas", async (req, res) => {

    try {

        const ofertas = await productoModel.obtenerOfertas();

        res.render("cliente/ofertas", {
            titulo: "Ofertas",
            ofertas
        });

    } catch (error) {

        console.error(error);

        res.render("cliente/ofertas", {
            titulo: "Ofertas",
            ofertas: []
        });

    }

});

// ======================================
// Servidor
// ======================================

const server = http.createServer(app);

inicializarSocket(server, sessionMiddleware);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);

});