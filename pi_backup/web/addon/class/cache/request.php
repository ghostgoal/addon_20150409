<?php
class class_cache_request extends class_cache_base
{
	function __construct($class_table,$class_session,$cache_timeout)
	{
		parent::__construct($class_table,$class_session,$cache_timeout);
	}
	function getRequestCacheID($user,$request)
	{
		$uid = $user->{'ID'};
		$json = $request->toJSON();
		$fmt = "%s@%s";
		return $this->getCacheID(sprintf($fmt,$uid,$json));
	}
	
	function save()
	{
		if(func_num_args() ==3)
		{
			$user = func_get_arg(0);
			$request = func_get_arg(1);
			$response = func_get_arg(2);
			
			$cache = $this->getCacheModel('request');
			$cache->{'ID'} = $this->getRequestCacheID($user,$request);
			$cache->{'UID'} = $user->{'ID'};
			$cache->{'REQUEST'} = mysql_real_escape_string($request->toJSON());
			$cache->{'RESPONSE'} = mysql_real_escape_string($response->toJSON());
			$cache->{'TIME'} = null;
		
			return $this->getCacheSession()->save($cache);
		}
		
		return false;
	}
	function load()
	{
		if(func_num_args() ==2)
		{
			$user = func_get_arg(0);
			$request = func_get_arg(1);
			
			$cache = $this->getCacheModel();
			$id = $this->getRequestCacheID($user,$request);
		
			if($this->getCacheSession()->load($cache,$id))
			{
				return $cache->{'RESPONSE'};
			}
		}
		return false;
	}
	function clear()
	{
		$cache = $this->getCacheModel();
		$where = "";
		return $this->getCacheSession()->delete($cache,$where);
	}
	
	
}
?>