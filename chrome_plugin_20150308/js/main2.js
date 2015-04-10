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

var main = function () {

	//参数
	var uid;

	//config
	var default_config = {
		basic : {
			target : ["http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=", "http://www.storetorrent.net/s/"],
			is_used : [1, 1]
		},
		settings : {
			is_login : true,
			is_download : true,
			is_detail : false
		},
		advanced : {
			homepage : "",
			download : "",
			video : "",
			graphic : "",
			username : "",
			password : ""
		}
	};
	var config;

	var load_config = function () {
		if (window.localStorage && localStorage.config) {
			config = JSON.parse(localStorage.config);

		} else {
			config = default_config;
		}

		return config;
	}
	var save_config = function (data) {

		if (window.localStorage) {
			config = data;
			localStorage.config = JSON.stringify(config);
			//alert("save");
		} else {
			alert("Failed to save config!");
		}
	}
	var reset_config = function () {
		config = default_config;
	}
	//功能函数
	//种子搜索
	var bt_download = function (keyword, do_bt_download) {
		var url;
		var status;

		for (var i in url) {
			if (status[i]) {
				do_bt_download(url[i], keyword);
			}
		}

	}
	//高级功能
	//bt下载

	var bt_download = function (uid) {

		var p_bt_download = "{0}/bt/";
		var home_page;

		chrome.tabs.create({
			url : url;
		});

	}

	//用户登录
	var login = function (username, password) {
		var p_login = "{0}/login/";

		return uid;
	}
	//视频浏览
	var video_scan = function () {

		var p_video = "{0}/v/";

	}

	//图片浏览
	var graphic_scan = function () {

		var p_graphic = "{0}/g/";
	}

	//context menu
	var setup_context_menu = function () {

		var setup_new_tab = function (p, s) {
			chrome.tabs.create({
				url : p + s
			});
		}

		var c = function (info, t) {

			if (info.selectionText == undefined)
				return;
			var keyword = info.selectionText;
			keyword = keyword.replace(/-/, " ");

			current.download(keyword, add_new_tab);

		}
		var p = {
			title : "搜索 %s",
			contexts : ["all"],
			documentUrlPatterns : ["http://*/*"],
			targetUrlPatterns : ["src:*"],
			onclick : c
		}

		var cb = function () {
			alert("Succeed to install.")
		}

		var id = chrome.contextMenus.create(p, cb);

		return id;
	}

	var init = function () {
		chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
			switch (request.act) {
			case "load_config":
				sendResponse(load_config);
				break;
			case "reset_config":
				sendResponse(reset_config);
				break;
			case "save_config":
				save_config(request.data);
				sendResponse("保存成功");
				break;
			case "load_rule":

				sendResponse({act:"grab",url:"ttt",p:"test"});
				break;
			}
		});
	}

	var loop = function () {}

}
