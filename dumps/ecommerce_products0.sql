-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `price` float NOT NULL,
  `product_image` varchar(500) DEFAULT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Harry Potter',99.6,NULL,1),(2,'The Wandering Inn',29.9,NULL,1),(5,'The Wandering Inn',29.9,NULL,1),(6,'The Wandering Inn',49.9,NULL,1),(7,'The Wandering Inn',49.9,NULL,1),(8,'The Wandering Inn',49.9,NULL,1),(9,'The Wandering Inn',49.9,NULL,1),(10,'The Wandering Inn',49.9,NULL,1),(11,'The Wandering Inn',49.9,NULL,1),(12,'The Wandering Inn',49.9,NULL,1),(13,'The Wandering Inn',49.9,'uploads\\2021-12-07T12-53-31.612Z-test_api_image.jpg',1),(14,'The Wandering Inn',49.9,'uploads\\2021-12-07T12-57-32.493Z-test_api_image.jpg',1),(15,'The Wandering Inn',49.9,'uploads\\_________________________test_api_image.jpg',1),(16,'The Wandering Inn',49.9,'uploads\\2021-12-07T13-00-22_623Z-test_api_image.jpg',1),(17,'The Wandering Inn',49.9,'uploads\\2021-12-07T13-05-57.203Z-test_api_image.jpg',1),(18,'The Wandering Inn',49.9,'uploads\\2021-12-07T13-08-55.816Z-test_api_image.jpg',1),(19,'The Wandering Inn',49.9,'uploads\\2021-12-07T13-09-11.898Z-test_api_image.jpg',1),(20,'The Wandering Inn',49.9,'uploads\\2021-12-07T13-09-25.294Z-test_api_image.jpg',1),(21,'The Wandering Inn',49.9,'uploads/2021-12-07T13-24-33.806Z-test_api_image.jpg',1),(22,'The Wandering Inn',49.9,'uploads/2021-12-07T14-02-38.100Z-test_api_image.jpg',1),(23,'The Wandering Inn',49.9,'uploads/2021-12-07T14-07-00.509Z-test_api_image.jpg',1),(24,'The Wandering Inn',49.9,'uploads/2021-12-07T19-03-05.409Z-test_api_image.jpg',1),(25,'The Wandering Inn',49.9,'uploads/2021-12-07T19-05-23.550Z-test_api_image.jpg',1),(26,'The Wandering Inn',49.9,'uploads/2021-12-07T19-07-06.604Z-test_api_image.jpg',1),(27,'The Wandering Inn',49.9,'uploads/2021-12-07T19-12-00.440Z-test_api_image.jpg',1),(28,'The Wandering Inn',49.9,'uploads/2021-12-09T10-41-02.808Z-test_api_image.jpg',1),(30,'The Wandering Inn',49.9,'uploads/2021-12-09T10-57-29.675Z-test_api_image.jpg',1),(31,'The Wandering Inn',49.9,'uploads/2021-12-09T10-58-02.998Z-test_api_image.jpg',1),(32,'The Wandering Inn',49.9,'uploads/2021-12-09T10-58-11.825Z-test_api_image.jpg',1),(35,'The Wandering Inn',29.9,'uploads/2021-12-09T13-06-07.097Z-test_api_image.jpg',1),(36,'The Wandering Inn',49.95,'uploads/2021-12-09T13-06-21.053Z-test_api_image.jpg',1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-09 16:02:38
