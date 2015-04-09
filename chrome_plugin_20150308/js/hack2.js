//alert("hack2")

//alert($("#tag_frm").val())
var f = $("#tag_frm").val()
var m = "";
$(".j_a1").each(function(){

var d = $(this).attr("title");

var a  = f.split(" ");
var v = 1;

var json = {};
json.f = f;


for( s in a)
{

	//alert(a[s])
	//var reg = a[s];
	
	//alert(reg)
	
	var reg2 = new RegExp(a[s],"i");
	
	//reg2 = /dv/i
	d.match(reg2)==null && (v=0)
	

}





//v==1&&(m+=d+"\r\n"+$(this).nextAll("a").attr("href")+"\r\n")
v==1&&(json.m=$(this).nextAll("a").attr("href"),json.d=d,$.post("http://localhost/home/upload.php",json,function(d,s){}))


})

//alert(json)

//var json = {};
//json.fh = f;
//alert(json.fh);


//content script 不能做跨域请求
//$.post("http://localhost/home/upload.php",json,function(d,s){alert(d);})
//alert("end");
