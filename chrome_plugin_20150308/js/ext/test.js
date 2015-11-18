
jQuery(document).ready(function () {

		$("body")
		.on("copy", "#copyBtn", function (/* ClipboardEvent */
				e) {
			e.clipboardData.clearData();
			e.clipboardData.setData("text/plain", 'test');
			e.preventDefault();

			alert('ok');
		});

	//	alert('ok');

	});
