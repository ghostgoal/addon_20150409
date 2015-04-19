

var e = function(d){d?$('#paste').attr("disabled",false):$('#paste').attr("disabled",true)}
var s = function(){var f = $('#fh').val();$("#magnet").load("http://localhost/home/magnet.php",{fh:f},e)}
var p = function(){alert($("#magnet").text())}
$("#search").click(s)
$('#paste').click(p)

//.load("http://localhost/home/magnet.php",function (){$("#magnet").



//$(	function(){$("#paste").zclip({path:"ZeroClipboard.swf",copy:'paste'})});

//alert($('#paste'))
//alert($('#paste').zclip)

//$('#paste').zclip('show');