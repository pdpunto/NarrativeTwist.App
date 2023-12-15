-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-12-2023 a las 18:50:55
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

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
  `IsPublic` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `gamerooms`
--

INSERT INTO `gamerooms` (`RoomID`, `RoomCode`, `CreatedAt`, `MaxInteractions`, `IsFinalized`, `IsPublic`) VALUES
(1, 'PzLl54', '2023-12-06 03:01:06', 10, 0, 1),
(2, '5ESGcW', '2023-12-06 14:07:11', 5, 0, 0),
(3, 'aUmkOU', '2023-12-06 14:42:32', 2, 0, 0),
(4, 'w9t8Kd', '2023-12-06 14:47:23', 2, 0, 0),
(5, 'WbgMJW', '2023-12-06 14:57:03', 2, 0, 0),
(6, 'NQ8r7v', '2023-12-06 15:03:06', 5, 1, 0),
(7, 'xhTERW', '2023-12-06 15:24:49', 5, 1, 0),
(8, 'GUuRNZ', '2023-12-06 22:22:11', 2, 0, 0),
(9, 'PL99Va', '2023-12-07 00:27:27', 10, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stories`
--

CREATE TABLE `stories` (
  `StoryID` int(11) NOT NULL,
  `RoomID` int(11) DEFAULT NULL,
  `StoryText` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `stories`
--

INSERT INTO `stories` (`StoryID`, `RoomID`, `StoryText`, `CreatedAt`) VALUES
(1, 1, 'gfbdvsdcasxfbgdfvscsd', '2023-12-06 03:35:55'),
(2, 2, 'rdsdsasdj', '2023-12-06 14:07:22'),
(3, 2, 'hnfgbdfvscaxmjghnfgbd', '2023-12-06 14:12:42'),
(4, 2, 'hjgfds', '2023-12-06 14:20:55'),
(5, 2, 'erfwdqsawfewef', '2023-12-06 14:29:19'),
(6, 2, 'wwfescacscscwece', '2023-12-06 14:29:25'),
(7, 3, 'Había una vez tres cerditos que vivían al aire libre cerca del bosque.\n\nA menudo se sentían inquietos porque por allí solía pasar un lobo malvado y peligroso que amenazaba con comérselos.', '2023-12-06 14:42:42'),
(8, 4, 'Había una vez tres cerditos que vivían al aire libre cerca del bosque.\n\nA menudo se sentían inquietos porque por allí solía pasar un lobo malvado y peligroso que amenazaba con comérselos.', '2023-12-06 14:47:46'),
(9, 5, 'Había una vez tres cerditos que vivían al aire libre cerca del bosque.\n\nA menudo se sentían inquietos porque por allí solía pasar un lobo malvado y peligroso que amenazaba con comérselos.', '2023-12-06 14:57:18'),
(10, 6, 'Había una vez tres cerditos que vivían al aire libre cerca del bosque.\n\nA menudo se sentían inquietos porque por allí solía pasar un lobo malvado y peligroso que amenazaba con comérselos.', '2023-12-06 15:03:13'),
(11, 6, 'Un día se pusieron de acuerdo en que lo más prudente era que cada uno construyera una casa para estar más protegidos.', '2023-12-06 15:13:48'),
(12, 6, 'svsvsd', '2023-12-06 15:14:10'),
(13, 6, 'scsdvs<v', '2023-12-06 15:14:38'),
(14, 6, 'svsvscwefwev', '2023-12-06 15:14:45'),
(15, 7, 'Había una vez tres cerditos que vivían al aire libre cerca del bosque.\n\nA menudo se sentían inquietos porque por allí solía pasar un lobo malvado y peligroso que amenazaba con comérselos.\n\nUn día se pusieron de acuerdo en que lo más prudente era que cada uno construyera una casa para estar más protegidos.', '2023-12-06 15:25:44'),
(16, 7, 'El cerdito más pequeño, que era muy vago, decidió que su casa sería de paja. Durante unas horas se dedicó a apilar cañitas secas y en un santiamén, construyó su nuevo hogar. Satisfecho, se fue a jugar.\n\n– ¡Ya no le temo al lobo feroz! – le dijo a sus hermanos.\n\nEl cerdito mediano era un poco más decidido que el pequeño pero tampoco tenía muchas ganas de trabajar.\n\nPensó que una casa de madera sería suficiente para estar seguro, así que se internó en el bosque y acarreó todos los troncos que pudo para construir las paredes y el techo. En un par de días la había terminado y muy contento, se fue a charlar con otros animales.', '2023-12-06 15:26:06'),
(17, 7, '– ¡Qué bien! Yo tampoco le temo ya al lobo feroz – comentó a todos aquellos con los que se iba encontrando.\n\nEl mayor de los hermanos, en cambio, era sensato y tenía muy buenas ideas. Quería hacer una casa confortable pero sobre todo indestructible, así que fue a la ciudad, compró ladrillos y cemento, y comenzó a construir su nueva vivienda. Día tras día, el cerdito se afanó en hacer la mejor casa posible.\n\nSus hermanos no entendían para qué se tomaba tantas molestias.\n\n– ¡Mira a nuestro hermano! – le decía el cerdito pequeño al mediano – Se pasa el día trabajando  en vez de venir a jugar con nosotros.\n\n– Pues sí. ¡Vaya tontería! No sé para qué trabaja tanto pudiendo hacerla en un periquete… Nuestras casas han quedado fenomenal y son tan válidas como la suya.', '2023-12-06 15:26:38'),
(18, 7, 'Y tal como lo dijo, comenzó a soplar y la casita de paja se desmoronó. El cerdito, aterrorizado, salió corriendo hacia casa de su hermano mediano y ambos se refugiaron allí. Pero el lobo apareció al cabo de unos segundos y gritó:\n\n– ¡Soplaré y soplaré y la casa derribaré!\n\nSopló tan fuerte que la estructura de madera empezó a moverse y al final todos los troncos que formaban la casa se cayeron y comenzaron a rodar ladera abajo. Los hermanos, desesperados, huyeron a gran velocidad y llamaron a la puerta de su hermano mayor, quien les abrió y les hizo pasar, cerrando la puerta con llave.\n\n– Tranquilos, chicos, aquí estaréis bien. El lobo no podrá destrozar mi casa.\n\nEl temible lobo llegó y por más que sopló, no pudo mover ni un solo ladrillo de las paredes. ¡Era una casa muy resistente! Aun así, no se dio por vencido y buscó un hueco por el que poder entrar.\n\nEn la parte trasera de la casa había un árbol centenario. El lobo subió por él y de un salto, se plantó en el tejado y de ahí brincó hasta la chimenea. Se deslizó por ella para entrar en la casa pero cayó sobre una enorme olla de caldo que se estaba calentado al fuego. La quemadura fue tan grande que pegó un aullido desgarrador y salió disparado de nuevo al tejado. Con el culo enrojecido, huyó para nunca más volver.', '2023-12-06 15:27:00'),
(19, 7, '– ¿Veis lo que ha sucedido? – regañó el cerdito mayor a sus hermanos – ¡Os habéis salvado por los pelos de caer en las garras del lobo! Eso os pasa por vagos e inconscientes. Hay que pensar las cosas antes de hacerlas. Primero está la obligación y luego la diversión. Espero que hayáis aprendido la lección.\n\n¡Y desde luego que lo hicieron! A partir de ese día se volvieron más responsables, construyeron una casa de ladrillo y cemento como la de su sabio hermano mayor y vivieron felices y tranquilos para siempre.', '2023-12-06 15:27:30'),
(20, 8, '– ¿Veis lo que ha sucedido? – regañó el cerdito mayor a sus hermanos – ¡Os habéis salvado por los pelos de caer en las garras del lobo! Eso os pasa por vagos e inconscientes. Hay que pensar las cosas antes de hacerlas. Primero está la obligación y luego la diversión. Espero que hayáis aprendido la lección.\n\n¡Y desde luego que lo hicieron! A partir de ese día se volvieron más responsables, construyeron una casa de ladrillo y cemento como la de su sabio hermano mayor y vivieron felices y tranquilos para siempre.', '2023-12-06 22:25:56');

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
  `ProfilePicture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `Email`, `DisplayName`, `ProfilePicture`) VALUES
