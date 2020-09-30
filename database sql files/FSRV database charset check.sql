SET character_set_server = "utf8";
SET character_set_database = "utf8";
SELECT
  `tables`.`TABLE_NAME`,
  `collations`.`character_set_name`
FROM
  `information_schema`.`TABLES` AS `tables`,
  `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY` AS `collations`
WHERE
  `tables`.`table_schema` = DATABASE()
  AND `collations`.`collation_name` = `tables`.`table_collation`
;
show variables like '%charac%';