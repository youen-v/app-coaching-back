-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 04 juil. 2025 à 14:24
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projet_annuel`
--

-- --------------------------------------------------------

--
-- Structure de la table `daily_macros`
--

DROP TABLE IF EXISTS `daily_macros`;
CREATE TABLE IF NOT EXISTS `daily_macros` (
  `user_id` int NOT NULL,
  `macro_date` date NOT NULL,
  `calories` int DEFAULT NULL,
  `protein_g` int DEFAULT NULL,
  `carbs_g` int DEFAULT NULL,
  `fat_g` int DEFAULT NULL,
  PRIMARY KEY (`user_id`,`macro_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `daily_steps`
--

DROP TABLE IF EXISTS `daily_steps`;
CREATE TABLE IF NOT EXISTS `daily_steps` (
  `user_id` int NOT NULL,
  `step_date` date NOT NULL,
  `steps` int DEFAULT NULL,
  PRIMARY KEY (`user_id`,`step_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
CREATE TABLE IF NOT EXISTS `exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sport_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `default_unit` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ex_sport` (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `log_exercises`
--

DROP TABLE IF EXISTS `log_exercises`;
CREATE TABLE IF NOT EXISTS `log_exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workout_log_id` int DEFAULT NULL,
  `exercise_id` int DEFAULT NULL,
  `position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_le_wlog` (`workout_log_id`),
  KEY `fk_le_exercise` (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `log_sets`
--

DROP TABLE IF EXISTS `log_sets`;
CREATE TABLE IF NOT EXISTS `log_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `log_exercise_id` int DEFAULT NULL,
  `set_index` int DEFAULT NULL,
  `reps` int DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `duration_sec` int DEFAULT NULL,
  `rest_sec` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ls_lexercise` (`log_exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programs`
--

DROP TABLE IF EXISTS `programs`;
CREATE TABLE IF NOT EXISTS `programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `goal` text,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prog_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `runs`
--

DROP TABLE IF EXISTS `runs`;
CREATE TABLE IF NOT EXISTS `runs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `distance_km` decimal(6,2) DEFAULT NULL,
  `duration_sec` int DEFAULT NULL,
  `run_date` date DEFAULT NULL,
  `route` text,
  PRIMARY KEY (`id`),
  KEY `fk_runs_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sports`
--

DROP TABLE IF EXISTS `sports`;
CREATE TABLE IF NOT EXISTS `sports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_sports`
--

DROP TABLE IF EXISTS `user_sports`;
CREATE TABLE IF NOT EXISTS `user_sports` (
  `user_id` int NOT NULL,
  `sport_id` int NOT NULL,
  `started_at` date DEFAULT NULL,
  PRIMARY KEY (`user_id`,`sport_id`),
  KEY `fk_us_sport` (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `workouts`
--

DROP TABLE IF EXISTS `workouts`;
CREATE TABLE IF NOT EXISTS `workouts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int DEFAULT NULL,
  `sport_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `scheduled_on` date DEFAULT NULL,
  `position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_wo_prog` (`program_id`),
  KEY `fk_wo_sport` (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `workout_exercises`
--

DROP TABLE IF EXISTS `workout_exercises`;
CREATE TABLE IF NOT EXISTS `workout_exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workout_id` int DEFAULT NULL,
  `exercise_id` int DEFAULT NULL,
  `position` int DEFAULT NULL,
  `target_sets` int DEFAULT NULL,
  `target_reps` int DEFAULT NULL,
  `target_weight` decimal(10,2) DEFAULT NULL,
  `target_time` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_wex_workout` (`workout_id`),
  KEY `fk_wex_exercise` (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `workout_logs`
--

DROP TABLE IF EXISTS `workout_logs`;
CREATE TABLE IF NOT EXISTS `workout_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `workout_id` int DEFAULT NULL,
  `performed_at` timestamp NULL DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`id`),
  KEY `fk_wl_user` (`user_id`),
  KEY `fk_wl_workout` (`workout_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `workout_sets`
--

DROP TABLE IF EXISTS `workout_sets`;
CREATE TABLE IF NOT EXISTS `workout_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workout_exercise_id` int DEFAULT NULL,
  `set_index` int DEFAULT NULL,
  `target_reps` int DEFAULT NULL,
  `target_weight` decimal(10,2) DEFAULT NULL,
  `target_time` int DEFAULT NULL,
  `rest_seconds` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ws_wexercise` (`workout_exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `daily_macros`
--
ALTER TABLE `daily_macros`
  ADD CONSTRAINT `fk_macros_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `daily_steps`
--
ALTER TABLE `daily_steps`
  ADD CONSTRAINT `fk_steps_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `exercises`
--
ALTER TABLE `exercises`
  ADD CONSTRAINT `fk_ex_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`);

--
-- Contraintes pour la table `log_exercises`
--
ALTER TABLE `log_exercises`
  ADD CONSTRAINT `fk_le_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  ADD CONSTRAINT `fk_le_wlog` FOREIGN KEY (`workout_log_id`) REFERENCES `workout_logs` (`id`);

--
-- Contraintes pour la table `log_sets`
--
ALTER TABLE `log_sets`
  ADD CONSTRAINT `fk_ls_lexercise` FOREIGN KEY (`log_exercise_id`) REFERENCES `log_exercises` (`id`);

--
-- Contraintes pour la table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `fk_prog_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `runs`
--
ALTER TABLE `runs`
  ADD CONSTRAINT `fk_runs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `user_sports`
--
ALTER TABLE `user_sports`
  ADD CONSTRAINT `fk_us_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`),
  ADD CONSTRAINT `fk_us_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `workouts`
--
ALTER TABLE `workouts`
  ADD CONSTRAINT `fk_wo_prog` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`),
  ADD CONSTRAINT `fk_wo_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`);

--
-- Contraintes pour la table `workout_exercises`
--
ALTER TABLE `workout_exercises`
  ADD CONSTRAINT `fk_wex_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  ADD CONSTRAINT `fk_wex_workout` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`);

--
-- Contraintes pour la table `workout_logs`
--
ALTER TABLE `workout_logs`
  ADD CONSTRAINT `fk_wl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_wl_workout` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`);

--
-- Contraintes pour la table `workout_sets`
--
ALTER TABLE `workout_sets`
  ADD CONSTRAINT `fk_ws_wexercise` FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