(1, 'killa', '$2b$10$UjW/TfPWhIzdGUz1r1hkt.2Jr6YhdkHtMxhLAyLpMHLNLgN/0OvFy', 'jorgevueltaiz@gmail.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_gamerooms`
--

CREATE TABLE `user_gamerooms` (
  `UserID` int(11) NOT NULL,
  `RoomID` int(11) NOT NULL,
  `IsCreator` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_gamerooms`
--

INSERT INTO `user_gamerooms` (`UserID`, `RoomID`, `IsCreator`) VALUES
(1, 8, 1),
(1, 6, 0),
(1, 9, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `finalized_stories`
--
ALTER TABLE `finalized_stories`
  ADD PRIMARY KEY (`FinalizedStoryID`),
  ADD KEY `RoomID` (`RoomID`);

--
-- Indices de la tabla `gamerooms`
--
ALTER TABLE `gamerooms`
  ADD PRIMARY KEY (`RoomID`),
  ADD UNIQUE KEY `RoomCode` (`RoomCode`);

--
-- Indices de la tabla `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`StoryID`),
  ADD KEY `RoomID` (`RoomID`);

--
-- Indices de la tabla `story_starts`
--
ALTER TABLE `story_starts`
  ADD PRIMARY KEY (`StartID`),
  ADD KEY `RoomID` (`RoomID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indices de la tabla `user_gamerooms`
--
ALTER TABLE `user_gamerooms`
  ADD KEY `UserID` (`UserID`),
  ADD KEY `RoomID` (`RoomID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `finalized_stories`
--
ALTER TABLE `finalized_stories`
  MODIFY `FinalizedStoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gamerooms`
--
ALTER TABLE `gamerooms`
  MODIFY `RoomID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `stories`
--
ALTER TABLE `stories`
  MODIFY `StoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `story_starts`
--
ALTER TABLE `story_starts`
  MODIFY `StartID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `finalized_stories`
--
ALTER TABLE `finalized_stories`
  ADD CONSTRAINT `finalized_stories_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `gamerooms` (`RoomID`);

--
-- Filtros para la tabla `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `gamerooms` (`RoomID`);

--
-- Filtros para la tabla `story_starts`
--
ALTER TABLE `story_starts`
  ADD CONSTRAINT `story_starts_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `gamerooms` (`RoomID`);

--
-- Filtros para la tabla `user_gamerooms`
--
ALTER TABLE `user_gamerooms`
  ADD CONSTRAINT `user_gamerooms_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `user_gamerooms_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `gamerooms` (`RoomID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
