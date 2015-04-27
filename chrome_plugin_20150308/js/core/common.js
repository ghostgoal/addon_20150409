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
var isArray = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}, isObject = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}, isFunction = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Function]';
};
var DEBUG = {
	TAG : 'DEBUG',
	enable : true,
	log : function (log) {
		var fmt = '{0}:THIS:{1},{2}';
		console.log(String.format(fmt, new Date().toLocaleTimeString(), this.TAG, log));
	},
	LOG : function (THIS, log) {
		if (DEBUG.enable) {
			DEBUG.log.call(THIS, log);
		}
	}
};
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
			EVENTPUMP.DISPATCH(event);
		});
	},
	QUEUE : [],
	ATTACH : function (THIS) {
		if (-1 == this.QUEUE.indexOf(THIS)) {
			this.QUEUE.push(THIS);
		}
	},
	DETACH : function (THIS) {},
	DISPATCH : function (event) {
		DEBUG.LOG(this, String.format('EVENT_ID:{0},EVENT_ACT:{1},STATUS:{2}', event.id, event.act, 'DISPATCH'));
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
		DEBUG.LOG(this, String.format('EVENT_ID:{0},EVENT_ACT:{1},STATUS:{2}', event.id, event.act, '__MATCH'));
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
		DEBUG.LOG(this, String.format('EVENT_ID:{0},EVENT_ACT:{1},STATUS:{2}', event.id, event.act, '__INVOKE'));
		var id = event.id;
		var act = event.act;
		var data = event.data;
		var cb = event.cb;
		this.handlers[id][act].call(this, data, cb);
	}
};
var EVENTHANDLER = {
	INIT : function (THIS, id, act, handler) {
		this.__INIT.call(THIS, id, act, handler);
	},
	__INIT : function (id, act, handler) {
		this.id = id || 0;
		this.act = act || '';
		this.handlers = this.handlers || {};
		this.handlers[id] = this.handlers[id] || {};
		if (isFunction(handler))
			this.handlers[id][act] = handler;
	}
};
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
};
var UI = {
	INIT_MODAL : function (THIS, id) {
		this.__INIT_MODAL.call(THIS, id);
	},
	__INIT_MODAL : function (id) {
		this.id = id || 0;
		this.ready = false;
		var self = $('#' + this.id);
		if (self.length) {
			this.ready = true;
		}
		this.load = function (data) {
			if (this.ready) {
				if (this.on_load) {
					this.on_load(data);
				}
				$('#' + this.id).modal();
			}
		}
	},
	INIT_MENU : function (THIS) {
		this.__INIT_MENU.call(THIS);
	},
	__INIT_MENU : function () {}

};
var MODULE = {
	INIT : function (THIS, id, name, desc, events) {
		this.__INIT.call(THIS, id, name, desc, events);
	},
	__INIT : function (id, name, desc, events) {
		this.id = id || 0;
		this.name = name || '';
		this.desc = desc || '';
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
		};
		this.toString = function () {
			var fmt = 'id: {0}\nname: {1}\ndesc: {2}\nevents: {3}\n';
			return String.format(fmt, this.id, this.name, this.desc, this.events);
		}
	}
};
var UI_RESOURCE_MGR = {
	modal_func : function (opts) {
		this.ready = false;
		this.id = opts.id || 0;
		var m_opts = opts;
		var m_cur = {};
		this.load = function (ui) {
			m_cur = ui || {};
			m_opts.load(this.id, m_cur);
			$('#' + this.id).modal();
		},
		this.save = function () {
			m_opts.save(m_opts.id, m_cur);
		}
		m_opts.init(this.id, this.save);
	},
	menu_func : function () {},
	MODAL : {},
	UI : {},
	INIT_UI : function (pid, pjq, id, name, data, create, handlers) {
		this.UI[id] = {
			id : id,
			dirty : false,
			pid : pid,
			pjq : pjq,
			data : data,
			create : create,
			name : name,
			next_id : 0,
			next : [],
			handlers : []
		};
		if (handlers) {
			this.INIT_HANDLER(id, handlers);
		}
		this.__INIT_UI.call(this.UI[id]);
		return this.UI[id];
	},
	__INIT_UI : function () {
		this.init = function () {
			this.jq = this.create(this.id, this.data);
			if (this.id  && UI_RESOURCE_MGR.UI[this.pid]) {
				UI_RESOURCE_MGR.UI[this.pid].next = UI_RESOURCE_MGR.UI[this.pid].next || [];
				UI_RESOURCE_MGR.UI[this.pid].next.push(this.id);
			} else {}
			this.pjq.append(this.jq);
		}
		this.nextID = function () {
			var fmt = '{0}_{1}';
			this.next_id += 1;
			return String.format(fmt, this.id, this.next_id);
		},
		this.load = function () {
			if (this.dirty) {
				var theOld = this.next;
				var theNew = [];
				var cod = {};
				for (var k in this.data) {
					if (isArray(this.data[k])) {
						this.data[k] = [];
					}
				}
				for (var i = 0; i < theOld.length; i++) {
					var cid = theOld[i];
					var child = UI_RESOURCE_MGR.UI[cid];
					if (child) {
						var name = child.name;
						cod[name] = cod[name] || [];
						cod[name].push(child.load());
						theNew.push(cid);
					}
				}
				for (var j in cod) {
					this.data[j] = cod[j];
				}
				this.next = theNew;
				this.dirty = false;
			}
			return this.data;
		};
		this.save = function (data) {
			this.data = data;
			this.dirty = true;
			this.data = this.load();
			this.next = [];
			this.next_id = 0;
			var theNew = this.create(this.id, this.data);
			var theOld = this.jq;
			theOld.after(theNew);
			theOld.remove();
			this.jq = theNew;
			if (UI_RESOURCE_MGR.UI[this.pid]) {
				UI_RESOURCE_MGR.UI[this.pid].dirty = true;
			}
		};
		this.reset = function (data) {
			this.data = data;
			this.dirty = false;
			this.next = [];
			var theNew = this.create(this.id, this.data);
			var theOld = this.jq;
			theOld.after(theNew);
			theOld.remove();
			this.jq = theNew;
			if (UI_RESOURCE_MGR.UI[this.pid]) {
				UI_RESOURCE_MGR.UI[this.pid].dirty = true;
			}
		};
		this.close = function () {
			if (UI_RESOURCE_MGR.UI[this.pid]) {
				UI_RESOURCE_MGR.UI[this.pid].dirty = true;
			}
			UI_RESOURCE_MGR.UI[this.id] = undefined;
			this.jq.remove();
		};
		this.init();
	},
	INIT_MENU : function (THIS, opts) {
		this.__INIT_MENU.call(THIS, opts);
	},
	__INIT_MENU : function (opts) { ;
		$(this).css('position', 'relative').css('border', '1px black solid').css('border-radius', '4px').css('borderTopWidth', '32px').css('padding', '10px');
		var menu = $('<div></div>').attr('mid', opts.mid).attr('uid', opts.uid).css('position', 'absolute').css('right', '6px').css('top', '-26px').css('border-radius', '4px');
		var edit = $('<a></a>').css('marginRight', '6px').append("<span class=\"glyphicon glyphicon-edit\"></span>");
		edit.appendTo(menu);
		edit.click(function () {
			var uid = $(this).parent().attr('uid');
			var mid = $(this).parent().attr('mid');
			var modal = UI_RESOURCE_MGR.MODAL[mid];
			if (modal) {
				var ui = UI_RESOURCE_MGR.UI[uid];
				modal.load(ui);
				alert(ui.id + JSON.stringify(ui.data));
			} else {
				alert('no modal' + mid);
			}
		});
		if (opts['on']) {
			var close = $('<a></a>').css('marginRight', '6px').append("<span class=\"glyphicon glyphicon-trash\"></span>");
			close.appendTo(menu);
			close.click(function () {
				var uid = $(this).parent().attr('uid');
				if (confirm('确定删除？')) {
					var ui = UI_RESOURCE_MGR.UI[uid];
					ui.close();
				}
			});
			var add = $('<a></>').css('marginRight', '6px').append("<span class=\"glyphicon glyphicon-plus-sign\"></span>");
			add.appendTo(menu);
			add.click(function () {
				var uid = $(this).parent().attr('uid');
				var mid = $(this).parent().attr('mid');
				var modal = UI_RESOURCE_MGR.MODAL[mid];
				if (modal) {
					var ui = UI_RESOURCE_MGR.UI[uid];
					var pui = UI_RESOURCE_MGR.UI[ui.pid];
					var id = pui ? pui.nextID() : ui.id + 'to' + 1;
					alert(id);
					var data = {};
					var nui = UI_RESOURCE_MGR.INIT_UI(ui.pid, ui.pjq, id, ui.name, data, ui.create);
					modal.load(nui);
				} else {
					alert('no modal' + mid);
				}
			});
		}
		menu.appendTo(this);
	},
	INIT_MODAL : function (opts) {
		this.MODAL[opts.id] = new this.modal_func(opts);
	},
	INIT_HANDLER : function (id, handlers) {
		if (this.UI[id] && isObject(handlers))
			this.__INIT_HANDLER.call(this.UI[id], handlers);
	},
	__INIT_HANDLER : function (handlers) {
		for (var i in handlers) {
			if (isFunction(handlers[i])) {
				this.handlers[i] = handlers[i];
			}
		}
	}
};
