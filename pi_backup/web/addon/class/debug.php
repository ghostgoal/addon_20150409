<?php
class class_debug 
{
	static function log($file,$func,$line,$log)
	{
		if(defined('ADDON_DEBUG'))
		{
			$fmt= '%s %s %s: %s<hr>';
			
			
			echo sprintf($fmt,$file,$func,$line,$log);
		}
		
	}
	
}
?>