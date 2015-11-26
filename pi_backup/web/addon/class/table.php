<?php
class class_table extends class_base
{
	private $m_table_name;
	private $m_database;

	
	function getTableName()
	{
		return $this->m_table_name;
	}
	
	function getDatabase()
	{
		return $this->m_database;
	}
	
	function __construct($table,$db)
	{
		$this->m_table_name = $table;
		$this->m_database = $db;
	}
}
?>