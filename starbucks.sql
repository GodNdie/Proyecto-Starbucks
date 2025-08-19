-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: starbucks_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `boletas`
--

DROP TABLE IF EXISTS `boletas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boletas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint DEFAULT NULL,
  `numero_orden` varchar(255) DEFAULT NULL,
  `fecha_emision` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `metodo_pago` varchar(255) DEFAULT NULL,
  `local_nombre` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `igv` decimal(10,2) DEFAULT NULL,
  `monto_total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  CONSTRAINT `boletas_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boletas`
--

LOCK TABLES `boletas` WRITE;
/*!40000 ALTER TABLE `boletas` DISABLE KEYS */;
/*!40000 ALTER TABLE `boletas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cafes`
--

DROP TABLE IF EXISTS `cafes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cafes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cafes`
--

LOCK TABLES `cafes` WRITE;
/*!40000 ALTER TABLE `cafes` DISABLE KEYS */;
INSERT INTO `cafes` VALUES (1,'Latte','Café espresso con leche vaporizada',13.5),(2,'Café Americano','Café negro con agua caliente',9),(3,'Capuccino','Espresso con espuma de leche',12),(4,'Mocaccino','Espresso con leche, chocolate y espuma',14),(5,'Espresso Doble','Doble carga de café espresso',8.5),(6,'Frappuccino Mocha','Bebida helada con café, leche y chocolate',16),(7,'Frappuccino Vainilla','Bebida helada con café y esencia de vainilla',16),(8,'Matcha Latte','Té verde japonés con leche',15),(9,'Chocolate Caliente','Bebida caliente con chocolate cremoso',12),(10,'Cold Brew','Café infusionado en frío por 20 horas',14),(11,'Croissant de Mantequilla','Pan francés hojaldrado clásico',7.5),(12,'Muffin de Blueberry','Bizcocho con arándanos y topping de azúcar',9),(13,'Sandwich de Jamón y Queso','Pan artesanal con jamón inglés y queso cheddar',12.5),(14,'Baguette Vegetariana','Pan baguette con vegetales y aderezo especial',11),(15,'Café Helado','Café frío con hielo y un toque de leche',10);
/*!40000 ALTER TABLE `cafes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredientes`
--

DROP TABLE IF EXISTS `ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `precio_adicional` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredientes`
--

LOCK TABLES `ingredientes` WRITE;
/*!40000 ALTER TABLE `ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locales`
--

DROP TABLE IF EXISTS `locales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locales` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locales`
--

LOCK TABLES `locales` WRITE;
/*!40000 ALTER TABLE `locales` DISABLE KEYS */;
INSERT INTO `locales` VALUES (1,'Starbucks Larcomar','Centro Comercial Larcomar, Malecón de la Reserva 610','Lima',1),(2,'Starbucks San Isidro','Av. Rivera Navarrete 501, San Isidro','Lima',1),(3,'Starbucks Miraflores Kennedy','Av. Pardo 610, Miraflores','Lima',1),(4,'Starbucks Jockey Plaza','Av. Javier Prado Este 4200, Santiago de Surco','Lima',1),(5,'Starbucks Aeropuerto Jorge Chávez','Av. Elmer Faucett S/N, Callao','Callao',1);
/*!40000 ALTER TABLE `locales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodos_pago`
--

DROP TABLE IF EXISTS `metodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodos_pago` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `plataforma` varchar(255) DEFAULT NULL,
  `numero_tarjeta` varchar(255) DEFAULT NULL,
  `icono_url` varchar(255) DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `metodos_pago_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_ingredientes`
--

DROP TABLE IF EXISTS `pedido_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_ingredientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint NOT NULL,
  `ingrediente_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ped_ing` (`pedido_id`,`ingrediente_id`),
  KEY `ingrediente_id` (`ingrediente_id`),
  KEY `idx_pi_pedido` (`pedido_id`),
  CONSTRAINT `pedido_ingredientes_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  CONSTRAINT `pedido_ingredientes_ibfk_2` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_ingredientes`
--

LOCK TABLES `pedido_ingredientes` WRITE;
/*!40000 ALTER TABLE `pedido_ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_personalizaciones`
--

DROP TABLE IF EXISTS `pedido_personalizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_personalizaciones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint NOT NULL,
  `personalizacion_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ped_per` (`pedido_id`,`personalizacion_id`),
  KEY `personalizacion_id` (`personalizacion_id`),
  KEY `idx_pp_pedido` (`pedido_id`),
  CONSTRAINT `pedido_personalizaciones_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  CONSTRAINT `pedido_personalizaciones_ibfk_2` FOREIGN KEY (`personalizacion_id`) REFERENCES `personalizaciones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_personalizaciones`
--

LOCK TABLES `pedido_personalizaciones` WRITE;
/*!40000 ALTER TABLE `pedido_personalizaciones` DISABLE KEYS */;
INSERT INTO `pedido_personalizaciones` VALUES (1,3,6),(2,3,12),(3,3,23),(4,3,25),(5,4,7),(6,4,11),(7,4,23),(8,4,24),(9,5,6),(10,5,19),(11,5,23),(12,8,5),(13,8,19),(14,8,23),(16,9,5),(15,9,17),(17,9,18),(18,9,20),(19,9,23),(20,10,6),(21,10,18),(22,10,21),(23,10,23),(24,11,5),(25,11,19),(27,12,8),(26,12,14),(28,12,19),(29,12,23),(30,12,26),(31,13,6),(32,13,18),(33,13,19),(34,13,20),(35,14,6),(36,14,19),(37,14,20),(38,14,23),(40,15,4),(39,15,17),(41,15,18),(42,15,20),(43,15,21),(44,15,23),(45,16,7),(46,16,19);
/*!40000 ALTER TABLE `pedido_personalizaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint DEFAULT NULL,
  `cafe_id` bigint DEFAULT NULL,
  `temperatura` varchar(255) DEFAULT NULL,
  `fecha_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` double DEFAULT NULL,
  `cantidad` int NOT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `local_id` bigint DEFAULT NULL,
  `metodo_pago_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `cafe_id` (`cafe_id`),
  KEY `FKn17c4lq77fuq7ag5s9n2i02si` (`local_id`),
  KEY `FK1406bqgphpafvi9n6bkd1twa7` (`metodo_pago_id`),
  CONSTRAINT `FK1406bqgphpafvi9n6bkd1twa7` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`),
  CONSTRAINT `FKn17c4lq77fuq7ag5s9n2i02si` FOREIGN KEY (`local_id`) REFERENCES `locales` (`id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,4,2,NULL,'2025-07-31 04:19:13',NULL,1,'2025-07-31 04:19:13.038934',NULL,NULL,NULL),(2,4,4,NULL,'2025-07-31 04:31:30',NULL,1,'2025-07-31 04:31:30.933027',NULL,NULL,NULL),(3,4,2,NULL,'2025-07-31 05:17:44',NULL,1,'2025-07-31 05:17:44.220263',NULL,NULL,NULL),(4,4,10,NULL,'2025-07-31 08:53:17',30.8,2,'2025-07-31 08:53:17.198801',NULL,NULL,NULL),(5,4,3,'Tibio','2025-07-31 21:14:05',55.6,4,'2025-07-31 21:14:05.614623',NULL,NULL,NULL),(8,4,3,'Tibio','2025-08-12 10:49:39',13.2,1,NULL,'pendiente',NULL,NULL),(9,4,3,'Iced','2025-08-12 10:49:39',13.7,1,NULL,'pendiente',NULL,NULL),(10,4,1,'Iced','2025-08-16 23:48:23',15.899999999999999,1,NULL,'pendiente',NULL,NULL),(11,4,1,'Iced','2025-08-18 09:16:37',14,1,NULL,'pendiente',NULL,NULL),(12,4,9,'Tibio','2025-08-18 09:19:02',13.899999999999999,1,NULL,'pendiente',NULL,NULL),(13,4,2,'Tibio','2025-08-18 09:21:41',11.2,1,NULL,'pendiente',NULL,NULL),(14,4,3,'Tibio','2025-08-18 13:04:39',14.399999999999999,1,NULL,'pendiente',NULL,NULL),(15,4,3,'Caliente','2025-08-19 08:56:25',14.2,1,NULL,'pendiente',NULL,NULL),(16,4,10,'Tibio','2025-08-19 08:56:25',15.2,1,NULL,'pendiente',NULL,NULL);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalizaciones`
--

DROP TABLE IF EXISTS `personalizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalizaciones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) DEFAULT NULL,
  `valor` varchar(255) DEFAULT NULL,
  `precio_adicional` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizaciones`
--

LOCK TABLES `personalizaciones` WRITE;
/*!40000 ALTER TABLE `personalizaciones` DISABLE KEYS */;
INSERT INTO `personalizaciones` VALUES (1,'tamaño','Tall',0),(2,'tamaño','Grande',0.5),(3,'tamaño','Venti',1),(4,'leche','Leche entera',0),(5,'leche','Leche descremada',0),(6,'leche','Leche de soya',0.7),(7,'leche','Leche de almendra',0.7),(8,'leche','Leche de avena',0.7),(9,'leche','Sin leche',0),(10,'temperatura','Caliente',0),(11,'temperatura','Tibio',0),(12,'temperatura','Iced',0),(13,'endulzante','Azúcar blanca',0),(14,'endulzante','Azúcar rubia',0),(15,'endulzante','Splenda',0),(16,'endulzante','Stevia',0),(17,'endulzante','Sin endulzante',0),(18,'extra','Chispas de chocolate',0.5),(19,'extra','Jarabe de vainilla',0.5),(20,'extra','Jarabe de caramelo',0.5),(21,'extra','Jarabe de avellana',0.5),(22,'extra','Espuma fría de leche',0.7),(23,'extra','Crema batida',0.7),(24,'hielo','Normal',0),(25,'hielo','Menos hielo',0),(26,'hielo','Sin hielo',0);
/*!40000 ALTER TABLE `personalizaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_ingredientes`
--

DROP TABLE IF EXISTS `stock_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_ingredientes` (
  `local_id` bigint NOT NULL,
  `ingrediente_id` bigint NOT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`local_id`,`ingrediente_id`),
  KEY `ingrediente_id` (`ingrediente_id`),
  CONSTRAINT `stock_ingredientes_ibfk_1` FOREIGN KEY (`local_id`) REFERENCES `locales` (`id`),
  CONSTRAINT `stock_ingredientes_ibfk_2` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_ingredientes`
--

LOCK TABLES `stock_ingredientes` WRITE;
/*!40000 ALTER TABLE `stock_ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `dni` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `contrasena_hash` varchar(255) DEFAULT NULL,
  `fecharegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Eidan','Tello Valencia','correoDePrueba@gmail.com','12345678','987654321','$2a$10$d8rEH3fvy2YcS7c0BbhkuebsBeq.DSM.UXxm8Sq3zraS1F1QUI.kq','2025-07-14 06:36:35'),(2,'Carlos','Bravo','garou@gmail.com','70102645',' 940816766','$2a$10$CLe8qmNklqsHTVIQVKvi8uqC1rSF5suJRqba13vQGWbXvAJDbMMyS','2025-07-14 10:33:09'),(3,'Randall','Reyes','notengopc@gmail.com','60345487',' 973839825','$2a$10$yzxgE6YryG5V.WluNXLjjubrlIXufZ95SzvVKVmvnI3osq0e.YnWG','2025-07-14 10:36:24'),(4,'Esteban','Cordova','correo550@gmail.com','12345632','789465234','$2a$10$/DSyNM0d0ZscSbTdfBA9IueSRXYZGKhhWQftsVVd.lDQ8X/vc2Wiu','2025-07-15 09:02:01'),(5,'Moises','Uziel','moisescorreo@gmail.com','23435821','653478456','$2a$10$EM26g0YiCUG.dcyDk8MY2.QYEKA4uArX4F3Og3JT..7aFhGCXyK3K','2025-07-17 09:35:07'),(6,'Carlos','Perez','tuchero@gmail.com','12324345','123456789','$2a$10$PsgK3KrWhC2ezOBqSZqaI.4sCBFWFHo.8ZNrc.ugG4IKJllNcM3q6','2025-08-19 00:25:52');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-19  1:46:35
