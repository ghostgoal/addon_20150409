<?php
class class_session
{
	private $m_class_query;
	
	function __construct($class_query)
	{
		$this->m_class_query = $class_query;
	}
	
	function getQuery()
	{
		return $this->m_class_query;
	}
	
	function save($class_table)
	{
		$table = $class_table->getTableName();
		$db = $class_table->getDatabase();
		$fmt = 'insert into %s values(\'%s\')';
		
		$data = json_decode($class_table->toJSON(),true);
		$values = implode('\',\'',$data);
		
		$query = sprintf($fmt,$table,$values);
		$query = preg_replace('/\'\'/','null',$query);
		
	/* 	echo $query; */
		$res = $this->getQuery()->query($db,$query);
		
		/* var_dump($res); */
		if($res )
		{
			$id =  mysql_insert_id();
			return $id ? $id : mysql_affected_rows();
		}
		
		return false;
	}
	function load($class_table,$id)
	{
		$table = $class_table->getTableName();
		$db = $class_table->getDatabase();
		$fmt = 'select * from %s where id="%s" limit 0,1';
		$query = sprintf($fmt,$table,$id);
		$res = $this->getQuery()->query($db,$query);
		
		if($res && (mysql_num_rows($res) == 1))
		{
			$data = mysql_fetch_assoc($res);
			
			$json = json_encode($data,JSON_UNESCAPED_UNICODE);
			
			/* 	class_debug::log(__CLASS__,__FUNCTION__,__LINE__,var_dump($data)); */
	/* 		
			class_debug::log(__CLASS__,__FUNCTION__,__LINE__,$json); */
			
			return $class_table->fromJSON($json);
			
		
		}
		
		return false;
	}
	function find($class_table,$where)
	{
		$table = $class_table->getTableName();
		$db = $class_table->getDatabase();
		$fmt = 'select * from %s %s';
		$query = sprintf($fmt,$table,$where);
		$res = $this->getQuery()->query($db,$query);
		
		if($res && ($num = mysql_num_rows($res) ))
		{
			$list = array();
			for($i =0;$i <$num ;$i ++)
			{
				$data = mysql_fetch_assoc($res);
				$list[$i] = $data;
			}
			
			return $list;
			
			
		}
		
		return false;
	}
	function delete($class_table,$where)
	{
		$table = $class_table->getTableName();
		$db = $class_table->getDatabase();
		$fmt = 'delete from %s %s';
		
		$query = sprintf($fmt,$table,$where);
		
		
		$res = $this->getQuery()->query($db,$query);
		
		if($res )
		{
			return mysql_affected_rows();
		}
		
		return false;
	}
	function update($class_table,$where)
	{
		$table = $class_table->getTableName();
		$db = $class_table->getDatabase();
		$fmt = 'update %s set %s where id="%s"';
		$id = $class_table->{'ID'};
		/* $data = json_decode($class_table->toJSON(),true);
		$values = implode(',',$data); */
		$query = sprintf($fmt,$table,$where,$id);
	/* 	echo $query; */
		$res = $this->getQuery()->query($db,$query);
		
		if($res )
		{
			return mysql_affected_rows();
		}
		
		return false;
	}
	
	function get_count($class_table,$where)
	{
		$table = $class_table->getTableName();
		$db = $class_table->getDatabase();
		$fmt = 'select count(*) as sum from %s %s';
		$query = sprintf($fmt,$table,$where);
		$res = $this->getQuery()->query($db,$query);
		
		if($res && (mysql_num_rows($res) == 1))
		{
			$data = mysql_fetch_assoc($res);
			
			
			
			return $data['sum'];
			
		
		}
		
		return false;
	}
	
	
}

?>