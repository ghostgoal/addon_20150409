var add_new_tab = function (p, s) {
	var url = p + s;
	var prop = {
		url : url
	};
	chrome.tabs.create(prop);
}
var c = function (info, t) {

	if (info.selectionText == undefined)
		return;
	var f = info.selectionText;
	f = f.replace(/-/, " ");

	current.download(f, add_new_tab);

}
/* var r = function (info, t) {
if (info.selectionText == undefined)
return;
var url = "http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=" + info.selectionText
var tab_prop = {
url : url
};
chrome.tabs.create(tab_prop);
} */
var createProperties = {
	title : "搜索 %s",
	contexts : ["all"],
	documentUrlPatterns : ["*://*/*"],
	targetUrlPatterns : ["src:*"],
	onclick : c
}
var callback = function () {
	alert("Succeed to install.")
}
var id = chrome.contextMenus.create(createProperties, callback);
/* var s = function (k) {
alert(k)
if (k == undefined)
return;
var url = "http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=" + k
var tab_prop = {
url : url
};
chrome.tabs.create(tab_prop);
}
chrome.omnibox.onInputEntered.addListener(s); */
//2015/03/09
var main = function () {

	var s = {},
	c,
	pattern_magnet = /magnet:?xt=urn:btih:/,
	last_keyword;

	this.sync = function (cb) {

		var url = "test";

		cb({
			url : url,
			data : JSON.stringify(s)
		});

	}

	this.dump = function (cb) {
		/* for (var k in s[last_keyword]) {
		alert(s[last_keyword][k]);
		}

		alert(last_keyword); */

		cb(JSON.stringify(s));

	}

	this.save_bt = function (bt) {
		/* alert(last_keyword); */
		for (var i in bt) {
			/* alert(bt[i]); */
			if (/^magnet:\?xt=urn:btih:/.test(bt[i])) {

				s[last_keyword].magnet.push(bt[i]);

			} else {

				s[last_keyword].bt.push(bt[i]);
			}
		}

	}

	this.download = function (k, cb) {

		last_keyword = k;
		s[last_keyword] = s[last_keyword] || {};
		s[last_keyword].bt = s[last_keyword].bt || [];
		s[last_keyword].magnet = s[last_keyword].magnet || [];

		var site = c.download;
		var status = c.download_used;

		for (var i in site) {
			if (status[i]) {
				cb(site[i], k);
			}
		}
	}

	this.save = function (data) {
		if (window.localStorage) {
			c = data;
			localStorage.config = JSON.stringify(c);
			//alert("save");
		} else {
			alert("Failed to save config!");
		}
	};
	this.load = function () {

		if (window.localStorage && localStorage.config) {
			c = JSON.parse(localStorage.config);

		} else {
			c = default_config;
		}

		return c;
	};

	this.reset = function () {
		return default_config;
	}

	this.init = function () {
		this.load();

	}

}

var default_config = {
	home : ["192.168.1.100"],
	download : ["http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=", "http://www.storetorrent.net/s/"],
	download_used : [1, 1],
	username : "guest",
	password : "123456",
	settings : {
		is_login : true,
		is_download : true,
		is_detail : false
	}
}
var current = new main();
current.init();
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	switch (request.act) {
	case "load_config":
		sendResponse(current.load());
		break;
	case "reset_config":
		sendResponse(current.reset());
		break;
	case "save_config":
		current.save(request.data);
		sendResponse("保存成功");
		break;
	case "load_rule":
		sendResponse([{
					a : "grab",
					p : ".tlistdownload a",
					url : "tt",
					max : 3
				}, {
					a : "grab",
					p : ".i_info .j_size a",
					url : "tt",
					max : 3
				}
			]);
		break;

	case "save_bt":

		var bt = request.bt;

		current.save_bt(bt);

		break;
	case "dump":
		current.dump(sendResponse);
		break;

	case "sync":
		current.sync(sendResponse);
		break;
		
	case "grab":
		current.download(request.keyword,add_new_tab);
		break;
		
		
	}
});
