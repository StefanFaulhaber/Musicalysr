-- MySQL dump 10.13  Distrib 5.7.16-10, for Linux (x86_64)
--
-- Host: localhost    Database: mbdb
-- ------------------------------------------------------
-- Server version	5.7.16-10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `release_group_primary_type`
--

DROP TABLE IF EXISTS `release_group_primary_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `release_group_primary_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `child_order` int(11) NOT NULL DEFAULT '0',
  `description` text,
  `gid` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `release_group_primary_type_idx_gid` (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `release_group_primary_type`
--

LOCK TABLES `release_group_primary_type` WRITE;
/*!40000 ALTER TABLE `release_group_primary_type` DISABLE KEYS */;
INSERT INTO `release_group_primary_type` VALUES (1,'Album',NULL,1,NULL,'f529b476-6e62-324f-b0aa-1f3e33d313fc'),(2,'Single',NULL,2,NULL,'d6038452-8ee0-3f68-affc-2de9a1ede0b9'),(3,'EP',NULL,3,NULL,'6d0c5bf6-7a33-3420-a519-44fc63eedebf'),(11,'Other',NULL,99,NULL,'4fc3be2b-de1e-396b-a933-beb8f1607a22'),(12,'Broadcast',NULL,4,NULL,'3b2e49e1-2875-37b8-9fa9-1f7cf3f49900');
/*!40000 ALTER TABLE `release_group_primary_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-16 12:09:52
