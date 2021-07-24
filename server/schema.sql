DROP TABLE IF EXISTS "User";

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE "User" (
  email citext UNIQUE PRIMARY KEY NOT NULL,
  search_words varchar(254)[] NOT NULL DEFAULT array[]::varchar(254)[]
);