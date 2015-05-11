$(function () {
	var ui = {
		init : function (pid, id, name, data, handlers) {
			this.id = id || 0;
			this.pid = pid || 0;
			this.pjq = $('#' + this.pid);
			this.name = name || '';
			this.data = data || {};
			this.handlers = handlers || {};
			if (this.pjq.length) {
				UI_RESOURCE_MGR.INIT_UI(this.pid, this.pjq, this.id, this.name, this.data, this.create, this.handlers);
			} else {
				alert('pid:' + this.pid);
			}
		},
		reset : function (data) {
			UI_RESOURCE_MGR.UI[this.id].reset(data);
		},
		create : function (id, data) {
			var a = $('<div></div>').attr('id', id);

			//工具栏
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
			var homepage = data;
			if (homepage.ready) {
				//内容显示
				var b2 = $('<div></div>').css('padding', '10px');
				for (var i = homepage.get_start_page(); i < homepage.get_end_page(); i++) {
					var url = homepage.data[i];
					var c = $('<a></a>').text(url['FILENAME']).attr('href', 'http://192.168.1.128' + url['NAME']).attr('target', '_blank').attr('res_id', url['ID']).attr('title', url['NAME']).css('display', 'block').css('border', '1px blue solid').css('marginBottom', '10px').css('border-radius', '4px').css('padding', '6px 12px 6px 12px').css('textDecoration', 'none');
					c.appendTo(b2);
				}
				b2.appendTo(a);

				//内容索引
				var b3 = $('<ul class="pagination pagination-sm"></ul>').css('padding', '10px');
				var c1 = $('<li><a>&laquo;</a></li>').appendTo(b3).find('a').click(function () {
						homepage.prev();
					});
				for (var j = homepage.page_start; j < Math.ceil(homepage.page_end / homepage.page_size); j++) {
					var c2 = $('<li></li>');
					var d = $('<a></a>').text(j + 1).attr('page', j).click(function () {
							homepage.select(parseInt($(this).attr('page')));
						});
					d.appendTo(c2);
					c2.appendTo(b3);
					if (j == homepage.page_index) {
						c2.addClass('active');
					}
				}
				var c3 = $('<li></li>');
				var d3 = $('<a>&raquo;</a>').click(function () {
						homepage.next();
					});
				d3.appendTo(c3);
				c3.appendTo(b3);
				b3.appendTo(a);
			}
			return a;
		}
	}
	var mod = {
		init : function () {
			var t = MODULE_MAPS[3];
			MODULE.INIT(this, t.id, t.name, t.desc, t.events);
			this.config = {};
			this.ready = false;
			this.load();
		},
		load : function () {
			this.fire('load', '', this.onLoad);
		},
		onLoad : function (data) {
			mod.ready = false;
			if (data) {
				mod.config = data.server_info[0];
				mod.ready = true;
			}
		},
		login : function () {
			if (this.ready) {
				var url = this.config.addr;
				var data = {
					username : this.config.username || 'guest',
					password : this.config.password || '1234356',
					act : 'login'
				}
				$.ajax({
					type : 'POST',
					url : url,
					data : data,
					complete : this.onLogin
				})
			} else {
				alert('Not ready to login!')
			}
		},
		onLogin : function (XMLHttpRequest, textStatus) {
			if (XMLHttpRequest.readyState == 4) {
				alert(XMLHttpRequest.responseText);
			} else {
				alert(JSON.stringify(XMLHttpRequest));
			}
		},
		index : function () {
			if (this.ready) {
				var url = this.config.addr;
				var data = {
					act : 'index'
				}
				$.ajax({
					type : 'POST',
					url : url,
					data : data,
					complete : this.onIndex
				})
			} else {
				alert('Not ready to login!')
			}
		},
		homepage : {
			ready : false,
			data : {},
			page_start : 0,
			page_end : 0,
			page_size : 10,
			page_index : 0,
			select : function (index) {
				if (this.ready) {
					this.page_index = index;
					ui.reset(this);
				}
			},
			next : function () {
				if (this.ready) {
					this.page_index += 1;
					if ((this.page_index * this.page_size) > this.page_end)
						this.page_index = 0;
					ui.reset(this);
				}
			},
			prev : function () {
				if (this.ready) {
					this.page_index -= 1;
					if (this.page_index < 0)
						this.page_index = Math.floor(this.page_end / this.page_size);
					ui.reset(this);
				}
			},
			get_start_page : function () {
				return this.page_index * this.page_size;
			},
			get_end_page : function () {
				return ((this.page_index + 1) * this.page_size > this.page_end) ? this.page_end : ((this.page_index + 1) * this.page_size);
			}
		},
		onIndex : function (XMLHttpRequest, textStatus) {
			if (XMLHttpRequest.readyState == 4) {
				var data = JSON.parse(XMLHttpRequest.responseText).data;
				if (isObject(data) && (data.pages >= 1)) {
					var homepage = mod.homepage;
					homepage.ready = true;
					homepage.data = data.index;
					homepage.page_start = homepage.page_index = 0;
					homepage.page_end = data.index.length;
					ui.reset(homepage);
				} else {
					alert('Invalid homepage!');
				}
			} else {
				alert(JSON.stringify(XMLHttpRequest));
			}
		},
		search : function () {
			if (this.ready) {
				
			/* 	alert( $('#search_bar input').val()); */
				var url = this.config.addr;
				var data = {
					act : 'search',
					keyword : $('#search_bar input').val()
				}
				$.ajax({
					type : 'POST',
					url : url,
					data : data,
					complete : this.onSearch
				})
			} else {
				alert('Not ready to search!')
			}
		},
		onSearch : function (XMLHttpRequest, textStatus) {
			if (XMLHttpRequest.readyState == 4) {
				var data = JSON.parse(XMLHttpRequest.responseText).data;
				if (isObject(data) && (data.pages >= 1)) {
					var homepage = mod.homepage;
					homepage.ready = true;
					homepage.data = data.search;
					homepage.page_start = homepage.page_index = 0;
					homepage.page_end = homepage.data.length;
					
					ui.reset(homepage);
				} else {
					alert(XMLHttpRequest.responseText);
				}
			} else {
				alert(JSON.stringify(XMLHttpRequest));
			}
		},
		next : function () {
			mod.homepage.next();
		},
		prev : function () {
			mod.homepage.prev();
		}
	};
	var handlers = {
		login : function () {
			mod.login();
		},
		reload : function () {
			mod.load();
		},
		index : function () {
			mod.index();
		},
		search : function () {
			mod.search();
		},
	};
	ui.init('content', 'res', 'res', {}, handlers);
	mod.init();
	
	$('#search_bar form').submit(function ()
	{
	  return false;
	}
	);
	

	/* for(var i in $('#search_bar input')[0])
	{
		console.log(i,':',+$('#search_bar input')[0][i]);
	}; */
})
