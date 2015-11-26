<?php
set_time_limit(0);
header("Content-Type: text/html;charset=utf-8");


require_once(dirname(__FILE__).'/conf/config.php');
require_once(dirname(__FILE__).'/core/main.php');

function __autoload($classname)
{
	$class  = preg_replace('/_/',"/",$classname).'.php';
	
	if(file_exists($class))
	{
		require_once($class);
	}
}

?>