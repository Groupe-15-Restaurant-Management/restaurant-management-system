USE restaurant_db;

INSERT INTO users (nom, email, telephone, hashed_password, role) VALUES
('Admin', 'admin@restaurant.com', '+243988956789', '$2b$12$LQv3c1yqBwlkHsZ5M5qQ5eYKJ8vF9zKZL5xJ8vF9zKZL5xJ8vF9zK', 'admin'),
('Client Test', 'client@test.com', '+2439756456780', '$2b$12$LQv3c1yqBwlkHsZ5M5qQ5eYKJ8vF9zKZL5xJ8vF9zKZL5xJ8vF9zK', 'client');

INSERT INTO plats (nom, description, prix, categorie, temps_preparation) VALUES
('Risotto aux champignons', 'Risotto crémeux aux champignons frais', 18.50, 'Plat principal', 25),
('Salade César', 'Salade fraîche avec poulet grillé', 12.00, 'Entrée', 10),
('Tiramisu', 'Dessert italien traditionnel', 8.50, 'Dessert', 5);