$(function () {
	var url = window.location.href,
	ops;
	ops = {
		target : 'cs',
		handler : {
			save : function (data, cb) {
				chrome.extension.sendRequest({
					target : ops.target,
					act : 'save',
					data : data
				}, cb);
			},
			load : function (data, cb) {
				chrome.extension.sendRequest({
					target : ops.target,
					act : 'load',
					data : data
				}, cb);
			}
		},
		invoke : function (act, data, cb) {
			var fn = this.handler[act] || false;
			if (fn) {
				fn(data, cb);
			}
		}
	};
	ops.invoke('load', null, function (data) {
		for (var i in data) {
			var site = data[i];
			var k_index = url.indexOf(site['url']);
			if (k_index != -1) {

				k_index = site['url'].length;

				var kw = url.substr(k_index);
				var max = site.max;
				var p_len = site['patterns'].length;
				var len = $(site['patterns'][0]['selector']).length;
				var sum = len;
				len = len < max ? len : max;
				var result = [];
				for (var j = 0; j < len; j++) {
					var temp = {};
					for (var k = 0; k < p_len; k++) {
						var s = site['patterns'][k]['selector'];
						var n = site['patterns'][k]['name'];
						temp[n] = $($(s)[j]).text();
					}
					result[j] = temp;
				}
				ops.invoke('save', {
					kw : kw,
					len : len,
					sum : sum,
					data : result
				}, function () {
					alert("Hello World!");
				});
				alert(JSON.stringify(result));
				break;
			}
		}
	});
});
