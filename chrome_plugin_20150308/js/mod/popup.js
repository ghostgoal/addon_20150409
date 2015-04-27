$(function () {
	var ui = {
		save : function () {
			var data = {};
			UI_RESOURCE_MGR.UI[this.id].save(data);
			return UI_RESOURCE_MGR.UI[this.id].data;
		},
		load : function (data) {
			UI_RESOURCE_MGR.UI[this.id].reset(data);
		},
		init : function (pid, id, name, data, handlers) {
			this.id = id || 0;
			this.pid = pid || 0;
			this.pjq = $('#' + this.pid);
			this.name = name || '';
			this.data = data || {};
			this.handlers = handlers || {};
			if (this.pjq.length) {
				UI_RESOURCE_MGR.INIT_UI(this.pid, this.pjq, this.id, this.name, this.data, this.create_funcs[0], this.handlers);
			} else {
				alert('pid:' + this.pid);
			}
		},
		create_funcs : [function (id, data) {
				var a = $('<div></div>').attr('id', id).css('padding', '10px');//.css('border','1px red solid');
				var b1 = $('<div></div>').addClass('btn-group');
				if (this.handlers) {
					for (var i in this.handlers) {
						var handler = this.handlers[i];
						if (isFunction(handler)) {
							var c = $('<button></button>').text(i).click(handler).addClass('btn btn-default');
							c.appendTo(b1);
						}
					}
				}
				b1.appendTo(a);
			/* 	b1.after('<hr>'); */
				var b2 = $('<div></div>');
				var c = $('<ul></ul>').addClass('pagination');
				c.appendTo(b2);
				b2.appendTo(a);
				/* b2.after('<hr>'); */
				var b3 = $('<div></div>').addClass("tab-content");
				b3.appendTo(a);
				var name = 'res';
				if (data[name]) {
					for (var i in data[name]) {
						var tid = this.nextID();
						UI_RESOURCE_MGR.INIT_UI(id, b3, tid, name, data[name][i], ui.create_funcs[1]);
						var tab_name = 'fake_' + name;
						var tab_data = {
							name : tab_name,
							target : tid,
							keyword : data[name][i].keyword,
							sum : data[name][i].sum
						};
						UI_RESOURCE_MGR.INIT_UI(id, c, 0, tab_name, tab_data, ui.create_funcs[3]);
					}
				}
				return a;
			}, function (id, data) {
				var a = $('<div></div>').attr('id', id).css('border', '1px  solid').css('border-radius', '4px').css('padding', '10px').css('borderTopWidth', '20px').css('position', 'relative').addClass("tab-pane fade");
				var max = data['max'] || 0;
				var len = data['len'] || 0;
				var sum = data['sum'] || 0;
				var keyword = data['keyword'] || 0;
				var b1 = $('<div></div>').css('position', 'absolute').css('top', '-20px').css('color', 'white').text(decodeURI(keyword));
				b1.appendTo(a);
				var b2 = $('<div></div>');
				b2.appendTo(a);
				var name = 'data';
				if (data[name]) {
					for (var i = 0; i < data[name].length; i++) {
						UI_RESOURCE_MGR.INIT_UI(id, b2, this.nextID(), name, data[name][i], ui.create_funcs[2]);
					}
				}
				return a;
			}, function (id, data) {
				var a = $('<div></div>').attr('id', id).css('marginBottom', '10px');
				var name = data['name'] || 0;
				var download = data['download'] || 0;
				var size = data['size'] || 0;
				var b = $('<a></a>').text(name).attr('href', download).attr('title', size).attr('target', '_blank');
				if (/magnet:\?xt=urn:btih:[a-zA-Z0-9]{32}/.test(download)) {
					b.css('color', 'gray');
				}
				b.appendTo(a);
				return a;
			}, function (id, data) {
				var tid = data.target;
				var keyword = decodeURI(data.keyword);
				var sum = data.sum;
				var a = $('<li></li>');
				var b = $('<a></a>').text(keyword).attr('href', '#' + tid).attr('data-toggle', 'tab');
				var c = $('<span></span>').text(sum).addClass('badge');
				c.appendTo(b);
				b.appendTo(a);
				return a;
			}
		],
	};
	var mod = {
		TAG : 'popup page',
		init : function () {
			var t = MODULE_MAPS[2];
			MODULE.INIT(this, t.id, t.name, t.desc, t.events);
			ui.init('content', 'res', 'res', {}, handlers);
			this.load_res();
		},
		load_res : function () {
			this.fire('load', '', this.on_load_res);
		},
		on_load_res : function (res) {
			var data = {
				tag : 'res',
				res : res['data']
			};
			ui.load(data);
		},
		save_res : function (res) {
			this.fire('save', res, this.on_save_res);
		},
		on_save_res : function (data) {
			alert(JSON.stringify(data));
		}
	};
	var handlers = {
		save : function () {
			var data = ui.save();
			mod.save_res(data.res);
			alert(JSON.stringify(data));
		},
		load : function () {
			mod.load_res();
		},
		download : function () {
			alert('download');
		}
	};
	mod.init();
})
