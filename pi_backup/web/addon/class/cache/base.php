<?php
abstract class class_cache_base
{
	protected $m_class_table;
	protected $m_class_session;
	protected $m_cache_timeout;
	function __construct($class_table,$class_session,$cache_timeout)
	{
		$this->m_class_table = $class_table;
		$this->m_class_session = $class_session;
		$this->m_cache_timeout = $cache_timeout;
	}
	
	function getCacheModel()
	{
		return $this->m_class_table;
	}
	function getCacheSession()
	{
		return $this->m_class_session;
	}
	function getCacheTimeout()
	{
		return $this->m_cache_timeout;
	}
	function getCacheID($id)
	{
		return md5($id);
	}
	function update()
	{
		
		$timeout = func_num_args() ? func_get_arg(0) : $this->getCacheTimeout();
		$cache = $this->getCacheModel();
		$fmt =  'where unix_timestamp(time) + %s < unix_timestamp()';
		
		$where = sprintf($fmt,$timeout);
		return $this->getCacheSession()->delete($cache,$where);
		
	}
	abstract function save();
	abstract function load();
	abstract function clear();
	
	
	
}
?>