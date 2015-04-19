(function () {
	var context_menu,
	keywords = [],
	settings,
	def_settings,
	helper,
	handlers
	res = [];
	var DEBUG = {
		TAG : 'main.js',
		enable : true,
		LOG : function (log) {
			if (this.enable) {
				alert(log);
			}
		}
	}
	def_settings = {
		server_info : {
			username : 'guest',
			password : '123456',
			addr : '192.168.1.128',
			download : '/download',
			upload : '/upload',
		},
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
				url : 'http://www.btsts.com/s/',
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
			title : "搜索 %s",
			contexts : ["all"],
			documentUrlPatterns : ["*://*/*"],
			targetUrlPatterns : ["src:*"],
			onclick : function (info, t) {
				if (info.selectionText !== undefined) {
					var kw = info.selectionText;
					helper.invoke('sys', 'grab', {
						kw : kw
					});
				}
			}
		},
		callback : function () {
			DEBUG.LOG("Succeed to install.");
		},
		id : 0,
		init : function () {
			this.id = chrome.contextMenus.create(this.props, this.callback);
		}
	}
	var handlers = {
		sys : {
			ops : {
				init : function (data, cb) {
					helper.invoke('options', 'load', null, function (data) {
						settings = data;
					});
					context_menu.init();
					chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
						var target = request.target,
						act = request.act,
						data = request.data,
						cb = sendResponse;
						helper.invoke(target, act, data, cb);
					});
				},
				dump : function (data, cb) {
					cb({
						settings : settings,
						keywords : keywords,
						res : res
					});
				},
				debug : function (data, cb) {
					for (var i in DEBUG) {
						if (typeof data[i] !== 'undefined') {
							DEBUG[i] = data[i];
						}
					}
					cb();
				},
				grab : function (data, cb) {
					var kw = data.kw;
					kw = kw.replace(/-/, " ");
					keywords.push(kw);
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
		options : {
			ops : {
				save : function (data, cb) {
					if (window.localStorage) {
						localStorage.config = JSON.stringify(data);
					} else {
						DEBUG.LOG("Failed to save config!");
					}
				},
				load : function (data, cb) {
					if (window.localStorage && localStorage.config) {
						data = JSON.parse(localStorage.config);
					} else {
						data = def_settings;
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
					res.push(data);
					cb();
				}
			}
		},
		rpc : {
			ops : {
				save : function (data, cb) {
					var url = settings.server_info.addr;
					helper.post(url, {
						act : 'save',
						data : data
					}, cb);
				},
				load : function (data, cb) {
					var url = settings.server_info.addr;
					helper.post(url, {
						act : 'load'
					}, cb);
				},
				download : function (data, cb) {
					var url = settings.server_info.addr;
					helper.post(url, {
						act : 'download',
						data : data
					}, cb);
				}
			}
		}
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
		},
		invoke : function (target, act, data, cb) {
			DEBUG.LOG(target + '_' + act);
			var fn = handlers[target] ? handlers[target].ops[act] : {};
			if (this.isFunction(fn)) {
				fn(data, cb);
			}
		}
	}
	helper.invoke('sys', 'init');
})();
