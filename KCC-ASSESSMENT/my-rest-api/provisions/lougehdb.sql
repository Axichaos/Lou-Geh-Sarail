-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2023 at 01:01 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lougehdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `components`
--

CREATE TABLE `components` (
  `componentid` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `comptosupplink`
--

CREATE TABLE `comptosupplink` (
  `ctslinkid` int(10) NOT NULL,
  `componentid` int(10) NOT NULL,
  `supplierid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `prodtocomplink`
--

CREATE TABLE `prodtocomplink` (
  `ptclinkid` int(10) NOT NULL,
  `productid` int(10) NOT NULL,
  `componentid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productid` int(10) NOT NULL,
  `productname` varchar(255) NOT NULL,
  `quantity` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplierid` int(10) NOT NULL,
  `suppliername` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplierid`, `suppliername`) VALUES
(9, 'eBay'),
(10, 'Costco'),
(11, 'SaleHoo'),
(12, 'World Wide Brands'),
(13, 'Brands Gateaway'),
(14, 'Ali Baba');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `components`
--
ALTER TABLE `components`
  ADD PRIMARY KEY (`componentid`);

--
-- Indexes for table `comptosupplink`
--
ALTER TABLE `comptosupplink`
  ADD PRIMARY KEY (`ctslinkid`),
  ADD KEY `comptosupplink_ibfk_1` (`componentid`),
  ADD KEY `comptosupplink_ibfk_2` (`supplierid`);

--
-- Indexes for table `prodtocomplink`
--
ALTER TABLE `prodtocomplink`
  ADD PRIMARY KEY (`ptclinkid`),
  ADD KEY `prodtocomplink_ibfk_1` (`productid`),
  ADD KEY `prodtocomplink_ibfk_2` (`componentid`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productid`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplierid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `components`
--
ALTER TABLE `components`
  MODIFY `componentid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comptosupplink`
--
ALTER TABLE `comptosupplink`
  MODIFY `ctslinkid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `prodtocomplink`
--
ALTER TABLE `prodtocomplink`
  MODIFY `ptclinkid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplierid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comptosupplink`
--
ALTER TABLE `comptosupplink`
  ADD CONSTRAINT `comptosupplink_ibfk_1` FOREIGN KEY (`componentid`) REFERENCES `components` (`componentid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `comptosupplink_ibfk_2` FOREIGN KEY (`supplierid`) REFERENCES `supplier` (`supplierid`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `prodtocomplink`
--
ALTER TABLE `prodtocomplink`
  ADD CONSTRAINT `prodtocomplink_ibfk_1` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `prodtocomplink_ibfk_2` FOREIGN KEY (`componentid`) REFERENCES `components` (`componentid`) ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
