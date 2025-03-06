-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 15-12-2023 a las 16:21:30
-- Versión del servidor: 10.5.21-MariaDB-cll-lve
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `narrativetwistdb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `finalized_stories`
--

CREATE TABLE `finalized_stories` (
  `FinalizedStoryID` int(11) NOT NULL,
  `RoomID` int(11) DEFAULT NULL,
  `FinalizedStoryText` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gamerooms`
--

CREATE TABLE `gamerooms` (
  `RoomID` int(11) NOT NULL,
  `RoomCode` varchar(10) NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `MaxInteractions` int(11) DEFAULT 25,
  `IsFinalized` tinyint(4) DEFAULT 0,
  `IsPublic` tinyint(1) NOT NULL DEFAULT 0,
  `Keywords` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stories`
--

CREATE TABLE `stories` (
  `StoryID` int(11) NOT NULL,
  `RoomID` int(11) DEFAULT NULL,
  `StoryText` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UserID` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `story_starts`
--

CREATE TABLE `story_starts` (
  `StartID` int(11) NOT NULL,
  `RoomID` int(11) DEFAULT NULL,
  `StoryStartText` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `DisplayName` varchar(50) DEFAULT NULL,
  `ProfilePicture` varchar(255) DEFAULT NULL,
  `VerificationToken` varchar(255) DEFAULT NULL,
  `IsVerified` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_gamerooms`
--

CREATE TABLE `user_gamerooms` (
  `UserID` int(11) NOT NULL,
  `RoomID` int(11) NOT NULL,
  `IsCreator` tinyint(1) NOT NULL DEFAULT 0,
  `CustomRoomName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
