DROP TABLE IF EXISTS `movie_review`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS `user` (
  `id`        INT           AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(255)  NOT NULL,
  `lastName`  VARCHAR(255)  NOT NULL,
  `password`  VARCHAR(255)  NOT NULL,
  `email`     VARCHAR(255)  NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS `movie_review` (
  `id`      INT AUTO_INCREMENT PRIMARY KEY,
  `movieId` INT NOT NULL,
  `userId`  INT NOT NULL,
  `review`  TEXT,
  `rating`  INT,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
