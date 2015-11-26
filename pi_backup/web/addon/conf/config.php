<?php
define('ADDON_CONFIG',true);
define('GUEST_ID',0);
define('ADDON_DEBUG',true);


//系统配置
$system_mysql_map = array('username'=>'root','password'=>'hoopxxl442','servername'=>'localhost');
$system_request_map = array(
	'login'=>array('id'=>'login','mask'=>0,'data'=>array('username','password'),'handler'=>'handler_login'),
);
$system_model_map = array('user'=>'addon.users');

//缓存配置
$cache_model_map = array('request'=>'cache.addon_request_cache','query'=>'cache.addon_query_cache');
$cache_timeout_map = array('requset'=>24*60*60,'query'=>24*60*60);



?>