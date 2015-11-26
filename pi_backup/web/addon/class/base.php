<?
class class_base
{
	//json_encode 中文转码的问题
	function toJSON()
	{
		return json_encode($this,JSON_UNESCAPED_UNICODE);
		
	}
	
	function fromJSON($json)
	{
		$data = json_decode($json,true);
		
		if(is_array($data))
		{
			foreach($data as $k=>$v)
			{
				$this->$k = $v;
			}
			
			return true;
		}
		
		return false;
	}
}

?>