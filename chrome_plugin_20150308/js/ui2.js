var ops = function (target, act) {
	var target = target;
	var handlers = act;
	this.extend = function (h) {
		for (var i in h) {
			if (handlers[i]) {
				handlers[i] = h[i];
			}
		}
	};
	this.invoke = function (act, data) {
		cb = handlers[act] || false;
		if (cb) {
			chrome.extension.sendRequest({
				target : target,
				act : act,
				data : data
			}, cb);
		}
	};
}
var ui = {
	wrapper : '',
	menu : '',
	content : '',
	id : 'test_',
	load_menu : function () {
		/* $('<button>下载</button>').appendTo(this.menu); */
	},
	init : function (p) {
		p.html('');
		this.wrapper = $('<div></div>').attr('id', 'ui_wrapper').appendTo(p).css("width","500px");
		this.menu = $('<div></div>').addClass('ui_menu').appendTo(this.wrapper).addClass('clearfix');
		this.content = $('<div></div>').addClass('ui_content').appendTo(this.wrapper).addClass('tab-content');
		this.load_menu();
	},
	load_content : function (res) {
		var len = res.length;
		for (var i = 0; i < len; i++) {
			var id = this.id + i;
			var kw = decodeURI(res[i]['kw']);
			var a_m = $('<a></a>');
			a_m.text(kw);
			a_m.appendTo(this.menu);
			a_m.attr('data-toggle','tab');
			a_m.attr('href','#'+id);
			a_m.css('float','left');
			a_m.css('border','1px solid red').css('border-radius','4px').css('margin','0px 0px 10px 10px');
			
			
			var a_c = $('<div></div>');
			a_c.attr('id', id);
			a_c.addClass('tab-pane fade');
			a_c.appendTo(this.content);
			for (var j in res[i]['data']) {
				var name = res[i]['data'][j]['name'];
				var download = res[i]['data'][j]['download'];
				var size = res[i]['data'][j]['size'];
				var b_c = $('<a></a>');
				b_c.attr('target','_blank');
				b_c.attr('href', download);
				b_c.text(name);
				b_c.attr('title', size);
				b_c.appendTo(a_c);
				b_c.css('display','block');
				b_c.after('<hr>');
			}
		}
	},
};
$(function () {
	var sys_ops = new ops('sys', {
			dump : function (data) {
				/* alert(JSON.stringify(data)); */
				ui.load_content(data.res);
			}
		}),
	rpc_ops = new ops('rpc', {
			load : function () {
				alert("load");
			}
		});
	$('#dump').click(function () {
		sys_ops.invoke('dump', null);
	})
	ui.init($('#content'));
});
