/*=========================================================
    MARKETGO
    Consultas de Prueba
    Universidad Politécnica Internacional
    Programación III

    Autor: Cristopher Arroyo
=========================================================*/

USE marketgo;

-- =====================================================
-- CONSULTA 1
-- Mostrar todas las categorías
-- =====================================================

SELECT *
FROM categorias;

-- =====================================================
-- CONSULTA 2
-- Mostrar todos los productos
-- =====================================================

SELECT *
FROM productos;

-- =====================================================
-- CONSULTA 3
-- Mostrar todos los usuarios
-- =====================================================

SELECT *
FROM usuarios;

-- =====================================================
-- CONSULTA 4
-- Productos con su categoría
-- =====================================================

SELECT
    p.id,
    p.nombre,
    c.nombre AS categoria,
    p.precio,
    p.stock
FROM productos p
INNER JOIN categorias c
ON p.categoria_id = c.id;

-- =====================================================
-- CONSULTA 5
-- Productos ordenados por precio
-- =====================================================

SELECT
    nombre,
    precio
FROM productos
ORDER BY precio ASC;

-- =====================================================
-- CONSULTA 6
-- Productos con poco stock
-- =====================================================

SELECT
    nombre,
    stock
FROM productos
WHERE stock <= 50;

-- =====================================================
-- CONSULTA 7
-- Productos de la categoría Frutas
-- =====================================================

SELECT
    p.nombre,
    p.precio
FROM productos p
INNER JOIN categorias c
ON p.categoria_id = c.id
WHERE c.nombre = 'Frutas';

-- =====================================================
-- CONSULTA 8
-- Cantidad de productos por categoría
-- =====================================================

SELECT
    c.nombre AS categoria,
    COUNT(p.id) AS cantidad_productos
FROM categorias c
LEFT JOIN productos p
ON c.id = p.categoria_id
GROUP BY c.id, c.nombre;

-- =====================================================
-- CONSULTA 9
-- Producto más caro
-- =====================================================

SELECT
    nombre,
    precio
FROM productos
ORDER BY precio DESC
LIMIT 1;

-- =====================================================
-- CONSULTA 10
-- Valor total del inventario
-- =====================================================

SELECT
    SUM(precio * stock) AS valor_inventario
FROM productos;

-- =====================================================
-- CONSULTA 11
-- Total de usuarios registrados
-- =====================================================

SELECT
    COUNT(*) AS total_usuarios
FROM usuarios;

-- =====================================================
-- CONSULTA 12
-- Mostrar órdenes (cuando existan)
-- =====================================================

SELECT *
FROM ordenes;

-- =====================================================
-- CONSULTA 13
-- Mostrar detalle de órdenes (cuando existan)
-- =====================================================

SELECT *
FROM orden_detalle;

SELECT id, nombre, correo, password
FROM usuarios;

SELECT nombre, imagen
FROM productos;

SELECT id, nombre
FROM productos;


