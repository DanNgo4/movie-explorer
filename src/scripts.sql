DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS `user` (
  `id`        INT           AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(255)  NOT NULL,
  `lastName`  VARCHAR(255)  NOT NULL,
  `password`  VARCHAR(255)  NOT NULL,
  `email`     VARCHAR(255)  NOT NULL UNIQUE
);
