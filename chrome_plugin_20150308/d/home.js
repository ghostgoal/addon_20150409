String.format = function () {
	if (arguments.length == 0)
		return null;
	var str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
		str = str.replace(re, arguments[i]);
	}
	return str;
};
var config = function () {
	var current;
	var id_save_btn = "#save_config";
	var id_default_btn = "#default_config";
	var id_download_site = "#download_sites";
	var fmt = "<div class=\"checkbox ss_site clearfix\"><label><input type=\"checkbox\">{0}</label><a fid=\"config\"><span class=\"glyphicon glyphicon-wrench\"></span></a><a><span class=\"glyphicon glyphicon-minus\"></span></a></div>";
	var load_download_sites = function () {
		/* var fmt = "<div class=\"checkbox ss_site clearfix\"><label><input type=\"checkbox\">{0}</label><a fid=\"config\"><span class=\"glyphicon glyphicon-wrench\"></span></a><a><span class=\"glyphicon glyphicon-minus\"></span></a></div>"; */
		$(id_download_site).html("");
		for (var d in current.download) {
			load_site.call($(id_download_site), fmt, current.download[d]).find("input").prop("checked", current.download_used[d]);

		}

		add_new.call($(id_download_site));

	}

	var save_download_sites = function () {
		var s = "#download_sites .ss_site label";
		current.download = [];
		current.download_used = [];
		$(s).each(function () {
			current.download.push($(this).text());
			current.download_used.push($(this).find("input").prop("checked"));
		})

		/* var test ={};
		test[0]=32;
		alert(test[0]);
		//alert(current.download); */

	}
	var load_site = function (fmt, s) {
		var p = $(String.format(fmt, s));
		add_remove.call(p);
		p.prependTo($(this));
		return p;
	}
	var add_site = function (fmt, s) {
		var p = $(String.format(fmt, s));
		add_remove.call(p);
		$(this).before(p);
	}
	var add_remove = function () {
		var p = $(this);
		$(this).find("a[fid=config]").each(function () {
			$(this).click(function () {
				p.remove();
			});
		});
	}
	var check_site = function (site) {
		var p = /http:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
		//var p =0;
		if (p.test(site)) {

			return true;
		}

		return false;
	}
	var add_new = function () {
		var fmt_2 = "<div class=\"checkbox ss_add_site clearfix\"></div > ";
		var fmt_3 = " <input type=\"text\"></input>";
		var fmt_4 = "<a><span class=\"glyphicon glyphicon-plus\"></span></a>";
		var p = $(fmt_2);
		var i = $(fmt_3);
		i.prependTo(p);
		var b = $(fmt_4);
		b.prependTo(p);
		b.click(function () {
			if (check_site(i.val())) {
				add_site.call(p, fmt, i.val());
			} else {
				alert("无效的网址:" + i.val());
			}
		})
		p.appendTo($(this));
	}
	var load_data = function () {
		load_download_sites();
	}
	var save_data = function () {

		save_download_sites();
	}
	var load = function () {
		chrome.extension.sendRequest({
			act : "load_config"
		}, function (response) {
			current = response;
			load_data();
			alert(JSON.stringify(current));
		})
	};
	var save = function () {
		save_data();
		chrome.extension.sendRequest({
			act : "save_config",
			data : current
		}, function (response) {
			alert(response);
		})
	};
	var reset = function () {
		chrome.extension.sendRequest({
			act : "reset_config"
		}, function (response) {
			current = response;
			load_data();
			alert(JSON.stringify(response));
		})
	}
	this.init = function () {
		$(id_save_btn).click(save);
		$(id_default_btn).click(reset);
		load();
		//alert("init");
	};
}
var c = new config();
$(c.init());
