var settings = {
	def : DEFAULT_SETTINGS,
	reset : function () {
		this.cur = this.def;
	}
}
var res = {
	clear : function () {
		this.save({});
	}
}

var server ={
	
	
	
};
RESOURCE.INIT.call(settings, RESOURCE_ID[0]);
RESOURCE.INIT.call(res, RESOURCE_ID[1]);
settings.save(DEFAULT_SETTINGS);
settings.load();
res.clear();
alert(settings.cur);
alert("test.js");
var system = {
	init : function () {
		chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
			var event = request.event;
			var cb = sendResponse;
			if (event) {
				if (this.dispatch(event)) {
					if (event.cb) {
						cb(event.cb);
					}
				}
			}
		});
	},
	handlers : {
		sys : {
			dump : function () {
				return {
					settings : settings,
					resource : res
				}
			},
			grab : function (data) {
				var kw = data.kw || false;
				if (kw) {
					kw = kw.replace(/-/, " ");
					for (var i in settings.sites) {
						var site = settings.sites[i];
						if (site.enable) {
							chrome.tabs.create({
								url : site.url + kw
							});
						}
					}
				}
			}
		},
		rpc : {
			load : function () {
				var url = '';
				$.post(url, {
					act : 'load'
				}, function (data) {});
			},
			save : function (data) {
				var url = '';
				$.post(url, {
					act : 'save',
					data : data
				}, function (data) {});
			},
			download : function (data) {
				var url = '';
				$.post(url, {
					act : 'download',
					data : data
				}, function (data) {});
			}
		},
		cs : {
			load : function () {
				settings.load();
				return settings.cur.sites;
			},
			save : function (data) {
				res.cur.push(data)
				return false;
			}
		},
		options : {
			load : function () {
				settings.load();
				return settings.cur;
			},
			save : function (data) {
				settings.save(data);
				return false;
			},
			reset : function () {
				settings.reset();
				return settings.cur;
			}
		}
	},
	dispatch : function (event) {
		var id = event.id || 0;
		var act = event.act || '';
		var data = event.data || [];
		if (handlers[id]) {
			if (handlers[id][act]) {
				event.cb = handlers[id][act](data);
				return true;
			}
		}
		return false;
	}
}
