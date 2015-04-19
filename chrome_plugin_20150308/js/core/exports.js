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
var DEFAULT_SETTINGS = {
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
};
var MESSAGEMAPS = [{
		id : 0,
		msg : 'settings_load'
	}
];
var EVENTMAPS = [{
		id : 'sys',
		event : ['dump', 'grab', 'debug'],
		handler : ['dump', 'grab']
	}, {
		id : 'options',
		event : ['load', 'save', 'reset'],
		handler : ['load', 'save', 'reset']
	}, {
		id : 'rpc',
		event : ['load', 'save', 'download'],
		handler : ['load', 'save', 'download']
	}, {
		id : 'cs',
		event : ['load', 'save'],
		handler : ['load', 'save']
	}
];
var DEBUG = {
	TAG : 'DEBUG',
	enable : true,
	log : function (log) {
		alert(this.TAG + ':' + log);
	},
	LOG : function (THIS, log) {
		if (DEBUG.enable) {
			DEBUG.log.call(THIS, log);
		}
	}
};
var EVENT_IDS = [];
var EVENT = {
	INIT : function (THIS, id, events) {
		this.__INIT.call(THIS, id, events);
	},
	__INIT : function (id, events) {
		this.id = id || 0;
		this.events = events || [];
		this.fire = function (act, data, cb) {
			if (-1 != this.events.indexOf(act)) {
				chrome.extension.sendRequest({
					id : this.id,
					act : act,
					data : data
				}, cb);
				return true;
			}
			return false;
		}
	}
};
var EVENTPUMP = {
	TAG : 'EVENTPUMP',
	LOOP : function () {
		chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
			var event = request;
			event.cb = sendResponse;
			DEBUG.LOG(EVENTPUMP, String.format('EVENT_ID:{0},EVENT_ACT:{1}', event.id, event.act));
			this.DISPATCH(event);
		});
	},
	QUEUE : [],
	ATTACH : function (THIS) {
		if (-1 != this.QUEUE.indexOf(THIS)) {
			QUEUE.push(THIS);
		}
	},
	DETACH : function (THIS) {},
	DISPATCH : function (event) {
		for (var i = 0; i < this.QUEUE.length; i++) {
			if (this.MATCH(this.QUEUE[i], event)) {
				this.INVOKE(this.QUEUE[i], event);
			}
		}
	},
	MATCH : function (THIS, event) {
		return this.__MATCH.call(THIS, event);
	},
	__MATCH : function (event) {
		var id = event.id || 0;
		var act = event.act || '';
		if (this.handlers[id] && this.handlers[id][act]) {
			return true;
		}
		return false;
	},
	INVOKE : function (THIS, event) {
		return this.__INVOKE.call(THIS, event);
	},
	__INVOKE : function (event) {
		var id = event.id;
		var act = event.act;
		var data = event.data;
		var cb = event.cb;
		this.handlers[id][act](data, cb);
	}
};
var EVENTHANDLER = {
	INIT : function (THIS, id, act, handler) {
		this.__INIT.call(THIS, id, act);
	},
	__INIT : function (id, act, handler) {
		this.id = id || 0;
		this.act = act || '';
		this.handlers = this.handlers || [];
		this.handlers[id] = this.handlers[id] || {};
		if (typeof handler === '')
			this.handlers[id][act] = handler;
	}
};
var RESOURCE_ID = ['settings', 'res'];
var RESOURCE = {
	INIT : function (THIS, id, def) {
		this.__INIT.call(THIS, id, def);
	},
	__INIT : function (id, def) {
		this.def = def || {};
		this.id = id || 0;
		this.cur = {};
		this.ready = window.localStorage ? true : false;
		this.save = function (s) {
			this.cur = s;
			if (this.ready) {
				window.localStorage[this.id] = JSON.stringify(s);
			}
		};
		this.load = function () {
			if (this.ready) {
				this.cur = window.localStorage[this.id] ? JSON.parse(window.localStorage[this.id]) : this.def;
			}
		};
		this.reset = function () {
			this.cur = this.def;
		};
		this.load();
	}
}
var EVENTS = {
	maps : [],
	__invoke : function (event) {
		return this.handlers[event.id][event.act].call(this, event.data, event.cb);
	},
	invoke : function (THIS, event) {
		return this.__invoke(THIS, event);
	},
	__match : function (event) {
		var id = event.id;
		var act = event.act;
		var data = event.data;
		var cb = event.cb;
		if (this.handlers[id]) {
			if (this.handlers[id][act]) {
				return true;
			}
		}
		return false;
	},
	match : function (THIS, event) {
		return this.__match.call(THIS, event);
	},
	dispatch : function (event) {
		for (var i in maps) {
			var THIS = maps[i];
			if (this.match(THIS, event)) {
				DEBUG.LOG(THIS, String.format('{0}_{1}', event.id, event.act));
				this.invoke(event);
			} else {
				DEBUG.LOG(THIS, String.format('NO {0}_{1}', event.id, event.act));
			}
		}
	},
	__detach : function (id, event) {
		if (this.handler[id]) {
			this.handlers[id][event] = undefined;
		}
	},
	detach : function (THIS, id, event) {
		this.__detach.call(THIS, id, event);
	},
	__attach : function (id, event, handler) {
		if (handler) {
			this.handlers[id][event] = handler;
		}
	},
	attach : function (THIS, id, event, handler) {
		this.__attach.call(THIS, id, event, handler);
	},
	__init : function (eventmap) {
		this.id = eventmap.id;
		this.event = {};
		for (var i in eventmap.event) {
			this.event[eventmap.event[i]] = eventmap.handler[i];
		}
	},
	init : function (THIS, events) {
		this.__init.call(THIS, events);
	},
	__fire : function (event, args) {
		var id = this.id;
		var act = event;
		var data = args;
		var cb = this.event[act] || function () {};
		chrome.extension.sendRequest({
			id : id,
			act : act,
			data : data
		}, cb);
	},
	fire : function (THIS, event, args) {
		this.__fire.call(THIS, event, args);
	}
}
var MOD = {
	mods : [],
	__init : function () {
		MOD.mods.push(this);
	},
	init : function (THIS) {
		this.__init.call(THIS);
	}
}
