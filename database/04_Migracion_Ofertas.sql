USE marketgo;

ALTER TABLE productos
    ADD COLUMN precio_oferta DECIMAL(10,2) NULL AFTER precio,
    ADD COLUMN oferta_activa BOOLEAN NOT NULL DEFAULT FALSE AFTER precio_oferta;

UPDATE productos
SET precio_oferta = CASE id
        WHEN 1 THEN 0.60
        WHEN 2 THEN 0.30
        WHEN 3 THEN 0.80
        WHEN 4 THEN 0.85
    END,
    oferta_activa = TRUE
WHERE id IN (1, 2, 3, 4);
