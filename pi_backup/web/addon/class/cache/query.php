<?php
class class_cache_query extends class_cache_base
{
	function __construct($class_table,$class_session,$cache_timeout)
	{
		parent::__construct($class_table,$class_session,$cache_timeout);
	}
	function getQueryCacheID($query)
	{
		return $this->getCacheID($query);
	}
	
	function save()
	{
		if(func_num_args() ==3)
		{
			$table = func_get_arg(0);
			$query = func_get_arg(1);
			$result = func_get_arg(2);
			
			$cache = $this->getCacheModel();
			$cache->{'ID'} = $this->getQueryCacheID($query);
			$cache->{'TID'} =$table;
			$cache->{'RESULT'} =mysql_real_escape_string( $result);
			$cache->{'TIME'}=null;

			return $this->getCacheSession()->save($cache);
			
		}
		
		return false;
	}
	function load()
	{
		if(func_num_args() ==2)
		{
			$table = func_get_arg(0);
			$query = func_get_arg(1);
			
			$cache = $this->getCacheModel();
			
			if($this->getCacheSession()->load($cache,$this->getQueryCacheID($query)))
			{
				return $cache->{'RESULT'};
			}
			
			return false;
		}
		return false;
	}
	function clear()
	{
		
		if(func_num_args() == 1)
		{
			$table = func_get_arg(0);
			
			$cache = $this->getCacheModel();
			$fmt = 'where TID="%s"';
			$where = sprintf($fmt,$table);
			return $this->getCacheSession()->delete($cache,$where);
		}
		
		return false;
	}
	
	
}
?>