<?php
require_once(dirname(__FILE__).'/system.php');
class main extends system
{
	protected function do_update_handler($path,$ext)
	{
		if(is_dir($path))
		{
			$dir = @dir($path);
			
			if($dir)
			{
				$list = array();
				while (($file = $dir->read()) !== false)
				{
					/* echo $file; */
					if(preg_match($ext,$file))
					{
						$file= mysql_real_escape_string($file);
						array_push($list,$file);
					}
				}
				
				$dir->close();
				
				return $list;
			}
		
		}
		
		return false;
	
	}
	
	function handler_update($system,$request)
	{
		$user = $system->getCurrentUser();
		$path = $system->getModel('path');
		$work  = $system->getModel('res');
		
	
		
		$session = $system->getCacheSession();
		$delete  = $request->{'delete'};
		if($delete =='true')
		{
			/* echo $delete; */
			$session->delete($work,""); 
		}
		
		$where = '';
		$paths = $session->find($path,$where);
/*	 	var_dump($paths); */
		if(is_array($paths))
		{
			$sum = 0;
			for($i =0; $i < count($paths);$i++)
			{
				
				
				$pid = $paths[$i]['ID'];
				$dir = $paths[$i]['PATH'];
				$ext = '/\.(mp4|avi|wmv|mkv)$/';//$paths[$i]['EXT'];
				$desc = $paths[$i]['DESC.'];
				$name = $paths[$i]['NAME'];
				
				if(!is_dir($dir)) continue;
				
				
				
				if(($list = $this->do_update_handler($dir,$ext)) && is_array($list))
				{
					for($j=0;$j < count($list);$j ++)
					{
						$file = $list[$j];
						
						$work->{'ID'}=null;
						$work->{'NAME'}=$name.$file;
						$work->{'FILENAME'}=$file;
						$work->{'KEYWORD'} = basename($file);
						$work->{'DESC.'}=$desc;
						$work->{'PATH'} =$pid;
						$work->{'COUNT'} = 0;
						$work->{'STATUS'}=1;
						$work->{'SETUP_TIME'}=null;
						
						if($session->save($work))
						{
							$sum += 1;
						}
						
					}
					
					
				}
				
				
			}
			
			if($sum >= 1)
			{
				$this->getRequestCache()->update(0);
			}
			
			return array('STATUS'=>true,'sum'=>$sum);
		}
		
		
		return array('STATUS'=>false);
		
		
	}
	
	function handler_download($system,$request)
	{
		$user =  $system->getCurrentUser();
		
		$url = $request->{'url'};
		$keyword = $request->{'keyword'};
		
		$res = $system->getModel('res');
		
		
		if($res)
		{
		/* 	var_dump($res); */
			$url = json_decode($url,true);
			$data = array();
			$success = 0;
			if(is_array($url))
			{
				$res->{'KEYWORD'} = $keyword;
				$res->{'ID'} = null;
				
				foreach($url as $v)
				{
			
					$res->{'URL'} =$v;
					$id = $system->getCacheSession()->save($res);
					
					$data[$v] = $id;
					
					if($id)
					{
						$success += 1;
					}
				}
				
				//更新缓存
			
				/* $this->getQueryCache()->update(0); */
				/* $this->getRequestCache()->update(0); */
				if($success >= 1)
				{
					$this->getRequestCache()->update(0);
				}
			
			
				return array('user'=>$user,'download'=>$data,'success'=>$success);
				
			}else
			{
				return array('user'=>$user,'download'=>false,'failed'=>'Invalid url!');
			}
			
			
			
		}
		
		
		return array('user'=>$user,'download'=>false);
		
	}
	function handler_search2($system,$request)
	{
		$user =  $system->getCurrentUser();
		$work  = $system->getModel('res');
		$session = $system->getCacheSession();
		
		
		$keyword = $request->{'keyword'};
		$keyword = preg_replace('/([\.\*\|\?\(\)\^\$\+])/','\\\\$1',$keyword);
		$keyword = preg_replace('/(\s+|-)/','|',$keyword);
		$keyword = mysql_real_escape_string($keyword);
		
		
		$page = $request->{'page'};
		$page = isset($page)? intval($page):0;
		$page_size = 10;
		
		$fmt ='where keyword regexp "%s"';
		$where = sprintf($fmt,$keyword);
		/* $data = $session->find($work,$where); */
		
		$sum = $session->get_count($work,$where);
		
		if($sum > 0)
		{
			$pages = ceil($sum /$page_size);
			
			if($page < $pages)
			{
			
				$page_start = $page * $page_size;
				$page_end   =  $page_size;
				
				$fmt ='where keyword regexp "%s" order by filename desc limit %s,%s';
				
				$where = sprintf($fmt,$keyword,$page_start,$page_end);
				/* echo $where; */
				$data = $session->find($work,$where);
			
				return array('search'=>$data,'user'=>$user,'pages'=>$pages,'sum'=>count($data),'page'=>$page,'page_size'=>$page_size);
			
			}
		}
		
		 return array('search'=>false,'user'=>$user);
	}
	
