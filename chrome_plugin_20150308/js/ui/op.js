var test = {
	m_modal_opts : [{
			id : 'test_m',
			init : function (id, on_save) {
				$('#' + id).find('.test-ok').click(on_save);
			},
			save : function (id, ui) {
				var data = {};
				
				
				ui.save(data);
			},
			load : function (id, ui) {
				/* alert('on_load');
				alert(id+ui.id); */
			}
		}, {
			id : 'test_m2',
			init : function (id, on_save) {
				$('#' + id).find('.test-ok').click(on_save);
			},
			save : function (id, ui) {
				
			var s = $('#'+id).find('#test-s').val();
			var n = $('#'+id).find('#test-n').val();
			var v = $('#'+id).find('#test-v').val();

			var data = {s:s,n:n,v:v};
			
		/* 	alert(data); */
			
			ui.save(data);
			
			$('#'+ui.id).css('backgroundColor','white');
			},
			load : function (id, ui) {
				
			$('#'+ui.id).css('backgroundColor','gray');
			
			}
		}
	],
	m_ui_creates : [function (id, data) {
			var a = $('<div>test ui</div>').attr('id', id);
			UI_RESOURCE_MGR.INIT_MENU(a, {
				mid : 'test_m',
				uid : id
			});
			
			var b = $('<div></div>').css('width','400px').css('border','1px red solid').css('padding','10px');
			
			b.appendTo(a);
			
		
			
			if(data['tt'])
			{
				for (var i = 0; i < data['tt'].length; i++)
				UI_RESOURCE_MGR.INIT_UI(id, b, id+'_' + i, 'tt', data['tt'][i], test.c2);
			}else{
				UI_RESOURCE_MGR.INIT_UI(id, b, id+'_0' , 'tt', {}, test.c2);
				
			}
			
			
			return a;
		}
	],
	c2 : function (id, data) {
		var a = $('<div></div>').attr('id', id).css('marginBottom','10px');
		UI_RESOURCE_MGR.INIT_MENU(a, {
			mid : 'test_m2',
			uid : id
		});
		
		var s = data['s'] || 0;
		var n =data ['n' ] || 0;
		var v = data['v'] || 0;
		
		var b1 = $('<div>test ui 3333</div>').text(s);
		var b2 = $('<div>test ui 3333</div>').text(n);
		var b3 =$('<div>test ui 3333</div>').text(v);
		
		b1.appendTo(a);
		b2.appendTo(a);
		b3.appendTo(a);
		
		
		return a;
	},
	init : function () {
		for (var i = 0; i < this.m_modal_opts.length; i++) {
			UI_RESOURCE_MGR.INIT_MODAL(this.m_modal_opts[i]);
		}
		var data = {tt:[{v:'3',n:'33',s:'32'}]};
		UI_RESOURCE_MGR.INIT_UI('test_ui', $('#test_ui'), 'test_ui_s_1', 'child', data, this.m_ui_creates[0]);
		
		
		$('#save_config').click(function ()
		{
		  /* alert(UI_RESOURCE_MGR.UI['test_ui_s_1'].dirty); */
		  var ui = UI_RESOURCE_MGR.UI['test_ui_s_1'];
		  ui.load();
		  alert(ui.id + JSON.stringify(ui.data));
		}
		);
		
		$('#default_config').click(function ()
		{
		  /* alert(UI_RESOURCE_MGR.UI['test_ui_s_1'].dirty); */
		  
		  
		  var data = {tt:[{v:'qqq',n:'3333',s:'333332'},{v:'qqq',n:'3333',s:'333332'}]};
		  
		  var ui = UI_RESOURCE_MGR.UI['test_ui_s_1'];
		  ui.reset(data);
		  
		  alert(ui.save);
		/*   alert(ui.id + JSON.stringify(ui.data)); */
		}
		);
		
		
	}
}
test.init();
var ui_sites = {
	id : "",
	init_modal : function (id, config) {
		var modal = $('#' + id);
		if (modal) {
			this.__init_modal.call(modal, config);
		}
	},
	__init_modal : function (config) {
		var ok = config && isFunction(config['ok']) && config['ok'] || function () {
			alert("ok");
		};
		$(this).find('div.modal-footer').find('.test-ok').click(ok);
	},
	init_menu : function (THIS, config) {
		this.__init_menu.call(THIS, config);
	},
	__init_menu : function (config) {
		$(this).css('position', 'relative').css('border', '1px black solid').css('border-radius', '4px').css('borderTopWidth', '32px');
		var menu = $('<div></div>').css('position', 'absolute').css('right', '6px').css('top', '-26px').css('border-radius', '4px');
		var close = $('<a></a>').css('float', 'right').css('cursor', 'pointer').css('textDecoration', 'none').css('marginLeft', '6px');
		close.append("<span class=\"glyphicon glyphicon-remove\"></span>");
		close.appendTo(menu);
		close.click(function () {
			if (confirm('确定删除？'))
				$(this).parent().parent().detach();
		});
		if (config && config['add']) {
			var add = $('<a></a>').css('float', 'right').css('cursor', 'pointer').css('textDecoration', 'none').css('marginLeft', '6px');
			add.append("<span class=\"glyphicon glyphicon-ok\"></span>");
			add.appendTo(menu);
			var modal = config['add'];
			add.click(function () {
				$(modal).modal();
			})
		}
		menu.appendTo($(this));
	},
	init : function (id) {
		this.id = id || "";
		this.init_modal('test_m2', {
			ok : function () {
				$('#' + ui_sites.id).append(ui_sites.new_site({
						max : 3,
						url : 'qq.com',
						patterns : [],
						desc : 'test',
						enable : false,
					}));
				alert("Hello World!");
			}
		});
	},
	site_init : function (url) {},
	new_site : function (site) {
		var b = $('<div></div>').addClass('clearfix');
		b.css('border', '1px black solid').css('border-radius', '4px').css('borderTopWidth', '32px').css('marginBottom', '10px').css('padding', '10px 10px 0px 10px');
		this.init_menu(b, {
			add : '#test_m'
		});
		var c_a = $('<a></a>').attr('href', site.url).attr('title', site.desc).text(site.url).attr('target', '_blank');
		var c_b = $('<input></input>').attr('type', 'checkbox').prop('checked', site.enable);
		var c_c = $('<div></div>').css('border', '1px black solid').css('border-radius', '4px').css('padding', '10px 10px 0px 10px').css('marginBottom', '10px').css('width', '400px').css('float', 'right');
		for (var j = 0; j < site.patterns.length; j++) {
			var pattern = site.patterns[j];
			this.new_pattern(pattern).appendTo(c_c);
		}
		c_a.appendTo(b);
		c_b.appendTo(b);
		c_c.appendTo(b);
		return b;
	},
	new_pattern : function (pattern) {
		var d = $('<div></div>').css('border', '1px black solid').css('border-radius', '4px').css('marginBottom', '10px').css('borderTopWidth', '20px').css('position', 'relative');
		this.init_menu(d, {
			add : '#test_m2'
		});
		var e_a = $('<div></div>').text('选择器：' + pattern.selector);
		var e_b = $('<div></div>').text('名称：' + pattern.name);
		var e_c = $('<div></div>').text('值：' + (pattern.type || pattern.attr || 'text'));
		e_a.appendTo(d);
		e_b.appendTo(d);
		e_c.appendTo(d);
		return d;
	},
	load : function (sites) {
		var a = $('<div></div>');
		a.attr('id', this.id);
		for (var i = 0; i < sites.length; i++) {
			var site = sites[i];
			this.new_site(site).appendTo(a);
		}
		return a;
	},
	save : function () {}

};
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
		if (ui.settings.sites) {
			ui_sites.init('ui_sites');
			$('#sites_settings').html(ui_sites.load(ui.settings.sites));
		} else {
			alert('no sites');
		}
	},
	save : function () {
		this.settings.sites = ui_sites.save();
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
		ui_sites.init('ui_sites');
		$('#sites_settings').html(ui_sites.load(ui.settings.sites));
	}
};
/* ui.init();
ui.load(); */
