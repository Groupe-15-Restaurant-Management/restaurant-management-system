-- ==========================================
-- PHASE 2 : Mises à jour et nouvelles tables
-- ==========================================

-- 1. Mise à jour table reservation pour support invité
ALTER TABLE `reservation`
  MODIFY COLUMN `client_id` INT NULL COMMENT 'NULL si réservation invité',
  ADD COLUMN `nom_contact` VARCHAR(100) NOT NULL COMMENT 'Nom du contact (invité ou client)',
  ADD COLUMN `telephone` VARCHAR(20) NOT NULL COMMENT 'Téléphone obligatoire',
  ADD COLUMN `email` VARCHAR(150) NULL,
  ADD INDEX `idx_reservation_date_heure` (`date_heure`),
  ADD INDEX `idx_reservation_statut` (`statut`);

-- 2. Table paiement
CREATE TABLE IF NOT EXISTS `paiement` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `commande_id` INT NOT NULL,
  `montant` DECIMAL(10,2) NOT NULL,
  `mode_paiement` ENUM('especes', 'carte', 'mobile_money') NOT NULL,
  `reference_transaction` VARCHAR(100) DEFAULT NULL,
  `date_paiement` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `statut` ENUM('valide', 'annule', 'en_attente') DEFAULT 'valide',
  FOREIGN KEY (`commande_id`) REFERENCES `commande`(`id`) ON DELETE CASCADE,
  INDEX `idx_paiement_commande` (`commande_id`),
  INDEX `idx_paiement_statut` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table facture
CREATE TABLE IF NOT EXISTS `facture` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero` VARCHAR(50) UNIQUE NOT NULL,
  `commande_id` INT NOT NULL,
  `paiement_id` INT DEFAULT NULL,
  `date_facture` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `montant_total` DECIMAL(10,2) NOT NULL,
  `chemin_fichier` VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (`commande_id`) REFERENCES `commande`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`paiement_id`) REFERENCES `paiement`(`id`) ON DELETE SET NULL,
  INDEX `idx_facture_commande` (`commande_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table stock
CREATE TABLE IF NOT EXISTS `stock` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom_ingredient` VARCHAR(100) UNIQUE NOT NULL,
  `quantite` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `unite` VARCHAR(20) DEFAULT 'kg',
  `seuil_min` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_stock_nom` (`nom_ingredient`),
  INDEX `idx_stock_seuil` (`seuil_min`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table mouvement_stock
CREATE TABLE IF NOT EXISTS `mouvement_stock` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stock_id` INT NOT NULL,
  `type` ENUM('entree', 'sortie', 'ajustement') NOT NULL,
  `quantite` DECIMAL(10,2) NOT NULL,
  `raison` VARCHAR(255) DEFAULT NULL,
  `date_mouvement` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`stock_id`) REFERENCES `stock`(`id`) ON DELETE CASCADE,
  INDEX `idx_mouvement_stock` (`stock_id`),
  INDEX `idx_mouvement_date` (`date_mouvement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table livraison
CREATE TABLE IF NOT EXISTS `livraison` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `commande_id` INT NOT NULL,
  `livreur_id` INT DEFAULT NULL,
  `adresse` TEXT NOT NULL,
  `date_livraison_prevue` DATETIME NOT NULL,
  `date_livraison_reelle` DATETIME DEFAULT NULL,
  `statut` ENUM('en_attente', 'en_cours', 'livree', 'annulee') DEFAULT 'en_attente',
  `frais` DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (`commande_id`) REFERENCES `commande`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`livreur_id`) REFERENCES `user`(`id`) ON DELETE SET NULL,
  INDEX `idx_livraison_commande` (`commande_id`),
  INDEX `idx_livraison_statut` (`statut`),
  INDEX `idx_livraison_livreur` (`livreur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;