CREATE DATABASE marketgo;

USE marketgo;

CREATE TABLE usuarios (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    correo VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE categorias (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL

);

CREATE TABLE productos (

    id INT AUTO_INCREMENT PRIMARY KEY,

    categoria_id INT NOT NULL,

    nombre VARCHAR(120) NOT NULL,

    descripcion TEXT,

    precio DECIMAL(10,2) NOT NULL,

    precio_oferta DECIMAL(10,2) NULL,

    oferta_activa BOOLEAN NOT NULL DEFAULT FALSE,

    stock INT NOT NULL,

    imagen VARCHAR(255),

    FOREIGN KEY (categoria_id)

        REFERENCES categorias(id)

);

CREATE TABLE ordenes (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    direccion VARCHAR(250) NOT NULL,

    telefono VARCHAR(20),

    metodo_pago ENUM(

        'Tarjeta',

        'SINPE Móvil',

        'Contra entrega'

    ) DEFAULT 'Contra entrega',

    total DECIMAL(10,2) NOT NULL,

    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    estado ENUM(

        'Pendiente',

        'Preparando',

        'En camino',

        'Entregado'

    ) DEFAULT 'Pendiente',

    FOREIGN KEY (usuario_id)

        REFERENCES usuarios(id)

);

CREATE TABLE orden_detalle (

    id INT AUTO_INCREMENT PRIMARY KEY,

    orden_id INT NOT NULL,

    producto_id INT NOT NULL,

    cantidad INT NOT NULL,

    precio DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (orden_id)

        REFERENCES ordenes(id),

    FOREIGN KEY (producto_id)

        REFERENCES productos(id)

);

