<?php
class class_query
{
	private $m_conn;
	
	function __construct($username,$password,$servername='localhost')
	{
		$this->m_conn = mysql_connect($servername,$username,$password);
	}
	
	function query($db,$query)
	{
		if($this->m_conn)
		{
			mysql_select_db($db,$this->m_conn);
			
				
			$res =  mysql_query($query,$this->m_conn);
			
			if(!$res)
			{
				class_debug::log(__CLASS__,__FUNCTION__,__LINE__,$query);
				class_debug::log(__CLASS__,__FUNCTION__,__LINE__,mysql_error($this->m_conn));
			}
			
			return $res;
		}
		
		return false;
	}
	
	function __destruct()
	{
		if($this->m_conn)
		{
			mysql_close($this->m_conn);
		}
	}
}


?>