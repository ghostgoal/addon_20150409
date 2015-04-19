$(function () {
	var handlers = {
		push : function () {},
		pull : function () {},
		load : function () {},
		download : function () {}

	};
	var patterns = {
		a : '<div></div>',
		a_t : '<a></a>',
		b : '<div></div>',
		c : '<a></a>'
	};
	var op = function () {
		this.mouseover(function () {});
	};
	var search = function (s, k, cb) {
		var so = JSON.parse(s),
		r,
		p;
		p = new RegExp(k);
		for (var i in so) {
			if (p.test(i)) {
				k = i;
				r = so[i]
					break;
			}
		}
		r && cb(k, r);
		return r || false;
	}
	var load = function (s) {
		var so = JSON.parse(s);
		var d = $('.content #history');
		d.html("");
		for (var i in so) {
			var t = $("<a></a>");
			t.addClass("ui_a_t");
			t.text(i);
			var c = $('<div></div>');
			c.addClass("ui_a");
			var m = $('<div></div>');
			var m_c = $('<a>X</a>');
			m_c.click(function () {
				$(this).parent().parent().css("display", "none");
			})
			m_c.appendTo(m);
			m.appendTo(c);
			m.addClass('ui_a_m');
			t.appendTo(c);
			c.appendTo(d);
			var index = 0;
			for (var j in so[i]) {
				var b = $('<div></div>');
				b.addClass("ui_b");
				b.addClass("clearfix");
				b.appendTo(c);
				for (var k in so[i][j]) {
					index += 1;
					var a = $('<a target="_blank"></a>');
					a.attr('href', so[i][j][k]);
					a.text(index);
					a.attr('title', so[i][j][k]);
					a.addClass("ui_c");
					a.appendTo(b);
					op.call(a);
				}
			}
		}
	}
	$(".menu #search").click(function () {
		var kw = $('.menu #kw').val();
		$('.menu #kw').val(encodeURIComponent(kw));
		kw && chrome.extension.sendRequest({
			act : "grab",
			keyword : kw
		}, function (s) {});
	});
	$(".menu #sync").click(function () {
		chrome.extension.sendRequest({
			act : "sync"
		}, function (s) {
			$(".content #sync").load("http://192.168.1.128/robot/zclip/index.php", {
				data : s.data
			});
		});
	});
	var test = function (so) {
		try {
			var a = $('.content #test');
			a.html('');
			var b_m = $('<ul class="pagination"></ul>');
			var b_c = $('<div class="tab-content"></div>');
			var index = 0;
			for (var i in so) {
				var id = "test_" + index;
				var c_c = $('<div class="tab-pane fade"></div>');
				c_c.attr("id", id);
				var num = 0;
				for (var j in so[i]) {
					for (var k in so[i][j]) {
						var d = $('<a></a>');
						var url = so[i][j][k];
						d.attr('href', url).attr('target', '_blank').attr('title', url).text(url);
						d.css('border-radius', '4px');
						/^magnet:\?xt=urn:btih:/.test(url) ? d.css('background-color', 'yellow') : d.css('background-color', 'blue');
						d.appendTo(c_c);
						d.after('<br>');
						num += 1;
					}
				}
				c_c.appendTo(b_c);
				var c_m = $('<li><a></a></li>');
				c_m.find('a').text(i).attr("href", '#' + id).attr("data-toggle", "tab").append('<span class="badge"></span>').find('span').text(num);
				c_m.appendTo(b_m);
				index += 1;
			}
			b_m.appendTo(a);
			b_c.appendTo(a);
		} catch (e) {
			alert(e);
		}
	}
	$(".menu #load").click(function () {
		chrome.extension.sendRequest({
			act : "dump"
		}, function (s) {
			var so = JSON.parse(s) || {};
			test(so);
		});
	}).click();
	var upload = function (url, data) {
		/* $(".content #sync").load(url, {
		act : 'upload',
		data : data
		}); */

		$.post(url, {
			act : 'upload',
			data : data
		}, function (d) {

			var a = $('.content #sync');
			a.html('');

			/* alert(d); */
			JSON.parse(d, function (k, v) {

				var fmt = '<a></a>';
				var b = $(fmt);
				b.text(k);

				b.attr('href', k);
				b.attr('target', '_blank');
				b.css('border-radius', '4px');
				b.css('border', '1px solid black');
				b.attr('title', k);
				b.css('display', 'block');
				b.css('margin-bottom', '10px');
				if (v) {
					b.css('color', 'green');
				} else {
					b.css('color', 'red');
				}
				b.appendTo(a);
				/* b.after('<br>'); */
				/* alert(k); */
				return v;
			});

		}).error(function (x, t, e) {

			var a = $('.content #sync');

			a.html(url);

		});

	}
	$(".menu #upload").click(function () {
		chrome.extension.sendRequest({
			act : "sync"
		}, function (s) {
			var url = "http://192.168.1.128/addon/index.php";
			upload(url, s.data);
		});
	})

	var download = function (data) {

		var so = JSON.parse(data);

		var r = $('.content #history');
		r.html('');
		var a_c = $('<div></div>');
		a_c.appendTo(r);

		var a_m = $('<div class="btn-group"></div>');

		a_m.appendTo(r);

		var b_m = $('<button type="button" class="btn btn-default"></button>');
		b_m.text('全选').appendTo(a_m).click(function () {
			$('.content #history input').each(function () {
				$(this).prop('checked', true);
			});

		});

		b_m = $('<button type="button" class="btn btn-default"></button>');
		b_m.text('反选').appendTo(a_m).click(function () {
			$('.content #history input').each(function () {
				if ($(this).prop('checked')) {
					$(this).prop('checked', false);
				} else {
					$(this).prop('checked', true);
				}
			});

		});
		b_m = $('<button type="button" class="btn btn-default"></button>');
		b_m.text('下载').appendTo(a_m).click(function () {

			var dl = [];

			$('.content #history input').each(function () {
				if ($(this).prop('checked')) {

					var dlc = {};

					dlc.url = $(this).parent().attr('title');
					dlc.keyword = $(this).parent().text();
					dl.push(dlc);

				}

			});
			$.post("http://192.168.1.128/addon/index.php", {
				act : 'download',
				data : JSON.stringify(dl)
			}, function (d) {
				alert(d);
			});
			
			/* alert("Hello World!"); */
		});

		for (var i in so) {

			for (var j in so[i]) {

				for (var k in so[i][j]) {
					var b = $('<input type="checkbox"></input>');
					b.css('position', 'absolute').css('right', '6px');
					$('<div></div>').text(i).attr('title', so[i][j][k]).css('display', 'block').css('position', 'relative').css('border', '1px solid black').css('margin', '0px 10px 10px 10px').css("border-radius", "4px").append(b).appendTo(a_c);
				}
			}
		}
	}

	$('.menu #download').click(
		function () {
		chrome.extension.sendRequest({
			act : "sync"
		}, function (s) {
			download(s.data);
		});
	})
})
