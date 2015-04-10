(function () {
	var context_menu,
	keywords = [],
	settings,
	def_settings,
	helper,
	handlers
	res = [];
	def_settings = {
		server_info : {
			addr : '192.168.1.128',
			download : '/download',
			upload : '/upload',
		},
		username : 'guest',
		password : '123456',
		sites : [{
				max : 3,
				url : 'http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=',
				patterns : [{
						selector : '.tlistrow .tlistname',
						name : 'name',
						type : 'props'
					}, {
						selector : '.tlistrow .tlistdownload',
						name : 'download',
						attr : 'href'
					}, {
						selector : '.tlistrow .tlistsize',
						name : 'size',
					}
				],
				desc : '',
				enable : true
			}, {
				max : 3,
				url : 'http://www.storetorrent.net/s/',
				patterns : [{
						selector : '.i_info',
						name : 'name',
					}, {
						selector : '.j_size a',
						name : 'download',
					}, {
						selector : '.j_size',
						name : 'size',
					}
				],
				desc : '',
				enable : true
			}
		]
	}
	context_menu = {
		props : {
			title : "ËÑË÷ %s",
			contexts : ["all"],
			documentUrlPatterns : ["*://*/*"],
			targetUrlPatterns : ["src:*"],
			onclick : function (info, t) {
				if (info.selectionText !== undefined) {
					var kw = info.selectionText;
					kw = kw.replace(/-/, " ");
					keywords[] = kw;
					for (var site in settings.sites) {
						if (site.enable) {
							chrome.tabs.create({
								url : site.url + kw
							});
						}
					}
				}
			}
		},
		callback : function () {
			alert("Succeed to install.");
		},
		id : chrome.contextMenus.create(this.props, this.callback)
	}
	var helper = {
		op : Object.prototype,
		isArray : function (obj) {
			return this.op.toString.call(obj) === '[object Array]';
		},
		isObject : function (obj) {
			return this.op.toString.call(obj) === '[object Object]';
		},
		isFunction : function (obj) {
			return this.op.toString.call(obj) === '[object Function]';
		}
	}
	var handlers = {
		options : {
			ops : {
				save : function (data, cb) {
					if (window.localStorage) {
						localStorage.config = JSON.stringify(data);
					} else {
						alert("Failed to save config!");
					}
				},
				load : function (data, cb) {
					if (window.localStorage && localStorage.config) {
						data = JSON.parse(localStorage.config);
					} else {
						data = default_config;
					}
					cb(data);
				},
				reset : function (data, cb) {
					data = def_settings;
					cb(data);
				}
			}
		},
		cs : {
			ops : {
				load : function (data, cb) {
					cb(settings.sites);
				},
				save : function (data, cb) {
					res[] = data.res;
				}
			}
		},
		rpc : {
			ops : {
				save : function (data, cb) {
					var url = settings.server_info.addr;
					$.post(url, {
						act : 'save',
						data : data
					}, cb);
				},
				load : function (data, cb) {
					var url = settings.server_info.addr;
					$.post(url, {
						act : 'load'
					}, cb);
				},
				download : function (data, cb) {
					var url = settings.server_info.addr;
					$.post(url, {
						act : 'download',
						data : data
					}, cb);
				}
			}
		}
	}
	chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
		var target,
		act,
		data,
		cb;
		target = request.target;
		act = request.act;
		data = request.data;
		cb = sendResponse;
		handlers[target] && handlers[target].ops[act] && handlers[target].ops[act](data, cb);
	})
})();
