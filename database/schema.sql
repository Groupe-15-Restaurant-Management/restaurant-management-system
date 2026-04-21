-- Création de la base de données
CREATE DATABASE IF NOT EXISTS restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant_db;

-- Table role
CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table user
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table table (restaurant tables)
CREATE TABLE IF NOT EXISTS `table` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL UNIQUE,
    capacite INT NOT NULL DEFAULT 4,
    statut ENUM('libre', 'occupee', 'reservee') DEFAULT 'libre',
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table plat
CREATE TABLE IF NOT EXISTS plat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    description TEXT,
    temps_preparation INT DEFAULT 15,
    categorie VARCHAR(50) DEFAULT 'plat_principal',
    image_url VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table commande
CREATE TABLE IF NOT EXISTS commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    serveur_id INT NOT NULL,
    client_id INT NULL,
    date_heure DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'en_preparation', 'prete', 'terminee', 'annulee') DEFAULT 'en_attente',
    montant_total DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    FOREIGN KEY (table_id) REFERENCES `table`(id) ON DELETE RESTRICT,
    FOREIGN KEY (serveur_id) REFERENCES user(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table ligne_commande
CREATE TABLE IF NOT EXISTS ligne_commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    plat_id INT NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    FOREIGN KEY (plat_id) REFERENCES plat(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table reservation
CREATE TABLE IF NOT EXISTS reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    client_id INT,
    nom_client VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(150),
    date_heure DATETIME NOT NULL,
    nombre_personnes INT NOT NULL DEFAULT 2,
    statut ENUM('confirmee', 'annulee', 'terminee') DEFAULT 'confirmee',
    occasion VARCHAR(100),
    demandes_speciales TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES `table`(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour performances
CREATE INDEX idx_commande_table ON commande(table_id);
CREATE INDEX idx_commande_statut ON commande(statut);
CREATE INDEX idx_commande_date ON commande(date_heure);
CREATE INDEX idx_ligne_commande_commande ON ligne_commande(commande_id);
CREATE INDEX idx_reservation_date ON reservation(date_heure);