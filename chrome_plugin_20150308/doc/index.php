<?php

class m
{
	private $conn;
	private $servername;
	private $username;
	private $password;
	
	__construct($username,$password,$servername='localhost')
	{
		$this->servername = $servername;
		$this->username = $username;
		$this->password = $password;
		
		$conn = mysql_connect($this->servername,$this->username,$this->password);
		
	}

	
	function query($datebase,$query)
	{
		if($conn)
		{
			mysql_select_db($database);
			return mysql_query($query);
		}
		
		return false;
		
	}
	
	__destruct()
	{
		if($conn)
		{
			mysql_close($conn);
		}
	}
	
	
}


function update()
{
	$urls= $_GET['urls']);
	if(isset($urls)
	{
		$urls = json_decode($_GET['urls'],true);
		
		if(urls)
		{
			var_dump(urls);
			
			//
			
			$servername = 'localhost';
			$username = 'root';
			$password = 'hoopxxl442';
			$database = 'addon';
			$conn = mysql_connect($servername,$username,$password);
			
			if($conn)
			{
				mysql_select_db($database);
				
				$query = 'insert into torrents values(NULL,"%s","%s","%s",NULL)';
				
			}
			else
			{
				echo 'Failed to connect mysql!';
				
			}
			//
		
		}else
		{
			return 'Invalid json!';
		}
	}else
	{
		
		return 'No valid input!';
	}
} 

function download()
{
	is_array(
}

function loop($act)
{
	switch($act)
	{
		case 'update':
		echo update();
		break;
		case 'download':
		break;
	}
	
}

$act = $_GET['act'];

$act = isset($act) ? $act : 'home';

loop($act);
$echo $act;


$s = curl_init();

fopen(

file_exists(

fwrite(

fclose(




?>