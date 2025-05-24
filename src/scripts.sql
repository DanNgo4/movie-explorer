DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `movie_review`;

CREATE TABLE IF NOT EXISTS `user` (
  `id`        INT           AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(255)  NOT NULL,
  `lastName`  VARCHAR(255)  NOT NULL,
  `password`  VARCHAR(255)  NOT NULL,
  `email`     VARCHAR(255)  NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS `movie_review` (
  `id`       INT AUTO_INCREMENT PRIMARY KEY,
  `movie_id` INT NOT NULL,
  `user_id`  INT NOT NULL,
  `review`   TEXT,
  `rating`   INT,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
