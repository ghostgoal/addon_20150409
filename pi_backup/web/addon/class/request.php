	<?php
class class_request extends class_base
{
	function getRequestID()
	{
		return $this->{'id'};
	}
	function getRequestHandler()
	{
		return $this->{'handler'};
	}
	function getRequestMask()
	{
		return $this->{'mask'};
	}
	function getRequestName()
	{
		return $this->{'name'};
	}
	function getRequestCacheMask()
	{
		return $this->{'cache_mask'};
	}
	
	function __construct($name,$id,$mask,$data,$handler,$cache_mask)
	{
		$this->{'name'}=$name;
		$this->{'id'}= $id;
		$this->{'mask'}=$mask;
		$this->{'handler'} = $handler;
		$this->{'cache_mask'}=$cache_mask;
		$this->init($data);
	}
	protected function init($data)
	{
		if(is_array($data))
		{
			foreach($data as $v)
			{
				$this->$v = isset($_REQUEST[$v]) ? $_REQUEST[$v] :null ;
			}
			return true;
		}
		return false;
		
	}
	
	
}

?>