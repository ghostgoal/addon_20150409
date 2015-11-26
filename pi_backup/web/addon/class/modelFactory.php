<?php
class class_modelFactory
{
	protected $m_model_map;
	protected $m_class_quey;
	protected $m_cache_map;
	
	function __construct($model_map,$class_query)
	{
		$this->m_model_map =$model_map;
		$this->m_class_quey = $class_query;
		$this->m_cache_map = array();
	}
	
	function getDatabase($table)
	{
		return substr($table,0,stripos($table,'.'));
	}
	function getTableFields($db,$table)
	{
		if(isset($this->m_cache_map[$table]))
		{
			return $this->m_cache_map[$table];
		}else
		{
			$fmt = 'describe %s';
			$query = sprintf($fmt,$table);
			$res = $this->m_class_quey->query($db,$query);
			
			if($res)
			{
				$map = array();
				while($data =mysql_fetch_assoc($res))
				{
					$map[$data['Field']] = ($data['Default'] == 'NULL') ? null : $data['Default'];
				}
				
				$json  = json_encode($map);
				$this->m_cache_map[$table] = $json;
				return $json;
				
			}
			
			return false;
		}
	}
	
	function createModel($name)
	{
		if(isset($this->m_model_map[$name]))
		{
			$table = $this->m_model_map[$name];
			
			$db = $this->getDatabase($table);
			
			$model = new class_table($table,$db);
			
			
			$map = $this->getTableFields($db,$table);
	
			$model->fromJSON($map);
			
				/* 	var_dump($model); */
/* 		var_dump($model);	 */
			return $model;
		}
		
		return false;
	}
}
?>