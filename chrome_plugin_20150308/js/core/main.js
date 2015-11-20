var system = {
	TAG : 'system',
	res : {},
	settings : {},
	init : function () {
		RESOURCE.INIT(this.settings, RESOURCE_ID[0], RESOURCE_DEFAULT[0]);
		RESOURCE.INIT(this.res, RESOURCE_ID[1], RESOURCE_DEFAULT[1]);
		EVENTPUMP.ATTACH(this);
		EVENTHANDLER.INIT(this, 'op', 'save', this.on_test_save);
		EVENTHANDLER.INIT(this, 'op', 'load', this.on_test_load);
		EVENTHANDLER.INIT(this, 'op', 'reset', this.on_test_reset);
		EVENTHANDLER.INIT(this, 'cs', 'save', this.on_cs_res_save);
		EVENTHANDLER.INIT(this, 'cs', 'load', this.on_cs_sites_load);
		EVENTHANDLER.INIT(this, 'pp', 'load', this.on_pp_res_load);
		EVENTHANDLER.INIT(this, 'pp', 'save', this.on_pp_res_save);
		EVENTHANDLER.INIT(this, 'si', 'load', this.on_si_load);
		EVENTPUMP.LOOP();
	},
	on_si_load : function (data, cb) {
		cb(this.settings.cur);
	},
	on_pp_res_load : function (data, cb) {
		cb(this.res.cur);
	},
	on_pp_res_save : function (data, cb) {
		this.res.cur['data'] = data;
		this.res.save(this.res.cur);
		cb(this.res.cur);
	},
	on_cs_res_save : function (data, cb) {
		this.res.cur['data'] = this.res.cur['data'] ? this.res.cur['data'] : [];
		this.res.cur['data'].push(data);
		this.res.save(this.res.cur);
		cb(this.res.cur);
	},
	on_cs_sites_load : function (data, cb) {
		this.settings.load();
		cb(this.settings.cur.sites);
	},
	on_cs_load : function (data, cb) {
		DEBUG.LOG(this, 'on_cs)_load');
	},
	on_test_save : function (data, cb) {
		this.settings.save(data);
		cb(this.settings.cur);
	},
	on_test_load : function (data, cb) {
		this.settings.load();
		cb(this.settings.cur);
	},
	on_test_reset : function (data, cb) {
		this.settings.reset();
		this.res.reset();
		this.res.save(this.res.cur);
		cb(this.settings.cur);
	}
}
system.init();
$(function () {
	var mod = {
		def : {
			title : "搜索 %s",
			contexts : ["all"],
			documentUrlPatterns : ["*://*/*"],
			targetUrlPatterns : ["src:*"],
		},
		init : function (cp) {
			this.cp = cp || this.def;
			this.cp.onclick = this.onclick;
			this.mid = chrome.contextMenus.create(this.cp, this.oncreate);
		},
		onclick : function (info, tab) {
			var keyword = info.selectionText || false;
			keyword = keyword.replace(/-/g, ' ');
			if (keyword) {
				var sites = system.settings.cur.sites;
				for (var i = 0; i < sites.length; i++) {
					var site = sites[i];
					var url = site.url + keyword;
					chrome.tabs.create({
						url : url
					});
				}
			}
		},
		oncreate : function () {
			chrome.browserAction.onClicked.addListener(function (tab) {

				var url = tab.url;
				var sites = system.settings.cur.sites;

				/* alert(JSON.stringify(system.settings.cur.sites)); */

				for (var i = 0; i < sites.length; i++) {
					var site = sites[i];
					var index = url.indexOf(site['url']);

					if (index != -1) {

						index = site['url'].length;
						var keyword = url.substr(index);

						chrome.tabs.sendMessage(tab.id, {
							rule:site,
							keyword : keyword
						}, function (response) {

							//alert(response);
						});

					}

				};

			});

			console.log(JSON.stringify(mod));
		}
	}
	mod.init();
});
