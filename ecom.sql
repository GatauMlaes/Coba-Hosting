-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2023 at 05:32 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecom`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_barang`
--

CREATE TABLE `tb_barang` (
  `id` int(11) NOT NULL,
  `nama_barang` varchar(100) NOT NULL,
  `kode_barang` varchar(30) NOT NULL,
  `jenis` varchar(50) NOT NULL,
  `quantitas` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `deskripsi` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_barang`
--

INSERT INTO `tb_barang` (`id`, `nama_barang`, `kode_barang`, `jenis`, `quantitas`, `harga`, `gambar`, `deskripsi`) VALUES
(41, 'Luwak White Coffe -Original', 'BRG-1675647408532', 'Minuman Sachet', 974, 1500, '16756475115731674901426909219868570_538a4c74-86ee-408c-9f70-606460ba4f68_500_500.jpg', 'Luwak White Coffee Kopi Instant merupakan kopi putih yang terbuat dari kombinasi krimer non susu dan gula murni dengan kopi luwak pilihan, dihasilkan dari biji kopi terbaik yang hanya tumbuh di Sumatera dan pulau Jawa.'),
(42, 'Mixue Ice-Cream', 'BRG-1675649041894', 'Lainnya', 1494, 15000, '16756491284201674869924317mixue-4_43.jpeg', 'Es krim Mixue terkenal karena rasanya yang lezat dan creamy, serta harganya yang terjangkau. Es krim ini terbuat dari campuran susu, gula, dan bahan-bahan lain yang dicampur dan dibekukan menjadi bentuk es krim.Es krim Mixue terkenal karena rasanya yang lezat dan creamy, serta harganya yang terjangkau. Es krim ini terbuat dari campuran susu, gula, dan bahan-bahan lain yang dicampur dan dibekukan menjadi bentuk es krim.'),
(43, 'Nasi Goreng', 'BRG-1675741555524', 'Makanan', 95, 10000, '16757416226331675052175625download (2).jpg', 'Nasi goreng adalah makanan berupa nasi yang digoreng dan dicampur dalam minyak goreng, margarin, atau mentega. Biasanya ditambah dengan kecap manis, bawang merah, bawang putih, asam jawa, lada dan bahan lainnya; seperti telur, daging ayam, dan kerupuk.');

-- --------------------------------------------------------

--
-- Table structure for table `tb_tranksaksi`
--

CREATE TABLE `tb_tranksaksi` (
  `no_invoice` varchar(30) NOT NULL,
  `kode_barang` varchar(30) NOT NULL,
  `quantitas` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `sub_harga` int(11) NOT NULL,
  `jenis` varchar(255) NOT NULL,
  `gambar` varchar(1000) NOT NULL,
  `tgl_tranksaksi` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_tranksaksi`
--

INSERT INTO `tb_tranksaksi` (`no_invoice`, `kode_barang`, `quantitas`, `harga`, `sub_harga`, `jenis`, `gambar`, `tgl_tranksaksi`) VALUES
('INV1675649153666', 'BRG-1675649041894', 3, 15000, 45000, 'Lainnya', '16756491284201674869924317mixue-4_43.jpeg', '2023-02-07 04:16:45'),
('INV1675649161648', 'BRG-1675647408532', 5, 1500, 7500, 'Minuman Sachet', '16756475115731674901426909219868570_538a4c74-86ee-408c-9f70-606460ba4f68_500_500.jpg', '2023-02-07 04:16:45'),
('INV1675743381683', 'BRG-1675741555524', 3, 10000, 30000, 'Makanan', '16757416226331675052175625download (2).jpg', '2023-02-07 04:16:45');

--
-- Triggers `tb_tranksaksi`
--
DELIMITER $$
CREATE TRIGGER `Update` AFTER INSERT ON `tb_tranksaksi` FOR EACH ROW UPDATE tb_barang SET tb_barang.quantitas = tb_barang.quantitas - NEW.quantitas WHERE tb_barang.kode_barang = NEW.kode_barang
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_barang`
--
ALTER TABLE `tb_barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kode_barang` (`kode_barang`);

--
-- Indexes for table `tb_tranksaksi`
--
ALTER TABLE `tb_tranksaksi`
  ADD KEY `kode_barang` (`kode_barang`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_barang`
--
ALTER TABLE `tb_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_tranksaksi`
--
ALTER TABLE `tb_tranksaksi`
  ADD CONSTRAINT `tb_tranksaksi_ibfk_1` FOREIGN KEY (`kode_barang`) REFERENCES `tb_barang` (`kode_barang`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