	function handler_search($system,$request)
	{
		$user =  $system->getCurrentUser();
		$work  = $system->getModel('res');
		$keyword = $request->{'keyword'};
		
		$keyword = preg_replace('/([\.\*\|\?\(\)\^\$\+])/','\\\\$1',$keyword);
		$keyword = preg_replace('/(\s+|-)/','|',$keyword);
		$keyword = mysql_real_escape_string($keyword);
		/* echo $keyword; */
		$session = $system->getCacheSession();
		$fmt ='where keyword regexp "%s"';
		$where = sprintf($fmt,$keyword);
		$data = $session->find($work,$where);
		
		if(is_array($data))
		{
			return array('search'=>$data,'user'=>$user,'pages'=>ceil(count($data)/20),'sum'=>count($data));
		}
		
		 return array('search'=>false,'user'=>$user);
	}
	function handler_index2($system,$request)
	{
		$user =  $system->getCurrentUser();
		$work  = $system->getModel('res');
		$session = $system->getCacheSession();
		
		$sum = $session->get_count($work,'');
		$page = $request->{'page'};
		$page = isset($page) ? intval($page) : 0;
		
		$page_size = 10;
			
		if($sum > 0)
		{
			$pages = ceil($sum /$page_size);
		
			if($page < $pages)
			{
				$fmt ='order by filename desc limit %s,%s';
				$where = sprintf($fmt,$page * $page_size ,$page_size);
				$data = $session->find($work,$where);
		/* 	return array('index'=>$data,'user'=>$user,'pages'=>$pages,'page'=>$page); */
				return array('index'=>$data,'user'=>$user,'pages'=>$pages,'sum'=>count($data),'page'=>$page,'page_size'=>$page_size);
			}
		}
		
			
			return array('index'=>false,'user'=>$user);
		
	}
	
	
	function handler_index($system,$request)
	{
		$user =  $system->getCurrentUser();
		$work  = $system->getModel('res');
		
		
		$session = $system->getCacheSession();
		$gid = $user->{'GID'};
		
		$where = '';
		$data = $session->find($work,$where);
		
	
	
		
		
		return array('index'=>$data,'user'=>$user,'pages'=>ceil(count($data)/20));
	}
	function handler_login($system,$request)
	{
		/* var_dump($system);
		var_dump($request); */
		
		
		$user =  $system->getCurrentUser();
		$username = mysql_real_escape_string($request->{'username'});
		$password = mysql_real_escape_string($request->{'password'});
		
	/* 	var_dump($user); */
		
		$fmt = 'where name="%s" and password="%s" limit 0,1';
		$where = sprintf($fmt,$username,$password);
	
	
		$data = $system->getCacheSession()->find($user,$where);
		
/* 		var_dump($data); */
	/* 	$user = json_decode($data,true); */
	
		
		
		if(is_array($data))
		{
			$user =$data[0];
		/* 	$user = json_decode($data,true); */
			$_SESSION['uuid'] = $user['ID'];
	
		/* 	var_dump($user); */
			$_SESSION['user']= json_encode($user,JSON_UNESCAPED_UNICODE);
			
			$ssid = SESSION_ID();
			
				return array('user'=>$user,'ssid'=>$ssid);
		}
		
		
		return array('user'=>false);
		
	
	
	}
	function handler_refresh($system,$request)
	{
		$this->getQueryCache()->update(0);
		$this->getRequestCache()->update(0);
		return array('user'=>$system->getCurrentUser(),'refresh'=>'ok');
	}
	function handler_logout($system,$request)
	{
	/* 	echo $request->{'uuid'}; */
		$user = $this->getCurrentUser();
		session_unset();
		
		return array('logout'=>true,'user'=>$user);
	}
	
	function handler_click($system,$request)
	{
		
		$work  = $system->getModel('res');
		$session = $system->getCacheSession();
		
		$res_id = $request->{'res_id'};
		
		$session->load($work,$res_id);
		
		$count =  intval($work->{'COUNT'});
	
		$work->{'COUNT'} =1+$count;
		/* var_dump($work); */
		
		$fmt = 'count="%s"';
		$where = sprintf($fmt,$count+1);
		/* var_dump($where); */
		if( $session->update($work,$where))
		{
			$this->getRequestCache()->update(0);
			return array('click'=>true,'res_id'=>$res_id,'count'=>$count+1);
		}

		return array('click'=>false,'res_id'=>$res_id);
	}
}

$system = new main();
$system->init();
$system->loop();

?>
