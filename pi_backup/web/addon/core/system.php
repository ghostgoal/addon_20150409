<?php


class system
{
	protected $m_class_config;
	protected $m_class_query;
	protected $m_class_session;
	protected $m_class_cache;
	

	protected $m_class_model_factory;
	protected $m_class_cache_session;
	//缓存
	protected $m_class_cache_query;
	protected $m_class_cache_request;
	
	//
	protected $m_current_user;
	
	protected $m_class_response;
	function getResponse()
	{
		return $this->m_class_response;
	}
	
	function getClassQuery()
	{
		return $this->m_class_query;
	}
	
	function getClassSession()
	{
		return $this->m_class_session;
	}
	function getClassCache()
	{
		return $this->m_class_cache;
	}
	
	function getQueryCache()
	{
		return $this->m_class_cache_query;
	}
	//请求缓存相关函数
	function getRequestCache()
	{
		return $this->m_class_cache_request;
	}
	function loadRequestCache($user,$request,$cache)
	{
		if($request->getRequestCacheMask()) return $cache->load($user,$request);
		return false;
	}
	function saveRequestCache($user,$request,$response,$cache)
	{
		if($request->getRequestCacheMask()) return !$cache->save($user,$request,$response);
		return false;
		
	}
	
	
	function getCacheSession()
	{
		return $this->m_class_cache_session;
	}
	
	
	function getModel($name)
	{
		return $this->m_class_model_factory->createModel($name);
	}
	
	function getClassConfig()
	{
		return $this->m_class_config;
	}
	
	function getRequest()
	{
		$act = isset($_REQUEST['act']) ? $_REQUEST['act'] : 'index';
		
		$map = $this->getClassConfig()->getRequestMap();
		
		
		if(isset($map[$act]))
		{
			$request = $map[$act];
			return new class_request($act,$request['id'],$request['mask'],$request['data'],$request['handler'],$request['cache_mask']);
		}
		
		return false;
	
		
		
		
		
		
	}
	
	
	function dispatchRequest($class_request)
	{
		//子系统派遣
		/* $subsystem = $this->getSubsytemMap();
		
		$id = $class_request->{'id'};
		
		if(isset($subsystem[$id]))
		{
			return $subsystem[$id]->invokeRequestHandler($class_request);
		} */
		
		
		
		
		return $this->invokeRequestHandler($class_request);
	}
	//事件处理接口
	function invokeRequestHandler($class_request)
	{
	
		$handler = $class_request->getRequestHandler();
		
		if(is_string($handler) )
		{
			
			if(method_exists($this,$handler))
			{
				return call_user_func_array(array($this,$handler),array($this,$class_request));
			}
			
		}
		
		if(is_object($handler) && (get_class($hanler) == 'Closure'))
		{
			return $handler($this,$class_request);
		}
		
		return false;
		
		
	}
	
	function sendResponse($class_response)
	{
		$class_response->setEndTime();
		echo $class_response->toJSON();
	}
	
	
	function getCurrentUser()
	{
		$user = $this->getModel('user');
		
		if(isset($_SESSION['user']))
		{
			/* var_dump($_SESSION['user']); */
			$user->fromJSON($_SESSION['user']);
			
		}else
		{
			
			$this->getCacheSession()->load($user,2);
		}
		
		/* class_debug::log(__CLASS__,__FUNCTION__,__LINE__,$user->toJSON()); */
		return $user;
		
	}
	
	
	function init()
	{
		
		$response = new class_response();
		$config = new class_config(); //
		
		$username = 'root';
		$password = 'hoopxxl442';
		
		//数据库查询
		$query = new class_query($username,$password);//
		$session = new class_session($query);
		
		//数据模型
		$request_model_map = $config->getSystemModel();
		$cache_model_map = $config->getCacheModel();
		
		$modelFactory = new class_modelFactory($request_model_map,$query);//
		
		
		//数据库缓存
		$cacheFactory = new class_modelFactory($cache_model_map,$query);
		$query_cache = new class_cache_query($cacheFactory->createModel('query'),$session,$config->getCacheMap()['query']);
		
		
		$request_cache = new class_cache_request($cacheFactory->createModel('request'),$session,$config->getCacheMap()['request']);
		$request_cache->update();
		$cacheSession = new class_cacheSession($query_cache,$session);
		
		
		
		$this->m_class_config = $config;
		$this->m_class_query = $query;
		$this->m_class_session = $session;
		$this->m_class_cache  = $request_cache;
		$this->m_class_cache_query = $query_cache;
		$this->m_class_cache_request= $request_cache;
		
		$this->m_class_model_factory =$modelFactory;
		$this->m_class_cache_session = $cacheSession;
		$this->m_class_response = $response;
		$response->setStartTime();
		//
		
		if(isset($_SESSION['ssid']))
		{
			$ssid = $_SESSION['ssid'];
			
			SESSION_ID($ssid);
		}
		
		
		session_start();
		
		
		
/* 		$this->m_current_user = $this->getCurrentUser(); */
		
		
	}
	function loop()
	{
		$user = $this->getCurrentUser();
		$request = $this->getRequest();
		$cache = $this->getClassCache();
	
		
	/* 	var_dump($cache); */
		$response = $this->getResponse();
		
/* 		var_dump($cache);
		 */
		
		if($request)
		{
			//获取请求缓存
			$json = $this->loadRequestCache($user,$request,$cache);
			
			if($json)
			{
				/* var_dump(get_class_methods($response)); */
				/* echo $json; */
				$response->setCacheFlag();
				
				/* var_dump(json_decode($json));
				echo json_last_error(); */
				if(!$response->fromJSON($json))
				{
				
				
					$response->setError(0,'Invalid cache:' . json_last_error() );
				}
			}
			else
			{
			
				if($user->{'GID'} >= $request->getRequestMask())
				{
					$data  = $this->dispatchRequest($request);
					
					/* var_dump($data); */
					/* var_dump($data); */
					if($data)
					{
						$response->setData(0,$data);
						
						
						//设置请求缓存
						if($this->saveRequestCache($user,$request,$response,$cache))
						{
							$response->setError(4,'Failed to cache response!');
						}
						
			
						
					}else
					{
						$response->setError(1,'Invalid handler!');
						
					}
				}else
				{
					$response->setError(2,'No right!');
				
				}
			}
		}else
		{
			$response->setError(3,'Invalid request!');
		
		}
		
		$this->sendResponse($response);
	}
}

?>