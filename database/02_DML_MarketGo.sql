USE marketgo;

#TABLA: CATEGORIAS
INSERT INTO categorias (nombre)
VALUES
('Frutas'),
('Verduras'),
('Lácteos'),
('Carnes'),
('Bebidas');


#TABLA: PRODUCTOS
INSERT INTO productos
(categoria_id, nombre, descripcion, precio, stock, imagen)
VALUES
-- FRUTAS
(1,'Manzana Roja','Manzana nacional',0.75,100,'manzana.jpg'),
(1,'Banano','Banano maduro',0.40,150,'banano.jpg'),
(1,'Naranja','Naranja dulce',0.60,120,'naranja.jpg'),

-- VERDURAS
(2,'Tomate','Tomate fresco',1.10,80,'tomate.jpg'),
(2,'Lechuga','Lechuga americana',0.90,50,'lechuga.jpg'),
(2,'Papa','Papa blanca',0.95,200,'papa.jpg'),

-- LÁCTEOS
(3,'Leche Dos Pinos','Leche Entera 1L',1.80,90,'leche.jpg'),
(3,'Queso Mozzarella','500 gramos',4.50,35,'queso.jpg'),
(3,'Yogurt Natural','Yogurt 750 ml',2.35,45,'yogurt.jpg'),

-- CARNES
(4,'Pechuga de Pollo','1 kilogramo',6.95,40,'pollo.jpg'),
(4,'Carne Molida','Res 1 kilogramo',8.75,30,'carne.jpg'),
(4,'Chuleta de Cerdo','1 kilogramo',7.50,25,'chuleta.jpg'),

-- BEBIDAS
(5,'Coca Cola 2L','Gaseosa',2.30,75,'cocacola.jpg'),
(5,'Jugo Tropical','Caja 1L',1.95,60,'jugo.jpg'),
(5,'Agua Cristal','Botella 600 ml',0.95,120,'agua.jpg');


#TABLA: USUARIOS
-- Contraseña real para los 3: Cliente123  (hash generado con bcrypt, 10 rounds)
INSERT INTO usuarios
(nombre, correo, password)
VALUES

('Cristopher Arroyo','cristopher@email.com','$2b$10$7E55tltp3mruKBx5WQ/MYOe/TDps.I6uk/E4FhElqMiAeMVyFVG/i'),

('Melissa Elizondo','melissa@email.com','$2b$10$7E55tltp3mruKBx5WQ/MYOe/TDps.I6uk/E4FhElqMiAeMVyFVG/i'),

('Juan Pérez','juan@email.com','$2b$10$7E55tltp3mruKBx5WQ/MYOe/TDps.I6uk/E4FhElqMiAeMVyFVG/i');

#TABLA: ORDENES + ORDEN_DETALLE (3 órdenes de ejemplo)

-- Orden 1: Cristopher (usuario 1) — Entregado
INSERT INTO ordenes (usuario_id, direccion, telefono, metodo_pago, total, estado)
VALUES (1, 'San José, Central, Carmen. Casa color celeste, portón negro', '8888-1111', 'Tarjeta', 9.85, 'Entregado');

INSERT INTO orden_detalle (orden_id, producto_id, cantidad, precio)
VALUES
(1, 1, 3, 0.75),   -- Manzana Roja x3
(1, 2, 5, 0.40),   -- Banano x5
(1, 7, 2, 1.80);   -- Leche Dos Pinos x2

-- Orden 2: Melissa (usuario 2) — En camino
INSERT INTO ordenes (usuario_id, direccion, telefono, metodo_pago, total, estado)
VALUES (2, 'Alajuela, Central, San José. Edificio Torres del Valle, apto 4B', '8777-2222', 'SINPE Móvil', 13.55, 'En camino');

INSERT INTO orden_detalle (orden_id, producto_id, cantidad, precio)
VALUES
(2, 10, 1, 6.95),  -- Pechuga de Pollo x1
(2, 13, 2, 2.30);  -- Coca Cola 2L x2

-- Orden 3: Juan (usuario 3) — Pendiente
INSERT INTO ordenes (usuario_id, direccion, telefono, metodo_pago, total, estado)
VALUES (3, 'Heredia, Central, Mercedes. Frente a la iglesia católica', '8666-3333', 'Contra entrega', 14.50, 'Pendiente');

INSERT INTO orden_detalle (orden_id, producto_id, cantidad, precio)
VALUES
(3, 8, 1, 4.50),   -- Queso Mozzarella x1
(3, 9, 2, 2.35),   -- Yogurt Natural x2
(3, 4, 3, 1.10);   -- Tomate x3

UPDATE productos
SET imagen = 'manzana.png'
WHERE id = 1;

UPDATE productos
SET imagen = 'banano.png'
WHERE id = 2;

UPDATE productos
SET imagen = 'naranja.png'
WHERE id = 3;

UPDATE productos
SET imagen = 'tomate.png'
WHERE id = 4;

UPDATE productos
SET imagen = 'lechuga.png'
WHERE id = 5;