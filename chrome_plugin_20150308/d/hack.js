//alert("hack")
//document.location = "http://www.baidu.com/"

var j = function(d){

var s ={url:'localhost/r.php',data:d};

	$.ajax(s);

}

var url_list_size = $('a[title=Download]').size()
if( url_list_size > 0)
{
 var url_list = ''
	$('a[title=Download]').each(function(i){
	
	url_list += $(this).attr('href') +'\n';
	})
	//alert(url_list);
	



if(localStorage['last_url_list'] != url_list)
{
	
	localStorage['last_url_list'] = url_list
	localStorage['last_url_index'] = 0
}
else
{
	localStorage['last_url_index'] = parseInt(localStorage['last_url_index']) + 1
	
	if( localStorage['last_url_index'] >= url_list_size)
	{
		localStorage['last_url_index'] = 0;
	
	}
	
	 
	
}

//alert(localStorage['last_url_index'])

var link = $('a[title=Download]').eq(parseInt(localStorage['last_url_index']));
//var link = $('a[title=Download]')[parseInt(localStorage['last_url_index'])];
localStorage['last_time'] = new Date().toLocaleString();
link.children('img').click();
//link.mousedown();
}
else
{

	//if(info.selectionText == undefined) return;
	//alert()
	
	//if (confirm("torrent kitty"))
	//{
	//	var url = "http://www.torrentkitty.com/search/"+$("input.inputsearchterm").attr("value")
//	var tab_prop = {url:url};
//chrome.tabs.create(tab_prop);
	//windows.open(url);
		//document.location = url;
	
	//}
	
	
}
