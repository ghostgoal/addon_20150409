<?php 
	
	$cid = $_GET["cid"]?$_GET["cid"]: 0;
	$tid = $_GET["tid"]?$_GET["tid"]: 0;
	echo $cid.":".$tid;
	//var_dump($_GET);

?>
