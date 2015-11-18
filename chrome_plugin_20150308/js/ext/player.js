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
			var a = $('<div></div>').attr('id', id);//.css('border', '1px black solid');
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
				//
				
				var player_area = $('<div></div>').css('border', '1px black solid').css('padding','10px').css('border-radius', '4px').css('position','relative').css('width',"100%").css('marginTop','54px').css('marginBottom','200px').css("backgroundColor",'black');
				var player  = $('<video></diveo>').attr("controls","controls").attr("autoplay","autoplay").css("width","80%");
				player.appendTo(player_area);
				player_area.appendTo(a);
				
				
				//
				
				var player_list_area = $('<div></div>').css('width','20%').css('position','absolute').css('top','0px').css('right','0px').css('overflow-y','scroll').css('height','100%');
				var b2 = $('<div></div>').css('padding', '10px')
				for (var i = homepage.get_page_start(); i < homepage.get_page_end(); i++) {
					var url = homepage.data[i];
					var c = $('<a></a>').text(url['FILENAME']).attr('url', 'http://10.0.0.128' + url['NAME']).attr('res_id', url['ID']).attr('title', url['NAME']).css('display', 'block').css('border', '1px blue solid').css('marginBottom', '10px').css('border-radius', '4px').css('padding', '6px 12px 6px 12px').css('textDecoration', 'none').css('cursor','pointer');//.attr('target', '_blank');
					c.appendTo(b2);
					
					c.click(function(){
						var src = $(this).attr('url');
					//	alert();
						
						player.attr('src',src);
					})
				}
				b2.appendTo(player_list_area);
				
				player_list_area.appendTo(player_area);
				
				
				//
				var player_page_area = $('<div></div>').css('position','absolute').css('top','100%').css('right','0px');
				var b3 = $('<ul class="pagination pagination-sm"></ul>').css('padding', '10px');
				var c1 = $('<li><a>&laquo;</a></li>').appendTo(b3).find('a').click(function () {
						homepage.prev();
					});
				for (var j = 0; j < homepage.pages; j++) {
					var c2 = $('<li></li>');
					var d = $('<a></a>').text(j + 1).attr('page', j).css('cursor','pointer').click(function () {
							homepage.select(parseInt($(this).attr('page')));
						});
					d.appendTo(c2);
					c2.appendTo(b3);
					if (j == homepage.page) {
						c2.addClass('active');
					}
				}
				var c3 = $('<li></li>');
				var d3 = $('<a>&raquo;</a>').click(function () {
						homepage.next();
					});
				d3.appendTo(c3);
				c3.appendTo(b3);
				b3.appendTo(player_page_area);
				
				player_page_area.appendTo(player_area);
				
				//搜索栏
				var player_search_bar_area = $('<div></div>').css('position','absolute').css('top','-44px').css('right','0px').css('width','20%');
				
				var player_search_bar = $('<div></div>').css('position','relative');
				player_search_bar.attr('id','search_bar');
				
				//
				var txt= $('<input></input>').css('min-width','100%').addClass("form-control");
				txt.appendTo(player_search_bar);
				
				//
				var btn = $('<a></a>').css('position','absolute').css('top','0px').css('right','0px').addClass("btn btn-default").html("<span class=\"glyphicon glyphicon-search\"></span>");
				btn.click(this.handlers['search']);
				
				btn.appendTo(player_search_bar);
				
				//btn.hover(function(){player_list_area.show();},function(){player_list_area.hide();});
				//
				player_search_bar.appendTo(player_search_bar_area);
				player_search_bar_area.prependTo(player_area);
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
		index : function (page) {
			if (this.ready) {
				var url = this.config.addr;
				var data = {
					act : 'index',
					page : page
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
			pages : 0,
			data : {},
			page : 0,
			page_size : 10,
			act : 'index',
			do_handle : function (page) {
				switch (this.act) {
				case 'index':
					mod.index(page);
					break;
				case 'search':
					mod.search(page);
					break;
				}
			},
			next : function () {
				var page = (this.page + 1 < this.pages) ? (this.page + 1) : 0;

				this.do_handle(page);
			},
			prev : function () {
				var page = (this.page > 0) ? (this.page - 1) : (this.pages - 1);

				this.do_handle(page);
			},
			select : function (page) {
				this.do_handle(page);
			//	alert(page);
			},
			get_page_start : function () {
				return 0;
			},
			get_page_end : function () {
				return this.data.length;
			}

		},
		onIndex : function (XMLHttpRequest, textStatus) {
			if (XMLHttpRequest.readyState == 4) {
				var data = JSON.parse(XMLHttpRequest.responseText).data;
				if (isObject(data) && (data.pages >= 1)) {
					/* var homepage = mod.homepage;
					homepage.ready = true;
					homepage.data = data.index;
					homepage.page_start = homepage.page_index = 0;
					homepage.page_end = data.index.length;
					ui.reset(homepage); */

					var homepage = mod.homepage;
					homepage.ready = true;
					homepage.act = 'index';
					homepage.data = data.index;
					homepage.pages = data.pages;
					homepage.page = data.page;
					homepage.page_size = data.page_size;
					ui.reset(homepage);

				} else {
					alert('Invalid homepage!');
				}
			} else {
				alert(JSON.stringify(XMLHttpRequest));
			}
		},
		search : function (page) {
			if (this.ready) {
				
				
				
				
				
			
			//	alert(mod.homepage.keyword);
				var url = this.config.addr;
				var data = {
					act : 'search',
					page : page,
					keyword :mod.homepage.keyword
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
					homepage.act = 'search';
					homepage.data = data.search;
					homepage.pages = data.pages;
					homepage.page = data.page;
					homepage.page_size = data.page_size;
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
			mod.index(0);
		},
		search : function () {
			
			
			var keyword = $('#search_bar input').val();
			
				mod.homepage.keyword = keyword ? keyword : mod.homepage.keyword;
			
			mod.search(0);
		},
	};
	ui.init('video_player_area', 'res', 'res', {}, handlers);
	mod.init();
	$('#search_bar form').submit(function () {
		return false;
	});
})
