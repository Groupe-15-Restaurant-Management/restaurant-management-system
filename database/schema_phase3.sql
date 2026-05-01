-- ==========================================
-- PHASE 3 : WebSocket, Reporting, Dashboard
-- ==========================================

-- Table rapport (pour les rapports journaliers/mensuels)
CREATE TABLE IF NOT EXISTS `rapport` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('journalier', 'mensuel', 'annuel') NOT NULL,
  `date_generation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_debut` DATE NOT NULL,
  `date_fin` DATE NOT NULL,
  `contenu` JSON NOT NULL COMMENT 'KPIs, CA, top produits, occupation...',
  `chemin_fichier` VARCHAR(255) DEFAULT NULL,
  INDEX `idx_rapport_type` (`type`),
  INDEX `idx_rapport_dates` (`date_debut`, `date_fin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table audit_log (traçabilité des actions)
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(255) NOT NULL,
  `details` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `date_action` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL,
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_date` (`date_action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index composites pour optimisation des requêtes fréquentes
CREATE INDEX idx_commande_statut_date ON commande(statut, date_heure);
CREATE INDEX idx_livraison_statut_date ON livraison(statut, date_livraison_prevue);
CREATE INDEX idx_reservation_statut_date ON reservation(statut, date_heure);

-- Trigger : Log automatique des créations de commande
DELIMITER //
CREATE TRIGGER trg_log_commande_create
AFTER INSERT ON commande
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (user_id, action, details)
  VALUES (
    NEW.serveur_id,
    'commande_create',
    JSON_OBJECT('commande_id', NEW.id, 'table_id', NEW.table_id, 'montant', NEW.montant_total)
  );
END//
DELIMITER ;

-- Trigger : Log automatique des changements de statut commande
DELIMITER //
CREATE TRIGGER trg_log_commande_status
AFTER UPDATE ON commande
FOR EACH ROW
BEGIN
  IF OLD.statut != NEW.statut THEN
    INSERT INTO audit_log (user_id, action, details)
    VALUES (
      NEW.serveur_id,
      'commande_status_change',
      JSON_OBJECT('commande_id', NEW.id, 'old_status', OLD.statut, 'new_status', NEW.statut)
    );
  END IF;
END//
DELIMITER ;