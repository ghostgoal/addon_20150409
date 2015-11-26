<?php
class class_config
{
	function getRequestMap()
	{
		return array('index'=>array('id'=>1,'mask'=>0,'handler'=>'handler_index2','data'=>array('page'),'cache_mask'=>true,'cache_timeout'=>7*24*60*60),
		'login'=>array('id'=>2,'mask'=>0,'handler'=>'handler_login','data'=>array('username','password'),'cache_mask'=>false),
		'logout'=>array('id'=>3,'mask'=>0,'handler'=>'handler_logout','data'=>array('uuid'),'cache_mask'=>false),
		'register'=>array('id'=>4,'mask'=>0,'handler'=>'handler_register','data'=>array('username','password'),'cache_mask'=>true),
		'download'=>array('id'=>5,'mask'=>1000,'handler'=>'handler_download','data'=>array('url','keyword'),'cache_mask'=>true),
		'update'=>array('id'=>6,'mask'=>1000,'handler'=>'handler_update','data'=>array('delete'),'cache_mask'=>false),
		'refresh'=>array('id'=>7,'mask'=>1000,'handler'=>'handler_refresh','data'=>array(),'cache_mask'=>false),
		'search'=>array('id'=>8,'mask'=>0,'handler'=>'handler_search2','data'=>array('keyword','page'),'cache_mask'=>true),
		'click'=>array('id'=>9,'mask'=>0,'handler'=>'handler_click','data'=>array('res_id'),'cache_mask'=>false)
		);
	}
	function getCacheMap()
	{
		return array('request'=>7*24*60*60,'query'=>7*24*60*60);
	}
	function getCacheModel()
	{
		return array('request'=>'cache.addon_request_cache','query'=>'cache.addon_query_cache');
	}
	function getSystemModel()
	{
		return array('user'=>'addon.users','res'=>'addon.resources','path'=>'addon.paths');
	}
	
	
}
?>