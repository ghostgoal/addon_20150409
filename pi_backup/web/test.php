<?php
define('CACHE_TIMEOUT',300);
define('CACHE_DIR',dirname(__FILE__).'/cache/');
echo CACHE_TIMEOUT;
echo CACHE_DIR;
class a {
	public $foo;
	public $b='b';
	function init($props)
	{
		foreach($props as $v=>$k)
		{
			$this->$v = $k;
		}
	}
	function invoke($func)
	{
		var_dump($func);
		echo gettype($func);
		echo get_class($func);
	}	
}
function map($obj)
{
	$props = array('id'=>'id','test'=>'test');

	foreach($props as $k=>$v)
	{
		$obj->$k = $v;
	}
}
define('THIS','a');
$aa = new a();
$aa->init(array('id'=>0,'name'=>'guest'));
//var_dump($aa);
var_dump(THIS);
$aa->invoke(function($a,$b){echo $a.$b;});
$foo = create_function('$a','return $a;');
$aa->invoke($foo);
var_dump($aa);
$j = json_encode($aa);
echo $j;
var_dump(json_decode($j,true));
var_dump(json_decode($j));
ob_start();
readfile('addon.users.json');

$jj = ob_get_contents();
ob_end_flush();

var_dump($jj);
echo '<hr>';
var_dump(json_decode($jj));
echo '<hr>';
function getTableFields($db,$table)
{
	$conn = mysql_connect('localhost','root','hoopxxl442');
	
	if($conn)
	{
		mysql_select_db($db,$conn);
		$fmt = 'describe %s';
		$query = sprintf($fmt,$table);
		$res = mysql_query($query,$conn);
		
		if($res)
		{
			$map = array();
			while($data = mysql_fetch_assoc($res))
			{
				//array_push($map,$data['Field']);
				$map[$data['Field']] = null;
			}
			
			return $map;
		}
		
		
	}
}
var_dump(getTableFields('addon','users'));

$content = getTableFields('addon','users');
$content = json_encode($content);
$fp = fopen('addon.users.json','w');
fwrite($fp,$content);
fclose($fp);
echo '<hr>';
echo md5('select * from users');
?>
