CREATE TABLE `tx_annotate_ids` (
`mimir_id` varchar(30) NOT NULL,
`typo3_table` varchar(30) NOT NULL,
`typo3_uid` varchar(30) NOT NULL
UNIQUE `index`(`typo3_table`, `typo3_uid`);
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
