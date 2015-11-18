$(function () {
	var setup = function (keyword) {
		var hacker_area = $('<div></div>').css('position', 'fixed').css('right', '10px').css('top', '30%').css('width', '160px').css('backgroundColor', 'red').css('zIndex', '100');
		var txt = $('<textarea></textarea>').css('display', 'inline-block').css('max-width', '128px').val(keyword);
		txt.appendTo(hacker_area);
		var btn = $('<button></button>').css('float', 'right').text('S');
		btn.click(function () {
			alert(txt.val());
		});

		btn.appendTo(hacker_area);

		hacker_area.appendTo($('body'));

		btn.zclip({
			path : chrome.extension.getURL('/res/ZeroClipboard.swf'),
			copy : function () {
				
				alert('copy');

				return 'test';
			}

		});
		return txt;
	};
	var get_data = function (s, v) {
		var data = '空';
		if (s) {
			var str = v.replace(/\s+/g, '');
			if (/^attr:(\S+)$/.exec(str)) {
				data = $(s).attr(/^attr:(\S+)$/.exec(str)[1]);
			} else if
			(/^prop:(\S+)$/.exec(str)) {
				data = $(s).prop(/^prop:(\S+)$/.exec(str)[1]);
			} else if
			(/^text$/.exec(str)) {
				data = $(s).text();
			}
		}
		return isString(data) ? data.replace(/\n/g, '') : '空';
	}
	var is_magnet = function (url) {
		return /magnet:\?xt=urn:btih:[a-zA-Z0-9]{32}/.test(url);

	}

	var get_magnet_list = function (site) {

		var max = site['max'];

		var sum = $(site['patterns'][0]['selector']).length;

		var len = sum; //(sum>max)?max:sum;
		var data = [];
		for (var j = 0; j < len; j++) {
			for (var k = 0; k < site['patterns'].length; k++) {
				var selector = site['patterns'][k]['selector'];
				var key = site['patterns'][k]['key'];
				var value = site['patterns'][k]['value'];
				value = get_data($(selector)[j], value);
				if (is_magnet(value)) {
					data[j] = value;
					break;
				}
			}
		}
		return data;
	}

	var array2str = function (list) {
		var str = '';
		for (var i in list) {
			str += list[i] + '\r\n';

		}
		return str;

	}
	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

		var magnet_list = get_magnet_list(request.rule);

		setup(request.keyword).val(array2str(magnet_list));

	
	//	window.copy(array2str(magnet_list));
			alert('test');
		sendResponse('ok');
	});

});
