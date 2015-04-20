var eventmaps = [{
		id : 'sys',
		event : ['dump'],
		map : function (event) {
			var handler = [];
			if (isArray(event)) {
				for (var i = 0; i < event.length; i++) {
					handler[i] = this.id + '_' event[i];
				}
			}
			return handler;
		}
	}, {
		id : 'rpc',
		event : ['save', 'load'],
		handler : ['']
	}
]
var handlers = {
	maps : [],
	register : function (e) {
		maps.push(e);
	},
	match : function (e) {
		if (this.event[e.min]) {
			return true;
		}
	},
	invoke : function (action) {
		var fn = this.map[act];
	},
	__init : function (eventmap) {
		this.id = eventmap.id || 0;
		var event = eventmap['event'];
		var handler = [];

		if (isFunction(eventmap['map']) {
			handler = eventmap['map'].call(this, event);

		}
			else if (isArray(eventmap['handler']) {
				handler = eventmap['handler']);
			}

				for (var i = 0; i < handler.length; i++) {
					if (isFunction(this[handler[i]])) {

						this.event[i] = event[i];
						this.handler[i] = handler[i];
					}

				}

		},
		
		dispatch : function (e) {
			var maj = e.maj;
			var min = e.min;
			var data = e.data;
			DEBUG.LOG(maj + "_" + min);
			if (isObject(this.map[maj]) {
				handler = this.map[maj][min];
				if (isFunction(handler)) {
					e.data = handler(data);
					e.enable = e.data ? true : false;
					return true;
				}
			}
				else {
					DEBUG.LOG(maj + "_" + min);
				}
					return false
			}, ,
			init : function () {
				chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
					if (this.dispatch(request.event) && request.event.enable) {
						sendResponse(request.event.data)
					}
				});
			}
		}
