<?php
class class_response extends class_base
{
	
	function setError($id,$info)
	{
		$this->{'error_id'} = $id;
		$this->{'error_info'}=$info;
	}
	function setStartTime()
	{
		$this->{'start_time'} = time();
		
	}
	function setEndTime()
	{
		$this->{'end_time'} = time();
		
	}
	function setData($id,$data)
	{
		$this->{'id'} = $id;
		$this->{'data'} = $data;
	}
	function setCacheFlag()
	{
		$this->{'cached'} = true;
	}
} 
?>