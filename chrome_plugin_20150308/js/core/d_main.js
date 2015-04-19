(function () {
	//背景菜单
	var context_menu = {
		TAG : '',
		ready : false,
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
			this.ready = true;
			DEBUG.LOG(this, "Succeed to install.");
		},
		mid : 0,
		init : function (tag) {
			this.TAG = tag || 'context_menu';
			this.mid = chrome.contextMenus.create(this.props, this.callback);
		}
	};

	//数据结构

	var settings = {
		def : DEFAULT_SETTINGS,
		reset : function () {
			this.cur = this.def;
		}

	}

	var res = {}

	//
	//cs
	var cs = {
		ready : false,
		TAG : '',
		res : {},
		init : function (tag, res) {

			this.tag = TAG || 'cs';
			this.res = res || resource;
		},

		grab : function (data) {},
		save : function (data) {
			this.res.push(data);

		},
		load : function (data) {
			return settings.load().sites;
		}

	}

	//rpc

	var rpc = {
		ready : false,
		TAG : '',
		res : {},
		init : function (tag, res) {
			this.TAG = tag || 'rpc
																											this.res = res || {};

																										},
																										setup:function ()
																										{
																										  if(1)
																										  {
																											  this.ready =true;
																										  }
																										}

																										//
																										save : function (data) {

																											if(this.ready)
																											{

																											}


																										},
																										load : function (data) {

																											if(this.ready)
																											{

																											}


																										},
																										download : function (data) {

																											if(this.ready)
																											{


																											}
																										}

																									}

																									//系统
																									var system = {

																										__init : function (eventmap) {
																											this.id = eventmap.id || 0;
																											var event = eventmap[' event '];
																											var handler = [];

																											if (isFunction(eventmap[' map ']) {
																												handler = eventmap[' map '].call(this, event);

																											}
																												else if (isArray(eventmap[' handler ']) {
																													handler = eventmap[' handler ']);
																												}

																													for (var i = 0; i < handler.length; i++) {
																														if (isFunction(this[handler[i]])) {

																															this.event[i] = event[i];
																															this.handler[i] = handler[i];
																														}

																													}

																											},
																											TAG : ' ',
																											map : [],
																											init : function (tag) {
																												this.TAG = tag || ' system ';
																												__init.call(settings, EVENTMAPS[1]);
																												map.push(settings);

																												chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

																													var event = request.event;

																													if (event) {

																														if (this.dispatch(event)) {
																															sendResponse(event.data);
																														}
																													}

																												});
																											},
																											invoke : function (handler, data) {

																												fi(this[handler]) {
																													this[handler](data);
																												}
																											},
																											match : function (id, act) {

																												if (this.id === id) {
																													var h = this.event.indexOf(act);

																													return (h ? this.handler[h] : false);

																												}
																											},

																											dispatch : function (event) {

																												var id = event.id || 0;
																												var act = event.act || ' ';
																												var data = event.data || {};

																												for (var i = 0; i < this.map.length; i++) {
																													var obj = this.map[i];

																													var handler = this.match.call(obj, id);

																													if (handler) {
																														return this.invoke.call(obj, handler);
																													}

																												}

																												return false;

																											},
																										}
																									})();
