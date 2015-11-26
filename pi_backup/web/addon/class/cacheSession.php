<?php
class class_cacheSession
{
	protected $m_class_cache;
	protected $m_class_session;
	// protected $m_cached;
	
	function __construct($class_cache,$class_session)//,$cached = true)
	{
		//$this->m_cached = $cached;
		$this->m_class_cache = $class_cache;
		$this->m_class_session = $class_session;
	}
	
	function save($class_table)
	{
		$result = $this->m_class_session->save($class_table);
		
		if($result)
		{
			$table = $class_table->getTableName();
			$this->m_class_cache->clear($table);
			
		}
		return $result;
	}
	function load($class_table,$id)
	{
		$cache = $this->m_class_cache;
		$table = $class_table->getTableName();
		$fmt = 'select * from %s where id="%s" limit 0,1';
		$query = sprintf($fmt,$table,$id);
		
		
		$data = $cache->load($table,$query);
		
		if($data)
		{
			class_debug::log(__CLASS__,__FUNCTION__,__LINE__,$data);	
			return $class_table->fromJSON($data);
			
		}else
		{
			$result = $this->m_class_session->load($class_table,$id);
			
			if($result)
			{
				class_debug::log(__CLASS__,__FUNCTION__,__LINE__,$class_table->toJSON());	
					$cache->save($table,$query,$class_table->toJSON());
				
				
			
			}
			
			
			return $result;
			
		}
		
		
		
	}
	function find($class_table,$where)
	{
		$cache = $this->m_class_cache;
		$table = $class_table->getTableName();
		$fmt = 'select * from %s %s';
		$query = sprintf($fmt,$table,$where);
		
		
		$json = $cache->load($table,$query);
		$data = json_decode($json,true);
		
		if(is_array($data))
		{
			return $data;
			
		}else
		{
			
			$data = $this->m_class_session->find($class_table,$where);
			
			if(is_array($data))
			{
				$json = json_encode($data,JSON_UNESCAPED_UNICODE);
				
				if(is_string($json))
					
					$cache->save($table,$query,$json);
				
				return $data;
			
			}
			
			
		
			
			
		}
		
		return false;
	}
	function delete($class_table,$where)
	{
		$result = $this->m_class_session->delete($class_table,$where);
		
		if($result)
		{
			$table = $class_table->getTableName();
			$this->m_class_cache->clear($table);
		
		}
		return $result;
	}
	function update($class_table,$where)
	{
		$result = $this->m_class_session->update($class_table,$where);
		
		if($result)
		{
			$table = $class_table->getTableName();
			$this->m_class_cache->clear($table);
			
		}
		return $result;
	}
	function get_count($class_table,$where)
	{
		$cache = $this->m_class_cache;
		$table = $class_table->getTableName();
		$db = $class_table->getDatabase();
		$fmt = 'select count(*) as sum from %s %s';
		$query = sprintf($fmt,$table,$where);
		$data = $cache->load($table,$query);
		
		if($data)
		{
			
			return $data;
			
		}else
		{
			$result = $this->m_class_session->get_count($class_table,$where);
			
			if($result)
			{
					
					$cache->save($table,$query,$result);
				
				
			
			}
			
			
			return $result;
			
		}
	}
}

?>