USE restaurant_db;

-- Insertion des rôles
INSERT INTO role ( nom) VALUES 
( 'admin'),
( 'serveur'),
( 'cuisinier'),
( 'caissier'),
( 'client');

-- Insertion des utilisateurs (password = 'password123' hashé)
-- Le hash est généré avec bcrypt
INSERT INTO user ( nom, email, password_hash, telephone, role_id) VALUES
( 'Admin Principal', 'admin@restaurant.com', '$2b$12$9jh8w9LC6cOo3gUIzttnfO/1grqHOsyaZySuxwynTvb2cDVRJyOaq', '0123456789', 1),
( 'Jean Serveur', 'serveur@restaurant.com', '$2b$12$9jh8w9LC6cOo3gUIzttnfO/1grqHOsyaZySuxwynTvb2cDVRJyOaq', '0123456788', 2),
( 'Marie Cuisine', 'cuisine@restaurant.com', '$2b$12$9jh8w9LC6cOo3gUIzttnfO/1grqHOsyaZySuxwynTvb2cDVRJyOaq', '0123456787', 3);

-- Insertion des tables
INSERT INTO `table` ( numero, capacite, statut, position_x, position_y) VALUES
( 1, 2, 'libre', 100, 100),
( 2, 4, 'libre', 250, 100),
( 3, 4, 'libre', 400, 100),
( 4, 6, 'libre', 100, 250),
( 5, 6, 'libre', 250, 250),
( 6, 2, 'libre', 400, 250),
( 7, 4, 'libre', 100, 400),
( 8, 8, 'libre', 250, 400);

-- Insertion des plats
INSERT INTO plat ( nom, prix, description, temps_preparation, categorie, image_url, disponible) VALUES
( 'Salade César', 12.50, 'Salade romaine, parmesan, croûtons, sauce césar', 10, 'entree', 'salade_cesar.jpg', TRUE),
( 'Tartare de Saumon', 14.90, 'Saumon frais, avocat, agrumes, huile d''olive', 15, 'entree', 'tartare_saumon.jpg', TRUE),
( 'Burger Gourmet', 16.50, 'Bœuf charolais, cheddar, bacon, frites maison', 20, 'plat_principal', 'burger.jpg', TRUE),
( 'Filet de Bœuf', 24.90, 'Filet 200g, sauce au poivre, légumes grillés', 25, 'plat_principal', 'filet_boeuf.jpg', TRUE),
( 'Saumon Grillé', 21.50, 'Saumon frais, riz basmati, asperges', 20, 'plat_principal', 'saumon.jpg', TRUE),
( 'Pâtes Carbonara', 15.90, 'Spaghetti, guanciale, pecorino, œuf', 15, 'plat_principal', 'carbonara.jpg', TRUE),
( 'Tiramisu', 8.50, 'Mascarpone, café, cacao, biscuits champagne', 10, 'dessert', 'tiramisu.jpg', TRUE),
( 'Crème Brûlée', 9.00, 'Crème vanille, caramel croustillant', 10, 'dessert', 'creme_brulee.jpg', TRUE),
( 'Coca-Cola', 3.50, '33cl', 2, 'boisson', 'coca.jpg', TRUE),
( 'Vin Rouge', 6.50, 'Verre 15cl - Bordeaux', 2, 'boisson', 'vin_rouge.jpg', TRUE);

-- Insertion de quelques commandes de test
INSERT INTO commande ( table_id, serveur_id, date_heure, statut, montant_total) VALUES
(1, 1, 2, '2024-01-15 12:30:00', 'terminee', 35.40),
(2, 3, 2, '2024-01-15 13:00:00', 'terminee', 42.90);

INSERT INTO ligne_commande (commande_id, plat_id, quantite, prix_unitaire) VALUES
(1, 1, 2, 12.50),
(1, 3, 1, 16.50),
(1, 9, 2, 3.50),
(2, 2, 1, 14.90),
(2, 4, 1, 24.90),
(2, 10, 1, 6.50);