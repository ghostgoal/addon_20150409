<script src="jquery.js"></script>
<script src="dist/jquery.zeroclipboard.min.js"></script>
<script>
  jQuery(document).ready(function($) {
    $("body")
      .on("copy", ".zclip", function(/* ClipboardEvent */ e) {
        e.clipboardData.clearData();
        e.clipboardData.setData("text/plain", $(this).data("zclip-text"));
        e.preventDefault();
      });
  });
</script>


<?php
if(isset($_POST['magnet']) && isset($_POST['keyword']))
{
	
	$keyword =  $_POST['keyword'];
	$magnet = $_POST['magnet'];
	
	echo "<button class=\"zclip\" data-zclip-text=$magnet>keyword</button>";
	
	
}else
{
	
	echo '<button class="zclip" data-zclip-text="Testing 1-2-3!">Click to copy!</button>';
	
}


	
?>