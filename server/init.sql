CREATE DATABASE IF NOT EXISTS `Map`;
USE `Map`;
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `Userid` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(20) NOT NULL,
  `Password` varchar(50) NOT NULL,
   PRIMARY KEY(`Userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
CREATE TABLE `Place` (
  `Placeid` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(20) NOT NULL,
  `Placename` varchar(50) NOT NULL,
  `Placeinfo` varchar(50) NOT NULL,
  `Placelng` varchar(50) NOT NULL,
  `Placelat` varchar(50) NOT NULL,
   PRIMARY KEY(`Placeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;