var test = {
	m_modal_opts : [{
			id : 'test_m',
			init : function (id, on_save) {
				$('#' + id).find('.test-ok').click(on_save);
			},
			save : function (id, ui) {
				var max = $('#' + id).find('#test-max').val();
				var url = $('#' + id).find('#test-url').val();
				var desc = $('#' + id).find('#test-desc').val();
				var enable = $('#' + id).find('#test-enable').prop('checked');
				var data = {
					max : max,
					url : url,
					desc : desc,
					enable : enable
				};
				ui.save(data);
			},
			load : function (id, ui) {
				var data = ui.data;
				var max = $('#' + id).find('#test-max').val(data['max'] || 3);
				var url = $('#' + id).find('#test-url').val(data['url'] || 'http://video.yaodaojiao.com/article/3120.shtml');
				var desc = $('#' + id).find('#test-desc').val(data['desc'] || '视频网站');
				var enable = $('#' + id).find('#test-enable').prop('checked', data['enable'] || false);
			}
		}, {
			id : 'test_m2',
			init : function (id, on_save) {
				$('#' + id).find('.test-ok').click(on_save);
			},
			save : function (id, ui) {
				var s = $('#' + id).find('#test-s').val();
				var n = $('#' + id).find('#test-n').val();
				var v = $('#' + id).find('#test-v').val();
				var data = {
					selector : s,
					key : n,
					value : v
				};
				ui.save(data);
				$('#' + ui.id).css('backgroundColor', 'white');
			},
			load : function (id, ui) {
				$('#' + ui.id).css('backgroundColor', 'gray');
				var data = ui.data;
				$('#' + id).find('#test-s').val(data['selector'] || 0);
				
			
				$('#' + id).find('#test-n').val(data['key'] || 0);
				$('#' + id).find('#test-v').val(data['value'] || 0);
			}
		},
		{
			id:'test_m3',
			
			init:function (id,on_save)
			{
			  $('#' + id).find('.test-ok').click(on_save);
			},
			
			save:function (id,ui)
			{
				var data = {addr:$('#' + id).find('#test-addr').val(),
				username:$('#' + id).find('#test-username').val(),
				password:$('#' + id).find('#test-password').val()};
				ui.save(data);
			  
			},
			load:function (id,ui)
			{
			
				var data = ui.data;
				$('#' + id).find('#test-addr').val(data['addr'] || 0);
				$('#' + id).find('#test-username').val(data['username'] || 0);
				$('#' + id).find('#test-password').val(data['password'] || 0);
			}
			
			
			
		}
	],
	m_ui_creates : [function (id, data) {
			var a = $('<div></div>').attr('id', id).addClass('clearfix');
			UI_RESOURCE_MGR.INIT_MENU(a, {
				mid : 'test_m',
				uid : id,
				on : true
			});
			var c1 = $('<a></a>').text(data['url'] || '网址').css('display', 'block');
			var c2 = $('<a></a>').text(data['max'] || '上限').css('display', 'block');
			var c3 = $('<a></a>').text(data['desc'] || '描述').css('display', 'block');
			var c4 = $('<a></a>').text(data['enable'] || '激活').css('display', 'block');
			c1.appendTo(a);
			c2.appendTo(a);
			c3.appendTo(a);
			c4.appendTo(a);
			var b = $('<div></div>').css('padding', '10px').css('overflow-x','scroll');
			
				var b1 = $('<div></div>').css('width', '9999px').css('padding', '10px');
				b1.appendTo(b);
			
			
			b.appendTo(a);
			if (data['patterns']) {
				for (var i = 0; i < data['patterns'].length; i++)
					UI_RESOURCE_MGR.INIT_UI(id, b1, this.nextID(), 'patterns', data['patterns'][i], test.c2);
			} else {
				UI_RESOURCE_MGR.INIT_UI(id, b1, this.nextID(), 'patterns', {}, test.c2);
			}
			return a;
		}
	],
	c2 : function (id, data) {
		var a = $('<div></div>').attr('id', id).css('marginBottom', '10px').css('float','left').css('min-width','200px').css('marginLeft','10px');
		UI_RESOURCE_MGR.INIT_MENU(a, {
			mid : 'test_m2',
			uid : id,
			on : true
		});
		var s = data['selector'] || 0;
		var n = data['key'] || 0;
		var v = data['value'] || 0;
		var b1 = $('<div>test ui 3333</div>').text(s);
		var b2 = $('<div>test ui 3333</div>').text(n);
		var b3 = $('<div>test ui 3333</div>').text(v);
		b1.appendTo(a);
		b2.appendTo(a);
		b3.appendTo(a);
		return a;
	},
	c4 : function (id, data) {
		var a = $('<div></div>').attr('id', id);
		UI_RESOURCE_MGR.INIT_MENU(a, {
			mid : 'test_m3',
			uid : id,
			on : false
		});
		var addr = data['addr'] || 'addr';
		var username = data['username'] || 'username';
		var password = data['password'] || 'password';
		var b1 = $('<div></div>').text(addr);
		var b2 = $('<div></div>').text(username);
		var b3 = $('<div></div>').text(password);
		b1.appendTo(a);
		b2.appendTo(a);
		b3.appendTo(a);
		return a;
	},
	c3 : function (id, data) {
		var a = $('<div></div>').attr('id', id);
		var name = 'server_info';
		if (data[name]) {
			for (var i = 0; i < data[name].length; i++) {
				UI_RESOURCE_MGR.INIT_UI(id, a, this.nextID(), name, data[name][i], test.c4);
			}
		}
		name = 'sites';
		if (data[name]) {
			for (var i = 0; i < data[name].length; i++) {
				UI_RESOURCE_MGR.INIT_UI(id, a, this.nextID(), name, data[name][i], test.m_ui_creates[0]);
			}
		}
		return a;
	},
	init : function () {
		for (var i = 0; i < this.m_modal_opts.length; i++) {
			UI_RESOURCE_MGR.INIT_MODAL(this.m_modal_opts[i]);
		}
		var data = {
			patterns : [{
					v : '3',
					n : '33',
					s : '32'
				}
			]
		};
		UI_RESOURCE_MGR.INIT_UI('test_ui', $('#test_ui'), 'test_ui_s_1', 'settings', data, test.c3);
	}
}
test.init();
var ui = {
	TAG : 'UI',
	settings : {},
	ids : ['save_config', 'default_config'],
	init : function () {
		mod = MODULE_MAPS[0];
		MODULE.INIT(this, mod.id, mod.name, mod.desc, mod.events);
		$('#' + this.ids[0]).click(function () {
			ui.save();
		});
		$('#' + this.ids[1]).click(function () {
			ui.reset();
		});
	},
	load : function () {
		this.fire('load', '', this.on_load);
	},
	on_load : function (settings) {
		ui.settings = settings;
		var data = ui.settings;
		var uio = UI_RESOURCE_MGR.UI['test_ui_s_1'];
		uio.reset(data)
	},
	save : function () {
		var uio = UI_RESOURCE_MGR.UI['test_ui_s_1'];
		uio.save(uio.data);
		this.settings = uio.load(); ;
		this.fire('save', this.settings, this.on_save);
	},
	on_save : function (data) {
		alert(JSON.stringify(data));
		alert(ui.id);
	},
	reset : function () {
		this.fire('reset', '', this.on_reset);
	},
	on_reset : function (settings) {
		ui.settings = settings;
		var data = ui.settings;
		var uio = UI_RESOURCE_MGR.UI['test_ui_s_1'];
		uio.reset(data);
	}
};
ui.init();
ui.load();
